import React, { useState } from "react";
import useSession from "./hooks/useSession";
import LoginPage from "./pages/LoginPage";
import UploadPage from "./pages/UploadPage";
import AdminDashboard from "./pages/AdminDashboard";
import SuperAdminSwitcher from "./components/SuperAdminSwitcher";
import logo from "./logo.svg";

export default function App() {
  const [user, setUser] = useSession("taxvault_user", null);
  const [mode, setMode] = useState("user");

  if (!user) return <LoginPage onLogin={setUser} />;

  const renderPage = () => {
    if (user.role === "admin") return <AdminDashboard />;
    if (user.role === "superadmin") {
      return mode === "admin" ? <AdminDashboard /> : <UploadPage user={user} />;
    }
    return <UploadPage user={user} />;
  };

  const handleLogout = () => setUser(null);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Aussie Tax Mate" className="h-10 w-10" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Aussie Tax Mate</p>
              <h1 className="text-xl font-semibold text-slate-900">Compliance workspace</h1>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-700">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-white">
              {user.username.charAt(0).toUpperCase()}
            </span>
            <div className="leading-tight">
              <p className="font-semibold text-slate-900">{user.username}</p>
              <p className="text-xs uppercase tracking-wide text-slate-500">{user.role}</p>
            </div>
            <button
              onClick={handleLogout}
              className="rounded-full border border-slate-300 px-4 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-100"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl space-y-6 px-4 py-8">
        {user.role === "superadmin" && (
          <div className="flex justify-end">
            <SuperAdminSwitcher mode={mode} setMode={setMode} />
          </div>
        )}
        {renderPage()}
      </main>
    </div>
  );
}
