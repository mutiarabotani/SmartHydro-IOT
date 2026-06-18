import { ToggleRight } from "lucide-react";

export default function DeviceCard({
  icon,
  title,
  status = "Aktif",
  color = "bg-green-100",
}) {
  return (
    <div
      className="
      bg-white
      border
      border-slate-300
      p-5
      "
    >
      <div className="flex gap-5">

        {/* ICON */}

        <div
          className={`
          w-24
          h-24
          rounded-full
          flex
          items-center
          justify-center
          ${color}
          `}
        >
          {icon}
        </div>

        {/* CONTENT */}

        <div className="flex-1">

          <h3
            className="
            text-2xl
            font-semibold
            border-b
            border-slate-300
            pb-2
            "
          >
            {title}
          </h3>

          <div className="mt-4 flex justify-between items-center">

            <span className="text-xl">
              {status}
            </span>

            <ToggleRight
              size={55}
              className="text-green-500"
            />

          </div>

          <div className="mt-4 text-slate-500">

            <p>Terakhir diperbarui:</p>

            <p>10:30 WIB</p>

          </div>

        </div>

      </div>
    </div>
  );
}