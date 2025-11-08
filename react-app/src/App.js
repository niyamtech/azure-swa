import React, { useState } from "react";
import useSession from "./hooks/useSession"; // ✅ make sure this file exists
import LoginPage from "./pages/LoginPage";
import UploadPage from "./pages/UploadPage";
import AdminDashboard from "./pages/AdminDashboard";
import SuperAdminSwitcher from "./components/SuperAdminSwitcher";
import logo from "./logo.svg";

export default function App() {
  // ✅ persist user across refreshes
  const [user, setUser] = useSession("taxvault_user", null);
  const [mode, setMode] = useState("user");

  // if not logged in → show login
  if (!user) return <LoginPage onLogin={setUser} />;

  // ✅ page routing based on role
  const renderPage = () => {
    if (user.role === "admin") return <AdminDashboard />;
    if (user.role === "superadmin") {
      return mode === "admin" ? <AdminDashboard /> : <UploadPage user={user} />;
    }
    return <UploadPage user={user} />;
  };

  // ✅ logout clears session
  const handleLogout = () => setUser(null);

  return (
    <div className="min-h-screen bg-[var(--color-neutral-50)] font-[var(--font-body)]">
      {/* switcher visible only for superadmin */}
      {user.role === "superadmin" && (
        <SuperAdminSwitcher mode={mode} setMode={setMode} />
      )}

      <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-10">
        <header className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white px-6 py-6 shadow-soft-xl sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <img src={logo} alt="Aussie Tax Mate" className="h-12 w-12" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-primary">
                Aussie Tax Mate
              </p>
              <h1 className="text-2xl font-semibold text-slate-900">
                Compliance Vault
              </h1>
              <p className="text-sm text-slate-500">
                Upload client evidence, review security signals, and stay ATO ready.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-full border border-brand-primary/30 bg-brand-primary/5 px-4 py-2 text-sm text-slate-600">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand-primary text-white">
              {user.username.charAt(0).toUpperCase()}
            </span>
            <div className="leading-tight">
              <p className="font-semibold text-slate-900">{user.username}</p>
              <p className="text-xs uppercase tracking-wider text-slate-500">{user.role}</p>
            </div>
            <button
              onClick={handleLogout}
              className="ml-3 rounded-full border border-brand-primary/20 px-4 py-2 text-xs font-medium text-brand-primary transition hover:bg-brand-primary hover:text-white"
            >
              Logout
            </button>
          </div>
        </header>

        {/* main content */}
        {renderPage()}
      </div>
    </div>
  );
}
