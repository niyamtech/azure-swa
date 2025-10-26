import React, { useState } from "react";
import { UploadCloud, Trash2, FileText } from "lucide-react";

export default function UploadPage({ user }) {
  const [files, setFiles] = useState([]);
  const [docType, setDocType] = useState("PAYG Summary");
  const [uploaded, setUploaded] = useState(false);

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
    <div className="bg-white rounded-2xl shadow-xl p-10 border-t-4 border-[#E15C31]">
      <h2 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-2">
        <UploadCloud className="text-[#E15C31]" /> Upload Documents
      </h2>

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

      <div className="border-2 border-dashed border-slate-300 rounded-xl p-10 text-center hover:border-[#E15C31] transition">
        <input
          id="fileUpload"
          type="file"
          multiple
          onChange={handleFiles}
          className="hidden"
        />
        <label htmlFor="fileUpload" className="cursor-pointer text-slate-600">
          Drag & drop files here, or{" "}
          <span className="text-[#E15C31] font-medium">browse</span>
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
            className="mt-4 bg-[#E15C31] text-white w-full py-3 rounded-lg hover:opacity-90"
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
  );
}
