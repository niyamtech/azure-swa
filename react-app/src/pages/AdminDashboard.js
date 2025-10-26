import React from "react";

const mockUploads = [
  { id: 1, name: "Ravi Tax Document.pdf", date: "2025-10-25", uploader: "Ravi" },
  { id: 2, name: "Invoice_2025.png", date: "2025-10-24", uploader: "Mina" },
  { id: 3, name: "IDProof.docx", date: "2025-10-23", uploader: "Sagar" }
];

export default function AdminDashboard() {
  return (
    <div className="bg-white shadow-md rounded-2xl p-8">
      <h2 className="text-xl font-semibold text-slate-800 mb-6 text-center">
        📂 Uploaded Documents
      </h2>

      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-200">
            <th className="p-3 text-slate-600">File Name</th>
            <th className="p-3 text-slate-600">Uploader</th>
            <th className="p-3 text-slate-600">Date</th>
          </tr>
        </thead>
        <tbody>
          {mockUploads.map((file) => (
            <tr key={file.id} className="hover:bg-slate-50">
              <td className="p-3">{file.name}</td>
              <td className="p-3">{file.uploader}</td>
              <td className="p-3">{file.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
