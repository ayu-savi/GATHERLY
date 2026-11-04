# GATHERLY – Master Design System Specification

> **Project:** GATHERLY (Discover. Connect. Celebrate.)  
> **Brand Style:** Midnight Elegance (Dark) & Soft Lavender (Light)  
> **Styling Technology:** CSS3 Custom Properties (Design Tokens)  
> **Typography:** Plus Jakarta Sans & Inter  

---

## 1. Brand Identity & Design Principles

### 1.1 Brand Identity
- **Name:** **GATHERLY**
- **Tagline:** *Discover. Connect. Celebrate.*
- **Logomark Concept:** A dynamic geometric emblem combining two intersecting campus arches that form an energetic spark (`Sparkles` / `Layers` motif), symbolizing student connection, discovery, and festivity.
- **Brand Voice:** Energetic, authoritative, student-centric, modern, and accessible.

### 1.2 Core Design Principles
1. **Equal Polish for Both Themes:** Dark and Light themes are equally prioritized. Zero hardcoded colors; 100% token-driven styling.
2. **Atmospheric Depth:** Layered surfaces, delicate glassmorphic borders, and soft shadows rather than flat or harsh cutouts.
3. **Information Clarity:** Strong typographical hierarchy, high-contrast text, and scannable badges.
4. **Intentional Motion:** Subtle, purposeful transitions (150ms–250ms) that provide immediate tactile feedback without disorienting users.
5. **Zero Layout Shift:** Rigid dimensioning and aspect-ratio preservation for event banners, icons, and cards.

---

## 2. Color Palettes & CSS Design Tokens

### 2.1 Dark Theme: "Midnight Elegance"
Designed for high-tech, late-evening student exploration with rich contrast and luminous accents:

```css
[data-theme="dark"] {
  /* Surface Tokens */
  --bg-primary: #080D1A;         /* Deep cosmic navy main background */
  --bg-secondary: #111A2E;       /* Layered sidebar and secondary panels */
  --bg-elevated: #1C2940;        /* Elevated card, modal, and dropdown surfaces */
  --bg-hover: #22324F;           /* Hover highlight for lists and buttons */
  --bg-glass: rgba(17, 26, 46, 0.85); /* Glassmorphic frosted overlays */

  /* Brand & Accent Tokens */
  --primary: #8B5CF6;            /* Electric Violet: Primary buttons & key highlights */
  --primary-hover: #7C3AED;      /* Darker violet on hover */
  --primary-rgb: 139, 92, 246;   /* RGB channels for opacity blending */
  --accent-cyan: #22D3EE;        /* Vibrant Cyan: Live countdowns, active tags */
  --accent-cyan-rgb: 34, 211, 238;
  --highlight-pink: #F472B6;     /* Celebratory Pink: Badges and accent gradients */
  --highlight-pink-rgb: 244, 114, 182;

  /* Typography Tokens */
  --text-primary: #F8FAFC;       /* Snow white: High-contrast primary text */
  --text-secondary: #A1AEC4;     /* Muted slate: Secondary metadata and labels */
  --text-muted: #64748B;         /* Dim grey: Placeholders and footnotes */
  --text-inverse: #080D1A;       /* Dark text used on bright button backgrounds */

  /* Border & Divider Tokens */
  --border-subtle: #26344B;      /* Standard card and container borders */
  --border-strong: #334460;      /* Focused input borders and active dividers */
  --border-glow: rgba(139, 92, 246, 0.4); /* Violet glow around focused fields */

  /* State Tokens */
  --success: #10B981;            /* Emerald green */
  --warning: #F59E0B;            /* Amber orange */
  --error: #EF4444;              /* Crimson red */
  --info: #06B6D4;               /* Sky cyan */

  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.4);
  --shadow-md: 0 4px 12px -1px rgba(0, 0, 0, 0.5), 0 2px 6px -1px rgba(0, 0, 0, 0.3);
  --shadow-lg: 0 10px 25px -3px rgba(0, 0, 0, 0.6), 0 4px 10px -2px rgba(0, 0, 0, 0.4);
  --shadow-glow: 0 0 20px rgba(139, 92, 246, 0.25);
}
```

### 2.2 Light Theme: "Soft Lavender"
Designed for daytime campus reading, university projectors, and clean academic presentations:

