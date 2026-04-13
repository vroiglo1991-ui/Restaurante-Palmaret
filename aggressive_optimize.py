
import os
from PIL import Image

def aggressive_logo_fix(directory):
    files = ["logodorado_trans.png", "logodorado.png", "chefjpg.png"]
    for filename in files:
        filepath = os.path.join(directory, filename)
        if os.path.exists(filepath):
            img = Image.open(filepath)
            # Max width 800 for transparency logos, 1200 for chef
            max_w = 800 if "logo" in filename.lower() else 1000
            if img.width > max_w:
                ratio = max_w / img.width
                img = img.resize((max_w, int(img.height * ratio)), Image.LANCZOS)
            
            # Use smaller palette for PNG if it's too heavy
            if filename.endswith(".png"):
                img = img.convert("RGBA").convert("P", palette=Image.ADAPTIVE, colors=256)
                img.save(filepath, optimize=True)
            else:
                img.save(filepath, quality=75, optimize=True)
            
            print(f"Aggressively optimized {filename} to {os.path.getsize(filepath)/1024:.1f} KB")

if __name__ == "__main__":
    aggressive_logo_fix("assets/img")
