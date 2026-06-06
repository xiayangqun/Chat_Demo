#!/usr/bin/env python3
"""
Figma Design Scraper
Fetches all frames as PNG screenshots + design spec JSON from a Figma file.
"""

import json
import os
import urllib.request
import urllib.parse

TOKEN = ""
FILE_ID = "CBKcxWGEJGFe05ZsbgZZ2z"
OUTPUT_DIR = "/Volumes/xiayangqunT9/personSpace2/homework/figma-design"

HEADERS = {"X-Figma-Token": TOKEN}

def figma_get(path):
    url = f"https://api.figma.com/v1/{path}"
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read())

def download_file(url, dest):
    req = urllib.request.Request(url)
    with urllib.request.urlopen(req) as resp:
        with open(dest, "wb") as f:
            f.write(resp.read())

def collect_colors(node, colors=None):
    if colors is None:
        colors = set()
    fills = node.get("fills", [])
    for fill in fills:
        if fill.get("type") == "SOLID":
            c = fill["color"]
            r, g, b = int(c["r"]*255), int(c["g"]*255), int(c["b"]*255)
            a = round(c.get("a", 1), 2)
            colors.add(f"rgba({r},{g},{b},{a})")
    strokes = node.get("strokes", [])
    for stroke in strokes:
        if stroke.get("type") == "SOLID":
            c = stroke["color"]
            r, g, b = int(c["r"]*255), int(c["g"]*255), int(c["b"]*255)
            colors.add(f"rgb({r},{g},{b})")
    for child in node.get("children", []):
        collect_colors(child, colors)
    return colors

def collect_fonts(node, fonts=None):
    if fonts is None:
        fonts = set()
    style = node.get("style", {})
    if style:
        family = style.get("fontFamily", "")
        size = style.get("fontSize", "")
        weight = style.get("fontWeight", "")
        if family:
            fonts.add(f"{family} {weight} {size}px")
    for child in node.get("children", []):
        collect_fonts(child, fonts)
    return fonts

def extract_frame_spec(frame_node):
    """Extract design spec for a single frame."""
    spec = {
        "id": frame_node.get("id"),
        "name": frame_node.get("name"),
        "type": frame_node.get("type"),
        "size": {
            "width": frame_node.get("absoluteBoundingBox", {}).get("width"),
            "height": frame_node.get("absoluteBoundingBox", {}).get("height"),
        },
        "background": [],
        "padding": {},
        "children_count": len(frame_node.get("children", [])),
        "colors": list(collect_colors(frame_node)),
        "fonts": list(collect_fonts(frame_node)),
        "children": [],
    }

    # Background fills
    for fill in frame_node.get("fills", []):
        if fill.get("type") == "SOLID":
            c = fill["color"]
            r, g, b = int(c["r"]*255), int(c["g"]*255), int(c["b"]*255)
            spec["background"].append(f"rgba({r},{g},{b},{round(c.get('a',1),2)})")

    # Padding / layout props
    for key in ["paddingLeft", "paddingRight", "paddingTop", "paddingBottom",
                "itemSpacing", "counterAxisSpacing"]:
        if key in frame_node:
            spec["padding"][key] = frame_node[key]

    # Direct children summary
    for child in frame_node.get("children", []):
        child_summary = {
            "id": child.get("id"),
            "name": child.get("name"),
            "type": child.get("type"),
            "x": child.get("absoluteBoundingBox", {}).get("x"),
            "y": child.get("absoluteBoundingBox", {}).get("y"),
            "width": child.get("absoluteBoundingBox", {}).get("width"),
            "height": child.get("absoluteBoundingBox", {}).get("height"),
        }
        # Text content
        if child.get("type") == "TEXT":
            child_summary["text"] = child.get("characters", "")
            child_summary["style"] = child.get("style", {})
        # Fills
        fills = child.get("fills", [])
        if fills:
            child_summary["fills"] = fills
        spec["children"].append(child_summary)

    return spec

