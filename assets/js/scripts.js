/* ══════════════════════════════════════
   scripts.js - El Palmaret
   Extraido de index.html - Abril 2026
   Incluye: Nav, Carruseles, Galeria,
            Carta/Filtros, Traductor,
            Scroll Reveal, Cookie Consent
══════════════════════════════════════ */

/* ── JSON-LD / Schema (en head, no extraido) ── */
    // ──── NAV SCROLL
    const nav = document.getElementById('nav');
    window.addEventListener('scroll', () => nav.classList.toggle('sc', window.scrollY > 60));

    // ──── SCROLL REVEAL (IntersectionObserver)
    const obs = new IntersectionObserver(es => {
      es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('vis'); obs.unobserve(e.target); } });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
    document.querySelectorAll('.rv, .rl-left, .rl-right, .rs, .cat-block').forEach(el => obs.observe(el));

    // Hero Carousel Eliminado

    // ──── LOCAL CAROUSEL (experiencia)
    let lcIdx = 0;
    const lcSlides = document.querySelectorAll('#lcTrack .lc-slide');
    const lcDots = document.querySelectorAll('#lcDots .lc-dot');
    function lcGo(i) {
      lcSlides[lcIdx].classList.remove('active');
      lcDots[lcIdx].classList.remove('active');
      lcIdx = (i + lcSlides.length) % lcSlides.length;
      lcSlides[lcIdx].classList.add('active');
      lcDots[lcIdx].classList.add('active');
    }
    lcDots.forEach((d, i) => d.addEventListener('click', () => lcGo(i)));
    setInterval(() => lcGo(lcIdx + 1), 5500);

    // ──── GALERÍA GASTRONÓMICA CAROUSEL
    const ITEM_WIDTHS = [320, 240, 280, 240, 320, 280, 400]; // 7 items
    const GAP = 8;
    let gIndex = 0;
    const gTrack = document.getElementById('gTrack');
    const gDots = document.querySelectorAll('#gIndicator .g-dot');

    function gIsMobile() { return window.innerWidth <= 768; }
    function gGetPerPage() { return gIsMobile() ? 1 : 2; }

    function gGetOffset(index) {
      if (gIsMobile()) {
        const itemW = window.innerWidth * 0.85;
        const gap = 12;
        // Posición del item con respecto al track (sin padding track)
        const itemPos = index * (itemW + gap);
        // Queremos que el itemPos + itemW/2 sea el centro del viewport
        // offset = itemPos - (viewport/2 - itemW/2)
        const centerOffset = (window.innerWidth - itemW) / 2;
        return itemPos - centerOffset;
      }
      let total = 0;
      for (let i = 0; i < index; i++) total += (ITEM_WIDTHS[i] || 300) + GAP;
      return total;
    }

    function gUpdate(newIndex) {
      const numItems = ITEM_WIDTHS.length;
      
      // Loop infinito wrap-around
      if (newIndex >= numItems) newIndex = 0;
      if (newIndex < 0) newIndex = numItems - 1;

      if (gDots.length > 0) {
        gDots.forEach(d => d.classList.remove('active'));
        if (gDots[newIndex]) gDots[newIndex].classList.add('active');
      }

      gIndex = newIndex;
      if (gTrack) {
        const offset = gGetOffset(gIndex);
        gTrack.style.transform = `translateX(${-offset}px)`;
      }
    }

    if (document.getElementById('gNext')) {
      document.getElementById('gNext').addEventListener('click', () => gUpdate(gIndex + gGetPerPage()));
      document.getElementById('gPrev').addEventListener('click', () => gUpdate(gIndex - gGetPerPage()));
    }

    gDots.forEach((d, i) => d.addEventListener('click', () => gUpdate(i)));

    // Touch/swipe support
    let gTouchStart = 0;
    if (gTrack) {
      gTrack.addEventListener('touchstart', e => { gTouchStart = e.touches[0].clientX; }, { passive: true });
      gTrack.addEventListener('touchend', e => {
        const diff = gTouchStart - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 40) gUpdate(gIndex + (diff > 0 ? 1 : -1));
      });
    }

    window.addEventListener('resize', () => {
      if (gTrack) gTrack.style.transform = `translateX(-${gGetOffset(gIndex)}px)`;
    });

    // ──── CARTA FILTERS
    const cfBtns = document.querySelectorAll('.cf-btn');
    const catBlocks = document.querySelectorAll('.cat-block');
    cfBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        cfBtns.forEach(b => b.classList.remove('act'));
        btn.classList.add('act');
        const cat = btn.dataset.cat;
        catBlocks.forEach(block => {
          if (cat === 'all') {
            if (block.dataset.category === 'compartir') {
              block.setAttribute('data-hidden', 'true');
              block.style.display = 'none';
            } else {
              block.removeAttribute('data-hidden');
              block.style.display = '';
            }
          } else {
            const cats = (block.dataset.category || '').split(' ');
            if (cats.includes(cat)) {
              block.removeAttribute('data-hidden');
              block.style.display = '';
            } else {
              block.setAttribute('data-hidden', 'true');
              block.style.display = 'none';
            }
          }
        });
        // Re-observe newly visible blocks
        document.querySelectorAll('.cat-block:not([data-hidden])').forEach(el => {
          if (!el.classList.contains('vis')) obs.observe(el);
        });
      });
    });

    // ──── SMOOTH SCROLL (offset = altura real del nav)
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        const href = a.getAttribute('href');
        if (href === '#') return;
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          const navEl = document.getElementById('nav');
          const navHeight = navEl ? navEl.getBoundingClientRect().height : 0;
          const targetTop = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
          window.scrollTo({ top: targetTop, behavior: 'smooth' });
        }
      });
    });

    // ──── IDIOMAS (ES / EN / VA)
    const I18N = {
      es: {
        navExp: 'Experiencia', navGal: 'Galería', navCarta: 'Carta', navEquipo: 'Equipo', navReservar: 'Reservar',
        heroEyebrow: 'El Palmaret | Restaurante · Valencia',
        heroTitle: 'El mejor <em>tercer tiempo</em><br>de Valencia.',
        heroSub: 'con alma deportiva',
        heroDesc: 'Unimos el ritmo del club con la calma de la sobremesa mediterránea. El punto de encuentro donde cada momento se celebra con sabor.',
        heroBtnReserve: 'Reservar mesa', heroBtnMenu: 'Ver carta →',
        teamTitle: 'Nuestro equipo',
        reserveTitle: 'Reserva tu<br><em>experiencia</em>',
        reserveDesc: 'Acompáñanos a la mesa. Tanto si vienes a comer con el equipo como a celebrar la victoria, en El Palmaret siempre hay un lugar para ti.',
        infoSchedule: 'Horario', infoScheduleVal: 'Mie–Sáb: 8:00–00:00 | Dom: 8:00–16:00',
        infoRice: 'Arroces', infoRiceVal: 'Por encargo · Mínimo 2 personas',
        infoGroups: 'Grupos', infoGroupsVal: 'Cenas de equipo y eventos a medida',
        infoContact: 'Contacto',
        algTitle: 'Leyenda de <em>Alérgenos</em>',
        algDesc: 'Conforme al Reglamento (UE) 1169/2011. Si tiene alguna alergia o intolerancia, consulte con nuestro equipo. Todos nuestros platos pueden contener trazas.',
        algInfo: 'Información obligatoria',
        algWarning: 'Todos nuestros platos pueden contener trazas de los alérgenos indicados. Si tiene alguna alergia o intolerancia alimentaria, informe a nuestro personal. Su seguridad es nuestra prioridad.',
        mapTitle: '¿Cómo llegar?',
        mapSub: 'El Palmaret | Restaurante · Valencia',
        formTitle: 'Hablemos',
        formSubtitle: 'Gestionamos cada reserva de forma personal para que tu experiencia empiece desde el primer contacto.',
        btnWhatsapp: 'Escribir ahora',
        btnPhone: 'Llamar ahora',
        labelConfirmation: 'La reserva queda supeditada a la confirmación por WhatsApp o teléfono.',
        footerTag: 'Sabor mediterráneo<br>con alma deportiva.',
        footerAddr: 'Complejo Deportivo · Valencia<br>restaurante@elpalmaret.com',
        fCarta: 'Carta', fServicios: 'Servicios', fReservas: 'Reservas',
        fMenu1: 'Tapeo de autor', fMenu2: 'Arroces y brasas', fMenu3: 'La brasa', fMenu4: 'Healthy performance', fMenu5: 'Postres caseros',
        fServ1: 'Desayunos', fServ2: 'Menú ejecutivo', fServ3: 'Menú deportistas', fServ4: 'Cenas de equipo', fServ5: 'Eventos a medida',
        fRes1: 'Reservar mesa', fRes2: 'Grupos', fRes3: 'Nuestro equipo', fRes4: 'Galería',
        copy: '© 2026 El Palmaret — Todos los derechos reservados',
        slogan: 'Una historia que se cocina a fuego lento',
        galleryEyebrow: 'Galería gastronómica',
        galleryTitle: 'Imágenes que<br><em>saben a algo</em>',
        expEyebrow: 'Nuestra experiencia',
        expTitle: 'Más que un restaurante,<br><em>un punto de encuentro</em>',
        expP1: 'En El Palmaret, la tradición valenciana se encuentra con la técnica de vanguardia. Nuestra cocina se basa en el respeto al producto de proximidad y el compromiso con el sabor auténtico.',
        expQuote: '"Somos el sabor de la victoria y el confort del tercer tiempo."',
        expP2: 'Desde el crujiente de un buen arroz a leña hasta la delicadeza de nuestras tapas de autor, cada plato está diseñado para ser compartido. Combinamos la agilidad que requiere el entorno deportivo con la pausa y el mimo de un restaurante gourmet.',
        parallaxQuote: 'Descubre el entorno. Saborea la huerta.<br><em>Vive la experiencia.</em>',
        serviceEyebrow: 'Servicio 360°',
        serviceTitle: 'Del café del amanecer<br>a la <em>cena de celebración</em>',
        serviceDesc: 'Tu energía, nuestro compromiso. Desde el primer café que enciende la mañana hasta el brindis relajado tras un gran esfuerzo, mimamos cada instante para que te sientas como en casa.',
        serviceCardTitles: ['Desayunos & L\'Esmorzaret', 'Menú Ejecutivo Diario', 'Arroces & Brasas', 'Healthy Performance', 'Cenas de Equipo & Eventos', 'Take-away Deportivo'],
        serviceCardDescs: ['Pan de payés con todos los acompañamientos. El ritual matutino valenciano, como debe ser.', 'Cocina de mercado, producto fresco y rotación diaria para el socio que vive en el club.', 'Paellas, arroces a leña, carnes y pescados a la brasa. Disponibles por encargo.', 'Menú especial para deportistas. Platos nutritivos pero gourmet para los que entrenan a diario.', 'Menús grupales, celebraciones y eventos a medida. Organizamos la victoria contigo.', 'Cocina de calidad para llevar. Tecnología y agilidad al servicio del deportista en movimiento.'],
        menuEyebrow: 'Nuestra carta',
        menuTitle: 'Tradición valenciana<br><em>con técnica de vanguardia</em>',
        menuDesc: 'Platos diseñados para compartir. Producto de proximidad, respeto por la temporada y el toque técnico de nuestro equipo. Los precios incluyen IVA.',
        sharingTitle: 'Menú para compartir',
        sharingDesc: 'La experiencia completa de El Palmaret. Platos diseñados para disfrutar entre todos en la mesa. Mesa completa.',
        sharingPrice1: 'sin bebida / p',
        sharingPrice2: 'con bebida / p',
        sharingList: ['Tartar de atún rojo y aguacate', 'Ensaladilla rusa de la casa', 'Croquetas de jamón ibérico (2ud)', 'Flor de alcachofa con trufa y sal de jamón', 'Arroz de la temporada', 'Postre casero a elegir'],
        algNames: ['Gluten', 'Crustáceos', 'Huevos', 'Pescado', 'Cacahuetes', 'Soja', 'Lácteos', 'Frutos Cáscara', 'Apio', 'Mostaza', 'Sésamo', 'Sulfitos', 'Altramuces', 'Moluscos'],
        filterLabels: ['Toda la carta', 'Desayunos', 'Almuerzos', 'Ensaladas', 'Tapas frías', 'Tapas calientes', 'Bocadillos', 'Arroces', 'Carnes', 'Postres', 'Bebidas', 'Cafés'],
        categoryTitles: ['Desayunos', 'Almuerzo Popular', 'Ensaladas', 'Tapas frías', 'Tapas calientes', 'Bocadillos & Tostas', 'Arroces & Fideuàs', 'Nuestras Carnes', 'Postres caseros', 'Bebidas', 'Cafés e infusiones'],
        categorySubtitles: ['Empieza el día con energía', 'El ritual valenciano de media mañana', 'Frescas y de temporada', 'Para empezar bien', 'Del fuego a la mesa', 'Nuestros clásicos en pan artesano', 'Por encargo · Mínimo 2 personas', 'Cortes premium a la brasa', 'El toque dulce de nuestra cocina', 'Refrescos y cervezas', 'El toque final'],
        categoryBadges: ['Hasta las 12h', 'De 9:00 a 11:30', 'ADN Valenciano'],
        featuredLabels: ['La estrella', 'Productos de la tierra', 'Icónico', 'De siempre', 'Estrella de la casa', 'Imprescindible', 'De siempre'],
        featuredNames: ['Paella de pollo y conejo', 'Arroz de secreto, boletus y ajos tiernos', 'Tiramisú de horchata y fartons', 'Torrija con helado de horchata', 'Tartar de atún rojo y aguacate', 'Flor de alcachofa, sal de jamón y trufa', 'Ensaladilla rusa de la casa'],
        featuredDescs: ['Receta tradicional valenciana cocinada con leña de naranjo.', '', 'Nuestra reinterpretación del clásico con horchata de chufa valenciana, mascarpone y fartons tostados.', 'Pan brioche caramelizado, crema inglesa y helado artesano de horchata de Carpesa.', 'Atún del Mediterráneo, aguacate cremoso, ikura, aceite de sésamo y wasabi. Servido frío sobre base de jengibre.', 'Alcachofa de la terreta asada en flor, aceite de trufa negra y sal de jamón ibérico. La elegancia del producto de proximidad.', 'Receta propia de Esteve. Patata, zanahoria, guisantes y mayonesa artesana. La referencia del tapeo valenciano.'],
        visionQuote: '"Más que un espacio,<br><em>un futuro.</em>"',
        visionSub: 'Una historia que se cocina a fuego lento',
        visionBtn: 'Sé parte de la historia',
        teamMainTitle: 'La apuesta que<br><em>lo hace posible</em>',
        teamRole1: 'Supervisor Gerente · Creative Chef',
        teamBio1: 'Formado en Canalla Bistro (Ricard Camarena), Restaurante Vertical y cocinas de Noruega. Lidera la visión creativa de El Palmaret con una filosofía sin fronteras y con todo el alma.',
        teamRole2: 'Jefe de Cocina',
        teamBio2: 'Especialista en arroces valencianos. Con paso por La Favorita, Sagardi y Miss Sushi. El dominio del fuego y el producto local son su sello. La paella en sus manos es una declaración de amor.',
        msgMissing: 'Completa todos los campos antes de enviar.',
        msgNoSlots: (remaining, hora) => `No hay disponibilidad para ese horario. Quedan ${remaining} plazas para las ${hora}.`,
        msgSending: 'Enviando reserva...',
        msgSuccess: '¡Reserva recibida! Te confirmaremos pronto por email.',
        msgError: 'No se pudo enviar la reserva ahora mismo. Inténtalo de nuevo en unos minutos.',
        cookieTitle: 'Configuración de cookies',
        cookieText: 'Utilizamos cookies para asegurar que tengas la mejor experiencia en nuestra web, analizar el tráfico y personalizar el contenido.',
        cookieAccept: 'Aceptar todas',
        cookieReject: 'Rechazar todas',
        cookieSettings: 'Gestionar preferencias'
      },
      en: {
        navExp: 'Experience', navGal: 'Gallery', navCarta: 'Menu', navEquipo: 'Team', navReservar: 'Book',
        heroEyebrow: 'Club Restaurant · Valencia',
        heroTitle: 'The best <em>third time</em><br>in Valencia.',
        heroSub: 'with a sporting soul',
        heroDesc: 'We blend the club\'s rhythm with the calm of Mediterranean after-dinner talk. The meeting point where every moment is celebrated with flavor.',
        heroBtnReserve: 'Book a table', heroBtnMenu: 'See menu →',
        teamTitle: 'Our team',
        reserveTitle: 'Book your<br><em>experience</em>',
        reserveDesc: 'Join us at the table. Whether you come for a team lunch or a victory dinner, there is always a place for you at El Palmaret.',
        infoSchedule: 'Schedule', infoScheduleVal: 'Wed–Sat: 8:00–00:00 | Sun: 8:00–16:00',
        infoRice: 'Rice dishes', infoRiceVal: 'By order · Minimum 2 people',
        infoGroups: 'Groups', infoGroupsVal: 'Team dinners and tailor-made events',
        infoContact: 'Contact',
        algTitle: '<em>Allergen</em> legend',
        algDesc: 'In accordance with Regulation (EU) 1169/2011. If you have any allergies or intolerances, please consult our team. All our dishes may contain traces.',
        algInfo: 'Mandatory information',
        algWarning: 'All our dishes may contain traces of the indicated allergens. If you have any food allergy or intolerance, please inform our staff. Your safety is our priority.',
        mapTitle: 'How to find us?',
        mapSub: 'El Palmaret | Restaurant · Valencia',
        formTitle: 'Let\'s talk',
        formSubtitle: 'We manage every reservation personally so your experience starts with the very first message.',
        btnWhatsapp: 'Write now',
        btnPhone: 'Call now',
        labelConfirmation: 'Reservations are subject to confirmation via WhatsApp or phone.',
        footerTag: 'Mediterranean flavor<br>with a sporting soul.',
        footerAddr: 'Sports Complex · Valencia<br>restaurante@elpalmaret.com',
        fCarta: 'Menu', fServicios: 'Services', fReservas: 'Bookings',
        fMenu1: 'Signature tapas', fMenu2: 'Rice & grill', fMenu3: 'The grill', fMenu4: 'Healthy performance', fMenu5: 'Homemade desserts',
        fServ1: 'Breakfast', fServ2: 'Executive menu', fServ3: 'Athlete menu', fServ4: 'Team dinners', fServ5: 'Custom events',
        fRes1: 'Book a table', fRes2: 'Groups', fRes3: 'Our team', fRes4: 'Gallery',
        copy: '© 2026 El Palmaret — All rights reserved',
        slogan: 'A story cooked slowly',
        galleryEyebrow: 'Gastronomic gallery',
        galleryTitle: 'Images that<br><em>taste like something</em>',
        expEyebrow: 'Our experience',
        expTitle: 'More than a restaurant,<br><em>a meeting point</em>',
        expP1: 'At El Palmaret, Valencian tradition meets cutting-edge technique. Our cuisine is based on respect for local produce and a commitment to authentic flavor.',
        expQuote: '"We are the taste of victory and the comfort of the third half."',
        expP2: 'From the crunch of a proper wood-fired rice to the delicacy of our signature tapas, every dish is designed to be shared. We combine the agility required by the sports environment with the calm and care of a gourmet restaurant.',
        parallaxQuote: 'Discover the surroundings. Taste the garden.<br><em>Live the experience.</em>',
        serviceEyebrow: '360° Service',
        serviceTitle: 'From early coffee<br>to a <em>celebration dinner</em>',
        serviceDesc: 'Your energy, our commitment. From the first coffee that kickstarts the morning to the relaxed toast after a great effort, we craft every moment to make you feel right at home.',
        serviceCardTitles: ['Breakfast & Valencian Brunch', 'Daily Executive Menu', 'Rice & Grill', 'Healthy Performance', 'Team Dinners & Events', 'Sports Takeaway'],
        serviceCardDescs: ['Country bread with all accompaniments. The Valencian morning ritual, as it should be.', 'Market cuisine, fresh produce and daily rotation for members who live around the club.', 'Paellas, wood-fired rice, grilled meats and fish. Available by order.', 'Special menu for athletes. Nutritious yet gourmet dishes for daily training.', 'Group menus, celebrations and tailor-made events. We help you celebrate the win.', 'Quality food to go. Technology and agility for athletes on the move.'],
        menuEyebrow: 'Our menu',
        menuTitle: 'Valencian tradition<br><em>with avant-garde technique</em>',
        menuDesc: 'Dishes designed for sharing. Local produce, seasonal respect and our team\'s technical touch. Prices include VAT.',
        sharingTitle: 'Sharing Menu',
        sharingDesc: 'The complete El Palmaret experience. Dishes designed to be enjoyed by everyone at the table. Full table only.',
        sharingPrice1: 'without drinks / p',
        sharingPrice2: 'with drinks / p',
        sharingList: ['Bluefin tuna and avocado tartare', 'House Russian salad', 'Iberian ham croquettes (2pcs)', 'Artichoke flower with truffle and ham salt', 'Seasonal rice dish', 'Homemade dessert of your choice'],
        algNames: ['Gluten', 'Crustaceans', 'Eggs', 'Fish', 'Peanuts', 'Soy', 'Dairy', 'Nuts', 'Celery', 'Mustard', 'Sesame', 'Sulphites', 'Lupin', 'Molluscs'],
        filterLabels: ['Full menu', 'Breakfast', 'Brunch', 'Salads', 'Cold tapas', 'Hot tapas', 'Sandwiches', 'Rice', 'Meat', 'Desserts', 'Drinks', 'Coffee'],
        categoryTitles: ['Breakfast', 'Popular Brunch', 'Salads', 'Cold Tapas', 'Hot Tapas', 'Sandwiches & Toasts', 'Rice & Fideua', 'Our Meats', 'Homemade Desserts', 'Drinks', 'Coffee & Infusions'],
        categorySubtitles: ['Start your day with energy', 'The Valencian mid-morning ritual', 'Fresh and seasonal', 'A great start', 'From the fire to the table', 'Our classics on artisan bread', 'Our specialty on wood fire', 'Premium grilled cuts', 'The sweet touch of our kitchen', 'Sodas and beers', 'The final touch'],
        categoryBadges: ['Until 12:00', '9:00 to 11:30', 'Valencian ADN'],
        featuredLabels: ['The star', 'Sea and mountain', 'Iconic', 'Classic', 'House signature', 'Must-try', 'Classic'],
        featuredNames: ['Traditional Valencian chicken and rabbit paella', 'Iberian pork rice with garlic shoots and boletus', 'Horchata tiramisu with fartons', 'French toast with horchata ice cream', 'Bluefin tuna and avocado tartare', 'Artichoke flower, ham salt and truffle', 'House Russian salad'],
        featuredDescs: ['Traditional recipe. D.O. Valencia rice, free-range chicken, rabbit, garrofó beans, green beans and saffron. Wood-fired.', 'Acorn-fed Iberian pork, seasonal boletus edulis, garlic shoots and white truffle oil.', 'Our reinterpretation of the classic with Valencian tiger-nut horchata, mascarpone and toasted fartons.', 'Caramelized brioche, anglaise cream and artisan Carpesa horchata ice cream.', 'Mediterranean tuna, creamy avocado, ikura, sesame oil and wasabi. Served chilled over ginger.', 'Local artichoke roasted as a flower, black truffle oil and Iberian ham salt. Elegant local produce.', 'Esteve\'s own recipe. Potato, carrot, peas and artisan mayo. A Valencian tapas benchmark.'],
        visionQuote: '"More than a place,<br><em>a future.</em>"',
        visionSub: 'A story cooked slowly',
        visionBtn: 'Be part of the story',
        teamMainTitle: 'The commitment<br><em>that makes it possible</em>',
        teamRole1: 'General Manager · Creative Chef',
        teamBio1: 'Trained at Canalla Bistro (Ricard Camarena), Restaurante Vertical and kitchens in Norway. He leads El Palmaret\'s creative vision with a borderless philosophy and full soul.',
        teamRole2: 'Head Chef',
        teamBio2: 'Specialist in Valencian rice dishes. Experience at La Favorita, Sagardi and Miss Sushi. Mastery of fire and local produce is his hallmark. In his hands, paella is a declaration of love.',
        msgMissing: 'Please complete all fields before submitting.',
        msgNoSlots: (remaining, hora) => `No availability for this time slot. ${remaining} seats left for ${hora}.`,
        msgSending: 'Sending booking...',
        msgSuccess: 'Booking received! We will confirm soon by email.',
        msgError: 'We could not send your booking right now. Please try again in a few minutes.',
        cookieTitle: 'Cookie Settings',
        cookieText: 'We use cookies to ensure you get the best experience on our website, analyze traffic and personalize content.',
        cookieAccept: 'Accept all',
        cookieReject: 'Reject all',
        cookieSettings: 'Manage preferences'
      },
      va: {
        navExp: 'Experiencia', navGal: 'Galeria', navCarta: 'Carta', navEquipo: 'Equip', navReservar: 'Reservar',
        heroEyebrow: 'El Palmaret | Restaurant · València',
        heroTitle: 'El millor <em>tercer temps</em><br>de València.',
        heroSub: 'amb ànima esportiva',
        heroDesc: 'Unim el ritme del club amb la calma de la sobretaula mediterrània. El punt de trobada on cada moment es celebra amb sabor.',
        heroBtnReserve: 'Reservar taula', heroBtnMenu: 'Veure carta →',
        teamTitle: 'El nostre equip',
        reserveTitle: 'Reserva la teua<br><em>experiència</em>',
        reserveDesc: 'Acompanya\'ns a la taula. Tant si vens a dinar amb l\'equip com a celebrar la victòria, en El Palmaret sempre hi ha un lloc per a tu.',
        infoSchedule: 'Horari', infoScheduleVal: 'Mie–Dis: 8:00–00:00 | Diu: 8:00–16:00',
        infoRice: 'Arrossos', infoRiceVal: 'Per encàrrec · Mínim 2 persones',
        infoGroups: 'Grups', infoGroupsVal: 'Sopars d\'equip i esdeveniments a mida',
        infoContact: 'Contacte',
        algTitle: 'Llegenda d\'<em>Al·lergògens</em>',
        algDesc: 'Conforme al Reglament (UE) 1169/2011. Si teniu alguna al·lèrgia o intolerància, consulteu amb el nostre equip. Tots els nostres plats poden contindre traces.',
        algInfo: 'Informació obligatòria',
        algWarning: 'Tots els nostres plats poden contindre traces dels al·lergògens indicats. Si teniu alguna al·lèrgia o intolerància alimentària, informeu al nostre personal. La vostra seguretat és la nostra prioritat.',
        mapTitle: 'Com arribar?',
        mapSub: 'El Palmaret | Restaurant · València',
        formTitle: 'Parlem',
        formSubtitle: 'Gestionem cada reserva de forma personal perquè la teua experiència comence des del primer contacte.',
        btnWhatsapp: 'Escriure ara',
        btnPhone: 'Trucar ara',
        labelConfirmation: 'La reserva queda supeditada a la confirmació per WhatsApp o telèfon.',
        footerTag: 'Sabor mediterrani<br>amb ànima esportiva.',
        footerAddr: 'Complex Esportiu · València<br>restaurante@elpalmaret.com',
        fCarta: 'Carta', fServicios: 'Serveis', fReservas: 'Reserves',
        fMenu1: 'Tapeig d\'autor', fMenu2: 'Arrossos i brases', fMenu3: 'La brasa', fMenu4: 'Healthy performance', fMenu5: 'Postres casolans',
        fServ1: 'Desdejunis', fServ2: 'Menú executiu', fServ3: 'Menú esportistes', fServ4: 'Sopars d\'equip', fServ5: 'Esdeveniments a mida',
        fRes1: 'Reservar taula', fRes2: 'Grups', fRes3: 'El nostre equip', fRes4: 'Galeria',
        copy: '© 2026 El Palmaret — Tots els drets reservats',
        slogan: 'Una història que se cocina a fuego lento',
        galleryEyebrow: 'Galeria gastronòmica',
        galleryTitle: 'Imatges que<br><em>saben a alguna cosa</em>',
        expEyebrow: 'La nostra experiència',
        expTitle: 'Més que un restaurant,<br><em>un punt de trobada</em>',
        expP1: 'En El Palmaret, la tradició valenciana es troba amb la tècnica d\'avantguarda. La nostra cuina es basa en el respecte al producte de proximitat i el compromís amb el sabor autèntic.',
        expQuote: '"Som el sabor de la victòria i el confort del tercer temps."',
        expP2: 'Des del cruixent d\'un bon arròs a llenya fins a la delicadesa de les nostres tapes d\'autor, cada plat està pensat per a compartir. Combinem l\'agilitat de l\'entorn esportiu amb la pausa i la cura d\'un restaurant gourmet.',
        parallaxQuote: 'Descobreix l\'entorn. Assaboreix l\'horta.<br><em>Viu l\'experiència.</em>',
        serviceEyebrow: 'Servei 360°',
        serviceTitle: 'Del café de l\'alba<br>al <em>sopar de celebració</em>',
        serviceDesc: 'La teua energia, el nostre compromís. Des del primer café que desperta el matí fins al brindis relaxat després d\'un gran esforç, mimem cada instant perquè et sentes com a casa.',
        serviceCardTitles: ['Desdejunis & L\'Esmorzaret', 'Menú Executiu Diari', 'Arrossos & Brases', 'Healthy Performance', 'Sopars d\'equip i esdeveniments', 'Take-away esportiu'],
        serviceCardDescs: ['Pa de pagés amb tots els acompanyaments. El ritual matinal valencià, com toca.', 'Cuina de mercat, producte fresc i rotació diària per al soci que viu el club.', 'Paelles, arrossos a llenya, carns i peixos a la brasa. Disponibles per encàrrec.', 'Menú especial per a esportistes. Plats nutritius però gourmet per als qui entrenen cada dia.', 'Menús de grup, celebracions i esdeveniments a mida. Organitzem la victòria amb tu.', 'Cuina de qualitat per a emportar. Tecnologia i agilitat al servei de l\'esportista en moviment.'],
        menuEyebrow: 'La nostra carta',
        menuTitle: 'Tradició valenciana<br><em>amb tècnica d\'avantguarda</em>',
        menuDesc: 'Plats dissenyats per a compartir. Producte de proximitat, respecte per la temporada i el toque tècnic del nostre equip. Els preus inclouen IVA.',
        sharingTitle: 'Menú per a compartir',
        sharingDesc: "L'experiència completa d'El Palmaret. Plats dissenyats per a disfrutar entre tots a la taula. Taula completa.",
        sharingPrice1: 'sense beguda / p',
        sharingPrice2: 'amb beguda / p',
        sharingList: ['Tàrtar de tonyina roja i alvocat', 'Ensaladilla russa de la casa', 'Croquetes de pernil ibèric (2ud)', 'Flor de carxofa amb tòfona i sal de pernil', 'Arròs de la temporada', 'Postre casolà a elegir'],
        algNames: ['Gluten', 'Crustacis', 'Ous', 'Peix', 'Cacauets', 'Soja', 'Lactis', 'Frutos Càscara', 'Api', 'Mostassa', 'Sésam', 'Sulfits', 'Altramuces', 'Mol·luscs'],
        filterLabels: ['Tota la carta', 'Desdejunis', 'Esmorzars', 'Amanides', 'Tapes fredes', 'Tapes calentes', 'Entrepans', 'Arrossos', 'Carns', 'Postres', 'Begudes', 'Cafés'],
        categoryTitles: ['Desdejunis', 'Esmorzar Popular', 'Amanides', 'Tapes Fredes', 'Tapes Calentes', 'Entrepans & Tostes', 'Arrossos & Fideuàs', 'La Brasa del Tercer Temps', 'Postres casolans', 'Begudes', 'Begudes Alcohòliques', 'Cafés i Infusions'],
        categorySubtitles: ['Comença el dia amb energia', 'El ritual valencià de mig matí', 'Fresques i de temporada', 'Per començar bé', 'Del foc a la taula', 'Els nostres clàssics en pa artesà', 'Per encàrrec · Mínim 2 persones', 'Carns seleccionades a la brasa', 'El toque dolç de la nostra cuina', 'Refrescos i aigües', 'Cerveses, vins i combinats', 'El toc final'],
        categoryBadges: ['Fins les 12h', 'De 9:00 a 11:30', 'ADN Valencià'],
        featuredLabels: ['L\'estrela', 'Productes de la terra', 'Icònic', 'De sempre', 'Estrela de la casa', 'Imprescindible', 'De siempre'],
        featuredNames: ['Paella de pollastre i conill', 'Arròs de secret, boletus i alls tendres', 'Tiramisú d\'orxata i fartons', 'Torrija amb gelat d\'orxata', 'Tàrtar de tonyina roja i alvocat', 'Flor de carxofa, sal de pernil i tòfona', 'Ensaladilla russa de la casa'],
        featuredDescs: ['Recepta tradicional valenciana cuinada amb llenya de taronger.', '', 'La nostra reinterpretació del clàssic amb orxata de xufa valenciana, mascarpone i fartons torrats.', 'Pa brioix caramel·litzat, crema anglesa i gelat artesà d\'orxata d\'Carpesa.', 'Tonyina del Mediterrani, alvocat cremós, ikura, oli de sèsam i wasabi. Servit fred sobre base de gingebre.', 'Carxofa de la terreta rostida en flor, oli de tòfona negra i sal de pernil ibèric. L\'elegància del producte de proximitat.', 'Recepta pròpia d\'Esteve. Creïlla, carlota, pésols i maionesa artesana. La referència del tapeig valencià.'],
        visionQuote: '"Més que un espai,<br><em>un futur.</em>"',
        visionSub: 'Una historia que se cocina a fuego lento',
        visionBtn: 'Sigues part de la història',
        teamMainTitle: 'L\'aposta que<br><em>ho fa possible</em>',
        teamRole1: 'Supervisor Gerent · Creative Chef',
        teamBio1: 'Format en Canalla Bistro (Ricard Camarena), Restaurante Vertical i cuines de Noruega. Lidera la visió creativa d\'El Palmaret amb una filosofia sense fronteres i amb tota l\'ànima.',
        teamRole2: 'Cap de Cuina',
        teamBio2: 'Especialista en arrossos valencians. Amb pas per La Favorita, Sagardi i Miss Sushi. El domini del foc i el producte local són el seu segell. La paella en les seues mans és una declaració d\'amor.',
        msgMissing: 'Completa tots els camps abans d\'enviar.',
        msgNoSlots: (remaining, hora) => `No hi ha disponibilitat per a eixa hora. Queden ${remaining} places per a les ${hora}.`,
        msgSending: 'Enviant reserva...',
        msgSuccess: 'Reserva rebuda! Et confirmarem prompte per email.',
        msgError: 'No hem pogut enviar la reserva ara mateix. Torna-ho a intentar en uns minuts.',
        cookieTitle: 'Configuració de cookies',
        cookieText: 'Utilitzem cookies per a assegurar que tingues la millor experiència en la nostra web, analitzar el tràfic i personalitzar el contingut.',
        cookieAccept: 'Acceptar totes',
        cookieReject: 'Rebutjar totes',
        cookieSettings: 'Gestionar preferències'
      }
    };

    let currentLang = localStorage.getItem('palmaretLang') || 'es';
    const langButtons = document.querySelectorAll('.lang-btn');
    const t = () => I18N[currentLang] || I18N.es;

    function setText(selector, value, useHtml = false) {
      const el = document.querySelector(selector);
      if (!el) return;
      if (useHtml) el.innerHTML = value;
      else el.textContent = value;
    }

    function setTextList(selector, values, useHtml = false) {
      document.querySelectorAll(selector).forEach((el, i) => {
        if (values[i] == null) return;
        if (useHtml) el.innerHTML = values[i];
        else el.textContent = values[i];
      });
    }

    function setFilterLabel(index, label) {
      const btn = document.querySelectorAll('.cf-btn')[index];
      if (!btn) return;
      const count = btn.querySelector('.cf-count');
      btn.childNodes.forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE) node.nodeValue = `${label} `;
      });
      if (!count) btn.textContent = label;
    }

    const MENU_GLOSSARY = {
      en: [
        ['Patatas bravas: patatas, alioli y salsa brava de la casa', 'House bravas: potatoes, alioli and house brava sauce'],
        ['Torrezno de Soria', 'Soria crispy pork belly'],
        ['Pincho de tortilla', 'Spanish omelette skewer'],
        ['Croquetas de la casa', 'House croquettes'],
        ['Flor de alcachofa con sal de jamón y aceite de trufa', 'Artichoke flower with ham salt and truffle oil'],
        ['Verduras a la plancha: calabacín, berenjena, cebolla, tomate, champiñones y salsa Mery', 'Grilled vegetables: zucchini, eggplant, onion, tomato, mushrooms and Mery sauce'],
        ['Coca de titaina (fuera de carta)', 'Titaina coca (off-menu special)'],
        ['Tiras de pollo', 'Chicken strips'],
        ['Chipirones a la plancha', 'Grilled baby squid'],
        ['Pulpo a la brasa', 'Grilled octopus'],
        ['Huevos rotos con jamón ibérico', 'Broken eggs with Iberian ham'],
        ['Revuelto de morcilla, setas y ajos tiernos', 'Black pudding scramble with mushrooms and spring garlic'],
        ['Ensaladilla rusa', 'Russian salad'],
        ['patata, zanahoria, atún, aceitunas, guisantes, huevo y mayonesa', 'potato, carrot, tuna, olives, peas, egg and mayo'],
        ['Ensaladilla de marisco', 'Seafood salad'],
        ['patata, atún, huevo, sepia, surimi y mayonesa', 'potato, tuna, egg, cuttlefish, surimi and mayo'],
        ['Hummus de garbanzo', 'Chickpea hummus'],
        ['con crudites y picos', 'with crudites and breadsticks'],
        ['Boquerones en vinagre', 'Anchovies in vinegar'],
        ['con aceitunas y salsa Mery', 'with olives and Mery sauce'],
        ['Tabla jamón ibérico y queso manchego curado', 'Iberian ham and cured Manchego cheese board'],
        ['con picos', 'with breadsticks'],
        ['Anchoas del cantábrico', 'Cantabrian anchovies'],
        ['Titaina con huevo', 'Titaina with egg'],
        ['Postres caseros', 'Homemade desserts'],
        ['El toque dulce de nuestra cocina', 'The sweet touch of our kitchen'],
        ['Tiramisú de horchata y fartons', 'Horchata tiramisu with fartons'],
        ['Nuestra reinterpretación del clásico con horchata de chufa valenciana, mascarpone y fartons tostados', 'Our reinterpretation of the classic with Valencian tiger-nut horchata, mascarpone and toasted fartons'],
        ['Torrija con helado de horchata', 'French toast with horchata ice cream'],
        ['Pan brioche caramelizado, crema inglesa y helado artesano de horchata de Carpesa', 'Caramelized brioche, anglaise cream and artisan Carpesa horchata ice cream'],
        ['Corona de Carpesa', 'Corona de Carpesa'],
        ['Bizcocho de horchata con nata de chufa y granizado de limón', 'Horchata sponge cake with tiger-nut cream and lemon slush'],
        ['Crema de naranja', 'Orange cream'],
        ['Crema catalana perfumada con naranja valenciana y caramelo crujiente', 'Crema catalana scented with Valencian orange and crispy caramel'],
        ['Tarta de queso', 'Cheesecake'],
        ['Al horno, cremosa, con coulis de frutos rojos del bosque', 'Oven-baked, creamy, with forest red berry coulis'],
        ['Coca de llanda con naranja y helado', 'Coca de llanda with orange and ice cream'],
        ['Coca esponjosa valenciana, reducción de naranja de Vinaròs y helado de vainilla', 'Spongy Valencian cake, Vinaròs orange reduction and vanilla ice cream'],
        ['Brownie con helado', 'Brownie with ice cream'],
        ['Brownie de chocolate 70%, nueces y helado de vainilla de Madagascar', '70% chocolate brownie, walnuts and Madagascar vanilla ice cream'],
        ['Copa de yogur griego con frutas del bosque', 'Greek yogurt cup with forest fruits'],
        ['Yogur griego, frutas frescas de temporada y granola artesana', 'Greek yogurt, fresh seasonal fruits and artisan granola'],
        ['Tartar de atún', 'Tuna tartare'],
        ['atún rojo, wakame, aguacate y salsa de soja', 'bluefin tuna, wakame, avocado and soy sauce'],
        ['Tartar de vaca', 'Beef tartare'],
        ['steak tartar, pepinillos, chalota, mostaza dijon, salsa perrins', 'steak tartar, pickles, shallot, Dijon mustard, Perrins sauce'],
        ['Ensalada valencia', 'Valencia salad'],
        ['lechuga romana, tomate, zanahoria, remolacha, pepino, huevo, aceitunas y atún', 'romaine, tomato, carrot, beetroot, cucumber, egg, olives and tuna'],
        ['Ensalada tomate rosa', 'Pink tomato salad'],
        ['tomate rosa, olivas negras, piparras y tonyina de sorra', 'pink tomato, black olives, piparra peppers and salted tuna'],
        ['Ensalada Cesar', 'Caesar salad'],
        ['lechuga romana, cherrys, parmesano, tiras de pollo empanado, picatostes y salsa cesar', 'romaine, cherry tomatoes, parmesan, breaded chicken, croutons and Caesar sauce'],
        ['Poke de pollo katsu o de salmón ahumado', 'Chicken katsu or smoked salmon poke'],
        ['arroz jazmin, cebolla morada, edamame, aguacate, salsa soja, mayonesa japonesa y sésamo', 'jasmine rice, red onion, edamame, avocado, soy sauce, Japanese mayo and sesame'],
        ['Patatas bravas', 'Patatas bravas'],
        ['patatas, alioli y salsa brava de la casa', 'potatoes, alioli and house brava sauce'],
        ['Verduras a la plancha', 'Grilled vegetables'],
        ['calabacín, berenjena, cebolla, tomate, champiñones y salsa Mery', 'zucchini, eggplant, onion, tomato, mushrooms and Mery sauce'],
        ['Chivito', 'Chivito sandwich'],
        ['lomo, bacon, queso, lechuga, tomate huevo y mayonesa', 'pork loin, bacon, cheese, lettuce, tomato, egg and mayo'],
        ['Brascada', 'Brascada sandwich'],
        ['ternera, jamón y cebolla pochada', 'beef, ham and poached onion'],
        ['Almussafes', 'Almussafes sandwich'],
        ['sobrasada, queso brie, cebolla pochada', 'sobrasada, brie and poached onion'],
        ['Hamburguesa de la casa', 'House burger'],
        ['carne de Angus, bacon, queso, lechuga, tomate, cebolla morada y mayonesa', 'Angus beef, bacon, cheese, lettuce, tomato, red onion and mayo'],
        ['Hamburguesa vegana', 'Vegan burger'],
        ['heura, queso vegano, lechuga, tomate, cebolla morada y mayonesa vegana', 'heura, vegan cheese, lettuce, tomato, red onion and vegan mayo'],
        ['Tosta figatell', 'Figatell toast'],
        ['pan de tosta, figatell, queso de cabra y salsa teriyaki', 'toast bread, figatell, goat cheese and teriyaki sauce'],
        ['Bocadillo de chivito', 'Chivito sandwich'],
        ['Almuerzo entero', 'Full brunch'],
        ['Medio almuerzo', 'Half brunch'],
        ['Cremaet +1€', 'Cremaet coffee +1€'],
        ['Ternera o potro +2€', 'Beef or foal meat +2€'],
        ['Tostadas o croissant + café', 'Toast or croissant + coffee'],
        ['Tomate, mantequilla y mermelada, huevo revuelto, queso crema', 'Tomato, butter and jam, scrambled eggs, cream cheese'],
        ['Extras (jamón, aguacate, salmón, atún, bacon)', 'Extras (ham, avocado, salmon, tuna, bacon)'],
        ['zumo de naranja natural', 'Fresh orange juice'],
        ['Ternera o potro', 'Beef or foal meat'],
        ['Sándwich mixto con patatas fritas', 'Ham and cheese sandwich with fries'],
        ['Chivito: lomo, bacon, queso, lechuga, tomate huevo y mayonesa', 'Chivito: pork loin, bacon, cheese, lettuce, tomato, egg and mayo'],
        ['Brascada: ternera, jamo y cebolla pochada', 'Brascada: beef, ham and poached onion'],
        ['Almussafes: sobrasada, queso brie, cebolla pochada', 'Almussafes: sobrasada, brie, poached onion'],
        ['Potro con ajos tiernos', 'Foal with spring garlic'],
        ['Tortilla de patatas', 'Potato omelette'],
        ['Embutido con habas', 'Sausages with beans'],
        ['Chorizo criollo con queso brie y salsa gaucha', 'Criollo chorizo with brie and gaucha sauce'],
        ['Hamburguesa de la casa: carne de Angus, bacon, queso, lechuga, tomate, cebolla morada y mayonesa', 'House burger: Angus beef, bacon, cheese, lettuce, tomato, red onion and mayo'],
        ['Hamburguesa vegana: heura, queso vegano, lechuga, tomate, cebolla morada y mayonesa vegana', 'Vegan burger: heura, vegan cheese, lettuce, tomato, red onion and vegan mayo'],
        ['Tosta figatell: pan de tosta, figatell, queso de cabra y salsa teriyaki', 'Figatell toast: toast bread, figatell, goat cheese and teriyaki sauce'],
        ['Titaina con huevo', 'Titaina with egg'],
        ['Contramuslo de pollo', 'Chicken thigh'],
        ['Milanesa de ternera napolitana', 'Neapolitan veal Milanese'],
        ['con puré de patata', 'with mashed potatoes'],
        ['Entrecot', 'Entrecote'],
        ['Entrecot (madurado)', 'Dry-aged Entrecote'],
        ['Solomillo', 'Sirloin'],
        ['Chuletas de cordero', 'Lamb chops'],
        ['Secreto', 'Pork Secreto'],
        ['Parillada', 'Mixed Grill'],
        ['Paella de pollo y conejo', 'Chicken and rabbit paella'],
        ['Arroz negro', 'Black rice'],
        ['Arroz a banda', 'Arroz a banda'],
        ['Arroz de verduras', 'Vegetable rice'],
        ['Arroz de secreto, boletus y ajos tiernos', 'Pork secreto rice with boletus and spring garlic'],
        ['Fideuà de marisco', 'Seafood Fideua'],
        ['Fideuà de secreto, boletus y ajos tiernos', 'Pork secreto fideua with boletus and spring garlic'],
        ['Agua Cabreiroa', 'Cabreiroa Water'],
        ['Agua con gas', 'Sparkling water'],
        ['Pepsi Max', 'Pepsi Max'],
        ['Kas naranja o limón', 'Orange or lemon Kas'],
        ['Tonica', 'Tonic'],
        ['Zumo de melocotón o piña', 'Peach or pineapple juice'],
        ['Zumo naranja natural', 'Fresh orange juice'],
        ['Estrella Galicia doble o tercio', 'Estrella Galicia large or bottle'],
        ['Estrella Galicia caña', 'Estrella Galicia draft'],
        ['Estrella Galicia 0’0%', 'Estrella Galicia 0.0%'],
        ['Estrella Galicia tostada', 'Estrella Galicia toasted'],
        ['Tinto de verano', 'Red wine with soda'],
        ['Sangria copa', 'Sangria glass'],
        ['Sangria jarra', 'Sangria pitcher'],
        ['Chupito', 'Shot'],
        ['Copa', 'Glass'],
        ['Combinado', 'Mixed drink'],
        ['Combinado primeras marcas', 'Premium mixed drink'],
        ['Café con leche', 'Coffee with milk'],
        ['Bombón', 'Coffee with condensed milk'],
        ['Americano', 'Americano coffee'],
        ['Infusiones', 'Infusions'],
        ['Café', 'Coffee'],
        ['Cortado', 'Macchiato'],
        ['Cremaet', 'Cremaet (Rum coffee)'],
        ['Colacao', 'Hot chocolate'],
        ['Sin alcohol', 'Non-alcoholic'],
        ['Con alcohol', 'Alcoholic drinks'],
        ['Tradición', 'Tradition'], ['Estrella', 'Signature'], ['Imprescindible', 'Must-try'], ['Top ventas', 'Best seller']
      ],
      va: [
        ['Patatas bravas: patatas, alioli y salsa brava de la casa', 'Creilles braves: creilles, allioli i salsa brava de la casa'],
        ['Torrezno de Soria', 'Torrezno de Sòria'],
        ['Pincho de tortilla', 'Pinxo de truita'],
        ['Croquetas de la casa', 'Croquetes de la casa'],
        ['Flor de alcachofa con sal de jamón y aceite de trufa', 'Flor de carxofa amb sal de pernil i oli de tòfona'],
        ['Verduras a la plancha: calabacín, berenjena, cebolla, tomate, champiñones y salsa Mery', 'Verdures a la planxa: carabassó, albergínia, ceba, tomaca, xampinyons i salsa Mery'],
        ['Coca de titaina (fuera de carta)', 'Coca de titaina (fora de carta)'],
        ['Tiras de pollo', 'Tires de pollastre'],
        ['Chipirones a la plancha', 'Xipirons a la planxa'],
        ['Pulpo a la brasa', 'Polp a la brasa'],
        ['Huevos rotos con jamón ibérico', 'Ous trencats amb pernil ibèric'],
        ['Revuelto de morcilla, setas y ajos tiernos', 'Remenat de botifarra, bolets i alls tendres'],
        ['Ensaladilla rusa', 'Ensaladilla russa'],
        ['patata, zanahoria, atún, aceitunas, guisantes, huevo y mayonesa', 'creilla, carlota, tonyina, olives, pésols, ou i maionesa'],
        ['Ensaladilla de marisco', 'Ensaladilla de marisc'],
        ['patata, atún, huevo, sepia, surimi y mayonesa', 'creilla, tonyina, ou, sípia, surimi i maionesa'],
        ['Hummus de garbanzo', 'Hummus de cigró'],
        ['con crudites y picos', 'amb crudités i picos'],
        ['Boquerones en vinagre', 'Seitons en vinagre'],
        ['con aceitunas y salsa Mery', 'amb olives i salsa Mery'],
        ['Tabla jamón ibérico y queso manchego curado', 'Taula de pernil ibèric i formatge manxec curat'],
        ['con picos', 'amb picos'],
        ['Anchoas del cantábrico', 'Anxoves del cantàbric'],
        ['Titaina con huevo', 'Titaina amb ou'],
        ['Postres caseros', 'Postres casolans'],
        ['El toque dulce de nuestra cocina', 'El toque dolç de la nostra cuina'],
        ['Tiramisú de horchata y fartons', "Tiramisú d'orxata i fartons"],
        ['Nuestra reinterpretación del clásico con horchata de chufa valenciana, mascarpone y fartons tostados', 'La nostra reinterpretació del clàssic amb orxata de xufa valenciana, mascarpone i fartons torrats'],
        ['Torrija con helado de horchata', "Torrija amb gelat d'orxata"],
        ['Pan brioche caramelizado, crema inglesa y helado artesano de horchata de Carpesa', "Pa brioix caramel·litzat, crema anglesa i gelat artesà d'orxata d'Carpesa"],
        ['Corona de Carpesa', 'Corona de Carpesa'],
        ['Bizcocho de horchata con nata de chufa y granizado de limón', "Pa de pessic d'orxata amb nata de xufa i granissat de llimona"],
        ['Crema de naranja', 'Crema de taronja'],
        ['Crema catalana perfumada con naranja valenciana y caramelo crujiente', 'Crema catalana perfumada amb taronja valenciana i caramel cruixent'],
        ['Tarta de queso', 'Pastís de formatge'],
        ['Al horno, cremosa, con coulis de frutos rojos del bosque', 'Al forn, cremosa, amb coulis de fruits rojos del bosc'],
        ['Coca de llanda con naranja y helado', 'Coca de llanda amb taronja i gelat'],
        ['Coca esponjosa valenciana, reducción de naranja de Vinaròs y helado de vainilla', 'Coca esponjosa valenciana, reducció de taronja de Vinaròs i gelat de vainilla'],
        ['Brownie con helado', 'Brownie amb gelat'],
        ['Brownie de chocolate 70%, nueces y helado de vainilla de Madagascar', 'Brownie de xocolata 70%, nous i gelat de vainilla de Madagascar'],
        ['Copa de yogur griego con frutas del bosque', 'Copa de iogurt grec amb fruits del bosc'],
        ['Yogur griego, frutas frescas de temporada y granola artesana', 'Iogurt grec, fruites fresques de temporada i granola artesana'],
        ['Tartar de atún', 'Tàrtar de tonyina'],
        ['atún rojo, wakame, aguacate y salsa de soja', 'tonyina roja, wakame, alvocat i salsa de soja'],
        ['Tartar de vaca', 'Tàrtar de vaca'],
        ['steak tartar, pepinillos, chalota, mostaza dijon, salsa perrins', 'steak tartar, pepinets, xalota, mostassa dijon, salsa perrins'],
        ['Ensalada valencia', 'Amanida valència'],
        ['lechuga romana, tomate, zanahoria, remolacha, pepino, huevo, aceitunas y atún', 'lletuga romana, tomaca, carlota, remolatxa, pepí, ou, olives i tonyina'],
        ['Ensalada tomate rosa', 'Amanida tomaca rosa'],
        ['tomate rosa, olivas negras, piparras y tonyina de sorra', 'tomaca rosa, olives negres, piparres i tonyina de sorra'],
        ['Ensalada Cesar', 'Amanida Cesar'],
        ['lechuga romana, cherrys, parmesano, tiras de pollo empanado, picatostes y salsa cesar', 'lletuga romana, cherrys, parmesà, tires de pollastre empanat, picatostes i salsa cesar'],
        ['Poke de pollo katsu o de salmón ahumado', 'Poke de pollastre katsu o de salmó fumat'],
        ['arroz jazmin, cebolla morada, edamame, aguacate, salsa soja, mayonesa japonesa y sésamo', 'arròs jazmí, ceba morada, edamame, alvocat, salsa soja, maionesa japonesa i sèsam'],
        ['Patatas bravas', 'Creilles braves'],
        ['patatas, alioli y salsa brava de la casa', 'creilles, allioli i salsa brava de la casa'],
        ['Verduras a la plancha', 'Verdures a la planxa'],
        ['calabacín, berenjena, cebolla, tomate, champiñones y salsa Mery', 'carabassó, albergínia, ceba, tomaca, xampinyons i salsa Mery'],
        ['Chivito', 'Xivito'],
        ['lomo, bacon, queso, lechuga, tomate huevo y mayonesa', 'llom, bacon, formatge, lletuga, tomaca, ou i maionesa'],
        ['Brascada', 'Brascada'],
        ['ternera, jamón y cebolla pochada', 'vedella, pernil i ceba poixada'],
        ['Almussafes', 'Almussafes'],
        ['sobrasada, queso brie, cebolla pochada', 'sobrassada, formatge brie, ceba poixada'],
        ['Hamburguesa de la casa', 'Hamburguesa de la casa'],
        ['carne de Angus, bacon, queso, lechuga, tomate, cebolla morada y mayonesa', 'carn d\'Angus, bacon, formatge, lletuga, tomaca, ceba morada i maionesa'],
        ['Hamburguesa vegana', 'Hamburguesa vegana'],
        ['heura, queso vegano, lechuga, tomate, cebolla morada y mayonesa vegana', 'heura, formatge vegà, lletuga, tomaca, ceba morada i maionesa vegana'],
        ['Tosta figatell', 'Tosta figatell'],
        ['pan de tosta, figatell, queso de cabra y salsa teriyaki', 'pa de tosta, figatell, formatge de cabra i salsa teriyaki'],
        ['Bocadillo de chivito', 'Entrepà de xivito'],
        ['Almuerzo entero', 'Esmorzar sencer'],
        ['Medio almuerzo', 'Mig esmorzar'],
        ['Cremaet +1€', 'Cremaet +1€'],
        ['Ternera o potro +2€', 'Vedella o poltre +2€'],
        ['Tostadas o croissant + café', 'Torrades o croissant + cafè'],
        ['Tomate, mantequilla y mermelada, huevo revuelto, queso crema', 'Tomaca, mantega i melmelada, ou remenat, formatge crema'],
        ['Extras (jamón, aguacate, salmón, atún, bacon)', 'Extras (pernil, alvocat, salmó, tonyina, bacon)'],
        ['zumo de naranja natural', 'suc de taronja natural'],
        ['Ternera o potro', 'Vedella o poltre'],
        ['Sándwich mixto con patatas fritas', 'Sandvitx mixt amb creilles fregides'],
        ['Chivito: lomo, bacon, queso, lechuga, tomate huevo y mayonesa', 'Xivito: llom, bacon, formatge, lletuga, tomaca, ou i maionesa'],
        ['Brascada: ternera, jamo y cebolla pochada', 'Brascada: vedella, pernil i ceba poixada'],
        ['Almussafes: sobrasada, queso brie, cebolla pochada', 'Almussafes: sobrassada, formatge brie, ceba poixada'],
        ['Potro con ajos tiernos', 'Poltre amb alls tendres'],
        ['Tortilla de patatas', 'Truita de creilles'],
        ['Embutido con habas', 'Embotit amb faves'],
        ['Chorizo criollo con queso brie y salsa gaucha', 'Xoriço crioll amb formatge brie i salsa gautxa'],
        ['Hamburguesa de la casa: carne de Angus, bacon, queso, lechuga, tomate, cebolla morada y mayonesa', 'Hamburguesa de la casa: carn d\'Angus, bacon, formatge, lletuga, tomaca, ceba morada i maionesa'],
        ['Hamburguesa vegana: heura, queso vegano, lechuga, tomate, cebolla morada y mayonesa vegana', 'Hamburguesa vegana: heura, formatge vegà, lletuga, tomaca, ceba morada i maionesa vegana'],
        ['Tosta figatell: pan de tosta, figatell, queso de cabra y salsa teriyaki', 'Tosta figatell: pa de tosta, figatell, formatge de cabra i salsa teriyaki'],
        ['Titaina con huevo', 'Titaina amb ou'],
        ['Contramuslo de pollo', 'Contracuixa'],
        ['Milanesa de ternera napolitana', 'La milanesa'],
        ['con puré de patata', 'amb puré de creilla'],
        ['Entrecot', 'Entrecot'],
        ['Entrecot (madurado)', 'Entrecot (madurat)'],
        ['Solomillo', 'Filet'],
        ['Chuletas de cordero', 'Costelles de corder'],
        ['Secreto', 'Secret'],
        ['Parillada', 'Graellada'],
        ['Paella de pollo y conejo', 'Paella de pollastre i conill'],
        ['Arroz negro', 'Arròs negre'],
        ['Arroz a banda', 'Arròs a banda'],
        ['Arroz de verduras', 'Arròs de verdures'],
        ['Arroz de secreto, boletus y ajos tiernos', 'Arròs de secret, boletus i alls tendres'],
        ['Fideuà de marisco', 'Fideuà de marisc'],
        ['Fideuà de secreto, boletus y ajos tiernos', 'Fideuà de secret, boletus i alls tendres'],
        ['Agua Cabreiroa', 'Aigua Cabreiroa'],
        ['Agua con gas', 'Aigua amb gas'],
        ['Kas naranja o limón', 'Kas taronja o llimona'],
        ['Zumo de melocotón o piña', 'Suc de bresquilla o pinya'],
        ['Zumo naranja natural', 'Suc taronja natural'],
        ['Estrella Galicia doble o tercio', 'Estrella Galicia doble o terç'],
        ['Estrella Galicia caña', 'Estrella Galicia canya'],
        ['Estrella Galicia 0’0%', 'Estrella Galicia 0’0%'],
        ['Estrella Galicia tostada', 'Estrella Galicia torrada'],
        ['Tinto de verano', 'Tinto de verano'],
        ['Sangria copa', 'Sangria copa'],
        ['Sangria jarra', 'Sangria jarra'],
        ['Chupito', 'Xupito'],
        ['Copa', 'Copa'],
        ['Combinado', 'Combinat'],
        ['Combinado primeras marcas', 'Combinat primeres marques'],
        ['Café con leche', 'Cafè amb llet'],
        ['Bombón', 'Bombó'],
        ['Americano', 'Americà'],
        ['Infusiones', 'Infusions'],
        ['Café', 'Cafè'],
        ['Cortado', 'Tallat'],
        ['Cremaet', 'Cremaet'],
        ['Colacao', 'Colacao'],
        ['Sin alcohol', 'Sense alcohol'],
        ['Con alcohol', 'Amb alcohol'],
        ['Tradición', 'Tradició'], ['Estrella', 'Estrela'], ['Imprescindible', 'Imprescindible'], ['Top ventas', 'Top vendes']
      ]
    };

    function translateMenuText(originalText, lang) {
      if (lang === 'es') return originalText;
      let output = originalText;
      const pairs = MENU_GLOSSARY[lang] || [];
      pairs.forEach(([from, to]) => {
        output = output.split(from.trim()).join(to);
      });
      return output;
    }

    function applyMenuTranslations(lang) {
      document.querySelectorAll('.mi-name, .mi-desc, .mi-tag, .mi-group-title').forEach((el) => {
        if (!el.dataset.es) el.dataset.es = el.textContent.trim();
        el.textContent = translateMenuText(el.dataset.es, lang);
      });
    }

    function applyLanguage(lang) {
      if (!I18N[lang]) return;
      currentLang = lang;
      localStorage.setItem('palmaretLang', lang);
      document.documentElement.lang = lang === 'va' ? 'ca' : lang;
      langButtons.forEach(btn => {
        const isActive = btn.dataset.lang === lang;
        btn.classList.toggle('active', isActive);
        btn.setAttribute('aria-pressed', isActive);
      });

      setText('nav ul li:nth-child(1) a', t().navExp);
      setText('nav ul li:nth-child(2) a', t().navGal);
      setText('nav ul li:nth-child(3) a', t().navCarta);
      setText('nav ul li:nth-child(4) a', t().navEquipo);
      setText('nav ul li:nth-child(5) a', t().navReservar);
      setText('.hey', t().heroEyebrow);
      setText('.hh1', t().heroTitle, true);
      setText('.hh1s', t().heroSub);
      setText('.hdes', t().heroDesc);
      setText('.hact .bp', t().heroBtnReserve);
      setText('.hact .bg', t().heroBtnMenu);
      setText('#galeria .g-eyebrow', t().galleryEyebrow);
      setText('#galeria .g-title', t().galleryTitle, true);
      setText('#experiencia .ey', t().expEyebrow);
      setText('#experiencia .st', t().expTitle, true);
      setText('#experiencia .et p:nth-of-type(1)', t().expP1);
      setText('#experiencia .eq p', t().expQuote);
      setText('#experiencia .et p:nth-of-type(2)', t().expP2);
      setText('.pq-text', t().parallaxQuote, true);
      setText('#servicio .ey', t().serviceEyebrow);
      setText('#servicio .st', t().serviceTitle, true);
      setText('#servicio .srv-header p', t().serviceDesc);
      setTextList('#servicio .sc2 h3', t().serviceCardTitles);
      setTextList('#servicio .sc2 p', t().serviceCardDescs);
      setText('#carta .ey', t().menuEyebrow);
      setText('#carta .carta-hero h2', t().menuTitle, true);
      setText('#carta .carta-hero p', t().menuDesc);

      // Sharing Menu
      setText('.sb-left h3', t().sharingTitle);
      setText('.sb-left p', t().sharingDesc);
      setText('.price-row div:nth-child(1) small', t().sharingPrice1);
      setText('.price-row div:nth-child(2) small', t().sharingPrice2);
      setTextList('.sb-right li', t().sharingList);

      (t().filterLabels || []).forEach((label, i) => setFilterLabel(i, label));
      setTextList('#carta .cat-title', t().categoryTitles);
      setTextList('#carta .cat-subtitle', t().categorySubtitles);
      setTextList('#carta .cat-badge', t().categoryBadges);
      setTextList('#carta .di-label', t().featuredLabels);
      setTextList('#carta .di-name', t().featuredNames);
      setTextList('#carta .di-desc', t().featuredDescs);
      setText('.vis-q', t().visionQuote, true);
      setText('.vis-sub', t().visionSub);
      setText('.vis-inner .bp', t().visionBtn);
      setText('#equipo .ey', t().teamTitle);
      setText('#equipo .st', t().teamMainTitle, true);
      setText('#equipo .cc:nth-child(1) .crl', t().teamRole1);
      setText('#equipo .cc:nth-child(1) .cbi', t().teamBio1);
      setText('#equipo .cc:nth-child(2) .crl', t().teamRole2);
      setText('#equipo .cc:nth-child(2) .cbi', t().teamBio2);
      setText('#reserva .rl h2', t().reserveTitle, true);
      setText('#reserva .rl p', t().reserveDesc);
      setText('#reserva .il .ir:nth-child(1) strong', t().infoSchedule);
      setText('#reserva .il .ir:nth-child(1) span', t().infoScheduleVal);
      setText('#reserva .il .ir:nth-child(2) strong', t().infoRice);
      setText('#reserva .il .ir:nth-child(2) span', t().infoRiceVal);
      setText('#reserva .il .ir:nth-child(3) strong', t().infoGroups);
      setText('#reserva .il .ir:nth-child(3) span', t().infoGroupsVal);
      setText('#reserva .il .ir:nth-child(4) strong', t().infoContact);
      setText('#reservationSection .rft', t().formTitle);
      setText('#reservationSection .rfs', t().formSubtitle);
      setText('#btnWhatsappReserva .rs-row-title', t().btnWhatsapp);
      setText('#btnPhoneReserva .rs-row-cta span', t().btnPhone);
      setText('#reservationSection .r-note', t().labelConfirmation);

      // Cookie Consent Translation
      setText('#cookieTitle', t().cookieTitle);
      setText('#cookieText', t().cookieText);
      setText('#cookieAccept', t().cookieAccept);
      setText('#cookieReject', t().cookieReject);
      setText('#cookieSettings', t().cookieSettings);

      setText('.ftag', t().footerTag, true);
      setText('.fadr', t().footerAddr, true);
      setText('.fg2 > div:nth-child(2) .fct', t().fCarta);
      setText('.fg2 > div:nth-child(3) .fct', t().fServicios);
      setText('.fg2 > div:nth-child(4) .fct', t().fReservas);
      setText('.fg2 > div:nth-child(2) li:nth-child(1) a', t().fMenu1);
      setText('.fg2 > div:nth-child(2) li:nth-child(2) a', t().fMenu2);
      setText('.fg2 > div:nth-child(2) li:nth-child(3) a', t().fMenu3);
      setText('.fg2 > div:nth-child(2) li:nth-child(4) a', t().fMenu4);
      setText('.fg2 > div:nth-child(2) li:nth-child(5) a', t().fMenu5);
      setText('.fg2 > div:nth-child(3) li:nth-child(1) a', t().fServ1);
      setText('.fg2 > div:nth-child(3) li:nth-child(2) a', t().fServ2);
      setText('.fg2 > div:nth-child(3) li:nth-child(3) a', t().fServ3);
      setText('.fg2 > div:nth-child(3) li:nth-child(4) a', t().fServ4);
      setText('.fg2 > div:nth-child(3) li:nth-child(5) a', t().fServ5);
      setText('.fg2 > div:nth-child(4) li:nth-child(1) a', t().fRes1);
      setText('.fg2 > div:nth-child(4) li:nth-child(2) a', t().fRes2);
      setText('.fg2 > div:nth-child(4) li:nth-child(3) a', t().fRes3);
      setText('.fg2 > div:nth-child(4) li:nth-child(4) a', t().fRes4);
      setText('.fb2 span', t().copy);
      setText('.fb2 em', t().slogan);

      // Traducción sección alérgenos
      setText('#algSec .alg-info', t().algInfo);
      setText('#algSec .alg-title', t().algTitle, true);
      setText('#algSec .alg-desc', t().algDesc);

      // Mapa
      setText('#ubicacion .ey', t().mapTitle);
      setText('#ubicacion .map-title', t().mapSub, true);

      setTextList('.alg-name', t().algNames);
      applyMenuTranslations(lang);
    }

    const hamburgerBtn = document.getElementById('hamburger');
    const navMenuEl = document.getElementById('navMenu');
    if (hamburgerBtn && navMenuEl) {
      hamburgerBtn.addEventListener('click', () => {
        navMenuEl.classList.toggle('active');
      });
      navMenuEl.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => navMenuEl.classList.remove('active'));
      });
    }
    langButtons.forEach(btn => {
      btn.addEventListener('click', () => applyLanguage(btn.dataset.lang));
    });
    applyLanguage(currentLang);



