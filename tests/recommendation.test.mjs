import test from 'node:test';
import assert from 'node:assert/strict';
import {WORKS,FIELDS,RECOMMENDATIONS,shortDetail} from '../dist/data.js';
import {getWork,referenceFor,checkAnswer,makeStudyQuestions,makeQuiz,quizProgress,finishQuiz,quizScore,sanitizeStore,defaultStore,recordRecall,needsPractice,choiceIsCorrect,dateIntervals} from '../dist/engine.js';

test('Recommendation uses the agreed nine answers across all fourteen works',()=>{
 const answers=['3000 BCE','3000 BCE','2700 BCE','2500 BCE','2500 BCE','2500 BCE','Giza, Egypt','1750 BCE','Egyptian, New Kingdom','Egyptian, New Kingdom','Amarna, Egypt','Egyptian, New Kingdom','Egypt','720 BCE'];
 assert.equal(FIELDS.recommendation.label,'Recommendation');
 assert.equal(new Set(answers).size,9);
 assert.deepEqual(WORKS.map(w=>referenceFor(w,'recommendation')),answers);
 for(const work of WORKS){const rec=RECOMMENDATIONS[work.id];assert.equal(checkAnswer(work,rec.field,rec.answer).status,'correct');assert.equal(checkAnswer(work,'recommendation',rec.answer).status,'correct');}
});

test('Recommendation creates fourteen questions with plausible choices and one correct option',()=>{
 for(const mode of ['type','choice']){
  const questions=makeStudyQuestions({focus:'recommendation',mode});
  assert.equal(questions.length,14);assert.equal(new Set(questions.map(q=>q.id)).size,14);
  for(const question of questions){
   assert.equal(question.field,'recommendation');
   if(mode!=='choice')continue;
   const work=getWork(question.id),rec=RECOMMENDATIONS[work.id];
   assert.equal(question.answer,rec.answer);assert.equal(question.options.length,4);assert.equal(new Set(question.options.map(shortDetail)).size,4);
   assert.equal(question.options.filter(option=>choiceIsCorrect(work,'recommendation',option)).length,1);
   assert.equal(question.options.filter(option=>checkAnswer(work,'recommendation',shortDetail(option)).status==='correct').length,1);
   if(rec.field==='date')assert.ok(question.options.every(option=>/^\d+ BCE$/.test(option)));
  }
 }
});

test('recommended dates retain inclusive date ranges and BCE handling',()=>{
 for(const work of WORKS.filter(w=>RECOMMENDATIONS[w.id].field==='date')){
  for(const [lo,hi] of dateIntervals(work))for(const year of [lo,hi,Math.floor((lo+hi)/2)])assert.equal(checkAnswer(work,'recommendation',String(year)).status,'correct');
  assert.equal(checkAnswer(work,'recommendation','2500 CE').status,'incorrect');
 }
 assert.notEqual(checkAnswer(getWork(13),'recommendation','2700 BCE').status,'correct');
 assert.equal(checkAnswer(getWork(18),'recommendation','Giza, Egypt').status,'correct');
 assert.notEqual(checkAnswer(getWork(18),'recommendation','2500 BCE').status,'correct');
});

test('Recommendation sessions, chosen options, and missed practice survive reload',()=>{
 for(const mode of ['type','choice']){
  const store=defaultStore(),questions=makeStudyQuestions({focus:'recommendation',mode});
  store.focus='recommendation';store.mode=mode;
  store.study={focus:'recommendation',mode,questions,queue:questions.map(q=>q.id),index:1,typed:'3000',revealed:true,responses:mode==='choice'?{1:questions[1].answer}:{},ratings:{0:false}};
  recordRecall(store,12,'recommendation',false);
  const clean=sanitizeStore(JSON.parse(JSON.stringify(store)));
  assert.equal(clean.focus,'recommendation');assert.deepEqual(clean.study.questions,questions);assert.deepEqual(clean.study.responses,store.study.responses);assert.equal(clean.study.typed,'3000');assert.deepEqual(clean.study.ratings,{0:false});
  for(const field of ['recommendation','all','details'])assert.equal(needsPractice(clean,12,field),true);
  recordRecall(clean,12,'recommendation',true);assert.equal(needsPractice(clean,12,'recommendation'),false);
 }
});

test('the recommended third answer scores correctly in both quiz modes and survives reload',()=>{
 for(const mode of ['type','choice']){
  const store=defaultStore();store.quiz=makeQuiz({mode,factField:'recommendation'});
  for(const question of store.quiz.questions){const work=getWork(question.id);Object.assign(store.quiz.answers[work.id],{name:work.name,material:work.material,fact:RECOMMENDATIONS[work.id].answer});}
  assert.equal(quizProgress(store.quiz),14);
  const restored=sanitizeStore(JSON.parse(JSON.stringify(store))).quiz;
  assert.deepEqual(restored.answers,store.quiz.answers);assert.deepEqual(restored.questions,store.quiz.questions);
  finishQuiz(restored);assert.deepEqual(quizScore(restored),{correct:42,pending:0,total:42});
  restored.answers[13].fact='2700 BCE';finishQuiz(restored);assert.equal(restored.grades[13].fact,false);
 }
});
