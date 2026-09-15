import {WORKS} from './data.js';

export const STORAGE_KEY='ap-art-history-12-25-v1';
export const normalize=value=>String(value??'').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[’']/g,'').replace(/tutankham[eo]n/g,'tutankhamun').replace(/[^a-z0-9]+/g,' ').trim().replace(/\s+/g,' ');
export function hasPhrase(text,phrase){return (` ${normalize(text)} `).includes(` ${normalize(phrase)} `);}
export function shuffle(items,random=Math.random){const list=[...items];for(let i=list.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[list[i],list[j]]=[list[j],list[i]];}return list;}
export function getWork(id){return WORKS.find(work=>work.id===Number(id));}
export function answerFor(work,field){if(field==='culture')return `${work.culture} · ${work.period}`;if(field==='context')return work.goTo;return work[field]??'';}
const status=(state,message,extra={})=>({status:state,message,...extra});
const materialVocabulary=['mud brick','mudbrick','gypsum','shell','lapis lazuli','red limestone','black limestone','greywacke','graywacke','alabaster','basalt','diorite','granite','sandstone','limestone','wood','gold','silver','bronze','marble','papyrus','enamel','semiprecious stones','ivory','terracotta','clay','oil paint'];

export function checkAnswer(work,field,answer){
 const input=normalize(answer);
 if(!input)return status('incorrect','No answer entered.');
 if(field==='name'){
  const candidates=[work.name,...work.nameAliases].map(normalize);
  if(candidates.includes(input)||candidates.some(c=>input.replace(/^the /,'')===c.replace(/^the /,'')))return status('correct','Title recognized.');
  return status('review','Compare with the full title. A spelling variation or shortened title needs your judgment.');
 }
 if(field==='material'){
  const matched=[],missing=[];
  work.materialParts.forEach((aliases,i)=>(aliases.some(a=>hasPhrase(input,a))?matched:missing).push(work.materialLabels[i]));
  const allowed=work.materialParts.flat().concat(work.materialAllowed??[]);
  const extras=materialVocabulary.filter(term=>hasPhrase(input,term)&&!allowed.some(a=>hasPhrase(a,term)));
  // A material line with alternatives or negation needs human review, even if it contains the target words.
  if(/\b(not|no|except|without|or|maybe|possibly)\b/.test(input)||extras.length)return status('review',extras.length?`Check the added material${extras.length>1?'s':''}: ${extras.join(', ')}.`:'Your wording contains an alternative or negation; compare it with the answer.',{matched,missing});
  if(missing.length===0)return status('correct','Complete material line recalled.',{matched,missing});
  return status(matched.length?'partial':'incorrect',`Still needed: ${missing.join(' · ')}.`,{matched,missing});
 }
 if(field==='date'){
  const nums=(String(answer).match(/\d+/g)??[]).map(Number);
  const era=String(answer).replace(/\./g,'').toUpperCase();
  if(/\b(?:AD|CE)\b/.test(era)&&!/\bBCE\b/.test(era))return status('incorrect','These works date to BCE, not CE.');
  if(!work.dateNumbers.some(list=>list.length===nums.length&&list.every((n,i)=>n===nums[i])))return status('review','Compare the complete date or range with the course answer.');
  if(!/\bBC(?:E)?\b/.test(era))return status('partial','The numbers match. Add BCE (or BC) to make the date complete.');
  if(work.id===20&&hasPhrase(input,'temple')&&hasPhrase(input,'hall')){
   const original=String(answer).toLowerCase();
   if(/temple\s*:?\s*(?:c\.?\s*)?1250/.test(original)||/hall\s*:?\s*(?:c\.?\s*)?1550/.test(original))return status('incorrect','The labels are reversed: temple 1550 BCE, hall 1250 BCE.');
  }
  return status('correct','Date matches an accepted course version.');
 }
 if(field==='location'){
  if(work.id===19){
   const bab=hasPhrase(input,'babylon'),susa=hasPhrase(input,'susa'),iraq=hasPhrase(input,'iraq'),iran=hasPhrase(input,'iran');
   if((bab&&iraq&&!susa&&!iran)||(susa&&iran&&!bab&&!iraq))return status('correct','Location recognized. Keep original site and findspot distinct.');
   if(bab&&susa&&iraq&&iran)return status('review','Verify the pairings: Babylon, Iraq; Susa, Iran.');
   return status('partial','Use Babylon, Iraq, or Susa, Iran, and explain which location you mean.');
  }
  const missing=work.locationTerms.filter(terms=>!terms.some(t=>hasPhrase(input,t)));
  const incorrectCountries=['egypt','iraq','iran'].filter(c=>hasPhrase(input,c)&&!hasPhrase(work.location,c));
  if(incorrectCountries.length)return status('review','Check the country against the course answer.');
  return missing.length?status('partial','Include the original site and its modern country.'):status('correct','Location recognized.');
 }
 if(field==='artist'){
  if(work.id===21){
   if(['senenmut','senmut','senemut'].some(n=>hasPhrase(input,n)))return status('correct','Senenmut is the traditional attribution; the design is not securely signed.');
   return status('review','Senenmut is traditionally associated with the design. The slides do not name an architect; compare your wording with that distinction.');
  }
  if(/\b(unknown|unrecorded|anonymous|unidentified|not known|not named|no single)\b/.test(input)&&!hasPhrase(input,'not unknown'))return status('correct','The individual maker is not recorded. Do not substitute the ruler or patron.');
  return status('review','The maker is unrecorded. Check whether your answer names the ruler or subject instead.');
 }
 if(field==='culture'){
  const culture=work.culture==='Sumerian'?['sumerian','sumer']:work.culture==='Babylonian'?['babylonian','babylon','old babylonian']:work.culture==='Assyrian'?['assyrian','assyria','neo assyrian']:['egyptian','egypt'];
  const c=culture.some(x=>hasPhrase(input,x));
  const period=work.period.includes('Amarna')?'amarna':work.period.includes('Old Kingdom')?'old kingdom':work.period.includes('New Kingdom')?'new kingdom':work.period==='Predynastic'?'predynastic':null;
  if(c&&(!period||hasPhrase(input,period)))return status('correct','Culture and principal period recognized.');
  return status('partial',c?'Add the kingdom or period.':'Compare the civilization and period with the answer.');
 }
 if(field==='context'||field==='all')return status('review','Compare your recall with the facts below, then mark it yourself.');
 return status('review','Compare your answer with the reference.');
}

export function defaultStore(){return {version:1,stats:{},history:[],focus:'material',study:null,quiz:null};}
export function sanitizeStore(raw){
 const clean=defaultStore();if(!raw||typeof raw!=='object'||raw.version!==1)return clean;
 const fields=['all','name','material','date','location','artist','culture','context'];
 clean.focus=fields.includes(raw.focus)?raw.focus:'material';
 for(const w of WORKS){const saved=raw.stats?.[w.id];if(!saved||typeof saved!=='object')continue;clean.stats[w.id]={};for(const f of fields){const v=saved[f];if(v&&typeof v==='object'){clean.stats[w.id][f]={seen:Math.max(0,Math.min(100000,Number(v.seen)||0)),correct:Math.max(0,Math.min(100000,Number(v.correct)||0)),streak:Math.max(0,Math.min(100000,Number(v.streak)||0)),lastCorrect:v.lastCorrect===true};}}}
 clean.history=Array.isArray(raw.history)?raw.history.slice(0,30).filter(x=>x&&typeof x==='object'):[];
 const s=raw.study;
 if(s&&fields.includes(s.focus)&&Array.isArray(s.queue)&&s.queue.length>0&&s.queue.length<=100&&s.queue.every(id=>getWork(id))&&Number.isInteger(s.index)&&s.index>=0&&s.index<=s.queue.length){
  clean.study={...s,typed:typeof s.typed==='string'?s.typed.slice(0,3000):'',again:Array.isArray(s.again)?s.again.filter(id=>getWork(id)):[],correct:Number(s.correct)||0,filter:s.filter==='missed'?'missed':'all',revealed:!!s.revealed,image:Number.isInteger(s.image)?s.image:0};
 }
 const q=raw.quiz;
 if(q&&['active','review'].includes(q.status)&&Array.isArray(q.questions)&&q.questions.length>0&&q.questions.length<=14&&new Set(q.questions.map(x=>x.id)).size===q.questions.length&&q.questions.every(x=>getWork(x.id)&&Number.isInteger(x.image)&&getWork(x.id).images[x.image]?.quiz)&&Number.isInteger(q.index)&&q.index>=0&&q.index<q.questions.length&&Number.isFinite(q.startedAt)){
  const answers={};for(const question of q.questions){const a=q.answers?.[question.id];answers[question.id]={name:typeof a?.name==='string'?a.name.slice(0,3000):'',material:typeof a?.material==='string'?a.material.slice(0,3000):'',fact:typeof a?.fact==='string'?a.fact.slice(0,3000):''};}
  const grades={};if(q.status==='review'){for(const question of q.questions){const g=q.grades?.[question.id]??{};grades[question.id]={};for(const field of ['name','material','fact'])grades[question.id][field]=g[field]===true?true:g[field]===false?false:null;}}
  clean.quiz={...q,answers,grades,status:q.status,timerMinutes:[0,10,15,20].includes(q.timerMinutes)?q.timerMinutes:0,finishedAt:Number.isFinite(q.finishedAt)?q.finishedAt:null,recorded:!!q.recorded};
 }
 return clean;
}
export function recordRecall(store,id,field,correct){store.stats[id]??={};const stat=store.stats[id][field]??{seen:0,correct:0,streak:0};store.stats[id][field]={seen:stat.seen+1,correct:stat.correct+(correct?1:0),streak:correct?stat.streak+1:0,lastCorrect:correct};}
export function needsPractice(store,id,field){const stats=store.stats[id]??{};if(field==='all')return Object.values(stats).some(s=>s.seen>0&&!s.lastCorrect);return stats[field]?.seen>0&&!stats[field].lastCorrect;}
export function materialReadyCount(store){return WORKS.filter(w=>(store.stats[w.id]?.material?.streak??0)>=2).length;}
export function quizProgress(quiz){return quiz.questions.filter(q=>{const a=quiz.answers[q.id];return a&&a.name.trim()&&a.material.trim()&&a.fact.trim();}).length;}
export function makeQuiz({count=14,ids=WORKS.map(w=>w.id),alternateViews=false,timerMinutes=0,random=Math.random}={}){
 const questions=shuffle(ids,random).slice(0,count).map(id=>{const work=getWork(id);const views=work.images.map((im,i)=>im.quiz?i:null).filter(i=>i!==null);return {id,image:alternateViews?views[Math.floor(random()*views.length)]:0};});
 return {id:`quiz-${Date.now()}`,status:'active',questions,index:0,answers:{},grades:{},startedAt:Date.now(),finishedAt:null,timerMinutes,alternateViews,recorded:false};
}
export function finishQuiz(quiz){quiz.status='review';quiz.finishedAt=Date.now();quiz.grades={};for(const q of quiz.questions){const w=getWork(q.id);const a=quiz.answers[q.id]??{};quiz.grades[q.id]={};for(const field of ['name','material']){const result=checkAnswer(w,field,a[field]??'');quiz.grades[q.id][field]=result.status==='correct'?true:result.status==='review'?null:false;}quiz.grades[q.id].fact=a.fact?.trim()?null:false;}return quiz;}
export function quizScore(quiz){let correct=0,pending=0;for(const question of quiz.questions){for(const field of ['name','material','fact']){const grade=quiz.grades?.[question.id]?.[field];if(grade===true)correct++;else if(grade!==false)pending++;}}return {correct,pending,total:quiz.questions.length*3};}