/* ── LOGICA PRINCIPAL: Nav, Carruseles, Galeria, Carta, Traductor, Scroll ── */
    document.addEventListener('DOMContentLoaded', () => {
      const consent = document.getElementById('cookieConsent');
      const acceptBtn = document.getElementById('cookieAccept');
      const rejectBtn = document.getElementById('cookieReject');
      const settingsBtn = document.getElementById('cookieSettings');

      if (!localStorage.getItem('palmaretCookieConsent')) {
        setTimeout(() => {
          consent.classList.add('show');
        }, 2000);
      }

      const closeConsent = (val) => {
        localStorage.setItem('palmaretCookieConsent', val);
        consent.classList.remove('show');
      };

      if (acceptBtn) acceptBtn.addEventListener('click', () => closeConsent('true'));
      if (rejectBtn) rejectBtn.addEventListener('click', () => closeConsent('false'));

      // Gestionar preferencias: mostrar panel de toggles
      const ccMain = document.getElementById('ccMain');
      const ccPanel = document.getElementById('ccPanel');
      const ccBack = document.getElementById('ccBack');
      const ccSave = document.getElementById('ccSave');

      if (settingsBtn && ccMain && ccPanel) {
        settingsBtn.addEventListener('click', () => {
          ccMain.style.display = 'none';
          ccPanel.style.display = 'block';
        });
      }

      if (ccBack) {
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
          consent.classList.remove('show');
        });
      }
    });

    // Flechas de navegacion de la carta
    document.addEventListener('DOMContentLoaded', () => {
      const cfInner = document.getElementById('cfInner');
      const cfLeft = document.getElementById('cfLeft');
      const cfRight = document.getElementById('cfRight');

      if(cfInner && cfLeft && cfRight) {
        const updateArrows = () => {
          const scrollLeft = cfInner.scrollLeft;
          const maxScroll = cfInner.scrollWidth - cfInner.clientWidth;
          
          // Usamos un margen de 2px por errores de redondeo en navegadores
          cfLeft.style.opacity = scrollLeft <= 2 ? '0' : '1';
          cfLeft.style.pointerEvents = scrollLeft <= 2 ? 'none' : 'auto';
          
          cfRight.style.opacity = scrollLeft >= maxScroll - 2 ? '0' : '1';
          cfRight.style.pointerEvents = scrollLeft >= maxScroll - 2 ? 'none' : 'auto';
        };

        cfLeft.addEventListener('click', () => {
          cfInner.scrollBy({ left: -200, behavior: 'smooth' });
        });
        cfRight.addEventListener('click', () => {
          cfInner.scrollBy({ left: 200, behavior: 'smooth' });
        });

        cfInner.addEventListener('scroll', updateArrows);
        window.addEventListener('resize', updateArrows);
        
        // Inicializar
        setTimeout(updateArrows, 500);
      }
    });


