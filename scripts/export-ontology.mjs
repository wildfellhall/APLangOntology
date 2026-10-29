import {writeFileSync} from 'node:fs';
import {concepts,edges,units,domains,skills,sources,checkedDate} from '../src/data/index.js';
const artifact={version:1,reviewed:checkedDate,scope:'Editorial AP Language concept ontology; original teaching materials, not an official College Board ontology.',concepts,edges,units,domains,skills,sources};
writeFileSync(new URL('../public/ontology.json',import.meta.url),JSON.stringify(artifact,null,2));
console.log(`Exported ${concepts.length} concepts and ${edges.length} typed relationships.`);
