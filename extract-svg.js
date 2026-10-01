const fs = require('fs');
const md = fs.readFileSync('/home/Matheus/.gemini/antigravity/brain/a7490aa7-dd67-4f7c-a18c-9ce9ae9b9628/.system_generated/steps/314/content.md', 'utf8');

// The SVG starts right after <body> or is just <svg ...><symbol ...
const match = md.match(/<svg[^>]*display:\s*none[^>]*>.*?<\/svg>/s);
if (match) {
    fs.writeFileSync('icons.svg', match[0]);
    console.log('Found SVG!');
} else {
    // maybe it doesn't have display:none
    const m2 = md.match(/<svg[^>]*>.*?<symbol.*?<\/svg>/s);
    if (m2) {
        fs.writeFileSync('icons.svg', m2[0]);
        console.log('Found SVG without display none!');
    }
}
