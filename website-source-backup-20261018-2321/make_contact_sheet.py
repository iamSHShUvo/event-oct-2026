
from pathlib import Path
from PIL import Image, ImageOps, ImageDraw, ImageFont
import math

# Input and output folders
IMAGE_DIR = Path("assets/images")
OUTPUT_DIR = Path("contact_sheets")

# Contact sheet layout
COLUMNS = 4
ROWS = 6
THUMB_WIDTH = 240
THUMB_HEIGHT = 175
LABEL_HEIGHT = 42
PADDING = 12

SUPPORTED_FORMATS = {".jpg", ".jpeg", ".png", ".webp"}

OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

images = sorted(
    [
        p for p in IMAGE_DIR.iterdir()
        if p.is_file() and p.suffix.lower() in SUPPORTED_FORMATS
    ],
    key=lambda p: p.name.lower()
)

if not images:
    raise SystemExit(
        f"No images found in {IMAGE_DIR.resolve()}. "
        "Check that your photos are in assets/images."
    )

try:
    font = ImageFont.truetype("arial.ttf", 14)
except OSError:
    font = ImageFont.load_default()

CELL_WIDTH = THUMB_WIDTH + PADDING * 2
CELL_HEIGHT = THUMB_HEIGHT + LABEL_HEIGHT + PADDING * 2

SHEET_WIDTH = COLUMNS * CELL_WIDTH + PADDING
SHEET_HEIGHT = ROWS * CELL_HEIGHT + PADDING

IMAGES_PER_SHEET = COLUMNS * ROWS
total_sheets = math.ceil(len(images) / IMAGES_PER_SHEET)

for sheet_index in range(total_sheets):
    start = sheet_index * IMAGES_PER_SHEET
    batch = images[start:start + IMAGES_PER_SHEET]

    sheet = Image.new(
        "RGB",
        (SHEET_WIDTH, SHEET_HEIGHT),
        "#F4F0E8"
    )
    draw = ImageDraw.Draw(sheet)

    for local_index, path in enumerate(batch):
        global_index = start + local_index
        col = local_index % COLUMNS
        row = local_index // COLUMNS

        x = PADDING + col * CELL_WIDTH + PADDING
        y = PADDING + row * CELL_HEIGHT + PADDING

        try:
            with Image.open(path) as source:
                photo = ImageOps.exif_transpose(source).convert("RGB")
                photo.thumbnail((THUMB_WIDTH, THUMB_HEIGHT))

                # Center the photo in its thumbnail area
                px = x + (THUMB_WIDTH - photo.width) // 2
                py = y + (THUMB_HEIGHT - photo.height) // 2
                sheet.paste(photo, (px, py))

            label = f"{global_index + 1:03d} | {path.name}"
            max_chars = 32
            if len(label) > max_chars:
                label = label[:max_chars - 3] + "..."

            draw.text(
                (x, y + THUMB_HEIGHT + 7),
                label,
                fill="#24382D",
                font=font
            )

        except Exception as error:
            draw.text(
                (x, y + 10),
                f"Could not open: {path.name}",
                fill="#A00000",
                font=font
            )
            print(f"Skipped {path.name}: {error}")

    output_file = OUTPUT_DIR / f"contact_sheet_{sheet_index + 1:02d}.jpg"
    sheet.save(output_file, quality=88)

    print(f"Created: {output_file}")

print(f"\nFinished! Found {len(images)} images.")
print(f"Created {total_sheets} contact sheet(s).")
print(f"Open the folder: {OUTPUT_DIR.resolve()}")
