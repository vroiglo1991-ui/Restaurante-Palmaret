
import sys

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Fix applyLanguage
missing_apply_lang_start = """    function applyLanguage(lang) {
      if (!I18N[lang]) return;
      currentLang = lang;
      localStorage.setItem('palmaretLang', lang);
      document.documentElement.lang = lang === 'va' ? 'ca' : lang;
      langButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.lang === lang));

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
      setText('#servicio .ey', t().serviceEyebrow);
      setText('#servicio .st', t().serviceTitle, true);"""

# The file currently has:
#    function applyMenuTranslations(lang) { ... }
# 
#       setText('#servicio .srv-header p', t().serviceDesc);

if "setText('#servicio .srv-header p'" in content and "function applyLanguage(lang)" not in content:
    target = "      setText('#servicio .srv-header p'"
    content = content.replace(target, missing_apply_lang_start + "\n" + target)

# 2. Fix Hamburger JS
hamburger_js = """    const hamburgerBtn = document.getElementById('hamburger');
    const navMenuEl = document.getElementById('navMenu');
    if (hamburgerBtn && navMenuEl) {
      hamburgerBtn.addEventListener('click', () => {
        navMenuEl.classList.toggle('active');
      });
      navMenuEl.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => navMenuEl.classList.remove('active'));
      });
    }"""

if "hamburgerBtn" not in content:
    target_footer = "      setText('.fg2 > div:nth-child(3) li:nth-child(3) a', t().fServ3);"
    new_footer = target_footer + """
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
    }\n\n""" + hamburger_js
    content = content.replace(target_footer, new_footer)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)
