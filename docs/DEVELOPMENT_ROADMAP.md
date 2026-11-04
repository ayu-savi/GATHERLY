# GATHERLY – Master 10-Phase Full-Stack Development Roadmap

> **Project:** GATHERLY (Discover. Connect. Celebrate.)  
> **Methodology:** Integrated Full-Stack Iterative Engineering (Vertical Slices)  
> **Frontend:** React 18+ (Vite)  
> **Backend:** Node.js + Express.js REST API  
> **Database:** MongoDB with Mongoose  
> **Deployment Target:** Vercel (Frontend) + Render / Cloud (Backend)  

---

## 1. Full-Stack Development Protocol

To maintain architectural harmony and avoid disconnected layers, every phase implements integrated vertical slices:
1. **Vertical Slice Implementation:** Both frontend components and backend routes/controllers/models are updated together during each functional phase.
2. **Never Fake Backend Persistence:** Data interactions (events, registrations, users) communicate with Express API endpoints backed by MongoDB.
3. **Preservation of Existing Code:** Never regress or overwrite previously verified features.
4. **Focused Development Velocity:** Development velocity is prioritized during Phases 1–9. Complete, formal end-to-end testing, bug fixing, and verification are consolidated into **Phase 10**.

---

## 2. Master 10-Phase Roadmap

```
Phase 0 [COMPLETE]  ──>  Phase 1 [CURRENT]    ──>  Phase 2             ──>  Phase 3
Master Planning          Full-Stack Foundation     Public Landing Page      Application Shell
Docs in docs/            Express, React, Theme     Hero, Categories, API    Sidebar, Topbar & Layout
       │                         │                         │                        │
       ▼                         ▼                         ▼                        ▼
Phase 7             <──  Phase 6              <──  Phase 5             <──  Phase 4
Registration API         Full-Stack Auth           Event Details API        Event Discovery API
Validation & MongoDB     JWT, bcrypt, Protected    Countdown, Agenda, Mongo Filter, Search & Mongo
       │
       ▼
Phase 8             ──>  Phase 9              ──>  Phase 10
Student Dashboard        Polish & Polish           Final Submission
Calendar, Gallery & Pass Dark/Light & Responsive   Full Testing, Git & Deploy
```

---

### PHASE 0: Master Architecture, Blueprint & Specifications (Completed)
- **Status:** Complete.
- **Outcome:** Comprehensive architectural specifications, route map, design tokens, and examiner mapping documented in `docs/`.

---

### PHASE 1: Full-Stack Foundation, Project Architecture & Core Design System (Current)
- **Primary Objective:** Initialize the full-stack architecture with separated `frontend/` and `backend/` directories, Express health-check API, MongoDB Mongoose configuration, React + Vite frontend, centralized CSS variables design tokens, working Dark/Light theme switching, core application providers, and foundational components.
- **Backend Components:**
  - `backend/app.js`, `backend/server.js`, `backend/config/db.js`
  - Health check endpoint `GET /api/health`
  - CORS, JSON body parser, centralized error handler `errorHandler.js`
  - Standardized response utility `apiResponse.js`
- **Frontend Components:**
  - React + Vite scaffolding with `react-router-dom`, `axios`, `lucide-react`
  - Centralized design system in `src/styles/` (`variables.css`, `themes.css`, `global.css`, `responsive.css`)
  - Full working `ThemeContext` & `useTheme` hook (Midnight Elegance & Soft Lavender)
  - Core providers (`ThemeProvider`, `AuthProvider`, `EventProvider`, `ToastProvider`)
  - Layout foundations (`PublicLayout`, `AppLayout`, `ProtectedRoute`)
  - Shared atomic components (`Button`, `Badge`, `Input`, `Card`, `Modal`, `ThemeToggle`, `PublicNavbar`, `PublicFooter`, `AppTopbar`, `AppSidebar`, `MobileDrawer`)
  - Axios API client (`src/services/api.js`)
- **Completion Criteria:** Backend serves `GET /api/health`, frontend renders with working theme toggling, routing structure ready, root scripts configured.

---

