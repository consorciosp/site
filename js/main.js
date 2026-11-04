/* ═══════════════════════════════════════════════════════════════
   CONSÓRCIO RIBEIRÃO PRETO — main.js
   Slider 3D (coverflow) + leads via WhatsApp + UI
   ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  var WHATS = '5516992679916';

  /* ───────────────────────────────────────────────
     SLIDER 3D
  ─────────────────────────────────────────────── */
  var SLIDES = [
    {
      img: 'img/hero-carta.jpg',
      tag: 'Nossa especialidade',
      title: 'Carta Contemplada',
      desc: 'Crédito já contemplado, pronto para usar quando você quiser. Sem esperar sorteio.',
      alt: 'Casa moderna com piscina adquirida com carta contemplada',
      cta: 'Quero minha carta',
      msg: 'Olá! Vim pelo site e tenho interesse em CARTA CONTEMPLADA. Podem me enviar as opções disponíveis?'
    },
    {
      img: 'img/hero-rodobens.jpg',
      tag: 'Rodobens',
      title: 'Consórcio Rodobens',
      desc: 'Uma das maiores administradoras do país. Imóveis prontos, na planta, construção e veículos.',
      alt: 'Edifício residencial moderno',
      cta: 'Simular Rodobens',
      msg: 'Olá! Vim pelo site e gostaria de simular um consórcio da RODOBENS.'
    },
    {
      img: 'img/hero-yamaha.jpg',
      tag: 'Yamaha',
      title: 'Consórcio Yamaha',
      desc: 'Motos e WaveRunners com planos flexíveis que cabem no seu orçamento.',
      alt: 'Moto em estrada cênica',
      cta: 'Simular Yamaha',
      msg: 'Olá! Vim pelo site e gostaria de simular um consórcio da YAMAHA.'
    },
    {
      img: 'img/hero-itau.jpg',
      tag: 'Itaú',
      title: 'Consórcio Itaú',
      desc: 'A solidez de um dos maiores bancos do Brasil para o seu próximo veículo ou imóvel.',
      alt: 'Carro zero km estacionado em casa',
      cta: 'Simular Itaú',
      msg: 'Olá! Vim pelo site e gostaria de simular um consórcio do ITAÚ.'
    },
    {
      img: 'img/hero-lazer.jpg',
      tag: 'Liberdade total',
      title: 'Use como quiser',
      desc: 'Imóveis, veículos, reformas, lazer e serviços — o crédito é seu, o projeto também.',
      alt: 'Jet skis no mar turquesa',
      cta: 'Falar com especialista',
      msg: 'Olá! Vim pelo site e quero falar com um especialista em consórcios.'
    }
  ];

  var stage = document.getElementById('s3d-stage');
  var dotsBox = document.getElementById('s3d-dots');
  var btnPrev = document.getElementById('s3d-prev');
  var btnNext = document.getElementById('s3d-next');

  var waLink = function (msg) {
    return 'https://wa.me/' + WHATS + '?text=' + encodeURIComponent(msg);
  };

  var els = SLIDES.map(function (s, i) {
    var art = document.createElement('article');
    art.className = 's3d-slide';
    art.setAttribute('aria-hidden', i !== 0 ? 'true' : 'false');
    var img = document.createElement('img');
    img.src = s.img;
    img.alt = s.alt;
    img.loading = i === 0 ? 'eager' : 'lazy';
    img.draggable = false;
    var shade = document.createElement('div');
    shade.className = 'slide-shade';
    var body = document.createElement('div');
    body.className = 'slide-body';
    body.innerHTML =
      '<span class="slide-tag"></span>' +
      '<h3></h3>' +
      '<p></p>';
    body.querySelector('.slide-tag').textContent = s.tag;
    body.querySelector('h3').textContent = s.title;
    body.querySelector('p').textContent = s.desc;
    var cta = document.createElement('a');
    cta.className = 'btn btn-wa';
    cta.href = waLink(s.msg);
    cta.target = '_blank';
    cta.rel = 'noopener';
    cta.textContent = s.cta;
    body.appendChild(cta);
    art.appendChild(img);
    art.appendChild(shade);
    art.appendChild(body);
    stage.appendChild(art);
    return art;
  });

  var dots = SLIDES.map(function (s, i) {
    var b = document.createElement('button');
    b.className = 's3d-dot' + (i === 0 ? ' on' : '');
    b.setAttribute('role', 'tab');
    b.setAttribute('aria-label', 'Ir para o slide ' + (i + 1) + ': ' + s.title);
    b.addEventListener('click', function () { go(i); restart(); });
    dotsBox.appendChild(b);
    return b;
  });

  var cur = 0;
  var N = SLIDES.length;

  function layout() {
    var w = stage.clientWidth;
    var step = Math.min(w * 0.56, 830);
    var depth = Math.min(w * 0.46, 680);
    els.forEach(function (el, i) {
      var d = i - cur;
      /* normaliza para o caminho mais curto (efeito infinito) */
      if (d > N / 2) d -= N;
      if (d < -N / 2) d += N;
      var ad = Math.min(Math.abs(d), 3);
      var dir = d === 0 ? 0 : (d < 0 ? -1 : 1);
      var x = dir * ad * step;
      var z = -ad * depth - 40;
      var ry = dir * (ad === 0 ? 0 : -44);
      var sc = ad === 0 ? 1 : 0.9;
      el.style.transform =
        'translate(-50%,-50%) translateX(' + x + 'px) translateZ(' + z + 'px) rotateY(' + ry + 'deg) scale(' + sc + ')';
      el.style.opacity = ad > 2 ? 0 : (ad === 2 ? 0.28 : ad === 1 ? 0.75 : 1);
      el.style.zIndex = String(100 - ad);
      el.style.filter = ad === 0
        ? 'none'
        : 'brightness(' + (ad === 1 ? 0.72 : 0.45) + ') saturate(.9)' + (ad >= 2 ? ' blur(2px)' : '');
      el.classList.toggle('is-active', ad === 0);
      el.setAttribute('aria-hidden', ad === 0 ? 'false' : 'true');
      el.style.pointerEvents = ad === 0 ? 'auto' : 'none';
    });
    dots.forEach(function (d, i) { d.classList.toggle('on', i === cur); });
  }

  function go(i) {
    cur = (i % N + N) % N;
    layout();
  }
  function next() { go(cur + 1); }
  function prev() { go(cur - 1); }

  /* autoplay */
  var timer = null;
  function play() {
    stop();
    timer = setInterval(next, 5400);
  }
  function stop() { if (timer) { clearInterval(timer); timer = null; } }
  function restart() { play(); }

  btnNext.addEventListener('click', function () { next(); restart(); });
  btnPrev.addEventListener('click', function () { prev(); restart(); });

  /* pausa com o mouse em cima */
  stage.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') stop(); });
  stage.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse') play(); });

  /* arrastar / swipe */
  var dragX = null, dragged = false;
  stage.addEventListener('pointerdown', function (e) {
    dragX = e.clientX; dragged = false;
    stage.classList.add('dragging');
  });
  window.addEventListener('pointermove', function (e) {
    if (dragX === null) return;
    if (Math.abs(e.clientX - dragX) > 8) dragged = true;
  });
  window.addEventListener('pointerup', function (e) {
    if (dragX === null) return;
    var dx = e.clientX - dragX;
    stage.classList.remove('dragging');
    if (Math.abs(dx) > 42) {
      dx < 0 ? next() : prev();
      restart();
    }
    dragX = null;
  });

  /* teclado */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') { next(); restart(); }
    if (e.key === 'ArrowLeft') { prev(); restart(); }
  });

  window.addEventListener('resize', layout);
  layout();
  play();

  /* ───────────────────────────────────────────────
     CABEÇALHO — efeito de rolagem
  ─────────────────────────────────────────────── */
  var topo = document.getElementById('topo');
  function onScroll() {
    topo.classList.toggle('scrolled', window.scrollY > 40);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ───────────────────────────────────────────────
     MENU MOBILE — fecha ao clicar em link / trava scroll
  ─────────────────────────────────────────────── */
  var navToggle = document.getElementById('nav-toggle');
  var navMenu = document.getElementById('nav-menu');
  navMenu.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () {
      navToggle.checked = false;
      document.body.style.overflow = '';
      document.body.classList.remove('menu-open');
    });
  });
  navToggle.addEventListener('change', function () {
    document.body.style.overflow = navToggle.checked ? 'hidden' : '';
    document.body.classList.toggle('menu-open', navToggle.checked);
  });

  /* ───────────────────────────────────────────────
     REVEAL AO ROLAR
  ─────────────────────────────────────────────── */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) {
        en.target.classList.add('in');
        io.unobserve(en.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });
  /* segurança: garante que nenhum conteúdo fique oculto
     (fallback caso o observer não dispare) */
  setTimeout(function () {
    document.querySelectorAll('.reveal:not(.in)').forEach(function (el) {
      el.classList.add('in');
    });
  }, 3000);

  /* ───────────────────────────────────────────────
     FAQ — acordeão (um aberto por vez)
  ─────────────────────────────────────────────── */
  var faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(function (item) {
    var q = item.querySelector('.faq-q');
    var a = item.querySelector('.faq-a');
    q.addEventListener('click', function () {
      var open = item.classList.contains('open');
      faqItems.forEach(function (it) {
        it.classList.remove('open');
        it.querySelector('.faq-a').style.maxHeight = '0px';
        it.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
      });
      if (!open) {
        item.classList.add('open');
        a.style.maxHeight = a.scrollHeight + 'px';
        q.setAttribute('aria-expanded', 'true');
      }
    });
  });
  /* abre o primeiro por padrão */
  if (faqItems.length) {
    var first = faqItems[0];
    var firstA = first.querySelector('.faq-a');
    first.classList.add('open');
    firstA.style.maxHeight = firstA.scrollHeight + 'px';
    first.querySelector('.faq-q').setAttribute('aria-expanded', 'true');
  }

  /* ───────────────────────────────────────────────
     FORMULÁRIO → WHATSAPP (lead direto)
  ─────────────────────────────────────────────── */
  var form = document.getElementById('form-lead');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var nome = document.getElementById('f-nome').value.trim();
    var fone = document.getElementById('f-fone').value.trim();
    var interesse = document.getElementById('f-interesse').value;
    var valor = document.getElementById('f-valor').value;
    var msg = document.getElementById('f-msg').value.trim();

    if (!nome || !fone) {
      if (!nome) document.getElementById('f-nome').focus();
      else document.getElementById('f-fone').focus();
      return;
    }

    var texto =
      'Olá! Vim pelo site da Consórcio Ribeirão Preto.\n\n' +
      '*Nome:* ' + nome + '\n' +
      '*Telefone/WhatsApp:* ' + fone + '\n' +
      '*Interesse:* ' + interesse + '\n' +
      '*Valor de crédito desejado:* ' + valor;
    if (msg) texto += '\n*Mensagem:* ' + msg;
    texto += '\n\nGostaria de uma simulação.';

    window.open('https://wa.me/' + WHATS + '?text=' + encodeURIComponent(texto), '_blank', 'noopener');
  });

  /* ───────────────────────────────────────────────
     ANO NO RODAPÉ
  ─────────────────────────────────────────────── */
  document.getElementById('ano').textContent = String(new Date().getFullYear());
})();
