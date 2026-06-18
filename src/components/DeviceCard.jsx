import { useState } from "react";

function DeviceCard({
  title,
  icon,
  color
}) {

  const [isOn, setIsOn] = useState(true);

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
            text-xl
            font-semibold
            border-b
            border-slate-300
            pb-2
            "
          >
            {title}
          </h3>

          <div className="flex justify-between items-center mt-4">

            <span
              className={`font-semibold ${
                isOn
                  ? "text-green-600"
                  : "text-red-500"
              }`}
            >
              {isOn ? "Aktif" : "Mati"}
            </span>

            {/* SWITCH */}

            <button
              onClick={() => setIsOn(!isOn)}
              className={`
                relative
                w-14
                h-8
                rounded-full
                transition-all
                ${
                  isOn
                    ? "bg-green-500"
                    : "bg-slate-300"
                }
              `}
            >

              <div
                className={`
                  absolute
                  top-1
                  w-6
                  h-6
                  rounded-full
                  bg-white
                  transition-all
                  ${
                    isOn
                      ? "left-7"
                      : "left-1"
                  }
                `}
              />

            </button>

          </div>

          <div className="mt-3 text-slate-500 text-sm">

            <p>Terakhir diperbarui</p>

            <p>10:30 WIB</p>

          </div>

        </div>

      </div>
    </div>
  );
}