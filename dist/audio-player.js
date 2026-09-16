import {audioSource} from './audio-content.js?v=10';

export const AUDIO_RATES=[0.75,1,1.25,1.5,2];
export function audioTime(seconds){const value=Number.isFinite(seconds)?Math.max(0,Math.floor(seconds)):0;return `${Math.floor(value/60)}:${String(value%60).padStart(2,'0')}`;}

export class AudioDeck {
 constructor({media,works,onChange=()=>{},setTimer=(callback,delay)=>setTimeout(callback,delay),clearTimer=id=>clearTimeout(id),gap=1800}){
  this.media=media;this.works=works;this.onChange=onChange;this.setTimer=setTimer;this.clearTimer=clearTimer;this.gap=gap;
  this.index=0;this.rate=1;this.repeat=true;this.active=false;this.status='paused';this.error='';this.timer=null;this.revision=0;
  media.preload='metadata';media.src=audioSource(works[0].id);
  this.listeners={
   timeupdate:()=>this.emit(),durationchange:()=>this.emit(),loadedmetadata:()=>this.emit(),
   playing:()=>{if(this.active){this.status='playing';this.emit();}},
   waiting:()=>{if(this.active){this.status='loading';this.emit();}},
   ended:()=>this.ended(),error:()=>this.fail('Audio could not load. Press Play to try again.')
  };
  for(const [event,listener] of Object.entries(this.listeners))media.addEventListener(event,listener);
 }
 get state(){return {index:this.index,work:this.works[this.index],rate:this.rate,repeat:this.repeat,active:this.active,status:this.status,error:this.error,currentTime:this.media.currentTime||0,duration:Number.isFinite(this.media.duration)?this.media.duration:0};}
 emit(trackChanged=false){this.onChange(this.state,trackChanged);}
 clearGap(){if(this.timer!==null){this.clearTimer(this.timer);this.timer=null;}}
 pause(){this.revision++;this.active=false;this.clearGap();this.media.pause();this.status='paused';this.emit();}
 async play(){
  this.clearGap();const revision=++this.revision;this.error='';this.active=true;this.status='loading';
  if(this.media.error)this.media.load();
  if(this.media.ended)this.media.currentTime=0;
  this.media.playbackRate=this.rate;this.emit();
  try{await this.media.play();if(revision!==this.revision||!this.active)return;this.status='playing';this.emit();}
  catch{if(revision===this.revision)this.fail('Audio could not start. Press Play to try again.');}
 }
 toggle(){if(this.active)this.pause();else this.play();}
 select(index,autoplay=this.active){
  if(!Number.isInteger(index)||index<0||index>=this.works.length)return;
  this.pause();this.index=index;this.error='';this.media.src=audioSource(this.works[index].id);this.media.load();this.media.playbackRate=this.rate;
  this.emit(true);if(autoplay)this.play();
 }
 step(direction){this.select((this.index+direction+this.works.length)%this.works.length);}
 setRate(rate){if(!AUDIO_RATES.includes(rate))return;this.rate=rate;this.media.playbackRate=rate;this.emit();}
 setRepeat(repeat){this.repeat=!!repeat;if(!this.repeat&&this.status==='gap'&&this.index===this.works.length-1)this.pause();else this.emit();}
 seek(seconds){
  if(!Number.isFinite(seconds)||!Number.isFinite(this.media.duration)||this.media.duration<=0)return;
  const resumeGap=this.active&&this.status==='gap';this.clearGap();this.media.currentTime=Math.min(this.media.duration,Math.max(0,seconds));
  if(resumeGap)this.play();else this.emit();
 }
 ended(){
  if(!this.active)return;
  if(this.index===this.works.length-1&&!this.repeat){this.pause();return;}
  this.clearGap();this.status='gap';this.emit();
  this.timer=this.setTimer(()=>{this.timer=null;if(!this.active)return;this.select((this.index+1)%this.works.length,true);},this.gap);
 }
 fail(message){this.pause();this.error=message;this.status='error';this.emit();}
 destroy(){this.pause();for(const [event,listener] of Object.entries(this.listeners))this.media.removeEventListener(event,listener);}
}
