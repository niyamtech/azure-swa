import React, { useState } from "react";
import { Lock, UserCircle2 } from "lucide-react";

const users = {
  admin: { username: "admin", password: "admin", role: "admin" },
  superadmin: { username: "superadmin", password: "superadmin", role: "superadmin" },
  user: { username: "user", password: "user", role: "user" },
};

export default function LoginPage({ onLogin }) {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = users[form.username];
    if (user && user.password === form.password) onLogin(user);
    else setError("Invalid username or password");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-sm border-t-4 border-[#E15C31]">
        <div className="flex justify-center mb-6">
          <UserCircle2 size={60} className="text-[#E15C31]" />
        </div>
        <h2 className="text-2xl font-semibold text-center text-slate-800 mb-6">
          Login to Document Portal
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#E15C31]"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#E15C31]"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-[#E15C31] text-white py-3 rounded-lg hover:opacity-90 transition flex justify-center items-center gap-2"
          >
            <Lock size={16} /> Login
          </button>
        </form>

        <p className="text-xs text-slate-500 mt-6 text-center">
          Use <b>admin/admin</b> or <b>superadmin/superadmin</b>
        </p>
      </div>
    </div>
  );
}
