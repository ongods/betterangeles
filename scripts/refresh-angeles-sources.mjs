import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { gzipSync } from 'node:zlib';

// Collect evidence only. Content replacement requires reviewing these sources.
const date = process.argv[2] || '2026-10-15';
if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
  throw new Error('Use a YYYY-MM-DD review date.');
}
const reference = 'content/reference/angeles-city';
const output = `${reference}/refresh-${date}`;
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');
const readJson = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const writeJson = (file, data) =>
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
const walk = directory =>
  fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const file = `${directory}/${entry.name}`;
    return entry.isDirectory() ? walk(file) : [file];
  });
fs.mkdirSync(`${output}/sources`, { recursive: true });
if (!fs.existsSync(`${output}/baseline-files.json`)) {
  const files = [
    ...walk('content/services'),
    ...walk('content/government'),
    ...fs
      .readdirSync(reference)
      .filter(f => /\.(json|yaml)$/.test(f))
      .map(f => `${reference}/${f}`),
  ];
  writeJson(
    `${output}/baseline-files.json`,
    files.map(file => ({
      file,
      sha256: sha256(fs.readFileSync(file)),
    }))
  );
}

const decode = value =>
  value
    .replace(/&#x([a-f0-9]+);/gi, (_, n) =>
      String.fromCodePoint(parseInt(n, 16))
    )
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&apos;|&#039;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
const plain = html =>
  decode(
    html
      .replace(/<(script|style|noscript)\b[^>]*>[\s\S]*?<\/\1>/gi, '')
      .replace(/<\/(p|div|h[1-6]|li|tr|section|article)>/gi, '\n')
      .replace(/<br\s*\/?\s*>/gi, '\n')
      .replace(/<[^>]+>/g, '')
  )
    .split('\n')
    .map(line => line.replace(/\s+/g, ' ').trim())
    .filter(Boolean)
    .join('\n');
const allowed = url => {
  const host = new URL(url).hostname;
  return (
    host === 'angelescity.gov.ph' ||
    host === 'www.angelescity.gov.ph' ||
    host === 'tourism.angelescity.gov.ph'
  );
};
const documents = readJson(`${reference}/source-manifest.json`).documents;
const datasets = Object.fromEntries(
  ['services', 'barangays', 'schools', 'tourism', 'news', 'council'].map(
    name => [name, readJson(`${reference}/${name}.json`)]
  )
);
const results = fs.existsSync(`${output}/crawl.json`)
  ? readJson(`${output}/crawl.json`).sources
  : [];
const seen = new Set(results.map(record => record.url));
const queue = [];
function enqueue(url, reason, extra = {}) {
  const normalized = new URL(url);
  normalized.hash = '';
  if (!allowed(normalized.href) || seen.has(normalized.href)) return;
  seen.add(normalized.href);
  queue.push({ url: normalized.href, reason, ...extra });
}
// Resume discovery from a previous collection without requesting its URLs again.
for (const source of results.filter(record =>
  /post-sitemap/.test(record.url)
)) {
  for (const entry of source.entries || []) {
    if (entry.last_modified >= '2026-08-11') enqueue(entry.url, 'current-news');
  }
}
// Keep successful source evidence compressed; failed URLs need status and hash,
// rather than dozens of identical WordPress error pages.
for (const source of results) {
  for (const field of ['file', 'text_file']) {
    const file = source[field];
    if (!file) continue;
    if (
      !path
        .resolve(file)
        .startsWith(`${path.resolve(output, 'sources')}${path.sep}`)
    ) {
      throw new Error(`Source evidence outside review directory: ${file}`);
    }
    if (source.status !== 200) {
      fs.unlinkSync(file);
      delete source[field];
    } else if (field === 'file' && /\.(html|xml)$/.test(file)) {
      fs.writeFileSync(`${file}.gz`, gzipSync(fs.readFileSync(file)));
      fs.unlinkSync(file);
      source.file = `${file}.gz`;
      source.file_encoding = 'gzip';
    }
  }
}
for (const suffix of [
  '',
  'robots.txt',
  'sitemap_index.xml',
  'post-sitemap.xml',
  'page-sitemap.xml',
  'tribe_events-sitemap.xml',
  'government/',
  'about/',
  'city-government/',
  'angeles-city-mayor/',
  'city-mayor/',
  'city-council/',
  'city-vice-mayor/',
  'citizens-charter/',
  'businesses/',
  'news/',
  'transparency/',
  'other-documents/',
  'contact/',
  'city-profile/',
]) {
  enqueue(`https://angelescity.gov.ph/${suffix}`, 'current-site');
}
for (const name of ['services', 'barangays', 'news']) {
  for (const record of datasets[name])
    enqueue(record.source_url, `august-${name}-index`);
}
enqueue('https://tourism.angelescity.gov.ph/tourist-spot/', 'tourism-index');
for (const record of datasets.tourism)
  enqueue(record.detail_url, 'tourism-detail');
