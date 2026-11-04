import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import AppLayout from './layouts/AppLayout';
import ProtectedRoute from './layouts/ProtectedRoute';

// Public Pages
import HomePage from './pages/public/HomePage';
import ExplorePage from './pages/public/ExplorePage';
import CategoriesPage from './pages/public/CategoriesPage';
import AboutPage from './pages/public/AboutPage';
import NotFoundPage from './pages/public/NotFoundPage';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';

// App Pages
import OverviewPage from './pages/app/OverviewPage';

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
          <Route path="/events/:id" element={<ExplorePage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        {/* Protected Application Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/app" element={<Navigate to="/app/overview" replace />} />
            <Route path="/app/overview" element={<OverviewPage />} />
            <Route path="/app/discover" element={<ExplorePage />} />
            <Route path="/app/calendar" element={<OverviewPage />} />
            <Route path="/app/registrations" element={<OverviewPage />} />
            <Route path="/app/saved" element={<OverviewPage />} />
            <Route path="/app/gallery" element={<OverviewPage />} />
            <Route path="/app/profile" element={<OverviewPage />} />
            <Route path="/app/settings" element={<OverviewPage />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
};

export default App;

