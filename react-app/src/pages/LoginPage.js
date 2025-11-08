import React, { useState } from "react";
import logo from "../logo.svg";

const demoUsers = {
  admin: { username: "admin", password: "admin", role: "admin" },
  superadmin: { username: "superadmin", password: "superadmin", role: "superadmin" },
  user: { username: "user", password: "user", role: "user" },
};

const MFA_CODE = "000000";

export default function LoginPage({ onLogin }) {
  const [step, setStep] = useState("choice");
  const [returnStep, setReturnStep] = useState("choice");
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [registerForm, setRegisterForm] = useState({ fullName: "", email: "", password: "" });
  const [pendingUser, setPendingUser] = useState(null);
  const [mfaCode, setMfaCode] = useState("");
  const [error, setError] = useState("");

  const goToStep = (nextStep) => {
    setStep(nextStep);
    setError("");
  };

  const handleLoginSubmit = (event) => {
    event.preventDefault();
    const trimmedUsername = loginForm.username.trim();
    const user = demoUsers[trimmedUsername];

    if (!user || user.password !== loginForm.password.trim()) {
      setError("Invalid username or password. Try the demo accounts below.");
      return;
    }

    setPendingUser(user);
    setReturnStep("login");
    setMfaCode("");
    setError("");
    setStep("mfa");
  };

  const handleRegisterSubmit = (event) => {
    event.preventDefault();
    const fullName = registerForm.fullName.trim();
    const email = registerForm.email.trim();
    const password = registerForm.password.trim();

    if (!fullName || !email || !password) {
      setError("Enter your full name, email, and a password to continue.");
      return;
    }

    setPendingUser({ username: fullName || email, role: "user", email });
    setReturnStep("register");
    setMfaCode("");
    setError("");
    setStep("mfa");
  };

  const handleMfaSubmit = (event) => {
    event.preventDefault();
    if (mfaCode.trim() !== MFA_CODE) {
      setError("Incorrect multi-factor code. Enter 000000 to proceed.");
      return;
    }

    if (pendingUser) {
      onLogin(pendingUser);
    } else {
      setError("Start with login or registration first.");
    }
  };

  const renderChoice = () => (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="text-xl font-semibold text-slate-900">Welcome back</h2>
        <p className="text-sm text-slate-600">
          Choose how you would like to get started. The flow keeps things simple so you can plug in MSAL later.
        </p>
      </div>
      <div className="grid gap-3">
        <button
          type="button"
          onClick={() => goToStep("login")}
          className="rounded-lg border border-slate-200 px-4 py-3 text-sm font-medium text-slate-900 transition hover:border-slate-400"
        >
          Sign in with an existing account
        </button>
        <button
          type="button"
          onClick={() => goToStep("register")}
          className="rounded-lg border border-slate-200 px-4 py-3 text-sm font-medium text-slate-900 transition hover:border-slate-400"
        >
          Create a new account
        </button>
      </div>
    </div>
  );

  const renderLogin = () => (
    <form onSubmit={handleLoginSubmit} className="space-y-4">
      <div className="space-y-1">
        <label className="text-sm font-medium text-slate-900" htmlFor="username">
          Username
        </label>
        <input
          id="username"
          type="text"
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/15"
          value={loginForm.username}
          onChange={(event) =>
            setLoginForm((prev) => ({ ...prev, username: event.target.value }))
          }
          autoComplete="username"
        />
      </div>
      <div className="space-y-1">
        <label className="text-sm font-medium text-slate-900" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          type="password"
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/15"
          value={loginForm.password}
          onChange={(event) =>
            setLoginForm((prev) => ({ ...prev, password: event.target.value }))
          }
          autoComplete="current-password"
        />
      </div>
      {error && step === "login" && <p className="text-sm text-red-500">{error}</p>}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => goToStep("choice")}
          className="w-1/3 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Back
        </button>
        <button
          type="submit"
          className="flex-1 rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800"
        >
          Continue
        </button>
      </div>
    </form>
  );

  const renderRegister = () => (
    <form onSubmit={handleRegisterSubmit} className="space-y-4">
      <div className="space-y-1">
        <label className="text-sm font-medium text-slate-900" htmlFor="fullName">
          Full name
        </label>
        <input
          id="fullName"
          type="text"
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/15"
          value={registerForm.fullName}
          onChange={(event) =>
            setRegisterForm((prev) => ({ ...prev, fullName: event.target.value }))
          }
          autoComplete="name"
        />
      </div>
      <div className="space-y-1">
        <label className="text-sm font-medium text-slate-900" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/15"
          value={registerForm.email}
          onChange={(event) =>
            setRegisterForm((prev) => ({ ...prev, email: event.target.value }))
          }
          autoComplete="email"
        />
      </div>
      <div className="space-y-1">
        <label className="text-sm font-medium text-slate-900" htmlFor="new-password">
          Create password
        </label>
        <input
          id="new-password"
          type="password"
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/15"
          value={registerForm.password}
          onChange={(event) =>
            setRegisterForm((prev) => ({ ...prev, password: event.target.value }))
          }
          autoComplete="new-password"
        />
      </div>
      {error && step === "register" && <p className="text-sm text-red-500">{error}</p>}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => goToStep("choice")}
          className="w-1/3 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Back
        </button>
        <button
          type="submit"
          className="flex-1 rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800"
        >
          Continue
        </button>
      </div>
    </form>
  );

  const renderMfa = () => (
    <form onSubmit={handleMfaSubmit} className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-slate-900">Multi-factor check</h3>
        <p className="text-sm text-slate-600">
          For the demo environment, enter <span className="font-semibold">000000</span> to confirm your login.
        </p>
      </div>
      <input
        type="text"
        inputMode="text"
        maxLength={8}
        placeholder="all000000"
        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-center text-sm tracking-[0.3em] focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/15"
        value={mfaCode}
        onChange={(event) => setMfaCode(event.target.value)}
      />
      {error && step === "mfa" && <p className="text-sm text-red-500">{error}</p>}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => {
            setStep(returnStep);
            setMfaCode("");
            setError("");
          }}
          className="w-1/3 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Back
        </button>
        <button
          type="submit"
          className="flex-1 rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800"
        >
          Verify
        </button>
      </div>
    </form>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] px-4 py-12">
      <div className="mx-auto w-full max-w-md space-y-6">
        <header className="space-y-3 text-center">
          <div className="flex justify-center">
            <img src={logo} alt="Aussie Tax Mate" className="h-12 w-12" />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold text-slate-900">Client access</h1>
            <p className="text-sm text-slate-600">
              Minimal steps today. Swap in Microsoft Entra ID when you wire up MSAL.
            </p>
          </div>
        </header>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          {step === "choice" && renderChoice()}
          {step === "login" && renderLogin()}
          {step === "register" && renderRegister()}
          {step === "mfa" && renderMfa()}
        </section>

        <footer className="text-center text-xs text-slate-500">
          Demo users: <strong>admin/admin</strong>, <strong>superadmin/superadmin</strong>, <strong>user/user</strong>.
        </footer>
      </div>
    </div>
  );
}
