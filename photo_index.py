
from pathlib import Path
import csv

image_dir = Path("assets/images")
output_file = Path("photo_index.csv")

extensions = {".jpg", ".jpeg", ".png", ".webp"}

photos = sorted(
    [
        p for p in image_dir.iterdir()
        if p.is_file() and p.suffix.lower() in extensions
    ],
    key=lambda p: p.name.lower()
)

with output_file.open("w", newline="", encoding="utf-8-sig") as f:
    writer = csv.writer(f)
    writer.writerow(["Photo Number", "Filename", "Size MB"])

    for number, photo in enumerate(photos, start=1):
        writer.writerow([
            f"{number:03d}",
            photo.name,
            round(photo.stat().st_size / (1024 * 1024), 2)
        ])

print(f"Indexed {len(photos)} photos.")
print(f"Saved index to: {output_file.resolve()}")
