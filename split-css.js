const fs = require('fs');
const postcss = require('postcss');

const css = fs.readFileSync('vcss.css', 'utf8');

const regexes = [
    /\.ucam-stat/,
    /\.ucam-card/,
    /\.ucam-table/,
    /\.ucam-descricao/,
    /\.ucam-nav/,
    /\.ucam-appbar/,
    /\.ucam-(shell|main|content|page)/
];

const extractGlobal = () => {
    return postcss.plugin('extract-global', () => {
        return (root) => {
            root.walkComments(comment => comment.remove());
            root.walkRules(rule => {
                let belongsToComponent = regexes.some(r => rule.selectors.some(sel => r.test(sel)));
                // Also remove :root because it is already in _tokens.scss!
                if (rule.selectors.some(s => s.includes(':root') || /^[a-zA-Z]+$/.test(s) && !s.includes('.ucam-'))) {
                     // Wait, tags like body, html are in tokens.scss, but let's keep them here or remove them?
                     // Let's remove :root because it's exactly what we put in tokens.scss.
                     if (rule.selectors.some(s => s.includes(':root'))) {
                         rule.remove();
                         return;
                     }
                }
                
                if (belongsToComponent) {
                    rule.remove();
                }
            });
            root.walkAtRules(rule => {
                if (rule.name === 'media' || rule.name === 'container' || rule.name === 'supports') {
                    if (!rule.nodes || rule.nodes.length === 0) rule.remove();
                }
            });
            root.walkDecls(decl => {
                if (decl.value.includes("url('../")) {
                    decl.value = decl.value.replace(/url\('\.\.\//g, "url('https://ucam-ds.vercel.app/");
                }
            });
        };
    }).process(css, { from: undefined }).css;
};

fs.writeFileSync('global.css', extractGlobal());
console.log('Global CSS extracted without comments.');
