/* ==========================================================================
   Gustavo Costa (Guh) — a equipe de agentes
   JavaScript estático, sem dependências. Os agentes voam de jetpack numa
   camada por cima da página e:
   1. montam as seções quando elas aparecem (primeiro um rascunho em blocos,
      depois o conteúdo de verdade, da esquerda para a direita)
   2. um deles acompanha o mouse, pousa nos cards e comenta cada projeto;
      clicar faz ele aprontar, clique duplo desafia para o jogo da velha
   3. alguns ficam sentados em cima de elementos e fazem coisas ao clique
   Expõe window.guhCrew para a intro do play.js montar o início.
   Com menos movimento, nada voa: o conteúdo aparece na hora.
   ========================================================================== */
(function () {
  'use strict';

  const root = document.documentElement;
  const calm = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const finePointer = !!(window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches);
  const isEn = () => root.getAttribute('data-locale') === 'en';
  const t = (pt, en) => (isEn() ? en : pt);
  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.prototype.slice.call((ctx || document).querySelectorAll(sel));
  const pick = (list) => list[Math.floor(Math.random() * list.length)];
  const say2 = (pair) => t(pair[0], pair[1]);

  /* ---------- Sprite (o mesmo agente do play.js, com jetpack) ---------- */
  const BODY = [
    '..oooooooooo..',
    '..oooooooooo..',
    '..ooeooooeoo..',
    'ooooeooooeoooo',
    '..oooooooooo..',
    '..oooooooooo..'
  ];
  const LEGS_A = ['...o.o..o.o...', '...o.o..o.o...'];
  const LEGS_B = ['...o.o..o.o...', '..o...o.o...o.'];
  // jetpack: uma mochila cinza nas costas e o bocal embaixo
  const PACK = ['j.............', 'jj............', 'jj............', 'j.............'];

  function path(rows, ch, dy) {
    let d = '';
    rows.forEach((row, y) => {
      for (let x = 0; x < row.length; x++) if (row[x] === ch) d += 'M' + x + ' ' + (y + dy) + 'h1v1h-1z';
    });
    return d;
  }

  const SVG =
    '<svg viewBox="0 0 14 8" shape-rendering="crispEdges" aria-hidden="true" focusable="false">' +
    '<path fill="#6b6f66" d="' + path(PACK, 'j', 1) + '"/>' +
    '<path fill="#d97757" d="' + path(BODY, 'o', 0) + '"/>' +
    '<path fill="#2a1a14" d="' + path(BODY, 'e', 0) + '"/>' +
    '<path class="legs-a" fill="#d97757" d="' + path(LEGS_A, 'o', 6) + '"/>' +
    '<path class="legs-b" fill="#d97757" d="' + path(LEGS_B, 'o', 6) + '"/>' +
    '</svg>';

  const BOT_W = 42;
  const BOT_H = 24;

  /* ---------- Camada e laço de animação ---------- */
  let layer = null;
  let ghosts = null;
  const bots = new Set();
  let raf = 0;
  let last = 0;

  function ensureLayer() {
    if (layer) return layer;
    layer = document.createElement('div');
    layer.className = 'crew-layer';
    document.body.appendChild(layer);
    return layer;
  }

  // Os rascunhos ficam numa camada abaixo do cabeçalho fixo; os agentes, acima
  function ghostLayer() {
    if (ghosts) return ghosts;
    ghosts = document.createElement('div');
    ghosts.className = 'crew-layer crew-layer--ghosts';
    document.body.appendChild(ghosts);
    return ghosts;
  }

  function wake() {
    if (raf || document.hidden) return;
    last = 0;
    raf = requestAnimationFrame(loop);
  }

  function loop(now) {
    raf = 0;
    const dt = last ? Math.min(48, now - last) : 16;
    last = now;
    bots.forEach((bot) => bot.update(dt, now));
    if (bots.size && !document.hidden) raf = requestAnimationFrame(loop);
  }

  document.addEventListener('visibilitychange', wake);

  // Fumaça do jetpack: quadradinhos verdes que caem e somem
  function puff(x, y) {
    const p = document.createElement('i');
    p.className = 'puff';
    const s = Math.random() < 0.5 ? 4 : 6;
    p.style.width = s + 'px';
    p.style.height = s + 'px';
    p.style.transform = 'translate(' + Math.round(x - s / 2 + (Math.random() * 6 - 3)) + 'px,' + Math.round(y) + 'px)';
    p.addEventListener('animationend', () => p.remove());
    ensureLayer().appendChild(p);
  }

  /* ---------- O agente ---------- */
  class Bot {
    constructor(opts) {
      const o = Object.assign({ x: 0, y: 0, clickable: false, label: '' }, opts);
      this.el = document.createElement(o.clickable ? 'button' : 'span');
      this.el.className = 'bot';
      if (o.clickable) {
        this.el.type = 'button';
        this.el.setAttribute('aria-label', o.label);
      } else {
        this.el.setAttribute('aria-hidden', 'true');
      }
      this.agent = document.createElement('span');
      this.agent.className = 'agent';
      this.agent.innerHTML = SVG;
      this.el.appendChild(this.agent);
      ensureLayer().appendChild(this.el);
      this.x = o.x;
      this.y = o.y;
      this.tx = o.x;
      this.ty = o.y;
      this.speed = 0.9; // px por ms no máximo
      this.lag = 140; // ms: quanto maior, mais preguiçoso
      this.flying = false;
      this.hover = true; // flutua parado no ar
      this.arrive = null;
      this.puffAt = 0;
      this.bubble = null;
      this.bubbleTimer = 0;
      this.anchor = null; // função que devolve {x, y} para ficar preso a um elemento
      this.onUpdate = null;
      bots.add(this);
      this.render(0);
      wake();
    }

    flyTo(x, y, lag) {
      this.tx = x;
      this.ty = y;
      if (lag) this.lag = lag;
      wake();
      return new Promise((resolve) => {
        this.arrive = resolve;
      });
    }

    update(dt, now) {
      if (this.anchor) {
        const a = this.anchor();
        if (a) {
          this.tx = a.x;
          this.ty = a.y;
        }
      }
      if (this.onUpdate) this.onUpdate(dt, now);
      const dx = this.tx - this.x;
      const dy = this.ty - this.y;
      const dist = Math.hypot(dx, dy);
      if (dist > 1.5) {
        // aproxima com suavidade, mas com velocidade máxima: nada de teletransporte
        const k = 1 - Math.exp(-dt / this.lag);
        let mx = dx * k;
        let my = dy * k;
        const step = Math.hypot(mx, my);
        const max = this.speed * dt;
        if (step > max) {
          mx = (mx / step) * max;
          my = (my / step) * max;
        }
        this.x += mx;
        this.y += my;
        if (Math.abs(mx) > 0.05) this.el.classList.toggle('is-flip', mx < 0);
        this.flying = true;
        if (now - this.puffAt > 55) {
          this.puffAt = now;
          puff(this.x + (this.el.classList.contains('is-flip') ? BOT_W - 4 : 4), this.y + BOT_H - 6);
        }
      } else {
        this.x = this.tx;
        this.y = this.ty;
        this.flying = false;
        if (this.arrive) {
          const done = this.arrive;
          this.arrive = null;
          done();
        }
      }
      this.agent.classList.toggle('is-walking', this.flying);
      this.render(now);
    }

    render(now) {
      const bob = this.hover && !this.flying ? Math.round(Math.sin(now / 320) * 2) : 0;
      this.el.style.transform = 'translate(' + Math.round(this.x) + 'px,' + Math.round(this.y + bob) + 'px)';
    }

    say(text, ms) {
      if (this.bubble) this.bubble.remove();
      clearTimeout(this.bubbleTimer);
      const b = document.createElement('span');
      b.className = 'bubble';
      b.setAttribute('role', 'status');
      b.textContent = text;
      this.el.appendChild(b);
      this.bubble = b;
      // o balão nunca sai da tela
      const r = b.getBoundingClientRect();
      const room = document.documentElement.clientWidth - 8;
      const shift = r.right > room ? room - r.right : r.left < 8 ? 8 - r.left : 0;
      if (shift) b.style.translate = 'calc(-50% + ' + Math.round(shift) + 'px) 0';
      this.bubbleTimer = setTimeout(() => {
        b.remove();
        if (this.bubble === b) this.bubble = null;
      }, ms || 2600);
    }

    trick(name) {
      this.el.classList.remove('is-spin', 'is-jump', 'is-wave');
      void this.el.offsetWidth;
      this.el.classList.add('is-' + name);
      setTimeout(() => this.el.classList.remove('is-' + name), 700);
    }

    remove() {
      bots.delete(this);
      clearTimeout(this.bubbleTimer);
      this.el.remove();
    }
  }

  const pageRect = (el) => {
    const r = el.getBoundingClientRect();
    return { x: r.left + window.scrollX, y: r.top + window.scrollY, w: r.width, h: r.height };
  };

  /* ======================================================================
     1. Montagem: um agente constrói cada bloco da página
     ====================================================================== */

  // Esconde o elemento até um agente montar; o rascunho em blocos aparece antes
  function prepare(el) {
    el.classList.add('is-assembling');
  }

  // Varre o elemento da esquerda para a direita, revelando em degraus de 8px
  function sweep(el, opts) {
    const o = Object.assign({ duration: 900, label: '', bot: null, exit: true }, opts);
    return new Promise((resolve) => {
      if (calm) {
        el.classList.remove('is-assembling');
        return resolve();
      }
      const r = pageRect(el);
      if (!r.w || !r.h) {
        el.classList.remove('is-assembling');
        return resolve();
      }
      const ghost = document.createElement('span');
      ghost.className = 'assemble-ghost';
      ghost.style.transform = 'translate(' + Math.round(r.x) + 'px,' + Math.round(r.y) + 'px)';
      ghost.style.width = Math.round(r.w) + 'px';
      ghost.style.height = Math.round(r.h) + 'px';
      ghostLayer().appendChild(ghost);
      el.style.clipPath = 'inset(-12px ' + Math.round(r.w + 12) + 'px -12px -12px)';

      const fromX = r.x - 90 + Math.random() * 60;
      const bot = o.bot || new Bot({ x: fromX, y: r.y - 110 - Math.random() * 40 });
      bot.anchor = null;
      const startY = r.y - BOT_H - 6;
      bot.speed = 1.6;
      bot.flyTo(r.x - BOT_W / 2, startY, 90).then(() => {
        const t0 = performance.now();
        bot.speed = 4;
        bot.lag = 40;
        el.classList.add('is-sweeping');
        bot.onUpdate = (dt, now) => {
          const p = Math.min(1, (now - t0) / o.duration);
          const built = Math.round((p * r.w) / 8) * 8;
          el.style.clipPath = 'inset(-12px ' + Math.max(-12, r.w - built) + 'px -12px -12px)';
          ghost.style.clipPath = 'inset(0 0 0 ' + built + 'px)';
          bot.tx = r.x + built - BOT_W / 2;
          bot.ty = startY;
          if (p >= 1) {
            bot.onUpdate = null;
            el.classList.remove('is-assembling', 'is-sweeping');
            el.style.clipPath = '';
            ghost.remove();
            bot.speed = 0.9;
            bot.lag = 140;
            if (o.exit) {
              bot.flyTo(bot.x + 80, window.scrollY - BOT_H * 3, 260).then(() => bot.remove());
            }
            resolve(bot);
          }
        };
      });
    });
  }

  // Seções: cada [data-reveal] é montado por um agente quando aparece na tela
  function initAssembly() {
    const targets = $$('[data-reveal]').filter((el) => !el.closest('.hero'));
    if (calm || !targets.length || !('IntersectionObserver' in window)) return;
    targets.forEach(prepare);
    const queue = [];
    let active = 0;
    const showNow = (el) => {
      el.classList.remove('is-assembling', 'is-sweeping');
      el.style.clipPath = '';
    };
    const next = () => {
      while (active < 6 && queue.length) {
        const el = queue.shift();
        // quem já passou do topo da tela (rolagem rápida) aparece direto
        if (el.getBoundingClientRect().bottom < 0) {
          showNow(el);
          continue;
        }
        el.dataset.started = '1';
        active++;
        sweep(el, { duration: Math.min(1000, 450 + el.offsetWidth * 0.35) }).then(() => {
          active--;
          next();
        });
      }
    };
    const io = new IntersectionObserver((entries) => {
      entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top || a.boundingClientRect.left - b.boundingClientRect.left)
        .forEach((e) => {
          io.unobserve(e.target);
          queue.push(e.target);
          // ninguém espera mais de 2s por um agente: aparece sozinho
          setTimeout(() => {
            const i = queue.indexOf(e.target);
            if (i !== -1 && !e.target.dataset.started) {
              queue.splice(i, 1);
              showNow(e.target);
            }
          }, 2000);
        });
      next();
    }, { threshold: 0.2 });
    targets.forEach((el) => io.observe(el));

    // Link direto para uma seção (#contato): o que já está na tela monta junto
    // Impressão: tudo aparece na hora
    window.addEventListener('beforeprint', () => {
      targets.forEach((el) => {
        el.classList.remove('is-assembling', 'is-sweeping');
        el.style.clipPath = '';
      });
    });
  }

  // O início, na intro: vários agentes montam subtítulo, botões, links e chão
  function buildHero(els) {
    if (calm) {
      els.forEach((el) => el.classList.remove('is-assembling'));
      return Promise.resolve();
    }
    let built = 0;
    const lead = new Bot({ x: window.innerWidth * 0.5, y: window.scrollY - 80 });
    const label = () => lead.say((t('Construindo ', 'Building ') + Math.round((built / els.length) * 100) + '%').toUpperCase(), 4000);
    const jobs = els.map((el, i) => {
      const bot = i === 0 ? lead : null;
      return new Promise((resolve) => {
        setTimeout(() => {
          sweep(el, { bot, duration: 650 + el.offsetWidth * 0.35, exit: i !== 0 }).then((b) => {
            built++;
            if (built < els.length) label();
            resolve(b);
          });
        }, i * 260);
      });
    });
    label();
    return Promise.all(jobs).then(() => {
      lead.say(t('Pronto. Shipped!', 'Shipped!').toUpperCase(), 1600);
      return new Promise((resolve) => setTimeout(resolve, 900)).then(() => {
        lead.flyTo(lead.x + 120, window.scrollY - 120, 300).then(() => lead.remove());
      });
    });
  }

  // Pular a intro: termina tudo na hora
  function finishAll() {
    $$('.is-assembling').forEach((el) => {
      el.classList.remove('is-assembling', 'is-sweeping');
      el.style.clipPath = '';
    });
    $$('.assemble-ghost').forEach((g) => g.remove());
  }

  /* ======================================================================
     2. O companheiro: segue o mouse, pousa nos cards e comenta
     ====================================================================== */
  const PERCH = {
    'mac-cleaner': [['Liberei 32 GB. Era tudo node_modules.', 'Freed 32 GB. It was all node_modules.'], ['1.9k estrelas. Eu ajudei com zero delas.', '1.9k stars. I helped with zero of them.']],
    b3: [['Não é recomendação de investimento. Eu só empilho blocos.', 'Not financial advice. I just stack blocks.'], ['3 agentes analisando. Eu sou o quarto, de férias.', "3 agents analyzing. I'm the fourth, on vacation."]],
    brain: [['Agora eu lembro de tudo. Até daquele bug.', 'Now I remember everything. Even that bug.']],
    windows: [['Também limpa Windows. Ninguém é perfeito.', 'Cleans Windows too. Nobody is perfect.']],
    brasilapi: [['CEP 05010-000? Rua Caiubi. De nada.', 'ZIP 05010-000? Rua Caiubi. You are welcome.']],
    player: [['Lvl 8. Eu ainda sou lvl 1.', "Lvl 8. I'm still lvl 1."], ['Golpe especial: código que dá gosto de manter.', 'Special move: code that is nice to maintain.']],
    log: [['Esse post eu li duas vezes.', 'I read this post twice.']],
    contrib: [['Cada bloco verde fui eu que carreguei.', 'I carried every green block.']],
    term: [['Digita velha. Eu deixo você começar.', "Type ttt. I'll let you go first."]],
    job: [['Um tijolo por trimestre. Eu contei.', 'One brick per quarter. I counted.']]
  };
  const COMPANION = [
    ['Oi! Eu vou junto com você.', "Hi! I'm coming with you."],
    ['Passa o mouse num projeto. Eu tenho opinião sobre todos.', 'Hover a project. I have opinions on all of them.'],
    ['Clique duplo e eu te desafio na velha.', 'Double-click me and I will challenge you to tic-tac-toe.'],
    ['Jetpack movido a café.', 'Coffee-powered jetpack.'],
    ['Não clica tanto, eu fico tonto.', "Easy on the clicks, I get dizzy."]
  ];

  function initCompanion() {
    if (calm || !finePointer) return;
    let mouseX = window.innerWidth * 0.8;
    let mouseY = 200;
    let restTimer = 0;
    let perched = null;
    let perchTimer = 0;
    let lines = 0;
    let lastPerchKey = '';

    const bot = new Bot({
      x: window.innerWidth + 40,
      y: window.scrollY + 120,
      clickable: true,
      label: t('Agente companheiro: clique para uma gracinha, clique duplo para jogar velha', 'Companion agent: click for a trick, double-click to play tic-tac-toe')
    });
    bot.el.classList.add('bot--pet');
    bot.lag = 220;
    bot.speed = 0.75;
    document.addEventListener('guh:locale', () => {
      bot.el.setAttribute('aria-label', t('Agente companheiro: clique para uma gracinha, clique duplo para jogar velha', 'Companion agent: click for a trick, double-click to play tic-tac-toe'));
    });

    // Segue o mouse só quando ele para: quem passa rápido não arrasta o agente
    function follow() {
      if (perched) return;
      const x = Math.min(document.documentElement.clientWidth - BOT_W - 8, mouseX + 26);
      bot.flyTo(Math.max(8, x), mouseY + window.scrollY + 22, 220);
    }
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      clearTimeout(restTimer);
      restTimer = setTimeout(follow, 300);
    }, { passive: true });
    window.addEventListener('scroll', () => {
      clearTimeout(restTimer);
      restTimer = setTimeout(follow, 400);
    }, { passive: true });

    // Pousa no card sob o mouse e comenta (com atraso, para não perseguir o mouse)
    $$('[data-perch]').forEach((card) => {
      card.addEventListener('mouseenter', () => {
        clearTimeout(perchTimer);
        perchTimer = setTimeout(() => {
          perched = card;
          bot.anchor = () => {
            const r = pageRect(card);
            return { x: r.x + r.w - BOT_W - 24, y: r.y - BOT_H + 2 };
          };
          bot.hover = false;
          const key = card.getAttribute('data-perch');
          const options = PERCH[key];
          if (options && key !== lastPerchKey) {
            lastPerchKey = key;
            setTimeout(() => perched === card && bot.say(say2(pick(options)), 3000), 450);
          }
        }, 380);
      });
      card.addEventListener('mouseleave', () => {
        clearTimeout(perchTimer);
        if (perched !== card) return;
        perched = null;
        bot.anchor = null;
        bot.hover = true;
        lastPerchKey = '';
        restTimer = setTimeout(follow, 300);
      });
    });

    // Clique: uma gracinha. Clique duplo: desafio no jogo da velha
    let clickTimer = 0;
    bot.el.addEventListener('click', (e) => {
      e.stopPropagation();
      clearTimeout(clickTimer);
      clickTimer = setTimeout(() => {
        const tricks = ['spin', 'jump', 'wave', 'block'];
        const trick = tricks[lines % tricks.length];
        if (trick === 'block') dropBlock(bot);
        else bot.trick(trick);
        lines++;
        bot.say(say2(COMPANION[lines % COMPANION.length]));
      }, 230);
    });
    bot.el.addEventListener('dblclick', (e) => {
      e.preventDefault();
      clearTimeout(clickTimer);
      const term = $('[data-term]');
      if (!term) {
        bot.say(t('O jogo fica na página inicial, no contato.', 'The game lives on the home page, under contact.'));
        return;
      }
      bot.say(t('Desafio aceito. Lá embaixo!', 'Challenge on. Down there!'));
      term.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => document.dispatchEvent(new CustomEvent('guh:run', { detail: isEn() ? 'ttt' : 'velha' })), 600);
    });

    setTimeout(() => {
      follow();
      setTimeout(() => bot.say(say2(COMPANION[0])), 900);
    }, 400);
  }

  // Larga um bloco verde que cai até o fim da tela
  function dropBlock(bot) {
    const b = document.createElement('i');
    b.className = 'falling-block';
    const x = bot.x + BOT_W / 2 - 6;
    const y = bot.y + BOT_H;
    b.style.transform = 'translate(' + Math.round(x) + 'px,' + Math.round(y) + 'px)';
    ensureLayer().appendChild(b);
    const floor = window.scrollY + window.innerHeight - 12;
    const t0 = performance.now();
    const fall = (now) => {
      const dt = (now - t0) / 1000;
      const yy = Math.min(floor, y + 900 * dt * dt);
      b.style.transform = 'translate(' + Math.round(x) + 'px,' + Math.round(yy) + 'px)';
      if (yy < floor) requestAnimationFrame(fall);
      else setTimeout(() => b.remove(), 900);
    };
    requestAnimationFrame(fall);
  }

  /* ======================================================================
     3. Agentes sentados: cada um faz uma coisa ao clique
     ====================================================================== */
  const SITTERS = {
    xp: {
      label: ['Agente da ficha: ganhar XP', 'Character sheet agent: gain XP'],
      act(bot, host) {
        const n = (bot.count = (bot.count || 0) + 1);
        floaty(bot, '+' + (n * 10) + ' XP');
        const lvl = $('.player__lvl > span:last-child', host);
        if (lvl) {
          lvl.classList.remove('is-pop');
          void lvl.offsetWidth;
          lvl.classList.add('is-pop');
        }
        bot.trick('jump');
        if (n === 5) bot.say(t('Subiu de nível! Mentira, ainda é lvl 8.', 'Level up! Kidding, still lvl 8.'));
      }
    },
    commit: {
      label: ['Agente do gráfico: fazer um commit', 'Chart agent: make a commit'],
      act(bot, host) {
        const rects = $$('.contrib__grid rect', host);
        if (!rects.length) return;
        for (let i = 0; i < 6; i++) {
          const r = pick(rects);
          r.classList.add('is-lit');
          setTimeout(() => r.classList.remove('is-lit'), 1600);
        }
        bot.trick('spin');
        bot.say(say2(pick([['git commit -m "mais blocos"', 'git commit -m "more blocks"'], ['git push --força-de-vontade', 'git push --willpower'], ['Verdinho. Do jeito que eu gosto.', 'Green. Just how I like it.']])));
      }
    },
    term: {
      label: ['Agente do terminal: jogar velha', 'Terminal agent: play tic-tac-toe'],
      act(bot) {
        bot.trick('wave');
        bot.say(t('Bora? Você é o X.', 'Shall we? You are X.'));
        document.dispatchEvent(new CustomEvent('guh:run', { detail: isEn() ? 'ttt' : 'velha' }));
      }
    }
  };

  function floaty(bot, text) {
    const f = document.createElement('span');
    f.className = 'floaty';
    f.textContent = text;
    f.style.transform = 'translate(' + Math.round(bot.x + BOT_W / 2) + 'px,' + Math.round(bot.y - 4) + 'px)';
    f.addEventListener('animationend', () => f.remove());
    ensureLayer().appendChild(f);
  }

  function initSitters() {
    $$('[data-sitter]').forEach((host) => {
      const kind = SITTERS[host.getAttribute('data-sitter')];
      if (!kind) return;
      const spot = parseFloat(host.getAttribute('data-sitter-at') || '0.12');
      const anchor = () => {
        const r = pageRect(host);
        return { x: r.x + r.w * spot, y: r.y - BOT_H + 4 };
      };
      const arrive = () => {
        const start = anchor();
        const bot = new Bot({ x: start.x - 80, y: calm ? start.y : start.y - 160, clickable: true, label: say2(kind.label) });
        bot.el.classList.add('bot--sitter');
        bot.hover = false;
        bot.anchor = anchor;
        if (calm) {
          bot.x = start.x;
          bot.y = start.y;
          bot.update(16, 0);
        }
        bot.el.addEventListener('click', () => kind.act(bot, host));
        document.addEventListener('guh:locale', () => bot.el.setAttribute('aria-label', say2(kind.label)));
      };
      if (!host.classList.contains('is-assembling')) return arrive();
      const mo = new MutationObserver(() => {
        if (host.classList.contains('is-assembling')) return;
        mo.disconnect();
        setTimeout(arrive, 300);
      });
      mo.observe(host, { attributes: true, attributeFilter: ['class'] });
    });
  }

  // Com a equipe ativa, quem monta as seções são os agentes, não o CSS
  if (!calm) root.classList.add('crew');

  /* ---------- API para o play.js ---------- */
  window.guhCrew = { Bot, sweep, buildHero, prepare, finishAll };

  function init() {
    initAssembly();
    initSitters();
    // o companheiro chega depois da intro (ou logo, se não houver intro)
    const startCompanion = () => setTimeout(initCompanion, 300);
    if (root.classList.contains('intro')) document.addEventListener('guh:intro-done', startCompanion, { once: true });
    else startCompanion();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
