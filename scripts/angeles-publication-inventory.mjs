import fs from 'node:fs';
import crypto from 'node:crypto';
import yaml from 'js-yaml';

const root = 'content/reference/angeles-city';
const snapshotPath = `${root}/planning-document-2026-11-07.json`;
const snapshot = JSON.parse(fs.readFileSync(snapshotPath, 'utf8'));
const categories = yaml.load(
  fs.readFileSync('src/data/services.yaml', 'utf8')
).categories;
const pages = categories.flatMap(category => {
  const index = yaml.load(
    fs.readFileSync(`content/services/${category.slug}/index.yaml`, 'utf8')
  );
  return index.pages.map(page => {
    const file = `content/services/${category.slug}/${page.slug}.md`;
    const available = fs.existsSync(file);
    const text = available ? fs.readFileSync(file, 'utf8') : '';
    const sourceUrls = [...text.matchAll(/\]\((https:\/\/[^)]+)\)/g)].map(
      match => match[1]
    );
    return {
      category: category.slug,
      slug: page.slug,
      name: page.name,
      file: available ? file : null,
      disposition: available
        ? 'publish_with_dated_source_limits'
        : 'awaiting_source',
      basis: available
        ? 'Existing archived evidence and source QA; current office confirmation not performed.'
        : 'Indexed draft without a supported Markdown guide.',
      sourceUrls: [...new Set(sourceUrls)],
      documentSourceIds: snapshot.tabs
        .flatMap(tab => tab.text)
        .filter(
          item => /^S\d\d {2}/.test(item.text) && sourceUrls.includes(item.url)
        )
        .map(item => `doc20261028:${item.text.slice(0, 3)}`),
    };
  });
});
const inventory = {
  preparedOn: '2026-11-07',
  sourceDocument: snapshot.url,
  sourceSnapshot: snapshotPath,
  sourceSnapshotSha256: crypto
    .createHash('sha256')
    .update(fs.readFileSync(snapshotPath))
    .digest('hex'),
  scope:
    'Publication dispositions using available evidence; not independent confirmation of current procedures.',
  pages,
};
fs.writeFileSync(
  `${root}/publication-inventory-2026-11-07.json`,
  JSON.stringify(inventory, null, 2) + '\n'
);
const rows = pages.map(
  page =>
    `| ${page.category} | ${page.file ? `[${page.name}](../${page.file})` : page.name} | ${page.disposition.replaceAll('_', ' ')} |`
);
fs.writeFileSync(
  'docs/CONTENT-INVENTORY.md',
  [
    '# Content publication inventory',
    '',
    'Prepared 7 November 2026 from the available repository evidence and Google Doc.',
    '',
    'This is a publication inventory, not a certification that historical procedures',
    'remain current. Published guides retain their source warnings. Missing topics',
    'are excluded from search and have a clear unavailable-information state.',
    '',
    'The [machine-readable inventory](../content/reference/angeles-city/publication-inventory-2026-11-07.json)',
    'records source URLs, matching namespaced document sources, dispositions, and',
    'the captured Google Doc snapshot hash. The existing source manifest is unchanged.',
    '',
    '| Category | Guide or topic | Disposition |',
    '| --- | --- | --- |',
    ...rows,
    '',
  ].join('\n')
);
console.log(
  `Inventoried ${pages.length} topics: ${pages.filter(page => page.file).length} available, ${pages.filter(page => !page.file).length} awaiting sources.`
);
