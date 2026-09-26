const fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'dist');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const refs=[...html.matchAll(/(?:src|href)="([^"#]+)"/g)].map(m=>m[1]).filter(s=>!s.startsWith('http')&&!s.startsWith('data:'));
for(const ref of refs){if(!fs.existsSync(path.join(root,ref)))throw Error('Missing site file: '+ref);}
for(const name of ['blossom.png','coast.png','hills.png','kivi-sakura.png','anime.esm.min.js'])if(!fs.existsSync(path.join(root,'assets',name)))throw Error('Missing asset: '+name);
console.log('Site verified: '+refs.length+' local references and required assets. Ready to deploy dist.');
