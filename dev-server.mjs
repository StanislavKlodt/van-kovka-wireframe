import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const base=path.join(path.dirname(fileURLToPath(import.meta.url)),'dist');
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'application/javascript; charset=utf-8'};
http.createServer(async(req,res)=>{try{const pathname=decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname);const filename=path.resolve(base,'.'+(pathname==='/'?'/index.html':pathname));if(!filename.startsWith(base+path.sep)){res.writeHead(403);res.end();return;}const content=await fs.readFile(filename);res.writeHead(200,{'content-type':mime[path.extname(filename)]||'application/octet-stream','cache-control':'no-store'});res.end(content);}catch{res.writeHead(404);res.end('Not found');}}).listen(8768,'127.0.0.1',()=>process.stdout.write('Local: http://127.0.0.1:8768\n'));
