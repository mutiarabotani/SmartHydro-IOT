import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function DeviceControl() {
  return (
    <div className="flex bg-slate-100 min-h-screen">

      <Sidebar />

      <div className="flex-1">

        <Navbar />

        <div className="p-5">

          <h1 className="text-3xl font-bold mb-4">
            Device Control
          </h1>

          {/* MODE SISTEM */}

          <div
            className="
            bg-white
            border
            border-slate-300
            p-5
            "
          >

            <div className="flex justify-between items-center">

              <div>

                <h2 className="text-2xl font-semibold">
                  Mode Sistem
                </h2>

                <p className="text-slate-500">
                  Pilih mode pengendalian sistem hidroponik
                </p>

              </div>

              <div className="flex gap-4">

                <button
                  className="
                  px-8
                  py-4
                  bg-green-100
                  border
                  border-green-500
                  rounded
                  font-semibold
                  "
                >
                  AUTO
                </button>

                <button
                  className="
                  px-8
                  py-4
                  bg-slate-100
                  border
                  border-slate-400
                  rounded
                  font-semibold
                  "
                >
                  MANUAL
                </button>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}