### PHASE 2: Public Landing Page & Campus Highlights
- **Primary Objective:** Build an engaging, responsive landing page reflecting GATHERLY's brand identity, backed by initial event stats API.
- **Frontend:** Hero section with search bar and animated CTAs, featured events preview, 8 category showcase cards, upcoming events ribbon, animated statistics counter, campus highlights, and comprehensive footer.
- **Backend:** `GET /api/events/featured`, `GET /api/stats/overview` endpoints.
- **Design:** Full theme adherence across dark/light modes with zero layout shift.

---

### PHASE 3: Application Shell & Dashboard Layout
- **Primary Objective:** Build the authenticated application layout with a collapsible sidebar, dynamic header, and responsive drawer.
- **Frontend:**
  - Collapsible desktop sidebar (260px expanded / 80px icon-only with tooltips).
  - Application topbar with sidebar toggle, breadcrumbs, search, theme switch, and user avatar menu.
  - Mobile slide-out drawer with touch backdrop.
  - Active route indicators.
- **Backend:** User session verification endpoint integration (`GET /api/auth/me`).

---

### PHASE 4: Event Discovery & Exploration Engine
- **Primary Objective:** Deliver an advanced event discovery experience supporting keyword search, multi-category filtering, sorting, and responsive layout switching.
- **Frontend:** Live search, 8 category filter tabs, date/popularity sorting, Grid/List view toggle, `EventQuickView` modal, and empty search results state.
- **Backend:** `Event` Mongoose model, `GET /api/events` with search query parameters (`?q=`, `?category=`, `?sort=`), seed dataset loader.

---

### PHASE 5: Dedicated Event Details Page
- **Primary Objective:** Create an in-depth, dedicated event profile page (`/events/:id`) featuring complete agendas, venue details, organizer information, live countdown timer, and bookmarking.
- **Frontend:** Full-page route, dynamic Day:Hour:Min:Sec countdown timer, agenda schedule timeline, venue campus notes, organizer profile, capacity progress bar, and bookmark toggle.
- **Backend:** `GET /api/events/:id` returning detailed event record, schedule, and live seat count.

---

### PHASE 6: Full-Stack Authentication & Session Management
- **Primary Objective:** Implement clean student authentication with form validation, password visibility toggles, mock account login, persistent JWT sessions, and route guards.
- **Frontend:** Login and Signup pages, password visibility toggle, one-click demo credentials helper, `ProtectedRoute` client guard.
- **Backend:** `User` Mongoose model, password hashing with `bcryptjs`, JWT generation, `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`, `authMiddleware.js`.

---

### PHASE 7: Event Registration Pipeline & Form Validation
- **Primary Objective:** Fulfill the examiner's core registration mandate with JavaScript client-side validation, duplicate prevention, MongoDB persistence, and digital confirmation passes.
- **Frontend:** Registration form (Participant Name, Email, Phone, Event Selector), real-time JS validation, duplicate registration check, registration confirmation modal with digital ticket voucher.
- **Backend:** `Registration` Mongoose model, `POST /api/registrations` with server validation, duplicate prevention logic, atomic event capacity decrement.

---

### PHASE 8: Student Dashboard & Personalization Hub
- **Primary Objective:** Deliver a personalized student command center featuring registrations, bookmarks, an interactive event calendar, and a campus memory gallery.
- **Frontend:** Overview dashboard with statistics, My Registrations with digital passes and cancellation actions, Saved Events wishlist, interactive monthly Event Calendar, and campus photo gallery with lightbox.
- **Backend:** `GET /api/registrations/my`, `DELETE /api/registrations/:id`, `GET /api/events/saved`, `POST /api/events/save/:id`.

---

### PHASE 9: UI/UX Refinement, Accessibility & Polish
- **Primary Objective:** Elevate the entire platform to top-tier academic presentation standards with smooth micro-interactions, responsive refinements, toast alerts, and contrast checks.
- **Features:** Global toast notifications, skeleton loaders, comprehensive dark/light contrast audit, keyboard navigation, and responsive touch optimizations.

---

### PHASE 10: Final Submission, Testing, Git & Deployment
- **Primary Objective:** Perform comprehensive end-to-end testing, bug fixes, final production builds, Git commits, README documentation, and cloud deployment to Vercel (frontend) and Render (backend).
- **Features:** Full functional verification of all examiner requirements, production builds, comprehensive README with setup instructions and API docs, and live deployment links.
