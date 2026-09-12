import os
import re

directory = r"c:\Users\jhaan\IITBBS\life-rpg\src"

color_map = {
    # Main Primary (Sidebar, etc)
    "#b57b66": "#755A56",
    "#073F2B": "#755A56", # just in case any forest green was left
    
    # Text
    "#173D30": "#5E4A47",
    "#756A62": "#8F7B77", # Secondary text
    
    # Backgrounds
    "#E4E8D8": "#DDE7D2",
    "#FFFDF5": "#F8F3E7",
    "#F7F3E8": "#F8F3E7",
    "#F7F1E5": "#F8F3E7", # Merge slight variations
    
    # Golds
    "#D9A928": "#E8B83A",
    "#C89516": "#C49B2E",
}

# Also handle lowercase hex if any
color_map_lower = {k.lower(): v for k, v in color_map.items() if k.startswith("#")}
color_map.update(color_map_lower)

for root, _, files in os.walk(directory):
    for file in files:
        if file.endswith(".tsx") or file.endswith(".css") or file.endswith(".ts"):
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
                
            new_content = content
            for old_color, new_color in color_map.items():
                safe_old = re.escape(old_color)
                new_content = re.sub(safe_old, new_color, new_content, flags=re.IGNORECASE)
                
            if new_content != content:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f"Updated {filepath}")
