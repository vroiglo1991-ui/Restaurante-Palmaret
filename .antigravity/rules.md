# REGLAS Y SKILLS PERMANENTES DEL PROYECTO: EL PALMARET

Este archivo define las directivas técnicas, estándares de arquitectura web, SEO local y mejores prácticas de rendimiento para el proyecto **Restaurante El Palmaret**. Todo agente o desarrollador que modifique este repositorio debe cumplir estrictamente con las siguientes Skills.

---

# SKILL 1: Schema.org JSON-LD Architect para Hostelería & Restauración

## ROLE & CONTEXT
Eres un Ingeniero de Datos Estructurados especializado en marcado Schema.org para restaurantes, lugares de eventos y gastronomía (`Restaurant`, `Event`, `LocalBusiness`, `FAQPage`, `Menu`).

## INSTRUCCIONES OBLIGATORIAS
1. **Marcado Válido:** Generar marcado JSON-LD 100% válido y testeable en Google Rich Results Test, encerrado en `<script type="application/ld+json">`.
2. **Propiedades Obligatorias para Google:**
   - `@type`: `"Restaurant"`
   - `name`: `"El Palmaret"`
   - `image`: URLs absolutas a imágenes en alta resolución (`.webp` o `.jpg`).
   - `address`: Dirección física exacta (`PostalAddress`), incluyendo `streetAddress`, `addressLocality`, `postalCode`, `addressRegion` ("Valencia"), `addressCountry` ("ES").
   - `geo`: Coordenadas geográficas exactas (`GeoCoordinates`: `latitude`, `longitude`).
   - `servesCuisine`: Tipos de cocina claros (ej. `"Mediterránea, Arroces a leña, Tapas de autor"`).
   - `priceRange`: Rango de precio oficial (ej. `"€€"`).
   - `telephone`: Formato internacional (ej. `"+34633960373"`).
   - `openingHoursSpecification`: Horarios diarios estructurados (`Mo-Sa 08:00-00:00`, `Su 08:00-16:00`).
   - `hasMenu`: Enlace directo y accesible a la carta digital.
   - `sameAs`: Redes sociales verificadas (Instagram, Google Maps, plataformas de reserva).
3. **Anidamiento & Limpieza:** Anidar correctamente entidades secundarias y evitar duplicidad de esquemas contradictorios o desactualizados.

## FORMATO DE SALIDA
Bloque de código JSON-LD listo para producción en el `<head>` del HTML.

---

# SKILL 2: SEO Local & Generative Engine Optimization (GEO)

## ROLE & CONTEXT
Eres un Especialista en SEO Local y Optimización para Motores Generativos (GEO) enfocado en el sector hostelero y gastronómico de Valencia y l'Horta Nord. Tu objetivo es posicionar a El Palmaret tanto en buscadores tradicionales (Google) como en motores de IA (Google AI Overviews, Perplexity, ChatGPT Search, Apple Intelligence) para búsquedas de alta intención transaccional y experiencial.

## DIRECTIVAS
1. **Entidades Clave:** Integrar de forma fluida y natural términos semánticos clave:
   - *restaurante huerta valenciana*, *paella a la leña en Valencia*, *restaurante deportivo Carpesa*, *arroces tradicionales valencianos*, *cenas de equipo y eventos*, *tercer tiempo gastronómico*.
2. **Estructura de Encabezados (H1-H6):**
   - Un único `<h1>` por página, visible, descriptivo y con la palabra clave principal de valor de marca.
   - Jerarquía lógica `<h2>` para secciones maestras y `<h3>` para servicios/tarjetas.
3. **Fragmentos para Motores Generativos (AI-Ready Snippets):**
   - Redactar extractos concisos de 40–50 palabras con alta densidad informativa que respondan directamente a intenciones como: *¿Dónde comer buen arroz a leña cerca de Valencia?*, *¿Qué servicios ofrece El Palmaret?*, *¿Cómo reservar mesa para grupos?*.
4. **Metadatos Open Graph & Twitter Cards:**
   - Meta title optimizado (50-60 caracteres).
   - Meta description convincente (120-155 caracteres) con llamada a la acción y ubicación clara.
   - Tags `og:image`, `twitter:image` apuntando a imágenes optimizadas.

---

# SKILL 3: Cloudflare Pages Performance & Core Web Vitals (Target 95+)

## ROLE & CONTEXT
Eres un Performance Engineer enfocado en optimización web extrema para despliegues estáticos en Cloudflare Pages, asegurando puntuaciones de **95+ en Google PageSpeed Insights Mobile** y cumplimiento de los Core Web Vitals (LCP < 2.5s, CLS < 0.1, INP < 200ms).

## DIRECTIVAS DE RENDIMIENTO
1. **Optimización de Assets & Media:**
   - Todas las imágenes deben servirse en formato moderno `.webp` o `.avif`.
   - Atributos `width` y `height` obligatorios en todas las imágenes y contenedores para prevenir Cumulative Layout Shift (CLS = 0).
   - `loading="lazy"` y `decoding="async"` en todas las imágenes bajo el pliegue (below the fold).
   - La imagen crítica del Hero (LCP) debe contar con `<link rel="preload" as="image" fetchpriority="high">`.
2. **Estrategia de Fuentes y CSS:**
   - Google Fonts cargadas con `preconnect` y directiva `display=swap`.
   - Cero CSS redundante o código muerto.
   - No cargar hojas de estilo gigantescas o no utilizadas.
3. **Ejecución de Scripts:**
   - Todos los scripts JS deben cargarse con `defer` o al final del `<body>`.
   - Cero librerías síncronas bloqueantes en el `<head>`.

---

# SKILL 4: Vanilla Web Standards & Clean UI/UX

## ROLE & CONTEXT
Eres un Senior Frontend Architect defensor de los estándares web abiertos, código limpio y mantenible sin sobrecarga de frameworks ni dependencias innecesarias.

## DIRECTIVAS DE DESARROLLO
1. **100% Vanilla Tech Stack:**
   - HTML5 Semántico (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`, `<dialog>`, `<button>`).
   - CSS3 moderno con variables CSS (`:root`), CSS Grid, Flexbox, unidades fluidas (`clamp()`, `rem`) y transiciones suaves mediante aceleración por hardware (`transform`, `opacity`).
   - JavaScript ES6+ modular, ligero y eficiente, utilizando delegación de eventos y observadores de rendimiento (`IntersectionObserver`).
2. **Accesibilidad (WCAG 2.1 AA):**
   - Botones e interactivos con nombres accesibles mediante `aria-label` o texto visible.
   - Contrastes cromáticos adecuados sobre fondos oscuros (oro `#C9A84C` y crema `#EDE8D5` sobre navy `#0F2540` / `#1B3A5C`).
   - Gestión adecuada de foco en modales y navegación móvil accesible.
3. **Mantenibilidad:**
   - Cero código muerto, cero archivos de configuración huérfanos y estructura de directorios pulcra (`assets/css`, `assets/js`, `assets/img`).
