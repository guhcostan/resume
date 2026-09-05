# Pequeno mundo — direção visual

Ateliê habitável, inspirado na proposta de espaço acolhedor e explorável do prompt. A narrativa foi adaptada ao portfólio de Gustavo: mesa de trabalho para projetos, biblioteca para trajetória, poltrona para biografia. O personagem é um avatar estilizado fictício, não uma reprodução fotográfica.

Paleta: papel quente #f7f3e9, floresta #283e2b, sálvia #939c79, madeira #b9824b e terracota #c57653. Títulos em Georgia; controles e texto em Manrope local. A interface ocupa uma tela no desktop e organiza texto, cena e controles verticalmente no celular. Conteúdos extensos abrem em leitor lateral não modal, com foco inicial e fechamento por Escape.

Conceito: `concepts/studio.png`, gerado pela ferramenta Image Gen integrada. Brief: screenshot desktop de portfólio “guh. / pequeno mundo”, texto editorial à esquerda, ateliê isométrico à direita, paredes sálvia, piso de carvalho, tapete circular creme, mesa com computador, biblioteca, plantas, personagem, luz quente e controles HTML de navegação/rotação/zoom. O conceito orienta composição, cores e objetos; os modelos finais são geometria real e texturas procedurais, com aparência mais simplificada que o render de referência.

A cena usa peças reutilizáveis. Para expandir, componha um móvel em `objects.tsx`, posicione-o em `Studio.tsx` e associe um hotspot a um painel. Os destinos do personagem ficam separados em `Character.tsx`; preserve o espaço livre para evitar cruzar móveis.

## Revisão familiar / referência mobile

Referência visual inspecionada em https://gaga.hexly.ai/ a 390×844: cabeçalho pequeno, título serifado curto, dados discretos, diorama quase na largura inteira, atividade e controles na parte inferior. A página principal passou a ocupar uma tela. O leitor continua ao lado no desktop e abaixo no mobile, preservando o pedido de não cobrir o protagonista.

Paleta revisada para papel #f3f1e9, paredes #c0c4ae e #b6bea4 e madeira clara. Paredes mais baixas ampliam a percepção do piso.

Os quatro personagens foram adaptados da fotografia fornecida: protagonista de camiseta cinza, cabelo escuro, barba e óculos pretos; companheira com cabelo preso, brincos e roupa clara lendo; cão grande creme com bandana verde e cão pequeno caramelo de pelagem volumosa. Ambos os cães descansam fora dos corredores de navegação. A foto não foi copiada para os assets públicos.

Conceito de apoio: `concepts/family-mobile.png`, gerado com Image Gen integrado. Prompt: tela móvel 390×844, pequeno mundo pessoal, tipografia compacta, cabeçalho discreto, ateliê isométrico com quatro habitantes (homem de camiseta cinza e óculos, mulher lendo, cão creme e cão caramelo dormindo), cartão de atividade e controles ao pé; estética acolhedora, sálvia e marfim. O layout final segue prioritariamente a referência real do usuário, com modelos geométricos estilizados em tempo real.

## Objetos pessoais

O setup preserva as posições de teclado e cadeira para manter a animação alinhada. A mesa tem estrutura telescópica e controle decorativos, monitor em braço articulado e notebook inspirado no MacBook em suporte. Prancha, tênis, pesos, tapete e garrafa ocupam as bordas livres; a bandeja de comida fica sobre a biblioteca. A gravura costeira identifica São Sebastião. Golden com orelhas caídas e focinho largo; chihuahua menor, com orelhas pontudas e focinho estreito.

## Descoberta pelos objetos

Os nove objetos interativos substituem a navegação fixa da cena. Volumes de seleção acompanham a câmera; um realce suave e uma dica curta aparecem apenas no hover. Toque executa diretamente. Arrastes acima de cinco pixels não disparam ações. O menu Explorar oferece as mesmas ações por teclado, sem sobrepor a cena. O cartão permanece visível durante a leitura e informa o estado real da animação. Rotina livre e comandos compartilham as poses, com saída da cadeira, devolução da caneca e despertar antes de outro destino.

## Portfólio em primeiro plano

A marca passa a ser Gustavo Costa / Engenheiro de software. A proposta profissional, disponibilidade para freelas, CTA de contato e links sociais dominam a coluna principal. O quarto vira uma vinheta interativa contida em um cartão, acompanhada da atividade e controles. O layout móvel usa rolagem natural para apresentar primeiro a proposta e o contato. O conceito de pequeno mundo sai da comunicação, inclusive do quadro decorativo da cena.

## Acabamento dos cães e objetos

Golden dourado com peito creme, patas alongadas, focinho largo, orelhas caídas e bandana; chihuahua caramelo menor, com orelhas modeladas em curva e interior rosado, focinho curto e coleira. Ambos têm caminhas com borda, respiração e pequenos movimentos ocasionais que respeitam a pausa. Objetos recebem curvas e materiais mais específicos: plantas com folhas pontudas e nervuras, vasos com espessura, livros com capas/lombadas/páginas, tênis com cadarços cruzados, prato com borda, prancha com deck e leash e toca-discos com sulcos e braço.

## Casa de praia

Preferência do usuário: branco quente, bege, cinza, palha e madeira clara. A cena passou a usar paredes off-white, assoalho claro, móveis em madeira clara, estofados de tecido bege/cinza, tapete de fibra, abajur e cesto de palha. As texturas de madeira e trama são procedurais, com iluminação diurna menos amarela. Objetos pessoais e personagens mantêm suas cores e posições. Esta direção substitui a paleta anterior de paredes sálvia e madeira mel.
