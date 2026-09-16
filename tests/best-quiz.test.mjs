import test from 'node:test';
import assert from 'node:assert/strict';
import {WORKS,FIELDS,RECOMMENDATIONS} from '../dist/data.js';
import {makeStudyQuestions,shuffleStudyQuestions,defaultStore,sanitizeStore,recordRecall,needsPractice,makeQuiz,getWork,choiceIsCorrect} from '../dist/engine.js';

const order=['name','material','recommendation'];
test('Best for quiz asks the three questions for each piece in both answer modes',()=>{
 assert.equal(FIELDS.best_quiz.label,'Best for quiz');
 for(const mode of ['type','choice']){
  const questions=makeStudyQuestions({focus:'best_quiz',mode});
  assert.equal(questions.length,42);
  WORKS.forEach((work,index)=>{
   const group=questions.slice(index*3,index*3+3);
   assert.deepEqual(group.map(q=>q.field),order);assert.ok(group.every(q=>q.id===work.id));
   if(mode==='choice'){assert.equal(group[2].answer,RECOMMENDATIONS[work.id].answer);for(const question of group){assert.equal(question.options.length,4);assert.equal(question.options.filter(option=>choiceIsCorrect(work,question.field,option)).length,1);}}
  });
 }
});
test('shuffling changes artwork order while retaining each name-material-recommendation cycle',()=>{
 for(const mode of ['type','choice']){
  const ids=[12,16,21,25],questions=makeStudyQuestions({focus:'best_quiz',ids,mode,randomize:true,random:()=>0});
  assert.equal(questions.length,12);assert.notDeepEqual(questions.filter((q,i)=>i%3===0).map(q=>q.id),ids);
  for(let index=0;index<questions.length;index+=3){const group=questions.slice(index,index+3);assert.equal(new Set(group.map(q=>q.id)).size,1);assert.deepEqual(group.map(q=>q.field),order);}
  assert.deepEqual([...new Set(questions.map(q=>q.id))].sort((a,b)=>a-b),ids);
 }
});
test('missed-question retries retain grouping, sequence, and the original choices',()=>{
 const questions=makeStudyQuestions({focus:'best_quiz',ids:[12,13],mode:'choice'});
 const missed=[questions[5],questions[1],questions[3],questions[2]],snapshot=JSON.stringify(missed);
 const retried=shuffleStudyQuestions(missed,'best_quiz',()=>0);
 assert.deepEqual(retried.map(q=>[q.id,q.field]),[[12,'material'],[12,'recommendation'],[13,'name'],[13,'recommendation']]);
 assert.equal(JSON.stringify(missed),snapshot);assert.ok(retried.every(q=>missed.includes(q)));
});
test('saved three-question cycles retain their position, answers, marks, and a separate quiz',()=>{
 for(const mode of ['type','choice']){
  const store=defaultStore(),questions=makeStudyQuestions({focus:'best_quiz',mode});
  store.focus='best_quiz';store.mode=mode;store.study={focus:'best_quiz',mode,questions,queue:questions.map(q=>q.id),index:2,typed:'3000',responses:mode==='choice'?{0:questions[0].answer,1:questions[1].answer}:{},ratings:{0:true,1:false},correct:1,revealed:false};
  store.quiz=makeQuiz({ids:[21]});store.quiz.answers[21].name='saved quiz answer';recordRecall(store,12,'material',false);
  const clean=sanitizeStore(JSON.parse(JSON.stringify(store)));
  assert.equal(clean.focus,'best_quiz');assert.equal(clean.study.index,2);assert.equal(clean.study.questions[2].field,'recommendation');assert.equal(clean.study.typed,'3000');assert.deepEqual(clean.study.questions,questions);assert.deepEqual(clean.study.ratings,{0:true,1:false});assert.deepEqual(clean.study.responses,store.study.responses);assert.equal(clean.quiz.answers[21].name,'saved quiz answer');
 }
});
test('Best for quiz practice follows only name, material, and recommendation mistakes',()=>{
 const store=defaultStore();recordRecall(store,12,'date',false);recordRecall(store,12,'culture',false);assert.equal(needsPractice(store,12,'best_quiz'),false);
 for(const field of order){recordRecall(store,12,field,false);assert.equal(needsPractice(store,12,'best_quiz'),true);recordRecall(store,12,field,true);assert.equal(needsPractice(store,12,'best_quiz'),false);}
});
