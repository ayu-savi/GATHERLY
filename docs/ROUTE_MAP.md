# GATHERLY – Master Route Map & Navigation Architecture

> **Project:** GATHERLY (Discover. Connect. Celebrate.)  
> **Document:** Comprehensive Route Map & Navigation Specification  
> **Routing Engine:** React Router DOM v6  
> **Navigation Pattern:** Hybrid Layout (Public Navbar + App Collapsible Sidebar)  

---

## 1. Routing Overview & Architectural Philosophy

GATHERLY utilizes a clear, predictable, and robust hierarchical route architecture. To deliver both a welcoming public website and a high-productivity student application workspace, the site implements two primary layout shells:
1. **Public Layout (`PublicLayout.jsx`):** Transparent/glassmorphic sticky top navbar, full-width responsive landing views, and deep footer.
2. **Application Layout (`AppLayout.jsx`):** Unified horizontal authenticated navbar with student avatar dropdown, full-width responsive workspace (no permanent left sidebar), and standard campus footer.

All navigation links are strictly wired to real routes. There are **zero dead-ends, zero empty dummy anchors (`#`), and zero placeholder links**.

---

## 2. Comprehensive Route Matrix

| Route Path | Layout | Route Guard | Page Component | Primary Purpose |
| :--- | :--- | :--- | :--- | :--- |
| `/` | `PublicLayout` | Public | `HomePage.jsx` | Engaging hero, platform overview, featured & upcoming events, category showcases, statistics. |
| `/events` | `PublicLayout` | Public | `ExplorePage.jsx` | Full-scale event exploration with live keyword search, category filters, sorting, and responsive grid/list. |
| `/events/:id` | `PublicLayout` | Public | `EventDetailsPage.jsx` | Dedicated event profile with complete description, logistics matrix, rules, prizes, organizing committee, financial model, schedule, and registration modal. |
| `/categories` | `PublicLayout` | Public | `CategoriesPage.jsx` | Directory of all 8 campus domains with academic affiliations, student societies, and direct category filters. |
| `/about` | `PublicLayout` | Public | `AboutPage.jsx` | Academic project overview, campus mission, platform advantages, and developer credits. |
| `/login` | `PublicLayout` | Public | `LoginPage.jsx` | Student authentication portal with one-click demo login credentials and redirect preservation. |
| `/signup` | `PublicLayout` | Public | `SignupPage.jsx` | Student onboarding registration with validation (name, email, phone, student ID, department). |
| `/app` | `AppLayout` | Protected | Redirect -> `/app/overview` | Base application root redirecting straight to student overview. |
| `/app/overview` | `AppLayout` | Protected | `OverviewPage.jsx` | Personalized student dashboard: welcome banner, metrics bento, registered events cards, and recommendations. |
| `/app/registrations`| `AppLayout` | Protected | `RegistrationsPage.jsx`| Management of student registrations, status tabs (all, confirmed, attended, cancelled), and cancellation action. |
| `/app/passes` | `AppLayout` | Protected | `PassesPage.jsx` | Dedicated Digital Passes hub with perforated ticket cards, scannable QR Code SVG, and Print/Download actions. |
| `/app/pass-verifier` | `AppLayout` | Protected | `PassVerifierPage.jsx` | Campus Gate Admission & QR Verifier for security/organizers with check-in and double-entry prevention. |
| `/app/profile` | `AppLayout` | Protected | `ProfilePage.jsx` | Student profile viewer and editor (academic department, phone, contact details, student ID). |
| `/app/settings` | `AppLayout` | Protected | `ProfilePage.jsx` | Student settings, profile preferences, and account configuration. |
| `*` | `PublicLayout` | Public | `NotFoundPage.jsx` | Branded 404 error page with clear navigation buttons back to Home or Discover. |

---

## 3. Detailed Route Specifications & User Journeys

### 3.1 Public Routes

#### 3.1.1 Home Page (`/`)
- **Header:** Sticky `PublicNavbar` with logo, navigation links, theme toggle, and Login / Sign Up buttons (or user avatar pill if already logged in).
- **Hero Section:** Bold headline ("Discover. Connect. Celebrate."), animated tagline, quick search bar that passes query to `/events`, and primary CTAs ("Explore Events", "View Dashboard").
- **Featured Events:** High-impact carousel/grid displaying top campus fests with featured badges.
- **Categories Grid:** Interactive tiles representing the 8 campus domains with live counts.
- **Upcoming Events:** Chronological upcoming campus activities with date ribbons and direct register actions.
- **Live Statistics:** Animated metrics counters (Active Events, Registered Students, Campus Societies, Total Fests).
- **Campus Highlights:** Visual showcase of past event energy.
- **Footer:** Deep navigation links, legal disclaimer, GitHub repository link, and academic credits.

#### 3.1.2 Event Exploration (`/events` & `/categories/:categorySlug`)
- **Search Header:** Real-time search bar with clear button and debounced filtering.
- **Filter Pills:** Horizontal scrollable category badges (All, Technical, Cultural, Sports, Gaming, Workshops, Management, Entrepreneurship, Arts).
- **Sort & View Controls:** Sort by Date (Earliest first), Title (A-Z), Popularity (Most registered). Toggle Grid / List view.
- **Result Grid:** Rendered using `EventGrid` and `EventCard` components.
- **Empty State:** Illustrated fallback with "Clear Filters" button when search produces no matches.

