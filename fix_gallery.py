import subprocess
result = subprocess.run(['git', 'cat-file', '-p', '6db6ba8:index.html'], capture_output=True)
raw = result.stdout
with open('index.html', 'wb') as f:
    f.write(raw)
print(f"Written {len(raw)} bytes")
with open('index.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()
print(f"Lines: {len(lines)}")
# Verify key content
for i, l in enumerate(lines):
    if 'heroTitle' in l and 'Sabor' in l:
        print(f"L{i+1} heroTitle: {l.rstrip()[:100]}")
    if 'tercer tiempo' in l and 'hh1' in l:
        print(f"L{i+1} h1: {l.rstrip()[:100]}")
