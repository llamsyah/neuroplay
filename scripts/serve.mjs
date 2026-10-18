// Local preview of the static export. Production can use any static file host.
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { resolve, sep, extname } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../out/", import.meta.url));
const types = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8", ".json": "application/json", ".glb": "model/gltf-binary", ".md": "text/plain; charset=utf-8", ".txt": "text/plain; charset=utf-8", ".ico": "image/x-icon", ".ttf": "font/ttf" };
await stat(resolve(root, "index.html")).catch(() => { throw new Error("Run npm run build before npm start."); });
const server = createServer(async (request, response) => {
  try {
    if (!["GET", "HEAD"].includes(request.method)) { response.writeHead(405); response.end(); return; }
    const pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
    let file = resolve(root, `.${pathname === "/" ? "/index.html" : pathname}`);
    if (!file.startsWith(root.endsWith(sep) ? root : root + sep)) { response.writeHead(403); response.end(); return; }
    // Next static exports use /lab.html for the /lab route.
    if (!extname(file)) file += ".html";
    const content = await readFile(file);
    response.writeHead(200, { "Content-Type": types[extname(file)] ?? "application/octet-stream", "Content-Length": content.length, "X-Content-Type-Options": "nosniff" });
    response.end(request.method === "HEAD" ? undefined : content);
  } catch { response.writeHead(404); response.end("Not found"); }
});
server.listen(Number(process.env.PORT ?? 3000), "127.0.0.1", () => console.log(`Static anatomy lab: http://127.0.0.1:${server.address().port}`));
