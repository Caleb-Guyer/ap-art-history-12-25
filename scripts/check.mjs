import {WORKS,FIELDS} from '../dist/data.js';
import {audioParts} from '../dist/audio-content.js';
import {readFile,access} from 'node:fs/promises';
import assert from 'node:assert/strict';
assert.deepEqual(WORKS.map(w=>w.id),Array.from({length:14},(_,i)=>i+12));
for(const w of WORKS){for(const field of ['name','material','date','location','artist','culture','period','function','goTo'])assert.ok(w[field],`${w.id}: ${field}`);assert.equal(w.materialParts.length,w.materialLabels.length);assert.ok(w.sources.length);assert.ok(w.images[0].quiz);for(const image of w.images)await access(new URL(`../dist/${image.src}`,import.meta.url));}
for(const name of ['app.js','engine.js','data.js','audio-content.js','audio-player.js','styles.css','compact.css'])await access(new URL(`../dist/${name}`,import.meta.url));
const narration=JSON.parse((await readFile(new URL('../dist/audio/narration.json',import.meta.url),'utf8')).replace(/^\uFEFF/,''));
assert.equal(narration.length,WORKS.length);for(const work of WORKS){assert.deepEqual(narration.find(item=>item.id===work.id)?.parts,audioParts(work),`Stale audio: work ${work.id}`);await access(new URL(`../dist/audio/work-${work.id}.wav`,import.meta.url));}
const html=await readFile(new URL('../dist/index.html',import.meta.url),'utf8');assert.ok(html.includes('type="module"'));assert.ok(html.includes('name="viewport"'));
const manifest=JSON.parse(await readFile(new URL('../dist/images/sources.json',import.meta.url),'utf8'));assert.equal(manifest.images.length,WORKS.reduce((sum,w)=>sum+w.images.length,0));
console.log(`Validated ${WORKS.length} works, ${manifest.images.length} images, ${narration.length} audio clips, ${Object.keys(FIELDS).length} study categories, and entrypoint assets.`);
