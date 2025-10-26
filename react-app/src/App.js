import React, { useState } from "react";
import LoginPage from "./pages/LoginPage";
import UploadPage from "./pages/UploadPage";
import AdminDashboard from "./pages/AdminDashboard";
import SuperAdminSwitcher from "./components/SuperAdminSwitcher";

export default function App() {
  const [user, setUser] = useState(null);
  const [mode, setMode] = useState("user"); // for superadmin toggle

  if (!user) return <LoginPage onLogin={setUser} />;

  const renderPage = () => {
    if (user.role === "admin") return <AdminDashboard />;
    if (user.role === "superadmin") {
      return mode === "admin" ? <AdminDashboard /> : <UploadPage />;
    }
    return <UploadPage />;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {user.role === "superadmin" && (
        <SuperAdminSwitcher mode={mode} setMode={setMode} />
      )}
      <div className="max-w-3xl mx-auto py-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-slate-800">
            Document Portal
          </h1>
          <button
            onClick={() => setUser(null)}
            className="text-sm text-slate-600 underline"
          >
            Logout
          </button>
        </div>
        {renderPage()}
      </div>
    </div>
  );
}
