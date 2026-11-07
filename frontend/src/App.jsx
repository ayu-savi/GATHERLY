import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import AppLayout from './layouts/AppLayout';
import ProtectedRoute from './layouts/ProtectedRoute';

// Public Pages
import HomePage from './pages/public/HomePage';
import ExplorePage from './pages/public/ExplorePage';
import EventDetailsPage from './pages/public/EventDetailsPage';
import CategoriesPage from './pages/public/CategoriesPage';
import AboutPage from './pages/public/AboutPage';
import HostEventPage from './pages/public/HostEventPage';
import NotFoundPage from './pages/public/NotFoundPage';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';

// Student Dashboard Pages
import OverviewPage from './pages/app/OverviewPage';
import RegistrationsPage from './pages/app/RegistrationsPage';
import PassesPage from './pages/app/PassesPage';
import PassVerifierPage from './pages/app/PassVerifierPage';
import ProfilePage from './pages/app/ProfilePage';
import MyProposalsPage from './pages/app/MyProposalsPage';
import AdminProposalsPage from './pages/app/AdminProposalsPage';

// Simple Scroll to top helper
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

export const App = () => {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Public Website Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/events" element={<ExplorePage />} />
          <Route path="/events/:id" element={<EventDetailsPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/host-event" element={<HostEventPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        {/* Protected Student Dashboard Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/app" element={<Navigate to="/app/overview" replace />} />
            <Route path="/app/overview" element={<OverviewPage />} />
            <Route path="/app/registrations" element={<RegistrationsPage />} />
            <Route path="/app/passes" element={<PassesPage />} />
            <Route path="/app/passes/:passId" element={<PassesPage />} />
            <Route path="/app/proposals" element={<MyProposalsPage />} />
            <Route path="/app/admin/proposals" element={<AdminProposalsPage />} />
            <Route path="/app/pass-verifier" element={<PassVerifierPage />} />
            <Route path="/app/profile" element={<ProfilePage />} />
            <Route path="/app/settings" element={<ProfilePage />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
};

export default App;
