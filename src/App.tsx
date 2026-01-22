import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate 
} from 'react-router-dom';
import { DataProvider } from './contexts/DataContext';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Layout } from './components/layout/Layout';
// Pages
import { Dashboard } from './pages/Dashboard';
import { Planner } from './pages/Planner';
import { TimeTracking } from './pages/TimeTracking';
import { Timesheets } from './pages/Timesheets'; // NEW
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ChangePassword } from './pages/ChangePassword';
import { AdminDashboard } from './pages/AdminDashboard';
import { UserManagement } from './pages/UserManagement';
import { TeamManagement } from './pages/TeamManagement';

export function App() {
  return (
    <DataProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="/change-password" element={
              <ProtectedRoute>
                <ChangePassword />
              </ProtectedRoute>
            }/>

            {/* Employee/HR Common Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Layout><Dashboard /></Layout>
              </ProtectedRoute>
            }/>

            <Route path="/planner" element={
              <ProtectedRoute>
                <Layout><Planner /></Layout>
              </ProtectedRoute>
            }/>

            <Route path="/time-tracking" element={
              <ProtectedRoute>
                <Layout><TimeTracking /></Layout>
              </ProtectedRoute>
            }/>

            {/* HR Routes */}
            <Route path="/timesheets" element={
              <ProtectedRoute requiredRole="hr">
                <Layout><Timesheets /></Layout>
              </ProtectedRoute>
            }/>

            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={
              <ProtectedRoute requiredRole="admin">
                <Layout><AdminDashboard /></Layout>
              </ProtectedRoute>
            }/>

            <Route path="/admin/users" element={
              <ProtectedRoute requiredRole="admin">
                <Layout><UserManagement /></Layout>
              </ProtectedRoute>
            }/>

            <Route path="/admin/teams" element={
              <ProtectedRoute requiredRole="admin">
                <Layout><TeamManagement /></Layout>
              </ProtectedRoute>
            }/>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </DataProvider>
  );
}
