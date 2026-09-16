// Course wording comes first. Slide references are 1-based PDF pages.
// Rulers, donors, and depicted figures are not automatically the artists.
export const FIELDS = {
  best_quiz: {label:'Best for quiz', prompt:'Name, material, recommendation', help:'Answer three questions for each artwork, then move to the next piece.'},
  all: {label:'All details', prompt:'What do you remember?', help:'Study all categories.'},
  details: {label:'Details', prompt:'What are its details?', help:'Study dates, locations, and culture and period. Senenmut is accepted with the location of Hatshepsut’s temple.'},
  recommendation: {label:'Recommendation', prompt:'What is the recommended detail?', help:'One short answer to memorize for each work.'},
  name: {label:'Names', prompt:'Which artwork is this?', help:'Give the title of the assigned work. Include the person or place that identifies it.'},
  material: {label:'Materials', prompt:'What is it made of?', help:'Give the complete material line for the assigned work, including inlay and surface treatments.'},
  date: {label:'Dates', prompt:'When was it made?', help:'Any year within a listed range is accepted. Karnak has separate temple and hall dates.'},
  location: {label:'Locations', prompt:'Where did it come from?', help:'Recall the original site and modern country, rather than just the museum.'},
  culture: {label:'Culture & period', prompt:'Which culture and period?', help:'Identify the civilization. For Egyptian works, add the kingdom or period.'}
};
export const RECOMMENDATIONS = {
  12: {field:'date', answer:'3000 BCE'},
  13: {field:'date', answer:'3000 BCE'},
  14: {field:'date', answer:'2700 BCE'},
  15: {field:'date', answer:'2500 BCE'},
  16: {field:'date', answer:'2500 BCE'},
  17: {field:'date', answer:'2500 BCE'},
  18: {field:'location', answer:'Giza, Egypt'},
  19: {field:'date', answer:'1750 BCE'},
  20: {field:'culture', answer:'Egyptian, New Kingdom'},
  21: {field:'culture', answer:'Egyptian, New Kingdom'},
  22: {field:'location', answer:'Amarna, Egypt'},
  23: {field:'culture', answer:'Egyptian, New Kingdom'},
  24: {field:'location', answer:'Egypt'},
  25: {field:'date', answer:'720 BCE'}
};
const I=(id,count,labels,extras={})=>Array.from({length:count},(_,i)=>({src:`images/work-${id}-${i+1}.jpg`,label:labels[i],quiz:i===0,...extras[i]}));
const unknown='Unrecorded artist(s)';
export const WORKS = [
 {
  id:12,name:'White Temple and its Ziggurat',shortName:'White Temple and its Ziggurat',
  material:'Mud brick',materialParts:[['mud brick','mudbrick','mud bricks','mudbricks']],materialLabels:['mud brick'],materialAllowed:['bitumen','plaster','whitewash'],
  date:'c. 3500–3000 BCE',dateAlternatives:['c. 3200–3000 BCE (identification slide)'],dateNumbers:[[3500,3000],[3200,3000]],sortDate:3500,
  location:'Uruk (modern Warka), Iraq',locationTerms:[['uruk','warka'],['iraq']],culture:'Sumerian',period:'Late Uruk period',artist:unknown,patron:'Sumerian temple authorities; dedicated to Anu',
  function:'An elevated temple to the sky god Anu, used by religious and political elites.',
  goTo:'Dedicated to Anu, the Sumerian sky god.',cue:'Earth becomes architecture: mud brick supports a temple high above Uruk.',
  visual:'A temple atop a massive raised platform; sloping, recessed sides and a terrace.',
  facts:['The elevated platform is a ziggurat; it supported a temple rather than a royal burial.','The temple contained a cella, the principal sacred room.','Theocracy linked religious authority with political rule.'],
  notes:['Date variation: page 8 uses c. 3200–3000 BCE; page 9 uses c. 3500–3000 BCE. Both are accepted in practice.','Material clarification: mud brick is the identification line. Page 9 adds bitumen as waterproofing; whitewash, rather than bitumen itself, made the temple white.'],
  sources:[8,9,10],links:[{title:'Khan Academy / Smarthistory: White Temple',url:'https://www.khanacademy.org/humanities/ap-art-history/ancient-mediterranean-ap/ancient-near-east-a/a/white-temple-and-ziggurat-uruk'}],
  nameAliases:['white temple and its ziggurat','white temple and ziggurat','white temple ziggurat'],
  images:I(12,3,['Surviving site','Reconstruction','Plan (study only)'],{1:{quiz:true}})
 },
 {
  id:13,name:'Palette of King Narmer',shortName:'Palette of King Narmer',
  material:'Greywacke',materialParts:[['greywacke','graywacke']],materialLabels:['greywacke'],materialAllowed:['siltstone'],
  date:'c. 3000–2920 BCE',dateNumbers:[[3000,2920]],sortDate:3000,
  location:'Hierakonpolis, Egypt',locationTerms:[['hierakonpolis','nekhen'],['egypt']],culture:'Egyptian',period:'Predynastic',artist:unknown,patron:'King Narmer (depicted ruler)',
  function:'A ceremonial palette celebrating kingship and the unification of Upper and Lower Egypt.',
  goTo:'Narmer wears the crowns of Upper and Lower Egypt on opposite sides.',cue:'Two rulers in this set share greywacke: Narmer and Menkaure.',
  visual:'A shield-shaped stone palette carved on both sides; a king smiting an enemy and long-necked animals.',
  facts:['Hierarchy of scale makes Narmer larger than those around him.','Registers organize the reliefs.','The circular depression recalls the grinding surface of cosmetic palettes; this large example is ceremonial.'],
  notes:['Use “greywacke” for the course material line. “Graywacke” is the same spelling variant.','The title names the king shown in the work, not its sculptor.'],
  sources:[16,17],links:[{title:'Smarthistory: Palette of King Narmer',url:'https://smarthistory.org/palette-of-king-narmer/'}],
  nameAliases:['palette of king narmer','palette of narmer','narmer palette','king narmer palette'],images:I(13,1,['Both sides'])
 },
 {
  id:14,name:'Statues of Votive Figures',shortName:'Statues of Votive Figures',
  material:'Gypsum inlaid with shell and black limestone',materialParts:[['gypsum'],['inlaid','inlay','inlays'],['shell','shells'],['black limestone']],materialLabels:['gypsum','inlay technique','shell','black limestone'],
  date:'c. 2700 BCE',dateNumbers:[[2700]],sortDate:2700,
  location:'Square Temple at Eshnunna (modern Tell Asmar), Iraq',locationTerms:[['eshnunna','tell asmar'],['iraq']],culture:'Sumerian',period:'Early Dynastic',artist:unknown,patron:'Individual donors / worshippers',
  function:'Stand-ins placed in temples to pray continually on behalf of their donors.',
  goTo:'The oversized eyes suggest eternal wakefulness in prayer.',cue:'G–S–B: gypsum body, shell, black limestone. Remember “inlaid.”',
  visual:'Frontal standing worshippers with clasped hands and enormous staring eyes.',
  facts:['Donors commissioned the figures to represent them when absent.','Subtractive carving creates negative space between legs and sometimes arms.','Many were buried beneath temple floors.'],
  notes:['“Stone” or “gypsum” alone omits the eye inlays. Recall shell AND black limestone.'],
  sources:[13,14,15],links:[],nameAliases:['statues of votive figures','votive figures','votive statues','tell asmar votive statues','votive figures from eshnunna'],images:I(14,2,['Pair of figures','Group of votive figures'],{1:{quiz:true}})
 },
 {
  id:15,name:'Seated Scribe',shortName:'Seated Scribe',
  material:'Painted limestone',materialParts:[['painted','paint','pigment','pigments','polychrome'],['limestone']],materialLabels:['painted surface','limestone'],materialAllowed:['crystal','copper'],
  date:'c. 2620–2500 BCE',dateAlternatives:['c. 2500 BCE (identification slide)','c. 2600 BCE (page 23)'],dateNumbers:[[2620,2500],[2500],[2600]],sortDate:2620,
  location:'Saqqara, Egypt',locationTerms:[['saqqara','sakkara'],['egypt']],culture:'Egyptian',period:'Old Kingdom, Fourth Dynasty',artist:unknown,patron:'Unknown; the identity of the scribe is uncertain',
  function:'A funerary figure associated with a tomb and service in the afterlife.',
  goTo:'The scribe sits cross-legged with a papyrus scroll in his lap.',cue:'The scribe has painted skin: PAINTED limestone, not simply limestone.',
  visual:'An alert seated man, cross-legged, with lifelike eyes and a soft, non-idealized torso.',
  facts:['Scribes held a specialized role in a largely non-literate society.','A writing instrument originally occupied the poised hand.','The body is less idealized than the bodies of royal figures.'],
  notes:['Date variation: the identification slide uses c. 2500 BCE, page 23 uses c. 2600 BCE, and page 24 uses c. 2620–2500 BCE. Practice accepts all three.','Louvre, Paris, is the collection named in the slides; Saqqara is the original location.'],
  sources:[21,23,24],links:[],nameAliases:['seated scribe','the seated scribe'],images:I(15,2,['Full figure','Face detail (study only)'])
 },
 {
  id:16,name:'Standard of Ur',shortName:'Standard of Ur',
  material:'Wood inlaid with shell, lapis lazuli, and red limestone',materialParts:[['wood','wooden'],['inlaid','inlay','inlays'],['shell','shells'],['lapis lazuli','lapis'],['red limestone']],materialLabels:['wood','inlay technique','shell','lapis lazuli','red limestone'],materialAllowed:['bitumen'],
  date:'c. 2600–2400 BCE',dateAlternatives:['c. 2600 BCE (identification slide)'],dateNumbers:[[2600,2400],[2600],[2500]],sortDate:2600,
  location:'Royal Cemetery at Ur (modern Tell Muqayyar), Iraq',locationTerms:[['ur','tell muqayyar'],['iraq']],culture:'Sumerian',period:'Early Dynastic',artist:unknown,patron:'Unknown; associated with the royal cemetery',
  function:'An elite object with war and peace scenes; its exact original use is uncertain.',
  goTo:'Its two principal sides depict war and peace in horizontal registers.',cue:'Wood + inlay + three colors: white shell, blue lapis lazuli, red limestone.',
  visual:'A box-like object with three horizontal rows of figures against a deep blue background.',
  facts:['The king is larger than surrounding figures: hierarchy of scale.','The imagery is conventionally read from the bottom register upward.','It may have been a standard or part of an instrument; the proposed function is not certain.'],
  notes:['Date variation: page 25 gives c. 2600 BCE, page 26 gives c. 2600–2400 BCE, and page 27 mentions 2500 BCE. All are accepted.','Do not drop the wooden support, inlay, or the adjective “red.”'],
  sources:[25,26,27,28,32,33],links:[],nameAliases:['standard of ur','the standard of ur','ur standard'],images:I(16,2,['War side','Peace side'],{1:{quiz:true}})
 },
 {
  id:17,name:'Great Pyramids (Menkaure, Khafre, Khufu) and Great Sphinx',shortName:'Great Pyramids and Great Sphinx',
  material:'Cut limestone',materialParts:[['cut','carved','carving'],['limestone']],materialLabels:['cut / carved construction','limestone'],
  date:'c. 2550–2490 BCE',dateNumbers:[[2550,2490]],sortDate:2550,
  location:'Giza (Gizeh), Egypt',locationTerms:[['giza','gizeh'],['egypt']],culture:'Egyptian',period:'Old Kingdom, Fourth Dynasty',artist:'Unrecorded Egyptian architects and builders',patron:'Khufu, Khafre, and Menkaure',
  function:'Royal tomb complexes; the Sphinx served a protective and royal purpose.',
  goTo:'The three main pyramids were built for Khufu, Khafre, and Menkaure.',cue:'Huge blocks cut for tombs: CUT limestone.',
  visual:'Monumental pyramids and a lion-bodied, human-headed Sphinx on the Giza plateau.',
  facts:['Khufu’s pyramid is the largest of the three.','Causeways connected the pyramid complexes with their temples.','The Sphinx was carved in situ from limestone and is associated with Khafre.'],
  notes:['For the assigned group, learn both “Great Pyramids” and “Great Sphinx.”','Do not answer “Imhotep”: the PDF associates him with Djoser’s stepped pyramid, a comparison work outside this set.'],
  sources:[34,35,45,46,47,48],links:[],nameAliases:['great pyramids and great sphinx','great pyramids of giza and great sphinx','pyramids of giza and sphinx','great pyramids menkaure khafre khufu and great sphinx'],images:I(17,3,['Pyramids','Great Sphinx and pyramids','Site plan (study only)'],{1:{quiz:true}})
 },
 {
  id:18,name:'King Menkaure and Queen',shortName:'King Menkaure and Queen',
  material:'Greywacke',materialParts:[['greywacke','graywacke']],materialLabels:['greywacke'],materialAllowed:['paint','painted','pigment','polychrome'],
  date:'c. 2490–2472 BCE',dateNumbers:[[2490,2472]],sortDate:2490,
  location:'Menkaure’s Valley Temple, Giza, Egypt',locationTerms:[['giza','gizeh'],['egypt']],culture:'Egyptian',period:'Old Kingdom, Fourth Dynasty',artist:unknown,patron:'King Menkaure (royal context)',
  function:'A royal funerary image intended to support eternal existence / the ka.',
  goTo:'The figures stand frontally, with Menkaure’s left foot advanced.',cue:'Narmer and Menkaure are the greywacke pair.',
  visual:'Two standing royal figures joined to a stone back support; the woman embraces the king.',
  facts:['Nemes headdress and false beard identify royal status.','The figures project idealized, enduring royal authority.','The woman’s precise identity is uncertain; “queen” is the conventional title.'],
  notes:['The king is a depicted subject, not a documented sculptor.','Both “greywacke” and “graywacke” are accepted.'],
  sources:[51,57],links:[{title:'Smarthistory: Menkaure and queen',url:'https://smarthistory.org/king-menkaure-mycerinus-and-queen/'}],nameAliases:['king menkaure and queen','menkaure and queen','menkaure and his queen','king menkaura and queen','menkaure and wife','mycerinus and queen'],images:I(18,2,['Royal pair','Excavation (study only)'])
 },
 {
  id:19,name:'The Law Code Stele of Hammurabi',shortName:'Law Code of Hammurabi',
  material:'Basalt',materialParts:[['basalt']],materialLabels:['basalt'],
  date:'c. 1792–1750 BCE',dateAlternatives:['c. 1780 BCE (identification slide)'],dateNumbers:[[1792,1750],[1780]],sortDate:1792,
  location:'Babylon, Iraq; later taken to and found at Susa, Iran',locationTerms:[['babylon','susa'],['iraq','iran']],culture:'Babylonian',period:'Old Babylonian',artist:unknown,patron:'King Hammurabi',
  function:'A public inscription of laws presenting the king’s authority as divinely sanctioned.',
  goTo:'At the top, Hammurabi faces Shamash, the sun god.',cue:'Babylon + basalt: the law is carved into a dark volcanic stone.',
  visual:'A tall dark stele covered with cuneiform, topped by a relief of two figures.',
  facts:['Shamash gives the king symbols of authority: a rod and a coiled rope.','The inscription is in Akkadian using cuneiform.','The object was carried to Susa as war booty.'],
  notes:['Date variation: page 59 gives c. 1780 BCE; page 60 gives c. 1792–1750 BCE. Both are accepted.','Use “basalt” for this class. Some museum and scholarly sources classify the stone differently.','Keep the locations paired correctly: Babylon is in Iraq; Susa is in Iran.'],
  sources:[59,60,61],links:[],nameAliases:['the law code stele of hammurabi','law code stele of hammurabi','law code of hammurabi','code of hammurabi','stele of hammurabi','hammurabi law code','hammurabis code'],images:I(19,2,['Full stele','Relief detail'],{1:{quiz:true}})
 },
 {
  id:20,name:'Temple of Amun-Re and Hypostyle Hall',shortName:'Temple of Amun-Re',
  material:'Cut sandstone and mud brick',materialParts:[['cut','carved','carving'],['sandstone'],['mud brick','mudbrick','mud bricks','mudbricks']],materialLabels:['cut / carved construction','sandstone','mud brick'],
  date:'Temple: c. 1550 BCE; hall: c. 1250 BCE',dateNumbers:[[1550,1250]],sortDate:1550,
  location:'Karnak, near Luxor (ancient Thebes), Egypt',locationTerms:[['karnak','luxor','thebes'],['egypt']],culture:'Egyptian',period:'New Kingdom, 18th and 19th Dynasties',artist:'Multiple generations of Egyptian architects and builders; no single artist',patron:'Successive New Kingdom pharaohs',
  function:'A major religious complex dedicated to Amun-Re.',
  goTo:'A hypostyle hall has a roof supported by a dense forest of columns.',cue:'Karnak has TWO materials and TWO dates: cut sandstone + mud brick; 1550 + 1250.',
  visual:'Massive, closely spaced columns; carved and once-painted surfaces; plant-shaped capitals.',
  facts:['A clerestory admits light above lower roof levels.','Monumental entrance gateways are called pylons.','Lotus and papyrus forms link the temple to plants and the natural world.'],
  notes:['Learn both dates separately. A single “1550–1250 BCE” span is accepted in practice, but temple and hall labels are more precise.','Mud brick is part of the assigned material line even when the photo shows stone columns.'],
  sources:[63,65,66,67,68],links:[{title:'Smarthistory: Temple of Amun-Re and Hypostyle Hall',url:'https://smarthistory.org/temple-of-amun-re-and-the-hypostyle-hall-karnak/'}],nameAliases:['temple of amun re','temple of amon re','temple of amun ra','temple of amon ra','temple of amun re and hypostyle hall','temple of amun re hypostyle hall','karnak temple of amun re'],images:I(20,2,['Hypostyle Hall','Painted column detail'],{1:{quiz:true}})
 },
 {
  id:21,name:'Mortuary Temple of Hatshepsut',shortName:'Mortuary Temple of Hatshepsut',artistKnown:true,
  material:'Sandstone, partially carved into a rock cliff, and red granite',materialParts:[['sandstone'],['red granite']],materialLabels:['sandstone','red granite'],
  date:'c. 1473–1458 BCE',dateNumbers:[[1473,1458]],sortDate:1473,
  location:'Deir el-Bahri, near Luxor (Thebes), Egypt',locationTerms:[['deir el bahri','deir el bahari','luxor','thebes'],['egypt']],culture:'Egyptian',period:'New Kingdom, 18th Dynasty',artist:'Senenmut (traditionally attributed architect); sculptors unrecorded',patron:'Pharaoh Hatshepsut',
  function:'A mortuary temple commemorating Hatshepsut and supporting her royal cult.',
  goTo:'The terraced temple is built against the cliffs near Luxor.',cue:'Temple + statue: sandstone architecture, red granite sculpture.',
  visual:'Broad horizontal terraces, colonnades, and central ramps set against a dramatic cliff.',
  facts:['The red granite in the material line refers to the associated sculpture.','Hatshepsut ruled as pharaoh during the New Kingdom.','The temple’s horizontal terraces contrast with its vertical cliff setting.'],
  notes:['The identification line includes sandstone AND red granite. When a statue detail appears, practice still asks for the full assigned-work line.','The slides do not name an architect. The Met describes Senenmut as the probable designer; this is an attribution, not a signed work.'],
  sources:[70,71,73],links:[{title:'The Met: Senenmut and the temple attribution',url:'https://www.metmuseum.org/art/collection/search/544456'}],nameAliases:['mortuary temple of hatshepsut','temple of hatshepsut','hatshepsuts mortuary temple','hatshepsut mortuary temple','hatshepsut temple'],images:I(21,3,['Temple','Kneeling statue (associated work)','Statue profile (study only)'],{1:{quiz:true}})
 },
 {
  id:22,name:'Akhenaten, Nefertiti, and Three Daughters',shortName:'Akhenaten, Nefertiti, and Three Daughters',
  material:'Limestone',materialParts:[['limestone']],materialLabels:['limestone'],materialAllowed:['paint','painted','pigment'],
  date:'c. 1353–1335 BCE',dateNumbers:[[1353,1335]],sortDate:1353,
  location:'Amarna (Tell el-Amarna), Egypt',locationTerms:[['amarna','akhetaten'],['egypt']],culture:'Egyptian',period:'New Kingdom, Amarna period, 18th Dynasty',artist:unknown,patron:'Akhenaten and Nefertiti (depicted royal family)',
  function:'A domestic religious image of the royal family beneath Aten.',
  goTo:'Aten appears as a sun disk with rays ending in hands.',cue:'A family carved in stone: limestone. “Sunken relief” describes the technique.',
  visual:'A relaxed royal family holding children under radiating sunbeams; curved, elongated forms.',
  facts:['Sunken relief places carved outlines below the stone surface.','The Amarna style departs from the usual rigid Egyptian royal conventions.','Ankh symbols at the ends of the rays convey life to the royal couple.'],
  notes:['Do not substitute “sandstone.” The course material is limestone.','Akhenaten and Nefertiti are the subjects, not the documented artists.'],
  sources:[75,76,77,78],links:[],nameAliases:['akhenaten nefertiti and three daughters','akhenaten nefertiti and 3 daughters','akhenaton nefertiti and three daughters','akhenaten and nefertiti with three daughters','akhenaten nefertiti and their three daughters'],images:I(22,1,['Family relief'])
 },
 {
  id:23,name:'Innermost Coffin of Tutankhamun',shortName:'Innermost Coffin of Tutankhamun',
  material:'Gold with inlay of enamel and semiprecious stones',materialParts:[['gold','golden'],['inlay','inlaid','inlays'],['enamel'],['semiprecious stones','semi precious stones','semiprecious stone','semi precious stone']],materialLabels:['gold','inlay technique','enamel','semiprecious stones'],materialAllowed:['lapis lazuli','lapis','turquoise','carnelian'],
  date:'c. 1323 BCE',dateNumbers:[[1323]],sortDate:1323,
  location:'Tutankhamun’s tomb, Valley of the Kings, near Luxor, Egypt',locationTerms:[['valley of the kings','luxor','thebes','kv62'],['egypt']],culture:'Egyptian',period:'New Kingdom, 18th Dynasty',artist:'Unrecorded Egyptian goldsmiths and artisans',patron:'Royal funerary commission for Tutankhamun',
  function:'The innermost of three coffins enclosing the king’s body and protecting him in the afterlife.',
  goTo:'The crossed crook and flail signify pharaonic authority.',cue:'G–I–E–S: gold, inlay, enamel, semiprecious stones.',
  visual:'A gold anthropoid coffin with crossed arms, royal regalia, and colored inlay.',
  facts:['The innermost coffin was made of solid gold.','Protective goddesses are represented on its surface.','Howard Carter discovered the tomb in 1922.'],
  notes:['The death mask shown on page 80 is a related but separate object. It appears in the collection for recognition; the mock quiz uses coffin views.','“Gold” alone is incomplete: learn enamel, semiprecious stones, and inlay.','Tutankhamun, Tutankhamen, and Tutankhamon are accepted name variants.'],
  sources:[79,80,81,83,87],links:[{title:'Egyptian Ministry of Antiquities: Tutankhamun’s coffins and tomb',url:'https://egymonuments.gov.eg/news/gilded-coffin-of-king-tutankhamun/'}],nameAliases:['innermost coffin of tutankhamun','innermost coffin of tutankhamen','tutankhamuns innermost coffin','tutankhamens innermost coffin','tutankhamun innermost coffin','tutankhamun tomb innermost coffin','tutankhamuns tomb innermost coffin','innermost coffin of king tut'],images:I(23,3,['Innermost coffin','Coffin side view','Death mask (related, study only)'],{1:{quiz:true}})
 },
 {
  id:24,name:'Last Judgment of Hunefer, from the Book of the Dead',shortName:'Last Judgment of Hunefer',
  material:'Painted papyrus scroll',materialParts:[['painted','paint','pigment','pigments'],['papyrus'],['scroll']],materialLabels:['painted surface','papyrus','scroll format'],
  date:'c. 1275 BCE',dateNumbers:[[1275]],sortDate:1275,
  location:'Egypt',locationTerms:[['egypt']],culture:'Egyptian',period:'New Kingdom, 19th Dynasty',artist:'Unrecorded Egyptian scribes and painters',patron:'Hunefer, the owner of the funerary papyrus',
  function:'A funerary papyrus guiding and protecting the deceased during judgment and the journey to the afterlife.',
  goTo:'Hunefer’s heart is weighed against the feather of Ma’at.',cue:'The judgment travels on a PAINTED PAPYRUS SCROLL: all three words.',
  visual:'A painted narrative with a balance scale, animal-headed gods, and the enthroned Osiris.',
  facts:['Anubis oversees the weighing; Thoth records its result.','Ammit threatens to devour a heart that fails the judgment.','The same person appears more than once in a continuous narrative.'],
  notes:['The PDF does not give a more precise original findspot. “Egypt” is the course-based location answer.','Hunefer is the deceased owner, not a named painter.'],
  sources:[88,89,90,91],links:[{title:'British Museum: Book of the Dead of Hunefer',url:'https://www.britishmuseum.org/collection/object/Y_EA9901-3'}],nameAliases:['last judgment of hunefer','last judgement of hunefer','last judgment of hu nefer','last judgment of hunefer from the book of the dead','hunefer book of the dead','book of the dead of hunefer','judgment of hunefer','judgement of hunefer'],images:I(24,1,['Judgment scene'])
 },
 {
  id:25,name:'Lamassu (Winged Human-Headed Bull)',shortName:'Lamassu',
  material:'Alabaster',materialParts:[['alabaster']],materialLabels:['alabaster'],materialAllowed:['gypsum'],
  date:'c. 720–705 BCE',dateNumbers:[[720,705]],sortDate:720,
  location:'Citadel of Sargon II, Dur-Sharrukin (modern Khorsabad), Iraq',locationTerms:[['khorsabad','dur sharrukin','citadel of sargon ii','citadel of sargon 2'],['iraq']],culture:'Assyrian',period:'Neo-Assyrian',artist:'Unrecorded Assyrian sculptors',patron:'King Sargon II',
  function:'Monumental protective figures flanking and supporting gateways to the citadel.',
  goTo:'Five legs make it look still from the front and walking from the side.',cue:'Assyrian guardian, alabaster: A + A.',
  visual:'A colossal winged bull with a bearded human head, a horned crown, and five legs.',
  facts:['Apotropaic means intended to ward off evil or bad luck.','Its hybrid form combines human intelligence with animal strength.','Its monumental scale projects the power of the Assyrian king.'],
  notes:['Use the course material name “alabaster.” “Stone” is too general.','Khorsabad / Dur-Sharrukin identifies Sargon II’s citadel; avoid confusing it with other Assyrian palace sites.'],
  sources:[96,97,98,99,100],links:[{title:'Louvre: The palace of Sargon II',url:'https://www.louvre.fr/en/explore/the-palace/the-palace-of-sargon-ii'}],nameAliases:['lamassu','lamassu winged human headed bull','winged human headed bull','human headed winged bull','lamassu from the citadel of sargon ii'],images:I(25,3,['Gateway pair','Front view','Side view'],{1:{quiz:true},2:{quiz:true}})
 }
];

