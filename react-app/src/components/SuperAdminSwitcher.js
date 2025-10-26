import React from "react";

export default function SuperAdminSwitcher({ mode, setMode }) {
  return (
    <div className="fixed top-4 right-4 bg-white shadow-lg border rounded-lg p-2 flex items-center gap-2">
      <span className="text-slate-700 font-medium">Mode:</span>
      <select
        value={mode}
        onChange={(e) => setMode(e.target.value)}
        className="border border-slate-300 px-2 py-1 rounded text-slate-700"
      >
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>
    </div>
  );
}