for (const document of documents) {
  enqueue(document.document_url, 'august-document', {
    baseline_sha256: document.original_sha256,
    baseline_download_url: document.download_url,
  });
}

async function collect(task) {
  const record = { ...task, retrieved_at: new Date().toISOString() };
  try {
    const response = await fetch(task.url, {
      headers: {
        'User-Agent':
          'BetterAngeles-ContentReview/1.0 (public government content comparison)',
      },
      signal: AbortSignal.timeout(25000),
    });
    const bytes = Buffer.from(await response.arrayBuffer());
    const contentType = response.headers.get('content-type') || '';
    Object.assign(record, {
      status: response.status,
      final_url: response.url,
      content_type: contentType,
      bytes: bytes.length,
      sha256: sha256(bytes),
      last_modified: response.headers.get('last-modified'),
    });
    const pdf = bytes.subarray(0, 5).toString() === '%PDF-';
    record.is_pdf = pdf;
    if (task.reason === 'august-document') {
      record.comparison =
        !response.ok || !pdf
          ? 'unavailable-keep-august'
          : record.sha256 === task.baseline_sha256
            ? 'identical-original-bytes'
            : 'different-bytes-requires-review';
    }
    const id = sha256(task.url).slice(0, 16);
    const extension = pdf
      ? 'pdf'
      : /html/.test(contentType)
        ? 'html'
        : /xml/.test(contentType)
          ? 'xml'
          : 'txt';
    if (response.ok) {
      const compressed = /html|xml/.test(contentType);
      record.file = `${output}/sources/${id}.${extension}${compressed ? '.gz' : ''}`;
      if (compressed) record.file_encoding = 'gzip';
      fs.writeFileSync(record.file, compressed ? gzipSync(bytes) : bytes);
    }
    if (/sitemap\.xml/.test(task.url) && !/sitemap_index/.test(task.url)) {
      const xml = bytes.toString('utf8');
      record.entries = [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map(
        ([, entry]) => ({
          url: decode(entry.match(/<loc>(.*?)<\/loc>/)?.[1] || ''),
          last_modified: entry.match(/<lastmod>(.*?)<\/lastmod>/)?.[1] || null,
        })
      );
      if (/page-sitemap|tribe_events-sitemap/.test(task.url)) {
        for (const entry of record.entries) {
          enqueue(
            entry.url,
            /tribe_events/.test(task.url) ? 'current-event' : 'current-site'
          );
        }
      }
      if (/post-sitemap/.test(task.url)) {
        for (const entry of record.entries) {
          if (entry.last_modified >= '2026-08-11')
            enqueue(entry.url, 'current-news');
        }
      }
    }
    if (response.ok && /html/.test(contentType)) {
      const html = bytes.toString('utf8');
      record.title = plain(
        html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || ''
      );
      record.links = [
        ...html.matchAll(
          /<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi
        ),
      ].flatMap(([, href, label]) => {
        try {
          return [
            {
              url: new URL(decode(href), response.url).href,
              text: plain(label),
            },
          ];
        } catch {
          return [];
        }
      });
      record.images = [
        ...html.matchAll(/<img\b[^>]*src=["']([^"']+)["'][^>]*>/gi),
      ].map(([, src]) => decode(src));
      const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1] || html;
      record.text_file = `${output}/sources/${id}.text.txt`;
      fs.writeFileSync(record.text_file, `${plain(main)}\n`);
      if (
        response.ok &&
        ['current-site', 'august-services-index'].includes(task.reason)
      ) {
        for (const link of record.links) {
          if (/\.pdf(?:\?|$)/i.test(link.url) && allowed(link.url)) {
            enqueue(link.url, 'current-document');
          }
          if (
            task.url === 'https://angelescity.gov.ph/news/' &&
            allowed(link.url) &&
            !/\/(category|author|page)\//.test(link.url) &&
            link.text.length > 45
          )
            enqueue(link.url, 'current-news');
        }
      }
      if (task.reason === 'current-news') {
        record.published_date =
          html.match(
            /<meta[^>]*property=["']article:published_time["'][^>]*content=["']([^"']+)/i
          )?.[1] ||
          html.match(/<time[^>]*datetime=["']([^"']+)/i)?.[1] ||
          null;
      }
    }
  } catch (error) {
    record.error = error.message;
    if (task.reason === 'august-document')
      record.comparison = 'unavailable-keep-august';
  }
  results.push(record);
  console.log(`${record.status || 'ERROR'} ${task.reason} ${task.url}`);
}

// Bound concurrency to avoid overwhelming the official site.
while (queue.length) {
  const batch = queue.splice(0, 3);
  await Promise.all(batch.map(collect));
  writeJson(`${output}/crawl.json`, {
    review_date: date,
    publisher: 'Angeles City Government',
    baseline: 'August 9–11, 2026 local reference snapshots',
    policy:
      'Missing, empty, inaccessible, or byte-different sources are never automatically replacements.',
    sources: results,
  });
}
console.log(
  `Saved ${results.length} source checks to ${path.resolve(output)}.`
);
