import {
  LayoutDashboard,
  Activity,
  Brain,
  SlidersHorizontal,
  ClipboardList,
  Settings,
  Leaf
} from "lucide-react";

export default function Sidebar() {
  return (
    <div
      className="
      w-[220px]
      min-h-screen
      bg-white
      border-r
      border-slate-300
      "
    >

      {/* HEADER */}

      <div
        className="
        h-[70px]
        border-b
        border-slate-300
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
          border-slate-400
          flex
          items-center
          justify-center
          "
        >
          <Leaf size={24} />
        </div>

        <h1 className="font-bold text-lg text-slate-800">
          SmartHydro-AI
        </h1>

      </div>

      {/* MENU */}

      <div>

        <MenuItem
          icon={<LayoutDashboard size={22} />}
          text="Dashboard"
          active
        />

        <MenuItem
          icon={<Activity size={22} />}
          text="Monitoring"
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
  active
}) {

  return (
    <div
      className={`
      h-[56px]
      flex
      items-center
      gap-3
      px-6
      border-b
      border-slate-300
      cursor-pointer

      ${
        active
          ? "bg-slate-200 font-semibold"
          : "hover:bg-slate-100"
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