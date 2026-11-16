// Precision Pursuit exploratory playtest content, v0.1.
// Source URLs are editorial leads, not certification or evidence of reuse rights.
// Six fixed three-question challenges; no daily publication schedule.
const q=(id,category,question,guidance,answer,unit,explanation,source,sourceUrl,precision=0)=>({id,category,question,guidance,answer,unit,explanation,source,sourceUrl,precision});
export const precisionRounds=[
 [
 q('PP-01','Geography and Space','Approximately how deep is Challenger Deep, in metres?','Mount Everest is roughly 8,850 metres high. Challenger Deep is deeper still.',10935,'metres','NOAA describes Challenger Deep in the Mariana Trench as approximately 10,935 metres deep.','NOAA','https://oceanservice.noaa.gov/facts/oceandepth.html'),
 q('PP-04','People and Society','According to the ITU, how many billion people used the internet in 2026?','The global population exceeds eight billion; internet access is widespread but not universal.',6.3,'billion people','The ITU estimated 6.3 billion internet users, or 76% of the world population, in 2026.','ITU','https://www.itu.int/itu-d/reports/statistics/facts-figures-2026/',1),
 q('PP-16','Everyday Life and Surprising Statistics','Approximately how many times does a human heart beat in one day?','A typical resting heart rate is between 60 and 100 beats per minute.',100000,'beats','Around 100,000 beats is a commonly used daily reference figure; actual totals vary with activity and individual heart rates.','NHLBI','https://www.nhlbi.nih.gov/health/heart/heart-beats'),
 ],
 [
 q('PP-02','Geography and Space','Approximately how many kilometres across is Jupiter at its equator?','Jupiter is the largest planet in the Solar System and much wider than Earth.',142984,'kilometres','NASA lists an equatorial diameter of approximately 142,984 km.','NASA','https://science.nasa.gov/jupiter/facts/'),
 q('PP-05','People and Society','Approximately what was global life expectancy at birth in 2023?','Think of the whole world, including countries with very different health outcomes.',73.3,'years','The global figure is a statistical estimate and may change as datasets are revised.','WHO','https://www.who.int/data/gho/data/themes/mortality-and-global-health-estimates/ghe-life-expectancy-and-healthy-life-expectancy/',1),
 q('PP-10','History','Approximately how many athletes competed in the first modern Olympic Games in 1896?','The Athens Games featured nine sports and were much smaller than today’s Olympics.',241,'athletes','The International Olympic Committee records 241 athletes from 14 participating countries.','IOC','https://www.olympics.com/ioc/news/athens-1896-the-revival-of-the-olympic-games'),
 ],
 [
 q('PP-03','Geography and Space','About how many minutes does the International Space Station take to orbit Earth once?','The station orbits only a few hundred kilometres above Earth and moves exceptionally fast.',92,'minutes','The station completes an orbit in approximately 92 minutes; its orbital period varies slightly.','ESA','https://www.esa.int/Science_Exploration/Human_and_Robotic_Exploration/International_Space_Station'),
 q('PP-07','Science and Nature','About how many times per second does a ruby-throated hummingbird flap its wings in direct flight?','These birds beat their wings much faster than most larger birds.',70,'wingbeats per second','Around 70 is a reference rate; wingbeat frequency changes with flight behaviour.','Smithsonian National Zoo','https://nationalzoo.si.edu/migratory-birds/hummingbirds'),
 q('PP-13','Culture and Pop Culture','Approximately how many minutes long is the theatrical cut of The Lord of the Rings: The Return of the King?','Use the original cinema release, not the extended edition.',201,'minutes','The theatrical film runs for about 201 minutes, depending on the listed edition and credits.','BBFC','https://www.bbfc.co.uk/'),
 ],
 [
 q('PP-06','People and Society','What percentage of the world’s population used safely managed drinking-water services in 2024?','“Safely managed” means water from an improved source, accessible when needed and free from contamination.',74,'percent','WHO and UNICEF estimate that about 74% used safely managed drinking-water services in 2024.','WHO / UNICEF','https://washdata.org/'),
 q('PP-08','Science and Nature','Approximately how many litres of blood does a typical adult have?','Blood is only part of your body mass, and volume varies by body size.',5,'litres','Five litres is a common adult reference value; there is no single exact value for everyone.','NHS','https://www.blood.co.uk/why-give-blood/how-blood-is-used/'),
 q('PP-11','History','Approximately how many hours did the Apollo 11 lunar module remain on the Moon?','Armstrong and Aldrin made one moonwalk, but their module remained on the surface much longer.',21.5,'hours','The lunar module was on the Moon for about 21½ hours before lifting off.','NASA','https://www.nasa.gov/mission/apollo-11/',1),
 ],
 [
 q('PP-09','Science and Nature','About how strong is gravity at the Moon’s surface, in metres per second squared?','Earth’s surface gravity is about 9.8 m/s². The Moon’s pull is much weaker.',1.62,'m/s²','Lunar surface gravity is approximately 1.62 m/s², around one-sixth of Earth’s.','NASA','https://science.nasa.gov/moon/by-the-numbers/',2),
 q('PP-12','History','How tall was the Great Pyramid of Giza originally, in metres?','It was taller in antiquity than today and remained the tallest human-made structure for millennia.',147,'metres','Its original height is generally given as approximately 146.6–147 metres.','UNESCO','https://whc.unesco.org/en/list/86/'),
 q('PP-17','Everyday Life and Surprising Statistics','How many litres per flush is the maximum under the US EPA WaterSense specification for toilets?','This water-efficiency limit is lower than that of many older toilet models.',4.8,'litres per flush','The WaterSense efficiency limit is 1.28 US gallons, around 4.8 litres per flush.','US EPA','https://www.epa.gov/watersense/residential-toilets',1),
 ],
 [
 q('PP-14','Culture and Pop Culture','How many Oscars did Titanic win at the 1998 Academy Awards?','It received 14 nominations and was one of the most successful Oscar films.',11,'awards','Titanic won eleven Academy Awards at the 1998 ceremony.','Academy Awards','https://www.oscars.org/oscars/ceremonies/1998'),
 q('PP-15','Culture and Pop Culture','How many pieces are in the LEGO Eiffel Tower set released in 2022?','The completed model stands nearly 1.5 metres tall.',10001,'pieces','LEGO’s Eiffel Tower set 10307 contains 10,001 pieces.','LEGO','https://www.lego.com/en-gb/product/eiffel-tower-10307'),
 q('PP-18','Everyday Life and Surprising Statistics','Approximately how many litres of water flow from a conventional US showerhead in one minute, using the EPA reference?','Water-saving showerheads generally use less than conventional models.',9.46,'litres per minute','The EPA’s conventional reference is 2.5 US gallons per minute, or around 9.46 litres.','US EPA','https://www.epa.gov/watersense/showerheads',2),
 ]
];
export const precisionQuestionCount=precisionRounds.reduce((n,r)=>n+r.length,0);
export function validatePrecisionRounds(rounds=precisionRounds){
 if(rounds.length!==6 || !rounds.every(r=>r.length===3))throw Error('Expected six three-question rounds');
 const ids=new Set();
 for(const round of rounds)for(const item of round){
  if(ids.has(item.id)||!Number.isFinite(item.answer)||item.answer<=0||!item.question||!item.unit||!item.explanation||!item.sourceUrl)throw Error('Invalid Precision Pursuit question');
  ids.add(item.id);
 }
 return true;
}
