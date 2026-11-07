import fs from 'node:fs';
import assert from 'node:assert/strict';

// Offline curation from an explicitly captured source. Never run in the browser.
const directory = 'content/reference/angeles-city';
const snapshot = JSON.parse(
  fs.readFileSync(`${directory}/planning-document-2026-11-07.json`, 'utf8')
);
const table = index => snapshot.tables[index].rows.slice(1);
const sources = Object.fromEntries(
  snapshot.tabs
    .flatMap(tab => tab.text)
    .filter(item => /^S\d\d {2}/.test(item.text))
    .map(item => [
      `doc20261028:${item.text.slice(0, 3)}`,
      { title: item.text.slice(5).trim(), url: item.url ?? null },
    ])
);
sources['archive:schools'] = {
  title: 'DepEd National Inventory Dashboard, captured 9 August 2026',
  url: 'https://nid.deped.gov.ph/public-dashboard/region/Region%20III/division/Angeles%20City',
};
sources['doc20261028:S56'] = {
  title: 'Supplied barangay officials workbook; issuer/date unconfirmed',
  url: null,
};

const barangays = table(1).map(([name, psgc, population]) => ({
  id: psgc,
  name,
  population: Number(population),
  populationYear: 2024,
  sourceIds: ['doc20261028:S01'],
}));
assert.equal(barangays.length, 33);
assert.equal(new Set(barangays.map(item => item.id)).size, 33);
assert.equal(
  barangays.reduce((sum, item) => sum + item.population, 0),
  483452
);

const schoolAddresses = new Map(table(6).map(row => [row[0], row]));
const archivedSchools = JSON.parse(
  fs.readFileSync(`${directory}/schools.json`, 'utf8')
);
const publicSchools = archivedSchools.map(item => {
  const address = schoolAddresses.get(item.school_id);
  return {
    id: item.school_id,
    name: item.name,
    rawName: address?.[1] ?? item.name,
    address: address?.[2] ?? null,
    notes:
      item.school_id === '502867'
        ? 'Source conflict: the other directory lists Enrica Sandico ES as 107028. The relationship between these records is unconfirmed; an ID replacement or two current institutions is not established.'
        : null,
    sourceIds:
      address || item.school_id === '502867'
        ? ['archive:schools', 'doc20261028:S18']
        : ['archive:schools'],
  };
});
for (const [id, name, address] of table(6)) {
  if (!publicSchools.some(item => item.id === id)) {
    publicSchools.push({
      id,
      name,
      rawName: name,
      address,
      notes:
        id === '107028'
          ? 'Source conflict: the archived dashboard lists Enrica Sandico Integrated School as 502867. The relationship between these records is unconfirmed; an ID replacement or two current institutions is not established.'
          : null,
      sourceIds:
        id === '107028'
          ? ['doc20261028:S18', 'archive:schools']
          : ['doc20261028:S18'],
    });
  }
}

const data = {
  collectedOn: snapshot.content_reference_date,
  importedOn: snapshot.retrieved_on,
  sources,
  profile: {
    name: 'City of Angeles',
    psgc: '0330100000',
    population: 483452,
    populationYear: 2024,
    barangayCount: 33,
    barangayEdition: '31 July 2025',
    sourceIds: ['doc20261028:S01'],
  },
  barangays,
  publicSchools,
  privateSchools: table(7).map(([id, name, address]) => ({
    id,
    name,
    address,
    schoolYear: '2025–2026',
    sourceIds: ['doc20261028:S19'],
  })),
  healthUnits: table(5).map(([name, address], index) => ({
    id: `tb-unit-${index + 1}`,
    name,
    address,
    sourceIds: ['doc20261028:S16', 'doc20261028:S17'],
  })),
  offices: table(4).map(([name, details, evidence], index) => ({
    id: `office-${index + 1}`,
    name,
    details,
    evidence,
    sourceIds: [...evidence.matchAll(/S\d\d/g)].map(
      match => `doc20261028:${match[0]}`
    ),
  })),
  heritage: table(10).map(([name, address, summary], index) => ({
    id: `heritage-${index + 1}`,
    name,
    address,
    summary,
    sourceIds: [
      index < 2
        ? 'doc20261028:S34'
        : index === 2
          ? 'doc20261028:S36'
          : 'doc20261028:S37',
    ],
  })),
};
fs.writeFileSync('src/data/angeles.json', `${JSON.stringify(data, null, 2)}\n`);
console.log(
  `Curated ${barangays.length} barangays, ${publicSchools.length} public schools, 8 private-school seeds, 6 health units, 5 offices and 6 heritage places.`
);
