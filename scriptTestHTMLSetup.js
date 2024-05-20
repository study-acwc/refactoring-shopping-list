import fs from 'fs';
import { JSDOM } from 'jsdom';

const htmlContent = fs.readFileSync('./index.html', 'utf8');
global.document.documentElement.innerHTML = htmlContent