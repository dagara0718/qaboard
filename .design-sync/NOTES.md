# QANOW Design System Sync Notes

## Re-sync 2 (2026-08-25) — Comprehensive UI Coverage

### Build
- Shape: package (no Storybook)
- **Components: 10** (UI + Layout + States)
  - UI: Button, Input, Textarea, Badge (4)
  - Layout: HeaderMain, HeaderInternal (2)
  - States: LoadingState, EmptyState, ErrorState, UnauthorizedToast (4)
- Bundle size: 123 KB (_ds_bundle.js)
- Entry: synthesized from src/ (no pre-built dist/components)
- CSS tokens: 38 defined, 29 referenced

## First Sync (2026-08-25)

### Build
- Shape: package (no Storybook)
- Components: 4 (Button, Input, Textarea, Badge)
- Bundle size: 122 KB (_ds_bundle.js)
- Entry: synthesized from src/ (no pre-built dist/components)
- CSS tokens: 38 defined, 29 referenced

### Converter Output
- 4 floor-card previews (no authored previews yet)
- _ds_sync.json anchor created for future re-syncs
- README auto-generated from component types
- Component documentation matched 0/4 (no .md files in repo)

### Upload
- Project: QANOW Design System (835947f9-9da0-4860-983a-592ec34f948b)
- Upload path: incremental (one-time approval, components appear as verified)
- Files: 23 initial + 2 final (sentinel + anchor)

## Re-sync Risks & Future Work

### Improvements for Next Sync
1. **Author rich previews** — 0/4 components have authored .tsx previews
   - Create `.design-sync/previews/<Name>.tsx` for better-than-floor cards
   - See: Badge (status variants), Button (variants), Input (states), Textarea (char count)

2. **Add component docs** — 0/4 components matched docs
   - Create `src/components/ui/<Name>.md` or link via `docsMap` config
   - Provides examples and usage guidance to the design agent

3. **Source entry** — Currently synthesized from src/
   - Consider adding `src/index.ts` that re-exports all components
   - Tells the converter the official export surface

### Known State
- No Storybook (package shape)
- No dedicated preview files (relying on floor cards)
- Mock data in `/src/mocks` (not synced to design system)
- Page components (MainPage, QuestionListPage, etc.) not included (feature apps, not library)

### Re-sync Command
```bash
node .ds-sync/package-build.mjs --config .design-sync/config.json --node-modules ./node_modules --entry ./src/index.ts --out ./ds-bundle
node .ds-sync/package-validate.mjs ./ds-bundle
```

