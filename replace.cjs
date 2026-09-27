const fs = require('fs');
const dir = fs.readdirSync('src/components');
dir.forEach(f => {
  if(f.endsWith('.jsx')) {
    let c = fs.readFileSync('src/components/'+f, 'utf8');
    c = c.replace(/'#FF6B6B'/g, "'var(--status-danger)'")
         .replace(/'#4ade80'/g, "'var(--status-success)'")
         .replace(/'#60a5fa'/g, "'var(--status-info)'");
    fs.writeFileSync('src/components/'+f, c);
  }
});
