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

### PHASE 1: Full-Stack Foundation, Project Architecture & Core Design System (Completed)
- **Status:** Complete.
- **Outcome:** Monorepo setup with separated frontend/backend, Express server running with health monitoring, React 18 + Vite client, design tokens, theme context, layout shells, and initial Git commit.

---

### PHASE 2: Public Landing Page & Campus Highlights (Completed)
- **Status:** Complete.
- **Primary Objective:** Build an engaging, responsive landing page reflecting GATHERLY's brand identity, backed by real event & stats REST APIs.
- **Frontend Delivered:**
  - Hero section with live search input, animated headline, tagline, and dual CTAs ("Explore Events" & "Host an Event").
  - Featured events section displaying real API data via `EventCard` components with capacity bars, date ribbons, and category badges.
  - Categories section showcasing all 8 campus event domains with custom Lucide icons.
  - Real campus statistics grid calculating active events, registered participants, event categories, and student societies.
  - Upcoming events preview section with chronological agenda tiles.
  - Campus community promotional section ("Built Exclusively for University Life").
  - "Host an Event" CTA and interactive modal dialog.
  - Dual theme styling: Burgundy Galaxy (Dark) and Peach + Emerald + Turquoise (Light) with strict prohibition of orange.
- **Backend Delivered:**
  - `Event` & `Category` Mongoose models.
  - `GET /api/events/featured`: Featured campus events with limit parameter.
  - `GET /api/events/upcoming`: Chronological upcoming events.
  - `GET /api/categories`: 8 campus activity domains.
  - `GET /api/stats/overview`: Real calculated statistics (total events, registered participants, categories, societies).
  - Graceful fallback mechanism returning clearly flagged development seed data when MongoDB is offline.
- **Integration & Verification:** Both Express backend (port 5000) and Vite frontend (port 5173) running live simultaneously and communicating successfully.

---

### PHASE 3: Student Dashboard, Event Details, Registration & Complete UX Refinement (Completed)
- **Status:** Complete & Verified.
- **Primary Objective:** Build a personalized student dashboard, complete event details page, full registration workflow, digital event passes with scannable QR codes, gate verifier, and streamlined navigation.
- **Frontend Delivered:**
  - Public Navbar redesign: Home, Discover, About Campus, and Sign In / Join Campus before login; authenticated student Dashboard pill and profile menu after login.
  - Streamlined EventCard: 16:9 imagery with hover zoom, category & fee pills, status badge, concise summary, and prominent "View Event Details" CTA.
  - Complete Event Details Page (`/events/:id`): Large hero banner, untruncated narrative description, logistics matrix, rules & guidelines, prizes & rewards pool, financial allocation model (~76% prize pool), organizing committee card, schedule timeline, and dynamic registration panel.
  - Interactive Registration Modal (`RegistrationModal.jsx`): Participant details pre-filled from student profile, solo vs team roster, demo payment sandbox step, validation, duplicate check, and instant digital pass generation.
  - Student Dashboard (`OverviewPage.jsx`): Personalized welcome banner, metrics bento, registered events cards with direct pass triggers, and recommendations.
  - My Registrations (`RegistrationsPage.jsx`): Filter tabs (all, confirmed, attended, cancelled), cancellation action, and pass links.
  - Digital Passes Hub (`PassesPage.jsx`): Perforated ticket styling, high-contrast SVG QR Code, pass ID, and Print/Download actions.
  - Gate Admission Verifier (`PassVerifierPage.jsx`): Security/organizer tool for verifying QR tokens and checking in participants with double-entry prevention.
  - Student Profile (`ProfilePage.jsx`): Student ID, department, contact info, and edit functionality.
- **Backend Delivered:**
  - Extended `Event.js` & `seedData.js` with registrationFee, rules, teamPolicy, prizes, organizingCommittee, and financialConfig.
  - `User.js` model with bcryptjs password hashing and role validation.
  - `Registration.js` model with compound unique index `{ user: 1, event: 1 }` to prevent duplicate registrations.
  - `authController.js` & `authRoutes.js`: Login, register, and JWT authentication (`/api/auth/*`).
  - `registrationController.js` & `registrationRoutes.js`: Register, my registrations, get single registration, and cancel registration (`/api/registrations/*`).
  - `passController.js` & `passRoutes.js`: My passes, get pass by ID, QR token verification, and gate check-in (`/api/passes/*`).
  - Pure JS QR Code generator utility (`backend/utils/qrGenerator.js`) producing standards-compliant SVG matrices.
- **Integration & Verification:**
  - 12/12 integration suite tests passed: auth login, event details, free & paid registration, duplicate rejection (409), pass generation, QR verification, gate check-in, repeat entry prevention (409), and cancellation.

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
