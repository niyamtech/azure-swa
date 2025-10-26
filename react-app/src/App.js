import React, { useState } from "react";
import useSession from "./hooks/useSession"; // ✅ make sure this file exists
import LoginPage from "./pages/LoginPage";
import UploadPage from "./pages/UploadPage";
import AdminDashboard from "./pages/AdminDashboard";
import SuperAdminSwitcher from "./components/SuperAdminSwitcher";

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
    <div className="min-h-screen bg-slate-50 font-[Inter]">
      {/* switcher visible only for superadmin */}
      {user.role === "superadmin" && (
        <SuperAdminSwitcher mode={mode} setMode={setMode} />
      )}

      <div className="max-w-4xl mx-auto py-10 px-4">
        {/* header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-slate-800">
            Document Portal
          </h1>
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-600">👤 {user.username}</span>
            <button
              onClick={handleLogout}
              className="text-sm text-[#E15C31] font-medium hover:underline"
            >
              Logout
            </button>
          </div>
        </div>

        {/* main content */}
        {renderPage()}
      </div>
    </div>
  );
}
