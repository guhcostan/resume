/* ==========================================================================
   Home: pixel art vivo, entradas animadas e paleta de comandos.
   Tudo é progressivo. Sem JS, ou com movimento reduzido, o conteúdo fica
   estático e legível: os efeitos só ligam com html.is-live e html.fx.
   ========================================================================== */
(function () {
  'use strict';

  var html = document.documentElement;
  var fx = html.classList.contains('fx');
  var fine = !!(window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches);
  var scrollJobs = [];
  var ticking = false;

  var FRAG = [
    'precision mediump float;',
    'uniform vec2 uRes;',
    'uniform float uT;',
    'float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}',
    'float noise(vec2 p){',
    '  vec2 i=floor(p);',
    '  vec2 f=fract(p);',
    '  f=f*f*(3.0-2.0*f);',
    '  return mix(mix(hash(i),hash(i+vec2(1.0,0.0)),f.x),mix(hash(i+vec2(0.0,1.0)),hash(i+vec2(1.0,1.0)),f.x),f.y);',
    '}',
    'float band(vec2 uv,float s,float t){',
    '  float y=0.62+0.2*noise(vec2(uv.x*2.4+t*s,s*3.0))+0.05*sin(uv.x*7.0+t*s*2.0);',
    '  float body=1.0-smoothstep(0.0,0.1,abs(uv.y-y));',
    '  float streak=0.55+0.45*noise(vec2(uv.x*18.0-t*s*3.0,uv.y*6.0));',
    '  return body*streak;',
    '}',
    'void main(){',
    '  vec2 uv=gl_FragCoord.xy/uRes;',
    '  float g=band(uv,0.35,uT*0.9);',
    '  float o=band(uv+vec2(0.0,0.09),0.2,uT*0.6);',
    '  vec3 green=vec3(0.357,0.890,0.510);',
    '  vec3 orange=vec3(0.851,0.467,0.341);',
    '  vec3 col=green*g+orange*o*0.7;',
    '  gl_FragColor=vec4(col,clamp(g+o*0.7,0.0,1.0)*0.8);',
    '}'
  ].join('\n');

  function all(sel, scope) {
    return Array.prototype.slice.call((scope || document).querySelectorAll(sel));
  }

  function one(sel, scope) {
    return (scope || document).querySelector(sel);
  }

  function locale() {
    return html.getAttribute('data-locale') === 'en' ? 'en' : 'pt-BR';
  }

  function pick(pt, en) {
    return locale() === 'en' ? en : pt;
  }

  function clamp(v, min, max) {
    return Math.min(max, Math.max(min, v));
  }

  function rng(seed) {
    return function () {
      seed = (seed * 16807) % 2147483647;
      return seed / 2147483647;
    };
  }

  function queueScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      ticking = false;
      scrollJobs.forEach(function (job) { job(); });
    });
  }

  window.addEventListener('scroll', queueScroll, { passive: true });
  window.addEventListener('resize', queueScroll);

  function initScrollBar() {
    var bar = one('.scroll-bar');
    if (!bar) return;
    scrollJobs.push(function () {
      var max = html.scrollHeight - window.innerHeight;
      bar.style.setProperty('--p', max > 0 ? String(window.scrollY / max) : '0');
    });
  }

  function initSplit() {
    all('[data-split]').forEach(function (line, lineIndex) {
      var text = line.textContent;
      line.setAttribute('role', 'img');
      line.setAttribute('aria-label', text);
      line.textContent = '';
      Array.prototype.forEach.call(text, function (letter, i) {
        var span = document.createElement('span');
        span.className = 'ch';
        span.setAttribute('aria-hidden', 'true');
        span.style.setProperty('--d', (lineIndex * 420 + i * 60 + 120) + 'ms');
        span.textContent = letter;
        line.appendChild(span);
      });
    });
  }

  function initAurora() {
    var canvas = one('[data-aurora]');
    if (!canvas || !fx) return;
    var gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: false, antialias: false });
    if (!gl) return;

    function compile(type, src) {
      var shader = gl.createShader(type);
      gl.shaderSource(shader, src);
      gl.compileShader(shader);
      return shader;
    }

    var program = gl.createProgram();
    gl.attachShader(program, compile(gl.VERTEX_SHADER, 'attribute vec2 p;void main(){gl_Position=vec4(p,0.0,1.0);}'));
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    var pos = gl.getAttribLocation(program, 'p');
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    var uRes = gl.getUniformLocation(program, 'uRes');
    var uT = gl.getUniformLocation(program, 'uT');
    var start = performance.now();
    var visible = true;

    function resize() {
      canvas.width = Math.max(1, Math.round(canvas.clientWidth / 3));
      canvas.height = Math.max(1, Math.round(canvas.clientHeight / 3));
      gl.viewport(0, 0, canvas.width, canvas.height);
    }

    function loop(now) {
      if (visible && !document.hidden) {
        gl.uniform2f(uRes, canvas.width, canvas.height);
        gl.uniform1f(uT, (now - start) / 1000);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
      }
      requestAnimationFrame(loop);
    }

    resize();
    canvas.style.imageRendering = 'pixelated';
    var hero = canvas.closest('.hero');
    if (hero) hero.classList.add('has-gl');
    window.addEventListener('resize', resize);
    new IntersectionObserver(function (entries) { visible = entries[0].isIntersecting; }).observe(canvas);
    requestAnimationFrame(loop);
  }

  function initRoles() {
    var box = one('.roles');
    var text = one('.roles__text', box || document);
    if (!box || !text) return;
    var glyphs = '<>/#*+=-_%&';
    var index = 0;
    var timer = 0;

    function list() {
      return (box.getAttribute(locale() === 'en' ? 'data-roles-en' : 'data-roles-pt') || '').split('|');
    }

    function scramble(word) {
      clearInterval(timer);
      if (!fx) {
        text.textContent = word;
        return;
      }
      var step = 0;
      timer = setInterval(function () {
        step += 1;
        var out = '';
        for (var i = 0; i < word.length; i += 1) {
          var ch = word.charAt(i);
          out += (i < step / 2 || ch === ' ') ? ch : glyphs.charAt(Math.floor(Math.random() * glyphs.length));
        }
        text.textContent = out;
        if (step / 2 >= word.length) {
          clearInterval(timer);
          text.textContent = word;
        }
      }, 40);
    }

    text.textContent = list()[0];

    if (fx) {
      setInterval(function () {
        if (document.hidden) return;
        index = (index + 1) % list().length;
        scramble(list()[index]);
      }, 2600);
    }

    document.addEventListener('guh:locale', function () {
      index = 0;
      scramble(list()[0]);
    });
  }

  function initClock() {
    var el = one('[data-clock]');
    if (!el) return;
    var fmt = new Intl.DateTimeFormat('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'America/Sao_Paulo'
    });
    var tick = function () { el.textContent = fmt.format(new Date()); };
    tick();
    setInterval(tick, 1000);
  }

  function initMagnet() {
    if (!fx || !fine) return;
    all('[data-magnet]').forEach(function (el) {
      el.addEventListener('pointermove', function (event) {
        var r = el.getBoundingClientRect();
        var x = (event.clientX - (r.left + r.width / 2)) * 0.25;
        var y = (event.clientY - (r.top + r.height / 2)) * 0.35;
        el.style.translate = x.toFixed(1) + 'px ' + y.toFixed(1) + 'px';
      });
      el.addEventListener('pointerleave', function () {
        el.style.translate = '';
      });
    });
  }

  function when(el, fn) {
    var io = new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting) return;
      io.unobserve(el);
      el.classList.add('is-in');
      if (fn) fn(el);
    }, { threshold: 0.2, rootMargin: '0px 0px -6% 0px' });
    io.observe(el);
  }

  function initReveal() {
    all('[data-reveal]').forEach(function (el) {
      var siblings = Array.prototype.filter.call(el.parentElement.children, function (child) {
        return child.hasAttribute('data-reveal');
      });
      el.style.setProperty('--d', (Math.min(siblings.indexOf(el), 4) * 110) + 'ms');
      when(el);
    });
  }

  function paintStat(el, value) {
    var loc = locale() === 'en' ? 'en-US' : 'pt-BR';
    el.textContent = (el.getAttribute('data-pre') || '') +
      Math.round(value).toLocaleString(loc) +
      (el.getAttribute('data-post') || '');
  }

  function countUp(el) {
    var target = Number(el.getAttribute('data-count'));
    var start = performance.now();
    function step(now) {
      var t = clamp((now - start) / 1400, 0, 1);
      paintStat(el, target * (1 - Math.pow(1 - t, 3)));
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function initStats() {
    all('.stat__num[data-count]').forEach(function (el) {
      var target = Number(el.getAttribute('data-count'));
      if (!fx) {
        paintStat(el, target);
        return;
      }
      paintStat(el, 0);
      when(el, countUp);
    });
  }

  function typeLines(body) {
    var rows = Array.prototype.slice.call(body.children);
    var at = 0;
    function next() {
      var row = rows[at];
      at += 1;
      if (!row) return;
      var cmd = row.querySelector('.term__cmd');
      if (!cmd) {
        row.hidden = false;
        setTimeout(next, 160);
        return;
      }
      var text = cmd.getAttribute('data-type') || '';
      var i = 0;
      var timer = setInterval(function () {
        i += 1;
        cmd.textContent = text.slice(0, i);
        if (i >= text.length) {
          clearInterval(timer);
          setTimeout(next, 380);
        }
      }, 46);
    }
    next();
  }

  function initTerms() {
    if (!fx) return;
    all('.term__body').forEach(function (body) {
      body.style.minHeight = body.offsetHeight + 'px';
      Array.prototype.forEach.call(body.children, function (row) {
        var cmd = row.querySelector('.term__cmd');
        if (cmd) cmd.textContent = '';
        else row.hidden = true;
      });
      when(body, typeLines);
    });
  }

  function initMeters() {
    all('.meter').forEach(function (meter) {
      var cells = all('i', meter);
      if (!fx) {
        cells.forEach(function (cell) { cell.classList.add('on'); });
        return;
      }
      when(meter, function () {
        cells.forEach(function (cell, n) {
          setTimeout(function () { cell.classList.add('on'); }, n * 90);
        });
      });
    });
  }

  function initBrain() {
    var box = one('[data-brain]');
    if (!box) return;
    var rand = rng(11);
    var cells = [];
    for (var i = 0; i < 48; i += 1) {
      cells.push(box.appendChild(document.createElement('i')));
    }
    if (!fx) {
      cells.forEach(function (cell) {
        if (rand() > 0.55) cell.classList.add('on');
      });
      return;
    }
    when(box, function () {
      cells.forEach(function (cell, n) {
        setTimeout(function () { cell.classList.add('on'); }, n * 22 + Math.floor(rand() * 60));
      });
      setTimeout(function () {
        setInterval(function () {
          if (document.hidden) return;
          cells[Math.floor(rand() * cells.length)].classList.toggle('on');
        }, 260);
      }, cells.length * 22 + 120);
    });
  }

  function initCandles() {
    var box = one('[data-candles]');
    if (!box) return;
    var rand = rng(42);
    var price = 50;
    for (var i = 0; i < 30; i += 1) {
      var next = clamp(price + (rand() - 0.48) * 22, 10, 95);
      var delta = next - price;
      var cell = document.createElement('i');
      cell.style.setProperty('--h', (18 + Math.abs(delta) * 4).toFixed(1) + '%');
      if (delta < 0) cell.classList.add('down');
      box.appendChild(cell);
      price = next;
    }
  }

  function initGround() {
    var box = one('[data-ground]');
    if (!box) return;
    var rand = rng(5);
    for (var i = 0; i < 40; i += 1) {
      var cell = document.createElement('i');
      cell.style.setProperty('--h', (12 + rand() * 60).toFixed(1) + '%');
      box.appendChild(cell);
    }
  }

  function monthIndex(value) {
    var parts = value.split('-');
    return Number(parts[0]) * 12 + Number(parts[1]) - 1;
  }

  function initBricks() {
    var now = new Date();
    var nowIndex = now.getFullYear() * 12 + now.getMonth();
    all('.job__bricks').forEach(function (box) {
      var from = box.getAttribute('data-from');
      if (!from) return;
      var to = box.getAttribute('data-to');
      var end = to ? monthIndex(to) : nowIndex;
      var count = Math.max(1, end - monthIndex(from));
      for (var k = 0; k < count; k += 1) {
        var brick = document.createElement('span');
        brick.className = 'brick';
        brick.style.setProperty('--t', (k * 28) + 'ms');
        if (!to && k === count - 1) brick.classList.add('brick--now');
        box.appendChild(brick);
      }
    });
  }

  function initMetro() {
    var list = one('[data-metro]');
    if (!list) return;
    var jobs = all('.job', list);
    scrollJobs.push(function () {
      var line = window.innerHeight * 0.62;
      var rect = list.getBoundingClientRect();
      if (!rect.height) return;
      var p = clamp((line - rect.top) / rect.height, 0, 1);
      list.style.setProperty('--p', (p * 100).toFixed(2));
      jobs.forEach(function (job) {
        job.classList.toggle('is-lit', job.getBoundingClientRect().top < line);
      });
    });
  }

  function initTilt() {
    if (!fx || !fine) return;
    all('[data-tilt]').forEach(function (card) {
      card.addEventListener('pointermove', function (event) {
        var r = card.getBoundingClientRect();
        if (!r.width || !r.height) return;
        var px = (event.clientX - r.left) / r.width;
        var py = (event.clientY - r.top) / r.height;
        card.style.setProperty('--rx', ((0.5 - py) * 7).toFixed(2) + 'deg');
        card.style.setProperty('--ry', ((px - 0.5) * 9).toFixed(2) + 'deg');
        card.style.setProperty('--mx', (px * r.width).toFixed(1) + 'px');
        card.style.setProperty('--my', (py * r.height).toFixed(1) + 'px');
      });
      card.addEventListener('pointerleave', function () {
        card.style.removeProperty('--rx');
        card.style.removeProperty('--ry');
        card.style.removeProperty('--mx');
        card.style.removeProperty('--my');
      });
    });
  }

  function initContrib() {
    var grid = one('.contrib__grid');
    if (!grid) return;
    all('rect[data-d]', grid).forEach(function (cell) {
      cell.style.setProperty('--t', Math.round(Number(cell.getAttribute('x')) * 0.6) + 'ms');
    });

    var tip = document.createElement('div');
    tip.className = 'tip';
    tip.setAttribute('aria-hidden', 'true');
    document.body.appendChild(tip);

    grid.addEventListener('pointermove', function (event) {
      var cell = event.target.closest ? event.target.closest('rect[data-d]') : null;
      if (!cell) {
        tip.classList.remove('is-on');
        return;
      }
      var en = locale() === 'en';
      var count = Number(cell.getAttribute('data-c')) || 0;
      var day = new Date(cell.getAttribute('data-d') + 'T00:00:00Z');
      var date = day.toLocaleDateString(en ? 'en-US' : 'pt-BR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        timeZone: 'UTC'
      });
      var word = en
        ? (count === 1 ? 'contribution' : 'contributions')
        : (count === 1 ? 'contribuição' : 'contribuições');
      tip.textContent = count.toLocaleString(en ? 'en-US' : 'pt-BR') + ' ' + word + ' · ' + date;
      tip.style.left = Math.min(event.clientX + 14, window.innerWidth - tip.offsetWidth - 8) + 'px';
      tip.style.top = (event.clientY - 10) + 'px';
      tip.classList.add('is-on');
    });
    grid.addEventListener('pointerleave', function () {
      tip.classList.remove('is-on');
    });
  }

  function norm(value) {
    return value.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  }

  function copyEmail(btn) {
    if (!btn) return;
    var status = one('[data-copy-status]');
    var mail = btn.getAttribute('data-copy-email') || '';
    function report(pt, en) {
      if (status) status.textContent = pick(pt, en);
    }
    if (!navigator.clipboard || !navigator.clipboard.writeText) {
      report('Não consegui copiar. Selecione o endereço acima.', "Couldn't copy. Select the address above.");
      return;
    }
    navigator.clipboard.writeText(mail).then(function () {
      report('E-mail copiado.', 'Email copied.');
    }, function () {
      report('Não consegui copiar. Selecione o endereço acima.', "Couldn't copy. Select the address above.");
    });
  }

  function initCopy() {
    all('[data-copy-email]').forEach(function (btn) {
      btn.addEventListener('click', function () { copyEmail(btn); });
    });
  }

  function initPalette() {
    var dlg = one('#palette');
    var input = one('#palette-input');
    var list = one('#palette-list');
    var empty = one('[data-palette-empty]');
    if (!dlg || !input || !list || !empty) return;

    var items = all('.palette__item', list);
    var opener = null;
    var selected = null;

    function visibleItems() {
      return items.filter(function (item) { return !item.hidden; });
    }

    function select(item) {
      if (selected) selected.setAttribute('aria-selected', 'false');
      selected = item;
      if (!item) {
        input.removeAttribute('aria-activedescendant');
        return;
      }
      item.setAttribute('aria-selected', 'true');
      input.setAttribute('aria-activedescendant', item.id);
      item.scrollIntoView({ block: 'nearest' });
    }

    function filter() {
      var terms = norm(input.value.trim()).split(/\s+/).filter(Boolean);
      items.forEach(function (item) {
        var haystack = norm((item.getAttribute('data-search') || '') + ' ' + item.textContent);
        item.hidden = !terms.every(function (term) { return haystack.indexOf(term) !== -1; });
      });
      var visible = visibleItems();
      empty.hidden = visible.length > 0;
      select(visible[0] || null);
    }

    function run(item) {
      var lang = item.getAttribute('data-lang');
      var href = item.getAttribute('data-href');
      dlg.close();
      if (lang) {
        var langBtn = one('[data-lang-btn="' + lang + '"]');
        if (langBtn) langBtn.click();
        return;
      }
      if (item.getAttribute('data-cmd') === 'copy') {
        copyEmail(one('[data-copy-email]'));
        return;
      }
      if (!href) return;
      if (item.hasAttribute('data-external')) {
        window.open(href, '_blank', 'noopener');
        return;
      }
      if (href.charAt(0) === '#') {
        location.hash = href;
        return;
      }
      location.href = href;
    }

    function open(trigger) {
      opener = trigger || null;
      input.value = '';
      filter();
      if (!dlg.open) dlg.showModal();
      input.focus();
    }

    dlg.addEventListener('close', function () {
      if (opener && opener.focus) opener.focus();
      opener = null;
    });

    dlg.addEventListener('click', function (event) {
      if (event.target === dlg) dlg.close();
    });

    all('[data-palette-open]').forEach(function (btn) {
      btn.addEventListener('click', function () { open(btn); });
    });

    all('[data-palette-close]').forEach(function (btn) {
      btn.addEventListener('click', function () { dlg.close(); });
    });

    document.addEventListener('keydown', function (event) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        if (dlg.open) dlg.close();
        else open(document.activeElement);
      }
    });

    input.addEventListener('input', filter);

    input.addEventListener('keydown', function (event) {
      var shown = visibleItems();
      var count = shown.length;
      if (!count) return;
      var idx = shown.indexOf(selected);
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        var next = idx < 0 ? 0 : (event.key === 'ArrowDown' ? (idx + 1) % count : (idx - 1 + count) % count);
        select(shown[next]);
      } else if (event.key === 'Enter') {
        event.preventDefault();
        if (selected) run(selected);
      }
    });

    list.addEventListener('pointermove', function (event) {
      var item = event.target.closest ? event.target.closest('.palette__item') : null;
      if (item && item !== selected && !item.hidden) select(item);
    });

    list.addEventListener('click', function (event) {
      var item = event.target.closest ? event.target.closest('.palette__item') : null;
      if (item && !item.hidden) run(item);
    });

    filter();
  }

  function onLocale() {
    var input = one('#palette-input');
    if (input) {
      input.placeholder = pick(input.getAttribute('data-ph-pt') || '', input.getAttribute('data-ph-en') || '');
    }
    all('.stat__num[data-count]').forEach(function (el) {
      var done = el.classList.contains('is-in') || !fx;
      paintStat(el, done ? Number(el.getAttribute('data-count')) : 0);
    });
  }

  function init() {
    try {
      initScrollBar();
      initSplit();
      initRoles();
      initClock();
      initMagnet();
      initAurora();
      initReveal();
      initStats();
      initMeters();
      initBrain();
      initCandles();
      initTerms();
      initGround();
      initBricks();
      initMetro();
      initTilt();
      initContrib();
      initPalette();
      initCopy();
      onLocale();
      document.addEventListener('guh:locale', onLocale);
      queueScroll();
      html.classList.add('is-live');
    } catch (error) {
      html.classList.remove('fx');
      html.classList.remove('is-live');
      console.error(error);
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
