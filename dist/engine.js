import {WORKS,FIELDS,RECOMMENDATIONS,shortDetail} from './data.js?v=10';

export const FACT_FIELDS=['date','location','culture'];
export const STUDY_FIELDS=['name','material','date','location','culture'];
export const DETAIL_FIELDS=STUDY_FIELDS.filter(field=>field!=='name'&&field!=='material');
export const FIELD_LABELS={details:'Details',recommendation:'Recommendation',name:'Name',material:'Material',date:'Date',location:'Location',artist:'Artist',culture:'Culture & period'};
export function hasKnownArtist(work){return work?.artistKnown===true;}
export function fieldAvailable(work,field){return field!=='context'&&field!=='artist';}
export function fieldLabel(work,field){return field==='location'&&hasKnownArtist(work)?'Location or artist':FIELD_LABELS[field];}
export function referenceFor(work,field){return choiceAnswers(work,field).map(shortDetail).join(' or ');}
export function studyFields(focus,work){const fields=focus==='all'?STUDY_FIELDS:focus==='details'?DETAIL_FIELDS:Object.hasOwn(FIELDS,focus)?[focus]:[];return work?fields.filter(field=>fieldAvailable(work,field)):fields;}
export function quizFactFields(work){const fields=[...FACT_FIELDS,'recommendation'];return work?fields.filter(field=>fieldAvailable(work,field)):fields;}

