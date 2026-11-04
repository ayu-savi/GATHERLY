# GATHERLY – Master Project Blueprint

> **Tagline:** Discover. Connect. Celebrate.  
> **Project Title:** Design and Develop a Responsive Campus Event Management Website  
> **Academic Context:** Semester Submission Project  
> **Architecture:** Full-Stack Web Application (React.js + Express.js + MongoDB)  
> **Status:** Phase 1 Foundation & Architecture  

---

## 1. Executive Summary & Vision

**GATHERLY** is a next-generation campus event discovery and management platform engineered specifically for university ecosystems. In modern academic institutions, events—ranging from technical hackathons and competitive coding summits to cultural fests, sports tournaments, gaming LANs, research symposiums, and leadership workshops—are frequently fragmented across physical bulletin boards, disparate social media channels, and unorganized messaging groups.

GATHERLY resolves this fragmentation by serving as an intuitive, unified, and aesthetically captivating digital hub. It empowers students to:
- Discover campus activities matching their personal passions and academic aspirations.
- Explore rich event agendas, venue details, speaker profiles, and live countdowns.
- Register seamlessly with instant client-side validation and backend persistence in MongoDB.
- Bookmark upcoming events and manage all commitments from an interactive, personalized student dashboard.
- Seamlessly transition between public browsing and a dedicated personal application workspace.

---

## 2. Problem Statement & Academic Scope

### 2.1 The Core Problem
University campuses host dozens of events weekly organized by student societies, academic departments, sports councils, and external partners. However, campus event participation suffers from:
1. **Information Asymmetry:** Students discover events after registration has closed or miss critical venue/time updates.
2. **Cumbersome Registration:** Manual paper sign-ups or generic Google Forms lack instant verification, ticket management, or personal schedules.
3. **Absence of Unified Records:** Students have no centralized dashboard to track their registered events, check attendance history, or view event galleries.
4. **Poor Mobile Accessibility:** Event portals often fail on mobile devices, alienating students who browse on smartphones between lectures.

### 2.2 Examiner Problem Statement & Core Objectives
The project is mandated to fulfill the following core examiner requirements:
- **Responsive Architecture:** Flawless cross-device compatibility across Desktop, Laptop, Tablet, and Mobile.
- **Dynamic Homepage:** Engaging Hero section, platform intro, upcoming events, featured highlights, and intuitive navigation.
- **Modular Event Cards:** Uniform representation of event name, date, venue, category badge, visual banner, short description, details view, and direct registration trigger.
- **Exploration & Discovery:** Real-time search by keyword/title, multi-category filtering, sorting, and graceful empty-state handling.
- **Dedicated Event Details:** In-depth presentation with full descriptions, schedules, venue maps/notes, organizer credentials, dynamic countdown timers, and registration access.
- **Robust Registration Pipeline:** Clean multi-field form (Participant Name, Email, Phone, Event Selector) with JavaScript validation, format checks, duplicate prevention, backend API persistence in MongoDB, and confirmed registration ticket view.
- **Technical Excellence:** Standards-compliant HTML5, CSS3, JavaScript (React.js + Vite frontend, Express.js + Node.js backend), MongoDB/Mongoose database, REST API architecture, Git/GitHub version control, comprehensive README, and production deployment readiness.

---

## 3. Brand Identity & Creative Direction

### 3.1 Brand Philosophy
The name **GATHERLY** embodies collaboration, community, and energy. The tagline—***Discover. Connect. Celebrate.***—encapsulates the user journey:
1. **Discover:** Find relevant campus opportunities effortlessly.
2. **Connect:** Network with peers, mentors, organizers, and campus clubs.
3. **Celebrate:** Participate, compete, showcase talents, and commemorate campus memories.

### 3.2 Visual Differentiation (Independence from FESTIQ Reference)
While studying the reference project (FESTIQ) to benchmark expected functional scope, GATHERLY establishes an independent, modern design language:

| Dimension | FESTIQ Reference | GATHERLY Master Design |
| :--- | :--- | :--- |
| **Color Identity** | Forest Green & Gold `#133E33` / `#E5B869` | **Midnight Elegance & Soft Lavender** (Dual Palette) |
| **Dark Theme** | Heavy deep green / saturated yellow | **Midnight Slate `#080D1A` with Electric Violet `#8B5CF6` & Cyan `#22D3EE`** |
| **Light Theme** | Warm off-white / yellowish tones | **Airy Soft Lavender `#F7F7FC` with Royal Purple `#7047EB` & Cyan `#0891B2`** |
| **Navigation** | Basic single-bar with modal popups | **Hybrid Navigation:** Modern public navbar + Full-featured App Dashboard with collapsible sidebar |
| **Event Presentation** | Standard flat cards with minimal hierarchy | **Layered Glassmorphism Cards:** Distinct status pills, capacity gauges, animated hover states |
| **Event Details** | Primitive popup modal | **Dedicated Full-Page Route (`/events/:id`)** + Complementary Quick-View Modal |
| **Dashboard** | Generic single list | **Personalized Student Command Center:** Stats, registration tickets, saved bookmarks, upcoming schedule |
| **Typography** | Generic Sans/Serif mix | **Geometric Precision:** Plus Jakarta Sans & Inter with strict typographical scale |

