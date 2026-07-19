import { Navigate } from 'react-router-dom';
import { isTokenValid } from '@/lib/auth';

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');

  if (!token || !isTokenValid(token)) {
    if (token) localStorage.removeItem('token');
    return <Navigate to="/login" replace />;
  }

  return children;
}