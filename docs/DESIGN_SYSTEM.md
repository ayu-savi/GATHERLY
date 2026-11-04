# GATHERLY – Master Design System Specification

> **Project:** GATHERLY (Discover. Connect. Celebrate.)  
> **Brand Identity:** Graphite + Coral Pink (Dark) & Peach + Emerald + Turquoise (Light)  
> **Styling Technology:** CSS3 Custom Properties (Design Tokens)  
> **Typography:** Plus Jakarta Sans (Display/Headings) & Inter (Body/UI)  
> **Strict Color Rule:** NO ORANGE anywhere across both themes. No purple/burgundy/cyan cross-contamination.

---

## 1. Brand Identity & Design Principles

### 1.1 Brand Identity
- **Name:** **GATHERLY**
- **Tagline:** *Discover. Connect. Celebrate.*
- **Brand Personality:** Editorial, high-contrast, confident, campus-centric, and premium.
- **Strict Color Policy:**
  - **Dark Theme:** Graphite + Coral Pink.
  - **Light Theme:** Peach + Emerald + Turquoise.
  - **Forbidden:** Zero orange anywhere (no orange buttons, badges, gradients, hovers, or icons). No purple, burgundy, or cyan mixed into dark mode. No coral mixed into light mode. Accessible contrast ratios strictly maintained.

---

## 2. Color Palettes & CSS Design Tokens

### 2.1 Dark Theme: "Graphite + Coral Pink"
A bold, modern, graphite-based dark theme with high-energy coral pink accents:

```css
[data-theme="dark"] {
  /* Surfaces */
  --bg-primary: #171719;             /* Main background: Graphite */
  --bg-secondary: #222226;           /* Secondary background / Cards */
  --bg-elevated: #303036;            /* Elevated surface / Floating panels */
  --bg-hover: #3C3C44;               /* Subtle hover highlight */
  --bg-glass: rgba(34, 34, 38, 0.90);/* Frosted glass overlay */
  --bg-overlay: rgba(23, 23, 25, 0.85);

  /* Primary Brand Coral Accents */
  --primary: #D95770;                /* Primary coral: #D95770 */
  --primary-hover: #C6455E;
  --primary-active: #B2364E;
  --primary-rgb: 217, 87, 112;

  /* Secondary Coral & Highlights */
  --accent-secondary: #FF91A5;       /* Secondary coral: #FF91A5 */
  --accent-secondary-rgb: 255, 145, 165;
  --highlight: #FFD5DC;              /* Soft highlight: #FFD5DC */
  --highlight-rgb: 255, 213, 220;

  /* Text & Content */
  --text-primary: #F8F5F6;           /* Crisp primary text: #F8F5F6 */
  --text-secondary: #BDB5B9;         /* Secondary text: #BDB5B9 */
  --text-muted: #827A7F;             /* Dim graphite slate */
  --text-inverse: #171719;           /* Text on coral buttons */

  /* Borders & Dividers */
  --border-subtle: #39353A;          /* Borders: #39353A */
  --border-strong: #4F4950;
  --border-glow: rgba(217, 87, 112, 0.35);

  /* Status Colors (NO ORANGE, NO PURPLE) */
  --success: #10B981;
  --success-bg: rgba(16, 185, 129, 0.15);
  --warning: #FF91A5;                /* Coral pink for warnings - NO ORANGE */
  --warning-bg: rgba(255, 145, 165, 0.15);
  --error: #F43F5E;
  --error-bg: rgba(244, 63, 94, 0.15);
  --info: #FFD5DC;
  --info-bg: rgba(255, 213, 220, 0.15);
}
```

### 2.2 Light Theme: "Peach + Emerald + Turquoise" (Preserved Strictly)
A welcoming, warm, daylight campus palette combining soft peach surfaces with authoritative emerald and turquoise accents:

