import React, { useEffect, useState } from "react";
import { UploadCloud, Trash2, FileText, LockKeyhole } from "lucide-react";
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

      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
            <UploadCloud className="text-[#E15C31]" /> Upload Documents
          </h2>
          <span className="text-xs text-slate-500 flex items-center gap-2">
            <LockKeyhole size={14} className="text-[#E15C31]" /> Uploads unlock
            once your profile is completed.
          </span>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Select Document Type
          </label>
          <select
            value={docType}
            onChange={(e) => setDocType(e.target.value)}
            className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-[#E15C31] focus:outline-none"
          >
            {taxDocTypes.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>

        <div
          className={`border-2 rounded-xl p-10 text-center transition ${
            intakeComplete
              ? "border-dashed border-slate-300 hover:border-[#E15C31]"
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
                <span className="text-[#E15C31] font-medium">browse</span>
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
                className="flex items-center justify-between bg-slate-50 border border-slate-200 px-4 py-2 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <FileText className="text-[#E15C31]" size={18} />
                  <div>
                    <p className="text-slate-800 font-medium truncate">{f.file.name}</p>
                    <p className="text-sm text-slate-500">Type: {f.type}</p>
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
              className={`mt-4 w-full py-3 rounded-lg font-medium transition ${
                intakeComplete
                  ? "bg-[#E15C31] text-white hover:opacity-90"
                  : "bg-slate-200 text-slate-500 cursor-not-allowed"
              }`}
              disabled={!intakeComplete}
            >
              Upload
            </button>
          </div>
        )}

        {uploaded && (
          <div className="mt-6 bg-green-100 border border-green-300 text-green-800 py-3 px-4 rounded-lg text-center">
            ✅ Files uploaded successfully!
          </div>
        )}
      </div>
    </div>
  );
}