```css
[data-theme="light"] {
  /* Surface Tokens */
  --bg-primary: #F7F7FC;         /* Clean soft lavender-tinted porcelain */
  --bg-secondary: #FFFFFF;       /* Pure white panels, sidebar, and cards */
  --bg-elevated: #EEEAFE;        /* Subtle lavender elevated containers */
  --bg-hover: #E4DFFE;           /* Gentle lavender hover highlight */
  --bg-glass: rgba(255, 255, 255, 0.9); /* Frosted glass overlay */

  /* Brand & Accent Tokens */
  --primary: #7047EB;            /* Authoritative Royal Purple for buttons */
  --primary-hover: #5B32D6;      /* Deeper purple for button active/hover */
  --primary-rgb: 112, 71, 235;   /* RGB channels */
  --accent-cyan: #0891B2;        /* Rich Cyan for badges and secondary highlights */
  --accent-cyan-rgb: 8, 145, 178;
  --highlight-pink: #EC4899;     /* Vivid Magenta for special event tags */
  --highlight-pink-rgb: 236, 72, 153;

  /* Typography Tokens */
  --text-primary: #17172B;       /* Deep midnight ink */
  --text-secondary: #66677D;     /* Balanced charcoal grey */
  --text-muted: #9496A8;         /* Soft stone grey */
  --text-inverse: #FFFFFF;       /* Crisp white on primary buttons */

  /* Border & Divider Tokens */
  --border-subtle: #E7E5F0;      /* Delicate borders for cards and tables */
  --border-strong: #CDC9DF;      /* Stronger divider borders */
  --border-glow: rgba(112, 71, 235, 0.25); /* Purple focus rings */

  /* State Tokens */
  --success: #059669;            /* Deep emerald */
  --warning: #D97706;            /* Deep amber */
  --error: #DC2626;              /* Vibrant red */
  --info: #0284C7;               /* Rich cyan */

  /* Shadows */
  --shadow-sm: 0 1px 3px 0 rgba(23, 23, 43, 0.05);
  --shadow-md: 0 4px 16px -2px rgba(23, 23, 43, 0.08), 0 2px 6px -1px rgba(23, 23, 43, 0.04);
  --shadow-lg: 0 12px 32px -4px rgba(23, 23, 43, 0.12), 0 4px 12px -2px rgba(23, 23, 43, 0.06);
  --shadow-glow: 0 0 20px rgba(112, 71, 235, 0.2);
}
```

---

## 3. Typography Scale & Hierarchy

GATHERLY pairs **Plus Jakarta Sans** (geometric, friendly headers) with **Inter** (ultra-legible, crisp body text).

```css
:root {
  --font-heading: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
  --font-body: 'Inter', system-ui, -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;

  /* Scale */
  --text-xs: 0.75rem;    /* 12px - Micro labels, category tags */
  --text-sm: 0.875rem;   /* 14px - Metadata, form helper text */
  --text-base: 1rem;     /* 16px - Standard body text, inputs */
  --text-lg: 1.125rem;   /* 18px - Card subtitles, prominent labels */
  --text-xl: 1.25rem;    /* 20px - Section subheadings, card titles */
  --text-2xl: 1.5rem;    /* 24px - Modal titles, dashboard headers */
  --text-3xl: 1.875rem;  /* 30px - Major section titles */
  --text-4xl: 2.25rem;   /* 36px - Hero sub-headlines */
  --text-5xl: 3rem;      /* 48px - Hero primary headlines */
  --text-6xl: 3.75rem;   /* 60px - Display numbers, statistics */

  /* Weights */
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
  --font-extrabold: 800;
}
```

---

## 4. Spacing, Radii & Grid System

```css
:root {
  /* Spacing Scale */
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-5: 1.25rem;   /* 20px */
  --space-6: 1.5rem;    /* 24px */
  --space-8: 2rem;      /* 32px */
  --space-10: 2.5rem;   /* 40px */
  --space-12: 3rem;     /* 48px */
  --space-16: 4rem;     /* 64px */
  --space-20: 5rem;     /* 80px */

  /* Border Radii */
  --radius-sm: 6px;     /* Badges, tags, micro elements */
  --radius-md: 10px;    /* Inputs, small buttons */
  --radius-lg: 14px;    /* Cards, standard buttons, dropdowns */
  --radius-xl: 20px;    /* Elevated modals, hero panels */
  --radius-2xl: 28px;   /* Pill buttons, search bars */
  --radius-full: 9999px;/* Avatars, round icons */

  /* Layout Max Widths */
  --container-sm: 640px;
  --container-md: 768px;
  --container-lg: 1024px;
  --container-xl: 1280px;
  --container-2xl: 1440px;
}
```

