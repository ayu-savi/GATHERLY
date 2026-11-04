# GATHERLY – System Architecture & Technical Specifications

> **Project:** GATHERLY (Discover. Connect. Celebrate.)  
> **Document:** Full-Stack System Architecture Specification  
> **Frontend:** React.js 18+ with Vite, Axios, React Router DOM v6  
> **Backend:** Node.js, Express.js REST API  
> **Database:** MongoDB with Mongoose ODM  
> **Authentication:** JSON Web Tokens (JWT) + bcryptjs password hashing  
> **State Management:** React Context API + Custom Hooks + Axios Service Layer  

---

## 1. High-Level Application Architecture

GATHERLY is engineered as a modern, decoupled full-stack web application. The frontend communicates with the backend exclusively via RESTful JSON APIs.

```
+-----------------------------------------------------------------------------------------+
|                                    BROWSER CLIENT                                       |
+-----------------------------------------------------------------------------------------+
                                             |
                                    [ React Router DOM ]
                                             |
                   +-------------------------+-------------------------+
                   |                                                   |
                   v                                                   v
         [ PublicLayout.jsx ]                                  [ AppLayout.jsx ]
     +--------------------------+                         +--------------------------+
     | - Public Navbar          |                         | - Application Topbar     |
     |   (Brand, Links, Theme,  |                         |   (Breadcrumbs, Search,  |
     |    Login/Sign Up)        |                         |    Theme, Notifications, |
     | - Page Content Outlet    |                         |    User Avatar Menu)     |
     | - Public Footer          |                         | - Collapsible Sidebar    |
     +--------------------------+                         |   (Expand/Collapse state,|
                   |                                      |    Mobile Slide-out)     |
                   |                                      | - Authenticated Outlet   |
                   |                                      +--------------------------+
                   |                                                   |
                   +-------------------------+-------------------------+
                                             |
                                  [ Shared State Layer ]
          +----------------------------------+----------------------------------+
          |                                  |                                  |
   [ ThemeContext ]                   [ AuthContext ]                    [ EventContext ]
   (Dark/Light Tokens)              (JWT & User Session)             (Events, Registrations,
          |                                  |                        Bookmarks, Filters)
          +----------------------------------+----------------------------------+
                                             |
                                  [ Axios API Services ]
                         (api.js, authService.js, eventService.js)
                                             |
                                  HTTP / JSON (CORS Enabled)
                                             |
+-----------------------------------------------------------------------------------------+
|                                   EXPRESS.JS BACKEND                                    |
+-----------------------------------------------------------------------------------------+
                                             |
                                    [ Express App Router ]
                     +-----------------------+-----------------------+
                     |                       |                       |
                     v                       v                       v
             /api/auth/*                 /api/events/*          /api/registrations/*
       (Register, Login, Me)         (CRUD, Filter, Search)   (Create, Cancel, List)
                     |                       |                       |
                     +-----------------------+-----------------------+
                                             |
                                 [ Mongoose Data Models ]
                                (User, Event, Registration)
                                             |
+-----------------------------------------------------------------------------------------+
|                                    MONGODB DATABASE                                     |
+-----------------------------------------------------------------------------------------+
```

---

## 2. Directory & Folder Structure

```text
GATHERLY/
├── docs/                            # Project documentation
│   ├── PROJECT_BLUEPRINT.md
│   ├── ARCHITECTURE.md
│   ├── ROUTE_MAP.md
│   ├── DEVELOPMENT_ROADMAP.md
│   ├── REQUIREMENTS_CHECKLIST.md
│   ├── DESIGN_SYSTEM.md
│   └── PHASE_0_BLUEPRINT_REPORT.md
│
├── frontend/                        # React.js + Vite client application
│   ├── public/
│   │   └── favicon.svg
│   ├── src/
│   │   ├── assets/                  # Static images, icons
│   │   ├── components/              # Modular UI components
│   │   │   ├── common/              # Button, Badge, Input, Card, Modal, ThemeToggle
│   │   │   ├── navigation/          # PublicNavbar, PublicFooter, AppTopbar, AppSidebar, MobileDrawer
│   │   │   ├── events/              # EventCard, EventGrid, EventFilter, EventQuickView, CapacityBar
│   │   │   ├── forms/               # RegistrationForm, LoginForm, SignupForm, CreateEventModal
│   │   │   ├── dashboard/           # StatCard, RegistrationTicket, UpcomingSchedule
│   │   │   └── feedback/            # ToastContainer, EmptyState, LoadingSpinner
│   │   ├── context/                 # ThemeContext, AuthContext, EventContext, ToastContext
│   │   ├── hooks/                   # useTheme, useAuth, useEvents, useToast, useDebounce
│   │   ├── layouts/                 # PublicLayout, AppLayout, ProtectedRoute
│   │   ├── pages/                   # Public, Auth, and App pages
│   │   ├── services/                # api.js, authService.js, eventService.js
│   │   ├── styles/                  # variables.css, themes.css, global.css, responsive.css
│   │   ├── utils/                   # validators.js, formatters.js, storage.js, constants.js
│   │   ├── App.jsx                  # Main router setup
│   │   └── main.jsx                 # Provider mounting
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── backend/                         # Node.js + Express REST API server
│   ├── config/                      # db.js (Mongoose connection)
│   ├── controllers/                 # authController, eventController, registrationController
│   ├── middleware/                  # authMiddleware (JWT), errorHandler, validateRequest
│   ├── models/                      # User.js, Event.js, Registration.js
│   ├── routes/                      # api.js, authRoutes, eventRoutes, registrationRoutes, healthRoutes
│   ├── services/                    # Business logic helpers
│   ├── utils/                       # apiResponse.js, seedData.js
│   ├── app.js                       # Express application configuration
│   ├── server.js                    # Server bootstrap and port listener
│   ├── .env.example
│   └── package.json
│
├── .gitignore
├── .env.example
├── package.json                     # Root orchestrator scripts
└── README.md
```

