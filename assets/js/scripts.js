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
            block.removeAttribute('data-hidden');
            block.style.display = '';
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
        heroEyebrow: 'Restaurante del Club · Valencia',
        heroTitle: 'El mejor <em>tercer tiempo</em><br>de Valencia.',
        heroSub: 'con alma deportiva',
        heroDesc: 'Unimos el ritmo del club con la calma de la sobremesa mediterránea. El punto de encuentro donde cada momento se celebra con sabor.',
        heroBtnReserve: 'Reservar mesa', heroBtnMenu: 'Ver carta →',
        teamTitle: 'Nuestro equipo',
        reserveTitle: 'Reserva tu<br><em>experiencia</em>',
        reserveDesc: 'Acompáñanos a la mesa. Tanto si vienes a comer con el equipo como a celebrar la victoria, en El Palmaret siempre hay un lugar para ti.',
        infoSchedule: 'Horario', infoScheduleVal: 'Lun–Dom · Desayunos desde 8:00h',
        infoRice: 'Arroces', infoRiceVal: 'Sábados y domingos · Previa reserva',
        infoGroups: 'Grupos', infoGroupsVal: 'Cenas de equipo y eventos a medida',
        infoContact: 'Contacto',
        algTitle: 'Leyenda de <em>Alérgenos</em>',
        algDesc: 'Conforme al Reglamento (UE) 1169/2011. Si tiene alguna alergia o intolerancia, consulte con nuestro equipo. Todos nuestros platos pueden contener trazas.',
        algInfo: 'Información obligatoria',
        algWarning: 'Todos nuestros platos pueden contener trazas de los alérgenos indicados. Si tiene alguna alergia o intolerancia alimentaria, informe a nuestro personal. Su seguridad es nuestra prioridad.',
        mapTitle: '¿Cómo llegar?',
        mapSub: 'Club Valenciano de Natación · Valencia',
        formTitle: 'Hacer una reserva',
        formSubtitle: 'El arroz no espera a nadie (y tu mesa tampoco). Reserva ahora',
        labelName: 'Nombre', labelPhone: 'Teléfono', labelEmail: 'Email', labelDate: 'Fecha', labelTime: 'Hora', labelGuests: 'Comensales',
        phName: 'Tu nombre', phPhone: '+34 000 000 000', phEmail: 'tu@email.com', phGuests: 'Ej. 4',
        submit: 'Solicitar reserva',
        footerTag: 'Sabor mediterráneo<br>con alma deportiva.',
        footerAddr: 'Complejo Deportivo · Valencia<br>restaurante@elpalmaret.com',
        fCarta: 'Carta', fServicios: 'Servicios', fReservas: 'Reservas',
        fMenu1: 'Tapeo de autor', fMenu2: 'Arroces y brasas', fMenu3: 'La brasa', fMenu4: 'Healthy performance', fMenu5: 'Postres caseros',
        fServ1: 'Desayunos', fServ2: 'Menú ejecutivo', fServ3: 'Menú deportistas', fServ4: 'Cenas de equipo', fServ5: 'Eventos a medida',
        fRes1: 'Reservar mesa', fRes2: 'Grupos', fRes3: 'Nuestro equipo', fRes4: 'Galería',
        copy: '© 2025 El Palmaret — Todos los derechos reservados',
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
        serviceCardDescs: ['Pan de payés con todos los acompañamientos. El ritual matutino valenciano, como debe ser.', 'Cocina de mercado, producto fresco y rotación diaria para el socio que vive en el club.', 'Paellas, arroces a leña, carnes y pescados a la brasa. El ritual del sábado y domingo.', 'Menú especial para deportistas. Platos nutritivos pero gourmet para los que entrenan a diario.', 'Menús grupales, celebraciones y eventos a medida. Organizamos la victoria contigo.', 'Cocina de calidad para llevar. Tecnología y agilidad al servicio del deportista en movimiento.'],
        menuEyebrow: 'Nuestra carta',
        menuTitle: 'Tradición valenciana<br><em>con técnica de vanguardia</em>',
        menuDesc: 'Platos diseñados para compartir. Producto de proximidad, respeto por la temporada y el toque técnico de nuestro equipo. Los precios incluyen IVA.',
        sharingTitle: 'Menú para compartir',
        sharingDesc: 'La experiencia completa de El Palmaret. Platos diseñados para disfrutar entre todos en la mesa. Mesa completa.',
        sharingPrice1: 'sin bebida / p',
        sharingPrice2: 'con bebida / p',
        sharingList: ['Tartar de atún rojo y aguacate', 'Ensaladilla rusa de la casa', 'Croquetas de jamón ibérico (2ud)', 'Flor de alcachofa con trufa y sal de jamón', 'Arroz de la temporada', 'Postre casero a elegir'],
        algNames: ['Gluten', 'Crustáceos', 'Huevos', 'Pescado', 'Cacahuetes', 'Soja', 'Lácteos', 'Frutos Cáscara', 'Apio', 'Mostaza', 'Sésamo', 'Sulfitos', 'Altramuces', 'Moluscos'],
        filterLabels: ['Toda la carta', 'Para compartir', 'Ensaladas', 'Tapas frías', 'Tapas calientes', 'Bocadillos', 'Arroces', 'Carnes', 'Healthy', 'Postres'],
        categoryTitles: ['Tapeo de autor', 'Ensaladas', 'Tapas frías', 'Tapas calientes', 'Bocadillos & Tostas', 'Arroces & Fideuàs', 'La Brasa del Tercer Tiempo', 'Healthy Performance', 'Postres caseros'],
        categorySubtitles: ['Platos clásicos valencianos con el toque técnico de Esteve', 'Frescas, de temporada y con producto de proximidad', 'Para empezar bien', 'Del fuego directo a la mesa', 'Para el almuerzo y el take-away deportivo', 'Disponibles sábados y domingos. Previa reserva', 'Carnes y pescados a la leña. El servicio estrella del fin de semana', 'Para el deportista diario. Nutritivo pero gourmet', 'Elaborados cada día con productos de la terra'],
        categoryBadges: ['Nuestro ADN', 'Fin de semana', 'Deportistas'],
        featuredLabels: ['Estrella de la casa', 'Imprescindible', 'De siempre', 'La estrella', 'Mar y montaña', 'Icónico', 'De siempre'],
        featuredNames: ['Tartar de atún rojo y aguacate', 'Flor de alcachofa, sal de jamón y trufa', 'Ensaladilla rusa de la casa', 'Paella valenciana de pollo y conejo', 'Arroz de secreto ibérico, ajos tiernos y boletus', 'Tiramisú de horchata y fartons', 'Torrija con helado de horchata'],
        featuredDescs: ['Atún del Mediterráneo, aguacate cremoso, ikura, aceite de sésamo y wasabi. Servido frío sobre base de jengibre.', 'Alcachofa de la terreta asada en flor, aceite de trufa negra y sal de jamón ibérico. La elegancia del producto de proximidad.', 'Receta propia de Esteve. Patata, zanahoria, guisantes y mayonesa artesana. La referencia del tapeo valenciano.', 'Receta tradicional. Arroz D.O. Valencia, pollo de corral, conejo, garrofó, bajoqueta y azafrán de la Mancha. A leña.', 'Secreto ibérico de bellota, boletus edulis de temporada, ajos tiernos y aceite de trufa blanca.', 'Nuestra reinterpretación del clásico con horchata de chufa valenciana, mascarpone y fartons tostados.', 'Pan brioche caramelizado, crema inglesa y helado artesano de horchata de Alboraya.'],
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
        msgSuccess: 'Redirigiendo a WhatsApp para finalizar la reserva...',
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
        infoSchedule: 'Schedule', infoScheduleVal: 'Mon–Sun · Breakfast from 8:00',
        infoRice: 'Rice dishes', infoRiceVal: 'Saturdays and Sundays · Pre-booking required',
        infoGroups: 'Groups', infoGroupsVal: 'Team dinners and tailor-made events',
        infoContact: 'Contact',
        algTitle: '<em>Allergen</em> legend',
        algDesc: 'In accordance with Regulation (EU) 1169/2011. If you have any allergies or intolerances, please consult our team. All our dishes may contain traces.',
        algInfo: 'Mandatory information',
        algWarning: 'All our dishes may contain traces of the indicated allergens. If you have any food allergy or intolerance, please inform our staff. Your safety is our priority.',
        mapTitle: 'How to find us?',
        mapSub: 'Club Valenciano de Natacion · Valencia',
        formTitle: 'Make a reservation',
        formSubtitle: 'We confirm within 24 hours',
        labelName: 'Name', labelPhone: 'Phone', labelEmail: 'Email', labelDate: 'Date', labelTime: 'Time', labelGuests: 'Guests',
        phName: 'Your name', phPhone: '+34 000 000 000', phEmail: 'your@email.com', phGuests: 'E.g. 4',
        submit: 'Request booking',
        footerTag: 'Mediterranean flavor<br>with a sporting soul.',
        footerAddr: 'Sports Complex · Valencia<br>restaurante@elpalmaret.com',
        fCarta: 'Menu', fServicios: 'Services', fReservas: 'Bookings',
        fMenu1: 'Signature tapas', fMenu2: 'Rice & grill', fMenu3: 'The grill', fMenu4: 'Healthy performance', fMenu5: 'Homemade desserts',
        fServ1: 'Breakfast', fServ2: 'Executive menu', fServ3: 'Athlete menu', fServ4: 'Team dinners', fServ5: 'Custom events',
        fRes1: 'Book a table', fRes2: 'Groups', fRes3: 'Our team', fRes4: 'Gallery',
        copy: '© 2025 El Palmaret — All rights reserved',
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
        serviceCardDescs: ['Country bread with all accompaniments. The Valencian morning ritual, as it should be.', 'Market cuisine, fresh produce and daily rotation for members who live around the club.', 'Paellas, wood-fired rice, grilled meats and fish. The Saturday and Sunday ritual.', 'Special menu for athletes. Nutritious yet gourmet dishes for daily training.', 'Group menus, celebrations and tailor-made events. We help you celebrate the win.', 'Quality food to go. Technology and agility for athletes on the move.'],
        menuEyebrow: 'Our menu',
        menuTitle: 'Valencian tradition<br><em>with avant-garde technique</em>',
        menuDesc: 'Dishes designed for sharing. Local produce, seasonal respect and our team\'s technical touch. Prices include VAT.',
        sharingTitle: 'Sharing Menu',
        sharingDesc: 'The complete El Palmaret experience. Dishes designed to be enjoyed by everyone at the table. Full table only.',
        sharingPrice1: 'without drinks / p',
        sharingPrice2: 'with drinks / p',
        sharingList: ['Bluefin tuna and avocado tartare', 'House Russian salad', 'Iberian ham croquettes (2pcs)', 'Artichoke flower with truffle and ham salt', 'Seasonal rice dish', 'Homemade dessert of your choice'],
        algNames: ['Gluten', 'Crustaceans', 'Eggs', 'Fish', 'Peanuts', 'Soy', 'Dairy', 'Nuts', 'Celery', 'Mustard', 'Sesame', 'Sulphites', 'Lupin', 'Molluscs'],
        filterLabels: ['Full menu', 'To share', 'Salads', 'Cold tapas', 'Hot tapas', 'Sandwiches', 'Rice', 'Meat', 'Healthy', 'Desserts'],
        categoryTitles: ['Signature tapas', 'Salads', 'Cold tapas', 'Hot tapas', 'Sandwiches & Toasts', 'Rice & Fideua', 'The Third Half Grill', 'Healthy Performance', 'Homemade desserts'],
        categorySubtitles: ['Classic Valencian dishes with Esteve\'s technical touch', 'Fresh, seasonal and local produce', 'A great start', 'From direct fire to the table', 'For lunch and sports take-away', 'Available Saturdays and Sundays. Pre-booking required', 'Wood-fired meats and fish. The weekend star service', 'For everyday athletes. Nutritious but gourmet', 'Made fresh every day with local products'],
        categoryBadges: ['Our DNA', 'Weekend', 'Athletes'],
        featuredLabels: ['House signature', 'Must-try', 'Classic', 'The star', 'Sea and mountain', 'Iconic', 'Classic'],
        featuredNames: ['Bluefin tuna and avocado tartare', 'Artichoke flower, ham salt and truffle', 'House Russian salad', 'Traditional Valencian chicken and rabbit paella', 'Iberian pork rice with garlic shoots and boletus', 'Horchata tiramisu with fartons', 'French toast with horchata ice cream'],
        featuredDescs: ['Mediterranean tuna, creamy avocado, ikura, sesame oil and wasabi. Served chilled over ginger.', 'Local artichoke roasted as a flower, black truffle oil and Iberian ham salt. Elegant local produce.', 'Esteve\'s own recipe. Potato, carrot, peas and artisan mayo. A Valencian tapas benchmark.', 'Traditional recipe. D.O. Valencia rice, free-range chicken, rabbit, garrofó beans, green beans and saffron. Wood-fired.', 'Acorn-fed Iberian pork, seasonal boletus edulis, garlic shoots and white truffle oil.', 'Our reinterpretation of the classic with Valencian tiger-nut horchata, mascarpone and toasted fartons.', 'Caramelized brioche, anglaise cream and artisan Alboraya horchata ice cream.'],
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
        msgSuccess: 'Redirecting to WhatsApp to finalize your booking...',
        msgError: 'We could not send your booking right now. Please try again in a few minutes.',
        cookieTitle: 'Cookie Settings',
        cookieText: 'We use cookies to ensure you get the best experience on our website, analyze traffic and personalize content.',
        cookieAccept: 'Accept all',
        cookieReject: 'Reject all',
        cookieSettings: 'Manage preferences'
      },
      va: {
        navExp: 'Experiencia', navGal: 'Galeria', navCarta: 'Carta', navEquipo: 'Equip', navReservar: 'Reservar',
        heroEyebrow: 'Restaurant del Club · València',
        heroTitle: 'El millor <em>tercer temps</em><br>de València.',
        heroSub: 'amb ànima esportiva',
        heroDesc: 'Unim el ritme del club amb la calma de la sobretaula mediterrània. El punt de trobada on cada moment es celebra amb sabor.',
        heroBtnReserve: 'Reservar taula', heroBtnMenu: 'Veure carta →',
        teamTitle: 'El nostre equip',
        reserveTitle: 'Reserva la teua<br><em>experiència</em>',
        reserveDesc: 'Acompanya\'ns a taula. Tant si vens a dinar amb l\'equip com a celebrar la victòria, en El Palmaret sempre hi ha un lloc per a tu.',
        infoSchedule: 'Horari', infoScheduleVal: 'Dl–Dg · Desdejunis des de les 8:00h',
        infoRice: 'Arrossos', infoRiceVal: 'Dissabtes i diumenges · Amb reserva prèvia',
        infoGroups: 'Grups', infoGroupsVal: 'Sopars d\'equip i esdeveniments a mida',
        infoContact: 'Contacte',
        algTitle: 'Llegenda d\'<em>Al·lergògens</em>',
        algDesc: 'Conforme al Reglament (UE) 1169/2011. Si teniu alguna al·lèrgia o intolerància, consulteu amb el nostre equip. Tots els nostres plats poden contindre traces.',
        algInfo: 'Informació obligatòria',
        algWarning: 'Tots els nostres plats poden contindre traces dels al·lergògens indicats. Si teniu alguna al·lèrgia o intolerància alimentària, informeu al nostre personal. La vostra seguretat és la nostra prioritat.',
        mapTitle: 'Com arribar?',
        mapSub: 'Club Valencià de Natació · València',
        formTitle: 'Fer una reserva',
        formSubtitle: 'Confirmem en menys de 24 hores',
        labelName: 'Nom', labelPhone: 'Telèfon', labelEmail: 'Email', labelDate: 'Data', labelTime: 'Hora', labelGuests: 'Comensals',
        phName: 'El teu nom', phPhone: '+34 000 000 000', phEmail: 'el_teu@email.com', phGuests: 'Ex. 4',
        submit: 'Sol·licitar reserva',
        footerTag: 'Sabor mediterrani<br>amb ànima esportiva.',
        footerAddr: 'Complex Esportiu · València<br>restaurante@elpalmaret.com',
        fCarta: 'Carta', fServicios: 'Serveis', fReservas: 'Reserves',
        fMenu1: 'Tapeig d\'autor', fMenu2: 'Arrossos i brases', fMenu3: 'La brasa', fMenu4: 'Healthy performance', fMenu5: 'Postres casolans',
        fServ1: 'Desdejunis', fServ2: 'Menú executiu', fServ3: 'Menú esportistes', fServ4: 'Sopars d\'equip', fServ5: 'Esdeveniments a mida',
        fRes1: 'Reservar taula', fRes2: 'Grups', fRes3: 'El nostre equip', fRes4: 'Galeria',
        copy: '© 2025 El Palmaret — Tots els drets reservats',
        slogan: 'Una història que es cuina a foc lent',
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
        serviceCardDescs: ['Pa de pagés amb tots els acompanyaments. El ritual matinal valencià, com toca.', 'Cuina de mercat, producte fresc i rotació diària per al soci que viu el club.', 'Paelles, arrossos a llenya, carns i peixos a la brasa. El ritual del cap de setmana.', 'Menú especial per a esportistes. Plats nutritius però gourmet per als qui entrenen cada dia.', 'Menús de grup, celebracions i esdeveniments a mida. Organitzem la victòria amb tu.', 'Cuina de qualitat per a emportar. Tecnologia i agilitat al servei de l\'esportista en moviment.'],
        menuEyebrow: 'La nostra carta',
        menuTitle: 'Tradició valenciana<br><em>amb tècnica d\'avantguarda</em>',
        menuDesc: 'Plats dissenyats per a compartir. Producte de proximitat, respecte per la temporada i el toc tècnic del nostre equip. Els preus inclouen IVA.',
        sharingTitle: 'Menú per a compartir',
        sharingDesc: "L'experiència completa d'El Palmaret. Plats dissenyats per a disfrutar entre tots a la taula. Taula completa.",
        sharingPrice1: 'sense beguda / p',
        sharingPrice2: 'amb beguda / p',
        sharingList: ['Tàrtar de tonyina roja i alvocat', 'Ensaladilla russa de la casa', 'Croquetes de pernil ibèric (2ud)', 'Flor de carxofa amb tòfona i sal de pernil', 'Arròs de la temporada', 'Postre casolà a elegir'],
        algNames: ['Gluten', 'Crustacis', 'Ous', 'Peix', 'Cacauets', 'Soja', 'Lactis', 'Frutos Càscara', 'Api', 'Mostassa', 'Sésam', 'Sulfits', 'Altramuces', 'Mol·luscs'],
        filterLabels: ['Tota la carta', 'Per a compartir', 'Amanides', 'Tapes fredes', 'Tapes calentes', 'Entrepans', 'Arrossos', 'Carns', 'Healthy', 'Postres'],
        categoryTitles: ['Tapeig d\'autor', 'Amanides', 'Tapes fredes', 'Tapes calentes', 'Entrepans & Tostes', 'Arrossos & Fideuàs', 'La Brasa del Tercer Temps', 'Healthy Performance', 'Postres casolans'],
        categorySubtitles: ['Plats clàssics valencians amb el toc tècnic d\'Esteve', 'Fresques, de temporada i amb producte de proximitat', 'Per a començar bé', 'Del foc directe a taula', 'Per a l\'esmorzar i el take-away esportiu', 'Disponibles dissabtes i diumenges. Amb reserva prèvia', 'Carns i peixos a la llenya. El servei estrela del cap de setmana', 'Per a l\'esportista diari. Nutritiu però gourmet', 'Elaborats cada dia amb productes de la terra'],
        categoryBadges: ['El nostre ADN', 'Cap de setmana', 'Esportistes'],
        featuredLabels: ['Estrela de la casa', 'Imprescindible', 'De sempre', 'L\'estrela', 'Mar i muntanya', 'Icònic', 'De sempre'],
        featuredNames: ['Tàrtar de tonyina roja i alvocat', 'Flor de carxofa, sal de pernil i tòfona', 'Ensaladilla russa de la casa', 'Paella valenciana de pollastre i conill', 'Arròs de secret ibèric, alls tendres i boletus', 'Tiramisú d\'orxata i fartons', 'Torrija amb gelat d\'orxata'],
        featuredDescs: ['Tonyina del Mediterrani, alvocat cremós, ikura, oli de sèsam i wasabi. Servit fred sobre base de gingebre.', 'Carxofa de la terreta rostida en flor, oli de tòfona negra i sal de pernil ibèric. L\'elegància del producte de proximitat.', 'Recepta pròpia d\'Esteve. Creïlla, carlota, pésols i maionesa artesana. La referència del tapeig valencià.', 'Recepta tradicional. Arròs D.O. València, pollastre de corral, conill, garrofó, bajoqueta i safrà de la Manxa. A llenya.', 'Secret ibèric de gla, boletus edulis de temporada, alls tendres i oli de tòfona blanca.', 'La nostra reinterpretació del clàssic amb orxata de xufa valenciana, mascarpone i fartons torrats.', 'Pa brioix caramel·litzat, crema anglesa i gelat artesà d\'orxata d\'Alboraia.'],
        visionQuote: '"Més que un espai,<br><em>un futur.</em>"',
        visionSub: 'Una història que es cuina a foc lent',
        visionBtn: 'Sigues part de la història',
        teamMainTitle: 'L\'aposta que<br><em>ho fa possible</em>',
        teamRole1: 'Supervisor Gerent · Creative Chef',
        teamBio1: 'Format en Canalla Bistro (Ricard Camarena), Restaurante Vertical i cuines de Noruega. Lidera la visió creativa d\'El Palmaret amb una filosofia sense fronteres i amb tota l\'ànima.',
        teamRole2: 'Cap de Cuina',
        teamBio2: 'Especialista en arrossos valencians. Amb pas per La Favorita, Sagardi i Miss Sushi. El domini del foc i el producte local són el seu segell. La paella en les seues mans és una declaració d\'amor.',
        msgMissing: 'Completa tots els camps abans d\'enviar.',
        msgNoSlots: (remaining, hora) => `No hi ha disponibilitat per a eixa hora. Queden ${remaining} places per a les ${hora}.`,
        msgSending: 'Enviant reserva...',
        msgSuccess: 'Redirigint a WhatsApp per a finalitzar la reserva...',
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
        ['Ensalada Valenciana', 'Valencian salad'],
        ['Tomate rosa con ventresca y encurtidos', 'Pink tomato with tuna belly and pickles'],
        ['Ensalada César con pollo a la plancha', 'Caesar salad with grilled chicken'],
        ['Ensalada César', 'Caesar salad'],
        ['Poké bowl de pollo o salmón', 'Chicken or salmon poke bowl'],
        ['Poké bowl de salmón', 'Salmon poke bowl'],
        ['Ensaladilla rusa', 'Russian salad'],
        ['Hummus con crudités', 'Hummus with crudites'],
        ['Tabla de jamón ibérico y queso manchego', 'Iberian ham and Manchego board'],
        ['Anchoas del cantábrico', 'Cantabrian anchovies'],
        ['Boquerones en vinagre con aceitunas', 'Anchovies in vinegar with olives'],
        ['Tartar de atún rojo y aguacate', 'Bluefin tuna and avocado tartare'],
        ['Tartar de vaca', 'Beef tartare'],
        ['Patatas de la casa', 'House potatoes'],
        ['Torrezno de Soria', 'Soria crispy pork belly'],
        ['Pincho de tortilla', 'Spanish omelette skewer'],
        ['Croqueta de jamón ibérico', 'Iberian ham croquette'],
        ['Flor de alcachofa, sal de jamón y aceite de trufa', 'Artichoke flower, ham salt and truffle oil'],
        ['Verduras a la plancha con proteína', 'Grilled vegetables with protein'],
        ['Verduras a la plancha', 'Grilled vegetables'],
        ['Champiñones a la plancha', 'Grilled mushrooms'],
        ['Tiras de pollo con salsas', 'Chicken strips with sauces'],
        ['Sepionet a la plancha', 'Grilled baby cuttlefish'],
        ['Chipirones a la plancha', 'Grilled baby squid'],
        ['Pulpo sobre parmentier de patata', 'Octopus over potato parmentier'],
        ['Huevos rotos', 'Broken eggs'],
        ['Revuelto de morcilla con ajos tiernos y setas', 'Black pudding scramble with spring garlic and mushrooms'],
        ['Chistorra con pimientos de padrón', 'Chistorra with padron peppers'],
        ['Morcilla de Burgos con pimientos de padrón', 'Burgos black pudding with padron peppers'],
        ['Potro con ajos tiernos', 'Foal steak with spring garlic'],
        ['Tortilla de patata', 'Spanish potato omelette'],
        ['Embutido con habas', 'Cold cuts with broad beans'],
        ['Chorizo criollo, queso brie y salsa gaucha', 'Criollo chorizo, brie and gaucha sauce'],
        ['Sandwich mixto', 'Ham and cheese sandwich'],
        ['Hamburguesa de la casa', 'House burger'],
        ['Tosta de figatell, queso brie y rúcula', 'Figatell toast, brie and arugula'],
        ['Tosta de sardina ahumada y teriyaki', 'Smoked sardine and teriyaki toast'],
        ['Arroz a banda', 'Arroz a banda'],
        ['Arroz negro', 'Black rice'],
        ['Arroz de verduras', 'Vegetable rice'],
        ['Gazpacho manchego', 'Manchego gazpacho'],
        ['Fideuà de marisco', 'Seafood fideua'],
        ['Fideuà de secreto, ajos tiernos y boletus', 'Iberian pork fideua with spring garlic and boletus'],
        ['Contramuslo de pollo a la brasa', 'Grilled chicken thigh'],
        ['Entrecot de vaca vieja', 'Dry-aged beef entrecote'],
        ['Secreto ibérico', 'Iberian pork secreto'],
        ['Solomillo de ternera', 'Beef tenderloin'],
        ['Chuletas de cordero', 'Lamb chops'],
        ['Milanesa con puré de patata', 'Milanese cutlet with mashed potatoes'],
        ['Parrillada de carne para compartir', 'Mixed grill to share'],
        ['Menú deportistas del día', 'Athletes menu of the day'],
        ['Copa de yogur griego con frutas', 'Greek yogurt cup with fruit'],
        ['Corona de Alboraia', 'Alboraia crown cake'],
        ['Coca de llanda con naranja y helado', 'Coca de llanda with orange and ice cream'],
        ['Crema de naranja', 'Orange cream'],
        ['Brownie con helado', 'Brownie with ice cream'],
        ['Tarta de queso', 'Cheesecake'],
        ['Copa de yogur griego con frutas del bosque', 'Greek yogurt cup with berries'],
        ['Vegetal', 'Vegetable'],
        ['Chivito', 'Chivito'],
        ['Brascada', 'Brascada'],
        ['Almussafes', 'Almussafes'],
        ['Esgarraet', 'Esgarraet'],
        ['Coca de titaina', 'Titaina coca'],
        ['Tomate', 'Tomato'], ['cebolla tierna', 'spring onion'], ['pimiento verde', 'green pepper'], ['aceitunas', 'olives'],
        ['bacalà desmigado', 'shredded cod'], ['huerta valenciana', 'Valencian garden'], ['ventresca de bonito del norte', 'northern tuna belly'],
        ['Romana crujiente', 'crisp romaine'], ['pollo a la plancha', 'grilled chicken'], ['queso', 'cheese'], ['huevo', 'egg'],
        ['yogur griego', 'Greek yogurt'], ['frutas del bosque', 'berries'], ['granola artesana', 'artisan granola'],
        ['vegano', 'vegan'], ['Vegetariano', 'Vegetarian'], ['Tradición', 'Tradition'], ['Estrella', 'Signature'],
        ['Imprescindible', 'Must-try'], ['Top ventas', 'Best seller'], ['Para compartir', 'To share'],
        ['Opción vegana', 'Vegan option'], ['Proteína', 'Protein'], ['Ligero', 'Light'], ['Menú', 'Menu']
      ],
      va: [
        ['Ensalada Valenciana', 'Amanida valenciana'],
        ['Tomate rosa con ventresca y encurtidos', 'Tomaca rosa amb ventresca i adobats'],
        ['Ensalada César con pollo a la plancha', 'Amanida Cesar amb pollastre a la planxa'],
        ['Ensalada César', 'Amanida Cesar'],
        ['Poké bowl de pollo o salmón', 'Poké bowl de pollastre o salmo'],
        ['Poké bowl de salmón', 'Poké bowl de salmo'],
        ['Ensaladilla rusa', 'Ensaladilla russa'],
        ['Hummus con crudités', 'Hummus amb crudites'],
        ['Tabla de jamón ibérico y queso manchego', 'Taula de pernil iberic i formatge manxec'],
        ['Anchoas del cantábrico', 'Anxoves del Cantabric'],
        ['Boquerones en vinagre con aceitunas', 'Seitons en vinagre amb olives'],
        ['Tartar de atún rojo y aguacate', 'Tartar de tonyina roja i alvocat'],
        ['Tartar de vaca', 'Tartar de vedella'],
        ['Patatas de la casa', 'Creilles de la casa'],
        ['Torrezno de Soria', 'Torrezno de Soria'],
        ['Pincho de tortilla', 'Pinxo de truita'],
        ['Croqueta de jamón ibérico', 'Croqueta de pernil iberic'],
        ['Flor de alcachofa, sal de jamón y aceite de trufa', 'Flor de carxofa, sal de pernil i oli de tofona'],
        ['Verduras a la plancha con proteína', 'Verdures a la planxa amb proteina'],
        ['Verduras a la plancha', 'Verdures a la planxa'],
        ['Champiñones a la plancha', 'Xampinyons a la planxa'],
        ['Tiras de pollo con salsas', 'Tires de pollastre amb salses'],
        ['Sepionet a la plancha', 'Sepionet a la planxa'],
        ['Chipirones a la plancha', 'Xipirons a la planxa'],
        ['Pulpo sobre parmentier de patata', 'Polp sobre parmentier de creilla'],
        ['Huevos rotos', 'Ous trencats'],
        ['Revuelto de morcilla con ajos tiernos y setas', 'Remenat de botifarra amb alls tendres i bolets'],
        ['Chistorra con pimientos de padrón', 'Xistorra amb pebrots de padro'],
        ['Morcilla de Burgos con pimientos de padrón', 'Botifarra de Burgos amb pebrots de padro'],
        ['Potro con ajos tiernos', 'Poltre amb alls tendres'],
        ['Tortilla de patata', 'Truita de creilla'],
        ['Embutido con habas', 'Embotit amb faves'],
        ['Chorizo criollo, queso brie y salsa gaucha', 'XoriÃ§o crioll, formatge brie i salsa gautxa'],
        ['Sandwich mixto', 'Sandvitx mixt'],
        ['Hamburguesa de la casa', 'Hamburguesa de la casa'],
        ['Tosta de figatell, queso brie y rúcula', 'Tosta de figatell, brie i rucula'],
        ['Tosta de sardina ahumada y teriyaki', 'Tosta de sardina fumada i teriyaki'],
        ['Arroz a banda', 'Arros a banda'],
        ['Arroz negro', 'Arros negre'],
        ['Arroz de verduras', 'Arros de verdures'],
        ['Gazpacho manchego', 'Gaspatxo manxec'],
        ['Fideuà de marisco', 'Fideua de marisc'],
        ['Fideuà de secreto, ajos tiernos y boletus', 'Fideua de secret, alls tendres i boletus'],
        ['Contramuslo de pollo a la brasa', 'Contracuixa de pollastre a la brasa'],
        ['Entrecot de vaca vieja', 'Entrecot de vaca vella'],
        ['Secreto ibérico', 'Secret iberic'],
        ['Solomillo de ternera', 'Filet de vedella'],
        ['Chuletas de cordero', 'Costelles de corder'],
        ['Milanesa con puré de patata', 'Milanesa amb pure de creilla'],
        ['Parrillada de carne para compartir', 'Graellada de carn per a compartir'],
        ['Menú deportistas del día', 'Menu d\'esportistes del dia'],
        ['Copa de yogur griego con frutas', 'Copa de iogurt grec amb fruites'],
        ['Corona de Alboraia', 'Corona d\'Alboraia'],
        ['Coca de llanda con naranja y helado', 'Coca de llanda amb taronja i gelat'],
        ['Crema de naranja', 'Crema de taronja'],
        ['Brownie con helado', 'Brownie amb gelat'],
        ['Tarta de queso', 'Pastis de formatge'],
        ['Copa de yogur griego con frutas del bosque', 'Copa de iogurt grec amb fruits del bosc'],
        ['Vegetal', 'Vegetal'],
        ['Chivito', 'Xivito'],
        ['Brascada', 'Brascada'],
        ['Almussafes', 'Almussafes'],
        ['Esgarraet', 'Esgarraet'],
        ['Coca de titaina', 'Coca de titaina'],
        ['Vegano', 'Vegà'], ['Vegetariano', 'Vegetarià'], ['Tradición', 'Tradició'], ['Estrella', 'Estrela'],
        ['Imprescindible', 'Imprescindible'], ['Top ventas', 'Top vendes'], ['Para compartir', 'Per a compartir'],
        ['Opción vegana', 'Opció vegana'], ['Proteína', 'Proteïna'], ['Ligero', 'Lleuger'], ['Menú', 'Menu']
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
      document.querySelectorAll('.mi-name, .mi-desc, .mi-tag').forEach((el) => {
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
      setText('#reservationForm .rft', t().formTitle);
      setText('#reservationForm .rfs', t().formSubtitle);
      setText('#reservationForm .bfm', t().submit);

      const inputName = document.querySelector('input[name="Nombre"]');
      const inputPhone = document.querySelector('input[name="Telefono"]');
      const inputEmail = document.querySelector('input[name="Email"]');
      const inputDate = document.querySelector('input[name="Fecha"]');
      const inputTime = document.querySelector('input[name="Hora"]');
      const inputGuests = document.querySelector('input[name="Comensales"]');
      const labelName = inputName ? inputName.closest('.fg').querySelector('label') : null;
      const labelPhone = inputPhone ? inputPhone.closest('.fg').querySelector('label') : null;
      const labelEmail = inputEmail ? inputEmail.closest('.fg').querySelector('label') : null;
      const labelDate = inputDate ? inputDate.closest('.fg').querySelector('label') : null;
      const labelTime = inputTime ? inputTime.closest('.fg').querySelector('label') : null;
      const labelGuests = inputGuests ? inputGuests.closest('.fg').querySelector('label') : null;
      if (labelName) labelName.textContent = t().labelName;
      if (labelPhone) labelPhone.textContent = t().labelPhone;
      if (labelEmail) labelEmail.textContent = t().labelEmail;
      if (labelDate) labelDate.textContent = t().labelDate;
      if (labelTime) labelTime.textContent = t().labelTime;
      if (labelGuests) labelGuests.textContent = t().labelGuests;
      if (inputName) inputName.placeholder = t().phName;
      if (inputPhone) inputPhone.placeholder = t().phPhone;
      if (inputEmail) inputEmail.placeholder = t().phEmail;
      if (inputGuests) inputGuests.placeholder = t().phGuests;

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

    // ──── RESERVA: ENVIO A GOOGLE APPS SCRIPT (Versión Premium Final) ────
    const reservationForm = document.getElementById('reservationForm');
    const reservationMessage = document.getElementById('reservationMessage');
    const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzeIwy-keAyLNRBzYQK3AfUTjOfakUBbcEFrDQtdo513O8BZgxwvSpfo2j7y3KK011L/exec";

    if (reservationForm && reservationMessage) {
      reservationForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(reservationForm);
        const submitBtn = reservationForm.querySelector('button[type="submit"]');

        // Validar campos básicos
        if (!formData.get('Nombre') || !formData.get('Telefono')) return;

        // Feedback de envío
        if (submitBtn) submitBtn.disabled = true;
        reservationMessage.textContent = "Procesando tu reserva...";
        reservationMessage.style.color = 'rgba(237,232,213,.72)';

        // Enviar a Google Apps Script
        fetch(GOOGLE_SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',
          body: new URLSearchParams(formData)
        })
        .then(() => {
          reservationMessage.textContent = "¡Reserva recibida! Te confirmaremos pronto por email.";
          reservationMessage.style.color = '#EDE8D5';
          reservationForm.reset();
        })
        .catch(err => {
          console.error("Error envío:", err);
          reservationMessage.textContent = "Error al enviar. Inténtalo de nuevo o llámanos.";
          reservationMessage.style.color = '#E8C97A';
        })
        .finally(() => {
          if (submitBtn) submitBtn.disabled = false;
        });
      });
    }





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
        cfLeft.addEventListener('click', () => {
          cfInner.scrollBy({ left: -200, behavior: 'smooth' });
        });
        cfRight.addEventListener('click', () => {
          cfInner.scrollBy({ left: 200, behavior: 'smooth' });
        });
      }
    });
