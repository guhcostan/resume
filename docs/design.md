# guh. — direção visual

Uma página pessoal simples, útil e reconhecível: assinatura tipográfica `guh.`,
perfil à esquerda, projetos de IA e open source à direita e experiência logo abaixo.
No celular, tudo segue uma única coluna. O currículo fornecido e os repositórios
públicos do autor são as fontes do conteúdo profissional.

## Referências consultadas em 04/09/2026

- [Hivinz](https://hivinz.com/): perfil compacto, fundo pontilhado, cartões de
  projetos e hierarquia direta. Principal referência de composição.
- [Paco](https://paco.me/): apresentação breve e links que levam ao trabalho real.
- [Emil Kowalski](https://emilkowal.ski/): foco no que a pessoa faz e compartilha.
- [Lee Robinson](https://leerob.com/) e [Rauno](https://rauno.me/): consultados como
  referências complementares de portfólios centrados em conteúdo e interação.

A adaptação usa o conteúdo e a identidade do Guh. Os projetos são ferramentas de
terminal, SDKs e agentes: seus ícones representam essas funções. O comando real
`npx mac-cleaner-cli scan` serve como demonstração útil e pode ser copiado.

## Sistema visual

- Fundo cinza esverdeado `#f3f4f1`, pontos `#d8dcd2`, superfícies brancas,
  texto `#252822`, acento verde `#53755b`.
- Tema escuro com fundo `#171a17`, superfície `#202420` e texto `#eef0e9`.
- Bricolage Grotesque para títulos e marca, Manrope para leitura,
  IBM Plex Mono para tecnologias e metadados. Fontes servidas localmente.
- Conteúdo até 1120 px, coluna do perfil com 300 px, intervalo de 36 px.
- Cartões com borda fina, raio de 12 px, sombra discreta e movimento curto.
- Ícones de projetos: cinco símbolos próprios, fundo pastel e arquivo WebP
  transparente de 256 px. Logos das experiências mantêm as cores oficiais.
- Assinatura `guh.` no perfil, identificação da página e cartão de compartilhamento;
  monograma `g.` no favicon. Sem emojis.

## Comportamento

Filtros Todos/Ferramentas/IA, links diretos para cada repositório, cópia de comando
e e-mail com retorno acessível, tema persistente, currículo em PDF e experiência
expansível com elementos `details` nativos. Navegação por âncoras e link para pular
a navegação. Movimento respeita `prefers-reduced-motion`.

## Comparação visual com Hivinz

1. Composição: perfil fixo à esquerda e uma sequência de projetos à direita.
2. Hierarquia: nome e função claros; nome do projeto antes da descrição técnica.
3. Densidade: apresentação compacta, sem hero que empurre o trabalho para baixo.
4. Superfícies: fundo pontilhado discreto e cartões claros com bordas leves.
5. Identidade: a marca `guh.` e ícones semânticos substituem a identidade da referência.
6. Adaptação mobile: perfil, navegação e projetos em ordem de leitura; ações ficam
   acessíveis sem rolagem horizontal.

As capturas foram inspecionadas no navegador. Os textos finais correspondem ao
conteúdo implementado; títulos, períodos, descrições e comandos são próprios.

## Verificação final

- PASS: lint, TypeScript e build estático, inclusive com `/resume`.
- PASS: revisão visual em 360, 390, 768 e 1440 px; sem rolagem horizontal.
- PASS: cinco ícones de projetos e três logos de empresas carregados.
- PASS: filtros com 5/3/2 resultados, cópia do comando e do e-mail.
- PASS: detalhes profissionais, navegação por âncoras e tema após recarregar.
- PASS: 21 URLs exportadas respondendo, PDF válido, fontes carregadas e console
  sem erros na versão estática servida localmente.
- A publicação usa o workflow de `main` para o GitHub Pages; a prévia local fica na porta 3000.

## Posicionamento em IA

A apresentação destaca engenharia de IA, agentes e LLMs. React Native, TypeScript,
frontend e liderança na Thoughtworks continuam na trajetória. A disponibilidade
para freelas foi informada pelo autor e aparece no perfil e no contato.

`b3analysis` e `claude-mega-brain` abrem a lista, com descrições verificadas nos
READMEs públicos. As ferramentas continuam acessíveis na mesma seção. Estrelas
ficam junto aos metadados, com links para os stargazers e data da consulta.

A atualização pública das contagens foi observada no navegador. Também foram
verificados dados completos, contagem zero legítima, dados incompletos/inválidos,
repositório de outro dono, erro de rede e limite da API. Nos erros, a reserva
permanece com sua data original. Layout e filtros conferidos em desktop e mobile.
