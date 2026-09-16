import test from 'node:test';
import assert from 'node:assert/strict';
import {WORKS,FIELDS,shortDetail} from '../dist/data.js';
import {checkAnswer,getWork,makeQuiz,finishQuiz,quizScore,quizProgress,defaultStore,recordRecall,needsPractice,sanitizeStore,hasPhrase,STUDY_FIELDS,DETAIL_FIELDS,studyFields,FACT_FIELDS,makeChoices,makeStudyQuestions,dateIntervals,dateInRange,choiceAnswer,hasKnownArtist,quizFactFields,choiceIsCorrect,choiceAnswers,referenceFor,fieldLabel} from '../dist/engine.js';

test('all 14 canonical titles, material lines, and dates are recognized',()=>{for(const w of WORKS)for(const field of ['name','material','date'])assert.equal(checkAnswer(w,field,w[field]).status,'correct',`${w.id}: ${field}`);});
test('concise identification answers are accepted without parenthetical detail',()=>{
 for(const w of WORKS)for(const field of ['name','material','date','location','artist','culture']){const short=shortDetail(choiceAnswer(w,field));assert.ok(!/[()]/.test(short),`${w.id}: ${field}`);assert.equal(checkAnswer(w,field,short).status,'correct',`${w.id}: ${field}: ${short}`);}
 assert.equal(shortDetail(getWork(25).name),'Lamassu');
 assert.equal(shortDetail(getWork(12).location),'Uruk, Iraq');
 assert.equal(shortDetail(getWork(21).material),'Sandstone and red granite');
 assert.equal(shortDetail(getWork(21).artist),'Senenmut');
 for(const w of WORKS)for(const field of studyFields('all',w)){const q=makeChoices(w,field);assert.equal(new Set(q.options.map(shortDetail)).size,4,`${w.id}: ${field}`);}
});
test('multi-material answers require every component',()=>{
 const cases=[[14,'gypsum','shell'],[14,'gypsum inlaid with shell and limestone','black limestone'],[16,'shell, lapis lazuli and red limestone','wood'],[16,'wood inlaid with lapis lazuli and shell','red limestone'],[20,'cut sandstone','mud brick'],[21,'sandstone','red granite'],[23,'gold','enamel'],[23,'gold inlaid with semiprecious stones','enamel']];
 for(const [id,input,missing] of cases){const result=checkAnswer(getWork(id),'material',input);assert.notEqual(result.status,'correct');assert.ok(result.missing.includes(missing),`${id}: ${missing}`);}
});
test('surface treatments, stone colors, and scroll format matter',()=>{for(const [id,input] of [[15,'limestone'],[17,'limestone'],[24,'papyrus'],[24,'painted papyrus'],[14,'gypsum inlaid with shell and limestone']])assert.notEqual(checkAnswer(getWork(id),'material',input).status,'correct');});
test('word boundaries do not treat limestone as sandstone or Ur as Uruk',()=>{assert.equal(hasPhrase('sandstone','stone'),false);assert.equal(hasPhrase('uruk','ur'),false);assert.notEqual(checkAnswer(getWork(16),'location','Uruk, Iraq').status,'correct');});
test('case, punctuation, spelling variants, and list order are supported',()=>{
 assert.equal(checkAnswer(getWork(13),'material','Graywacke').status,'correct');
 assert.equal(checkAnswer(getWork(16),'material','LAPIS LAZULI, RED LIMESTONE, and SHELL inlaid in WOOD').status,'correct');
 assert.equal(checkAnswer(getWork(23),'name','Innermost coffin of Tutankhamen').status,'correct');
 assert.equal(checkAnswer(getWork(24),'name','Last judgement of Hunefer').status,'correct');
});
test('contradictory or extra materials require review',()=>{for(const input of ['not basalt','basalt or marble','basalt and bronze'])assert.equal(checkAnswer(getWork(19),'material',input).status,'review');});
test('each course date variant is recognized with BCE',()=>{for(const w of WORKS)for(const list of w.dateNumbers)assert.equal(checkAnswer(w,'date',`${list.join('–')} B.C.E.`).status,'correct');});
test('dates accept in-range years and infer BCE, while rejecting CE and reversed Karnak labels',()=>{
 assert.equal(checkAnswer(getWork(25),'date','720–705').status,'correct');
 assert.equal(checkAnswer(getWork(25),'date','720–705 CE').status,'incorrect');
 assert.equal(checkAnswer(getWork(25),'date','720 BCE').status,'correct');
 assert.equal(checkAnswer(getWork(25),'date','710').status,'correct');
 assert.equal(checkAnswer(getWork(25),'date','705 B.C.').status,'correct');
 assert.equal(checkAnswer(getWork(25),'date','706–719 BCE').status,'correct');
 for(const input of ['704 BCE','721 BCE','710 CE','710 BCE or 720 CE','700–720 BCE'])assert.notEqual(checkAnswer(getWork(25),'date',input).status,'correct');
 assert.equal(checkAnswer(getWork(20),'date','Temple 1550 BCE; hall 1250 BCE').status,'correct');
 assert.notEqual(checkAnswer(getWork(20),'date','temple 1250 BCE; hall 1550 BCE').status,'correct');
 for(const year of [1550,1250])assert.equal(checkAnswer(getWork(20),'date',year).status,'correct');
 assert.equal(checkAnswer(getWork(20),'date','1400 BCE').status,'incorrect');
 assert.equal(checkAnswer(getWork(12),'date','3,250 BCE').status,'correct');
 for(const w of WORKS)for(const [lo,hi] of dateIntervals(w))for(const year of [lo,hi,Math.floor((lo+hi)/2)])assert.equal(checkAnswer(w,'date',`${year} BCE`).status,'correct',`${w.id}: ${year}`);
});
test('Babylon and Susa require the correct countries',()=>{
 assert.equal(checkAnswer(getWork(19),'location','Babylon, Iraq').status,'correct');
 assert.equal(checkAnswer(getWork(19),'location','Susa, Iran').status,'correct');
 for(const text of ['Babylon, Iran','Susa, Iraq'])assert.notEqual(checkAnswer(getWork(19),'location',text).status,'correct');
});
test('rulers are not silently accepted as artists',()=>{assert.notEqual(checkAnswer(getWork(18),'artist','Menkaure').status,'correct');assert.equal(checkAnswer(getWork(18),'artist','Unknown').status,'correct');assert.equal(checkAnswer(getWork(21),'artist','Senenmut').status,'correct');});
test('Hatshepsut accepts either the location or the named artist as one detail',()=>{
 const work=getWork(21);
 for(const answer of ['Deir el-Bahri, Egypt','Luxor, Egypt','Thebes, Egypt','Senenmut','senmut','Senemut',work.artist])assert.equal(checkAnswer(work,'location',answer).status,'correct',answer);
 for(const answer of ['Imhotep','Unknown','not Senenmut','Senenmut or Imhotep'])assert.notEqual(checkAnswer(work,'location',answer).status,'correct',answer);
 for(const other of WORKS.filter(w=>w.id!==21))assert.notEqual(checkAnswer(other,'location','Senenmut').status,'correct');
 assert.equal(fieldLabel(work,'location'),'Location or artist');assert.equal(fieldLabel(getWork(12),'location'),'Location');
 assert.equal(referenceFor(work,'location'),'Deir el-Bahri, Egypt or Senenmut');
 const deck=makeStudyQuestions({focus:'location',mode:'choice'});assert.equal(deck.length,14);
 const question=deck.find(q=>q.id===21);assert.equal(question.answers.length,2);assert.ok(question.answers.every(a=>question.options.includes(a)));
});
test('either Hatshepsut choice earns one detail point in typed and multiple-choice quizzes',()=>{
 for(const mode of ['type','choice'])for(const fact of choiceAnswers(getWork(21),'location')){
  const quiz=makeQuiz({ids:[21],mode,factField:'location'}),work=getWork(21);
  Object.assign(quiz.answers[21],{name:work.name,material:work.material,fact});
  assert.equal(quizProgress(quiz),1);finishQuiz(quiz);assert.deepEqual(quizScore(quiz),{correct:3,pending:0,total:3});
 }
});
test('old location choices gain the artist without losing the selected answer or marks',()=>{
 for(const selectedCorrect of [true,false]){
  const store=defaultStore(),work=getWork(21),question={id:21,field:'location',answer:work.location,options:[work.location,getWork(12).location,getWork(13).location,getWork(17).location]};
  const selected=question.options[selectedCorrect?0:1];
  store.focus='location';store.mode='choice';store.study={focus:'location',mode:'choice',queue:[21],questions:[question],index:0,revealed:true,responses:{0:selected},ratings:{0:selectedCorrect}};
  const clean=sanitizeStore(JSON.parse(JSON.stringify(store))),upgraded=clean.study.questions[0];
  assert.equal(upgraded.options.length,4);assert.equal(new Set(upgraded.options).size,4);assert.ok(upgraded.options.includes(selected));assert.ok(upgraded.answers.every(a=>upgraded.options.includes(a)));assert.equal(clean.study.responses[0],selected);assert.equal(clean.study.ratings[0],selectedCorrect);
  assert.deepEqual(sanitizeStore(JSON.parse(JSON.stringify(clean))).study,clean.study);
 }
});
test('saved artist quizzes merge into location and saved artist studies remain recoverable',()=>{
 for(const mode of ['type','choice']){
  const store=defaultStore();store.quiz=makeQuiz({ids:[21],mode});
  const work=getWork(21);Object.assign(store.quiz.answers[21],{name:work.name,material:work.material,fact:'Senenmut (traditionally attributed)',factField:'artist'});
  if(mode==='choice')store.quiz.questions[0].choices.location={answer:work.location,options:[work.location,getWork(12).location,getWork(13).location,getWork(17).location]};
  store.focus='artist';store.study={focus:'artist',mode:'type',queue:[21],questions:[{id:21,field:'artist'}],index:0,typed:'Senenmut',responses:{},ratings:{}};recordRecall(store,21,'artist',true);
  const clean=sanitizeStore(JSON.parse(JSON.stringify(store)));
  assert.equal(clean.focus,'location');assert.equal(clean.study,null);assert.equal(clean.archivedStudy.typed,'Senenmut');assert.equal(clean.stats[21].artist.correct,1);
  assert.equal(clean.quiz.answers[21].factField,'location');assert.equal(clean.quiz.answers[21].fact,store.quiz.answers[21].fact);
  if(mode==='choice')assert.ok(clean.quiz.questions[0].choices.location.options.includes(clean.quiz.answers[21].fact));
  assert.deepEqual(sanitizeStore(JSON.parse(JSON.stringify(clean))).quiz,clean.quiz);
  finishQuiz(clean.quiz);assert.deepEqual(quizScore(clean.quiz),{correct:3,pending:0,total:3});
 }
});
test('a full quiz uses each work once and no study-only views',()=>{for(let run=0;run<30;run++){const q=makeQuiz({alternateViews:true});assert.equal(q.questions.length,14);assert.equal(new Set(q.questions.map(x=>x.id)).size,14);assert.ok(q.questions.every(x=>getWork(x.id).images[x.image].quiz));}});
test('a subset quiz never adds unselected works',()=>{const q=makeQuiz({ids:[14,16,23],count:5});assert.equal(q.questions.length,3);assert.deepEqual(q.questions.map(x=>x.id).sort((a,b)=>a-b),[14,16,23]);});
test('the third answer is graded against the selected category',()=>{for(const field of FACT_FIELDS){const q=makeQuiz({count:5,factField:field});for(const x of q.questions){const w=getWork(x.id);Object.assign(q.answers[x.id],{name:w.name,material:w.material,fact:choiceAnswer(w,q.answers[x.id].factField)});}assert.equal(quizProgress(q),5);finishQuiz(q);assert.equal(quizScore(q).total,15);assert.ok(quizScore(q).correct>=14);}});
test('an arbitrary fact does not receive automatic credit for a selected date',()=>{const q=makeQuiz({ids:[12],count:1});q.answers[12]={name:getWork(12).name,material:'Mud brick',fact:getWork(12).goTo,factField:'date'};finishQuiz(q);assert.notEqual(q.grades[12].fact,true);});
test('empty answers score zero and are not pending',()=>{const q=makeQuiz({count:5});finishQuiz(q);assert.deepEqual(quizScore(q),{correct:0,pending:0,total:15});});
test('missed practice clears after successful recall',()=>{const s=defaultStore();assert.equal(needsPractice(s,16,'material'),false);recordRecall(s,16,'material',false);assert.equal(needsPractice(s,16,'material'),true);recordRecall(s,16,'material',true);assert.equal(needsPractice(s,16,'material'),false);});
test('malformed saved data cannot introduce an invalid work or quiz index',()=>{assert.deepEqual(sanitizeStore(null),defaultStore());const s=defaultStore();s.study={focus:'material',queue:[999],index:0};assert.equal(sanitizeStore(s).study,null);const q=makeQuiz();q.index=99;s.quiz=q;assert.equal(sanitizeStore(s).quiz,null);});
test('valid sessions preserve answers and marks through storage',()=>{const s=defaultStore();s.quiz=makeQuiz({count:5});const id=s.quiz.questions[0].id;s.quiz.answers[id]={name:'typed title',material:'typed material',fact:'typed fact',factField:'location'};assert.deepEqual(sanitizeStore(JSON.parse(JSON.stringify(s))).quiz.answers[id],s.quiz.answers[id]);finishQuiz(s.quiz);s.quiz.grades[id].fact=true;assert.equal(sanitizeStore(s).quiz.grades[id].fact,true);});

