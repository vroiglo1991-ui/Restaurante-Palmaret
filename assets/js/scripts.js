/* ══════════════════════════════════════
   scripts.js - El Palmaret
   Arquitectura limpia Vanilla JS (ES6+)
   Sin frameworks pesados, 100% nativo
══════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  /* ──── 1. NAVEGACIÓN & SCROLL ──── */
  const nav = document.getElementById('nav');
  const hamburgerBtn = document.getElementById('hamburger');
  const navMenuEl = document.getElementById('navMenu');

  // Sticky nav class al hacer scroll
  const handleScroll = () => {
    if (nav) {
      nav.classList.toggle('sc', window.scrollY > 50);
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // Menú hamburguesa móvil
  if (hamburgerBtn && navMenuEl) {
    const toggleMenu = (open) => {
      const isOpen = typeof open === 'boolean' ? open : !navMenuEl.classList.contains('active');
      navMenuEl.classList.toggle('active', isOpen);
      if (nav) nav.classList.toggle('menu-open', isOpen);
      hamburgerBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    hamburgerBtn.addEventListener('click', () => toggleMenu());

    navMenuEl.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => toggleMenu(false));
    });
  }

  /* ──── 2. SCROLL REVEAL (IntersectionObserver) ──── */
  const revealElements = document.querySelectorAll('.rv, .rl-left, .rl-right, .rs');
  if ('IntersectionObserver' in window && revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('vis');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('vis'));
  }

  /* ──── 3. CARRUSEL LOCAL (EXPERIENCIA) ──── */
  let lcIdx = 0;
  const lcTrack = document.getElementById('lcTrack');
  const lcSlides = document.querySelectorAll('#lcTrack .lc-slide');

  function lcGo(i) {
    if (lcSlides.length === 0) return;
    lcSlides[lcIdx]?.classList.remove('active');
    lcIdx = (i + lcSlides.length) % lcSlides.length;
    lcSlides[lcIdx]?.classList.add('active');
  }

  // Click o tap en la imagen para pasar a la siguiente
  if (lcTrack) {
    lcTrack.addEventListener('click', () => lcGo(lcIdx + 1));
    lcTrack.style.cursor = 'pointer';

    // Touch swipe
    let lcTouchX = 0;
    lcTrack.addEventListener('touchstart', e => {
      lcTouchX = e.touches[0].clientX;
    }, { passive: true });
    lcTrack.addEventListener('touchend', e => {
      const diff = lcTouchX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) lcGo(lcIdx + (diff > 0 ? 1 : -1));
    }, { passive: true });
  }

  if (lcSlides.length > 1) {
    setInterval(() => lcGo(lcIdx + 1), 5000);
  }

  /* ──── 4. GALERÍA GASTRONÓMICA (Loop infinito + Drag + Progress) ──── */
  const gTrack = document.getElementById('gTrack');
  const gItems = gTrack ? gTrack.querySelectorAll('.g-item') : [];
  const gPrev = document.getElementById('gPrev');
  const gNext = document.getElementById('gNext');
  const gProgressFill = document.getElementById('gProgressFill');
  const gCounterEl = document.getElementById('gCounter');
  const gOuter = gTrack ? gTrack.parentElement : null;
  const TOTAL = gItems.length;
  const GAP = 16;
  let gIndex = 0;

  function gGetItemWidth() {
    const firstItem = gTrack ? gTrack.querySelector('.g-item') : null;
    if (firstItem) {
      return firstItem.getBoundingClientRect().width;
    }
    return 280;
  }

  function gGetOffset(index) {
    const itemW = gGetItemWidth();
    return index * (itemW + GAP);
  }

  function gMaxIndex() {
    if (!gOuter) return 0;
    const itemW = gGetItemWidth();
    const visible = Math.floor((gOuter.offsetWidth + GAP) / (itemW + GAP));
    return Math.max(0, TOTAL - (visible > 0 ? visible : 1));
  }

  function gUpdate(newIndex) {
    if (TOTAL === 0) return;
    // Loop infinito
    const max = gMaxIndex();
    if (newIndex > max) newIndex = 0;
    if (newIndex < 0) newIndex = max;

    gIndex = newIndex;
    if (gTrack) {
      gTrack.style.transform = `translateX(${-gGetOffset(gIndex)}px)`;
    }

    // Progress bar
    if (gProgressFill) {
      const pct = max === 0 ? 100 : (gIndex / max) * 100;
      gProgressFill.style.width = pct + '%';
    }

    // Counter
    if (gCounterEl) {
      const firstVisible = gIndex + 1;
      gCounterEl.innerHTML = `<span class="g-counter-current">${String(firstVisible).padStart(2, '0')}</span> / ${String(TOTAL).padStart(2, '0')}`;
    }
  }

  if (gNext) gNext.addEventListener('click', () => gUpdate(gIndex + 1));
  if (gPrev) gPrev.addEventListener('click', () => gUpdate(gIndex - 1));

  // Touch swipe
  let gTouchStartX = 0;
  if (gTrack) {
    gTrack.addEventListener('touchstart', e => {
      gTouchStartX = e.touches[0].clientX;
    }, { passive: true });

    gTrack.addEventListener('touchend', e => {
      const diff = gTouchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) gUpdate(gIndex + (diff > 0 ? 1 : -1));
    }, { passive: true });
  }

  // Mouse drag
  let gDragging = false, gDragStartX = 0, gDragOffset = 0;
  if (gOuter) {
    gOuter.addEventListener('mousedown', e => {
      gDragging = true;
      gDragStartX = e.clientX;
      gDragOffset = gGetOffset(gIndex);
      gTrack.classList.add('dragging');
      e.preventDefault();
    });

    window.addEventListener('mousemove', e => {
      if (!gDragging) return;
      const delta = gDragStartX - e.clientX;
      gTrack.style.transform = `translateX(${-(gDragOffset + delta)}px)`;
    });

    window.addEventListener('mouseup', e => {
      if (!gDragging) return;
      gDragging = false;
      gTrack.classList.remove('dragging');
      const delta = gDragStartX - e.clientX;
      if (Math.abs(delta) > 50) {
        gUpdate(gIndex + (delta > 0 ? 1 : -1));
      } else {
        gUpdate(gIndex); // snap back
      }
    });
  }

  // Resize
  window.addEventListener('resize', () => gUpdate(gIndex), { passive: true });

  // Init
  gUpdate(0);

  /* ──── 5. VISOR PDF MODAL (CARTA) ──── */
  const PDF_URL = 'https://drive.google.com/file/d/15DYX6gGKPlC3xOkymJNd6td0AcI-LjIC/preview';
  const pdfOverlay = document.getElementById('pdfModalOverlay');
  const pdfBackdrop = document.getElementById('pdfModalBackdrop');
  const pdfCloseBtn = document.getElementById('pdfModalClose');
  const openCartaPdfBtn = document.getElementById('openCartaPdf');
  const heroCartaBtn = document.getElementById('heroCartaBtn');
  const navCartaBtn = document.getElementById('navCartaBtn');
  const pdfFrame = document.getElementById('pdfFrame');
  const pdfLoading = document.getElementById('pdfLoading');

  function openPdfModal(e) {
    if (e) e.preventDefault();
    if (!pdfOverlay) return;

    if (pdfFrame && (!pdfFrame.src || pdfFrame.src === 'about:blank')) {
      pdfFrame.src = PDF_URL;
      pdfFrame.addEventListener('load', function onLoad() {
        if (pdfLoading) pdfLoading.classList.add('hidden');
        pdfFrame.removeEventListener('load', onLoad);
      });
    }

    pdfOverlay.classList.add('active');
    pdfOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closePdfModal() {
    if (!pdfOverlay) return;
    pdfOverlay.classList.remove('active');
    pdfOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (openCartaPdfBtn) openCartaPdfBtn.addEventListener('click', openPdfModal);
  if (heroCartaBtn) heroCartaBtn.addEventListener('click', openPdfModal);
  if (navCartaBtn) navCartaBtn.addEventListener('click', openPdfModal);
  if (pdfBackdrop) pdfBackdrop.addEventListener('click', closePdfModal);
  if (pdfCloseBtn) pdfCloseBtn.addEventListener('click', closePdfModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && pdfOverlay && pdfOverlay.classList.contains('active')) {
      closePdfModal();
    }
  });

  /* ──── 6. SISTEMA I18N (ES / EN / VA) ──── */
  const I18N = {
    es: {
      navExp: 'Experiencia',
      navGal: 'Galería',
      navCarta: 'Carta',
      navReservar: 'Reservar',
      heroEyebrow: 'Restaurante del Club · Valencia',
      heroTitle: 'El mejor <em>tercer tiempo</em> <br> de Valencia.',
      heroSub: 'con alma deportiva',
      heroDesc: 'Unimos el ritmo del club con la calma de la sobremesa mediterránea. El punto de encuentro donde cada momento se celebra con sabor.',
      heroBtnReserve: 'Reservar mesa',
      heroBtnMenu: 'Ver carta →',
      galleryEyebrow: 'Galería gastronómica',
      galleryTitle: 'Imágenes que <br> <em>saben a algo</em>',
      galleryCats: ['La Brasa', 'Entrantes', 'Arroces', 'Dulces', 'Mar', 'Autor', 'Bar', 'Cocina', 'Huerta', 'Tercer Tiempo'],
      galleryNames: ['Cortes premium', 'Nuestras croquetas', 'Fuego y tradición', 'Final artesano', 'Sabor a Mediterráneo', 'Tapas especiales', 'Nuestra coctelería', 'Oficio y técnica', 'De la tierra a la mesa', 'Pinchos y tapeo'],
      expEyebrow: 'Nuestra experiencia',
      expTitle: 'Más que un restaurante, <br> <em>un punto de encuentro</em>',
      expP1: 'En El Palmaret, la tradición valenciana se encuentra con la técnica de vanguardia. Nuestra cocina se basa en el respeto al producto de proximidad y el compromiso con el sabor auténtico.',
      expQuote: '"Nuestra casa es tu casa. Un espacio diseñado para celebrar cada victoria alrededor de la mesa."',
      expP2: 'Desde el crujiente de un buen arroz a leña hasta la delicadeza de nuestras tapas de autor, cada plato está diseñado para ser compartido. Combinamos la agilidad que requiere el entorno deportivo con la pausa y el mimo de un restaurante gourmet.',
      expLabels: ['"Jardín y terraza en el corazón del club"', '"El sabor empieza en la huerta"', '"Un espacio con vistas al club"'],
      parallaxQuote: 'Descubre el entorno. Saborea la huerta.<br><em>Vive la experiencia.</em>',
      serviceEyebrow: 'Servicio 360°',
      serviceTitle: 'Del café del amanecer <br> a la <em>cena de celebración</em>',
      serviceDesc: 'Tu energía, nuestro compromiso. Desde el primer café que enciende la mañana hasta el brindis relajado tras un gran esfuerzo, mimamos cada instante para que te sientas como en casa.',
      serviceCardTitles: ['Desayunos & L\'Esmorzaret', 'Menú Ejecutivo Diario', 'Arroces & Brasas', 'Healthy Performance', 'Cenas de Equipo & Eventos', 'Take-away Deportivo'],
      serviceCardDescs: [
        'Pan de payés con todos los acompañamientos. El ritual matutino valenciano, como debe ser.',
        'Cocina de mercado, producto fresco y rotación diaria para el socio que vive en el club.',
        'Paellas, arroces a leña, carnes y pescados a la brasa. Disponibles por encargo.',
        'Menú especial para deportistas. Platos nutritivos pero gourmet para los que entrenan a diario.',
        'Menús grupales, celebraciones y eventos a medida. Organizamos la victoria contigo.',
        'Cocina de calidad para llevar. Tecnología y agilidad al servicio del deportista en movimiento.'
      ],
      menuEyebrow: 'Nuestra carta',
      menuTitle: 'Tradición valenciana <br> <em>con técnica de vanguardia</em>',
      menuDesc: 'Platos diseñados para compartir. Producto de proximidad, respeto por la temporada y el toque técnico de nuestro equipo. Nuestra carta se renueva cada semana para ofrecerte lo mejor de la temporada.',
      pdfBtn: 'Ver carta',
      pdfModalTitle: 'Carta El Palmaret',
      pdfLoading: 'Cargando carta...',
      pdfDownload: 'Descargar PDF',
      pdfViewDrive: 'Abrir en Drive',
      visionQuote: '"Más que un espacio,<br><em>un futuro.</em>"',
      visionSub: 'Una historia que se cocina a fuego lento',
      visionBtn: 'Sé parte de la historia',
      reserveTitle: 'Reserva tu <br> <em>experiencia</em>',
      reserveDesc: 'Acompáñanos a la mesa. Tanto si vienes a comer con el equipo como a celebrar la victoria, en El Palmaret siempre hay un lugar para ti.',
      infoSchedule: 'Horario',
      infoScheduleVal: 'Lun–Sáb: 8:00–00:00 | Dom: 8:00–16:00',
      infoRice: 'Arroces',
      infoRiceVal: 'Por encargo · Mínimo 2 personas',
      infoGroups: 'Grupos',
      infoGroupsVal: 'Cenas de equipo y eventos a medida',
      btnWhatsapp: 'Escríbenos',
      btnWeb: 'Reserva online',
      labelConfirmation: 'La reserva queda supeditada a la confirmación vía WhatsApp o web.',
      mapTitle: '¿Cómo llegar?',
      mapSub: 'El Palmaret | <em>Restaurante</em>',
      footerTag: 'Sabor mediterráneo<br>con alma deportiva.',
      footerAddr: 'Complejo Deportivo · Valencia<br><a href="tel:+34633960373" style="color:inherit; text-decoration:none;">633 960 373</a>',
      footerHeadings: ['Carta', 'Servicios', 'Reservas', 'Legales'],
      footerMenu: ['Tapeo de autor', 'Arroces y brasas', 'La brasa', 'Healthy performance', 'Postres caseros'],
      footerServices: ['Desayunos', 'Menú ejecutivo', 'Menú deportistas', 'Cenas de equipo', 'Eventos a medida'],
      footerReservas: ['Reservar mesa', 'Grupos', 'Ubicación', 'Galería'],
      footerLegal: ['Aviso Legal', 'Política de Privacidad', 'Política de Cookies'],
      footerCopy: '© 2026 El Palmaret — Todos los derechos reservados',
      footerMotto: 'Una historia que se cocina a fuego lento',
      cookieTitle: 'Configuración de cookies',
      cookieText: 'Utilizamos cookies para asegurar que tengas la mejor experiencia en nuestra web, analizar el tráfico y personalizar el contenido.'
    },
    en: {
      navExp: 'Experience',
      navGal: 'Gallery',
      navCarta: 'Menu',
      navReservar: 'Book',
      heroEyebrow: 'Club Restaurant · Valencia',
      heroTitle: 'The best <em>third time</em> <br> in Valencia.',
      heroSub: 'with a sporting soul',
      heroDesc: 'We blend the club\'s rhythm with the calm of Mediterranean after-dinner talk. The meeting point where every moment is celebrated with flavor.',
      heroBtnReserve: 'Book a table',
      heroBtnMenu: 'See menu →',
      galleryEyebrow: 'Gastronomic gallery',
      galleryTitle: 'Images that <br> <em>taste like something</em>',
      galleryCats: ['The Grill', 'Starters', 'Rice Dishes', 'Desserts', 'Sea', 'Signature', 'Bar', 'Kitchen', 'Orchard', 'Third Time'],
      galleryNames: ['Premium cuts', 'Our croquettes', 'Fire & tradition', 'Artisan finale', 'Mediterranean flavor', 'Special tapas', 'Our cocktails', 'Craft & technique', 'Farm to table', 'Tapas & skewers'],
      expEyebrow: 'Our experience',
      expTitle: 'More than a restaurant, <br> <em>a meeting point</em>',
      expP1: 'At El Palmaret, Valencian tradition meets avant-garde technique. Our cuisine is based on respect for local produce and commitment to authentic flavor.',
      expQuote: '"Our house is your house. A space designed to celebrate every victory around the table."',
      expP2: 'From the crunch of a proper wood-fired rice to the delicacy of our signature tapas, every dish is crafted to be shared.',
      expLabels: ['"Garden and terrace in the heart of the club"', '"Flavor begins in the orchard"', '"A space overlooking the club"'],
      parallaxQuote: 'Discover the surroundings. Taste the garden.<br><em>Live the experience.</em>',
      serviceEyebrow: '360° Service',
      serviceTitle: 'From sunrise coffee <br> to the <em>celebration dinner</em>',
      serviceDesc: 'Your energy, our commitment. From the first morning coffee to the relaxed toast after a big match, we craft every moment to make you feel right at home.',
      serviceCardTitles: ['Breakfast & Brunch', 'Daily Executive Menu', 'Rice & Grill', 'Healthy Performance', 'Team Dinners & Events', 'Sports Take-away'],
      serviceCardDescs: [
        'Artisan country bread with all accompaniments. The traditional Valencian morning ritual.',
        'Market cuisine, fresh seasonal produce and daily rotation for club members and visitors.',
        'Paellas, wood-fired rice dishes, grilled meats and fresh fish. Available by order.',
        'Special menu for athletes. Nutritious gourmet dishes designed for daily training.',
        'Group menus, celebrations and tailor-made events. Celebrate victory with us.',
        'High-quality takeout food. Quick and agile nutrition for athletes on the move.'
      ],
      menuEyebrow: 'Our menu',
      menuTitle: 'Valencian tradition <br> <em>with modern technique</em>',
      menuDesc: 'Dishes designed for sharing. Local produce, seasonal respect and culinary expertise. Our menu is refreshed weekly.',
      pdfBtn: 'See menu',
      pdfModalTitle: 'El Palmaret Menu',
      pdfLoading: 'Loading menu...',
      pdfDownload: 'Download PDF',
      pdfViewDrive: 'Open in Drive',
      visionQuote: '"More than a place,<br><em>a future.</em>"',
      visionSub: 'A story cooked slowly',
      visionBtn: 'Be part of the story',
      reserveTitle: 'Book your <br> <em>experience</em>',
      reserveDesc: 'Join us at the table. Whether you come with the team or to celebrate a victory, there is always a place for you at El Palmaret.',
      infoSchedule: 'Schedule',
      infoScheduleVal: 'Mon–Sat: 8:00–00:00 | Sun: 8:00–16:00',
      infoRice: 'Rice dishes',
      infoRiceVal: 'By order · Minimum 2 people',
      infoGroups: 'Groups',
      infoGroupsVal: 'Team dinners and custom events',
      btnWhatsapp: 'Message us',
      btnWeb: 'Book online',
      labelConfirmation: 'Reservation is subject to confirmation via WhatsApp or web.',
      mapTitle: 'How to find us?',
      mapSub: 'El Palmaret | <em>Restaurant</em>',
      footerTag: 'Mediterranean flavor<br>with a sporting soul.',
      footerAddr: 'Sports Complex · Valencia<br><a href="tel:+34633960373" style="color:inherit; text-decoration:none;">633 960 373</a>',
      footerHeadings: ['Menu', 'Services', 'Reservations', 'Legal'],
      footerMenu: ['Signature tapas', 'Rice & grill', 'The grill', 'Healthy performance', 'Homemade desserts'],
      footerServices: ['Breakfast', 'Executive menu', 'Sports menu', 'Team dinners', 'Tailor-made events'],
      footerReservas: ['Book a table', 'Groups', 'Location', 'Gallery'],
      footerLegal: ['Legal Notice', 'Privacy Policy', 'Cookie Policy'],
      footerCopy: '© 2026 El Palmaret — All rights reserved',
      footerMotto: 'A story cooked slowly',
      cookieTitle: 'Cookie Settings',
      cookieText: 'We use cookies to ensure you get the best experience on our website, analyze traffic and personalize content.'
    },
    va: {
      navExp: 'Experiència',
      navGal: 'Galeria',
      navCarta: 'Carta',
      navReservar: 'Reservar',
      heroEyebrow: 'Restaurant del Club · València',
      heroTitle: 'El millor <em>tercer temps</em> <br> de València.',
      heroSub: 'amb ànima esportiva',
      heroDesc: 'Unim el ritme del club amb la calma de la sobretaula mediterrània. El punt de trobada on cada moment es celebra amb sabor.',
      heroBtnReserve: 'Reservar taula',
      heroBtnMenu: 'Veure carta →',
      galleryEyebrow: 'Galeria gastronòmica',
      galleryTitle: 'Imatges que <br> <em>saben a alguna cosa</em>',
      galleryCats: ['La Brasa', 'Entrants', 'Arrossos', 'Dolços', 'Mar', 'Autor', 'Bar', 'Cuina', 'Horta', 'Tercer Temps'],
      galleryNames: ['Talls premium', 'Les nostres croquetes', 'Foc i tradició', 'Final artesà', 'Sabor a Mediterrani', 'Tapes especials', 'La nostra cocteleria', 'Ofici i tècnica', 'De la terra a la taula', 'Pintxos i tapeig'],
      expEyebrow: 'La nostra experiència',
      expTitle: 'Més que un restaurant, <br> <em>un punt de trobada</em>',
      expP1: 'En El Palmaret, la tradició valenciana es troba amb la tècnica d\'avantguarda. La nostra cuina es basa en el respecte al producte de proximitat i el compromís amb el sabor autèntic.',
      expQuote: '"La nostra casa és la teua casa. Un espai dissenyat per a celebrar cada victòria al voltant de la taula."',
      expP2: 'Des del cruixent d\'un bon arròs a llenya fins a la delicadesa de les nostres tapes d\'autor, cada plat està pensat per a compartir.',
      expLabels: ['"Jardí i terrassa al cor del club"', '"El sabor comença a l\'horta"', '"Un espai amb vistes al club"'],
      parallaxQuote: 'Descobreix l\'entorn. Assaboreix l\'horta.<br><em>Viu l\'experiència.</em>',
      serviceEyebrow: 'Servei 360°',
      serviceTitle: 'Del café de l\'alba <br> al <em>sopar de celebració</em>',
      serviceDesc: 'La teua energia, el nostre compromís. Des del primer café que desperta el matí fins al brindis relaxat després d\'un gran esforç, mimem cada instant perquè et sentes com a casa.',
      serviceCardTitles: ['Desdejunis & L\'Esmorzaret', 'Menú Executiu Diari', 'Arrossos & Brases', 'Healthy Performance', 'Sopars d\'Equip i Esdeveniments', 'Take-away Esportiu'],
      serviceCardDescs: [
        'Pa de pagés amb tots els acompanyaments. El ritual matinal valencià, com toca.',
        'Cuina de mercat, producte fresc i rotació diària per al soci que viu el club.',
        'Paelles, arrossos a llenya, carns i peixos a la brasa. Disponibles per encàrrec.',
        'Menú especial per a esportistes. Plats nutritius però gourmet per als qui entrenen cada dia.',
        'Menús de grup, celebracions i esdeveniments a mida. Organitzem la victòria amb tu.',
        'Cuina de qualitat per a emportar. Tecnologia i agilitat al servei de l\'esportista en moviment.'
      ],
      menuEyebrow: 'La nostra carta',
      menuTitle: 'Tradició valenciana <br> <em>amb tècnica d\'avantguarda</em>',
      menuDesc: 'Plats dissenyats per a compartir. Producte de proximitat, respecte per la temporada i el toc tècnic del nostre equip.',
      pdfBtn: 'Veure carta',
      pdfModalTitle: 'Carta El Palmaret',
      pdfLoading: 'Carregant carta...',
      pdfDownload: 'Descarregar PDF',
      pdfViewDrive: 'Obrir en Drive',
      visionQuote: '"Més que un espai,<br><em>un futur.</em>"',
      visionSub: 'Una història que es cuina a foc lent',
      visionBtn: 'Sigues part de la història',
      reserveTitle: 'Reserva la teua <br> <em>experiència</em>',
      reserveDesc: 'Acompanya\'ns a la taula. Tant si vens a dinar amb l\'equip com a celebrar la victòria, en El Palmaret sempre hi ha un lloc per a tu.',
      infoSchedule: 'Horari',
      infoScheduleVal: 'Dill–Dis: 8:00–00:00 | Diu: 8:00–16:00',
      infoRice: 'Arrossos',
      infoRiceVal: 'Per encàrrec · Mínim 2 persones',
      infoGroups: 'Grups',
      infoGroupsVal: 'Sopars d\'equip i esdeveniments a mida',
      btnWhatsapp: 'Escriu-nos',
      btnWeb: 'Reserva online',
      labelConfirmation: 'La reserva queda supeditada a la confirmació via WhatsApp o web.',
      mapTitle: 'Com arribar?',
      mapSub: 'El Palmaret | <em>Restaurant</em>',
      footerTag: 'Sabor mediterrani<br>amb ànima esportiva.',
      footerAddr: 'Complex Esportiu · València<br><a href="tel:+34633960373" style="color:inherit; text-decoration:none;">633 960 373</a>',
      footerHeadings: ['Carta', 'Serveis', 'Reserves', 'Legals'],
      footerMenu: ['Tapeig d\'autor', 'Arrossos i brases', 'La brasa', 'Healthy performance', 'Postres casolans'],
      footerServices: ['Desdejunis', 'Menú executiu', 'Menú esportistes', 'Sopars d\'equip', 'Esdeveniments a mida'],
      footerReservas: ['Reservar taula', 'Grups', 'Ubicació', 'Galeria'],
      footerLegal: ['Avís Legal', 'Política de Privacitat', 'Política de Cookies'],
      footerCopy: '© 2026 El Palmaret — Tots els drets reservats',
      footerMotto: 'Una història que es cuina a foc lent',
      cookieTitle: 'Configuració de cookies',
      cookieText: 'Utilitzem cookies per a assegurar que tingues la millor experiència en la nostra web, analitzar el tràfic i personalitzar el contingut.'
    }
  };

  let currentLang = localStorage.getItem('palmaretLang') || 'es';
  const langButtons = document.querySelectorAll('.lang-btn');

  function setElText(selector, value, isHtml = false) {
    const el = document.querySelector(selector);
    if (!el || value == null) return;
    if (isHtml) el.innerHTML = value;
    else el.textContent = value;
  }

  function setElList(selector, values) {
    document.querySelectorAll(selector).forEach((el, idx) => {
      if (values && values[idx] != null) {
        el.textContent = values[idx];
      }
    });
  }

  function applyLanguage(lang) {
    if (!I18N[lang]) return;
    currentLang = lang;
    localStorage.setItem('palmaretLang', lang);
    document.documentElement.lang = lang === 'va' ? 'ca' : lang;

    langButtons.forEach(btn => {
      const active = btn.dataset.lang === lang;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });

    const dict = I18N[lang];
    setElText('#navMenu li:nth-child(1) a', dict.navExp);
    setElText('#navMenu li:nth-child(2) a', dict.navGal);
    setElText('#navMenu li:nth-child(3) a', dict.navCarta);
    setElText('#navMenu li:nth-child(4) a', dict.navReservar);

    setElText('.hey', dict.heroEyebrow);
    setElText('.hh1', dict.heroTitle, true);
    setElText('.hh1s', dict.heroSub);
    setElText('.hdes', dict.heroDesc);
    setElText('.hact .bp', dict.heroBtnReserve);
    setElText('.hact .bg', dict.heroBtnMenu);

    // Galería gastronómica
    setElText('#galeria .g-eyebrow', dict.galleryEyebrow);
    setElText('#galeria .g-title', dict.galleryTitle, true);
    setElList('#galeria .g-item-cat', dict.galleryCats);
    setElList('#galeria .g-item-name', dict.galleryNames);

    // Experiencia
    setElText('#experiencia .ey', dict.expEyebrow);
    setElText('#experiencia .st', dict.expTitle, true);
    setElText('#experiencia .et p:nth-of-type(1)', dict.expP1);
    setElText('#experiencia .eq p', dict.expQuote);
    setElText('#experiencia .et p:nth-of-type(2)', dict.expP2);
    setElList('#experiencia .lc-label p', dict.expLabels);
    setElText('.pq-text', dict.parallaxQuote, true);

    // Servicios
    setElText('#servicio .ey', dict.serviceEyebrow);
    setElText('#servicio .st', dict.serviceTitle, true);
    setElText('#servicio .srv-header p', dict.serviceDesc);
    setElList('#servicio .sc2 h3', dict.serviceCardTitles);
    setElList('#servicio .sc2 p', dict.serviceCardDescs);

    // Carta
    setElText('#carta .ey', dict.menuEyebrow);
    setElText('#carta .st', dict.menuTitle, true);
    setElText('#carta .carta-premium-desc', dict.menuDesc);
    setElText('#openCartaPdf .pdf-btn-text', dict.pdfBtn);
    setElText('.pdf-modal .pdf-modal-title span', dict.pdfModalTitle);
    setElText('#pdfLoading span', dict.pdfLoading);
    setElText('.pdf-modal-download span', dict.pdfDownload);
    setElText('.pdf-modal-fullscreen span', dict.pdfViewDrive);

    // Visión
    setElText('.vis-q', dict.visionQuote, true);
    setElText('.vis-sub', dict.visionSub);
    setElText('.vis-inner .bp', dict.visionBtn);

    // Reserva
    setElText('#reserva .rl h2', dict.reserveTitle, true);
    setElText('#reserva .rl p', dict.reserveDesc);
    setElText('#reserva .il .ir:nth-child(1) strong', dict.infoSchedule);
    setElText('#reserva .il .ir:nth-child(1) span', dict.infoScheduleVal);
    setElText('#reserva .il .ir:nth-child(2) strong', dict.infoRice);
    setElText('#reserva .il .ir:nth-child(2) span', dict.infoRiceVal);
    setElText('#reserva .il .ir:nth-child(3) strong', dict.infoGroups);
    setElText('#reserva .il .ir:nth-child(3) span', dict.infoGroupsVal);

    setElText('#btnWhatsappReserva .rs-ch-name', dict.btnWhatsapp);
    setElText('#btnWebReserva .rs-ch-name', dict.btnWeb);
    setElText('.r-note', dict.labelConfirmation);

    // Ubicación
    setElText('#ubicacion .ey', dict.mapTitle);
    setElText('#ubicacion .map-title', dict.mapSub, true);

    // Footer
    setElText('.ftag', dict.footerTag, true);
    setElText('.fadr', dict.footerAddr, true);
    setElList('.fg2 > div:nth-child(n+2) .fct', dict.footerHeadings);
    setElList('.fg2 > div:nth-child(2) .fli a', dict.footerMenu);
    setElList('.fg2 > div:nth-child(3) .fli a', dict.footerServices);
    setElList('.fg2 > div:nth-child(4) .fli a', dict.footerReservas);
    setElList('.fg2 > div:nth-child(5) .fli a', dict.footerLegal);
    setElText('.fb2 span', dict.footerCopy);
    setElText('.fb2 em', dict.footerMotto);

    // Cookies
    setElText('#cookieTitle', dict.cookieTitle);
    setElText('#cookieText', dict.cookieText);
  }

  langButtons.forEach(btn => {
    btn.addEventListener('click', () => applyLanguage(btn.dataset.lang));
  });
  applyLanguage(currentLang);

  /* ──── 7. COOKIE CONSENT (RGPD) ──── */
  const consentEl = document.getElementById('cookieConsent');
  const acceptBtn = document.getElementById('cookieAccept');
  const rejectBtn = document.getElementById('cookieReject');
  const settingsBtn = document.getElementById('cookieSettings');
  const ccMain = document.getElementById('ccMain');
  const ccPanel = document.getElementById('ccPanel');
  const ccBack = document.getElementById('ccBack');
  const ccSave = document.getElementById('ccSave');

  if (consentEl && !localStorage.getItem('palmaretCookieConsent')) {
    setTimeout(() => {
      consentEl.classList.add('show');
    }, 1800);
  }

  const closeConsent = (val) => {
    localStorage.setItem('palmaretCookieConsent', val);
    if (consentEl) consentEl.classList.remove('show');
  };

  if (acceptBtn) acceptBtn.addEventListener('click', () => closeConsent('true'));
  if (rejectBtn) rejectBtn.addEventListener('click', () => closeConsent('false'));

  if (settingsBtn && ccMain && ccPanel) {
    settingsBtn.addEventListener('click', () => {
      ccMain.style.display = 'none';
      ccPanel.style.display = 'block';
    });
  }

  if (ccBack && ccMain && ccPanel) {
    ccBack.addEventListener('click', () => {
      ccPanel.style.display = 'none';
      ccMain.style.display = 'block';
    });
  }

  if (ccSave) {
    ccSave.addEventListener('click', () => {
      const analytics = document.getElementById('toggleAnalytics')?.checked ? 'true' : 'false';
      const marketing = document.getElementById('toggleMarketing')?.checked ? 'true' : 'false';
      localStorage.setItem('palmaretCookieConsent', 'custom');
      localStorage.setItem('palmaretCookieAnalytics', analytics);
      localStorage.setItem('palmaretCookieMarketing', marketing);
      if (consentEl) consentEl.classList.remove('show');
    });
  }

  /* ──── 8. CURSOR & BOTONES MAGNÉTICOS (DESKTOP) ──── */
  const cDot = document.querySelector('.cursor-dot');
  const cRing = document.querySelector('.cursor-ring');

  if (cDot && cRing && window.matchMedia('(pointer: fine)').matches) {
    window.addEventListener('mousemove', e => {
      cDot.style.left = e.clientX + 'px';
      cDot.style.top = e.clientY + 'px';
      cRing.style.left = e.clientX + 'px';
      cRing.style.top = e.clientY + 'px';
    }, { passive: true });

    const addHover = () => {
      cDot.classList.add('hover');
      cRing.classList.add('hover');
    };
    const remHover = () => {
      cDot.classList.remove('hover');
      cRing.classList.remove('hover');
    };

    document.querySelectorAll('a, button, .g-item, .sc2').forEach(el => {
      el.addEventListener('mouseenter', addHover);
      el.addEventListener('mouseleave', remHover);
    });

    document.querySelectorAll('.bp, .ncta').forEach(btn => {
      btn.addEventListener('mousemove', e => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0px, 0px)';
      });
    });
  }

  /* ──── 9. SMOOTH SCROLL (Nativo CSS — sin librerías pesadas) ──── */
  // scroll-behavior: smooth ya está definido en html {} dentro de main.css.
  // No se necesita Lenis ni ninguna librería de scroll.
});

/* ──── 10. OCULTAR LOADER ──── */
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('hide');
  }, 900);
});
