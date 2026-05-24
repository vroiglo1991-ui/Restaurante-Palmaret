import os
from bs4 import BeautifulSoup

def audit_seo(file_path):
    print(f"--- Evaluando SEO de: {file_path} ---")
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            html = f.read()
    except Exception as e:
        print(f"Error leyendo {file_path}: {e}")
        return

    soup = BeautifulSoup(html, 'html.parser')
    score = 100
    penalties = []

    # 1. Título
    title = soup.find('title')
    if not title or not title.string:
        penalties.append("- Falta la etiqueta <title>")
        score -= 20
    else:
        text = title.string
        print(f"[OK] Título encontrado: {text}")
        if "Carpesa" not in text and "Valencia" not in text:
            penalties.append("- El título debería incluir la localidad (Carpesa/Valencia)")
            score -= 10
        if len(text) < 30 or len(text) > 60:
            penalties.append(f"- Longitud del título ({len(text)} chars) subóptima (ideal 30-60)")
            score -= 5

    # 2. Meta Description
    meta_desc = soup.find('meta', attrs={'name': 'description'})
    if not meta_desc or not meta_desc.get('content'):
        penalties.append("- Falta la etiqueta <meta name='description'>")
        score -= 20
    else:
        content = meta_desc.get('content')
        print(f"[OK] Meta Descripción encontrada ({len(content)} chars)")
        if len(content) < 100 or len(content) > 160:
            penalties.append(f"- Longitud de meta descripción ({len(content)} chars) subóptima (ideal 100-160)")
            score -= 5
        if "Carpesa" not in content and "Valencia" not in content:
            penalties.append("- La descripción debería incluir la localidad (Carpesa/Valencia)")
            score -= 10

    # 3. H1
    h1s = soup.find_all('h1')
    if len(h1s) == 0:
        penalties.append("- No hay etiqueta <h1>")
        score -= 15
    elif len(h1s) > 1:
        penalties.append(f"- Demasiados <h1> ({len(h1s)}). Debería haber solo 1.")
        score -= 10
    else:
        print("[OK] <h1> único encontrado")

    # 4. JSON-LD (Schema)
    schemas = soup.find_all('script', type='application/ld+json')
    if not schemas:
        penalties.append("- No se encontró Schema Markup (JSON-LD) para SEO Local")
        score -= 15
    else:
        print(f"[OK] {len(schemas)} bloques de Schema Markup encontrados")

    print("\n--- RESULTADO FINAL ---")
    print(f"Puntuación SEO Local: {score}/100")
    if penalties:
        print("Áreas de mejora:")
        for p in penalties:
            print(p)
    else:
        print("¡Perfecto! El SEO local está optimizado.")

if __name__ == "__main__":
    import sys
    # Si no se le pasa archivo, revisa el index.html
    target = sys.argv[1] if len(sys.argv) > 1 else "index.html"
    if os.path.exists(target):
        audit_seo(target)
    else:
        print(f"No se encontró el archivo: {target}")
