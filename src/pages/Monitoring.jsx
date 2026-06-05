import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function Monitoring() {

  return (
    <div className="flex min-h-screen bg-slate-100">

      <Sidebar />

      <div className="flex-1">

        <Navbar
          title="Monitoring"
          subtitle="Pemantauan Sensor Hidroponik"
        />

        <div className="p-6">

          MONITORING PAGE

        </div>

      </div>

    </div>
  );
}