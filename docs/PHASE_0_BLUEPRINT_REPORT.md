# GATHERLY – Phase 0 Master Architecture & Development Roadmap

**Project:** GATHERLY – Campus Event Discovery & Management Platform  
**Tagline:** Discover. Connect. Celebrate.  
**Academic Milestone:** Semester Submission Project – Phase 0  
**Status:** Completed Planning & Architectural Specifications  

---

## 1. Executive Summary & Problem Scope

GATHERLY is a modern, responsive campus event discovery and management platform. It addresses the fragmentation of university activities across social media and paper bulletin boards by delivering a unified digital campus portal where students can explore, register, bookmark, and manage event schedules.

The platform guarantees 100% compliance with the examiner's mandatory requirements while integrating advanced student-centric features (Event Calendar, Digital Ticket Passes, Live Countdowns, Toast Notifications, and Photo Gallery) wrapped in an independent, dual-theme design system (**Midnight Elegance** and **Soft Lavender**).

---

## 2. Independent Design System (FESTIQ Divergence)

GATHERLY explicitly avoids reproducing FESTIQ's forest-green/gold palette, standard popups, and repetitive card designs:

| Dimension | FESTIQ Reference | GATHERLY Master Implementation |
| :--- | :--- | :--- |
| **Dark Theme** | Deep forest green `#133E33` & gold `#E5B869` | **Midnight Slate `#080D1A`, Electric Violet `#8B5CF6`, Cyan `#22D3EE`** |
| **Light Theme** | Warm cream / yellowish off-white | **Soft Lavender `#F7F7FC`, Royal Purple `#7047EB`, Cyan `#0891B2`** |
| **Navigation** | Single public bar with generic modals | **Hybrid Architecture:** Modern public navbar + Full-featured App Dashboard with collapsible sidebar |
| **Event Details** | Primitive popup modal | **Dedicated Full-Page Route (`/events/:id`)** + Complementary Quick-View Modal |
| **Event Cards** | Flat basic layout | **Layered Glassmorphic Cards** with capacity bars, date ribbons, and interactive hover lifts |
| **Tokens** | Hardcoded colors | **100% CSS Custom Properties** with instant zero-flicker toggle & LocalStorage persistence |

---

## 3. Mandatory Examiner Requirements & Traceability

1. **Homepage:** Hero section with search & CTAs, platform intro, upcoming events, featured highlights, and intuitive navigation.
2. **Event Cards:** Title, date ribbon, venue, banner image, short description, category badge, details link, and register trigger.
3. **Event Exploration:** Real-time search, category filtering, sorting, responsive grid/list, and graceful empty states.
4. **Event Details:** Dedicated full route, agenda timeline, venue directions, organizer profile, live countdown timer, and register CTA.
5. **Registration & Validation:** Form collecting Participant Name, Email, Phone, Event Selector; client-side JS validation with regex format checks; duplicate registration prevention; and confirmed registration voucher pass.
6. **Responsiveness:** Fluid adaptation across Desktop (1280px+), Laptop (1024px-1279px), Tablet (768px-1023px), and Mobile (320px-767px).
7. **Tech Stack:** React 18+ (Vite), pure JavaScript ES6+, Lucide React icons, Git version control, deployment to Vercel.

---

## 4. Phase-by-Phase Roadmap (10 Phases)

```
[Phase 0] Master Planning & Blueprint (COMPLETE)
   │
   ▼
[Phase 1] Full-Stack Foundation, Project Architecture & Core Design System
   │
   ▼
[Phase 2] Public Landing Page (Hero, Featured, Upcoming, Stats)
   │
   ▼
[Phase 3] Application Layout (Collapsible Sidebar, Header, Mobile Drawer)
   │
   ▼
[Phase 4] Event Discovery & Exploration (Search, Filter, Sort, QuickView)
   │
   ▼
[Phase 5] Dedicated Event Profile & Live Countdown
   │
   ▼
[Phase 6] Student Authentication & Route Guards (JWT + Express)
   │
   ▼
[Phase 7] Registration Form & Validation Pipeline (Express + MongoDB)
   │
   ▼
[Phase 8] Student Command Center (Overview, Calendar, Gallery, Passes)
   │
   ▼
[Phase 9] UI Polish, Micro-interactions, Toast Alerts & Accessibility
   │
   ▼
[Phase 10] Final Submission, Build Verification, README & Deployment
```

