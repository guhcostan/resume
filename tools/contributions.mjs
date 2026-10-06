/* ==========================================================================
   Snapshot das contribuições do GitHub ("Um ano em blocos")
   Baixa o último ano de contribuições de @guhcostan e salva em
   content/data/contributions.json. O build usa esse arquivo; se a rede
   estiver disponível no build, ele tenta uma versão mais nova antes.

   Uso: npm run contributions
   ========================================================================== */
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
export const CONTRIB_FILE = path.join(ROOT, 'content', 'data', 'contributions.json');
export const GITHUB_USER = 'guhcostan';
const API = `https://github-contributions-api.jogruber.de/v4/${GITHUB_USER}?y=last`;

/* Baixa e normaliza: { user, total, updated, days: [{ date, count, level }] } */
export async function fetchContributions({ timeoutMs = 8000 } = {}) {
  const res = await fetch(API, { signal: AbortSignal.timeout(timeoutMs) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  const days = (data.contributions || []).map(({ date, count, level }) => ({ date, count, level }));
  if (days.length < 300) throw new Error(`resposta incompleta (${days.length} dias)`);
  return {
    user: GITHUB_USER,
    total: data.total?.lastYear ?? days.reduce((sum, d) => sum + d.count, 0),
    updated: days[days.length - 1].date,
    days
  };
}

// Execução direta: atualiza o snapshot versionado
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  fetchContributions()
    .then(async (data) => {
      await fs.mkdir(path.dirname(CONTRIB_FILE), { recursive: true });
      await fs.writeFile(CONTRIB_FILE, JSON.stringify(data) + '\n');
      console.log(`[contributions] ${data.total} contribuições até ${data.updated} salvas em content/data/`);
    })
    .catch((err) => {
      console.error('[contributions] falhou:', err.message);
      process.exit(1);
    });
}
