import {RECOMMENDATIONS,shortDetail} from './data.js?v=10';

const pronunciations=[
 ['Akhenaten','Ah keh nah ten'],['Nefertiti','Nef er tee tee'],
 ['Tutankhamun','Toot ahn kah moon'],['Hatshepsut','Hat shep soot'],
 ['Menkaure','Men cow ray'],['Hunefer','Hoo neh fer'],['Amun-Re','Ah moon Ray'],
 ['Lamassu','Lah mah soo'],['greywacke','gray wack'],['lapis lazuli','lap iss laz uh lee'],
 ['Ur','Oor']
];
const spokenDates={'3000 BCE':'Three thousand B. C. E.','2700 BCE':'Twenty seven hundred B. C. E.','2500 BCE':'Twenty five hundred B. C. E.','1750 BCE':'Seventeen fifty B. C. E.','720 BCE':'Seven twenty B. C. E.'};
export function spokenText(text){
 if(spokenDates[text])return spokenDates[text];
 let spoken=text;
 for(const [word,pronunciation] of pronunciations)spoken=spoken.replace(new RegExp(`\\b${word}\\b`,'gi'),pronunciation);
 return spoken.replace(/&/g,'and');
}
export function audioParts(work){return [
 {field:'name',label:'Name',text:shortDetail(work.name)},
 {field:'material',label:'Material',text:shortDetail(work.material)},
 {field:'recommendation',label:'Recommendation',text:RECOMMENDATIONS[work.id].answer}
].map(part=>({...part,spoken:spokenText(part.text)}));}
export const audioSource=id=>`audio/work-${id}.wav?v=10`;
