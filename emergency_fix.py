
import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. INYECTAR CSS RESPONSIVE (Marcos finos)
responsive_styles = """
    /* --- FIX RESPONSIVE PREMIUM --- */
    @media (max-width: 768px) {
      .sw-v, .sw-n, .sw-d, .sw-g, body { background: #f1f1f1 !important; }
      section { padding: 30px 15px !important; }
      .cc, .rv, .vis-inner, .carta-item { 
        background: #fbfaf5 !important; 
        border: 1px solid rgba(15,35,55,0.08) !important; 
        padding: 40px 25px !important;
        margin-bottom: 20px !important;
        border-radius: 4px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.02);
      }
      .ey { margin-bottom: 10px; }
      .st { font-size: 2.2rem !important; margin-bottom: 30px !important; }
    }
"""
content = content.replace('</style>', responsive_styles + '\n  </style>')

# 2. ARREGLAR JS (Header, Menú e Idiomas)
js_fix = """
  // --- FIX HEADER & LANGUAGES ---
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('navMenu');
  
  if (hamburger) {
    hamburger.onclick = () => {
      navMenu.classList.toggle('active');
    };
  }

  // Cerrar menú al hacer click en un link
  document.querySelectorAll('#navMenu a').forEach(link => {
    link.onclick = () => navMenu.classList.remove('active');
  });

  // FUNCIONALIDAD DE IDIOMAS
  const langButtons = document.querySelectorAll('.lang-btn');
  langButtons.forEach(btn => {
    btn.onclick = (e) => {
      const l = e.currentTarget.getAttribute('data-lang');
      console.log('Cambiando a:', l);
      
      // Actualizar botones activos
      langButtons.forEach(b => b.classList.remove('active'));
      document.querySelectorAll(`.lang-btn[data-lang="${l}"]`).forEach(b => b.classList.add('active'));
      
      // Aquí el objeto I18N ya debería existir en tu código previo
      if (typeof setLang === 'function') {
        setLang(l);
      } else {
        // Fallback si no está la función
        localStorage.setItem('lang', l);
        window.location.reload(); 
      }
    };
  });
"""

# Insertar el JS de arreglo antes del cierre de body
content = content.replace('</body>', '<script>' + js_fix + '</script>\n</body>')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)
