import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
const root = process.cwd();
const mime = {'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml'};
const server = createServer(async (req,res)=>{
  try {
    const p = decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    const candidate = resolve(root, '.'+p, p.endsWith('/')?'index.html':'');
    if (candidate!==root && !candidate.startsWith(root+sep)) { res.writeHead(403).end(); return; }
    const s = await stat(candidate);
    if (!s.isFile()) {res.writeHead(404).end();return;}
    const bytes = await readFile(candidate);
    res.writeHead(200,{'content-type':mime[extname(candidate)]||'application/octet-stream','cache-control':'no-store'}).end(bytes);
  } catch {res.writeHead(404).end('Not found');}
});
const port=Number(process.env.PORT)||5173;
server.listen(port,'0.0.0.0',()=>console.log(`Puzzle prototypes: http://localhost:${port}`));
