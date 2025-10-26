import React from "react";
import { Upload, FileText, CheckCircle } from "lucide-react";

const steps = [
  { icon: Upload, label: "Upload Docs" },
  { icon: FileText, label: "Review" },
  { icon: CheckCircle, label: "Complete" },
];

export default function SidebarStepper() {
  return (
    <aside className="w-64 bg-white border-r shadow-sm p-6 flex flex-col items-start">
      <h3 className="text-lg font-semibold text-slate-800 mb-6">Progress</h3>
      <ul className="space-y-6">
        {steps.map(({ icon: Icon, label }, idx) => (
          <li key={idx} className="flex items-center gap-3">
            <div className="bg-[#E15C31]/10 p-2 rounded-full">
              <Icon size={20} className="text-[#E15C31]" />
            </div>
            <span className="text-slate-700 font-medium">{label}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}