```css
[data-theme="light"] {
  /* Surfaces */
  --bg-primary: #FFF8F5;             /* Main background: #FFF8F5 */
  --bg-secondary: #FFFFFF;           /* Card surface: #FFFFFF */
  --bg-elevated: #FFE8DD;            /* Soft peach surface: #FFE8DD */
  --bg-hover: #FEDDCD;               /* Gentle peach hover */
  --bg-glass: rgba(255, 255, 255, 0.92);
  --bg-overlay: rgba(17, 51, 48, 0.45);

  /* Primary Brand Colors */
  --primary: #0F766E;                /* Primary emerald: #0F766E */
  --primary-hover: #115E59;
  --primary-active: #134E4A;
  --primary-rgb: 15, 118, 110;

  /* Secondary & Highlight Accents */
  --accent-secondary: #2DD4BF;       /* Turquoise accent: #2DD4BF */
  --accent-secondary-rgb: 45, 212, 191;
  --highlight: #99F6E4;              /* Pale mint highlight: #99F6E4 */
  --highlight-rgb: 153, 246, 228;

  /* Text & Content */
  --text-primary: #113330;           /* Main text: #113330 */
  --text-secondary: #365B56;         /* Secondary text: #365B56 */
  --text-muted: #668A84;             /* Soft sage slate */
  --text-inverse: #FFFFFF;

  /* Borders & Dividers */
  --border-subtle: #F0D5C7;          /* Borders: #F0D5C7 */
  --border-strong: #D5BDB0;          /* Borders: #D5BDB0 */
  --border-glow: rgba(15, 118, 110, 0.25);

  /* Status Colors (NO ORANGE) */
  --success: #0F766E;                /* Emerald */
  --success-bg: rgba(15, 118, 110, 0.12);
  --warning: #0D9488;                /* Deep Teal - NO ORANGE */
  --warning-bg: rgba(13, 148, 136, 0.12);
  --error: #E11D48;                  /* Rose red */
  --error-bg: rgba(225, 29, 72, 0.12);
  --info: #0284C7;                   /* Sky cyan */
  --info-bg: rgba(2, 132, 199, 0.12);
}
```

---

## 3. Typography & Editorial Hierarchy

- **Headings Font:** `Plus Jakarta Sans` (weights: 600, 700, 800) with editorial negative letter-spacing (`letter-spacing: -0.03em`)
- **Body & UI Font:** `Inter` (weights: 400, 500, 600) with optimized line-height for readability
- **Monospace Font:** `JetBrains Mono` for IDs, capacities, and timestamps
- **Editorial Eyebrow:** All-caps tracked text (`font-size: 0.72rem`, `letter-spacing: 0.14em`, `font-weight: 700`) used across section headers and card labels.

---

## 4. Component Standards & Distinctive Layouts

### 4.1 Buttons
- **`primary`**: Uses `--primary` (`#D95770` in Dark, `#0F766E` in Light) with a sharp, subtle hover lift and matching glow shadow.
- **`secondary`**: Uses `--bg-elevated` with subtle border and crisp text contrast.
- **`outline`**: Transparent surface with `--border-strong` and accent hover state.
- **`ghost`**: Clean, borderless action for low-profile secondary interactions.

### 4.2 Event Cards (Editorial Presentation)
- **Multi-Layout Support:**
  - `featured-hero`: Lead 2-column showcase card with wide imagery, quick metadata bar, host society badge, and registration CTA.
  - `card`: Standard 3-column grid card with date stamp ribbon, capacity meter bar, category pill, and venue info.
  - `list`: Compact horizontal row layout for density in exploration search.

### 4.3 Badges
- Micro-editorial badges supporting tracked uppercase typography.
- Status variants: `default`, `primary`, `success`, `warning`, `danger`, `outline`.
- Strict NO ORANGE compliance: Warnings rendered in soft coral pink in dark mode and deep teal in light mode.

### 4.4 Navigation Architecture
- **PublicNavbar:** Fixed glassmorphism bar featuring custom geometric "G" monogram logo mark, capsule navigation pills, ThemeToggle pill with icon & active label, and mobile slide-out drawer.
- **AppSidebar:** Dual-section collapsed/expanded sidebar grouping routes into *Discovery*, *My Activity*, and *Account*, with active indicator pill and bottom user profile card.
- **AppTopbar:** Clean breadcrumb trail, global event search input, notifications bell, and quick action trigger.
