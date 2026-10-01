const fs = require('fs');

const svg = fs.readFileSync('icons.svg', 'utf8');
const htmlFile = 'projects/ucam-docs/src/index.html';
let html = fs.readFileSync(htmlFile, 'utf8');

if (!html.includes('<svg')) {
    html = html.replace('<body>', '<body>\n  ' + svg);
    fs.writeFileSync(htmlFile, html);
    console.log('Injected SVG!');
} else {
    console.log('SVG already there!');
}
