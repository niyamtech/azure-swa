import React, { useEffect, useState } from "react";
import { UploadCloud, Trash2, FileText, LockKeyhole, ShieldCheck, Sparkles } from "lucide-react";
import UserIntakeForm from "../components/UserIntakeForm";

export default function UploadPage({ user }) {
  const [files, setFiles] = useState([]);
  const [docType, setDocType] = useState("PAYG Summary");
  const [uploaded, setUploaded] = useState(false);
  const [intakeComplete, setIntakeComplete] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem("taxvault_intake_form");
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored);
      setIntakeComplete(Boolean(parsed?.submitted));
    } catch (error) {
      console.error("Failed to read intake form", error);
    }
  }, []);

  const taxDocTypes = [
    "PAYG Summary",
    "Work-Related Expenses",
    "Bank Interest Statement",
    "Donations Receipts",
    "Health Insurance Statement",
    "Rental Property Summary",
    "Investment Income Report",
    "Other Documents",
  ];

  const handleFiles = (e) => {
    const selected = Array.from(e.target.files).map((file) => ({
      file,
      type: docType, // capture the docType at upload time
    }));
    setFiles((prev) => [...prev, ...selected]);
    setUploaded(false);
  };

  const handleRemove = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = () => {
    if (!intakeComplete) return;
    if (files.length === 0) return;
    const uploads = JSON.parse(sessionStorage.getItem("uploads") || "[]");
    const now = new Date().toISOString().split("T")[0];
    const newUploads = files.map((f) => ({
      name: f.file.name,
      type: f.type,
      uploader: user?.name || "Guest",
      date: now,
    }));
    sessionStorage.setItem("uploads", JSON.stringify([...uploads, ...newUploads]));
    setFiles([]);
    setUploaded(true);
  };

  return (
    <div className="space-y-8">
      <UserIntakeForm onStatusChange={setIntakeComplete} />

      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-soft-xl">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
            <UploadCloud className="text-brand-primary" /> Upload documents
          </h2>
          <span className="text-xs text-slate-500 flex items-center gap-2">
            <LockKeyhole size={14} className="text-brand-primary" /> Uploads unlock once your profile is completed.
          </span>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Select Document Type
          </label>
          <select
            value={docType}
            onChange={(e) => setDocType(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 p-3 text-sm focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
          >
            {taxDocTypes.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>

        <div
          className={`border-2 rounded-xl p-10 text-center transition ${
            intakeComplete
              ? "border-dashed border-brand-primary/40 bg-brand-primary/5 hover:border-brand-primary"
              : "border-slate-200 bg-slate-50"
          }`}
        >
          <input
            id="fileUpload"
            type="file"
            multiple
            onChange={handleFiles}
            className="hidden"
            disabled={!intakeComplete}
          />
          <label
            htmlFor="fileUpload"
            className={`text-sm md:text-base ${
              intakeComplete
                ? "cursor-pointer text-slate-600"
                : "cursor-not-allowed text-slate-400"
            }`}
          >
            {intakeComplete ? (
              <>
                Drag & drop files here, or{" "}
                <span className="font-medium text-brand-primary">browse</span>
              </>
            ) : (
              "Complete your tax profile above to enable uploads."
            )}
          </label>
        </div>

        {files.length > 0 && (
          <div className="mt-6 space-y-3">
            {files.map((f, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <FileText className="text-brand-primary" size={18} />
                  <div>
                    <p className="text-slate-800 font-medium truncate">{f.file.name}</p>
                    <p className="text-xs text-slate-500">Type: {f.type}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleRemove(i)}
                  className="text-red-500 hover:text-red-700"
                  title="Remove"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}

            <button
              onClick={handleUpload}
              className={`mt-4 w-full rounded-2xl py-3 text-sm font-semibold transition ${
                intakeComplete
                  ? "bg-brand-gradient text-white shadow-soft-xl hover:brightness-105"
                  : "cursor-not-allowed bg-slate-200 text-slate-500"
              }`}
              disabled={!intakeComplete}
            >
              Upload securely
            </button>
          </div>
        )}

        {uploaded && (
          <div className="mt-6 flex items-center justify-between rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            <span className="flex items-center gap-2">
              <ShieldCheck size={18} />
              Files uploaded successfully! Admins will review within 24 hours.
            </span>
            <span className="hidden text-xs text-slate-400 sm:inline-flex items-center gap-1">
              <Sparkles size={14} /> AES-256 at rest
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
