import http from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import {resolve,extname,sep} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../dist/',import.meta.url));
const port=Number(process.env.PORT)||4173;
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.jpg':'image/jpeg','.svg':'image/svg+xml','.woff2':'font/woff2','.wav':'audio/wav'};
const server=http.createServer(async(req,res)=>{
 try{
  const url=new URL(req.url,'http://localhost');
  const pathname=decodeURIComponent(url.pathname);
  const file=resolve(root,`.${pathname.endsWith('/')?pathname+'index.html':pathname}`);
  if(!file.startsWith(root.endsWith(sep)?root:root+sep)){res.writeHead(403);res.end('Forbidden');return;}
  if(!(await stat(file)).isFile())throw new Error();
  const data=await readFile(file),headers={'Content-Type':mime[extname(file)]??'application/octet-stream','Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Accept-Ranges':'bytes'};
  if(req.headers.range){
   const match=/^bytes=(\d*)-(\d*)$/.exec(req.headers.range);
   const start=match?.[1]?Number(match[1]):match?.[2]?Math.max(0,data.length-Number(match[2])):NaN;
   const end=match?.[1]&&match?.[2]?Math.min(data.length-1,Number(match[2])):data.length-1;
   if(!Number.isInteger(start)||!Number.isInteger(end)||start<0||start>end||start>=data.length){res.writeHead(416,{'Content-Range':`bytes */${data.length}`});res.end();return;}
   res.writeHead(206,{...headers,'Content-Length':end-start+1,'Content-Range':`bytes ${start}-${end}/${data.length}`});res.end(data.subarray(start,end+1));return;
  }
  res.writeHead(200,{...headers,'Content-Length':data.length});res.end(data);
 }catch{res.writeHead(404,{'Content-Type':'text/plain'});res.end('Not found');}
});
server.listen(port,'127.0.0.1',()=>console.log(`Art History: http://127.0.0.1:${port}/`));
