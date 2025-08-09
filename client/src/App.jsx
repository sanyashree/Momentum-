// App-level routes styled with Tailwind: Home (demo), Login, Signup, and a protected Dashboard.
import { BrowserRouter, Routes, Route, Link, NavLink } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Protected from "./components/Protected.jsx";

function Navbar() {
  const base =
    "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variants = {
    primary:
      "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500",
    ghost:
      "text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:ring-gray-300",
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/70 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-indigo-600" />
          <span className="text-lg font-semibold tracking-tight">Momentum</span>
        </Link>
        <nav className="flex items-center gap-2">
          <NavLink
            to="/login"
            className={({ isActive }) =>
              `${base} ${isActive ? variants.primary : variants.ghost}`
            }
          >
            Login
          </NavLink>
          <NavLink
            to="/signup"
            className={({ isActive }) =>
              `${base} ${isActive ? variants.primary : variants.ghost}`
            }
          >
            Sign up
          </NavLink>
        </nav>
      </div>
    </header>
  );
}

function Home() {
  return (
    <main className="mx-auto max-w-6xl px-4">
      <section className="relative isolate overflow-hidden rounded-3xl border bg-white shadow-sm">
        <div className="flex flex-col p-10 md:p-16 items-center justify-center">
          <div className="flex flex-col justify-center">
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
              Welcome to <span className="text-indigo-600">Momentum</span>
            </h1>
            <p className="mt-3 text-sm leading-6 text-gray-600 md:text-base">
              Routing is wired up. Login & Signup use shadcn UI with mock auth.
              Protect your routes, then plug in real backend when ready.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                to="/signup"
                className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Get started
              </Link>
              <Link
                to="/login"
                className="rounded-xl border px-5 py-2.5 text-sm font-medium text-gray-800 hover:bg-gray-50"
              >
                I already have an account
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function NotFound() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col items-center px-4 py-24 text-center">
      <p className="text-sm font-semibold tracking-wide text-indigo-600">404</p>
      <h2 className="mt-2 text-2xl font-bold tracking-tight md:text-3xl">
        Page not found
      </h2>
      <p className="mt-2 max-w-prose text-sm text-gray-600 md:text-base">
        The page you’re looking for doesn’t exist or has been moved.
      </p>
      <div className="mt-6">
        <Link
          to="/"
          className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 text-gray-900">
      <BrowserRouter>
        <Navbar />
        <Routes>
          {/* Public pages */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected page: only visible when "logged in" (mock) */}
          <Route
            path="/dashboard"
            element={
              <Protected>
                <Dashboard />
              </Protected>
            }
          />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>

        <footer className="mt-16 border-t bg-white/60">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-8 text-xs text-gray-500 md:flex-row">
            <p>© {new Date().getFullYear()} Momentum</p>
            <div className="flex items-center gap-4">
              <a className="hover:text-gray-700" href="#">Privacy</a>
              <a className="hover:text-gray-700" href="#">Terms</a>
              <a className="hover:text-gray-700" href="#">Contact</a>
            </div>
          </div>
        </footer>
      </BrowserRouter>
    </div>
  );
}
