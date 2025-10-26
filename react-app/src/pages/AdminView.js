import React, { useEffect, useState } from "react";
import { FileText, Search, Trash2, Download } from "lucide-react";

export default function AdminView() {
  const [uploads, setUploads] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const data = JSON.parse(sessionStorage.getItem("uploads") || "[]");
    setUploads(data);
  }, []);

  const handleDelete = (index) => {
    const updated = uploads.filter((_, i) => i !== index);
    setUploads(updated);
    sessionStorage.setItem("uploads", JSON.stringify(updated));
  };

  const filtered = uploads.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.uploader.toLowerCase().includes(search.toLowerCase()) ||
      u.type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <FileText className="text-[#E15C31]" /> Uploaded Files
        </h2>
        <div className="flex items-center border border-slate-300 rounded-lg px-3 py-1.5 bg-white">
          <Search size={16} className="text-slate-500" />
          <input
            type="text"
            placeholder="Search files..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="ml-2 outline-none text-sm bg-transparent"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-slate-200">
        {filtered.length === 0 ? (
          <p className="p-6 text-center text-slate-500">No uploads found.</p>
        ) : (
          <table className="w-full border-collapse">
            <thead className="bg-slate-100 text-slate-700">
              <tr>
                <th className="text-left py-3 px-4">File Name</th>
                <th className="text-left py-3 px-4">Type</th>
                <th className="text-left py-3 px-4">Uploader</th>
                <th className="text-left py-3 px-4">Date</th>
                <th className="text-center py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((file, i) => (
                <tr key={i} className="border-t hover:bg-slate-50 transition-all">
                  <td className="py-3 px-4 text-slate-800">{file.name}</td>
                  <td className="py-3 px-4 text-slate-700">{file.type}</td>
                  <td className="py-3 px-4 text-slate-700">{file.uploader}</td>
                  <td className="py-3 px-4 text-slate-600">{file.date}</td>
                  <td className="py-3 px-4 flex justify-center gap-3">
                    <button
                      className="text-slate-600 hover:text-[#E15C31]"
                      title="Download"
                    >
                      <Download size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(i)}
                      className="text-red-500 hover:text-red-700"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="mt-4 text-right text-sm text-slate-500">
        Total uploads: {uploads.length}
      </div>
    </div>
  );
}
