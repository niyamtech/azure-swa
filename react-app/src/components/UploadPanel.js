import React, { useState } from "react";
import { UploadCloud } from "lucide-react";

export default function UploadPanel() {
  const [files, setFiles] = useState([]);
  const [uploaded, setUploaded] = useState(false);

  const handleFiles = (e) => {
    const selected = Array.from(e.target.files);
    setFiles(selected);
    setUploaded(false);
  };

  const handleUpload = () => {
    if (files.length === 0) return;
    setTimeout(() => setUploaded(true), 1000);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-10 border-t-4 border-[#E15C31] transition-all hover:shadow-2xl">
      <h2 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-2">
        <UploadCloud className="text-[#E15C31]" /> Upload Documents
      </h2>

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
        <div className="mt-6 space-y-2">
          {files.map((f, i) => (
            <p key={i} className="text-slate-700 flex items-center gap-2">
              📄 {f.name}
            </p>
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
          ✅ Upload Successful
        </div>
      )}
    </div>
  );
}