---

## 5. UI Component Specifications

### 5.1 Buttons
- **Primary:** Violet background (`var(--primary)`), white text, subtle hover lift (`translateY(-2px)`), glow shadow on hover.
- **Secondary:** Surface background (`var(--bg-elevated)`), subtle border (`var(--border-subtle)`), text `var(--text-primary)`.
- **Outline:** Transparent background, `1.5px solid var(--border-strong)`, color `var(--text-primary)`, border turns violet on hover.
- **Ghost:** Transparent background, no border, text `var(--text-secondary)`, hover background `var(--bg-hover)`.
- **Sizes:** Small (`padding: 6px 12px; font-size: var(--text-sm)`), Medium (`padding: 10px 20px; font-size: var(--text-base)`), Large (`padding: 14px 28px; font-size: var(--text-lg)`).

### 5.2 Event Cards (`EventCard.jsx`)
- **Structure:**
  - Header: Category Badge (left) + Bookmark Icon Button (right).
  - Media: Aspect ratio `16:9` with smooth zoom on card hover (`scale(1.05)`).
  - Date Ribbon: Month & day pill floating on image banner.
  - Body: Event title (bold, line-clamp 2), date/time icon row, venue icon row, short brief (line-clamp 2).
  - Progress: Capacity bar showing "% seats filled" with colored indicator.
  - Footer: "Details" outline button + "Register" primary button.
- **Hover State:** Card lifts by `-4px`, border color shifts from `var(--border-subtle)` to `var(--primary)`, box-shadow expands.

### 5.3 Badges & Category Tags
- **Category Badges:** Rounded pills with category icon + label, subtle tinted background (`rgba(var(--primary-rgb), 0.12)`), text `var(--primary)`.
- **Featured Tag:** Gradient pill (`linear-gradient(135deg, #8B5CF6, #F472B6)`), white text.
- **Registration Status:** Emerald badge for "Open", Amber for "Filling Fast", Red for "Waitlist".

### 5.4 Form Inputs & Validation
- **Default State:** Background `var(--bg-secondary)`, border `1.5px solid var(--border-subtle)`, text `var(--text-primary)`, radius `var(--radius-md)`.
- **Focus State:** Border shifts to `var(--primary)`, box-shadow `0 0 0 3px var(--border-glow)`.
- **Error State:** Border shifts to `var(--error)`, error icon appears on right, clear red text message beneath input.

---

## 6. Responsive Breakpoint Rules

| Breakpoint Name | Viewport Width | Navigation Behavior | Event Grid Layout | Sidebar Mode |
| :--- | :--- | :--- | :--- | :--- |
| **Mobile (`sm`)** | `< 640px` | Hamburger drawer | 1 Column full width | Slide-out drawer only |
| **Tablet (`md`)** | `640px – 1023px` | Compact navbar | 2 Columns grid | Collapsed 80px or slide-out |
| **Desktop (`lg`)** | `1024px – 1279px` | Full navbar / app shell | 3 Columns grid | Collapsible 260px / 80px |
| **Wide (`xl`)** | `>= 1280px` | Full expansive layout | 3 to 4 Columns grid | Expanded 260px desktop |

---

## 7. Motion & Transition Guidelines

```css
:root {
  --transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-base: 250ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-smooth: 350ms cubic-bezier(0.16, 1, 0.3, 1);
}
```
- **Interactive Elements:** Buttons, cards, and links use `--transition-base`.
- **Theme Transitions:** Theme toggles apply smooth color transitions (`background-color 200ms ease, border-color 200ms ease, color 200ms ease`).
- **Modals & Drawers:** Fade in with slight scale animation (`scale(0.96) -> scale(1.0)`).
- **Reduced Motion:** Fully respects `@media (prefers-reduced-motion: reduce)` by disabling transitions for sensitive users.

