import { readFile, writeFile, mkdir } from "node:fs/promises";
import { createHash } from "node:crypto";

const manifest = JSON.parse(await readFile(new URL("../public/models/brain-manifest.json", import.meta.url), "utf8"));
const response = await fetch(`${manifest.sourceBase}/${manifest.sourceFile}`);
if (!response.ok) throw new Error(`Asset download failed: HTTP ${response.status}`);
const bytes = Buffer.from(await response.arrayBuffer());
if (createHash("sha256").update(bytes).digest("hex") !== manifest.sha256) {
  throw new Error("Source asset differs from the inspected version; refusing to overwrite.");
}
await mkdir(new URL("../public/models/", import.meta.url), { recursive: true });
await writeFile(new URL(`../public/models/${manifest.localFile}`, import.meta.url), bytes);
console.log(`Verified and saved ${bytes.length} bytes from pinned HRA source.`);
