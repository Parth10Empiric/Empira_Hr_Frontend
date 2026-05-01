import React from 'react'
import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom'

import LoginPage from './pages/LoginPage.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Welcome from './pages/Welcome'
import MyProfile from './pages/MyProfile.jsx'
import Me from './pages/Me.jsx'
import OrganizationRoutes from './pages/organization/OrganizationRoutes'
import AppLayout from './layouts/AppLayout.jsx'
import { isAuthenticated } from './services/storage'

function isAuthed() {
  return isAuthenticated()
}

function RequireAuth({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  if (!isAuthed()) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }
  return <>{children}</>
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route
        element={
          <RequireAuth>
            <AppLayout />
          </RequireAuth>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="welcome" element={<Welcome />} />
        <Route path="me" element={<Me />} />
        <Route path="profile" element={<MyProfile />} />
        <Route path="org/*" element={<OrganizationRoutes />} />
        <Route path="*" element={<Outlet />} />
      </Route>
    </Routes>
  )
}
