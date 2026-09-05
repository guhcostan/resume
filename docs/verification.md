# Verificação local — 2026-09-05

- TypeScript: PASS (`npm run typecheck`).
- ESLint: PASS (`npm run lint`).
- Build estático com `/resume/`: PASS.
- Navegador integrado, desktop 1280×720 e mobile 390×844: cena real renderizada, sem overflow horizontal.
- Projetos: abertura pelo CTA e filtro IA; painel com dois projetos de IA; filtro Tools com três ferramentas no mobile.
- Biografia: abertura pelo hotspot da poltrona e navegação para trajetória.
- Leitor não modal: fechamento pelo botão e Escape, com retorno de foco para a navegação.
- Controles: pausa/retomada, alternância dia/noite e aproximação/reset e rotação por arraste confirmada visualmente.
- PT/EN: troca pelo cabeçalho, rota inglesa direta no build e textos do cenário traduzidos.
- Currículo servido em `/resume/files/gustavo-costa-curriculo.pdf`: HTTP 200, application/pdf.
- Sem publicação remota nesta alteração. Preview local serve o build em `http://localhost:4173/resume/`.

O conceito em `concepts/studio.png` é uma referência de direção de arte. A versão Three.js utiliza geometria procedural mais simples e não reproduz todos os detalhes de textura do render conceitual. O bundle 3D tem aproximadamente 247 kB gzip e carrega separadamente da interface.

## Rotina do personagem

- Sequência autônoma: caminhar → sentar → programar → levantar → pegar caneca → beber → devolver → deitar → descansar → acordar.
- Poses de programação, café e descanso inspecionadas no navegador integrado.
- Pernas com joelhos e braços com cotovelos articulados; transições amortecidas.
- Uma única caneca alterna entre mesa e mão.
- Pausa preserva o instante atual; movimento reduzido continua respeitado.
- Dois testes de continuidade, repetição e limites do cenário passaram, além de TypeScript, lint e build.

## Navegação ligada ao cenário

- O leitor substitui a apresentação, sem modal/backdrop. Os atalhos e rótulos saíram de cima do personagem.
- Projetos: ida à cadeira e programação enquanto a seção está aberta.
- Sobre: ida ao café, com a caneca na mão enquanto a biografia está aberta.
- Trajetória: ida à biblioteca. Fechar retoma o ciclo automático.
- Seis testes passaram: continuidade do ciclo, destinos, saída da cadeira, devolução da caneca e retomada após fechar.

- Mobile 390×844: conteúdo começa em y=543, após o cenário (até y=408); largura do documento 390 px, sem overflow horizontal.
- Cliques rápidos Projetos → Sobre → Projetos, filtro IA e Escape passaram no build servido em 4173.

## Revisão familiar e fidelidade mobile

- Referência gaga.hexly.ai aberta e inspecionada no navegador em mobile e desktop; comparação de tipografia, proporções e controles.
- Quatro personagens renderizados: Gustavo (camiseta cinza, barba, cabelo escuro, óculos), companheira lendo, cão creme e cão caramelo descansando. Companhia respeita pausa e movimento reduzido.
- Mobile 390×844 e 375×667: página inicial cabe no viewport, sem overflow horizontal. Em 375×667, documento e viewport medem exatamente 375×667.
- Leitura mobile: cabeçalho termina em y=82, cena começa em y=82 e termina em y=392; conteúdo começa em y=500, sem sobreposição.
- Zoom passa de 100% a 115% pelo botão, reset funciona; abertura de projetos e troca de idioma verificadas no build.
- TypeScript, lint, seis testes e build estático /resume/ passaram. Foto original preservada fora dos assets públicos.

## Personalização do cenário

- Mesa regulável decorativa, monitor articulado, notebook, teclado, surf, corrida, academia, comida e gravura de São Sebastião inspecionados em desktop 1280×800 e mobile 390×844.
- Mobile: viewport e largura do documento de 390 px, sem overflow horizontal; projetos abre abaixo da cena e personagem permanece sentado programando no setup novo.
- Console sem erros na inspeção. TypeScript, lint, seis testes de rotina/navegação e build estático passaram.

## Interações por objeto e atividade atual

- Removidos atalhos fixos da cena. Hover no computador e na bandeja confirmou dicas; clique no computador abriu projetos e manteve programação, sem cobrir o personagem.
- Cliques no golden, bandeja e biblioteca comandaram carinho, lanche e leitura. Toque posterior na caneca trocou da trajetória para a biografia e terminou em café.
- Poses de pesos, aquecimento e equilíbrio inspecionadas no navegador. As nove estações estão disponíveis também na lista acessível Explorar.
- A lista usa a coluna de leitura no desktop e fluxo abaixo da cena no mobile. Cartão informa ação real, destino, descobertas e retomada da rotina livre.
- Mobile 390×844 e 375×667: documento com exatamente as dimensões do viewport na tela inicial, sem overflow horizontal. Em leitura a cena termina em y=392 e o cartão começa em y=397 (390×844).
- Sete testes passaram, cobrindo os nove destinos, saída de assentos, retorno da caneca e continuidade da rotina expandida; lint, TypeScript e build /resume/ passaram.
- Toque no pufe terminou em descanso; pausa e troca PT/EN preservaram o destino. Arrastar sobre o computador não abriu conteúdo nem mudou o destino. Console sem erros na inspeção final.

## Reposicionamento profissional

- Marca e apresentação em PT/EN agora priorizam Gustavo Costa, engenharia de software e disponibilidade para freelas. Contato, projetos, LinkedIn, GitHub e currículo ficam acessíveis na introdução.
- Desktop 1280×800: texto profissional à esquerda e quadro 3D contido à direita. Projetos abre na coluna de leitura e mantém o protagonista programando.
- Mobile 390×844: sem overflow horizontal. Durante leitura, o quadro termina em y=608,5 e o conteúdo começa em y=634,5, sem sobreposição.
- Links profissionais e destino do e-mail conferidos no DOM; não foi enviado e-mail. Troca para inglês verificada. Console sem erros; TypeScript, lint e build estático passaram.

## Refinamento dos cães e objetos

- Golden e chihuahua remodelados com rostos, orelhas, patas, caudas, acessórios e caminhas distintos. Inspeção visual em desktop 1440×1000, com zoom de 130%, e mobile 390×844.
- Plantas, livros, tênis, prancha, lanche e toca-discos receberam detalhes geométricos. Nenhuma textura remota foi adicionada; incremento de aproximadamente 2 kB gzip no módulo 3D.
- Layout móvel sem overflow horizontal; pausa conferida. TypeScript, lint e build estático passaram.
- Clique direto no golden comandou carinho com os novos modelos. Console sem erros na inspeção final.

## Direção casa de praia

- Paleta e materiais revisados para branco quente, cinza, bege, madeira clara e palha; abajur e cesto com trama procedural, tecidos e tapete texturizados.
- Inspeção visual desktop 1280×800 e mobile 390×844 no build servido, sem erros no console. TypeScript, lint e build passaram. Posições das estações e rotinas preservadas.
