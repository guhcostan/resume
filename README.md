# guh. — Gustavo Costa

Portfólio pessoal focado em engenharia de IA, agentes e open source, com experiência
em React Native e frontend e disponibilidade para projetos freelance.
Next.js, React e TypeScript, com exportação estática e fontes locais.

## Desenvolvimento

Requer Node.js 22 ou superior.

```bash
npm ci
npm run dev
```

Abra [localhost:3000](http://localhost:3000).

## Validação e build

```bash
npm run lint
npm run typecheck
npm run build
npm start
```

O build gera `out/`. `npm start` serve esse diretório na porta 3000.
Os filtros, o tema e os botões de copiar funcionam no navegador. Não há backend.

## Onde editar

- `lib/content.ts`: perfil, links e projetos, com IA primeiro.
- `lib/github.ts`: leitura e validação das estrelas pela API pública do GitHub.
- `lib/github-stars.json`: contagens verificadas e data da consulta, como reserva offline.
- `components/ProfileCard.tsx`: identidade, navegação, currículo e contato.
- `components/ProjectList.tsx`: filtros e apresentação dos projetos.
- `components/Experience.tsx`: empresas, períodos e detalhes profissionais.
- `components/AboutMe.tsx`: apresentação e formação.
- `app/globals.css`: cores, tipografia, composição e responsividade.
- `public/projects/`: cinco ícones próprios em WebP.
- `public/companies/`: ícones obtidos dos sites oficiais.
- `public/files/gustavo-costa-curriculo.pdf`: currículo fornecido pelo autor.
- `docs/design.md`: direção, referências e verificação visual.
- `docs/assets.md`: fontes dos logos e prompts dos ícones.

## GitHub Pages

O workflow em `.github/workflows/deploy.yml` publica quando há push em `main`.
O nome do repositório determina `NEXT_PUBLIC_BASE_PATH`, atualmente `/resume`.
Para reproduzir esse build:

```bash
NEXT_PUBLIC_BASE_PATH=/resume npm run build
```

Para domínio próprio, defina `NEXT_PUBLIC_SITE_URL=https://seu-dominio` e deixe
`NEXT_PUBLIC_BASE_PATH` vazio antes de gerar o build.

Links de currículo, imagens, fontes, sitemap e metadados respeitam o caminho da
publicação. O tema escolhido fica salvo localmente. HTML semântico, detalhes
nativos, foco visível, avisos de cópia e movimento reduzido fazem parte da UI.

## Estrelas dos projetos

A página renderiza as contagens verificadas de `lib/github-stars.json` e consulta
uma vez a API pública de repositórios do GitHub ao montar a lista. Não há token no
cliente. Os filtros não geram novas requisições. A consulta tem limite de 8 segundos.
A data abaixo dos cartões identifica quando as contagens foram consultadas.

Falhas de rede, respostas incompletas e limites da API preservam as contagens e a
data anteriores, sem substituir valores por zero. Isso funciona no GitHub Pages,
sem depender de um servidor Next.js. Para atualizar a reserva, confira os cinco
repositórios e atualize os valores e `checkedAt` no JSON.

## Português e inglês

- `/`: português; `/en/`: inglês. No GitHub Pages, os caminhos são `/resume/` e `/resume/en/`.
- O seletor PT/EN salva a escolha em `guh-language` e preserva a seção atual.
- Ao voltar ao endereço principal, a preferência salva por inglês leva a `/en/`.
  Um link direto para `/en/` sempre abre em inglês. Sem preferência, o padrão é PT.
- `lib/i18n/pt.ts` e `lib/i18n/en.ts` contêm os textos. O TypeScript exige as mesmas chaves.
- `components/SiteLayout.tsx` compartilha fontes, tema e metadados; `Portfolio.tsx`
  compartilha a interface. Layouts por idioma geram HTML estático com `lang` correto,
  canonical, hreflang, cartão social e sitemap correspondentes.
- A 404 global é bilíngue. As rotas e os links de idioma funcionam sem JavaScript;
  salvar a preferência e atualizar as estrelas dependem de JavaScript.
