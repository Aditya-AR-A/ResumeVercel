# Style Guide

## Design Tokens
- Colors: `--color-bg`, `--color-surface`, `--color-border`, `--color-text`, `--accent-primary` and variants
- Typography: scale via Tailwind `text-{xs..4xl}` with consistent `leading` and font `sans`
- Spacing: Tailwind spacing scale; prefer `gap-*`, `px-*`, `py-*` over inline styles
- Radius: prefer `rounded-lg`, `rounded-xl`, `rounded-2xl` mapped to semantic levels
- Shadows: `shadow-tooltip`, `shadow-custom-light`, `shadow-custom-dark`, `shadow-elevated`

## Usage Guidelines
- Use Tailwind utilities backed by tokens; avoid hardcoded hex values
- Ensure dark mode via `.dark` class tokens; avoid per-component overrides
- Respect `prefers-reduced-motion` for animations

## Components
- Cards, Navbars, Tooltips, Tags use unified spacing, radius, and color roles
- Loading and empty states follow consistent layouts and typography

