import React, { useState } from "react";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import AdminView from "./pages/AdminView";
import SuperAdminSwitcher from "./components/SuperAdminSwitcher";

export default function App() {
  const [user, setUser] = useState(null);
  const [mode, setMode] = useState("user");

  if (!user) return <LoginPage onLogin={setUser} />;

  const renderView = () => {
    if (user.role === "admin") return <AdminView />;
    if (user.role === "superadmin") {
      return mode === "admin" ? <AdminView /> : <Dashboard />;
    }
    return <Dashboard />;
  };

  return (
    <div className="flex h-screen bg-slate-50">
      {user.role === "superadmin" && (
        <SuperAdminSwitcher mode={mode} setMode={setMode} />
      )}
      <div className="flex-1 overflow-y-auto">{renderView()}</div>
    </div>
  );
}
