# ZENORA DESIGNS - Luxury Interior Architecture Website

> **"Rare. Refined. Divine."** — Ahmedabad · Rajkot · Serving Across India

An ultra-luxury, high-conversion portfolio and interactive 3D scroll walkthrough website crafted for **Zenora Designs**.

---

## 🚀 How to Run the Website

### Option 1: Double-Click Desktop Launcher
Simply double-click the shortcut file on your Desktop:
```
ZENORA_INTERIORS.bat
```
This automatically starts the local HTTP server and opens `http://localhost:8082` in your default browser.

### Option 2: Run from Inside the Project Folder
Open `C:\Users\Alan Thomas\Desktop\My Projects\zenora-luxury-interiors` and double-click:
```
run_site.bat
```

---

## 🎥 Adding Walkthrough Video Clips

The interactive walkthrough is built with a dual-mode engine:
1. **Current Built-in Mode**: 4K Cinematic Depth Panning with interactive architectural hotspots across 4 studio zones (Executive Lounge, Fluted Seating, Feature Wall, and Workstations).
2. **Video Frames Mode (Once you receive clips)**:
   Whenever you have your walkthrough video clip (e.g. `walkthrough.mp4`), simply run:
   ```bash
   python process_video.py --video "path/to/walkthrough.mp4"
   ```
   This will:
   - Extract smooth 60fps WebP scroll frames directly into `assets/frames/`.
   - Generate `manifest.json`.
   - The website will automatically detect the frames and switch to full video scrubbing upon refresh!

---

## 🏛 Key Features Built

1. **Interactive 3D Walkthrough Tour (Canvas Engine)**:
   - Smooth lerp scroll scrubbing (0% to 100%).
   - Interactive architectural hotspots (Fluted Oak, 3000K Cove Lighting, Italian Leather Lounge, Backlit Geometric Relief).
   - Real-time Phase indicators (`PHASE 01 / 04`) and tour depth counter.

2. **Zero Backend Lead Capture & Consultation Hub**:
   - Direct WhatsApp Concierge integration.
   - Interactive "Book 3D Design Consultation" form that formats client details (Name, Phone, City, Space Type, Carpet Area, Notes) into a structured WhatsApp message and opens directly to the designer's phone.
   - No monthly server hosting bills or backend maintenance required for the client.

3. **Curated High-Resolution Portfolio Gallery**:
   - Filterable categories: *Lounges*, *Workstations*, *Feature Walls*.
   - High-res Lightbox modal with zoom and space details extracted from Zenora's actual portfolio.

4. **Official 8-Page PDF Portfolio Viewer**:
   - Built-in flipbook modal allowing prospective clients to preview all 8 pages of `ZENORA OFFICE INTERIOR PORTFOLIO.pdf`.
   - Direct download button for the official brochure.

5. **Signature Luxury Styling**:
   - Fonts: *Cormorant Garamond*, *Cinzel*, *Plus Jakarta Sans*.
   - Palette: Warm Espresso (`#141311`), Obsidian (`#0D0C0B`), Champagne Bronze Gold (`#C5A880`, `#E5C287`), Alabaster Cream (`#F5EFEB`).
