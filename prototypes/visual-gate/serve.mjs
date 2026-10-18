import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { dirname, extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const prototypeRoot = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(prototypeRoot, '../..');
const mappings = [
  ['/vendor/three/', resolve(repoRoot, 'node_modules/three/build')],
  ['/vendor/addons/', resolve(repoRoot, 'node_modules/three/examples/jsm')],
  ['/models/', resolve(repoRoot, 'public/models')],
  ['/fonts/', resolve(repoRoot, 'public/fonts')],
];
const mime = { '.html':'text/html; charset=utf-8', '.js':'text/javascript', '.css':'text/css', '.json':'application/json', '.glb':'model/gltf-binary', '.ttf':'font/ttf', '.md':'text/plain; charset=utf-8', '.png':'image/png', '.jpg':'image/jpeg' };
const server = createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const match = mappings.find(([prefix]) => pathname.startsWith(prefix));
    const root = match ? match[1] : prototypeRoot;
    const relative = match ? pathname.slice(match[0].length) : pathname === '/' ? 'index.html' : pathname.slice(1);
    const target = resolve(root, relative);
    if (!target.startsWith(root + sep) || !(await stat(target)).isFile()) throw new Error('Not found');
    res.writeHead(200, { 'Content-Type':mime[extname(target)] || 'application/octet-stream', 'Cache-Control':'no-store', 'X-Content-Type-Options':'nosniff' });
    createReadStream(target).pipe(res);
  } catch { res.writeHead(404); res.end('Not found'); }
});
server.listen(3011, '127.0.0.1', () => process.stdout.write('Visual prototype: http://127.0.0.1:3011/\n'));
