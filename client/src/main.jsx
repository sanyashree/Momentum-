// React entry point: mounts App, global styles, and the toast provider.
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

// Shadcn toast system (Sonner) — one-time mount at root.
import { Toaster } from "./components/ui/sonner";
// Simple auth store using React Context so all pages can read user state.
import { AuthProvider } from "./hooks/useAuth.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* Provide auth state (user, login, logout) to the whole app */}
    <AuthProvider>
      <App />
      {/* Toasts appear here (success/error notifications) */}
      <Toaster richColors />
    </AuthProvider>
  </React.StrictMode>
);