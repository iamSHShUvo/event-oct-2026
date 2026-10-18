from collections import Counter
from pathlib import Path
import json


image_dir = Path("assets/images")
manifest_path = Path("sritir-patay-photo-manifest.json")
output_path = Path("gallery-data.js")

if not image_dir.is_dir():
    raise SystemExit(f"Image folder not found: {image_dir.resolve()}")
if not manifest_path.is_file():
    raise SystemExit(f"Photo manifest not found: {manifest_path.resolve()}")

with manifest_path.open(encoding="utf-8-sig") as manifest_file:
    manifest = json.load(manifest_file)

if not isinstance(manifest, list):
    raise SystemExit("Photo manifest must contain a JSON array.")

photos = []
for row_number, item in enumerate(manifest, start=1):
    if not isinstance(item, dict):
        raise SystemExit(f"Manifest entry {row_number} must be an object.")

    missing_fields = {"filename", "location", "stage", "display_order"} - item.keys()
    if missing_fields:
        fields = ", ".join(sorted(missing_fields))
        raise SystemExit(f"Manifest entry {row_number} is missing: {fields}")

    filename = item["filename"]
    if (
        not isinstance(filename, str)
        or Path(filename).name != filename
        or Path(filename).suffix.lower() not in {".jpg", ".jpeg"}
    ):
        raise SystemExit(f"Manifest entry {row_number} has an invalid JPEG filename.")
    if not isinstance(item["location"], str) or not item["location"]:
        raise SystemExit(f"Manifest entry {row_number} has an invalid location.")
    if not isinstance(item["stage"], str) or not item["stage"]:
        raise SystemExit(f"Manifest entry {row_number} has an invalid stage.")
    if (
        isinstance(item["display_order"], bool)
        or not isinstance(item["display_order"], int)
    ):
        raise SystemExit(f"Manifest entry {row_number} has an invalid display_order.")

    photos.append(
        {
            "filename": filename,
            "location": item["location"],
            "stage": item["stage"],
            "display_order": item["display_order"],
        }
    )

filenames = [photo["filename"] for photo in photos]
duplicate_filenames = sorted(
    filename for filename, count in Counter(filenames).items() if count > 1
)
if duplicate_filenames:
    raise SystemExit(
        "Duplicate filenames in photo manifest: " + ", ".join(duplicate_filenames)
    )

orders = [photo["display_order"] for photo in photos]
if len(orders) != len(set(orders)):
    raise SystemExit("Photo manifest contains duplicate display_order values.")

actual_filenames = {
    path.name
    for path in image_dir.iterdir()
    if path.is_file() and path.suffix.lower() in {".jpg", ".jpeg"}
}
manifest_filenames = set(filenames)
missing_files = sorted(manifest_filenames - actual_filenames)
unclassified_files = sorted(actual_filenames - manifest_filenames)
if missing_files or unclassified_files:
    if missing_files:
        print("Files listed in the manifest but missing from assets/images:")
        for filename in missing_files:
            print(f"  - {filename}")
    if unclassified_files:
        print("JPEG files not classified in the photo manifest:")
        for filename in unclassified_files:
            print(f"  - {filename}")
    raise SystemExit("Update the photo manifest before building gallery data.")

photos.sort(key=lambda photo: photo["display_order"])
output_path.write_text(
    "window.EVENT_PHOTOS = "
    + json.dumps(photos, ensure_ascii=False, indent=2)
    + ";\n",
    encoding="utf-8",
)

print(f"Created {output_path} with {len(photos)} manifest-classified photos.")
