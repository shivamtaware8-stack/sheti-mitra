const fs = require('fs');
const h = fs.readFileSync('public/index.html', 'utf8');
console.log('class authScreen:', h.includes('modalContent authScreen'));
console.log('class authVisual:', h.includes('class="authVisual"'));
console.log('class authPanel:', h.includes('class="authPanel"'));
console.log('div-open:', (h.match(/<div[^a-z/]/g) || []).length, 'div-close:', (h.match(/<\/div>/g) || []).length);
console.log('form-open:', (h.match(/<form /g) || []).length, 'form-close:', (h.match(/<\/form>/g) || []).length);
console.log('button-open:', (h.match(/<button /g) || []).length, 'button-close:', (h.match(/<\/button>/g) || []).length);
