import React from "react";

export default function SuperAdminSwitcher({ mode, setMode }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm">
      <span className="font-medium">View as</span>
      <select
        value={mode}
        onChange={(event) => setMode(event.target.value)}
        className="rounded border border-slate-300 px-2 py-1 text-sm text-slate-700 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/15"
      >
        <option value="user">Client</option>
        <option value="admin">Admin</option>
      </select>
    </div>
  );
}
