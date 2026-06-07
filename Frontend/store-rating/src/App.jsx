import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';

import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import OwnerDashboard from './pages/OwnerDashboard';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// We changed this line to export default directly inline:
export default function App() {
  const { user } = useContext(AuthContext);

  return (
    <Router>
      <div className="min-h-screen bg-slate-50 text-slate-800 antialiased">
        <Routes>
          {/* Public Auth Subsystem */}
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" replace />} />
          <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/dashboard" replace />} />

          {/* Central Routing Switchboard based on Verified Role Claims */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              {user?.role === 'ADMIN' && <AdminDashboard />}
              {user?.role === 'NORMAL_USER' && <UserDashboard />}
              {user?.role === 'STORE_OWNER' && <OwnerDashboard />}
            </ProtectedRoute>
          } />

          {/* Catch-all Fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}