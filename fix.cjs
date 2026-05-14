const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = dir + '/' + file;
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.jsx')) {
      results.push(file);
    }
  });
  return results;
}

walk('src').forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  // Replaces \${ with ${
  content = content.replace(/\\\$\\{/g, '${');
  fs.writeFileSync(f, content);
});
console.log('Replaced escaped template literals');
