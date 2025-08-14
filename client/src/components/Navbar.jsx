// Left: your logo. Right: Conditional auth buttons based on login state.

import { Button } from "../components/ui/button";
import { useAuth } from "../hooks/useAuth.jsx";
import { Link } from "react-router-dom";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="w-full border-b bg-background">
      <div className="mx-auto max-w-6xl px-4 h-20 flex items-center justify-between">
        {/* Logo (custom size per your request) */}
        <div className="flex items-center gap-2">
          <img
            src="/logo.jpeg"
            alt="Logo"
            className="w-30 h-20 rounded-md object-cover"
          />
        </div>

        {/* Conditional auth buttons */}
        {user ? (
          // User is logged in - show logout button
          <Button size="sm" variant="outline" onClick={logout}>
            Logout
          </Button>
        ) : (
          // User is not logged in - show login and signup buttons
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button size="sm" variant="outline">
                Login
              </Button>
            </Link>
            <Link to="/signup">
              <Button size="sm" variant="default">
                Sign Up
              </Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}