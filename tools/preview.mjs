/* ==========================================================================
   Prévia em guhcostan.dev/preview/
   Pega o dist/ do build normal e monta dist-preview/preview/: prefixa os
   caminhos absolutos, marca noindex (para não concorrer com o site no
   Google) e gera um _headers com a CSP e o hash do bootstrap da prévia.
   Publicada pelo Worker resume-preview (wrangler.preview.jsonc), que só
   atende /preview*: o site em produção não muda.

   Uso: npm run build:preview
   ========================================================================== */
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const OUT = path.join(ROOT, 'dist-preview');
const BASE = '/preview';
// O PDF e a logo antiga não mudam: os links apontam para a produção
const SKIP = [/^files\//, /^assets\/guh-logo/, /^_headers$/, /^sitemap\.xml$/, /^robots\.txt$/];

async function walk(dir, rel = '', out = []) {
  for (const e of await fs.readdir(dir, { withFileTypes: true })) {
    const r = rel ? `${rel}/${e.name}` : e.name;
    if (e.isDirectory()) await walk(path.join(dir, e.name), r, out);
    else if (!SKIP.some((re) => re.test(r))) out.push(r);
  }
  return out;
}

const files = await walk(DIST);
await fs.rm(OUT, { recursive: true, force: true });
let bootHash = null;
for (const rel of files) {
  let buf = await fs.readFile(path.join(DIST, rel));
  if (rel.endsWith('.html')) {
    let s = buf.toString('utf8');
    s = s.replace(/\b(href|src)="\/(?!\/)/g, `$1="${BASE}/`);
    s = s.replace(/<meta name="robots" content="[^"]*">/, '<meta name="robots" content="noindex, nofollow">');
    s = s.replace("location.pathname === '/'", `location.pathname === '${BASE}/'`);
    const m = s.match(/<script>\s*\(function \(\) \{[\s\S]*?\}\)\(\);\s*<\/script>/);
    if (m) {
      const code = m[0].replace(/^<script>/, '').replace(/<\/script>$/, '');
      bootHash = `sha256-${createHash('sha256').update(code).digest('base64')}`;
    }
    buf = Buffer.from(s);
  }
  const dst = path.join(OUT, 'preview', rel);
  await fs.mkdir(path.dirname(dst), { recursive: true });
  await fs.writeFile(dst, buf);
}

const prod = await fs.readFile(path.join(DIST, '_headers'), 'utf8');
const csp = prod.match(/Content-Security-Policy: (.*)/)[1].replace(/'sha256-[^']+'/, `'${bootHash}'`);
await fs.writeFile(path.join(OUT, '_headers'), `${BASE}/*
  Content-Security-Policy: ${csp}
  X-Robots-Tag: noindex, nofollow
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()
  Cache-Control: no-cache
`);
console.log(`[preview] ${files.length} arquivos em dist-preview${BASE}/`);
