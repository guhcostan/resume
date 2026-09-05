# guh. / pequeno mundo

O portfólio de Gustavo Costa como um pequeno mundo 3D, com seu avatar, sua namorada lendo e dois cachorros descansando. React, TypeScript, Vite, Three.js e React Three Fiber. Conteúdo em português e inglês.

## Rodar localmente

```sh
npm ci
npm run dev
```

Vite imprime a porta disponível no terminal e atualiza a página ao salvar os arquivos.

```sh
npm run typecheck
npm run lint
npm run build
npm start
```

O build estático sai em `out/`. Para GitHub Pages:

```sh
NEXT_PUBLIC_BASE_PATH=/resume npm run build
NEXT_PUBLIC_BASE_PATH=/resume npm start
```

O workflow existente publica `out/`. As páginas `/` e `/en/` possuem HTML com conteúdo profissional, metadados sociais, links alternativos e dados estruturados; o build também gera sitemap e robots.txt. O PDF fica em `public/files/`.

## Organização

- `src/App.tsx`: navegação, idioma, controles e leitor lateral não modal.
- `src/world/Studio.tsx`: ambiente, iluminação, pontos interativos e câmera.
- `src/world/Family.tsx`: personagens de companhia e respiração sutil, respeitando pausa e movimento reduzido.
- `src/AvatarMark.tsx`: retrato vetorial do protagonista na apresentação.
- `src/world/objects.tsx`: peças reutilizáveis e móveis.
- `src/world/PersonalObjects.tsx`: prancha, corrida, academia, comida e arte de São Sebastião.
- `src/world/Character.tsx`: personagem articulado, digitação, café com caneca compartilhada, descanso, piscadas e transições suaves.
- `src/world/routine.ts`: sequência de ações, duração, pontos de contato e corredores de aproximação.
- `src/world/navigation.ts`: rotas comandadas pelo menu, saída segura das estações e retomada da rotina.
- `src/world/routine.test.ts`: valida continuidade das posições e repetição do ciclo (`node --experimental-strip-types --test src/world/routine.test.ts`).
- `src/world/textures.ts`: textura de madeira procedural e determinística.
- `lib/i18n/`: conteúdo profissional compartilhado PT/EN.
- `docs/concepts/studio.png`: conceito visual gerado com Image Gen integrado, usado como referência de composição.

O 3D carrega sob demanda. Os menus não dependem do canvas, há fallback de erro e suporte à preferência por movimento reduzido. As fontes são locais. A implementação anterior em `app/` e `components/` permanece como referência, fora da entrada do Vite.

Em desenvolvimento, `?sceneTime=7`, `?sceneTime=25` e `?sceneTime=39` fixam respectivamente as poses de programação, café e descanso para inspeção. O build de produção ignora esse parâmetro.

Os objetos comandam o personagem: computador abre projetos, caneca abre a biografia e biblioteca abre a trajetória. Dicas aparecem ao passar o mouse; no celular, basta tocar. Pufe, cachorros, pesos, tênis, prancha e bandeja têm ações próprias. Fechar o leitor ou usar Retomar rotina livre devolve o personagem ao ciclo automático. A lista acessível em Explorar e os conteúdos ocupam a coluna esquerda no desktop e aparecem abaixo da cena no celular.

A revisão móvel segue as proporções observadas em gaga.hexly.ai: texto compacto no topo, cena ampla no centro, cartão de atividade e controles no rodapé. O conceito adicional está em `docs/concepts/family-mobile.png`. A foto pessoal foi usada apenas como referência visual de modelagem; não é publicada como asset do site.

O cenário inclui mesa regulável decorativa com colunas telescópicas e controle, monitor em braço articulado, notebook prateado em suporte e teclado externo. Prancha, tênis de corrida, pesos, tapete de treino, garrafa e uma bandeja de comida personalizam o ambiente. O golden e o chihuahua descansam junto à companheira lendo.

As nove interações estão catalogadas em `src/world/stations.ts`; `Interactions.tsx` faz a seleção 3D e distingue clique de arraste. `ActivityCard.tsx` mostra a ação real, o destino solicitado e os cantos explorados. A rotina inclui também carinho, treino, aquecimento, equilíbrio, lanche e leitura, com poses e objetos na mão. Os testes completos podem ser executados com `node --experimental-strip-types --test src/world/*.test.ts`.

## Apresentação profissional

A entrada prioriza Gustavo Costa como engenheiro de software disponível para freelas: desenvolvimento web/mobile, React Native, IA e automações. Projetos, contato por e-mail, LinkedIn, GitHub e currículo têm acesso direto. A cena fica em um quadro secundário, mantendo todas as interações. No celular, a introdução profissional precede o quadro; conteúdos abertos ficam abaixo dele. A apresentação foi atualizada em PT e EN.

Os cães são modelos próprios em `src/world/Dog.tsx`, com silhuetas por raça, caminhas, respiração e pequenos movimentos de orelhas/cauda. `Details.tsx` concentra curvas e aros reutilizáveis para costuras, cadarços, folhagem, cerâmica e acessórios.

A decoração segue casa de praia: branco quente, bege, cinza, madeira clara e palha. `BeachDetails.tsx` contém abajur e cesto; `wovenFiber` em `textures.ts` fornece a trama procedural para fibras e tecidos.