#### 3.1.3 Dedicated Event Detail (`/events/:id`)
- **Event Banner:** High-resolution cover photo with breadcrumbs (`Home > Events > [Event Title]`).
- **Header Section:** Event title, category pill, featured badge, date, time, and venue.
- **Live Countdown Timer:** Dynamic Day : Hour : Min : Sec countdown to the event start time.
- **Detailed Agenda / Schedule:** Tabular or vertical timeline showing day-by-day activities.
- **Venue & Map Info:** Campus hall, building number, room, and navigation notes.
- **Organizer Information:** Student society name, contact email, and telephone.
- **Action Strip:** Sticky or floating registration bar featuring seat availability gauge, bookmark button, and "Register Now" modal trigger.

#### 3.1.4 Public Category Hub (`/categories`)
- Visual catalog of all 8 campus event categories.
- Each category card presents custom iconography, description, upcoming event count, and a direct link to `/categories/:categorySlug`.

#### 3.1.5 Authentication Pages (`/login` & `/signup`)
- Split-screen design (Atmospheric campus event illustration on left; clean, focused form on right).
- Password visibility toggle (eye icon).
- One-click demo credentials pills ("Log in as Demo Student" / "Log in as Society Lead") to accelerate examiner grading.
- Form validation error alerts.
- Smooth redirect back to the page the user originally attempted to visit.

---

### 3.2 Authenticated Application Routes (`/app/*`)

#### 3.2.1 Application Shell (`AppLayout.jsx`)
- **Desktop Sidebar:**
  - Collapsible mode (260px expanded -> 80px icon-only collapsed with hover tooltips).
  - Navigation grouped into:
    - **MAIN:** Overview (`/app/overview`), Discover (`/app/discover`), Event Calendar (`/app/calendar`).
    - **PERSONAL:** My Registrations (`/app/registrations`), Saved Events (`/app/saved`), Event Gallery (`/app/gallery`).
    - **ACCOUNT:** My Profile (`/app/profile`), Settings (`/app/settings`).
  - Collapse/expand toggle button at bottom with keyboard shortcut hint.
- **Application Topbar:**
  - Sidebar toggle button (Mobile & Desktop).
  - Dynamic breadcrumbs reflecting the current route.
  - Global event search input.
  - Notifications bell with unread badge counter.
  - Quick Theme Switcher (Dark/Light).
  - User avatar dropdown menu (Profile link, Settings link, Logout button).
- **Mobile Drawer:**
  - Full touch-friendly slide-over drawer triggered by the hamburger icon on screens < 1024px.
  - Backdrop overlay with tap-to-dismiss behavior.

#### 3.2.2 Dashboard Overview (`/app/overview`)
- **Welcome Banner:** Personalized greeting with student name, date, and academic department.
- **Stat Cards:** 4 interactive metric cards:
  1. *Active Registrations* (with link to `/app/registrations`)
  2. *Saved Bookmarks* (with link to `/app/saved`)
  3. *Upcoming This Week* (count of events happening within 7 days)
  4. *Attended History* (past events count)
- **Upcoming Registered Schedule:** Next 3 registered events with countdowns and digital ticket access.
- **Recommended For You:** Algorithmic event recommendations based on student's registered categories.
- **Quick Action Bar:** "Browse Events", "Submit Campus Event" (Organizer modal), "View Calendar".

#### 3.2.3 In-App Event Discovery (`/app/discover`)
- In-app mirror of event exploration, retaining sidebar navigation context so students can browse and register without leaving their personal dashboard space.

#### 3.2.4 Event Calendar (`/app/calendar`)
- Monthly interactive grid with previous/next month navigation.
- Days marked with colored badges for campus events.
- Special highlighted indicators on dates where the student has confirmed registrations.
- Clicking on any day reveals a modal or side drawer listing that day's scheduled events.

#### 3.2.5 My Registrations (`/app/registrations`)
- Tabs for "Upcoming Events" and "Past Events".
- Every card displays: Event name, date, venue, ticket reference ID (`GATH-XXXX-XXXX`), and registration status badge (`Confirmed`).
- **Digital Ticket Pass:** Modal popup displaying a formatted event ticket with QR code simulation, student name, and printable voucher format.
- **Cancel Registration Action:** Accessible action with confirmation modal to free up the seat.

#### 3.2.6 Saved Events (`/app/saved`)
- Grid of all bookmarked events.
- Quick "Register Now" button for any saved event.
- One-click "Remove from Saved" action with instant toast confirmation.

#### 3.2.7 Event Gallery (`/app/gallery`)
- High-resolution campus photo gallery celebrating past hackathons, cultural concerts, and sports finals.
- Category filters (Technical, Cultural, Sports, etc.).
- Image click opens an accessible modal lightbox with photo title, date, photographer credit, and keyboard escape handling.

#### 3.2.8 Profile & Settings (`/app/profile` & `/app/settings`)
- **Profile:** Edit personal name, phone number, academic roll number, department, graduation year, and biography. Persisted to `localStorage`.
- **Settings:** Centralized Dark / Light theme selection with visual previews, notification toggle preferences, and a "Reset Demo Data" button to restore initial seed data anytime.

---

## 4. Route Guard & Protection Mechanics

```javascript
// src/layouts/ProtectedRoute.jsx
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="loading-screen">Loading GATHERLY...</div>;
  }

  if (!isAuthenticated) {
    // Preserve intended target for seamless post-login redirect
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
```

---

## 5. Navigation Behavior & User Experience Safeguards

1. **Active Route Indication:** Public navbar items and App sidebar links display high-contrast active state indicators (accent border-bottom or left accent bar + elevated background).
2. **Scroll Restoration:** The application automatically scrolls to the top (`window.scrollTo(0, 0)`) upon route transitions.
3. **Deep Linking Support:** Direct URLs such as `/events/evt-hackathon-2026` or `/categories/technical` load accurately on cold load or browser refresh.
4. **404 Catch-All:** Any unrecognized route renders `NotFoundPage.jsx` with prominent buttons directing users safely back to `/` or `/events`.

