// bin/fageboot.mjs  (Node 18+)
// Uso: node bin/fageboot.mjs page "Demo A" --desc "Texto opcional"

import fs from 'node:fs/promises';
import path from 'node:path';

const [, , type, ...rest] = process.argv;
if (!type || !['page', 'component'].includes(type) || rest.length === 0) {
  console.log(`Uso:
  node bin/fageboot.mjs page "Nombre" --desc "Texto"
  node bin/fageboot.mjs component "Nombre" --desc "Texto"`);
  process.exit(1);
}

function parseArgs(arr) {
  const out = { name: [], desc: '' };
  let d = false;
  for (const p of arr) {
    if (p === '--desc') { d = true; continue; }
    d ? out.desc += (out.desc ? ' ' : '') + p : out.name.push(p);
  }
  out.name = out.name.join(' ');
  return out;
}

const args = parseArgs(rest);
const title = args.name.trim();
if (!title) { console.log('Falta el nombre.'); process.exit(1); }

const slug = title
  .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-zA-Z0-9]+/g, '-')
  .replace(/(^-|-$)/g, '')
  .toLowerCase();

const root = process.cwd();
const dataPath = path.join(root, 'data', 'modules.json');
const dir = type === 'page' ? path.join('pages', slug) : path.join('components', slug);
const dest = path.join(root, dir);
await fs.mkdir(dest, { recursive: true });

// CSS compartido (ruta relativa desde /pages/<slug>/ o /components/<slug>/)
const cssRel = '../../assets/hub.css';

const html = `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <title>${title} · FAGESAS</title>
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <link rel="stylesheet" href="${cssRel}">
</head>
<body>
  <div class="wrap">
    <header>
      <div class="logo"></div>
      <div>
        <h1>${title}</h1>
        <div class="muted">${type === 'page' ? 'Página' : 'Componente'} generado por FageBoot.</div>
      </div>
    </header>

    <section class="card">
      <p class="muted">${args.desc || 'Descripción pendiente.'}</p>
      <a class="btn" href="../../">← Volver al Hub</a>
    </section>

    <footer>© FAGESAS · FageBoot</footer>
  </div>
</body>
</html>`;

await fs.writeFile(path.join(dest, 'index.html'), html, 'utf8');

// Asegura el JSON
try { await fs.access(dataPath); }
catch { await fs.mkdir(path.dirname(dataPath), { recursive: true }); await fs.writeFile(dataPath, '[]', 'utf8'); }

const mods = JSON.parse(await fs.readFile(dataPath, 'utf8'));

// ¡OJO! rutas RELATIVAS (sin "/" inicial) para que funcionen bajo /<repo>/
const itemPath = `${dir}/`;
if (!mods.find(m => m.path === itemPath)) {
  mods.push({ title, path: itemPath, type, desc: args.desc || '' });
  await fs.writeFile(dataPath, JSON.stringify(mods, null, 2), 'utf8');
}

console.log(`✅ Generado: ${dir}/index.html`);
console.log(`🔗 Hub: ${title} → ${itemPath}`);
