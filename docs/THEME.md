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

