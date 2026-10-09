const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = __dirname;
const mime = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.ico':'image/x-icon','.txt':'text/plain; charset=utf-8'};
http.createServer((req,res)=>{
 const pathname=decodeURIComponent((req.url||'/').split('?')[0]);
 const normalized=path.normalize(pathname==='/'?'index.html':pathname.replace(/^\/+/,''));
 if(normalized.split(path.sep).some(part=>part.startsWith('.')) || /(^|\/)tests(\/|$)/.test(normalized) || !/\.(html|css|js|svg|txt)$/.test(normalized)){res.writeHead(404);res.end('404');return}
 const filename=path.resolve(root,normalized);
 if(!filename.startsWith(root+path.sep)||!fs.existsSync(filename)||!fs.statSync(filename).isFile()) {res.writeHead(404);res.end('404');return}
 res.writeHead(200,{'Content-Type':mime[path.extname(filename)]||'application/octet-stream','X-Content-Type-Options':'nosniff'});
 fs.createReadStream(filename).pipe(res);
}).listen(process.env.PORT||4173,()=>console.log(`LendaPet: http://localhost:${process.env.PORT||4173}`));
