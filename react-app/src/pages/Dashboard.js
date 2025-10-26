import React from "react";
import SidebarStepper from "../components/SidebarStepper";
import UploadPanel from "../components/UploadPanel";

export default function Dashboard() {
  return (
    <div className="flex h-full">
      <SidebarStepper />
      <main className="flex-1 p-8 bg-slate-50 overflow-y-auto">
        <UploadPanel />
      </main>
    </div>
  );
}
