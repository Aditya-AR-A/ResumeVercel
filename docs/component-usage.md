# Component Usage

## Tooltip
- Trigger must be focusable; supports mouse and keyboard
- Content rendered via portal with boundary detection; `role="tooltip"`
- Props: `content`, `placement`, `offset`, `open`, `onOpenChange`

## SkillTooltip
- Wraps skill label with `Tooltip` and renders related projects, jobs, certificates
- Fetches related data on first open; memoizes filters

## Cards & Lists
- Use tokenized Tailwind utilities for colors, spacing, typography
- Include consistent hover, focus, disabled, loading, and error states

