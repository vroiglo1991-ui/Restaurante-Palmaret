# -*- coding: utf-8 -*-
import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. ACTUALIZAR HTML DEL HERO
hero_html_new = '''    <div class="hero" id="home">
      <div class="hbg"></div>
      <div class="hgrain"></div>
      <div class="htex"></div>
      <div class="hglow"></div>
      <div class="hcont">
        <div class="hcont-inner">
          <div class="hey">Restaurante del club · Valencia</div>
          <h1 class="hh1">El mejor <em>tercer tiempo</em><br>de Valencia.<span style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);"> | Restaurante en Valencia especialista en Arroces, Brasas y Tapeo Deportivo</span></h1>
          <div class="hh1s">con alma deportiva</div>
          <p class="hdes">Unimos el ritmo del club con la calma de la sobremesa mediterránea.<br>El punto de encuentro donde cada momento se celebra con sabor.</p>
          <div class="hact">
            <a href="#reserva" class="bp">Reservar mesa</a>
            <a href="#carta" class="bg">Ver carta &rarr;</a>
          </div>
        </div>
      </div>
    </div>'''

hero_pattern = re.compile(r'<div class="hero" id="home">.*?<!--.*?TICKER', re.DOTALL)
html = hero_pattern.sub(hero_html_new + '\n\n    <!-- ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═  TICKER', html)

# 2. ACTUALIZAR CSS DEL HERO EN INDEX.HTML
css_new = '''
    .hcont {
      position: relative;
      z-index: 2;
      width: 100%;
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 4rem;
      padding-top: 5rem;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      min-height: 100vh;
    }

    .hcont-inner {
      max-width: 850px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .hey {
      font-family: var(--fc);
      font-size: .75rem;
      font-weight: 600;
      letter-spacing: .3em;
      text-transform: uppercase;
      color: var(--gold);
      margin-bottom: 2.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1.5rem;
      opacity: 0;
      animation: fu .8s .3s ease forwards;
    }

    .hey::before, .hey::after {
      content: "";
      width: 2.5rem;
      height: 1px;
      background: var(--gold);
      flex-shrink: 0;
    }

    .hh1 {
      font-family: var(--fd);
      font-size: clamp(3.2rem, 5.5vw, 6.5rem);
      font-weight: 300;
      line-height: 1.05;
      color: var(--cream);
      margin-bottom: 0.5rem;
      opacity: 0;
      animation: fu .9s .5s ease forwards;
      text-align: center;
    }

    .hh1 em {
      font-style: italic;
      color: var(--gold);
      font-weight: 300;
    }

    .hh1s {
      font-family: var(--fd);
      font-size: clamp(1.4rem, 2.5vw, 2.2rem);
      font-weight: 400;
      font-style: italic;
      color: var(--gold);
      margin-bottom: 3.5rem;
      opacity: 0;
      animation: fu .8s .7s ease forwards;
      text-align: center;
    }

    .hdes {
      font-size: 0.95rem;
      font-weight: 300;
      line-height: 2;
      color: rgba(237, 232, 213, .68);
      max-width: 580px;
      margin: 0 auto 3.5rem;
      opacity: 0;
      animation: fu .8s .9s ease forwards;
      text-align: center;
    }

    .hact {
      display: flex;
      gap: 1.5rem;
      align-items: center;
      justify-content: center;
      flex-wrap: wrap;
      opacity: 0;
      animation: fu .8s 1.1s ease forwards;
    }

    .hbg {
      position: absolute;
      inset: 0;
      background: linear-gradient(rgba(10,20,40,0.45), rgba(10,20,40,0.65)), url('assets/img/gallery/paella.jpg') center/cover no-repeat;
    }
'''

css_injection = "    /* OVERRIDE HERO VIP */" + css_new + "\\n  </style>"
html = html.replace("</style>", css_injection)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
