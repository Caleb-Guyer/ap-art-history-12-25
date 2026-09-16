import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {WORKS} from '../dist/data.js';
import {audioParts,audioSource} from '../dist/audio-content.js';
import {AudioDeck,audioTime} from '../dist/audio-player.js';

class Media extends EventTarget {
 constructor(){super();this.currentTime=0;this.duration=15;this.paused=true;this.ended=false;this.error=null;this.playbackRate=1;this.plays=0;}
 play(){this.plays++;this.paused=false;this.dispatchEvent(new Event('playing'));return Promise.resolve();}
 pause(){this.paused=true;}
 load(){this.currentTime=0;this.ended=false;this.error=null;}
 end(){this.currentTime=this.duration;this.ended=true;this.paused=true;this.dispatchEvent(new Event('ended'));}
}
function setup(){const media=new Media(),timers=new Map();let serial=0;const deck=new AudioDeck({media,works:WORKS,setTimer:callback=>{timers.set(++serial,callback);return serial;},clearTimer:id=>timers.delete(id)});return {deck,media,timers,tick(){const callbacks=[...timers.values()];timers.clear();callbacks.forEach(callback=>callback());}};}

test('each audio recording matches the current name, materials, and recommendation',async()=>{
 const manifest=JSON.parse((await readFile(new URL('../dist/audio/narration.json',import.meta.url),'utf8')).replace(/^\uFEFF/,''));
 assert.deepEqual(manifest.map(item=>item.id),WORKS.map(work=>work.id));
 for(const work of WORKS){
  const parts=audioParts(work);assert.deepEqual(manifest.find(item=>item.id===work.id).parts,parts);assert.deepEqual(parts.map(part=>part.field),['name','material','recommendation']);
  const wav=await readFile(new URL(`../dist/audio/work-${work.id}.wav`,import.meta.url));assert.equal(wav.toString('ascii',0,4),'RIFF');assert.equal(wav.toString('ascii',8,12),'WAVE');
  let bytesPerSecond=0,data;
  for(let offset=12;offset+8<=wav.length;){const name=wav.toString('ascii',offset,offset+4),size=wav.readUInt32LE(offset+4);assert.ok(offset+8+size<=wav.length);if(name==='fmt '){assert.equal(wav.readUInt16LE(offset+8),1);assert.equal(wav.readUInt16LE(offset+10),1);assert.equal(wav.readUInt16LE(offset+22),16);bytesPerSecond=wav.readUInt32LE(offset+16);}if(name==='data')data=wav.subarray(offset+8,offset+8+size);offset+=8+size+(size%2);}
  assert.ok(data&&bytesPerSecond>0);const duration=data.length/bytesPerSecond;assert.ok(duration>8&&duration<40,`${work.id}: ${duration}`);
  let peak=0;for(let i=0;i<data.length;i+=2)peak=Math.max(peak,Math.abs(data.readInt16LE(i)));assert.ok(peak>500,`${work.id}: silent audio`);
 }
});
test('audio starts only on Play and advances after a completed clip and a gap',async()=>{
 const {deck,media,timers,tick}=setup();assert.equal(media.plays,0);assert.equal(media.src,audioSource(12));
 await deck.play();assert.equal(deck.state.status,'playing');media.end();assert.equal(deck.state.status,'gap');assert.equal(deck.index,0);assert.equal(timers.size,1);
 tick();await Promise.resolve();assert.equal(deck.index,1);assert.equal(media.src,audioSource(13));assert.equal(deck.state.status,'playing');
 deck.destroy();
});
test('pausing cancels automatic advancement and preserves the playback position',async()=>{
 const {deck,media,timers,tick}=setup();await deck.play();media.currentTime=6;deck.pause();assert.equal(media.currentTime,6);assert.equal(media.paused,true);assert.equal(deck.state.active,false);
 await deck.play();media.end();deck.pause();assert.equal(timers.size,0);tick();assert.equal(deck.index,0);deck.destroy();
});
test('previous, next, direct selection, speed, and seek honor paused and playing states',async()=>{
 const {deck,media}=setup();deck.step(1);assert.equal(deck.index,1);assert.equal(media.plays,0);deck.step(-1);assert.equal(deck.index,0);deck.step(-1);assert.equal(deck.index,13);
 deck.setRate(1.5);await deck.play();deck.select(8);await Promise.resolve();assert.equal(media.src,audioSource(20));assert.equal(deck.state.active,true);assert.equal(media.playbackRate,1.5);
 deck.seek(4);assert.equal(media.currentTime,4);deck.seek(-2);assert.equal(media.currentTime,0);deck.setRate(100);assert.equal(deck.rate,1.5);deck.select(999);assert.equal(deck.index,8);deck.destroy();
});
test('Repeat all wraps to the first piece and turning it off stops at the end',async()=>{
 for(const repeat of [true,false]){const {deck,media,tick}=setup();deck.select(13);deck.setRepeat(repeat);await deck.play();media.end();tick();await Promise.resolve();assert.equal(deck.index,repeat?0:13);assert.equal(deck.active,repeat);deck.destroy();}
 const {deck,media,tick}=setup();deck.select(13);await deck.play();media.end();deck.setRepeat(false);tick();assert.equal(deck.index,13);assert.equal(deck.active,false);deck.destroy();
});
test('play failures are recoverable and stale requests cannot restart paused audio',async()=>{
 const {deck,media}=setup();media.play=()=>Promise.reject(new Error('blocked'));await deck.play();assert.equal(deck.state.status,'error');assert.equal(deck.active,false);assert.ok(deck.error);
 media.play=Media.prototype.play;await deck.play();assert.equal(deck.state.status,'playing');assert.equal(deck.error,'');deck.pause();
 let reject;media.play=()=>new Promise((resolve,rejected)=>{reject=rejected;});const pending=deck.play();deck.pause();reject(new Error('interrupted'));await pending;assert.equal(deck.state.status,'paused');assert.equal(deck.error,'');deck.destroy();
});
test('audio time labels handle unavailable metadata',()=>{assert.equal(audioTime(NaN),'0:00');assert.equal(audioTime(Infinity),'0:00');assert.equal(audioTime(65.9),'1:05');});
test('the default scheduler advances playback and supports cancellation',async()=>{
 const media=new Media(),deck=new AudioDeck({media,works:WORKS,gap:1});
 await deck.play();media.end();await new Promise(resolve=>setTimeout(resolve,10));assert.equal(deck.index,1);
 media.end();deck.pause();await new Promise(resolve=>setTimeout(resolve,10));assert.equal(deck.index,1);deck.destroy();
});
