
import os
from PIL import Image

def optimize_images(directory):
    files = [f for f in os.listdir(directory) if f.lower().endswith(('.jpg', '.jpeg', '.png'))]
    
    for filename in files:
        filepath = os.path.join(directory, filename)
        filesize = os.path.getsize(filepath)
        
        # Only touch images larger than 400KB
        if filesize > 400 * 1024:
            print(f"Optimizing {filename} ({filesize/1024:.1f} KB)...")
            try:
                img = Image.open(filepath)
                
                # Resize if way too big (max 1920 width for photos)
                if img.width > 2000:
                    ratio = 1920 / img.width
                    new_size = (1920, int(img.height * ratio))
                    # Special case for logo: logos shouldn't be 1920px
                    if "logo" in filename.lower():
                        new_size = (600, int(600 * (img.height / img.width)))
                    
                    img = img.resize(new_size, Image.LANCZOS)

                # Save with optimization
                if filename.lower().endswith('.png'):
                    # PNG optimization
                    img.save(filepath, optimize=True)
                else:
                    # JPG optimization
                    img.save(filepath, quality=80, optimize=True)
                
                new_filesize = os.path.getsize(filepath)
                print(f"  -> New size: {new_filesize/1024:.1f} KB (Saved { (filesize-new_filesize)/1024:.1f} KB)")
            except Exception as e:
                print(f"Error optimizing {filename}: {e}")

if __name__ == "__main__":
    optimize_images("assets/img")