test('all eligible multiple-choice combinations have four unique choices and only the intended accepted answers',()=>{
 for(const w of WORKS)for(const field of studyFields('all',w)){const q=makeChoices(w,field);assert.equal(q.options.length,4);assert.equal(new Set(q.options.map(x=>x.toLowerCase())).size,4);assert.equal(q.options.filter(x=>x===q.answer).length,1);
 assert.equal(q.options.filter(x=>checkAnswer(w,field,shortDetail(x)).status==='correct').length,w.id===21&&field==='location'?2:1,`${w.id}: ${field}`);
 for(const distractor of q.options.filter(x=>!choiceIsCorrect(w,field,x))){assert.notEqual(checkAnswer(w,field,distractor).status,'correct',`${w.id} ${field}: ${distractor}`);if(field==='date'){const other=WORKS.find(x=>x.date===distractor);assert.ok(other);for(const [lo,hi] of dateIntervals(other))for(let n=lo;n<=hi;n++)assert.equal(dateInRange(w,n),false);}}}
});
test('all-details multiple choice covers every work and category',()=>{const qs=makeStudyQuestions({focus:'all',mode:'choice'});assert.equal(qs.length,70);assert.equal(new Set(qs.map(q=>`${q.id}:${q.field}`)).size,70);for(const w of WORKS)assert.deepEqual(qs.filter(q=>q.id===w.id).map(q=>q.field),studyFields('all',w));});
test('Details covers every category except name and material in both modes',()=>{
 assert.deepEqual(studyFields('details'),['date','location','culture']);
 const choices=makeStudyQuestions({focus:'details',mode:'choice'});
 assert.equal(choices.length,42);
 assert.equal(new Set(choices.map(q=>`${q.id}:${q.field}`)).size,42);
 for(const w of WORKS)assert.deepEqual(choices.filter(q=>q.id===w.id).map(q=>q.field),studyFields('details',w));
 const typed=makeStudyQuestions({focus:'details',mode:'type'});
 assert.equal(typed.length,14);assert.ok(typed.every(q=>q.field==='details'));
 for(const mode of ['type','choice']){const s=defaultStore(),questions=mode==='type'?typed:choices;s.focus='details';s.mode=mode;s.study={focus:'details',mode,questions,queue:questions.map(q=>q.id),index:0,typed:'Uruk, Iraq',ratings:{},responses:{}};recordRecall(s,12,'details',true);const clean=sanitizeStore(JSON.parse(JSON.stringify(s)));assert.equal(clean.focus,'details');assert.deepEqual(clean.study.questions,questions);assert.equal(clean.study.typed,'Uruk, Iraq');assert.equal(clean.stats[12].details.correct,1);}
});
test('Details missed practice excludes name and material mistakes',()=>{const s=defaultStore();recordRecall(s,12,'name',false);recordRecall(s,12,'material',false);assert.equal(needsPractice(s,12,'details'),false);recordRecall(s,12,'date',false);assert.equal(needsPractice(s,12,'details'),true);recordRecall(s,12,'date',true);assert.equal(needsPractice(s,12,'details'),false);recordRecall(s,12,'details',false);assert.equal(needsPractice(s,12,'details'),true);});
test('multiple-choice quizzes score all three fields and preserve options on reload',()=>{const s=defaultStore();s.quiz=makeQuiz({mode:'choice',count:5,factField:'artist'});const q=s.quiz;for(const x of q.questions){for(const key of ['name','material','fact'])q.answers[x.id][key]=x.choices[key==='fact'?q.answers[x.id].factField:key].answer;}const restored=sanitizeStore(JSON.parse(JSON.stringify(s))).quiz;assert.deepEqual(restored.questions,q.questions);finishQuiz(restored);assert.deepEqual(quizScore(restored),{correct:15,pending:0,total:15});const id=restored.questions[0].id;restored.answers[id].fact='Wrong answer';finishQuiz(restored);assert.equal(restored.grades[id].fact,false);});
test('legacy answers and study ratings survive migration without claiming a category',()=>{const s=defaultStore();s.study={focus:'material',queue:[12,13],index:1,ratings:{12:true},typed:'greywacke'};s.quiz=makeQuiz({ids:[12],count:1});s.quiz.answers[12]={name:'title',material:'material',fact:'old fact'};const clean=sanitizeStore(s);assert.equal(clean.quiz.answers[12].fact,'old fact');assert.equal(clean.quiz.answers[12].factField,null);assert.equal(quizProgress(clean.quiz),0);assert.equal(clean.study.ratings[0],true);assert.deepEqual(clean.study.responses,{});});
test('mixed study options, answer and rating survive reload',()=>{const s=defaultStore(),questions=makeStudyQuestions({focus:'all',mode:'choice',ids:[12]});s.mode='choice';s.focus='all';s.study={focus:'all',mode:'choice',questions,queue:questions.map(q=>q.id),index:1,responses:{1:questions[1].answer},ratings:{0:true},revealed:true};const clean=sanitizeStore(JSON.parse(JSON.stringify(s)));assert.deepEqual(clean.study.questions,questions);assert.equal(clean.study.responses[1],questions[1].answer);assert.equal(clean.study.ratings[0],true);assert.equal(clean.study.revealed,true);});
test('Context and separate artist questions are removed in every study mode',()=>{
 assert.equal(Object.hasOwn(FIELDS,'context'),false);assert.equal(Object.hasOwn(FIELDS,'artist'),false);
 for(const mode of ['type','choice']){
  assert.deepEqual(makeStudyQuestions({focus:'artist',mode}).map(q=>q.id),[]);
  assert.deepEqual(makeStudyQuestions({focus:'artist',mode,ids:[12]}),[]);
  assert.deepEqual(makeStudyQuestions({focus:'context',mode}),[]);
  for(const focus of ['all','details'])for(const q of makeStudyQuestions({focus,mode})){
   assert.notEqual(q.field,'context');
   assert.notEqual(q.field,'artist');
   assert.equal(studyFields(focus,getWork(12)).includes('artist'),false);
   assert.equal(studyFields(focus,getWork(21)).includes('artist'),false);
  }
 }
 const store=defaultStore();recordRecall(store,12,'context',false);recordRecall(store,12,'artist',false);assert.equal(needsPractice(store,12,'all'),false);assert.equal(needsPractice(store,12,'details'),false);
});
test('quizzes never select unknown artists or offer them as the third-answer category',()=>{
 for(const mode of ['type','choice']){const q=makeQuiz({mode,factField:'artist'});for(const question of q.questions){const named=question.id===21;assert.equal(q.answers[question.id].factField,named?'location':'date');assert.equal(quizFactFields(getWork(question.id)).includes('artist'),false);if(mode==='choice')assert.equal(Object.hasOwn(question.choices,'artist'),false);}}
});
test('saved mixed sessions remove retired questions and keep the current answer and marks',()=>{
 const store=defaultStore(),fields=['name','context','artist','material','date'];
 const questions=fields.map(field=>({id:12,field,...makeChoices(getWork(12),field)}));
 store.focus='all';store.mode='choice';store.study={focus:'all',mode:'choice',questions,queue:questions.map(q=>q.id),index:3,revealed:true,ratings:{0:true,1:false,2:true},responses:{0:questions[0].answer,1:questions[1].answer,2:questions[2].answer,3:questions[3].answer}};
 const clean=sanitizeStore(JSON.parse(JSON.stringify(store)));
 assert.deepEqual(clean.study.questions.map(q=>q.field),['name','material','date']);assert.equal(clean.study.index,1);assert.equal(clean.study.responses[1],questions[3].answer);assert.deepEqual(clean.study.ratings,{0:true});assert.equal(clean.study.retiredQuestions.length,2);assert.equal(clean.study.revealed,true);
 assert.deepEqual(sanitizeStore(JSON.parse(JSON.stringify(clean))).study,clean.study);
 store.study.index=1;store.study.typed='previous context answer';const atRemoved=sanitizeStore(store);assert.equal(atRemoved.study.index,1);assert.equal(atRemoved.study.retiredQuestions[0].typed,'previous context answer');
});
test('retired context sessions and active quiz answers remain recoverable',()=>{
 const store=defaultStore();store.focus='context';store.study={focus:'context',queue:[12],index:0,typed:'old context answer'};const clean=sanitizeStore(store);assert.equal(clean.focus,'details');assert.equal(clean.study,null);assert.equal(clean.archivedStudy.typed,'old context answer');
 store.quiz=makeQuiz({ids:[12],count:1,mode:'choice'});store.quiz.answers[12]={name:'White Temple',material:'mud brick',fact:'Unknown',factField:'artist'};
 const migrated=sanitizeStore(store);assert.equal(migrated.quiz.answers[12].name,'White Temple');assert.equal(migrated.quiz.answers[12].material,'mud brick');assert.equal(migrated.quiz.answers[12].factField,'date');assert.equal(migrated.quiz.answers[12].fact,'');assert.equal(migrated.quiz.answers[12].retiredFact.fact,'Unknown');assert.ok(migrated.quiz.questions[0].choices.date);
 assert.deepEqual(sanitizeStore(JSON.parse(JSON.stringify(migrated))).quiz.answers,migrated.quiz.answers);
 store.quiz.status='review';store.quiz.grades[12]={name:true,material:true,fact:true};assert.equal(sanitizeStore(store).quiz.answers[12].fact,'Unknown');assert.equal(sanitizeStore(store).quiz.grades[12].fact,true);
});
