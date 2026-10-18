from pathlib import Path
import json

image_dir = Path("assets/images")
extensions = {".jpg", ".jpeg", ".png", ".webp"}

if not image_dir.exists():
    raise SystemExit(f"Image folder not found: {image_dir.resolve()}")

photos = sorted(
    [p for p in image_dir.iterdir() if p.is_file() and p.suffix.lower() in extensions],
    key=lambda p: p.name.lower()
)

data = [{"number": i, "filename": p.name} for i, p in enumerate(photos, start=1)]
Path("gallery-data.js").write_text(
    "window.EVENT_PHOTOS = " + json.dumps(data, ensure_ascii=False, indent=2) + ";\n",
    encoding="utf-8"
)
print(f"Created gallery-data.js with {len(data)} photos.")
print("Note: photo numbers follow alphabetical filename order.")
