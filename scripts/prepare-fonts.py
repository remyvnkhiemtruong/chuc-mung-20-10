"""Fetch and subset open-source fonts for self-hosting; requires fonttools and brotli."""
import re
import urllib.request
from pathlib import Path
from fontTools import subset
from fontTools.ttLib import TTFont

folder = Path('public/assets/fonts')
folder.mkdir(parents=True, exist_ok=True)
url = 'https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600&family=Noto+Serif:ital,wght@0,400;1,400&display=swap'
source = urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})).read().decode()
css = []
for block in re.findall(r'@font-face\s*\{([^}]+)\}', source):
    family = re.search(r"font-family: '([^']+)'", block)[1]
    weight = re.search(r'font-weight: (\d+)', block)[1]
    style = re.search(r'font-style: (\w+)', block)[1]
    remote = re.search(r'url\(([^)]+)\)', block)[1]
    stem = ('be-vietnam-pro' if family == 'Be Vietnam Pro' else 'noto-serif') + f'-{weight}-{style}'
    local = Path('reports') / (stem + '.ttf')
    local.write_bytes(urllib.request.urlopen(remote).read())
    font = TTFont(local)
    options = subset.Options()
    options.flavor = 'woff2'
    cutter = subset.Subsetter(options=options)
    cutter.populate(unicodes=list(range(0x20, 0x250)) + list(range(0x300, 0x370)) + list(range(0x1e00, 0x1f00)) + list(range(0x2000, 0x2070)))
    cutter.subset(font)
    font.flavor = 'woff2'
    font.save(folder / (stem + '.woff2'))
    css.append(f'@font-face{{font-family:"{family}";font-style:{style};font-weight:{weight};font-display:swap;src:url("./fonts/{stem}.woff2") format("woff2")}}')
    print(stem, (folder / (stem + '.woff2')).stat().st_size)
Path('public/assets/fonts.css').write_text('\n'.join(css) + '\n', encoding='utf-8')
for name, remote in [('Be-Vietnam-Pro-OFL.txt', 'https://raw.githubusercontent.com/google/fonts/main/ofl/bevietnampro/OFL.txt'), ('Noto-Serif-OFL.txt', 'https://raw.githubusercontent.com/google/fonts/main/ofl/notoserif/OFL.txt')]:
    (folder / name).write_bytes(urllib.request.urlopen(remote).read())