def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    imgs_dir = os.path.join(OUTPUT_DIR, "images")
    os.makedirs(imgs_dir, exist_ok=True)

    print("📄 Fetching Figma file structure...")
    file_data = figma_get(f"files/{FILE_ID}")
    doc = file_data["document"]

    # Collect all top-level frames
    all_frames = []
    for page in doc.get("children", []):
        print(f"  Page: {page['name']}")
        for frame in page.get("children", []):
            print(f"    Frame: {frame['name']} (id={frame['id']})")
            all_frames.append((page["name"], frame))

    # Build design spec JSON
    print("\n📐 Extracting design specs...")
    specs = []
    for page_name, frame in all_frames:
        spec = extract_frame_spec(frame)
        spec["page"] = page_name
        specs.append(spec)

    spec_path = os.path.join(OUTPUT_DIR, "design_spec.json")
    with open(spec_path, "w", encoding="utf-8") as f:
        json.dump(specs, f, indent=2, ensure_ascii=False)
    print(f"  ✅ Saved design_spec.json")

    # Export PNG screenshots
    print("\n🖼️  Exporting frame PNGs (scale=2)...")
    frame_ids = ",".join(f[1]["id"] for f in all_frames)
    # URL-encode the ids (colons need encoding)
    encoded_ids = urllib.parse.quote(frame_ids, safe=",")
    img_data = figma_get(
        f"images/{FILE_ID}?ids={encoded_ids}&format=png&scale=2"
    )
    images_map = img_data.get("images", {})

    for page_name, frame in all_frames:
        fid = frame["id"]
        url = images_map.get(fid)
        if not url:
            print(f"  ⚠️  No image URL for {frame['name']} ({fid})")
            continue
        # Safe filename
        safe_name = frame["name"].replace("/", "_").replace(" ", "_")
        dest = os.path.join(imgs_dir, f"{safe_name}_{fid.replace(':', '-')}.png")
        print(f"  ⬇️  Downloading {frame['name']}...")
        download_file(url, dest)
        print(f"     ✅ Saved: {os.path.basename(dest)}")

    # Generate Markdown design spec doc
    print("\n📝 Generating design_spec.md...")
    md_lines = [
        "# Figma Design Spec",
        f"\n**File:** {file_data.get('name')}  ",
        f"**Last Modified:** {file_data.get('lastModified')}  ",
        f"**File ID:** {FILE_ID}  ",
        f"**Figma Link:** https://www.figma.com/design/{FILE_ID}/\n",
        "---\n",
    ]

    for spec in specs:
        md_lines.append(f"## {spec['name']}")
        md_lines.append(f"**Page:** {spec['page']}  ")
        md_lines.append(f"**ID:** `{spec['id']}`  ")
        w = spec['size'].get('width', 'N/A')
        h = spec['size'].get('height', 'N/A')
        md_lines.append(f"**Size:** {w} × {h} px  ")
        md_lines.append(f"**Children:** {spec['children_count']} nodes\n")

        if spec["background"]:
            md_lines.append(f"**Background:** {', '.join(spec['background'])}\n")

        if spec["padding"]:
            md_lines.append("**Layout / Spacing:**")
            for k, v in spec["padding"].items():
                md_lines.append(f"- {k}: {v}px")
            md_lines.append("")

        if spec["colors"]:
            md_lines.append("**Colors used:**")
            for c in sorted(spec["colors"]):
                md_lines.append(f"- `{c}`")
            md_lines.append("")

        if spec["fonts"]:
            md_lines.append("**Fonts used:**")
            for ft in sorted(spec["fonts"]):
                md_lines.append(f"- `{ft}`")
            md_lines.append("")

        # Image reference
        safe_name = spec["name"].replace("/", "_").replace(" ", "_")
        img_file = f"images/{safe_name}_{spec['id'].replace(':', '-')}.png"
        md_lines.append(f"**Screenshot:**  ")
        md_lines.append(f"![{spec['name']}]({img_file})\n")

        md_lines.append("### Children")
        md_lines.append("| Name | Type | X | Y | W | H |")
        md_lines.append("|------|------|---|---|---|---|")
        for ch in spec["children"]:
            name = ch.get("name", "")
            ctype = ch.get("type", "")
            x = ch.get("x", "")
            y = ch.get("y", "")
            w = ch.get("width", "")
            h = ch.get("height", "")
            text = ch.get("text", "")
            row = f"| {name} | {ctype} | {x} | {y} | {w} | {h} |"
            if text:
                row += f" _{text[:40]}_"
            md_lines.append(row)

        md_lines.append("\n---\n")

    md_path = os.path.join(OUTPUT_DIR, "design_spec.md")
    with open(md_path, "w", encoding="utf-8") as f:
        f.write("\n".join(md_lines))
    print(f"  ✅ Saved design_spec.md")

    print(f"\n✅ All done! Files saved to: {OUTPUT_DIR}")
    print(f"   - design_spec.json   (raw spec data)")
    print(f"   - design_spec.md     (human-readable doc)")
    print(f"   - images/            (PNG screenshots)")

if __name__ == "__main__":
    main()