// Short study labels keep the complete source wording and accepted aliases intact.
const shortLocations={
 12:'Uruk, Iraq',14:'Eshnunna, Iraq',16:'Ur, Iraq',17:'Giza, Egypt',
 18:'Menkaure’s Valley Temple, Giza, Egypt',19:'Babylon, Iraq',20:'Karnak, Egypt',
 21:'Deir el-Bahri, Egypt',22:'Amarna, Egypt',23:'Valley of the Kings, Egypt',
 25:'Dur-Sharrukin, Iraq'
};
const shortDetails=new Map(WORKS.flatMap(w=>[
 [w.name,w.shortName],
 [w.location,shortLocations[w.id]??w.location],
 [w.artist,w.id===21?'Senenmut':'Unknown'],
 [w.material,w.id===21?'Sandstone and red granite':w.material]
]));
shortDetails.set('Unknown / unrecorded','Unknown');
shortDetails.set('Senenmut (traditionally attributed)','Senenmut');
export function shortDetail(value){const text=String(value??'');return shortDetails.get(text)??text.replace(/\s*\([^)]*\)/g,'').replace(/\s+/g,' ').trim();}

export const VOCAB = [
 ['Ziggurat','A raised, stepped platform supporting a temple.','White Temple · 12'],
 ['Cella','The principal sacred room of a temple.','White Temple · 12'],
 ['Votive','Offered in fulfillment of a vow or as an act of devotion.','Votive figures · 14'],
 ['Inlay','A different material fitted into recesses in a base material.','Votive figures, Standard of Ur, coffin · 14, 16, 23'],
 ['Register','A horizontal band used to organize figures or narrative.','Narmer, Standard of Ur · 13, 16'],
 ['Hierarchy of scale','Making a more important figure larger than surrounding figures.','Narmer, Standard of Ur, Hammurabi · 13, 16, 19'],
 ['Composite / twisted perspective','Combining frontal and profile views in one figure.','Narmer, Hunefer · 13, 24'],
 ['Ka','A person’s spiritual essence, supported by funerary objects and images.','Menkaure and queen · 18'],
 ['Stele','An upright slab bearing an image or inscription.','Hammurabi · 19'],
 ['Cuneiform','Writing made of wedge-shaped signs.','Hammurabi · 19'],
 ['Hypostyle','A hall with a roof supported by many closely spaced columns.','Temple of Amun-Re · 20'],
 ['Clerestory','High windows above adjoining lower roof levels that admit light.','Temple of Amun-Re · 20'],
 ['Pylon','A monumental gateway with two sloping towers.','Temple of Amun-Re · 20'],
 ['Sunken relief','Carving in which outlines are cut below the surrounding surface.','Akhenaten and family · 22'],
 ['Amarna style','The fluid, elongated, more intimate royal style of Akhenaten’s reign.','Akhenaten and family · 22'],
 ['Ankh','An Egyptian sign associated with life.','Akhenaten and family, Hunefer · 22, 24'],
 ['Continuous narrative','Showing the same figure multiple times to tell successive events.','Last Judgment of Hunefer · 24'],
 ['Apotropaic','Intended to ward off evil or bad luck.','Lamassu · 25'],
 ['In situ','In its original place; carved in place when referring to the Sphinx.','Great Sphinx · 17'],
 ['Negative space','Empty space around or between parts of a form.','Votive figures · 14']
];
export const CONFUSIONS = [
 {title:'The limestone family',items:['15 · Seated Scribe = PAINTED limestone.','17 · Pyramids and Sphinx = CUT limestone.','22 · Akhenaten and family = limestone.','14 · Votive figures = gypsum with SHELL and BLACK LIMESTONE inlay.']},
 {title:'Two greywacke works',items:['13 · Palette of King Narmer.','18 · King Menkaure and Queen.','Both greywacke and graywacke are correct spellings.']},
 {title:'Two Egyptian temples',items:['20 · Amun-Re = CUT SANDSTONE + MUD BRICK. Temple 1550; hall 1250 BCE.','21 · Hatshepsut = SANDSTONE + RED GRANITE. 1473–1458 BCE.','The granite belongs to the associated sculpture; the sandstone belongs to the architecture.']},
 {title:'Inlay: remember every part',items:['14 · GYPSUM + inlay of SHELL + BLACK LIMESTONE.','16 · WOOD + inlay of SHELL + LAPIS LAZULI + RED LIMESTONE.','23 · GOLD + inlay of ENAMEL + SEMIPRECIOUS STONES.']},
 {title:'Ruler ≠ artist',items:['Narmer, Menkaure, Hammurabi, Akhenaten, and Tutankhamun are rulers, patrons, or subjects. Their names do not identify the craftspeople.','Sargon II commissioned the citadel guarded by lamassu.','Senenmut is a traditionally attributed architect for Hatshepsut’s temple, not a certain sculptor of every statue.']},
 {title:'Temple or tomb?',items:['12 · The White Temple is a sanctuary on a ziggurat.','17 · The Giza pyramids are royal tombs.','21 · Hatshepsut’s mortuary temple serves a funerary cult; it is not her tomb.']}
];
