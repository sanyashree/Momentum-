// Route guard: if there is no user in auth state, redirect to /login.
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.jsx";

export default function Protected({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}