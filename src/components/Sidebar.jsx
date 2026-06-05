import {
  LayoutDashboard,
  Activity,
  Brain,
  SlidersHorizontal,
  ClipboardList,
  Settings,
  Leaf
} from "lucide-react";

import { useNavigate, useLocation } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div
      className="
      w-[220px]
      min-h-screen
      bg-slate-900
      text-white
      border-r
      border-slate-700
      "
    >
      {/* HEADER */}

      <div
        className="
        h-[70px]
        border-b
        border-slate-700
        flex
        items-center
        px-3
        gap-3
        "
      >
        <div
          className="
          w-12
          h-12
          border
          border-slate-600
          flex
          items-center
          justify-center
          "
        >
          <Leaf size={24} />
        </div>

        <h1 className="font-bold text-lg">
          SmartHydro-AI
        </h1>
      </div>

      {/* MENU */}

      <div>
        <MenuItem
          icon={<LayoutDashboard size={22} />}
          text="Dashboard"
          active={location.pathname === "/"}
          onClick={() => navigate("/")}
        />

        <MenuItem
          icon={<Activity size={22} />}
          text="Monitoring"
          active={location.pathname === "/monitoring"}
          onClick={() => navigate("/monitoring")}
        />

        <MenuItem
          icon={<Brain size={22} />}
          text="AI Prediction"
        />

        <MenuItem
          icon={<SlidersHorizontal size={22} />}
          text="Device Control"
        />

        <MenuItem
          icon={<ClipboardList size={22} />}
          text="Log"
        />

        <MenuItem
          icon={<Settings size={22} />}
          text="Setting"
        />
      </div>
    </div>
  );
}

function MenuItem({
  icon,
  text,
  active,
  onClick
}) {
  return (
    <div
      onClick={onClick}
      className={`
      h-[56px]
      flex
      items-center
      gap-3
      px-6
      border-b
      border-slate-700
      cursor-pointer
      transition-all

      ${
        active
          ? "bg-green-600 text-white font-semibold"
          : "hover:bg-slate-800"
      }
      `}
    >
      {icon}

      <span className="text-base">
        {text}
      </span>
    </div>
  );
}