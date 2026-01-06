## Theme Standardization
- Centralized tokens: define CSS variables for colors, typography, spacing, radius, shadows in `app/globals.css` (or `src/styles/tokens.css`), with `.dark` variants; expose via Tailwind theme (`tailwind.config.js` `theme.extend`) to keep utilities aligned.
- Inheritance: ensure `ThemeProvider.tsx` uses `next-themes` (`class` strategy) and tokens cascade globally; avoid per-component overrides; remove inline styles and hardcoded values from components.
- Component audit: pass through all components (`components/*`, `components/views/*`, `src/components/ui/*`) to replace ad‑hoc classes with tokenized Tailwind utilities; unify typography scale and spacing system across cards, lists, detail views.
- Consistency hooks: add lint rules/precommit checks to block non‑token colors/spacing; document usage patterns and examples.

## Tooltip Component Fixes
- Consolidate: create a unified `Tooltip` component used by `SkillTooltip.tsx` and `SkillTooltipContent.tsx`.
- Correct HTML: use a `button` or focusable trigger with `aria-describedby`; tooltip content uses `role="tooltip"` and is announced; support keyboard (focus/blur, Escape) and pointer.
- Positioning: render via portal to `document.body` (`createPortal`); compute placement relative to trigger.
- Boundary detection: implement viewport edge detection and auto‑flip/shift; prefer `@floating-ui/dom` for robust placement (fallback to custom rect math if avoiding new deps).
- Styling: standardize tooltip tokens (background, border, radius, shadow, spacing, typography) to match theme; ensure z-index and transitions are consistent.
- States: add open/close animations; prevent overflow; respect `prefers-reduced-motion`.

## AI Search Functionality Repairs
- Diagnosis: review `app/search/page.tsx`, `utils/api.ts`, `CommandInterface.tsx`, `ChatIntro.tsx`, `ChatProfile.tsx` for schema assumptions, missing loading states, and error handling.
- Error handling: centralize user‑friendly errors in `api.ts` (map non‑OK to typed errors); add route‑level `error.tsx` for `/search`.
- Loading states: implement `app/search/loading.tsx` skeletons; for client interactions add suspense fallbacks and spinners.
- Dynamic content: generate sections for results, related questions, and contextual suggestions; gracefully handle empty states; standardize card layouts using tokens.
- Caching: introduce lightweight LRU cache in `utils/api.ts` for AI POST responses keyed by payload hash with TTL; optionally use server `cache()`/`unstable_cache` around AI fetch if appropriate; expose `cache: true/ttl` options per endpoint.
- Resilience: add retry/backoff for transient failures; timeouts; guard against schema drift by validating responses.

## Technical Specifications (to be authored and implemented)
- Theme tokens: color roles (bg/surface/primary/secondary/success/warn/error), typography scale (font sizes/weights/line-heights), spacing scale, radii, shadows; Tailwind `theme.extend` mapping; token naming conventions.
- Tooltip API: `Tooltip` props (content, placement, offset, open, onOpenChange), accessibility behaviors, motion specs, theming hooks.
- AI search contracts: request/response schemas for `/ai/search` and `/ai/chat`; cache keys/TTL; error codes; retry strategy; loading/empty state components.

## Incremental Delivery
- PR 1: Add theme tokens and Tailwind mapping; refactor 3–5 core components (Navbar, Card, JobCard) for consistency; docs baseline.
- PR 2: Implement `Tooltip` and migrate `SkillTooltip*`; add boundary detection and accessibility.
- PR 3: Repair AI search: centralized errors, caching, loading/empty states; robust rendering.
- PR 4: Finish component audit, unify states (hover/focus/disabled/loading/errors) across the library.

## Testing 
- Visual regression: Storybook stories for components + Chromatic or Playwright screenshot comparison; verify dark/light.
- Functional: Playwright tests for `/search` (queries, errors, retries, suggestions); keyboard navigation for tooltips and menus.
- Cross‑browser: Playwright on Chromium/Firefox/WebKit; manual checks for mobile touch interactions.

## Documentation
- Theme variables: publish a style guide with tokens and Tailwind utility mapping.
- Component usage: `Tooltip` and standardized components documented with examples and dos/don’ts.
- AI search: document request/response shapes, caching behavior, and error handling semantics.

## Repository‑Specific Targets
- Update `SkillTooltip.tsx` and `SkillTooltipContent.tsx` to use the unified `Tooltip` and tokens.
- Normalize styles in `Navbar.tsx`, `Card.tsx`, `JobCard.tsx`, `CertificateCard.tsx`, `Views/*` using theme tokens.
- Enhance `app/search/page.tsx` with resilient rendering and `loading.tsx`/`error.tsx`; wire caching via `utils/api.ts`.

## Confirmation
- Confirm this refined plan and I will proceed with token setup and component audit (PR 1), followed by tooltips (PR 2) and AI search repairs (PR 3), delivering tests and documentation with each step.