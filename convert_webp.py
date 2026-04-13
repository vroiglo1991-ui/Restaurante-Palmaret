
import os
from PIL import Image

def convert_to_webp(directory):
    for filename in os.listdir(directory):
        if filename.lower().endswith(('.jpg', '.jpeg', '.png')) and "logo" not in filename.lower():
            filepath = os.path.join(directory, filename)
            webp_path = os.path.splitext(filepath)[0] + ".webp"
            
            try:
                img = Image.open(filepath)
                # Ensure it's RGB if saving as JPG-like webp, or keep RGBA if it was PNG
                if img.mode in ('RGBA', 'P') and filename.lower().endswith('.png'):
                    img.save(webp_path, 'WEBP', transparency=0)
                else:
                    img = img.convert('RGB')
                    img.save(webp_path, 'WEBP', quality=80)
                print(f"Converted {filename} to {os.path.basename(webp_path)}")
            except Exception as e:
                print(f"Error converting {filename}: {e}")

if __name__ == "__main__":
    convert_to_webp("assets/img")
