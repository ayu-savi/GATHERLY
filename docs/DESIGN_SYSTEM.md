# GATHERLY – Master Design System Specification

> **Project:** GATHERLY (Discover. Connect. Celebrate.)  
> **Brand Style:** Burgundy Galaxy (Dark) & Peach + Emerald + Turquoise (Light)  
> **Styling Technology:** CSS3 Custom Properties (Design Tokens)  
> **Typography:** Plus Jakarta Sans & Inter  
> **Strict Color Rule:** NO ORANGE anywhere across both themes.  

---

## 1. Brand Identity & Design Principles

### 1.1 Brand Identity
- **Name:** **GATHERLY**
- **Tagline:** *Discover. Connect. Celebrate.*
- **Brand Personality:** Sophisticated, vibrant, student-focused, academic yet modern.
- **Strict Color Policy:** Orange is completely prohibited across all buttons, gradients, icons, badges, hover effects, and borders. The interface relies strictly on **Burgundy Galaxy** for dark mode and **Peach, Emerald, Turquoise, and Pale Mint** for light mode.

---

## 2. Color Palettes & CSS Design Tokens

### 2.1 Dark Theme: "Burgundy Galaxy"
An immersive, deep cosmic burgundy palette designed for night-time campus browsing:

```css
[data-theme="dark"] {
  /* Surfaces */
  --bg-primary: #190E18;           /* Main background: Burgundy Galaxy */
  --bg-secondary: #301527;         /* Secondary surface / Cards */
  --bg-elevated: #441D37;          /* Elevated surfaces / Dropdowns */
  --bg-hover: #582647;             /* Hover highlight */
  --bg-glass: rgba(48, 21, 39, 0.88); /* Frosted glassmorphism */
  --bg-overlay: rgba(25, 14, 24, 0.8);

  /* Primary Brand Colors */
  --primary: #BE4B8B;              /* Primary accent: #BE4B8B */
  --primary-hover: #A83E78;
  --primary-active: #8F3265;
  --primary-rgb: 190, 75, 139;

  /* Secondary & Highlight Accents */
  --accent-secondary: #E879B9;     /* Secondary accent: #E879B9 */
  --accent-secondary-rgb: 232, 121, 185;
  --highlight: #F9A8D4;            /* Highlight: #F9A8D4 */
  --highlight-rgb: 249, 168, 212;

  /* Text & Content */
  --text-primary: #FFF1F8;         /* Crisp soft white */
  --text-secondary: #E2BED4;       /* Muted berry lavender */
  --text-muted: #A8839B;           /* Dim plum slate */
  --text-inverse: #190E18;

  /* Borders & Dividers */
  --border-subtle: #4D213E;
  --border-strong: #692D55;
  --border-glow: rgba(190, 75, 139, 0.4);

  /* Status Colors (STRICT: NO ORANGE) */
  --success: #10B981;
  --success-bg: rgba(16, 185, 129, 0.15);
  --warning: #F472B6;              /* Rose pink warning - NO ORANGE */
  --warning-bg: rgba(244, 114, 182, 0.15);
  --error: #FB7185;
  --error-bg: rgba(251, 113, 133, 0.15);
  --info: #2DD4BF;                 /* Turquoise info */
  --info-bg: rgba(45, 212, 191, 0.15);
}
```

### 2.2 Light Theme: "Peach + Emerald + Turquoise"
A welcoming, clean, daylight campus palette combining warm peach tones with authoritative emerald and refreshing turquoise accents:

```css
[data-theme="light"] {
  /* Surfaces */
  --bg-primary: #FFF8F5;           /* Main background: #FFF8F5 */
  --bg-secondary: #FFFFFF;         /* Card surface: #FFFFFF */
  --bg-elevated: #FFE8DD;          /* Soft peach surface: #FFE8DD */
  --bg-hover: #FEDDCD;             /* Gentle peach hover */
  --bg-glass: rgba(255, 255, 255, 0.92);
  --bg-overlay: rgba(15, 41, 38, 0.45);

  /* Primary Brand Colors */
  --primary: #0F766E;              /* Primary emerald: #0F766E */
  --primary-hover: #115E59;
  --primary-active: #134E4A;
  --primary-rgb: 15, 118, 110;

  /* Secondary & Highlight Accents */
  --accent-secondary: #2DD4BF;     /* Turquoise accent: #2DD4BF */
  --accent-secondary-rgb: 45, 212, 191;
  --highlight: #99F6E4;            /* Pale mint highlight: #99F6E4 */
  --highlight-rgb: 153, 246, 228;

  /* Text & Content */
  --text-primary: #113330;         /* Deep emerald charcoal */
  --text-secondary: #365B56;       /* Medium forest slate */
  --text-muted: #668A84;           /* Soft sage slate */
  --text-inverse: #FFFFFF;

  /* Borders & Dividers */
  --border-subtle: #F0D5C7;        /* Soft peach border */
  --border-strong: #D5BDB0;        /* Firm peach divider */
  --border-glow: rgba(15, 118, 110, 0.25);

  /* Status Colors (STRICT: NO ORANGE) */
  --success: #0F766E;              /* Emerald */
  --success-bg: rgba(15, 118, 110, 0.12);
  --warning: #0D9488;              /* Deep Teal - NO ORANGE */
  --warning-bg: rgba(13, 148, 136, 0.12);
  --error: #E11D48;                /* Rose red */
  --error-bg: rgba(225, 29, 72, 0.12);
  --info: #0284C7;                 /* Sky cyan */
  --info-bg: rgba(2, 132, 199, 0.12);
}
```

---

## 3. Typography Hierarchy

- **Headings Font:** `Plus Jakarta Sans` (weights: 600, 700, 800)
- **Body Font:** `Inter` (weights: 400, 500, 600)
- **Monospace Font:** `JetBrains Mono`

---

## 4. Component Standards

- **Buttons:**
  - `primary`: Uses `--primary` with subtle lift on hover and glowing shadow.
  - `secondary`: Uses `--bg-elevated` with subtle border.
  - `accent / turquoise`: Uses `--accent-secondary`.
- **Event Cards:**
  - Glassmorphic / secondary surface, 16:9 media banner, date badge ribbon, capacity gauge bar, category badge, and dual CTA buttons.
- **Badges:**
  - Color-coded by category (Technical: emerald/primary; Cultural: pink/rose; Sports & Gaming: turquoise; Arts: peach/highlight). Zero orange.
