# GATHERLY
### Discover. Connect. Celebrate.

**Project Title:** Design and Develop a Responsive Campus Event Management Website  
**Academic Milestone:** Semester Submission Project  
**Architecture:** Full-Stack Web Application (React.js + Express.js + MongoDB)  

---

## 1. Project Overview

**GATHERLY** is a modern, responsive campus event discovery and management platform engineered for university ecosystems. It addresses the fragmentation of campus activities across noticeboards and social media groups by providing a single, unified digital hub where students can:
- Explore campus events categorized into Technical, Cultural, Sports, Gaming, Workshops, Management, Entrepreneurship, and Arts.
- Search and filter activities in real time.
- View detailed event profiles with live countdown timers and agendas.
- Register for events with instant JavaScript client validation and MongoDB backend persistence.
- Manage personal registrations, bookmarked events, and digital ticket passes from a personalized student dashboard.
- Experience an independent dual-theme design system (**Midnight Elegance** & **Soft Lavender**).

---

## 2. Technology Stack

- **Frontend:** React 18, Vite, React Router DOM v6, Axios, Lucide React, CSS3 with Custom Properties (Design Tokens).
- **Backend:** Node.js, Express.js REST API, CORS, Dotenv, Morgan.
- **Database:** MongoDB with Mongoose ODM.
- **Authentication:** JWT (JSON Web Tokens), bcryptjs password hashing.
- **Deployment Ready:** Vercel (Frontend) + Render / Cloud (Backend).

---

## 3. Directory Layout

```text
GATHERLY/
├── docs/                     # Architectural blueprints and roadmap
├── frontend/                 # React.js + Vite client
├── backend/                  # Node.js + Express.js REST API
├── .env.example              # Environment variables template
├── package.json              # Monorepo orchestration scripts
└── README.md                 # Project documentation
```

---

## 4. Getting Started

### 4.1 Prerequisites
- Node.js (v18.0.0 or higher recommended; verified on v24.19.0)
- npm (v9.0.0 or higher; verified on v11.17.0)
- MongoDB Atlas connection string (or local MongoDB server)

### 4.2 Installation
Install root, backend, and frontend dependencies:
```bash
# In project root:
npm run install:all
```
Or individually:
```bash
cd backend && npm install
cd ../frontend && npm install
```

### 4.3 Environment Configuration
1. Copy `.env.example` in `backend/` to `backend/.env`:
   ```bash
   cp backend/.env.example backend/.env
   ```
2. Configure your MongoDB connection string in `backend/.env`:
   ```env
   PORT=5000
   CLIENT_URL=http://localhost:5173
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/gatherly?retryWrites=true&w=majority
   JWT_SECRET=your_jwt_secret_key
   ```
3. Optional: Copy `frontend/.env.example` to `frontend/.env`:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

### 4.4 Running in Development Mode
Start both services in separate terminals:

**Backend Server (Runs on port 5000):**
```bash
npm run dev:backend
# or: cd backend && npm run dev
```

**Frontend Client (Runs on port 5173):**
```bash
npm run dev:frontend
# or: cd frontend && npm run dev
```

---

## 5. Development Phases

- **Phase 0:** Master Project Blueprint, Architecture & Roadmap *(Complete)*
- **Phase 1:** Full-Stack Foundation, Project Architecture & Core Design System *(Current)*
- **Phase 2:** Public Landing Page (Hero, Featured Events, Stats, Highlights)
- **Phase 3:** Application Layout (Collapsible Sidebar, Topbar, Mobile Drawer)
- **Phase 4:** Event Discovery & Exploration (Search, 8 Categories, Sorting)
- **Phase 5:** Dedicated Event Profile & Live Countdown Timers
- **Phase 6:** Full-Stack Authentication & Protected Route Guards
- **Phase 7:** Event Registration Pipeline, Client Validation & Confirmation Passes
- **Phase 8:** Student Command Center (Overview, Calendar, Gallery, Passes)
- **Phase 9:** UI/UX Polish, Micro-interactions, Toast Alerts & Accessibility
- **Phase 10:** Final Submission, Build Verification, README & Deployment

