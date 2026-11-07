import fs from 'node:fs';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';

const readJson = path => JSON.parse(fs.readFileSync(path, 'utf8'));
const data = readJson('src/data/angeles.json');
const inventory = readJson(
  'content/reference/angeles-city/publication-inventory-2026-11-07.json'
);
const snapshot = readJson(inventory.sourceSnapshot);
const hash = crypto
  .createHash('sha256')
  .update(fs.readFileSync(inventory.sourceSnapshot))
  .digest('hex');
assert.equal(
  hash,
  inventory.sourceSnapshotSha256,
  'Planning source snapshot changed'
);
assert.equal(data.profile.populationYear, 2024);
assert.equal(data.barangays.length, 33);
assert.equal(new Set(data.barangays.map(item => item.id)).size, 33);
assert.equal(
  data.barangays.reduce((sum, item) => sum + item.population, 0),
  data.profile.population
);
for (const [name, id, population] of snapshot.tables[1].rows.slice(1)) {
  assert(
    data.barangays.some(
      item =>
        item.id === id &&
        item.name === name &&
        item.population === Number(population)
    ),
    `Barangay source mismatch: ${id}`
  );
}
const records = [
  ...data.barangays,
  ...data.publicSchools,
  ...data.privateSchools,
  ...data.healthUnits,
  ...data.offices,
  ...data.heritage,
];
for (const record of records) {
  assert(record.sourceIds.length > 0, `Missing sources: ${record.id}`);
  for (const id of record.sourceIds)
    assert(data.sources[id], `Unknown source ${id}`);
}
for (const key of [
  'publicSchools',
  'privateSchools',
  'healthUnits',
  'offices',
  'heritage',
]) {
  const items = data[key];
  assert.equal(
    new Set(items.map(item => item.id)).size,
    items.length,
    `Duplicate IDs: ${key}`
  );
}
for (const page of inventory.pages) {
  const path = `content/services/${page.category}/${page.slug}.md`;
  assert.equal(
    fs.existsSync(path),
    page.file !== null,
    `Stale inventory: ${path}`
  );
  if (page.file) {
    const text = fs.readFileSync(page.file, 'utf8');
    for (const url of page.sourceUrls)
      assert(text.includes(url), `Source removed since inventory: ${path}`);
  }
}
if (process.argv.includes('--build')) {
  const assets = fs
    .readdirSync('dist/assets')
    .filter(file => file.endsWith('.js'));
  for (const file of assets) {
    const text = fs.readFileSync(`dist/assets/${file}`, 'utf8');
    assert(
      !text.includes(snapshot.revision_id),
      `Planning evidence leaked into build: ${file}`
    );
    assert(
      !text.includes(inventory.sourceSnapshotSha256),
      `Publication evidence leaked into build: ${file}`
    );
  }
}
console.log(
  `PASS: ${records.length} curated directory/heritage records, namespaced sources, planning snapshot integrity, and publication inventory.`
);
