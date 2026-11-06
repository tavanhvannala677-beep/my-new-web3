# Changelog

All notable changes to the **LaoTrace** platform are documented in this file.

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
