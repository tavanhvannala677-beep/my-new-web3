# LaoTrace Design System & Color Tokens

The LaoTrace UI uses an **Organic Sage & Forest Green** color system reflecting Laos's natural agricultural landscapes and clean compliance standards.

## 🎨 Core Color Palette

| Token | Hex Value | Usage |
|---|---|---|
| `--bg-primary` | `#edf2e7` | Main page background (light organic sage) |
| `--bg-secondary` | `#e2ebd9` | Secondary cards and container backgrounds |
| `--forest-dark` | `#153826` | Primary brand green, header text, buttons |
| `--forest-hover` | `#0e281b` | Button hover and active press states |
| `--accent-emerald` | `#10b981` | Success states, verification checkmarks |
| `--accent-amber` | `#b45309` | Warning, in-transit, or pending reviews |
| `--text-main` | `#142a1d` | High contrast body typography |
| `--border-subtle` | `#d5dfce` | Subtle card separators and table borders |

## ☀️ High-Contrast Mode for Field Work
For rural farmers operating mobile devices under direct outdoor sunlight, the platform supports a high-contrast mode:
- Pure white card backgrounds (`#ffffff`)
- Deep pitch borders (`#000000`)
- Pure black text (`#000000`) for maximum legibility (WCAG AAA compliant)

## 🏷️ Compliance Badge Color Matrix

| Variant | Class | Background / Text | Semantic Meaning |
|---|---|---|---|
| `success` | `.ui-badge-success` | `#ecfdf5` / `#065f46` | EUDR Passed / Cleared |
| `gold` | `.ui-badge-gold` | `#fef3c7` / `#78350f` | GACC Bilateral Fast-Pass Verified |
| `cyan` | `.ui-badge-cyan` | `#ecfeff` / `#155e75` | Sentinel-2 Satellite / GIS |
| `warning` | `.ui-badge-warning` | `#fffbeb` / `#92400e` | In-transit / Pending verification |
| `danger` | `.ui-badge-danger` | `#fef2f2` / `#991b1b` | Deforestation detected / Rejected |
| `purple` | `.ui-badge-purple` | `#faf5ff` / `#6b21a8` | Livestock & RFID Biosecurity Track |
| `rose` | `.ui-badge-rose` | `#fff1f2` / `#9f1239` | Critical Quarantine / High Priority Alert |
| `indigo` | `.ui-badge-indigo` | `#eef2ff` / `#3730a3` | Cold Chain & IoT Temperature Telemetry |
| `sky` | `.ui-badge-sky` | `#f0f9ff` / `#0369a1` | Water Rights & Irrigation Verification |
| `teal` | `.ui-badge-teal` | `#f0fdfa` / `#0f766e` | Agroforestry & Biodiversity Certification |
| `amber` | `.ui-badge-amber` | `#fffbeb` / `#b45309` | Phytosanitary & Quarantine Hold |

## ✨ Micro-Interactions & Text Selection
- **Text Selection:** Custom brand highlight using pale emerald background (`#bbf7d0`) and high-contrast text (`#142a1d`).
- **Badge Hover Elevation:** Badges elevate slightly (`translateY(-1px)`) with subtle shadow drop and accessible focus rings.
- **Scrollbar Styling:** Integrated with organic sage palette track and border-subtle thumb.
- **Dynamic Text Contrast:** Automated WCAG calculation choosing `#ffffff` vs `#000000` via relative luminance formula.



