import os
import re

directory = r"c:\Users\jhaan\IITBBS\life-rpg\src"

color_map = {
    '#94A3B8': '#DCE7C9', # Main Background
    '#9A624E': '#765B57', # Sidebar / Muted Brown
    '#493B36': '#4D3935', # Heading / Dark text
    '#786A63': '#8B7B74', # Text secondary
    '#F8F1E8': '#F8F5E9', # Cards / Warm cream
    '#B87868': '#EAB62D', # Gold accent
    '#D8B28E': '#DDA51C', # Hover gold
    '#E3D2C4': '#E8D9A8', # Border
    '#56665A': '#71856A', # Success
    '#E1E7DD': '#DDE8DC', # Header / Light sage
    
    # Leftovers just in case
    '#755A56': '#765B57',
    '#DDE7D2': '#DCE7C9',
}

final_map = {}
for k, v in color_map.items():
    final_map[k] = v
    final_map[k.lower()] = v.lower()

for root, _, files in os.walk(directory):
    for file in files:
        if file.endswith(".tsx") or file.endswith(".css") or file.endswith(".ts"):
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
                
            new_content = content
            for old_color, new_color in final_map.items():
                safe_old = re.escape(old_color)
                new_content = re.sub(safe_old, new_color, new_content, flags=re.IGNORECASE)
                
            if new_content != content:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f"Updated {filepath}")
