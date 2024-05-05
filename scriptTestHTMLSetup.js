import fs from 'fs';

const htmlContent = fs.readFileSync('./index.html', 'utf8');
global.document.documentElement.innerHTML = htmlContent