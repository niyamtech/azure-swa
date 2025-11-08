import React, { useEffect, useState } from "react";
import { FileText, User, RefreshCw, Shield, KeyRound } from "lucide-react";

const SECURITY_STORAGE_KEY = "taxvault_security_controls";

export default function AdminDashboard() {
  const [uploads, setUploads] = useState([]);
  const [security, setSecurity] = useState({
    enforceMfa: true,
    notifySuspicious: true,
    ipLockdown: false,
  });

  const loadUploads = () => {
    const stored = JSON.parse(sessionStorage.getItem("uploads") || "[]");
    setUploads(stored);
  };

  useEffect(() => {
    const storedSecurity = sessionStorage.getItem(SECURITY_STORAGE_KEY);
    if (!storedSecurity) return;
    try {
      const parsed = JSON.parse(storedSecurity);
      setSecurity((prev) => ({ ...prev, ...parsed }));
    } catch (error) {
      console.error("Failed to load security preferences", error);
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem(SECURITY_STORAGE_KEY, JSON.stringify(security));
  }, [security]);

  const toggleSecurity = (key) => {
    setSecurity((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  useEffect(() => {
    loadUploads();
  }, []);

  return (
    <div className="space-y-6 font-[var(--font-body)]">
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-soft-xl">
        {/* Header Bar */}
        <div className="flex items-center justify-between bg-gradient-to-r from-[#0C6CF2] to-[#5C9CFF] p-6">
          <h2 className="flex items-center gap-3 text-2xl font-semibold text-white">
            <FileText size={24} /> Uploaded Documents
          </h2>
          <button
            onClick={loadUploads}
            className="flex items-center gap-2 rounded-lg bg-white/15 px-3 py-1.5 text-sm text-white transition hover:bg-white/25"
          >
            <RefreshCw size={16} /> Refresh
          </button>
        </div>

        <div className="p-8">
          {uploads.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              <p className="text-lg font-medium">📂 No files uploaded yet</p>
              <p className="mt-2 text-sm text-slate-400">
                Files uploaded by users will appear here once they upload them.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
              <table className="w-full border-collapse text-sm">
                <thead className="bg-slate-100/80 text-xs uppercase tracking-wide text-slate-700">
                  <tr>
                    <th className="px-6 py-3 text-left">File Name</th>
                    <th className="px-6 py-3 text-left">Type</th>
                    <th className="px-6 py-3 text-left">Uploader</th>
                    <th className="px-6 py-3 text-left">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {uploads.map((file, i) => (
                    <tr
                      key={i}
                      className={`border-t border-slate-100 transition-all ${
                        i % 2 === 0
                          ? "bg-white hover:bg-brand-primary/5"
                          : "bg-slate-50 hover:bg-brand-primary/5"
                      }`}
                    >
                      <td className="flex items-center gap-2 px-6 py-3 font-medium text-slate-800">
                        <FileText size={16} className="text-brand-primary" />
                        {file.name}
                      </td>
                      <td className="px-6 py-3 text-slate-700">
                        <span className="inline-block rounded-md bg-brand-primary/10 px-2 py-1 text-xs font-medium text-brand-primary">
                          {file.type}
                        </span>
                      </td>
                      <td className="flex items-center gap-2 px-6 py-3 text-slate-700">
                        <User size={16} className="text-brand-primary" />
                        {file.uploader}
                      </td>
                      <td className="px-6 py-3 text-xs uppercase tracking-wider text-slate-400">
                        {file.date}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-soft-xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
          <h3 className="flex items-center gap-2 text-xl font-semibold text-slate-800">
            <Shield size={22} className="text-brand-primary" /> Security controls
          </h3>
          <p className="text-xs uppercase tracking-widest text-slate-400">
            Admin view only
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <SecurityToggle
            title="Enforce MFA for all logins"
            description="Mandatory for clients and staff before viewing tax data."
            active={security.enforceMfa}
            onClick={() => toggleSecurity("enforceMfa")}
          />
          <SecurityToggle
            title="Alert on suspicious downloads"
            description="Send SMS + email when bulk exports happen after hours."
            active={security.notifySuspicious}
            onClick={() => toggleSecurity("notifySuspicious")}
          />
          <SecurityToggle
            title="Lock portal to office IP"
            description="Only staff inside approved networks can access admin tools."
            active={security.ipLockdown}
            onClick={() => toggleSecurity("ipLockdown")}
          />
        </div>
      </div>
    </div>
  );
}

function SecurityToggle({ title, description, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-left rounded-2xl border px-4 py-5 shadow-sm transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary ${
        active
          ? "border-brand-primary/40 bg-brand-primary/10"
          : "border-slate-200 hover:border-brand-primary/40 hover:bg-brand-primary/10"
      }`}
    >
      <div className="flex items-center gap-3 mb-2">
        <span
          className={`inline-flex h-9 w-9 items-center justify-center rounded-full ${
            active ? "bg-brand-primary text-white" : "bg-slate-100 text-slate-500"
          }`}
        >
          <KeyRound size={16} />
        </span>
        <span className="text-sm font-semibold text-slate-800">{title}</span>
      </div>
      <p className="text-xs leading-relaxed text-slate-500">{description}</p>
      <p className={`mt-4 text-xs font-medium ${active ? "text-brand-primary" : "text-slate-400"}`}>
        {active ? "Active" : "Tap to activate"}
      </p>
    </button>
  );
}
