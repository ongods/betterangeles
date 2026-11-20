// Offline, deliberate import of the preserved transcription, never a live sync.
import { readFile, writeFile } from 'node:fs/promises';
const snapshot = JSON.parse(
  await readFile(
    'content/reference/angeles-city/planning-document-2026-11-07.json',
    'utf8'
  )
);
const city = JSON.parse(await readFile('src/data/angeles.json', 'utf8'));
const rows = snapshot.tabs
  .find(tab => tab.title === 'Scraped website data')
  .text.map(item => item.text.trim());
const first = rows.findIndex(text => text === 'MAURO MANARANGA MALLARI') - 1;
if (first < 0) throw new Error('Captain table was not found.');
const officials = Array.from({ length: 33 }, (_, index) => {
  const [name, person, rawContact, row] = rows.slice(
    first + index * 4,
    first + index * 4 + 4
  );
  const barangay = city.barangays.find(item => item.name === name);
  if (!barangay || !/^\d{5}$/.test(row))
    throw new Error(`Unmatched source row: ${name}`);
  return {
    barangayId: barangay.id,
    name: person,
    role: 'Punong Barangay',
    term: '2023–2026 (source label)',
    rawContact,
    sourceRow: Number(row),
    evidence: 'provisional',
    referenceDate: '2023–2026',
    sourceId: 'doc20261028:S56',
  };
});
if (new Set(officials.map(item => item.barangayId)).size !== 33)
  throw new Error('Expected 33 unique barangays.');
await writeFile(
  'src/data/barangayOfficials.json',
  JSON.stringify(officials, null, 2) + '\n'
);
console.log(
  'Imported 33 provisional captain-row transcriptions; no telephone links enabled.'
);
