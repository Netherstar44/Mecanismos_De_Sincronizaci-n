import { useState } from "react";
import { Text, Html, RoundedBox } from "@react-three/drei";

/**
 * TSLHardwareScene — Simulador 3D a Nivel de Hardware:
 * Test-and-Set Lock (TSL) en Arquitectura Multiprocesador & Memoria DPRAM
 */
export function TSLHardwareScene() {
  const [lockFlag, setLockFlag] = useState(false);
  const [activeCore, setActiveCore] = useState<number | null>(null);
  const [busLocked, setBusLocked] = useState(false);
  const [core0Cycles, setCore0Cycles] = useState(0);
  const [core1Cycles, setCore1Cycles] = useState(0);
  const [log, setLog] = useState("Hardware en reposo. Variable lock = 0 (Desbloqueado).");

  // Core 0 intenta adquirir lock con TSL
  const executeTSLC0 = () => {
    setActiveCore(0);
    setBusLocked(true);

    setTimeout(() => {
      if (!lockFlag) {
        // Estaba en 0: lee 0 y escribe 1 atómicamente
        setLockFlag(true);
        setBusLocked(false);
        setLog("CORE 0 ejecutó TSL: leyó 0, escribió 1 atómicamente. Adquiere Sección Crítica.");
      } else {
        // Estaba en 1: lee 1 y escribe 1 (sigue bloqueado). Entra en spinlock
        setCore0Cycles(prev => prev + 1);
        setBusLocked(false);
        setLog(`CORE 0 ejecutó TSL: leyó 1. Candado ocupado. Ciclo de espera activa # ${core0Cycles + 1}.`);
      }
    }, 400);
  };

  // Core 1 intenta adquirir lock con TSL
  const executeTSLC1 = () => {
    setActiveCore(1);
    setBusLocked(true);

    setTimeout(() => {
      if (!lockFlag) {
        setLockFlag(true);
        setBusLocked(false);
        setLog("CORE 1 ejecutó TSL: leyó 0, escribió 1 atómicamente. Adquiere Sección Crítica.");
      } else {
        setCore1Cycles(prev => prev + 1);
        setBusLocked(false);
        setLog(`CORE 1 ejecutó TSL: leyó 1. Candado ocupado. Ciclo de espera activa # ${core1Cycles + 1}.`);
      }
    }, 400);
  };

  const releaseLock = () => {
    setLockFlag(false);
    setActiveCore(null);
    setLog("Instrucción simple: lock = 0. Memoria liberada. Línea de bus lista.");
  };

  const resetAll = () => {
    setLockFlag(false);
    setActiveCore(null);
    setBusLocked(false);
    setCore0Cycles(0);
    setCore1Cycles(0);
    setLog("Sistema reseteado.");
  };

  return (
    <group position={[0, -0.2, 0]}>
      {/* Iluminación */}
      <ambientLight intensity={0.5} />
      <pointLight position={[0, 4, 3]} intensity={2.5} color="#00ffff" distance={10} />
      <pointLight position={[0, 0, 1]} intensity={2} color={busLocked ? "#ff2d2d" : "#00ff88"} distance={4} />

      {/* Rótulo superior */}
      <Text
        position={[0, 2.5, 0]}
        fontSize={0.14}
        color="#00ffff"
        anchorX="center"
        outlineWidth={0.005}
        outlineColor="#000"
      >
        HARDWARE BUS & MEMORIA DPRAM // ATOMICIDAD TSL
      </Text>

      {/* Placa Madre / PCB */}
      <mesh position={[0, 0.4, -0.3]}>
        <boxGeometry args={[5.2, 3.2, 0.1]} />
        <meshStandardMaterial color="#061826" roughness={0.4} metalness={0.7} />
      </mesh>

      {/* Núcleo CPU 0 */}
      <group position={[-1.7, 1.2, 0]}>
        <RoundedBox args={[1.2, 0.9, 0.2]} radius={0.04}>
          <meshStandardMaterial color={activeCore === 0 ? "#0284c7" : "#1e293b"} metalness={0.8} roughness={0.2} />
        </RoundedBox>
        <Text position={[0, 0.15, 0.12]} fontSize={0.11} color="#ffffff">
          CPU CORE 0
        </Text>
        <Text position={[0, -0.15, 0.12]} fontSize={0.09} color="#38bdf8">
          {`Spin Cycles: ${core0Cycles}`}
        </Text>
      </group>

      {/* Núcleo CPU 1 */}
      <group position={[1.7, 1.2, 0]}>
        <RoundedBox args={[1.2, 0.9, 0.2]} radius={0.04}>
          <meshStandardMaterial color={activeCore === 1 ? "#ea580c" : "#1e293b"} metalness={0.8} roughness={0.2} />
        </RoundedBox>
        <Text position={[0, 0.15, 0.12]} fontSize={0.11} color="#ffffff">
          CPU CORE 1
        </Text>
        <Text position={[0, -0.15, 0.12]} fontSize={0.09} color="#fb923c">
          {`Spin Cycles: ${core1Cycles}`}
        </Text>
      </group>

      {/* Bus de Hardware (Líneas conductoras) */}
      <mesh position={[0, 0.4, 0]}>
        <boxGeometry args={[4.2, 0.08, 0.05]} />
        <meshBasicMaterial color={busLocked ? "#ff2d2d" : "#00ff88"} />
      </mesh>
      <Text position={[0, 0.55, 0.1]} fontSize={0.1} color={busLocked ? "#ff2d2d" : "#00ff88"}>
        {busLocked ? "BUS SIGNAL: LOCK# (ATÓMICO)" : "BUS SIGNAL: IDLE (DESBLOQUEADO)"}
      </Text>

      {/* Celda de Memoria Compartida DPRAM (target / lock) */}
      <group position={[0, -0.5, 0]}>
        <RoundedBox args={[1.6, 0.9, 0.25]} radius={0.05}>
          <meshStandardMaterial color="#0b1329" metalness={0.9} roughness={0.1} />
        </RoundedBox>
        <Text position={[0, 0.2, 0.15]} fontSize={0.1} color="#94a3b8">
          MEMORIA DPRAM: TARGET
        </Text>
        <Text position={[0, -0.12, 0.15]} fontSize={0.16} color={lockFlag ? "#ff2d2d" : "#00ff88"}>
          {`lock = ${lockFlag ? "1 (LOCKED)" : "0 (FREE)"}`}
        </Text>
      </group>

      {/* Panel Interactivo Flotante */}
      <Html position={[0, -1.0, 1.4]} center transform distanceFactor={5.5}>
        <div className="w-[430px] bg-[#030811]/95 backdrop-blur-md p-4 rounded-xl border border-[#00ffff]/40 shadow-[0_0_25px_rgba(0,255,255,0.2)] text-white font-mono text-xs select-none">
          <div className="flex justify-between items-center border-b border-[#00ffff]/30 pb-2 mb-2.5">
            <span className="text-[#00ffff] font-bold">INSTRUCCIÓN ATÓMICA TEST-AND-SET (TSL)</span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${lockFlag ? "bg-red-500/20 text-red-400" : "bg-emerald-500/20 text-emerald-400"}`}>
              {lockFlag ? "lock = 1" : "lock = 0"}
            </span>
          </div>

          <div className="bg-black/60 p-2 rounded border border-white/10 mb-2.5 text-[11px] leading-relaxed text-cyan-200">
            {log}
          </div>

          {/* Botones de disparo de instrucción en hardware */}
          <div className="grid grid-cols-2 gap-2 text-[10px] mb-2">
            <button
              onClick={executeTSLC0}
              className="px-2.5 py-1.5 bg-blue-600/30 hover:bg-blue-600/50 border border-blue-400/50 rounded text-blue-200 font-bold transition-colors"
            >
              Core 0: while(TestAndSet(&lock))
            </button>
            <button
              onClick={executeTSLC1}
              className="px-2.5 py-1.5 bg-orange-600/30 hover:bg-orange-600/50 border border-orange-400/50 rounded text-orange-200 font-bold transition-colors"
            >
              Core 1: while(TestAndSet(&lock))
            </button>
          </div>

          <div className="flex justify-between items-center text-[10px]">
            <button
              onClick={releaseLock}
              disabled={!lockFlag}
              className="px-3 py-1 bg-emerald-600/30 hover:bg-emerald-600/50 disabled:opacity-30 border border-emerald-400/50 rounded text-emerald-200 font-bold"
            >
              Liberar Candado [lock = 0]
            </button>
            <button onClick={resetAll} className="text-white/50 hover:text-white underline">
              Reiniciar Telemetría
            </button>
          </div>
        </div>
      </Html>
    </group>
  );
}
