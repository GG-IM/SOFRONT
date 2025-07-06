import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Header from './components/Header';
import LoginForm from './components/LoginForm';
import ReceptionistDashboard from './components/ReceptionistDashboard';
import DoctorDashboard from './components/DoctorDashboard';
import NotificationBanner from './components/NotificationBanner';
import { Routes, Route, Navigate } from 'react-router-dom';

const ProtectedRoute: React.FC<{ children: React.ReactNode, role?: string }> = ({ children, role }) => {
  const { isAuthenticated, currentUser } = useApp();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (role && currentUser?.role !== role) return <Navigate to="/" replace />;
  return <>{children}</>;
};

// Componente para redirigir según el rol
const RoleRedirect: React.FC = () => {
  const { currentUser } = useApp();
  if (currentUser?.role === 'receptionist') return <Navigate to="/receptionist" replace />;
  if (currentUser?.role === 'doctor') return <Navigate to="/doctor" replace />;
  return <Navigate to="/login" replace />;
};

function App() {
  return (
    <AppProvider>
      <Header />
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route
          path="/receptionist"
          element={
            <ProtectedRoute role="receptionist">
              <ReceptionistDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor"
          element={
            <ProtectedRoute role="doctor">
              <DoctorDashboard />
            </ProtectedRoute>
          }
        />
        {/* Ruta por defecto: redirige según el rol */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <RoleRedirect />
            </ProtectedRoute>
          }
        />
      </Routes>
      <NotificationBanner />
    </AppProvider>
  );
}

export default App;