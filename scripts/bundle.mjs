import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicRoot = path.join(projectRoot, "public");
const output = path.join(projectRoot, "dist/server/index.js");

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml"
};

async function collectFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await collectFiles(fullPath));
    else files.push(fullPath);
  }
  return files;
}

const assets = {};
for (const file of await collectFiles(publicRoot)) {
  const route = `/${path.relative(publicRoot, file).replaceAll(path.sep, "/")}`;
  assets[route] = {
    type: mimeTypes[path.extname(file)] || "application/octet-stream",
    body: await readFile(file, "utf8")
  };
}

const worker = `const assets = ${JSON.stringify(assets)};

export default {
  async fetch(request) {
    const url = new URL(request.url);
    let pathname = decodeURIComponent(url.pathname);
    if (pathname === "/") pathname = "/index.html";
    const asset = assets[pathname];
    if (!asset) return new Response("Not found", { status: 404 });
    return new Response(asset.body, {
      headers: {
        "content-type": asset.type,
        "cache-control": pathname.endsWith(".html") ? "no-cache" : "public, max-age=3600"
      }
    });
  }
};
`;

await writeFile(output, worker);
console.log(`Bundled ${Object.keys(assets).length} public files.`);
