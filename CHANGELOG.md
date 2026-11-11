# Changelog

All notable changes to the **LaoTrace** platform are documented in this file.

## [1.8.0] - 2026-11-12
### Added
- Slate and Lime badge color variants for archived records and nursery seedlings in `styles.css`.
- Support for `slate` and `lime` variants in the `Badge` component.
- Interactive card elevation hover lift with subtle shadow projection.
- Micro-interaction button hover elevation and press scaling.
- Raw RGB tuple extractor helper (`hexToRgbValues`) with unit tests in `lib/format.ts`.
- Linear color blending utility (`blendColors`) with unit tests in `lib/format.ts`.
- Updated compliance badge specifications and micro-interactions in `docs/THEME.md`.

## [1.7.0] - 2026-11-11
### Added
- Teal and Amber badge color variants for agroforestry and phytosanitary in `styles.css`.
- Support for `teal` and `amber` variants in the `Badge` component.
- Subtle organic scrollbar styling matched to the sage design palette.
- Live status ping pulse animation (`.status-pulse-emerald`) for real-time telemetry.
- HSL-to-RGB color converter (`hslToRgb`) with unit test coverage in `lib/format.ts`.
- WCAG compliant contrasting text color utility (`getContrastingTextColor`) with unit tests in `lib/format.ts`.
- Updated compliance badge specifications and contrast guidelines in `docs/THEME.md`.

## [1.6.0] - 2026-11-10
### Added
- Indigo and Sky compliance badge variants for cold chain and irrigation in `styles.css`.
- Support for `indigo` and `sky` variants in the `Badge` component.
- Brand-aware text selection highlight colors (`::selection`, `::-moz-selection`).
- Subtle hover shadow elevation and accessible focus rings for badge components.
- Brightness percentage adjustment utility (`adjustBrightness`) with unit tests in `lib/format.ts`.
- Hex-to-HSL color space converter (`hexToHsl`) with unit tests in `lib/format.ts`.
- Design token documentation for new badge variants and selection highlights in `docs/THEME.md`.

## [1.5.0] - 2026-11-08
### Added
- Gradient text accent utility (`.gradient-text-accent`) for national portal branding in `styles.css`.
- Shimmer loading skeleton effect (`.skeleton-loading`) for async card views.
- Glassmorphism modal backdrop and frosted card styles (`.glass-card`, `.modal-backdrop-blur`).
- Purple and Rose compliance badge variants in `Badge` component and `styles.css`.
- RGB to HEX color converter (`rgbToHex`) with complete unit test coverage in `lib/format.ts`.
- Native checkbox and radio input accent colors with forest dark branding.
- Livestock & biosecurity badge semantics in `docs/THEME.md`.

## [1.4.0] - 2026-11-07
### Added
- Golden badge styling for GACC Bilateral Fast-Pass verification in `styles.css`.
- Cyan badge variant for Sentinel-2 satellite and GIS telemetry displays.
- Pulsing animated border effect (`eudrPulse`) for active deforestation verifications.
- Hex-to-RGBA color converter helper (`hexToRgba`) with unit tests in `lib/format.ts`.
- Badge color semantic specification matrix in `docs/THEME.md`.

## [1.3.0] - 2026-11-06
### Added
- Organic Sage and Forest Green color palette tokens and documentation in `docs/THEME.md`.
- High-contrast mode optimizations and border glow styling in `styles.css`.
- Relative luminance and contrast helper (`isDarkColor`) with unit tests in `lib/format.ts`.
- Tactile button transitions, active press states, and customized scrollbar aesthetics.

## [1.2.0] - 2026-11-05
### Added
- Architecture guide and system flow diagram in `docs/ARCHITECTURE.md`.
- Network latency thresholds and RPC polling constants in `networks.ts`.
- Unit tests for smart contract enum helpers and localized Lao labels.
- Safe JSON parse utility function with typed fallback in `lib/format.ts`.
- Contributor guidelines in `CONTRIBUTING.md`.

## [1.1.0] - 2026-10-31
### Added
- Real-time supply chain statistics overview widget in `PortalHub.tsx`.
- Network health status badges with RPC latency measurement in `NetworkCard.tsx`.
- Localized error classification and friendly messages in `errors.ts`.
- Transaction and address explorer URL builders in `networks.ts`.

## [1.0.0] - 2026-10-21
### Added
- Initial deployment of Lao National Agricultural Traceability platform.
- Smart contract integration on LAB Chain (Chain ID: 5222).
- Farmer GIS mapping, Factory batch consolidation, and Customs SSOT portals.
