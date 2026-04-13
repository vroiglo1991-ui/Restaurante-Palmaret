
import os
from PIL import Image

def final_polish(directory):
    for filename in os.listdir(directory):
        if filename.lower().endswith(('.jpg', '.jpeg')):
            filepath = os.path.join(directory, filename)
            filesize = os.path.getsize(filepath)
            if filesize > 500 * 1024:
                img = Image.open(filepath)
                # Resize if > 1600px
                if img.width > 1600:
                    ratio = 1600 / img.width
                    img = img.resize((1600, int(img.height * ratio)), Image.LANCZOS)
                img.save(filepath, quality=70, optimize=True)
                print(f"Polished {filename} down to {os.path.getsize(filepath)/1024:.1f} KB")

if __name__ == "__main__":
    final_polish("assets/img")
