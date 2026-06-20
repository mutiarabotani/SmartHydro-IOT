import { useState } from "react";

export default function DeviceCard({
  title,
  icon,
  color = "bg-green-100",
  deviceId,
}) {
  const [isOn, setIsOn] = useState(true);

  const toggleDevice = () => {
    const newStatus = !isOn;

    setIsOn(newStatus);

    console.log(
      `${deviceId} => ${newStatus ? "ON" : "OFF"}`
    );

    /*
    Nanti ganti jadi:

    await axios.post(
      "http://localhost:5000/api/device",
      {
        device: deviceId,
        status: newStatus
      }
    );
    */
  };

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

          <div className="flex justify-between items-center mt-5">

            <div className="flex items-center gap-2">

              <div
                className={`
                w-3
                h-3
                rounded-full
                ${
                  isOn
                    ? "bg-green-500"
                    : "bg-red-500"
                }
                `}
              />

              <span
                className={`
                font-semibold
                ${
                  isOn
                    ? "text-green-600"
                    : "text-red-500"
                }
                `}
              >
                {isOn ? "ON" : "OFF"}
              </span>

            </div>

            {/* SWITCH */}

            <button
              onClick={toggleDevice}
              className={`
              relative
              w-14
              h-8
              rounded-full
              transition-all
              duration-300
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
                shadow
                transition-all
                duration-300
                ${
                  isOn
                    ? "left-7"
                    : "left-1"
                }
                `}
              />

            </button>

          </div>

          <div className="mt-4 text-sm text-slate-500">

            <p>Terakhir diperbarui</p>

            <p>10:30 WIB</p>

          </div>

        </div>

      </div>
    </div>
  );
}