---

## 4. Design Direction & Dual-Theme Experience

GATHERLY treats both Dark Mode and Light Mode as first-class citizens. The interface utilizes a semantic CSS Variable token system enabling zero-flicker transitions and strict WCAG AA contrast compliance.

### 4.1 Dark Theme – "Midnight Elegance"
Crafted for evening browsing, student dorm rooms, and tech enthusiasts:
- **Base Background:** `#080D1A` (Deep cosmic navy)
- **Secondary Surface:** `#111A2E` (Structured paneling)
- **Elevated Surfaces:** `#1C2940` (Modals, cards, dropdowns)
- **Primary Brand Violet:** `#8B5CF6` (High-energy purple for primary CTA & focal points)
- **Accent Cyan:** `#22D3EE` (Vibrant cyan for status badges, live countdowns, icons)
- **Highlight Pink:** `#F472B6` (Subtle gradients and energetic celebration badges)
- **Primary Text:** `#F8FAFC` (Crisp snow white)
- **Secondary Text:** `#A1AEC4` (Muted slate for metadata)
- **Border Gradients:** `#26344B` (Subtle boundary definition)

### 4.2 Light Theme – "Soft Lavender"
Crafted for daylight readability, academic presentations, and vibrant aesthetics:
- **Base Background:** `#F7F7FC` (Clean porcelain with soft violet undertones)
- **Primary Surface:** `#FFFFFF` (Pure white card surfaces)
- **Elevated Surfaces:** `#EEEAFE` (Subtle lavender highlights for hovered rows)
- **Primary Purple:** `#7047EB` (Authoritative royal purple for primary buttons)
- **Accent Cyan:** `#0891B2` (Deep cyan for badges and secondary highlights)
- **Highlight Pink:** `#EC4899` (Vivid magenta accents for tags)
- **Primary Text:** `#17172B` (Deep midnight ink)
- **Secondary Text:** `#66677D` (Balanced charcoal grey)
- **Borders:** `#E7E5F0` (Delicate perimeter borders)

---

## 5. System Requirements Overview

### 5.1 Mandatory Examiner Requirements Matrix
1. **Hero Section:** High-impact typography, quick search/call-to-action, dynamic floating stats, modern campus aesthetic.
2. **Upcoming & Featured Events:** Curated event tiers with dynamic badge indicators.
3. **Category System:** 8 dedicated categories with tailored icons and instant filtering.
4. **Interactive Event Cards:** Banner imagery, dates, venues, tags, short briefs, and dual action points (View & Register).
5. **Search & Exploration Engine:** Live debounced text search, category tabs, sorting by date/popularity, and zero-match fallback screens.
6. **Detailed Event Profile:** Dedicated URL, high-resolution imagery, full agenda, venue details, organizer contacts, live countdown timer, and bookmarking.
7. **Form Validation & Registration:** Client-side JavaScript checking required inputs, regex-validated email format, 10-digit phone format, duplicate prevention, backend MongoDB persistence via REST API, and confirmed registration ticket view.
8. **Responsive Cross-Platform Layout:** Grid & Flexbox system adapting seamlessly across 320px to 4K resolutions.
9. **Full-Stack Technical Delivery:** React.js + Vite frontend, Express.js backend, MongoDB database with Mongoose, JWT authentication, REST API, Git/GitHub version control, comprehensive README, and production deployment readiness.

### 5.2 Beyond-the-Spec Value Additions
To exceed academic evaluation standards, GATHERLY integrates:
- **Interactive Event Calendar:** Visual month/day grid showing registered and open campus activities.
- **Event Bookmarking / Saved Events:** One-click save to build a personal wishlist.
- **Live Countdown Timers:** Real-time day/hour/minute/second countdown on event detail screens.
- **Toast Notification Engine:** Animated popups for registration success, bookmarking, and validation alerts.
- **Capacity & Registration Indicators:** Live capacity bars showing seats remaining.
- **Campus Gallery with Lightbox:** Visual archive of past campus fests with category filtering and modal image previews.
- **Student Dashboard Overview:** Metrics on active registrations, saved events, and category breakdown.
- **Organizer Event Submission:** Interface allowing student society leaders to draft new campus events persisted to MongoDB.

---

## 6. Architecture & Implementation Principles

1. **Full-Stack Integration:** Frontend and backend are developed cohesively in vertical slices across all phases.
2. **Component Reusability:** Every UI element (Button, Badge, Card, Modal, Input, Toast) is built as a standalone, modular component.
3. **Database-Backed Persistence:** MongoDB stores users, events, registrations, and categories; client-side LocalStorage is used for theme preferences and JWT caching.
4. **Clear Separation of Public vs. App Layouts:** Public pages provide frictionless browsing; authenticated pages provide an immersive application environment with a collapsible sidebar and dashboard topbar.
5. **Testing Strategy:** Prioritize rapid, robust feature implementation in Phases 1–9, followed by formal end-to-end testing, bug fixing, and verification in Phase 10 before deployment.
