# UI Context — QuranMind

## Theme

Dark-only premium research interface with no light mode. The design language is a sophisticated scientific workspace featuring near-black backgrounds, layered surfaces with subtle depth, and vivid accent colors for interactive elements. High information density with a professional, technical feel. Arabic typography takes priority. No excessive gradients, animations, or generic "AI SaaS" aesthetics.

## Colors

All components must use these CSS custom properties — no hardcoded hex values.

| Role                    | CSS Variable           | Value       |
| ----------------------- | ---------------------- | ----------- |
| Page background         | `--bg-base`            | `#0a0e27`   |
| Surface primary         | `--bg-surface`         | `#141829`   |
| Surface elevated        | `--bg-surface-elevated`| `#1a1f3a`   |
| Surface interactive     | `--bg-surface-hover`   | `#252d4a`   |
| Primary text            | `--text-primary`       | `#e8ecf1`   |
| Secondary text          | `--text-secondary`     | `#a0aac0`   |
| Muted text              | `--text-muted`         | `#6b7280`   |
| Primary accent          | `--accent-primary`     | `#00d4ff`   |
| Secondary accent        | `--accent-secondary`   | `#0099cc`   |
| Accent subtle           | `--accent-subtle`      | `#00d4ff20` |
| Success/verified        | `--state-success`      | `#10b981`   |
| Warning/hypothesis      | `--state-warning`      | `#f59e0b`   |
| Danger/error            | `--state-error`        | `#ef4444`   |
| Border default          | `--border-default`     | `#374151`   |
| Border subtle           | `--border-subtle`      | `#1f2937`   |
| Highlight               | `--highlight-yellow`   | `#fbbf2420` |

## Typography

| Role      | Font                                         | Variable      |
| --------- | -------------------------------------------- | ------------- |
| UI text   | Geist Sans (system fallback to -apple-system)| `--font-sans` |
| Arabic UI | Arabic fonts (Cairo, Tajawal, system)        | `--font-arab` |
| Code/mono | Geist Mono                                   | `--font-mono` |

Use Arabic fonts preferentially in UI labels, sidebar, and text content.

## Border Radius

| Context           | Class             | Value   |
| ----------------- | ----------------- | ------- |
| Inline / small UI | `rounded-md`      | `6px`   |
| Cards / panels    | `rounded-lg`      | `8px`   |
| Modals / overlays | `rounded-xl`      | `12px`  |

## Component Library

shadcn/ui on top of Tailwind CSS. Components live in `components/ui/`. Use the shadcn CLI to add new components rather than writing from scratch. All components inherit the color tokens and dark theme.

## Layout Patterns

- **Workspace Layout**: Full-viewport three-column split with left sidebar (fixed, collapsible), center AI agent panel (flexible), right Quran Viewer + analysis (fixed width or flexible)
- **Sidebars**: Fixed width (240–280px) with subtle border-right separator and vertical scroll
- **Panels**: Card-style with border and rounded corners, subtle background elevation
- **Evidence/Analysis Cards**: Inline code blocks for calculations, color-coded badges for status (verified/hypothesis/warning)
- **Modals/Dialogs**: Centered overlay with backdrop blur, rounded corners, elevated background
- **Navbar**: Top bar with bottom border, logo/title on left, user menu on right
- **Text Selection**: Highlighting verses or words uses accent color with subtle background

## Icons

Lucide React. Stroke-based icons only. Sizing:
- Inline/small UI: `h-4 w-4`
- Buttons/interactive: `h-5 w-5`
- Sidebar items: `h-5 w-5`
- Headers/prominent: `h-6 w-6`

Use stroke-width 1.5 for consistency.
