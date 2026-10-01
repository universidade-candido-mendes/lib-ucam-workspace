const fs = require('fs');
const postcss = require('postcss');

const css = fs.readFileSync('vcss.css', 'utf8');

const extract = (regex) => {
    return postcss.plugin('extract', () => {
        return (root) => {
            root.walkComments(comment => comment.remove());
            root.walkRules(rule => {
                let match = rule.selectors.some(sel => regex.test(sel));
                if (!match) {
                    rule.remove();
                }
            });
            root.walkAtRules(rule => {
                if (rule.name === 'media' || rule.name === 'container' || rule.name === 'supports') {
                    if (!rule.nodes || rule.nodes.length === 0) rule.remove();
                } else {
                    rule.remove();
                }
            });
            root.walkAtRules(rule => {
                if (!rule.nodes || rule.nodes.length === 0) rule.remove();
            });
        };
    }).process(css, { from: undefined }).css;
};

const extractRoot = () => {
    return postcss.plugin('extract-root', () => {
        return (root) => {
            root.walkComments(comment => comment.remove());
            root.walkRules(rule => {
                let match = rule.selectors.some(sel => 
                    sel.includes(':root') || 
                    /^[a-zA-Z]+$/.test(sel) || 
                    sel.startsWith('::') || 
                    sel.startsWith('html') || 
                    sel.startsWith('body')
                );
                if (rule.selectors.some(sel => sel.includes('.ucam-'))) {
                    match = false;
                }
                if (!match) {
                    rule.remove();
                }
            });
        };
    }).process(css, { from: undefined }).css;
};

fs.writeFileSync('stat.css', extract(/\.ucam-stat/));
fs.writeFileSync('card.css', extract(/\.ucam-card/));
fs.writeFileSync('table.css', extract(/\.ucam-table/));
fs.writeFileSync('desc.css', extract(/\.ucam-descricao/));
fs.writeFileSync('nav.css', extract(/\.ucam-nav/));
fs.writeFileSync('appbar.css', extract(/\.ucam-appbar/));
fs.writeFileSync('shell.css', extract(/\.ucam-(shell|main|content|page)/));
fs.writeFileSync('tokens.css', extractRoot());

console.log('PostCSS split complete.');
