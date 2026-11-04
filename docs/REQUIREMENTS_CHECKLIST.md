# GATHERLY – Requirements Traceability Checklist

> **Project:** GATHERLY (Discover. Connect. Celebrate.)  
> **Purpose:** Rigorous verification matrix mapping all mandatory examiner requirements and value-added features to their planned full-stack implementation phases and verification criteria.  

---

## 1. Mandatory Examiner Requirements Traceability Matrix

Every requirement explicitly listed in the examiner's problem statement is tracked below.

| Requirement Category | Specific Examiner Requirement | Planned Phase | Full-Stack Implementation Target | Verification & Acceptance Criteria |
| :--- | :--- | :--- | :--- | :--- |
| **Homepage** | Attractive and engaging hero section | **Phase 2** | `frontend/src/pages/public/HomePage.jsx` | Visually captivating headline, campus tagline, quick search bar, dual CTA buttons, animated background accents. |
| **Homepage** | Introduction to campus event platform | **Phase 2** | `frontend/src/pages/public/HomePage.jsx` | Engaging narrative explaining how GATHERLY connects students with societies and campus fests. |
| **Homepage** | Upcoming events section | **Phase 2** | `frontend/src/pages/public/HomePage.jsx` + `backend/routes/eventRoutes.js` | Chronological upcoming events fetched via API with date ribbons and direct register/view links. |
| **Homepage** | Featured events section | **Phase 2** | `frontend/src/pages/public/HomePage.jsx` + `backend/routes/eventRoutes.js` | Prominently displays high-profile fests with featured status tags and capacity counters. |
| **Homepage** | Event cards with relevant information | **Phase 2, 4** | `frontend/src/components/events/EventCard.jsx` | Card displays title, date, venue, category, banner image, short brief, and action buttons. |
| **Homepage** | Clean and intuitive navigation | **Phase 1, 2** | `frontend/src/components/navigation/PublicNavbar.jsx` | Sticky glassmorphic navbar with active indicator, theme toggle, brand logo, and responsive mobile menu. |
| **Event Cards** | Event Name | **Phase 2, 4** | `frontend/src/components/events/EventCard.jsx` | High-contrast readable title with line clamping for consistency. |
| **Event Cards** | Event Date | **Phase 2, 4** | `frontend/src/components/events/EventCard.jsx` | Formatted readable date (e.g. `Nov 20, 2026`) with calendar icon. |
| **Event Cards** | Venue | **Phase 2, 4** | `frontend/src/components/events/EventCard.jsx` | Campus building/hall name with map-pin icon. |
| **Event Cards** | Event Image | **Phase 2, 4** | `frontend/src/components/events/EventCard.jsx` | High-resolution image banner with graceful loading and fallback placeholder. |
| **Event Cards** | Short Description | **Phase 2, 4** | `frontend/src/components/events/EventCard.jsx` | 2-line brief summarizing the activity. |
| **Event Cards** | Relevant Category | **Phase 2, 4** | `frontend/src/components/events/EventCard.jsx` (Badge) | Color-coded category tag (e.g. Technical, Cultural, Sports). |
| **Event Cards** | Event Details Navigation | **Phase 2, 4** | `frontend/src/components/events/EventCard.jsx` | Direct link routing to dedicated `/events/:id` profile. |
| **Event Cards** | Registration Option | **Phase 2, 4** | `frontend/src/components/events/EventCard.jsx` | Direct button opening pre-populated registration form modal. |
| **Event Exploration** | Browse available events | **Phase 4** | `frontend/src/pages/public/ExplorePage.jsx` + `backend/routes/eventRoutes.js` | Full catalog view displaying all campus events from MongoDB in a responsive grid or list. |
| **Event Exploration** | Search events by name or keywords | **Phase 4** | `frontend/src/components/events/EventFilter.jsx` + API `?q=` | Live text search filtering across title, description, venue, and tags. |
| **Event Exploration** | Filter events by categories | **Phase 4** | `frontend/src/components/events/EventFilter.jsx` + API `?category=` | Filter pills for 8 distinct categories + "All", with live counter badges. |
| **Event Exploration** | Display relevant search results | **Phase 4** | `frontend/src/components/events/EventGrid.jsx` | Dynamic live rendering of matched events with counter ("Showing X of Y events"). |
| **Event Exploration** | Provide intuitive navigation | **Phase 4** | `frontend/src/pages/public/ExplorePage.jsx` | Clear breadcrumbs, sort dropdowns, and instant filter reset button. |
| **Event Details** | Detailed event information | **Phase 5** | `frontend/src/pages/public/EventDetailPage.jsx` + `GET /api/events/:id` | Dedicated full-page route (`/events/:id`) with complete event specs from MongoDB. |
| **Event Details** | Event description | **Phase 5** | `frontend/src/pages/public/EventDetailPage.jsx` | Comprehensive multi-paragraph description and event guidelines. |
| **Event Details** | Date and Time | **Phase 5** | `frontend/src/pages/public/EventDetailPage.jsx` | Explicit event schedule, start/end times, and calendar dates. |
| **Event Details** | Venue | **Phase 5** | `frontend/src/pages/public/EventDetailPage.jsx` | Campus location, room number, hall, and map guidance. |
| **Event Details** | Event Image | **Phase 5** | `frontend/src/pages/public/EventDetailPage.jsx` | High-impact hero banner + photo gallery thumbnails. |
| **Event Details** | Registration Option | **Phase 5** | `frontend/src/pages/public/EventDetailPage.jsx` | Prominent "Register Now" CTA opening registration flow. |
| **Event Registration** | Participant Name field | **Phase 7** | `frontend/src/components/forms/RegistrationForm.jsx` | Text input requiring minimum 3 alphabetic characters. |
| **Event Registration** | Email Address field | **Phase 7** | `frontend/src/components/forms/RegistrationForm.jsx` | Email input validated via standard RFC email regular expression. |
| **Event Registration** | Phone Number field | **Phase 7** | `frontend/src/components/forms/RegistrationForm.jsx` | Phone input validated for 10 numeric digits. |
| **Event Registration** | Selected Event field | **Phase 7** | `frontend/src/components/forms/RegistrationForm.jsx` | Dropdown selector displaying active events, auto-selected if triggered from card. |
| **Event Registration** | JavaScript-based form validation | **Phase 7** | `frontend/src/utils/validators.js` | Pure client-side JavaScript validation logic firing on change & submit. |
| **Event Registration** | Validation for required fields | **Phase 7** | `frontend/src/utils/validators.js` | Checks non-empty inputs and displays explicit field error messages. |
| **Event Registration** | Valid email format validation | **Phase 7** | `frontend/src/utils/validators.js` | Flags missing `@`, invalid domains, and syntax errors. |
| **Event Registration** | Valid phone number validation | **Phase 7** | `frontend/src/utils/validators.js` | Flags non-numeric characters, numbers < 10 or > 10 digits. |
| **Event Registration** | Selected event validation | **Phase 7** | `frontend/src/utils/validators.js` | Ensures a valid event is selected from available list. |
| **Event Registration** | Appropriate error messages | **Phase 7** | `frontend/src/components/forms/RegistrationForm.jsx` | Contextual red error alerts beneath invalid inputs with icon. |
| **Event Registration** | Display confirmation message | **Phase 7** | `frontend/src/components/dashboard/RegistrationTicket.jsx` | Confirmation screen with printable digital ticket and registration ID. |
| **Responsiveness** | Desktop display | **Phase 1, 2, 9** | Global styles & media queries | Pixel-perfect layout on 1280px+ desktop viewports. |
| **Responsiveness** | Laptop display | **Phase 1, 2, 9** | Global styles & media queries | Balanced multi-column layout on 1024px-1279px laptop displays. |
| **Responsiveness** | Tablet display | **Phase 1, 2, 9** | Global styles & media queries | Adaptive 2-column grid and collapsible sidebars on 768px-1023px tablets. |
| **Responsiveness** | Mobile phones display | **Phase 1, 2, 9** | Global styles & media queries | Single-column fluid stack with touch drawer on 320px-767px mobile screens. |
| **Technical Stack** | HTML5 | **All Phases** | Semantic HTML5 structure | Semantic elements (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`). |
| **Technical Stack** | CSS3 | **All Phases** | Custom CSS3 + Design Tokens | CSS Custom Properties, Flexbox, Grid, transitions, and media queries. |
| **Technical Stack** | JavaScript / React.js | **All Phases** | React 18+ (Vite) | Modern React functional components, hooks, and clean ES6+ JavaScript. |
| **Technical Stack** | Backend Architecture | **All Phases** | Node.js + Express.js | Modular Express server, REST endpoints, CORS, centralized error handling. |
| **Technical Stack** | Database & Persistence | **All Phases** | MongoDB + Mongoose | MongoDB schemas for users, events, registrations; graceful fallback if not connected. |
| **Technical Stack** | Git and GitHub | **All Phases** | Git version control | Regular descriptive commits matching conventional commit format. |
| **Technical Stack** | README documentation | **Phase 10** | `README.md` | Comprehensive documentation with setup steps, features, screenshots, and API docs. |
| **Technical Stack** | Deployment | **Phase 10** | Vercel (Frontend) + Render (Backend) | Production cloud deployment with live public URLs. |

---

## 2. Additional Value-Added Features Checklist

| Additional Feature | Module | Planned Phase | Target Implementation | Value Proposition |
| :--- | :--- | :--- | :--- | :--- |
| **Interactive Event Calendar** | Module J | **Phase 8** | `frontend/src/pages/app/CalendarPage.jsx` | Monthly visual grid with event markers and registration highlights. |
| **Event Bookmarks / Saved Events** | Module J | **Phase 5, 8** | `frontend/src/pages/app/SavedEventsPage.jsx` + API | Allows students to save interesting events to a personal wishlist. |
| **Live Countdown Timer** | Module J | **Phase 5** | `frontend/src/components/common/CountdownTimer.jsx` | Real-time ticking countdown to event start on event detail page. |
| **Toast Notification Engine** | Module J | **Phase 9** | `frontend/src/context/ToastContext.jsx` | Animated, accessible floating alerts confirming user actions. |
| **Quick-View Modal** | Module C | **Phase 4** | `frontend/src/components/events/EventQuickView.jsx` | Allows swift event inspection without full page navigation. |
| **Capacity & Seat Availability Bar** | Module J | **Phase 2, 5** | `frontend/src/components/events/CapacityBar.jsx` | Visual progress bar displaying seats booked vs total capacity. |
| **Duplicate Registration Blocker** | Module F | **Phase 7** | `backend/controllers/registrationController.js` | Prevents a student from accidentally submitting multiple registrations. |
| **Campus Event Photo Gallery** | Module H | **Phase 8** | `frontend/src/pages/app/GalleryPage.jsx` | Categorized visual memories with accessible lightbox preview. |
| **Digital Event Ticket Voucher** | Module F | **Phase 7, 8** | `frontend/src/components/dashboard/RegistrationTicket.jsx` | Formatted event pass with QR code simulation and printable format. |
| **Organizer Event Submission** | Module J | **Phase 8** | `frontend/src/components/forms/CreateEventModal.jsx` + API | Enables student society leaders to draft new campus events. |
| **Dual Theme System with Zero-Flicker** | System | **Phase 1, 2, 9** | `frontend/src/context/ThemeContext.jsx` | Burgundy Galaxy & Peach+Emerald+Turquoise (Strictly NO Orange) with LocalStorage persistence. |
| **Demo Login Quick-Fill Helpers** | Module E | **Phase 6** | `frontend/src/pages/auth/LoginPage.jsx` | 1-click credentials filling for examiners to evaluate without typing. |
