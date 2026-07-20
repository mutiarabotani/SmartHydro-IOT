/**
 * DevicesContext.jsx — state global mode sistem & aktuator.
 *
 * Untuk apa:
 * - Mode AUTO / MANUAL (mengunci kontrol manual saat AUTO)
 * - Status ON/OFF aktuator (pompa, relay, servo)
 * - Persist ke localStorage agar Dashboard & Device Control sinkron
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const STORAGE_KEY = "smarthydro-devices-v1";

export const DEVICE_IDS = {
  pompaNutrisi: "pompaNutrisi",
  pompaAir: "pompaAir",
  relayTandon: "relayTandon",
  servoNutrisi: "servoNutrisi",
};

const DEFAULT_DEVICES = {
  mode: "AUTO",
  actuators: {
    pompaNutrisi: true,
    pompaAir: true,
    relayTandon: true,
    servoNutrisi: false,
  },
};

function loadDevices() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(DEFAULT_DEVICES);
    const parsed = JSON.parse(raw);
    return {
      mode: parsed.mode === "MANUAL" ? "MANUAL" : "AUTO",
      actuators: { ...DEFAULT_DEVICES.actuators, ...parsed.actuators },
    };
  } catch {
    return structuredClone(DEFAULT_DEVICES);
  }
}

const DevicesContext = createContext(null);

export function DevicesProvider({ children }) {
  const [mode, setModeState] = useState(() => loadDevices().mode);
  const [actuators, setActuators] = useState(() => loadDevices().actuators);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ mode, actuators })
    );
  }, [mode, actuators]);

  const setMode = useCallback((next) => {
    setModeState(next === "MANUAL" ? "MANUAL" : "AUTO");
  }, []);

  const setActuator = useCallback((id, on) => {
    setActuators((prev) => ({ ...prev, [id]: Boolean(on) }));
  }, []);

  const toggleActuator = useCallback((id) => {
    setActuators((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const value = useMemo(
    () => ({
      mode,
      setMode,
      actuators,
      setActuator,
      toggleActuator,
      isAuto: mode === "AUTO",
    }),
    [mode, setMode, actuators, setActuator, toggleActuator]
  );

  return (
    <DevicesContext.Provider value={value}>{children}</DevicesContext.Provider>
  );
}

export function useDevices() {
  const ctx = useContext(DevicesContext);
  if (!ctx) {
    throw new Error("useDevices harus dipakai di dalam DevicesProvider");
  }
  return ctx;
}
