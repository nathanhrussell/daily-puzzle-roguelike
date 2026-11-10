// Sample challenges are editorial fixtures, not a validated daily-content pipeline.
export const wordRounds=[
 {seed:'CRANE',gold:'R'},
 {seed:'SPARK',gold:'A'},
 {seed:'BRIDGE',gold:'I'}
];
export const numberRounds=[
 {question:'How many squares are there on a standard chessboard, counting only the smallest squares?',answer:64,unit:'squares',explain:'8 rows × 8 columns = 64.'},
 {question:'How many minutes are there in a non-leap year?',answer:525600,unit:'minutes',explain:'365 × 24 × 60 = 525,600.'},
 {question:'How many sides does a regular dodecagon have?',answer:12,unit:'sides',explain:'A dodecagon has 12 sides.'}
];
export const allocationRounds=[
 {prompt:'Match each work to its author.',questions:['Frankenstein','Pride and Prejudice','The Hobbit'],answers:['J. R. R. Tolkien','Mary Shelley','Jane Austen'],correct:['Mary Shelley','Jane Austen','J. R. R. Tolkien']},
 {prompt:'Match each element to its chemical symbol.',questions:['Iron','Gold','Sodium'],answers:['Na','Fe','Au'],correct:['Fe','Au','Na']},
 {prompt:'Match each instrument to its family.',questions:['Oboe','Cello','Timpani'],answers:['Percussion','Woodwind','Strings'],correct:['Woodwind','Strings','Percussion']}
];
export const rankingRounds=[
 {prompt:'Arrange these numbers from smallest to largest.',items:['17','5','29','11','23'],correct:['5','11','17','23','29'],explain:'5 < 11 < 17 < 23 < 29.'},
 {prompt:'Arrange these planets from closest to farthest from the Sun.',items:['Saturn','Earth','Mars','Mercury','Venus'],correct:['Mercury','Venus','Earth','Mars','Saturn'],explain:'Mercury, Venus, Earth, Mars, Saturn.'},
 {prompt:'Arrange these decades from earliest to latest.',items:['1980s','1950s','2000s','1970s','1990s'],correct:['1950s','1970s','1980s','1990s','2000s'],explain:'Chronological order.'}
];
export const paths=['words','numbers','trivia','ranking'];
