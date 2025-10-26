import React from "react";
import { FileText, User } from "lucide-react";

const mockUploads = [
  { name: "Ravi_TaxDoc.pdf", uploader: "Ravi", date: "2025-10-26" },
  { name: "Invoice_July2025.png", uploader: "Mina", date: "2025-10-25" },
];

export default function AdminView() {
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
        <FileText className="text-[#E15C31]" /> Uploaded Files
      </h2>
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        <table className="w-full border-collapse">
          <thead className="bg-slate-100 text-slate-700">
            <tr>
              <th className="text-left py-3 px-4">File Name</th>
              <th className="text-left py-3 px-4">Uploader</th>
              <th className="text-left py-3 px-4">Date</th>
            </tr>
          </thead>
          <tbody>
            {mockUploads.map((file, i) => (
              <tr
                key={i}
                className="border-t hover:bg-slate-50 transition-all"
              >
                <td className="py-3 px-4">{file.name}</td>
                <td className="py-3 px-4 flex items-center gap-2">
                  <User size={16} className="text-[#E15C31]" />
                  {file.uploader}
                </td>
                <td className="py-3 px-4 text-slate-600">{file.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
