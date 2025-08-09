// Left: your logo. Right: Logout button.
// Ensure public/logo.jpeg exists.

import { Button } from "../components/ui/button";
import { useAuth } from "../hooks/useAuth.jsx";

export default function Navbar() {
  const { logout } = useAuth();

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

        <Button size="sm" variant="outline" onClick={logout}>
          Logout
        </Button>
      </div>
    </nav>
  );
}