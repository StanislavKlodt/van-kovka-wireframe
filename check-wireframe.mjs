import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {pages,stock} from './wireframe-data.mjs';
import {models} from './wireframe-commerce.mjs';
const base=path.resolve('dist');let checked=0;
for(const [id] of pages){
 const file=path.join(base,'prototypes',id+'.html'),html=fs.readFileSync(file,'utf8');
 assert.equal((html.match(/<h1[ >]/g)||[]).length,1,id+' has one H1');
 const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(ids.length,new Set(ids).size,id+' unique element IDs');
 for(const m of html.matchAll(/(?:href|src)="([^"]*)"/g)){
  const target=m[1];if(/^(https?:|mailto:|tel:|data:)/.test(target))continue;
  const [url,hash]=target.split('#'),filePart=url.split('?')[0];
  if(!filePart){if(hash)assert(ids.includes(hash),id+' anchor '+hash);continue}
  const local=path.resolve(path.dirname(file),decodeURIComponent(filePart));assert(local.startsWith(base+path.sep),'relative path within dist');assert(fs.existsSync(local),id+' missing '+target);
  if(hash&&local.endsWith('.html'))assert(fs.readFileSync(local,'utf8').includes('id="'+hash+'"'),id+' target anchor '+target);checked++;
 }
 assert(!html.includes('https://van-kovka.ru/element/interernyy-dekor/'),'No link for Glanzepol');assert(!html.includes('Художественная ковка</a>'),'No redundant partner link');
 assert(!html.includes('<iframe'),'No third-party frames');
}
assert.equal(models.length,new Set(models.map(m=>m.id)).size);assert.equal(stock.length,new Set(stock.map(s=>s[0])).size);
for(const script of ['wireframe-app.js','wireframe-catalog.js']){const js=fs.readFileSync(script,'utf8');assert(!/fetch\s*\(|XMLHttpRequest|sendBeacon|https?:\/\//.test(js),'No form transmission: '+script)}
console.log(`${pages.length} pages: single H1, unique IDs, ${checked} local asset/link checks, anchors, partner separation, no form transmission: OK`);
