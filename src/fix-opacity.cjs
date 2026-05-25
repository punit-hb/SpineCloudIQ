const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {
    const p = path.join(dir, file);
    if(fs.statSync(p).isDirectory()) {
      filelist = walkSync(p, filelist);
    } else {
      filelist.push(p);
    }
  });
  return filelist;
}
const files = walkSync('/Users/dhruvisavsani/Downloads/Super Admin Panel Design (1)/src/app/pages').filter(f => f.endsWith('.tsx'));

let count = 0;
files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  let updated = content.replace(/(<thead[^>]*className=["'][^"']*)bg-muted\/(?:30|50)([^"']*["'])/g, '$1bg-muted$2');
  if (content !== updated) {
    fs.writeFileSync(f, updated);
    count++;
  }
});
console.log(`Updated ${count} files.`);
