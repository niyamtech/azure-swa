import React, { useState } from "react";
import { Lock, ShieldCheck, UserCircle2 } from "lucide-react";

const users = {
  admin: { username: "admin", password: "admin", role: "admin" },
  superadmin: { username: "superadmin", password: "superadmin", role: "superadmin" },
  user: { username: "user", password: "user", role: "user" },
};

export default function LoginPage({ onLogin }) {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [step, setStep] = useState("credentials");
  const [mfaCode, setMfaCode] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = users[form.username];
    if (!user || user.password !== form.password) {
      setError("Invalid username or password");
      return;
    }
    setError("");
    setStep("mfa");
  };

  const handleMfa = (event) => {
    event.preventDefault();
    if (mfaCode.trim() !== "123456") {
      setError("The 6-digit code is incorrect. Check your authenticator app.");
      return;
    }
    const user = users[form.username];
    if (user) onLogin(user);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-sm border-t-4 border-[#E15C31]">
        <div className="flex justify-center mb-6">
          <UserCircle2 size={60} className="text-[#E15C31]" />
        </div>
        <h2 className="text-2xl font-semibold text-center text-slate-800 mb-6">
          Secure Sign In
        </h2>

        {step === "credentials" ? (
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
              <Lock size={16} /> Continue
            </button>
          </form>
        ) : (
          <form onSubmit={handleMfa} className="space-y-4">
            <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-600 flex items-start gap-3">
              <ShieldCheck className="text-[#E15C31] mt-0.5" size={18} />
              <p>
                Enter the 6-digit code from your authenticator app. This keeps
                client tax data locked, even if passwords are compromised.
              </p>
            </div>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              placeholder="6-digit code"
              className="w-full border rounded-lg px-4 py-2 text-center tracking-widest text-lg focus:ring-2 focus:ring-[#E15C31]"
              value={mfaCode}
              onChange={(e) => setMfaCode(e.target.value.replace(/[^0-9]/g, ""))}
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setStep("credentials");
                  setMfaCode("");
                }}
                className="w-1/3 border border-slate-200 rounded-lg py-2 text-sm text-slate-500 hover:bg-slate-50"
              >
                Back
              </button>
              <button
                type="submit"
                className="flex-1 bg-[#E15C31] text-white py-3 rounded-lg hover:opacity-90 transition flex justify-center items-center gap-2"
              >
                <Lock size={16} /> Verify & Sign In
              </button>
            </div>
          </form>
        )}

        <p className="text-xs text-slate-500 mt-6 text-center">
          Use <b>admin/admin</b> or <b>superadmin/superadmin</b>. MFA demo code:
          <b> 123456</b>
        </p>
      </div>
    </div>
  );
}
