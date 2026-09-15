import test from 'node:test';
import assert from 'node:assert/strict';
import {WORKS} from '../dist/data.js';
import {checkAnswer,getWork,makeQuiz,finishQuiz,quizScore,quizProgress,defaultStore,recordRecall,needsPractice,sanitizeStore,hasPhrase} from '../dist/engine.js';

test('all 14 canonical titles, material lines, and dates are recognized',()=>{for(const w of WORKS)for(const field of ['name','material','date'])assert.equal(checkAnswer(w,field,w[field]).status,'correct',`${w.id}: ${field}`);});
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
test('dates require BCE, the full range, and no wrong era',()=>{
 assert.equal(checkAnswer(getWork(25),'date','720–705').status,'partial');
 assert.equal(checkAnswer(getWork(25),'date','720–705 CE').status,'incorrect');
 assert.notEqual(checkAnswer(getWork(25),'date','720 BCE').status,'correct');
 assert.equal(checkAnswer(getWork(20),'date','Temple 1550 BCE; hall 1250 BCE').status,'correct');
 assert.notEqual(checkAnswer(getWork(20),'date','temple 1250 BCE; hall 1550 BCE').status,'correct');
});
test('Babylon and Susa require the correct countries',()=>{
 assert.equal(checkAnswer(getWork(19),'location','Babylon, Iraq').status,'correct');
 assert.equal(checkAnswer(getWork(19),'location','Susa, Iran').status,'correct');
 for(const text of ['Babylon, Iran','Susa, Iraq'])assert.notEqual(checkAnswer(getWork(19),'location',text).status,'correct');
});
test('rulers are not silently accepted as artists',()=>{assert.notEqual(checkAnswer(getWork(18),'artist','Menkaure').status,'correct');assert.equal(checkAnswer(getWork(18),'artist','Unknown').status,'correct');assert.equal(checkAnswer(getWork(21),'artist','Senenmut').status,'correct');});
test('a full quiz uses each work once and no study-only views',()=>{for(let run=0;run<30;run++){const q=makeQuiz({alternateViews:true});assert.equal(q.questions.length,14);assert.equal(new Set(q.questions.map(x=>x.id)).size,14);assert.ok(q.questions.every(x=>getWork(x.id).images[x.image].quiz));}});
test('a subset quiz never adds unselected works',()=>{const q=makeQuiz({ids:[14,16,23],count:5});assert.equal(q.questions.length,3);assert.deepEqual(q.questions.map(x=>x.id).sort((a,b)=>a-b),[14,16,23]);});
test('fact review cannot be mistaken for a confirmed final score',()=>{const q=makeQuiz({count:5});for(const x of q.questions){const w=getWork(x.id);q.answers[x.id]={name:w.name,material:w.material,fact:w.goTo};}assert.equal(quizProgress(q),5);finishQuiz(q);assert.deepEqual(quizScore(q),{correct:10,pending:5,total:15});for(const x of q.questions)q.grades[x.id].fact=true;assert.deepEqual(quizScore(q),{correct:15,pending:0,total:15});});
test('empty answers score zero and are not pending',()=>{const q=makeQuiz({count:5});finishQuiz(q);assert.deepEqual(quizScore(q),{correct:0,pending:0,total:15});});
test('missed practice clears after successful recall',()=>{const s=defaultStore();assert.equal(needsPractice(s,16,'material'),false);recordRecall(s,16,'material',false);assert.equal(needsPractice(s,16,'material'),true);recordRecall(s,16,'material',true);assert.equal(needsPractice(s,16,'material'),false);});
test('malformed saved data cannot introduce an invalid work or quiz index',()=>{assert.deepEqual(sanitizeStore(null),defaultStore());const s=defaultStore();s.study={focus:'material',queue:[999],index:0};assert.equal(sanitizeStore(s).study,null);const q=makeQuiz();q.index=99;s.quiz=q;assert.equal(sanitizeStore(s).quiz,null);});
test('valid sessions preserve answers and marks through storage',()=>{const s=defaultStore();s.quiz=makeQuiz({count:5});const id=s.quiz.questions[0].id;s.quiz.answers[id]={name:'typed title',material:'typed material',fact:'typed fact'};assert.deepEqual(sanitizeStore(JSON.parse(JSON.stringify(s))).quiz.answers[id],s.quiz.answers[id]);finishQuiz(s.quiz);s.quiz.grades[id].fact=true;assert.equal(sanitizeStore(s).quiz.grades[id].fact,true);});
