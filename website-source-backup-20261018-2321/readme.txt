SMRITIR PATAY WEBSITE V2
স্মৃতির পাতায় | ১৭ অক্টোবর ২০২৬

1) Replace index.html, style.css, script.js, and build_gallery_data.py with these v2 files.
2) DO NOT delete or replace your assets/images folder.
3) Keep the video at:
   assets/videos/WhatsApp Video 2026-10-17 at 10.32.01 PM.mp4
4) In VS Code terminal at the project root, run:
   python build_gallery_data.py
5) Start preview:
   python -m http.server 8000
   Open http://localhost:8000

Changes:
- All indexed photos are shown in "দিনের সব ছবি".
- Rounded, modern photo cards and lightbox.
- Separate sections for the three institutions.
- Video uses native HTML5 controls and seeking timeline.
- Cover photos use different photos from the cooking and shared-meal moments.

IMPORTANT:
- The photos selected for the first two sections are provisional based on contact-sheet numbers.
- The contact sheets shown so far did not clearly show the old women eating at Astha Nibas. This section is deliberately not filled with guessed photos. Add/identify the real photos first.
- If video plays but seeking doesn't work, re-encode the MP4 with H.264 video, AAC audio, and fast-start metadata. The browser's built-in player supports seeking when the file is correctly encoded.
- Check consent and privacy before publishing.
