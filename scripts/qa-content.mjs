import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import vm from 'node:vm';
import yaml from 'js-yaml';

const referenceDirectory = 'content/reference/angeles-city';
const json = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');
const normalize = text =>
  text.replace(/[*_`]/g, '').replace(/\s+/g, ' ').toLowerCase();
const manifest = json(`${referenceDirectory}/source-manifest.json`);
const categories = yaml.load(fs.readFileSync('src/data/services.yaml', 'utf8'));
const pages = new Map();
const missing = [];
const knownMissing = new Set(
  manifest.known_source_gaps.map(item => `${item.category}/${item.slug}`)
);
let localLinks = 0;

// Exercise the metadata extraction statements used by the application itself.
const loader = fs.readFileSync('src/lib/markdownLoader.ts', 'utf8');
const metadataStatements = loader.slice(
  loader.indexOf('const titleMatch ='),
  loader.indexOf('return { content, title, description, data };')
);
assert(metadataStatements.includes('const descriptionMatch ='));
const extractMetadata = content =>
  vm.runInNewContext(
    `(() => { ${metadataStatements} return { title, description }; })()`,
    { content }
  );

for (const category of categories.categories) {
  const directory = `content/services/${category.slug}`;
  const index = yaml.load(fs.readFileSync(`${directory}/index.yaml`, 'utf8'));
  for (const entry of index.pages) {
    const file = `${directory}/${entry.slug}.md`;
    if (!fs.existsSync(file)) {
      assert(
        knownMissing.has(`${category.slug}/${entry.slug}`),
        `New missing page: ${file}`
      );
      missing.push(file);
      continue;
    }
    const text = fs.readFileSync(file, 'utf8');
    assert(
      !/lapu.?lapu|cebu|\{[A-Z_]+\}/i.test(text),
      `Wrong locality or unresolved template: ${file}`
    );
    const expectedTitle = text.split(/\r?\n/)[0].replace(/^#\s+/, '');
    for (const content of [
      text.replace(/\r\n/g, '\n'),
      text.replace(/\r?\n/g, '\r\n'),
    ]) {
      const metadata = extractMetadata(content);
      assert.equal(
        metadata.title.trim(),
        expectedTitle,
        `Incorrect title: ${file}`
      );
      assert.equal(
        metadata.description,
        entry.description,
        `Incorrect description: ${file}`
      );
    }
    assert.equal(
      entry.name,
      expectedTitle.replace(/ — Angeles City$/, ''),
      `Listing title mismatch: ${file}`
    );
    pages.set(file, text);
    for (const [, url] of text.matchAll(
      /\]\((\/services\/[^)]+|\/documents\/[^)]+)\)/g
    )) {
      const target = url.startsWith('/documents/')
        ? `public${url}`
        : `content${url}.md`;
      assert(fs.existsSync(target), `Broken link ${url} in ${file}`);
      if (url.startsWith('/services/')) {
        const [, , linkedCategory, slug] = url.split('/');
        const linkedIndex = yaml.load(
          fs.readFileSync(
            `content/services/${linkedCategory}/index.yaml`,
            'utf8'
          )
        );
        assert(
          linkedIndex.pages.some(item => item.slug === slug),
          `Unlisted linked page ${url}`
        );
      }
      localLinks++;
    }
  }
}

let records = 0;
for (const dataset of manifest.datasets) {
  const data = json(`${referenceDirectory}/${dataset.name}.json`);
  assert.equal(
    data.length,
    dataset.record_count,
    `Record count changed: ${dataset.name}`
  );
  assert.equal(
    sha256(JSON.stringify(data)),
    dataset.records_sha256,
    `Reference records changed: ${dataset.name}`
  );
  records += data.length;
}

const schools = json(`${referenceDirectory}/schools.json`);
const schoolDirectory = pages.get(
  'content/services/education/find-public-schools-in-angeles-city.md'
);
const schoolRows = [
  ...schoolDirectory.matchAll(/^\|\s*(\d+)\s*\|\s*(.+?)\s*\|$/gm),
].map(([, id, name]) => [id, name]);
assert.equal(schoolRows.length, schools.length);
for (const school of schools) {
  assert(
    schoolRows.some(
      ([id, name]) => id === school.school_id && name === school.name
    ),
    `School mismatch: ${school.name}`
  );
}
assert.equal(
  new Set(schools.map(school => school.school_id)).size,
  schools.length
);

const barangays = json(`${referenceDirectory}/barangays.json`);
const barangayDirectory = pages.get(
  'content/services/business/find-your-angeles-city-barangay.md'
);
const barangayRows = [
  ...barangayDirectory.matchAll(
    /^\|\s*(.+?)\s*\|\s*\[View barangay\]\(([^)]+)\)\s*\|$/gm
  ),
].map(([, name, url]) => [name, url]);
assert.equal(barangayRows.length, barangays.length);
for (const barangay of barangays) {
  assert(
    barangayRows.some(
      ([name, url]) => name === barangay.name && url === barangay.detail_url
    ),
    `Barangay mismatch: ${barangay.name}`
  );
}
assert.equal(
  new Set(barangays.map(barangay => barangay.name)).size,
  barangays.length
);

const tourism = json(`${referenceDirectory}/tourism.json`);
const tourismPage = pages.get(
  'content/services/business/join-trade-fairs-business-expos-or-tourism-promotions.md'
);
for (const attraction of tourism) {
  assert(
    tourismPage.includes(`[${attraction.name}](${attraction.detail_url})`),
    `Tourism mismatch: ${attraction.name}`
  );
}

const citedDownloads = new Set();
for (const service of json(`${referenceDirectory}/services.json`)) {
  const content = service.content_pages
    .map(file => {
      assert(pages.has(file), `Service page missing: ${file}`);
      const text = pages.get(file);
      assert(
        text.includes(service.document_url),
        `Official source citation missing: ${file}`
      );
      assert(
        text.includes(service.downloads[0]),
        `Primary PDF citation missing: ${file}`
      );
      return text;
    })
    .join('\n');
  for (const point of service.qa_checked_content_points) {
    assert(
      normalize(content).includes(normalize(point)),
      `Checked source fact missing: ${service.service_name}: ${point}`
    );
  }
  for (const download of service.downloads) {
    assert(
      content.includes(download),
      `Alternate PDF citation missing: ${download}`
    );
    citedDownloads.add(download);
  }
}
for (const document of manifest.documents) {
  assert(
    citedDownloads.has(document.download_url),
    `Uncited document: ${document.filename}`
  );
  assert.equal(
    sha256(fs.readFileSync(`public${document.download_url}`)),
    document.download_sha256,
    `PDF changed: ${document.filename}`
  );
  assert(
    document.qa_page_image_errors.every(error => error < 3),
    `PDF layout QA failed: ${document.filename}`
  );
}
assert.equal(
  fs.readdirSync('public/documents/angeles-services').length,
  manifest.documents.length
);

if (process.argv.includes('--build')) {
  const assets = fs.readdirSync('dist/assets');
  for (const file of pages.keys()) {
    const slug = file.split('/').at(-1).replace(/\.md$/, '');
    assert(
      assets.some(
        asset => asset.startsWith(`${slug}-`) && asset.endsWith('.js')
      ),
      `Page absent from build: ${file}`
    );
  }
  for (const document of manifest.documents) {
    assert.equal(
      sha256(fs.readFileSync(`dist${document.download_url}`)),
      document.download_sha256,
      `Built PDF mismatch: ${document.filename}`
    );
  }
  for (const dataset of [
    ...manifest.datasets.map(item => item.name),
    'source-manifest',
    'run_summary',
    'artifact_manifest',
    'scrape_failures',
    'service_content_requirements',
  ]) {
    assert(
      !assets.some(asset => asset.startsWith(`${dataset}-`)),
      `Raw/reference data bundled: ${dataset}`
    );
  }
}

console.log(
  `PASS: ${pages.size} pages, LF/CRLF metadata, ${localLinks} local links, ${records} preserved records, ${schools.length} schools, ${barangays.length} barangays, ${tourism.length} attractions, and ${manifest.documents.length} PDF downloads.`
);
console.log(
  `${missing.length} pre-existing service drafts remain documented as source gaps.`
);
