
import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. FIX THE TEXT COLORS IN RESPONSIVE CSS
bad_css = """      /* Marcos finos en vez de barras grises */
      .sw-v, .sw-n, .sw-d, .sw-g, body { background: #f1f1f1 !important; }
      section { padding: 30px 15px !important; }
      .cc, .rv, .vis-inner, .carta-item { 
        background: #fbfaf5 !important; 
        border: 1px solid rgba(15,35,55,0.08) !important; 
        padding: 40px 25px !important;
        margin-bottom: 20px !important;
        border-radius: 4px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.02);
      }"""

good_css = """      /* Marcos finos en vez de barras grises */
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
      
      /* CORRECCIÓN DE COLORES BLANCOS A OSCUROS EN MÓVIL FRONT-END */
      .sw-n .st, .sw-v .st, .sw-d .st, .sw-n .crl, .sw-n .cnm, .sw-d .rl h2, .sc2 h3, .vis-q {
        color: var(--navy-dark) !important;
      }
      .sw-n .cbi, .sw-v p, .sw-d p, .sw-n p, .sc2 p, .ir span, .vis-sub {
        color: rgba(27, 58, 92, 0.7) !important;
      }
      .ir strong { color: var(--navy-dark) !important; }"""

html = html.replace(bad_css, good_css)

# 2. FIX THE HERO TO REMOVE CAROUSEL COMPLETELY
hero_pattern = re.compile(r'<div class="hcont">.*?</div>\s*</div>\s*</div>\s*</div>', re.DOTALL)
new_hero = """<div class="hcont" style="justify-content:center;text-align:center;">
      <div style="max-width:900px; margin:0 auto;">
        <div class="hey">Restaurante del Club · Valencia</div>
        <h1 class="hh1">El mejor <em>tercer tiempo</em><br>de Valencia.<span style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);"> | Restaurante en Valencia especialista en Arroces, Brasas y Tapeo Deportivo</span></h1>
        <div class="hh1s">con alma deportiva</div>
        <p class="hdes" style="margin-left:auto; margin-right:auto;">Unimos el ritmo del club con la calma de la sobremesa mediterránea. El punto de encuentro donde cada momento se celebra con sabor.</p>
        <div class="hact" style="justify-content:center;">
          <a href="#reserva" class="bp">Reservar mesa</a>
          <a href="#carta" class="bg">Ver carta →</a>
        </div>
      </div>
    </div>"""

# Replace the block. Find start of hcont to the matching end.
# A simpler way: we know it starts at <div class="hcont"> and ends before <!-- ═  EXPERIENCIA  ═ --> 
# Wait, let's just use string replace on the exact substring.
start_idx = html.find('<div class="hcont">')
end_idx = html.find('<!-- ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═  EXPERIENCIA ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═  -->')

if start_idx != -1 and end_idx != -1:
    # Also find the closing </div> of <div class="hero" id="home"> which is before EXPERIENCE
    end_hero_div = html.rfind('</div>', start_idx, end_idx)
    html = html[:start_idx] + new_hero + '\n  ' + html[end_hero_div:]

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
