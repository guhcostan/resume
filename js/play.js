/* ==========================================================================
   Gustavo Costa (Guh) — a parte que brinca
   JavaScript estático, sem dependências. Tudo aqui é enfeite: sem ele o
   site continua inteiro, só mais quieto.
   1. Agentes: o sprite laranja, a intro que constrói o nome bloco a bloco
      e o agente que anda no chão do início
   2. Prévias dos projetos, tijolos da experiência e dicas do gráfico
   3. Terminal do contato (com jogo da velha)
   4. Segredos e easter eggs
   ========================================================================== */
(function () {
  'use strict';

  const root = document.documentElement;
  const calm = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const isEn = () => root.getAttribute('data-locale') === 'en';
  const t = (pt, en) => (isEn() ? en : pt);
  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.prototype.slice.call((ctx || document).querySelectorAll(sel));

  const store = {
    get(key, fallback) {
      try {
        const v = localStorage.getItem(key);
        return v === null ? fallback : JSON.parse(v);
      } catch (e) {
        return fallback;
      }
    },
    set(key, value) {
      try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {}
    }
  };

  const css = (name) => getComputedStyle(root).getPropertyValue(name).trim();
  const COLORS = {
    ink: css('--ink') || '#eceee6',
    bg: css('--bg') || '#0c0d0b',
    shadow: css('--name-shadow') || '#3d4038',
    green: css('--green') || '#5be382',
    orange: css('--orange') || '#d97757',
    eye: '#2a1a14'
  };

  /* ======================================================================
     1. Agentes
     ====================================================================== */

  // 14 x 8 pixels: corpo, olhos e dois quadros de pernas
  const AGENT_BODY = [
    '..oooooooooo..',
    '..oooooooooo..',
    '..ooeooooeoo..',
    'ooooeooooeoooo',
    '..oooooooooo..',
    '..oooooooooo..'
  ];
  const LEGS_A = ['...o.o..o.o...', '...o.o..o.o...'];
  const LEGS_B = ['...o.o..o.o...', '..o...o.o...o.'];

  function pixelPath(rows, char, offsetY) {
    let d = '';
    rows.forEach((row, y) => {
      for (let x = 0; x < row.length; x++) {
        if (row[x] === char) d += 'M' + x + ' ' + (y + offsetY) + 'h1v1h-1z';
      }
    });
    return d;
  }

  const AGENT_SVG =
    '<svg viewBox="0 0 14 8" shape-rendering="crispEdges" aria-hidden="true" focusable="false">' +
    '<path fill="' + COLORS.orange + '" d="' + pixelPath(AGENT_BODY, 'o', 0) + '"/>' +
    '<path fill="' + COLORS.eye + '" d="' + pixelPath(AGENT_BODY, 'e', 0) + '"/>' +
    '<path class="legs-a" fill="' + COLORS.orange + '" d="' + pixelPath(LEGS_A, 'o', 6) + '"/>' +
    '<path class="legs-b" fill="' + COLORS.orange + '" d="' + pixelPath(LEGS_B, 'o', 6) + '"/>' +
    '</svg>';

  function makeAgent(extraClass) {
    const el = document.createElement('span');
    el.className = 'agent' + (extraClass ? ' ' + extraClass : '');
    el.innerHTML = AGENT_SVG;
    return el;
  }

  // Desenha o agente no canvas; px = tamanho de cada pixel do sprite
  function drawAgent(ctx, x, y, px, frame, carrying) {
    const legs = frame ? LEGS_B : LEGS_A;
    const rows = AGENT_BODY.concat(legs);
    for (let r = 0; r < rows.length; r++) {
      const row = rows[r];
      for (let c = 0; c < row.length; c++) {
        const ch = row[c];
        if (ch === '.') continue;
        ctx.fillStyle = ch === 'e' ? COLORS.eye : COLORS.orange;
        ctx.fillRect(Math.round(x + c * px), Math.round(y + r * px), Math.ceil(px), Math.ceil(px));
      }
    }
    if (carrying) {
      ctx.fillStyle = COLORS.green;
      ctx.fillRect(Math.round(x + 5 * px), Math.round(y - 4 * px), Math.ceil(px * 4), Math.ceil(px * 3));
    }
  }

  // Agentes decorativos espalhados pelas páginas: <span data-agent="sm">
  function placeAgents() {
    $$('[data-agent]').forEach((slot) => {
      if (slot.firstChild) return;
      const size = slot.getAttribute('data-agent');
      const agent = makeAgent(size ? 'agent--' + size : '');
      slot.appendChild(agent);
    });
    $$('[data-agents]').forEach((slot) => {
      const n = parseInt(slot.getAttribute('data-agents'), 10) || 1;
      for (let i = 0; i < n; i++) slot.appendChild(makeAgent('agent--sm is-walking'));
    });
  }

  /* ---------- Construção do nome ----------------------------------------
     O nome é amostrado dos pixels reais da fonte (a Silkscreen desenha numa
     grade de 1/8 em) e uma equipe de agentes larga cada bloco no lugar.
     No fim, o canvas sai e fica o texto de verdade, pixel sobre pixel. */

  function sampleBlocks(h1, origin) {
    const cs = getComputedStyle(h1);
    const fs = parseFloat(cs.fontSize);
    const unit = fs / 8;
    const font = cs.fontStyle + ' ' + cs.fontWeight + ' ' + fs + 'px ' + cs.fontFamily;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    const blocks = [];

    $$('.w', h1).forEach((word) => {
      const rect = word.getBoundingClientRect();
      const text = word.textContent.toUpperCase();
      ctx.font = font;
      const m = ctx.measureText(text);
      const ascent = m.fontBoundingBoxAscent || fs * 1.03;
      canvas.width = Math.ceil(rect.width + unit * 2);
      canvas.height = Math.ceil(ascent + fs * 0.5);
      ctx.font = font;
      ctx.fillStyle = '#fff';
      ctx.textBaseline = 'alphabetic';
      ctx.fillText(text, 0, ascent);
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      const rows = Math.ceil(canvas.height / unit);
      const cols = Math.ceil(canvas.width / unit);
      for (let gy = -1; gy <= rows; gy++) {
        // a grade parte da linha de base, onde os glifos se apoiam
        const y0 = ascent - Math.round(ascent / unit) * unit + gy * unit;
        const sy = Math.floor(y0 + unit / 2);
        if (sy < 0 || sy >= canvas.height) continue;
        for (let gx = 0; gx < cols; gx++) {
          const sx = Math.floor(gx * unit + unit / 2);
          if (sx >= canvas.width) continue;
          if (data[(sy * canvas.width + sx) * 4 + 3] > 127) {
            blocks.push({ x: rect.left - origin.left + gx * unit, y: rect.top - origin.top + y0 });
          }
        }
      }
    });
    return { blocks, unit };
  }

  const ease = (p) => (p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2);
  const clamp01 = (p) => (p < 0 ? 0 : p > 1 ? 1 : p);

  function buildName(h1, options) {
    const opts = Object.assign({ buildMs: 2300, label: true, demolish: false, onDone() {} }, options);
    const hero = h1.closest('.hero') || h1.parentElement;
    const origin = hero.getBoundingClientRect();
    const sample = sampleBlocks(h1, origin);
    const blocks = sample.blocks;
    const unit = sample.unit;
    if (!blocks.length) {
      opts.onDone();
      return { skip() {} };
    }

    const W = origin.width;
    const H = origin.height;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const canvas = document.createElement('canvas');
    canvas.className = 'intro-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    hero.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    ctx.imageSmoothingEnabled = false;

    // colunas da esquerda para a direita; em cada uma, de baixo para cima
    const byCol = new Map();
    blocks.forEach((b) => {
      const key = Math.round(b.x);
      if (!byCol.has(key)) byCol.set(key, []);
      byCol.get(key).push(b);
    });
    const columns = Array.from(byCol.keys()).sort((a, b) => a - b).map((k) => byCol.get(k).sort((a, b) => b.y - a.y));

    const crewSize = W < 600 ? 3 : 5;
    const perAgent = Math.ceil(blocks.length / crewSize);
    const crew = [];
    let current = [];
    let count = 0;
    columns.forEach((col) => {
      current.push(col);
      count += col.length;
      if (count >= perAgent && crew.length < crewSize - 1) {
        crew.push(current);
        current = [];
        count = 0;
      }
    });
    if (current.length) crew.push(current);

    const agentPx = unit / 2; // sprite de 14 x 8 pixels
    const agentW = 14 * agentPx;
    const agentH = 8 * agentPx;
    const top = Math.min.apply(null, blocks.map((b) => b.y));
    const hoverY = Math.max(agentH * 0.5, top - agentH - unit * 3);
    const ENTER = 500;
    const FALL = 150;
    const EXIT = 450;
    const maxCols = Math.max.apply(null, crew.map((c) => c.length));
    const colMs = opts.buildMs / maxCols;

    // tempos de cada bloco calculados de antemão: a animação é uma função do tempo
    const agents = crew.map((cols, i) => {
      const start = ENTER + i * 70;
      const fromX = (i + 0.5) * (W / crew.length) - agentW / 2;
      const steps = cols.map((col, k) => {
        const at = start + k * colMs;
        const x = col[0].x + unit / 2 - agentW / 2;
        col.forEach((b, j) => {
          b.release = at + colMs * 0.3 + (j * colMs * 0.65) / col.length;
          b.fromY = hoverY + agentH;
        });
        return { at, x };
      });
      const end = start + cols.length * colMs + FALL;
      return { fromX, steps, start, end };
    });
    const lastRelease = Math.max.apply(null, agents.map((a) => a.end));
    const total = lastRelease + EXIT;

    // demolição: os blocos atuais caem antes de a equipe reconstruir
    const DEMOLISH = opts.demolish ? 750 : 0;
    const debris = opts.demolish
      ? blocks.map((b) => ({ x: b.x, y: b.y, vx: (Math.random() - 0.5) * 0.35, vy: -Math.random() * 0.4, delay: Math.random() * 120 }))
      : null;

    let t0 = null;
    let raf = 0;
    let finished = false;

    function agentPos(a, tm) {
      if (tm < a.start) {
        const p = ease(clamp01(tm / a.start));
        return { x: a.fromX + (a.steps[0].x - a.fromX) * p, y: -agentH * 2 + (hoverY + agentH * 2) * p, carrying: true };
      }
      if (tm > a.end) {
        const p = ease(clamp01((tm - a.end) / EXIT));
        const last = a.steps[a.steps.length - 1];
        return { x: last.x + p * unit * 6, y: hoverY - (hoverY + agentH * 3) * p, carrying: false };
      }
      let k = 0;
      while (k < a.steps.length - 1 && tm >= a.steps[k + 1].at) k++;
      const step = a.steps[k];
      const prevX = k ? a.steps[k - 1].x : step.x;
      const p = ease(clamp01((tm - step.at) / (colMs * 0.3)));
      const bob = Math.sin(tm / 90) * unit * 0.15;
      return { x: prevX + (step.x - prevX) * p, y: hoverY + bob, carrying: k < a.steps.length - 1 };
    }

    function frame(now) {
      if (finished) return;
      if (t0 === null) t0 = now;
      const elapsed = now - t0;
      ctx.clearRect(0, 0, W, H);

      if (elapsed < DEMOLISH) {
        ctx.fillStyle = COLORS.ink;
        debris.forEach((d) => {
          const dt = Math.max(0, elapsed - d.delay);
          const x = d.x + d.vx * dt;
          const y = d.y + d.vy * dt + 0.0022 * dt * dt;
          ctx.fillRect(x, y, unit, unit);
        });
        raf = requestAnimationFrame(frame);
        return;
      }

      const tm = elapsed - DEMOLISH;
      let placed = 0;
      ctx.fillStyle = COLORS.shadow;
      blocks.forEach((b) => {
        if (tm >= b.release + FALL) ctx.fillRect(b.x + unit, b.y + unit, unit, unit);
      });
      ctx.fillStyle = COLORS.ink;
      blocks.forEach((b) => {
        if (tm < b.release) return;
        if (tm >= b.release + FALL) {
          placed++;
          ctx.fillRect(b.x, b.y, unit, unit);
        } else {
          const p = clamp01((tm - b.release) / FALL);
          ctx.fillRect(b.x, b.fromY + (b.y - b.fromY) * p * p, unit, unit);
        }
      });

      const legFrame = Math.floor(tm / 120) % 2;
      let lead = null;
      agents.forEach((a, i) => {
        const pos = agentPos(a, tm);
        drawAgent(ctx, pos.x, pos.y, agentPx, legFrame, pos.carrying);
        if (i === 0) lead = pos;
      });

      if (opts.label && lead && tm < lastRelease) {
        const pct = Math.floor((placed / blocks.length) * 100);
        const text = (t('Construindo ', 'Building ') + pct + '%').toUpperCase();
        ctx.font = '400 16px Silkscreen, monospace';
        const tw = ctx.measureText(text).width;
        const bx = Math.max(4, Math.min(W - tw - 24, lead.x + agentW / 2 - (tw + 20) / 2));
        const by = Math.max(4, lead.y - 44);
        ctx.fillStyle = '#6b6f66';
        ctx.fillRect(bx + 3, by + 3, tw + 20, 30);
        ctx.fillStyle = COLORS.ink;
        ctx.fillRect(bx, by, tw + 20, 30);
        ctx.fillStyle = COLORS.bg;
        ctx.textBaseline = 'middle';
        ctx.fillText(text, bx + 10, by + 16);
      }

      if (tm >= total) return finish();
      raf = requestAnimationFrame(frame);
    }

    function finish() {
      if (finished) return;
      finished = true;
      cancelAnimationFrame(raf);
      canvas.remove();
      opts.onDone();
    }

    raf = requestAnimationFrame(frame);
    return { skip: finish };
  }

  function waitForFont(timeout) {
    if (!document.fonts || !document.fonts.load) return Promise.resolve(false);
    const load = document.fonts.load('400 32px Silkscreen').then(() => document.fonts.check('400 32px Silkscreen'));
    const timer = new Promise((resolve) => setTimeout(() => resolve(false), timeout));
    return Promise.race([load, timer]).catch(() => false);
  }

  function initIntro() {
    const h1 = $('[data-build]');
    const hero = h1 && h1.closest('.hero');
    const markSeen = () => {
      try { sessionStorage.setItem('guh-intro', '1'); } catch (e) {}
    };

    function reveal() {
      root.classList.remove('intro');
      if (hero) hero.classList.add('is-ready');
      markSeen();
      startWalker();
    }

    if (!root.classList.contains('intro') || !h1) {
      root.classList.remove('intro');
      startWalker();
      return;
    }

    // Quem já rolou para baixo (recarregou no meio da página) não vê a intro
    if (hero.getBoundingClientRect().bottom < 0) return reveal();

    const skipBtn = document.createElement('button');
    skipBtn.type = 'button';
    skipBtn.className = 'intro-skip';
    skipBtn.innerHTML = '<span>' + t('Pular intro', 'Skip intro') + '</span><kbd>Esc</kbd>';
    document.body.appendChild(skipBtn);

    let run = null;
    let done = false;
    function end() {
      if (done) return;
      done = true;
      skipBtn.remove();
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
      if (run) run.skip();
      reveal();
    }
    function onKey(e) {
      if (e.key === 'Escape') end();
    }
    // no celular a barra de endereço muda a altura ao rolar: só a largura importa
    const startWidth = window.innerWidth;
    function onResize() {
      if (window.innerWidth !== startWidth) end();
    }
    skipBtn.addEventListener('click', end);
    document.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);

    waitForFont(1500).then((ok) => {
      if (done) return;
      if (!ok) return end();
      run = buildName(h1, { onDone: end });
    });
  }

  // Easter egg: clicar no nome derruba os blocos e a equipe reconstrói
  function initRebuild() {
    const h1 = $('[data-build]');
    if (!h1 || calm) return;
    let busy = false;
    h1.addEventListener('click', () => {
      if (busy || root.classList.contains('intro')) return;
      busy = true;
      h1.classList.add('is-building');
      buildName(h1, {
        demolish: true,
        buildMs: 1700,
        label: false,
        onDone() {
          h1.classList.remove('is-building');
          busy = false;
          unlock('rebuild');
        }
      });
    });
  }

  /* ---------- O agente que anda no chão do início ---------- */
  const LINES = [
    ['Oi! Eu e uns colegas montamos o nome lá em cima.', 'Hi! Some friends and I built that name up there.'],
    ['Um bloco de cada vez. É o único jeito que eu conheço.', 'One block at a time. The only way I know.'],
    ['O Guh escreve React Native o dia todo. Eu só empilho blocos.', 'Guh writes React Native all day. I just stack blocks.'],
    ['Mais um commit.', 'One more commit.'],
    ['Tem segredos espalhados pelo site. Não vou contar onde.', "There are secrets around this site. I'm not telling where."],
    ['Já testou o terminal lá embaixo?', 'Have you tried the terminal down there?'],
    ['Dizem que aquele nome não é tão firme quanto parece.', "Rumor says that name isn't as solid as it looks."]
  ];
  const TIRED = ['Você não cansa?', "Don't you get tired?"];

  let walkerStarted = false;
  function startWalker() {
    if (walkerStarted) return;
    const ground = $('[data-ground]');
    if (!ground) return;
    walkerStarted = true;

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'walker';
    const agent = makeAgent();
    btn.appendChild(agent);
    ground.appendChild(btn);

    let x = Math.max(0, ground.clientWidth * 0.82);
    let target = x;
    let nextWander = performance.now() + 1500;
    let followTimer = 0;
    let visible = true;
    let raf = 0;
    let last = 0;
    let bubble = null;
    let bubbleTimer = 0;
    let lineIndex = store.get('guh-agent-line', 0);

    const setLabel = () => btn.setAttribute('aria-label', t('Falar com o agente', 'Talk to the agent'));
    setLabel();
    document.addEventListener('guh:locale', setLabel);

    const maxX = () => Math.max(0, ground.clientWidth - btn.offsetWidth);
    const place = () => {
      btn.style.transform = 'translateX(' + Math.round(x) + 'px)';
    };
    place();

    function say(text) {
      if (bubble) bubble.remove();
      clearTimeout(bubbleTimer);
      bubble = document.createElement('span');
      bubble.className = 'bubble';
      bubble.setAttribute('role', 'status');
      bubble.textContent = text;
      btn.appendChild(bubble);
      // o balão nunca sai da tela, mesmo com o agente na beirada
      const r = bubble.getBoundingClientRect();
      const room = document.documentElement.clientWidth - 8;
      const shift = r.right > room ? room - r.right : r.left < 8 ? 8 - r.left : 0;
      if (shift) bubble.style.translate = 'calc(-50% + ' + Math.round(shift) + 'px) 0';
      bubbleTimer = setTimeout(() => {
        if (bubble) bubble.remove();
        bubble = null;
      }, 3200);
    }

    btn.addEventListener('click', () => {
      if (lineIndex < LINES.length) {
        say(t(LINES[lineIndex][0], LINES[lineIndex][1]));
        lineIndex++;
        store.set('guh-agent-line', lineIndex);
      } else {
        say(t(TIRED[0], TIRED[1]));
        unlock('chat');
      }
      hop();
    });

    function hop() {
      if (calm) return;
      btn.classList.add('is-hop');
      setTimeout(() => btn.classList.remove('is-hop'), 160);
    }

    // O agente vai até o link sob o mouse, mas só se o mouse ficar ali
    $$('.hero a, .hero .btn').forEach((el) => {
      el.addEventListener('mouseenter', () => {
        clearTimeout(followTimer);
        followTimer = setTimeout(() => {
          const r = el.getBoundingClientRect();
          const g = ground.getBoundingClientRect();
          target = Math.min(maxX(), Math.max(0, r.left + r.width / 2 - g.left - btn.offsetWidth / 2));
          nextWander = performance.now() + 5000;
          wake();
        }, 450);
      });
      el.addEventListener('mouseleave', () => clearTimeout(followTimer));
    });

    function tick(now) {
      raf = 0;
      if (!visible || document.hidden) return;
      const dt = last ? Math.min(64, now - last) : 16;
      last = now;
      if (now > nextWander && Math.abs(target - x) < 1) {
        target = Math.random() * maxX();
        nextWander = now + 2500 + Math.random() * 4000;
        if (Math.random() < 0.3) hop();
      }
      const dist = target - x;
      if (Math.abs(dist) > 1) {
        x += Math.sign(dist) * Math.min(Math.abs(dist), 0.07 * dt);
        agent.classList.add('is-walking');
        btn.classList.toggle('is-flip', dist < 0);
        place();
      } else {
        agent.classList.remove('is-walking');
      }
      raf = requestAnimationFrame(tick);
    }

    function wake() {
      if (calm || raf || !visible) return;
      last = 0;
      raf = requestAnimationFrame(tick);
    }

    if ('IntersectionObserver' in window) {
      new IntersectionObserver((entries) => {
        visible = entries[0].isIntersecting;
        if (visible) wake();
      }).observe(ground);
    }
    document.addEventListener('visibilitychange', wake);
    window.addEventListener('resize', () => {
      x = Math.min(x, maxX());
      target = Math.min(target, maxX());
      place();
    });
    wake();
  }

  /* ======================================================================
     2. Prévias, tijolos e gráfico de contribuições
     ====================================================================== */

  function initPreviews() {
    const previews = $$('[data-preview]');
    if (!previews.length || calm || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-on');
        io.unobserve(entry.target);
      });
    }, { threshold: 0.45 });
    previews.forEach((p) => {
      p.classList.add('is-armed');
      io.observe(p);
      // passar o mouse no card repete a animação
      const card = p.closest('.card');
      let cooldown = 0;
      if (card) {
        card.addEventListener('mouseenter', () => {
          const now = Date.now();
          if (!p.classList.contains('is-on') || now < cooldown) return;
          cooldown = now + 4000;
          p.classList.remove('is-on');
          void p.offsetWidth;
          p.classList.add('is-on');
        });
      }
    });
  }

  function initBricks() {
    const now = new Date();
    $$('.job__bricks[data-from]').forEach((el) => {
      const [fy, fm] = el.getAttribute('data-from').split('-').map(Number);
      const to = el.getAttribute('data-to');
      const [ty, tm] = to ? to.split('-').map(Number) : [now.getFullYear(), now.getMonth() + 1];
      const months = ty * 12 + tm - (fy * 12 + fm) + 1;
      const quarters = Math.max(1, Math.ceil(months / 3));
      const frag = document.createDocumentFragment();
      for (let i = 0; i < quarters; i++) frag.appendChild(document.createElement('i'));
      el.appendChild(frag);
    });
  }

  function initContrib() {
    const fig = $('.contrib');
    if (!fig) return;
    const tip = document.createElement('span');
    tip.className = 'tip';
    tip.hidden = true;
    fig.appendChild(tip);
    const fmt = () => new Intl.DateTimeFormat(isEn() ? 'en-US' : 'pt-BR', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });

    fig.addEventListener('mouseover', (e) => {
      const rect = e.target.closest && e.target.closest('rect[data-d]');
      if (!rect) return;
      const n = parseInt(rect.getAttribute('data-c'), 10) || 0;
      const date = fmt().format(new Date(rect.getAttribute('data-d') + 'T00:00:00Z'));
      tip.textContent = n === 0
        ? t('Nenhuma contribuição em ', 'No contributions on ') + date
        : n + ' ' + (n === 1 ? t('contribuição em ', 'contribution on ') : t('contribuições em ', 'contributions on ')) + date;
      tip.hidden = false;
      const r = rect.getBoundingClientRect();
      const f = fig.getBoundingClientRect();
      const half = tip.offsetWidth / 2;
      tip.style.left = Math.min(f.width - half, Math.max(half, r.left - f.left + r.width / 2)) + 'px';
      tip.style.top = r.top - f.top + 'px';
    });
    fig.addEventListener('mouseleave', () => {
      tip.hidden = true;
    });
  }

  /* ======================================================================
     3. Terminal
     ====================================================================== */

  const EMAIL = 'guhcostan@gmail.com';
  const CV = 'https://guhcostan.dev/files/gustavo-costa-curriculo.pdf';
  const LINKS = {
    linkedin: 'https://www.linkedin.com/in/guhcostan',
    github: 'https://github.com/guhcostan',
    x: 'https://x.com/guhcostandev',
    npm: 'https://www.npmjs.com/~guhcostan'
  };
  const TAUNTS = [
    ['gg. foi fácil.', 'gg. that was easy.'],
    ['eu treino isso desde o primeiro commit.', "I've trained for this since the first commit."],
    ['quer que eu jogue de olhos fechados na próxima?', 'want me to play with my eyes closed next time?'],
    ['três em linha. igual aos blocos do nome lá em cima.', 'three in a row. like the blocks in that name up there.'],
    ['posso abrir um PR com umas dicas pra você.', 'I can open a PR with some tips for you.'],
    ['isso foi um bug ou uma feature?', 'was that a bug or a feature?'],
    ['nem precisei de cache.', "didn't even need a cache."],
    ['vou contar pro guh.', "I'm telling Guh."],
    ['100% de cobertura nessa vitória.', '100% coverage on that win.'],
    ['revanche? digite velha. eu espero.', "rematch? type ttt. I'll wait."]
  ];

  function initTerminal() {
    const term = $('[data-term]');
    if (!term) return;
    const out = $('[data-term-out]', term);
    const form = $('[data-term-form]', term);
    const input = $('[data-term-input]', term);
    const screen = $('[data-term-screen]', term);
    const history = [];
    let hIndex = 0;
    let note = null; // fluxo da nota: { step, msg, from }
    let game = null; // jogo da velha: { b, over, thinking, cells }
    let typed = false;

    const placeholder = () => {
      input.placeholder = note
        ? note.step === 'msg' ? t('sua mensagem', 'your message') : note.step === 'from' ? t('seu nome ou contato', 'your name or contact') : t('s/n', 'y/n')
        : t('digite um comando', 'type a command');
      input.setAttribute('aria-label', t('Comando do terminal', 'Terminal command'));
    };

    function scroll() {
      screen.scrollTop = screen.scrollHeight;
    }

    function print(text, cls) {
      const p = document.createElement('p');
      if (cls) p.className = cls;
      p.textContent = text;
      out.appendChild(p);
      scroll();
      return p;
    }

    function printLink(label, href) {
      const p = document.createElement('p');
      const a = document.createElement('a');
      a.href = href;
      a.textContent = label;
      if (/^https?:/.test(href)) {
        a.target = '_blank';
        a.rel = 'noopener';
      }
      p.appendChild(a);
      out.appendChild(p);
      scroll();
    }

    function echo(cmd) {
      const p = document.createElement('p');
      p.className = 'c-in';
      p.innerHTML = '<span class="u"></span> <span class="p">~ $</span> ';
      p.firstChild.textContent = t('visitante', 'guest');
      p.appendChild(document.createTextNode(cmd));
      out.appendChild(p);
    }

    function welcome() {
      out.textContent = '';
      print(t('oi. este é o terminal do guh.\ndigite um comando e aperte enter,\nou use os botões abaixo.', "hi. this is guh's terminal.\ntype a command and press enter,\nor just use the buttons below."));
    }

    function open(url) {
      const w = window.open(url, '_blank', 'noopener');
      if (!w) printLink(url, url);
    }

    function help() {
      print(t('comandos:', 'commands:'), 'c-dim');
      [
        ['sobre', 'about', 'quem é o guh', 'who guh is'],
        ['projetos', 'projects', 'o que ele mantém', 'what he maintains'],
        ['email', 'email', 'copia o e-mail', 'copies the email'],
        ['nota', 'note', 'manda uma nota por e-mail', 'sends a note by email'],
        ['cv', 'cv', 'abre o currículo', 'opens the résumé'],
        ['linkedin · github · x · npm', 'linkedin · github · x · npm', 'abre o perfil', 'opens the profile'],
        ['velha', 'ttt', 'jogo da velha contra o agente', 'tic-tac-toe against the agent'],
        ['limpar', 'clear', 'limpa a tela', 'clears the screen']
      ].forEach((c) => print('  ' + t(c[0], c[1]) + ' — ' + t(c[2], c[3])));
    }

    /* ----- nota por e-mail ----- */
    function startNote() {
      note = { step: 'msg', msg: '', from: '' };
      print(t('escreva sua mensagem e aperte enter:', 'write your message and press enter:'), 'c-ok');
      placeholder();
      input.focus();
    }

    function stepNote(value) {
      if (note.step === 'msg') {
        if (!value) {
          note = null;
          print(t('mensagem vazia. nota cancelada.', 'empty message. note cancelled.'), 'c-warn');
        } else {
          note.msg = value;
          note.step = 'from';
          print(t('seu nome ou contato (opcional, enter para pular):', 'your name or contact (optional, enter to skip):'), 'c-ok');
        }
      } else if (note.step === 'from') {
        note.from = value;
        note.step = 'confirm';
        print(t('enviar? [S/n]', 'send it? [Y/n]'), 'c-ok');
      } else {
        // enter sem nada = sim, para ninguém perder o que escreveu
        if (/^n/i.test(value)) {
          print(t('ok, nota descartada.', 'ok, note discarded.'), 'c-dim');
        } else {
          const body = note.msg + (note.from ? '\n\n— ' + note.from : '');
          const href = 'mailto:' + EMAIL + '?subject=' + encodeURIComponent(t('Nota do site', 'Note from the site')) + '&body=' + encodeURIComponent(body);
          print(t('abrindo seu app de e-mail...', 'opening your email app...'), 'c-ok');
          printLink(t('não abriu? clique aqui.', "didn't open? click here."), href);
          window.location.href = href;
        }
        note = null;
      }
      placeholder();
    }

    /* ----- jogo da velha ----- */
    const LINES3 = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];

    function winner(b) {
      for (const l of LINES3) {
        if (b[l[0]] && b[l[0]] === b[l[1]] && b[l[0]] === b[l[2]]) return { p: b[l[0]], line: l };
      }
      return b.every(Boolean) ? { p: 'draw' } : null;
    }

    function minimax(b, player, depth) {
      const w = winner(b);
      if (w) return w.p === 'O' ? 10 - depth : w.p === 'X' ? depth - 10 : 0;
      const scores = [];
      for (let i = 0; i < 9; i++) {
        if (b[i]) continue;
        b[i] = player;
        scores.push(minimax(b, player === 'O' ? 'X' : 'O', depth + 1));
        b[i] = '';
      }
      return player === 'O' ? Math.max.apply(null, scores) : Math.min.apply(null, scores);
    }

    function bestMove(b) {
      let best = -Infinity;
      let moves = [];
      for (let i = 0; i < 9; i++) {
        if (b[i]) continue;
        b[i] = 'O';
        const score = minimax(b, 'X', 1);
        b[i] = '';
        if (score > best) {
          best = score;
          moves = [i];
        } else if (score === best) {
          moves.push(i);
        }
      }
      return moves[Math.floor(Math.random() * moves.length)];
    }

    function renderGame() {
      game.cells.forEach((cell, i) => {
        cell.textContent = game.b[i] || String(i + 1);
        cell.className = game.b[i] ? game.b[i].toLowerCase() : '';
        cell.disabled = !!game.b[i] || game.over || game.thinking;
      });
    }

    function endGame(w) {
      game.over = true;
      renderGame();
      if (w.p === 'O') {
        w.line.forEach((i) => game.cells[i].classList.add('win'));
        const taunt = TAUNTS[Math.floor(Math.random() * TAUNTS.length)];
        print(t('o agente venceu. ', 'the agent wins. ') + t(taunt[0], taunt[1]), 'c-warn');
      } else if (w.p === 'X') {
        w.line.forEach((i) => game.cells[i].classList.add('win'));
        print(t('como?! isso não devia ser possível.', "how?! that shouldn't be possible."), 'c-ok');
      } else {
        print(t('empate. por enquanto.', 'draw. for now.'), 'c-ok');
        unlock('velha');
      }
      print(t('jogar de novo? digite velha.', 'play again? type ttt.'), 'c-dim');
    }

    function play(i) {
      if (!game || game.over || game.thinking || game.b[i]) return;
      game.b[i] = 'X';
      renderGame();
      let w = winner(game.b);
      if (w) return endGame(w);
      const current = game;
      current.thinking = true;
      renderGame();
      setTimeout(() => {
        if (game !== current || current.over) return;
        current.b[bestMove(current.b)] = 'O';
        current.thinking = false;
        w = winner(current.b);
        if (w) return endGame(w);
        renderGame();
      }, 380);
    }

    function startGame() {
      if (game && !game.over) game.over = true;
      print(t('você é o X. clique numa casa ou digite de 1 a 9.', 'you are X. click a square or type 1 to 9.'), 'c-dim');
      const grid = document.createElement('div');
      grid.className = 'ttt';
      grid.setAttribute('role', 'group');
      grid.setAttribute('aria-label', t('Jogo da velha', 'Tic-tac-toe'));
      game = { b: ['', '', '', '', '', '', '', '', ''], over: false, thinking: false, cells: [] };
      const current = game;
      for (let i = 0; i < 9; i++) {
        const cell = document.createElement('button');
        cell.type = 'button';
        cell.setAttribute('aria-label', t('Casa ', 'Square ') + (i + 1));
        cell.addEventListener('click', () => {
          if (game === current) play(i);
        });
        grid.appendChild(cell);
        game.cells.push(cell);
      }
      out.appendChild(grid);
      renderGame();
      scroll();
    }

    /* ----- comandos ----- */
    const normalize = (s) => s.trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

    function run(raw) {
      const value = raw.trim();
      if (note) {
        echo(value);
        return stepNote(value);
      }
      echo(value);
      if (!value) return;
      typed = true;
      const cmd = normalize(value);
      const [name] = cmd.split(/\s+/);

      if (game && !game.over && /^[1-9]$/.test(cmd)) return play(Number(cmd) - 1);

      switch (name) {
        case 'ajuda': case 'help': case '?': return help();
        case 'sobre': case 'about': case 'whoami':
          if (name === 'whoami') return print(t('visitante', 'guest'));
          print(t('gustavo costa (guh). engenheiro mobile e frontend,', 'gustavo costa (guh). mobile & frontend engineer,'));
          print(t('tech anchor na thoughtworks, no app latampass.', 'tech anchor at thoughtworks, on the latampass app.'));
          return print(t('8+ anos de react native, typescript e ia.', '8+ years of react native, typescript and ai.'), 'c-dim');
        case 'projetos': case 'projects': case 'ls':
          if (name === 'ls') return print(t('projetos/  curriculo.pdf  segredos.txt', 'projects/  resume.pdf  secrets.txt'));
          [['mac-cleaner-cli', '1.9k'], ['b3analysis', '128'], ['claude-mega-brain', '126'], ['windows-cleaner-cli', '84'], ['brasilapi-sdk', '70']]
            .forEach((r) => print(r[0] + ' — ' + r[1] + t(' estrelas', ' stars')));
          return print(t('tudo em github.com/guhcostan', 'all at github.com/guhcostan'), 'c-dim');
        case 'cat':
          if (/segredos|secrets/.test(cmd)) return print(t('boa tentativa. procure pelo site.', 'nice try. look around the site.'), 'c-warn');
          if (/curriculo|resume|cv/.test(cmd)) return open(CV);
          return print(t('cat: arquivo não encontrado.', 'cat: no such file.'), 'c-warn');
        case 'cd':
          return print(t('aqui não tem pastas de verdade. só blocos.', 'there are no real folders here. just blocks.'));
        case 'email': case 'e-mail': case 'mail':
          printLink(EMAIL, 'mailto:' + EMAIL);
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(EMAIL).then(
              () => print(t('copiado para a área de transferência.', 'copied to the clipboard.'), 'c-ok'),
              () => {}
            );
          }
          return;
        case 'nota': case 'note': case 'mensagem': case 'message':
          return startNote();
        case 'cv': case 'curriculo': case 'resume':
          print(t('abrindo o currículo...', 'opening the résumé...'), 'c-ok');
          return open(CV);
        case 'linkedin': case 'github': case 'x': case 'npm':
          print(t('abrindo ', 'opening ') + name + '...', 'c-ok');
          return open(LINKS[name]);
        case 'seguir': case 'follow': case 'twitter':
          print(t('abrindo o x...', 'opening x...'), 'c-ok');
          return open(LINKS.x);
        case 'velha': case 'ttt': case 'tictactoe': case 'jogo': case 'game':
          return startGame();
        case 'limpar': case 'clear': case 'cls':
          return welcome();
        case 'sudo':
          unlock('sudo');
          return print(t('boa tentativa. este incidente será reportado ao guh.', 'nice try. this incident will be reported to guh.'), 'c-warn');
        case 'rm':
          return print(t('não.', 'no.'), 'c-warn');
        case 'matrix':
          print(t('acorde, visitante...', 'wake up, guest...'), 'c-ok');
          return matrix();
        case 'exit': case 'sair': case 'quit':
          return print(t('não dá pra sair. você já está em casa.', "you can't leave. you're already home."));
        case 'data': case 'date':
          return print(new Date().toLocaleString(isEn() ? 'en-US' : 'pt-BR'));
        case 'echo':
          return print(value.slice(5));
        case 'oi': case 'ola': case 'hi': case 'hello': case 'hey':
          return print(t('oi! digite ajuda para ver o que eu sei fazer.', 'hi! type help to see what I can do.'));
        case 'segredos': case 'secrets':
          return print(t('você achou ', 'you found ') + found.length + '/' + SECRETS.length + t('. o resto fica com você.', '. the rest is up to you.'));
        case 'tema': case 'theme':
          return print(t('só tem o escuro aqui. os blocos agradecem.', 'dark is the only theme here. the blocks say thanks.'));
        default:
          return print(t('comando não encontrado: ', 'command not found: ') + name + t('. digite ajuda.', '. type help.'), 'c-warn');
      }
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const value = input.value;
      input.value = '';
      if (value.trim() && !note) {
        history.push(value);
        hIndex = history.length;
      }
      run(value);
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowUp' && history.length && !note) {
        hIndex = Math.max(0, hIndex - 1);
        input.value = history[hIndex];
        e.preventDefault();
      } else if (e.key === 'ArrowDown' && history.length && !note) {
        hIndex = Math.min(history.length, hIndex + 1);
        input.value = history[hIndex] || '';
        e.preventDefault();
      } else if (e.key === 'Escape' && note) {
        note = null;
        print(t('nota cancelada.', 'note cancelled.'), 'c-dim');
        placeholder();
      }
    });

    $$('[data-cmd]', term).forEach((btn) => {
      btn.addEventListener('click', () => {
        const cmd = btn.getAttribute('data-cmd');
        run(cmd === 'velha' && isEn() ? 'ttt' : cmd === 'ajuda' && isEn() ? 'help' : cmd === 'nota' && isEn() ? 'note' : cmd);
      });
    });

    screen.addEventListener('click', (e) => {
      if (e.target.closest('a, button')) return;
      if (window.getSelection && String(window.getSelection())) return;
      input.focus({ preventScroll: true });
    });

    document.addEventListener('guh:locale', () => {
      placeholder();
      if (!typed) welcome();
    });

    placeholder();
    welcome();
  }

  /* ======================================================================
     4. Segredos
     ====================================================================== */

  const SECRETS = [
    { id: 'chat', pt: 'Papo de agente', en: 'Agent small talk' },
    { id: 'rebuild', pt: 'Demolição', en: 'Demolition' },
    { id: 'lang', pt: 'Poliglota', en: 'Polyglot' },
    { id: 'konami', pt: 'Código Konami', en: 'Konami code' },
    { id: 'sudo', pt: 'Sem permissão', en: 'Permission denied' },
    { id: 'matrix', pt: 'Pílula verde', en: 'Green pill' },
    { id: 'velha', pt: 'Empate técnico', en: 'Stalemate' },
    { id: 'reader', pt: 'Leu até o fim', en: 'Read to the end' },
    { id: 'lost', pt: 'Bloco perdido', en: 'Lost block' },
    { id: 'owl', pt: 'Coruja', en: 'Night owl' }
  ];
  const known = SECRETS.map((s) => s.id);
  let found = store.get('guh-secrets', []).filter((id) => known.indexOf(id) !== -1);
  let toastEl = null;
  let toastTimer = 0;

  function renderCount() {
    $$('[data-secrets-count]').forEach((el) => {
      el.textContent = found.length + '/' + SECRETS.length;
    });
  }

  function toast(text) {
    if (toastEl) toastEl.remove();
    clearTimeout(toastTimer);
    toastEl = document.createElement('div');
    toastEl.className = 'toast';
    toastEl.setAttribute('role', 'status');
    toastEl.textContent = text;
    document.body.appendChild(toastEl);
    toastTimer = setTimeout(() => {
      if (toastEl) toastEl.remove();
      toastEl = null;
    }, 3600);
  }

  function unlock(id) {
    if (found.indexOf(id) !== -1) return false;
    const secret = SECRETS.find((s) => s.id === id);
    if (!secret) return false;
    found = found.concat(id);
    store.set('guh-secrets', found);
    renderCount();
    toast(t('Segredo encontrado: ', 'Secret found: ') + t(secret.pt, secret.en) + ' · ' + found.length + '/' + SECRETS.length);
    if (found.length === SECRETS.length) {
      setTimeout(() => toast(t('Todos os segredos! O agente está impressionado.', 'All secrets! The agent is impressed.')), 3800);
    }
    return true;
  }

  function initSecrets() {
    renderCount();
    const btn = $('[data-secrets]');
    if (btn) {
      let panel = null;
      const close = () => {
        if (!panel) return;
        panel.remove();
        panel = null;
        btn.setAttribute('aria-expanded', 'false');
      };
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (panel) return close();
        panel = document.createElement('div');
        panel.className = 'secrets-list';
        panel.setAttribute('role', 'dialog');
        panel.setAttribute('aria-label', t('Segredos', 'Secrets'));
        const h = document.createElement('h2');
        h.textContent = t('Segredos encontrados ', 'Secrets found ') + found.length + '/' + SECRETS.length;
        panel.appendChild(h);
        const ul = document.createElement('ul');
        SECRETS.forEach((s) => {
          const li = document.createElement('li');
          const ok = found.indexOf(s.id) !== -1;
          li.className = ok ? 'found' : '';
          li.textContent = ok ? t(s.pt, s.en) : '???';
          ul.appendChild(li);
        });
        panel.appendChild(ul);
        document.body.appendChild(panel);
        btn.setAttribute('aria-expanded', 'true');
      });
      document.addEventListener('click', (e) => {
        if (panel && !panel.contains(e.target)) close();
      });
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') close();
      });
    }

    // Poliglota: trocou de idioma pelo seletor
    document.addEventListener('guh:locale', (e) => {
      if (e.detail && e.detail.byUser) unlock('lang');
    });

    // Konami: ↑ ↑ ↓ ↓ ← → ← → B A
    const KONAMI = ['arrowup', 'arrowup', 'arrowdown', 'arrowdown', 'arrowleft', 'arrowright', 'arrowleft', 'arrowright', 'b', 'a'];
    let pos = 0;
    document.addEventListener('keydown', (e) => {
      if (e.target && /input|textarea/i.test(e.target.tagName)) return;
      const key = (e.key || '').toLowerCase();
      pos = key === KONAMI[pos] ? pos + 1 : key === KONAMI[0] ? 1 : 0;
      if (pos === KONAMI.length) {
        pos = 0;
        root.classList.add('party');
        setTimeout(() => root.classList.remove('party'), 6000);
        unlock('konami');
      }
    });

    // Coruja: visita de madrugada
    const hour = new Date().getHours();
    if (hour >= 0 && hour < 5) setTimeout(() => unlock('owl'), 2500);

    // Leu até o fim: o rodapé do post apareceu na tela
    const end = $('[data-post-end]');
    if (end && 'IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          unlock('reader');
          io.disconnect();
        }
      });
      io.observe(end);
    }

    // Bloco perdido: chegou na página 404
    if ($('[data-lost]')) setTimeout(() => unlock('lost'), 1200);
  }

  /* ---------- Matrix: chuva de blocos verdes ---------- */
  function matrix() {
    unlock('matrix');
    if (calm || $('.matrix')) return;
    const canvas = document.createElement('canvas');
    canvas.className = 'matrix';
    canvas.setAttribute('aria-hidden', 'true');
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    const size = 16;
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);
    const cols = Math.ceil(w / size);
    const drops = Array.from({ length: cols }, () => Math.floor((Math.random() * -h) / size));
    const chars = 'GUHCOSTA0123456789<>/{}=+*';
    let raf = 0;
    let last = 0;
    const started = performance.now();

    function stop() {
      cancelAnimationFrame(raf);
      canvas.remove();
      document.removeEventListener('keydown', onKey);
    }
    function onKey(e) {
      if (e.key === 'Escape') stop();
    }
    canvas.addEventListener('click', stop);
    document.addEventListener('keydown', onKey);

    function draw(now) {
      if (now - started > 7000) return stop();
      raf = requestAnimationFrame(draw);
      if (now - last < 50) return;
      last = now;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.12)';
      ctx.fillRect(0, 0, w, h);
      ctx.font = size + 'px Silkscreen, monospace';
      for (let i = 0; i < cols; i++) {
        const y = drops[i] * size;
        ctx.fillStyle = Math.random() < 0.08 ? '#eceee6' : COLORS.green;
        if (Math.random() < 0.5) ctx.fillText(chars[Math.floor(Math.random() * chars.length)], i * size, y);
        else ctx.fillRect(i * size + 3, y - size + 4, size - 6, size - 6);
        if (y > h && Math.random() > 0.97) drops[i] = 0;
        drops[i]++;
      }
    }
    raf = requestAnimationFrame(draw);
  }

  /* ======================================================================
     Inicialização
     ====================================================================== */
  function init() {
    placeAgents();
    initSecrets();
    initIntro();
    initRebuild();
    initPreviews();
    initBricks();
    initContrib();
    initTerminal();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