---

## 3. Backend Architecture & REST API Design

### 3.1 Server Infrastructure
- **Framework:** Express.js running on Node.js.
- **Middleware Pipeline:**
  - `cors`: Handles cross-origin requests from the React frontend with configurable origins.
  - `express.json()`: Parses incoming JSON request payloads.
  - `morgan`: HTTP request logger for local development.
  - `errorHandler`: Global catch-all middleware ensuring uniform JSON error responses:
    ```json
    {
      "success": false,
      "message": "Descriptive error message",
      "error": "Error details (in development mode)"
    }
    ```
- **Standardized API Response Helper (`apiResponse.js`):**
  - `sendSuccess(res, message, data, statusCode = 200)`
  - `sendError(res, message, statusCode = 400, errors = null)`

### 3.2 Health Check Endpoint
- **Route:** `GET /api/health`
- **Response Format:**
  ```json
  {
    "success": true,
    "status": "OK",
    "message": "GATHERLY API server is operating normally.",
    "timestamp": "2026-11-04T12:00:00.000Z",
    "database": {
      "status": "connected | disconnected | unconfigured",
      "host": "cluster0.mongodb.net"
    },
    "version": "1.0.0"
  }
  ```

### 3.3 Database Strategy & Graceful Degradation
- **Connection Module (`config/db.js`):** Connects to MongoDB via Mongoose using `process.env.MONGO_URI`.
- **Defensive Error Handling:** If `MONGO_URI` is missing or the connection fails, the server logs a clear, actionable diagnostic message, sets the health status to `disconnected`, and continues running so health checks and frontend static requests do not crash. Real database errors are never hidden or faked.

---

## 4. Frontend Architecture & API Integration

### 4.1 Axios Centralized Client (`services/api.js`)
- Configured with `baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api'`.
- Request Interceptor: Automatically attaches `Authorization: Bearer <token>` from AuthContext or LocalStorage.
- Response Interceptor: Catches 401 Unauthorized responses to trigger automatic logout/session cleanup.

### 4.2 State Management & Global Providers
1. **`ThemeContext`:** Manages `'dark'` vs `'light'` mode, applies `data-theme` attribute to document root, detects OS preference, and persists to `localStorage`.
2. **`AuthContext`:** Manages active user profile, JWT token, login, signup, and logout actions via `authService`.
3. **`EventContext`:** Manages event catalog, active filters, search queries, registrations, and bookmarks via `eventService`.
4. **`ToastContext`:** Displays animated, auto-dismissing feedback messages for user interactions.

---

## 5. Security & Authentication Architecture

- **Password Security:** Passwords hashed with `bcryptjs` (salt rounds: 10) before MongoDB persistence.
- **Token Mechanism:** Stateless JSON Web Tokens (JWT) signed with `process.env.JWT_SECRET`, expiring in 7 days.
- **Route Protection:**
  - Backend: `authMiddleware.js` extracts Bearer token, verifies signature, and attaches `req.user`.
  - Frontend: `ProtectedRoute.jsx` checks `isAuthenticated` state; redirects unauthenticated visitors to `/login` while preserving location state.

---

## 6. Development & Testing Methodology

- **Vertical Slice Development:** Across Phases 1 through 9, frontend components and corresponding backend routes/models are implemented cohesively.
- **Phased Testing Plan:** Development velocity is prioritized during Phases 1–9 with structural verification. Comprehensive end-to-end integration testing, edge-case coverage, and final verification are performed systematically in **Phase 10** prior to deployment.
