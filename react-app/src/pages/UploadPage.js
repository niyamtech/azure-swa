import React, { useState } from "react";

export default function UploadPage() {
  const [files, setFiles] = useState([]);
  const [uploaded, setUploaded] = useState(false);

  const handleFiles = (e) => {
    const selected = Array.from(e.target.files);
    setFiles(selected);
    setUploaded(false);
  };

  const handleUpload = () => {
    if (files.length === 0) return;
    setTimeout(() => {
      setUploaded(true);
    }, 1000); // mock upload delay
  };

  return (
    <div className="bg-white shadow-md rounded-2xl p-8">
      <h2 className="text-xl font-semibold text-slate-800 mb-6 text-center">
        Upload Your Documents
      </h2>

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-10 text-center cursor-pointer hover:border-[#E15C31] transition">
        <input
          type="file"
          multiple
          onChange={handleFiles}
          className="hidden"
          id="fileUpload"
        />
        <label htmlFor="fileUpload" className="cursor-pointer text-slate-600">
          Drag and drop files here, or <span className="text-[#E15C31] font-medium">browse</span>
        </label>
      </div>

      {files.length > 0 && (
        <div className="mt-6">
          <ul className="text-sm text-left text-slate-700 mb-4">
            {files.map((file, i) => (
              <li key={i}>📄 {file.name}</li>
            ))}
          </ul>
          <button
            onClick={handleUpload}
            className="w-full bg-[#E15C31] text-white py-3 rounded-lg hover:opacity-90 transition"
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

      <ul className="mt-6 text-sm text-gray-500 text-left">
        <li>✅ Supports PDF, DOCX, JPG, PNG</li>
        <li>✅ Max size: 10MB per file</li>
      </ul>
    </div>
  );
}
