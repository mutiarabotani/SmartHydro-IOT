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

        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">
            Monitoring Parameter Hidroponik
            </h2>

            <div className="flex items-center gap-3">
            <span className="font-medium">
                Periode
            </span>

            <select
                className="
                border
                border-slate-300
                rounded-lg
                px-3
                py-2
                "
            >
                <option>Hari Ini</option>
                <option>Minggu Ini</option>
                <option>Bulan Ini</option>
            </select>
            </div>
        </div>

        </div>

      </div>

    </div>
  );
}