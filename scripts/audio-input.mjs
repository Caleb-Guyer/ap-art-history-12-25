import {writeFile} from 'node:fs/promises';
import {WORKS} from '../dist/data.js';
import {audioParts} from '../dist/audio-content.js';

if(!process.argv[2])throw new Error('Provide the temporary narration JSON path.');
await writeFile(process.argv[2],JSON.stringify(WORKS.map(work=>({id:work.id,parts:audioParts(work)})),null,2));