export const STORAGE_KEY='ap-art-history-12-25-v1';
export const normalize=value=>String(value??'').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[’']/g,'').replace(/tutankham[eo]n/g,'tutankhamun').replace(/[^a-z0-9]+/g,' ').trim().replace(/\s+/g,' ');
export function hasPhrase(text,phrase){return (` ${normalize(text)} `).includes(` ${normalize(phrase)} `);}
export function shuffle(items,random=Math.random){const list=[...items];for(let i=list.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[list[i],list[j]]=[list[j],list[i]];}return list;}
export function getWork(id){return WORKS.find(work=>work.id===Number(id));}
export function answerFor(work,field){if(field==='recommendation')return RECOMMENDATIONS[work.id].answer;if(field==='culture')return `${work.culture} · ${work.period}`;if(field==='context')return work.goTo;return work[field]??'';}
const status=(state,message,extra={})=>({status:state,message,...extra});
const materialVocabulary=['mud brick','mudbrick','gypsum','shell','lapis lazuli','red limestone','black limestone','greywacke','graywacke','alabaster','basalt','diorite','granite','sandstone','limestone','wood','gold','silver','bronze','marble','papyrus','enamel','semiprecious stones','ivory','terracotta','clay','oil paint'];

export function dateIntervals(work){return work.dateNumbers.flatMap(list=>work.id===20?list.map(n=>[n,n]):[[Math.min(...list),Math.max(...list)]]);}
export function dateInRange(work,year){return Number.isInteger(year)&&dateIntervals(work).some(([lo,hi])=>year>=lo&&year<=hi);}
export function choiceAnswer(work,field){return field==='artist'?(work.id===21?'Senenmut (traditionally attributed)':'Unknown / unrecorded'):answerFor(work,field);}
export function choiceAnswers(work,field){return [choiceAnswer(work,field),...(field==='location'&&hasKnownArtist(work)?[choiceAnswer(work,'artist')]:[])];}
export function choiceIsCorrect(work,field,value){return choiceAnswers(work,field).some(answer=>normalize(shortDetail(answer))===normalize(shortDetail(value)));}
export function makeChoices(work,field,random=Math.random){
 const answers=choiceAnswers(work,field),correct=answers[0];
 let pool;
 if(field==='recommendation'){
  const category=RECOMMENDATIONS[work.id].field;
  pool=category==='date'?WORKS.flatMap(other=>other.dateNumbers.flat().map(year=>`${year} BCE`)):category==='location'?WORKS.map(other=>shortDetail(other.location)):['Egyptian, New Kingdom','Egyptian, Old Kingdom','Egyptian, Predynastic','Egyptian, Amarna period','Sumerian','Babylonian','Assyrian'];
 }
 else if(field==='artist')pool=['Unknown / unrecorded','Senenmut (traditionally attributed)','Imhotep','Thutmose'];
 else if(field==='date')pool=WORKS.filter(other=>!dateIntervals(other).some(([a,b])=>dateIntervals(work).some(([c,d])=>a<=d&&c<=b))).map(other=>other.date);
 else pool=WORKS.filter(other=>other.id!==work.id).map(other=>choiceAnswer(other,field));
 // Keep the intended answers and exclude equivalent distractors.
 pool=[...new Map(pool.map(value=>[normalize(shortDetail(value)),value])).values()].filter(value=>normalize(shortDetail(value))!==normalize(shortDetail(correct))&&checkAnswer(work,field,value).status!=='correct'&&checkAnswer(work,field,shortDetail(value)).status!=='correct');
 const options=shuffle([...answers,...shuffle(pool,random).slice(0,4-answers.length)],random);
 if(options.length!==4)throw new Error(`Not enough distinct choices: ${work.id} ${field}`);
 return {options,answer:correct,...(answers.length>1?{answers}:{})};
}
function refreshLocationChoices(work,field,question,selected){
 if(field!=='location'||!hasKnownArtist(work))return question;
 const answers=choiceAnswers(work,field),options=[...question.options];
 for(const answer of answers)if(!options.includes(answer)){
  const index=options.findIndex(option=>!choiceIsCorrect(work,field,option)&&option!==selected);
  if(index>=0)options[index]=answer;
 }
 return {...question,options,answers};
}
export function makeStudyQuestions({focus='material',ids=WORKS.map(w=>w.id),mode='type',randomize=false,random=Math.random}={}){
 const questions=ids.flatMap(id=>{const work=getWork(id),fields=mode==='choice'?studyFields(focus,work):Object.hasOwn(FIELDS,focus)&&fieldAvailable(work,focus)?[focus]:[];return fields.map(field=>({id,field,...(mode==='choice'?makeChoices(work,field,random):{})}));});
 return randomize?shuffle(questions,random):questions;
}

export function checkAnswer(work,field,answer){
 const input=normalize(answer);
 if(!input)return status('incorrect','No answer entered.');
 if(field==='recommendation')return checkAnswer(work,RECOMMENDATIONS[work.id].field,answer);
 if(field==='name'){
  const candidates=[work.name,work.shortName,...work.nameAliases].map(normalize);
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
  const nums=(String(answer).replace(/(\d),(?=\d{3}\b)/g,'$1').match(/\d+/g)??[]).map(Number);
  const era=String(answer).replace(/\./g,'').toUpperCase();
  if(/\b(?:AD|CE)\b/.test(era))return status('incorrect','These works date to BCE.');
  if(/\b(or|not|before|after|century|centuries)\b/.test(input)||nums.length<1||nums.length>2)return status('review','Enter a year or range from the listed dates.');
  if(work.id===20&&(/temple\s*:?\s*(?:c\.?\s*)?1250/i.test(answer)||/hall\s*:?\s*(?:c\.?\s*)?1550/i.test(answer)))return status('incorrect','Temple: 1550 BCE. Hall: 1250 BCE.');
  const accepted=nums.length===1?dateInRange(work,nums[0]):work.id===20?nums.includes(1550)&&nums.includes(1250):dateIntervals(work).some(([lo,hi])=>nums.every(n=>n>=lo&&n<=hi));
  if(!accepted)return status('incorrect',work.id===20?'Use 1550 BCE for the temple or 1250 BCE for the hall.':'Outside the accepted date range.');
  return status('correct',/\bBC(?:E)?\b/.test(era)?'Accepted date.':'Accepted date (BCE).');
 }
 if(field==='location'){
  if(hasKnownArtist(work)&&['senenmut','senmut','senemut'].includes(normalize(shortDetail(answer))))return status('correct','Artist recognized.');
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
 if(field==='context'||field==='all'||field==='details')return status('review','Compare your recall with the facts below, then mark it yourself.');
 return status('review','Compare your answer with the reference.');
}

export function defaultStore(){return {version:1,stats:{},history:[],focus:'material',mode:'type',study:null,quiz:null};}
export function sanitizeStore(raw){
 const clean=defaultStore();if(!raw||typeof raw!=='object'||raw.version!==1)return clean;
 const fields=[...Object.keys(FIELDS),'context','artist'];
 clean.focus=raw.focus==='context'?'details':raw.focus==='artist'?'location':fields.includes(raw.focus)?raw.focus:'material';
 if(raw.archivedStudy&&typeof raw.archivedStudy==='object')clean.archivedStudy=raw.archivedStudy;
 clean.mode=raw.mode==='choice'?'choice':'type';
 for(const w of WORKS){const saved=raw.stats?.[w.id];if(!saved||typeof saved!=='object')continue;clean.stats[w.id]={};for(const f of fields){const v=saved[f];if(v&&typeof v==='object'){clean.stats[w.id][f]={seen:Math.max(0,Math.min(100000,Number(v.seen)||0)),correct:Math.max(0,Math.min(100000,Number(v.correct)||0)),streak:Math.max(0,Math.min(100000,Number(v.streak)||0)),lastCorrect:v.lastCorrect===true};}}}
 clean.history=Array.isArray(raw.history)?raw.history.slice(0,30).filter(x=>x&&typeof x==='object'):[];
 const s=raw.study;
 if(s&&fields.includes(s.focus)&&Array.isArray(s.queue)&&s.queue.length>0&&s.queue.length<=100&&s.queue.every(id=>getWork(id))&&Number.isInteger(s.index)&&s.index>=0&&s.index<=s.queue.length){
  clean.study={...s,typed:typeof s.typed==='string'?s.typed.slice(0,3000):'',again:Array.isArray(s.again)?s.again.filter(id=>getWork(id)):[],correct:Number(s.correct)||0,filter:s.filter==='missed'?'missed':'all',revealed:!!s.revealed,image:Number.isInteger(s.image)?s.image:0};
  const valid=Array.isArray(s.questions)&&s.questions.length===s.queue.length&&s.questions.every((q,i)=>q?.id===s.queue[i]&&fields.includes(q.field)&&(s.mode!=='choice'||validChoices(getWork(q.id),q.field,q)));
  if(valid){clean.study.mode=s.mode==='choice'?'choice':'type';clean.study.responses=s.responses&&typeof s.responses==='object'?s.responses:{};clean.study.ratings=s.ratings&&typeof s.ratings==='object'?s.ratings:{};}
  else if(s.mode==='choice')clean.study=null;
  else{clean.study.mode='type';clean.study.responses={};clean.study.questions=s.queue.map(id=>({id,field:s.focus}));clean.study.ratings=Object.fromEntries(s.queue.flatMap((id,i)=>typeof s.ratings?.[id]==='boolean'?[[i,s.ratings[id]]]:[]));}
 }
 if(clean.study){
  const session=clean.study;
  if(session.focus==='context'||session.focus==='artist'){clean.archivedStudy=session;clean.study=null;}
  else{
   const kept=session.questions.map((question,index)=>({question,index})).filter(({question})=>fieldAvailable(getWork(question.id),question.field));
   if(kept.length!==session.questions.length){
    session.retiredQuestions=[...(Array.isArray(session.retiredQuestions)?session.retiredQuestions:[]),...session.questions.flatMap((question,index)=>fieldAvailable(getWork(question.id),question.field)?[]:[{question,rating:session.ratings[index],response:session.responses[index],typed:index===session.index?session.typed:''}])];
    const currentKept=kept.some(({index})=>index===session.index);
    session.index=kept.filter(({index})=>index<session.index).length;
    session.questions=kept.map(x=>x.question);session.queue=session.questions.map(x=>x.id);
    session.ratings=Object.fromEntries(kept.flatMap(({index},next)=>typeof session.ratings[index]==='boolean'?[[next,session.ratings[index]]]:[]));
    session.responses=Object.fromEntries(kept.flatMap(({index},next)=>typeof session.responses[index]==='string'?[[next,session.responses[index]]]:[]));
    session.correct=Object.values(session.ratings).filter(Boolean).length;session.again=Object.entries(session.ratings).filter(([,value])=>!value).map(([index])=>session.queue[Number(index)]);
    if(!currentKept){session.typed='';session.revealed=Object.hasOwn(session.responses,session.index);session.image=0;}
    if(!kept.length)clean.archivedStudy=session;
   }
  }
 }
 if(clean.study?.mode==='choice')clean.study.questions=clean.study.questions.map((question,index)=>refreshLocationChoices(getWork(question.id),question.field,question,clean.study.responses[index]));
 const q=raw.quiz;
 if(q&&['active','review'].includes(q.status)&&Array.isArray(q.questions)&&q.questions.length>0&&q.questions.length<=14&&new Set(q.questions.map(x=>x.id)).size===q.questions.length&&q.questions.every(x=>getWork(x.id)&&Number.isInteger(x.image)&&getWork(x.id).images[x.image]?.quiz)&&Number.isInteger(q.index)&&q.index>=0&&q.index<q.questions.length&&Number.isFinite(q.startedAt)){
  const answers={};for(const question of q.questions){const a=q.answers?.[question.id];answers[question.id]={name:typeof a?.name==='string'?a.name.slice(0,3000):'',material:typeof a?.material==='string'?a.material.slice(0,3000):'',fact:typeof a?.fact==='string'?a.fact.slice(0,3000):'',factField:[...quizFactFields(getWork(question.id)),'artist'].includes(a?.factField)?a.factField:null};if(a?.retiredFact)answers[question.id].retiredFact=a.retiredFact;if(q.status==='active'&&answers[question.id].factField==='artist'&&hasKnownArtist(getWork(question.id)))answers[question.id].factField='location';else if(q.status==='active'&&answers[question.id].factField==='artist'){answers[question.id].retiredFact={fact:answers[question.id].fact,factField:'artist'};answers[question.id].factField='date';answers[question.id].fact='';}}
  const grades={};if(q.status==='review'){for(const question of q.questions){const g=q.grades?.[question.id]??{};grades[question.id]={};for(const field of ['name','material','fact'])grades[question.id][field]=g[field]===true?true:g[field]===false?false:null;}}
  clean.quiz={...q,answers,grades,status:q.status,mode:q.mode==='choice'?'choice':'type',part:[0,1,2].includes(q.part)?q.part:0,timerMinutes:[0,10,15,20].includes(q.timerMinutes)?q.timerMinutes:0,finishedAt:Number.isFinite(q.finishedAt)?q.finishedAt:null,recorded:!!q.recorded};
  if(clean.quiz.mode==='choice')for(const question of clean.quiz.questions){const w=getWork(question.id);question.choices??={};for(const f of ['name','material',...quizFactFields(w)]){if(!validChoices(w,f,question.choices[f]))question.choices[f]=makeChoices(w,f);if(q.status==='active')question.choices[f]=refreshLocationChoices(w,f,question.choices[f],answers[w.id].factField===f?answers[w.id].fact:null);}}
 }
 return clean;
}
export function recordRecall(store,id,field,correct){store.stats[id]??={};const stat=store.stats[id][field]??{seen:0,correct:0,streak:0};store.stats[id][field]={seen:stat.seen+1,correct:stat.correct+(correct?1:0),streak:correct?stat.streak+1:0,lastCorrect:correct};}
export function needsPractice(store,id,field){const stats=store.stats[id]??{},work=getWork(id);const fields=field==='all'?[...studyFields('all',work),'all','details','recommendation']:field==='details'?[...studyFields('details',work),'details','recommendation']:fieldAvailable(work,field)?[field]:[];return fields.some(f=>stats[f]?.seen>0&&!stats[f].lastCorrect);}
export function materialReadyCount(store){return WORKS.filter(w=>(store.stats[w.id]?.material?.streak??0)>=2).length;}
export function quizProgress(quiz){return quiz.questions.filter(q=>{const a=quiz.answers[q.id];return a&&a.name.trim()&&a.material.trim()&&a.fact.trim()&&quizFactFields(getWork(q.id)).includes(a.factField);}).length;}
export function makeQuiz({count=14,ids=WORKS.map(w=>w.id),alternateViews=false,timerMinutes=0,mode='type',factField='date',random=Math.random}={}){
 const questions=shuffle(ids,random).slice(0,count).map(id=>{const work=getWork(id);const views=work.images.map((im,i)=>im.quiz?i:null).filter(i=>i!==null);return {id,image:alternateViews?views[Math.floor(random()*views.length)]:0,...(mode==='choice'?{choices:Object.fromEntries(['name','material',...quizFactFields(work)].map(f=>[f,makeChoices(work,f,random)]))}:{})};});
 const answers=Object.fromEntries(questions.map(q=>[q.id,{name:'',material:'',fact:'',factField:factField==='artist'&&hasKnownArtist(getWork(q.id))?'location':quizFactFields(getWork(q.id)).includes(factField)?factField:'date'}]));
 return {id:`quiz-${Date.now()}`,status:'active',questions,index:0,part:0,mode,answers,grades:{},startedAt:Date.now(),finishedAt:null,timerMinutes,alternateViews,recorded:false};
}
function validChoices(work,field,q){return [...STUDY_FIELDS,'recommendation','context','artist'].includes(field)&&q?.answer===choiceAnswer(work,field)&&Array.isArray(q.options)&&q.options.length===4&&new Set(q.options).size===4&&q.options.includes(q.answer)&&q.options.every(x=>typeof x==='string'&&x.length<=3000);}
export function finishQuiz(quiz){quiz.status='review';quiz.finishedAt=Date.now();quiz.grades={};for(const q of quiz.questions){const w=getWork(q.id),a=quiz.answers[q.id]??{};quiz.grades[q.id]={};for(const key of ['name','material','fact']){const field=key==='fact'?a.factField:key;if(!a[key]?.trim()){quiz.grades[q.id][key]=false;continue;}if(!field){quiz.grades[q.id][key]=null;continue;}if(quiz.mode==='choice'){quiz.grades[q.id][key]=choiceIsCorrect(w,field,a[key]);continue;}const result=checkAnswer(w,field,a[key]);quiz.grades[q.id][key]=result.status==='correct'?true:result.status==='review'?null:false;}}return quiz;}
export function quizScore(quiz){let correct=0,pending=0;for(const question of quiz.questions){for(const field of ['name','material','fact']){const grade=quiz.grades?.[question.id]?.[field];if(grade===true)correct++;else if(grade!==false)pending++;}}return {correct,pending,total:quiz.questions.length*3};}
