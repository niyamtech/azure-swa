import React, { useEffect, useState } from "react";
import { FileText, User, Calendar, RefreshCw } from "lucide-react";

export default function AdminDashboard() {
  const [uploads, setUploads] = useState([]);

  const loadUploads = () => {
    const stored = JSON.parse(sessionStorage.getItem("uploads") || "[]");
    setUploads(stored);
  };

  useEffect(() => {
    loadUploads();
  }, []);

  return (
    <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden font-[Inter]">
      {/* Header Bar */}
      <div className="bg-gradient-to-r from-[#E15C31] to-orange-500 p-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-white flex items-center gap-3">
          <FileText size={24} /> Uploaded Documents
        </h2>
        <button
          onClick={loadUploads}
          className="flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white px-3 py-1.5 rounded-lg text-sm transition"
        >
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      <div className="p-8">
        {uploads.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <p className="text-lg font-medium">📂 No files uploaded yet</p>
            <p className="text-sm mt-2 text-slate-400">
              Files uploaded by users will appear here once they upload them.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
            <table className="w-full border-collapse text-sm">
              <thead className="bg-slate-100/80 text-slate-700 uppercase text-xs tracking-wide">
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
                        ? "bg-white hover:bg-orange-50/40"
                        : "bg-slate-50 hover:bg-orange-50/40"
                    }`}
                  >
                    <td className="px-6 py-3 font-medium text-slate-800 flex items-center gap-2">
                      <FileText size={16} className="text-[#E15C31]" />
                      {file.name}
                    </td>
                    <td className="px-6 py-3 text-slate-700">
                      <span className="inline-block bg-orange-100 text-[#E15C31] px-2 py-1 rounded-md text-xs font-medium">
                        {file.type}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-slate-700 flex items-center gap-2">
                      <User size={16} className="text-[#E15C31]" />
                      {file.uploader}
                    </td>
                    {/* <td className="px-6 py-3 text-slate-600 flex items-center gap-2">
                      <Calendar size={15} className="text-slate-400" />
                      {file.date}
                    </td> */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
