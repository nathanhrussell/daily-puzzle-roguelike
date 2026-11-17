// Precision Pursuit exploratory playtest content, v0.1.
// Source URLs are editorial leads, not certification or evidence of reuse rights.
// Six fixed three-question challenges; no daily publication schedule.
const q=(id,category,question,guidance,answer,unit,explanation,source,sourceUrl,precision=0)=>({id,category,question,guidance,answer,unit,explanation,source,sourceUrl,precision});
export const precisionRounds=[
 [
 q('PP-01','Geography and Space','Approximately how deep is Challenger Deep, in metres?','Mount Everest is roughly 8,850 metres high. Challenger Deep is deeper still.',10935,'metres','NOAA describes Challenger Deep in the Mariana Trench as approximately 10,935 metres deep.','NOAA','https://oceanservice.noaa.gov/facts/oceandepth.html'),
 q('PP-04','People and Society','According to the ITU, how many billion people used the internet in 2026?','The global population exceeds eight billion; internet access is widespread but not universal.',6.3,'billion people','The ITU estimated 6.3 billion internet users, or 76% of the world population, in 2026.','ITU','https://www.itu.int/itu-d/reports/statistics/facts-figures-2026/',1),
 q('PP-16','Everyday Life and Surprising Statistics','Approximately how many metres wide is a full-sized football (soccer) goal, between the inside edges of its posts?','Think of the goal used in adult eleven-a-side football, rather than a smaller youth or training goal.',7.32,'metres','The International Football Association Board specifies 7.32 metres (eight yards) between the inside edges of the posts.','IFAB','https://www.theifab.com/laws/latest/the-field-of-play/',2),
 ],
 [
 q('PP-02','Geography and Space','Approximately how many kilometres across is Jupiter at its equator?','Earth is approximately 12,750 kilometres across. Jupiter is the largest planet in our Solar System and considerably wider than Earth.',142984,'kilometres','NASA lists Jupiter’s equatorial diameter as approximately 142,984 kilometres, about eleven times Earth’s.','NASA','https://science.nasa.gov/solar-system/planets/planet-sizes-and-locations-in-our-solar-system/'),
 q('PP-05','People and Society','Approximately what was global life expectancy at birth in 2023?','Think of the whole world, including countries with very different health outcomes.',73.3,'years','The global figure is a statistical estimate and may change as datasets are revised.','WHO','https://www.who.int/data/gho/data/themes/mortality-and-global-health-estimates/ghe-life-expectancy-and-healthy-life-expectancy/',1),
 q('PP-10','History','Approximately how many athletes competed in the first modern Olympic Games in 1896?','The Athens Games featured nine sports and were much smaller than today’s Olympics.',241,'athletes','The International Olympic Committee records 241 athletes from 14 participating countries.','IOC','https://www.olympics.com/ioc/news/athens-1896-the-revival-of-the-olympic-games'),
 ],
 [
 q('PP-03','Geography and Space','About how many minutes does the International Space Station take to orbit Earth once?','The station orbits only a few hundred kilometres above Earth and moves exceptionally fast.',92,'minutes','The station completes an orbit in approximately 92 minutes; its orbital period varies slightly.','ESA','https://www.esa.int/Science_Exploration/Human_and_Robotic_Exploration/International_Space_Station'),
 q('PP-07','Science and Nature','About how many times per second does a ruby-throated hummingbird flap its wings in direct flight?','These birds beat their wings much faster than most larger birds.',70,'wingbeats per second','Around 70 is a reference rate; wingbeat frequency changes with flight behaviour.','Smithsonian National Zoo','https://nationalzoo.si.edu/migratory-birds/hummingbirds'),
 q('PP-13','Culture and Pop Culture','Approximately how many minutes long is the theatrical cut of The Lord of the Rings: The Return of the King?','Use the original cinema release, not the extended edition.',201,'minutes','The BBFC lists an approximate running time of 201 minutes for the theatrical film.','BBFC','https://www.bbfc.co.uk/release/the-lord-of-the-rings-the-return-of-the-king-q29sbgvjdglvbjpwwc00ntaymte'),
 ],
 [
 q('PP-06','People and Society','What percentage of the world’s population used safely managed drinking-water services in 2024?','“Safely managed” means water from an improved source, accessible when needed and free from contamination.',74,'percent','WHO and UNICEF estimate that about 74% used safely managed drinking-water services in 2024.','WHO / UNICEF','https://washdata.org/'),
 q('PP-08','Science and Nature','Approximately how tall is an adult emperor penguin when standing, in centimetres?','Emperor penguins are the tallest living penguin species. Picture one standing beside an adult person.',115,'centimetres','The British Antarctic Survey describes emperor penguins as approximately 115 centimetres tall. Individual birds vary.','British Antarctic Survey','https://legacy.bas.ac.uk/about_antarctica/wildlife/birds/penguins/index.php'),
 q('PP-11','History','Approximately how many hours did the Apollo 11 lunar module remain on the Moon?','Armstrong and Aldrin made one moonwalk, but their module remained on the surface much longer.',21.6,'hours','NASA records a lunar-surface stay of 21 hours and 36 minutes, equal to 21.6 hours.','NASA','https://www.nasa.gov/history/apollo-11-mission-overview/',1),
 ],
 [
 q('PP-09','Science and Nature','How many permanent teeth does an adult normally have, including wisdom teeth?','A complete adult set includes teeth in both the upper and lower jaws. Not everyone develops or retains their wisdom teeth.',32,'teeth','A complete set of adult permanent teeth contains 32, including four wisdom teeth; many adults have fewer.','NHS','https://www.hey.nhs.uk/patient-leaflet/removal-wisdom-teeth/'),
 q('PP-12','History','How tall was the Great Pyramid of Giza originally, in metres?','It was taller in antiquity than today and remained the tallest human-made structure for millennia.',147,'metres','Its original height is generally given as approximately 146.6–147 metres.','UNESCO','https://whc.unesco.org/en/list/86/'),
 q('PP-17','Everyday Life and Surprising Statistics','Approximately how many grams of sugar are in a standard 330 ml can of Coca-Cola Original Taste?','One teaspoon of sugar weighs roughly four grams; a can of regular cola contains several teaspoons.',35,'grams','Coca-Cola lists approximately 35 grams of sugar in a standard 330 ml can of its Original Taste drink.','Coca-Cola','https://www.coca-cola.com/es/es/about-us/faq/cuanto-azucar-hay-en-una-lata-de-cocacola'),
 ],
 [
 q('PP-14','Culture and Pop Culture','How many Oscars did Titanic win at the 1998 Academy Awards?','It received 14 nominations and was one of the most successful Oscar films.',11,'awards','Titanic won eleven Academy Awards at the 1998 ceremony.','Academy Awards','https://www.oscars.org/oscars/ceremonies/1998'),
 q('PP-15','Culture and Pop Culture','Approximately how many seconds long is Queen’s original recording of Bohemian Rhapsody?','The original single was notably long for a chart hit when released in 1975.',355,'seconds','The original recording lasts about five minutes and 55 seconds (355 seconds), unusually long for a 1970s single.','Official Charts','https://www.officialcharts.com/node/401170/'),
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
