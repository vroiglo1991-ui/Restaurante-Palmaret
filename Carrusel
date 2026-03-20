/* ══════════════════════════════════════
   CARRUSELES — Hero + Local + Galería
══════════════════════════════════════ */

// ── HERO CAROUSEL
let hIdx = 0;
const hSlides = document.querySelectorAll('#heroTrack .slide');
const hDots   = document.querySelectorAll('#heroDots .hcd');

function heroGo(i) {
  hSlides[hIdx].classList.remove('active');
  hDots[hIdx].classList.remove('active');
  hIdx = (i + hSlides.length) % hSlides.length;
  hSlides[hIdx].classList.add('active');
  hDots[hIdx].classList.add('active');
}

document.getElementById('heroNext').addEventListener('click', () => heroGo(hIdx + 1));
document.getElementById('heroPrev').addEventListener('click', () => heroGo(hIdx - 1));
hDots.forEach((d, i) => d.addEventListener('click', () => heroGo(i)));
setInterval(() => heroGo(hIdx + 1), 4500);


// ── LOCAL CAROUSEL (sección Experiencia)
let lcIdx = 0;
const lcSlides = document.querySelectorAll('#lcTrack .lc-slide');
const lcDots   = document.querySelectorAll('#lcDots .lc-dot');

function lcGo(i) {
  lcSlides[lcIdx].classList.remove('active');
  lcDots[lcIdx].classList.remove('active');
  lcIdx = (i + lcSlides.length) % lcSlides.length;
  lcSlides[lcIdx].classList.add('active');
  lcDots[lcIdx].classList.add('active');
}

document.getElementById('lcNext').addEventListener('click', () => lcGo(lcIdx + 1));
document.getElementById('lcPrev').addEventListener('click', () => lcGo(lcIdx - 1));
lcDots.forEach((d, i) => d.addEventListener('click', () => lcGo(i)));
setInterval(() => lcGo(lcIdx + 1), 5500);


// ── GALERÍA EDITORIAL CAROUSEL
const ITEM_WIDTHS = [308, 248, 288, 268, 268, 308, 258, 288];
const GAP    = 8;
const gPages = 4;
let gPage    = 0;

const gTrack = document.getElementById('gTrack');
const gDots  = document.querySelectorAll('#gIndicator .g-dot');

function gGetOffset(page) {
  let total = 0;
  const start = page * 2;
  for (let i = 0; i < start; i++) {
    total += ITEM_WIDTHS[i % ITEM_WIDTHS.length] + GAP;
  }
  return total;
}

function gGo(page) {
  gDots[gPage].classList.remove('active');
  gPage = (page + gPages) % gPages;
  gDots[gPage].classList.add('active');
  gTrack.style.transform = `translateX(-${gGetOffset(gPage)}px)`;
}

document.getElementById('gNext').addEventListener('click', () => gGo(gPage + 1));
document.getElementById('gPrev').addEventListener('click', () => gGo(gPage - 1));
gDots.forEach((d, i) => d.addEventListener('click', () => gGo(i)));

// Swipe táctil para la galería
let gTouchStart = 0;
gTrack.addEventListener('touchstart', e => {
  gTouchStart = e.touches[0].clientX;
});
gTrack.addEventListener('touchend', e => {
  const diff = gTouchStart - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 50) gGo(gPage + (diff > 0 ? 1 : -1));
});
