import React, { useState } from "react";
import { CheckCircle, Lock, ShieldCheck, UserRound, Shield } from "lucide-react";
import AuthIntegrationGuide from "../components/AuthIntegrationGuide";
import logo from "../logo.svg";

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

  const handleSocialLogin = (provider) => {
    const message =
      provider === "microsoft"
        ? "MSAL login will redirect to Microsoft 365 once configured in Azure AD."
        : "Google accounts can federate through Azure AD External Identities.";
    alert(message);
  };

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
    <div className="min-h-screen bg-gradient-to-br from-[#F8FAFC] via-white to-[#DCE8FF] py-10">
      <div className="mx-auto max-w-5xl px-4">
        <header className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Aussie Tax Mate logo" className="h-12 w-12" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-primary">Aussie Tax Mate</p>
              <h1 className="text-2xl font-semibold text-slate-900">Client security portal</h1>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 rounded-full border border-brand-accent/40 bg-white px-4 py-2 text-xs text-slate-500">
            <Shield size={16} className="text-brand-primary" /> Multi-factor login enforced
          </div>
        </header>

        <div className="grid gap-6 md:grid-cols-[1.15fr,0.85fr]">
          <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-soft-xl">
            <div className="mb-6 flex items-center gap-3">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-gradient text-white">
                <UserRound size={22} />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Secure sign in</h2>
                <p className="text-sm text-slate-500">
                  Demo credentials first, then wire in Microsoft Entra ID when you are ready for production users.
                </p>
              </div>
            </div>

            <div className="mb-5 grid gap-3">
              <button
                type="button"
                onClick={() => handleSocialLogin("microsoft")}
                className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 py-3 text-sm font-medium text-slate-600 hover:border-brand-primary hover:text-brand-primary"
              >
                <Lock size={16} /> Continue with Microsoft 365
              </button>
              <button
                type="button"
                onClick={() => handleSocialLogin("google")}
                className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 py-3 text-sm font-medium text-slate-600 hover:border-brand-accent hover:text-brand-accent"
              >
                <CheckCircle size={16} /> Continue with Google (via Azure)
              </button>
            </div>

            <div className="relative mb-6 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-slate-400">
              <span className="flex-1 border-b border-slate-200" />
              Or use the demo login
              <span className="flex-1 border-b border-slate-200" />
            </div>

            {step === "credentials" ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Username"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                />
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                {error && <p className="text-sm text-red-500">{error}</p>}
                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-gradient py-3 text-sm font-semibold text-white shadow-soft-xl transition hover:brightness-105"
                >
                  <Lock size={16} /> Continue to MFA
                </button>
              </form>
            ) : (
              <form onSubmit={handleMfa} className="space-y-4">
                <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                  <ShieldCheck className="mt-0.5 text-brand-primary" size={18} />
                  <p>
                    Enter the 6-digit code from your authenticator app. This keeps client tax data locked, even if passwords are compromised.
                  </p>
                </div>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  placeholder="6-digit code"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-center text-lg tracking-[0.4em] focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
                  value={mfaCode}
                  onChange={(e) => setMfaCode(e.target.value.replace(/[^0-9]/g, ""))}
                />
                {error && <p className="text-sm text-red-500">{error}</p>}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setStep("credentials");
                      setMfaCode("");
                    }}
                    className="w-1/3 rounded-2xl border border-slate-200 py-2 text-sm font-medium text-slate-500 hover:bg-slate-50"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="flex-1 rounded-2xl bg-brand-gradient py-3 text-sm font-semibold text-white shadow-soft-xl transition hover:brightness-105 flex items-center justify-center gap-2"
                  >
                    <Lock size={16} /> Verify & Sign In
                  </button>
                </div>
              </form>
            )}

            <p className="mt-6 text-center text-xs text-slate-500">
              Demo users: <b>admin/admin</b>, <b>superadmin/superadmin</b>, <b>user/user</b>. MFA demo code: <b>123456</b>
            </p>
          </section>

          <div>
            <div className="rounded-3xl border border-brand-primary/30 bg-white p-6 shadow-soft-xl">
              <h3 className="text-lg font-semibold text-slate-900">How Microsoft sign-in lands here</h3>
              <ul className="mt-4 space-y-3 text-sm text-slate-600">
                <li className="flex items-start gap-3">
                  <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-brand-primary/10 text-xs font-semibold text-brand-primary">
                    1
                  </span>
                  Register the SPA and API in Azure Active Directory (Entra ID). Enable Email OTP or Authenticator for MFA.
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-brand-primary/10 text-xs font-semibold text-brand-primary">
                    2
                  </span>
                  Use MSAL to request <code>User.Read</code> and custom scopes. Federation with Google allows @gmail.com users to sign in with the same flow.
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-brand-primary/10 text-xs font-semibold text-brand-primary">
                    3
                  </span>
                  Exchange the ID token with your Azure/.NET backend. Set a secure session cookie and keep sensitive data off the client.
                </li>
              </ul>
            </div>

            <AuthIntegrationGuide />
          </div>
        </div>
      </div>
    </div>
  );
}
