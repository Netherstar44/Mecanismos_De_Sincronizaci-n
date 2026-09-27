import { useState, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Text, RoundedBox, OrbitControls } from "@react-three/drei";
import { Cpu, RotateCcw, CheckCircle2, ShieldAlert, Zap } from "lucide-react";
import { ExplanationButton } from "@/components/ui/ExplanationButton";

export interface TSLState {
  lockFlag: boolean;
  activeCore: number | null;
  busLocked: boolean;
  core0Cycles: number;
  core1Cycles: number;
}

/**
 * TSL3DScene — Componente puramente 3D (sin Drei Html transform).
 * No contiene elementos HTML proyectados que desfasen el cursor del mouse.
 */
export function TSL3DScene({
  lockFlag = false,
  activeCore = null,
  busLocked = false,
  core0Cycles = 0,
  core1Cycles = 0
}: Partial<TSLState>) {
  return (
    <group position={[0, -0.2, 0]}>
      {/* Iluminación */}
      <ambientLight intensity={0.8} />
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
    </group>
  );
}

/**
 * TSLHardwareApp — Aplicación Completa con Panel HTML Nativo
 * Los botones son elementos HTML DOM reales sin desfase de puntero ni matrices 3D CSS.
 */
export function TSLHardwareApp() {
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
        setLockFlag(true);
        setBusLocked(false);
        setLog("CORE 0 ejecutó TSL: leyó 0, escribió 1 atómicamente. Adquiere Sección Crítica.");
      } else {
        setCore0Cycles(prev => prev + 1);
        setBusLocked(false);
        setLog(`CORE 0 ejecutó TSL: leyó 1. Candado ocupado. Ciclo de espera activa # ${core0Cycles + 1}.`);
      }
    }, 350);
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
    }, 350);
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
    <div className="w-full h-full flex flex-col md:flex-row bg-slate-950 text-slate-100 select-none overflow-hidden font-sans">
      {/* ======================================================================= */}
      {/* PANEL DE CONTROL NATIVO (100% Precisión de Clic, Cero Desfase)          */}
      {/* ======================================================================= */}
      <aside className="w-full md:w-80 lg:w-96 bg-slate-900/95 border-r border-slate-800 p-5 flex flex-col justify-between overflow-y-auto z-10 space-y-4 shrink-0">
        <div className="space-y-4">
          {/* Cabecera del Panel */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Cpu className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white tracking-tight">Hardware TSL & DPRAM</h3>
                <p className="text-[11px] text-slate-400">Atomicidad a Nivel de Bus</p>
              </div>
            </div>

            {/* Badge de Estado del Candado */}
            <div className={`px-2.5 py-1 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 shadow-md ${
              lockFlag
                ? "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
            }`}>
              {lockFlag ? <ShieldAlert className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
              <span>lock = {lockFlag ? "1" : "0"}</span>
            </div>
          </div>

          {/* Telemetría del Bus de Hardware */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/50">
              <span className="text-slate-400 block text-[11px]">Señal del Bus:</span>
              <span className={`text-xs font-bold font-mono ${busLocked ? "text-rose-400 animate-pulse" : "text-emerald-400"}`}>
                {busLocked ? "LOCK# (Activo)" : "IDLE (Libre)"}
              </span>
            </div>
            <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/50">
              <span className="text-slate-400 block text-[11px]">Core Activo:</span>
              <span className="text-xs font-bold text-white font-mono">
                {activeCore !== null ? `CORE ${activeCore}` : "Ninguno"}
              </span>
            </div>
          </div>

          {/* Contador de Ciclos Malgastados (Spinlock) */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-slate-950/80 p-2.5 rounded-xl border border-blue-500/30">
              <span className="text-blue-400 block text-[11px]">CORE 0 Spin:</span>
              <span className="text-base font-bold text-white font-mono">{core0Cycles} ciclos</span>
            </div>
            <div className="bg-slate-950/80 p-2.5 rounded-xl border border-orange-500/30">
              <span className="text-orange-400 block text-[11px]">CORE 1 Spin:</span>
              <span className="text-base font-bold text-white font-mono">{core1Cycles} ciclos</span>
            </div>
          </div>

          {/* Bitácora de Hardware */}
          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-xs text-cyan-200 font-mono leading-relaxed shadow-inner">
            <span className="text-slate-400 block text-[10px] font-sans font-bold uppercase mb-1">
              Registro del Bus:
            </span>
            {log}
          </div>

          {/* Botones de Disparo de Instrucción TSL */}
          <div className="space-y-2">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Disparar Instrucción Atómica:
            </div>
            <div className="grid grid-cols-1 gap-2">
              <button
                onClick={executeTSLC0}
                className="w-full py-2.5 px-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium text-xs flex items-center justify-between transition-colors shadow-md cursor-pointer"
              >
                <span>Core 0 ejecuta TSL</span>
                <span className="text-[10px] font-mono opacity-80">while(TSL(&lock))</span>
              </button>

              <button
                onClick={executeTSLC1}
                className="w-full py-2.5 px-3 bg-orange-600 hover:bg-orange-500 text-white rounded-xl font-medium text-xs flex items-center justify-between transition-colors shadow-md cursor-pointer"
              >
                <span>Core 1 ejecuta TSL</span>
                <span className="text-[10px] font-mono opacity-80">while(TSL(&lock))</span>
              </button>

              <button
                onClick={releaseLock}
                disabled={!lockFlag}
                className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-30 disabled:hover:bg-emerald-600 text-white rounded-xl font-medium text-xs flex items-center justify-between transition-colors shadow-md cursor-pointer"
              >
                <span>Liberar Candado</span>
                <span className="text-[10px] font-mono opacity-80">[lock = 0]</span>
              </button>
            </div>
          </div>
        </div>

        {/* Pie del Panel: Explicación y Reset */}
        <div className="pt-3 border-t border-slate-800">
          <div className="flex items-center justify-between gap-2">
            <ExplanationButton
              title="¿Qué representa cada elemento en Hardware TSL?"
              items={[
                { element: "CPU CORE 0 / CORE 1", description: "Representan dos núcleos de un procesador multiprocesador. Cada uno ejecuta la instrucción TSL de forma independiente.", color: "#0284c7" },
                { element: "Placa Madre (PCB)", description: "El circuito principal que conecta todos los componentes de hardware: CPUs, bus de datos y memoria.", color: "#061826" },
                { element: "Bus de Hardware (Línea)", description: "Canal físico de comunicación. La señal LOCK# bloquea el bus durante la ejecución atómica de TSL.", color: "#00ff88" },
                { element: "Memoria DPRAM (TARGET)", description: "Memoria de Doble Puerto donde reside la variable 'lock'. Dos procesadores pueden acceder pero TSL serializa.", color: "#0b1329" },
                { element: "Variable lock (0/1)", description: "La cerradura booleana compartida. 0 = libre (nadie en sección crítica). 1 = ocupado (un core ejecutando).", color: "#ff2d2d" },
                { element: "Spin Cycles", description: "Contador de ciclos de CPU desperdiciados en espera activa (Spinlock): el core quema CPU repitiendo while(TSL).", color: "#38bdf8" }
              ]}
            />

            <button
              onClick={resetAll}
              className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
              title="Reiniciar Simulación"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reiniciar</span>
            </button>
          </div>
        </div>
      </aside>

      {/* ======================================================================= */}
      {/* CANVAS THREE.JS (Vista 3D Libre y sin Elementos HTML Desfasados)         */}
      {/* ======================================================================= */}
      <div className="flex-1 h-full relative">
        <Canvas camera={{ position: [0, 4, 6], fov: 45 }} style={{ width: "100%", height: "100%" }}>
          <Suspense fallback={null}>
            <TSL3DScene
              lockFlag={lockFlag}
              activeCore={activeCore}
              busLocked={busLocked}
              core0Cycles={core0Cycles}
              core1Cycles={core1Cycles}
            />
            <OrbitControls
              enablePan={true}
              maxPolarAngle={Math.PI / 2.05}
              minDistance={3}
              maxDistance={10}
              target={[0, 0.4, 0]}
            />
          </Suspense>
        </Canvas>

        {/* Tip de Navegación 3D Flotante */}
        <div className="absolute bottom-3 right-3 text-[11px] bg-slate-900/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-slate-400 pointer-events-none shadow-lg">
          🖱️ Click y arrastrar: Rotar cámara 3D | Rueda: Zoom
        </div>
      </div>
    </div>
  );
}

/**
 * Exportación para compatibilidad directa con las estanterías de libros 3D
 */
export function TSLHardwareScene() {
  return <TSL3DScene />;
}
