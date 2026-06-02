import { useEffect, useState } from "react";
import {
  Menu,
  Cloud,
  Clock3,
  CalendarDays
} from "lucide-react";

export default function Navbar() {

  const [currentTime, setCurrentTime] =
    useState(new Date());

  useEffect(() => {

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);

  }, []);

  const formattedDate =
    currentTime.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });

  const formattedTime =
    currentTime.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });

  return (
    <div
      className="
      bg-white
      border-b
      border-slate-300
      h-[70px]
      flex
      justify-between
      items-center
      "
    >

      {/* KIRI */}

      <div className="flex h-full">

        <div
          className="
          w-[70px]
          border-r
          border-slate-300
          flex
          items-center
          justify-center
          "
        >
          <Menu size={30} />
        </div>

        <div className="px-5 flex flex-col justify-center">

          <h1 className="text-2xl font-bold">
            Dashboard
          </h1>

          <p className="text-sm text-slate-500">
            Monitoring dan Kontrol Sistem Hidroponik
          </p>

        </div>

      </div>

      {/* KANAN */}

      <div className="flex h-full">

        <div
          className="
          px-6
          border-l
          border-slate-300
          flex
          items-center
          gap-2
          "
        >

          <Cloud size={18} />

          <span className="text-sm">
            IoT Status:
          </span>

          <span className="font-semibold text-green-600">
            Terhubung
          </span>

        </div>

        <div
          className="
          px-6
          border-l
          border-slate-300
          flex
          items-center
          gap-2
          "
        >

          <Clock3 size={18} />

          <span className="text-sm">
            {formattedTime}
          </span>

        </div>

        <div
          className="
          px-6
          border-l
          border-slate-300
          flex
          items-center
          gap-2
          "
        >

          <CalendarDays size={18} />

          <span className="text-sm whitespace-nowrap">
            {formattedDate}
          </span>

        </div>

      </div>

    </div>
  );
}