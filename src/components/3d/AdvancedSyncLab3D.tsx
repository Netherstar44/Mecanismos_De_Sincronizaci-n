import { useRef, useState, Suspense, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text, RoundedBox, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { X, Cpu, Activity, Play, Pause, RotateCcw, AlertTriangle, ShieldCheck } from "lucide-react";

/**
 * AdvancedSyncLab3D — Simulador Técnico Avanzado 3D de Sistemas Operativos
 * 
 * Plataforma Técnica Dual:
 * - Plano Inferior: Arquitectura de Silicio / Hardware (Buses, DPRAM, Señal LOCK#, 4 Cores CPU).
 * - Plano Superior: Microkernel del Sistema Operativo (Planificador de Hilos, Semáforos, Sleep Queue).
 */
export function AdvancedSyncLab3D({ onClose }: { onClose: () => void }) {
  const [mechanism, setMechanism] = useState<"tsl" | "semaphore" | "deadlock">("tsl");
  const [threadCount, setThreadCount] = useState(4);
  const [isRunning, setIsRunning] = useState(true);
  const [wastedCycles, setWastedCycles] = useState(1420);
  const [savedCycles, setSavedCycles] = useState(8940);
  const [activeThreadInCS, setActiveThreadInCS] = useState<number | null>(0);
  const [sleepingThreads, setSleepingThreads] = useState<number[]>([1, 2, 3]);
  const [semaphoreValue, setSemaphoreValue] = useState(0);

  // Callback para actualizar telemetría desde el Canvas (cada frame)
  const onFrameTick = (delta: number) => {
    if (!isRunning) return;
    if (mechanism === "tsl") {
      setWastedCycles(prev => prev + Math.floor(delta * 60 * (threadCount - 1)));
    } else if (mechanism === "semaphore") {
      setSavedCycles(prev => prev + Math.floor(delta * 80 * threadCount));
    }
  };

  const handleStepAction = () => {
    if (mechanism === "tsl") {
      const nextThread = activeThreadInCS !== null ? (activeThreadInCS + 1) % threadCount : 0;
      setActiveThreadInCS(nextThread);
    } else if (mechanism === "semaphore") {
      if (semaphoreValue > 0) {
        setSemaphoreValue(prev => prev - 1);
      } else {
        setSemaphoreValue(3);
        setSleepingThreads([1, 2]);
      }
    }
  };

  const handleReset = () => {
    setWastedCycles(0);
    setSavedCycles(0);
    setActiveThreadInCS(0);
    setSemaphoreValue(mechanism === "semaphore" ? 2 : 0);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#03060c]/95 flex flex-col font-mono text-white select-none">
      {/* Barra de Herramientas Superior del Laboratorio */}
      <header className="h-16 border-b border-[#00ffff]/20 px-6 flex items-center justify-between bg-black/60 backdrop-blur-md z-20">
        <div className="flex items-center gap-3">
          <Cpu className="w-6 h-6 text-[#00ffff] animate-pulse" />
          <div>
            <h1 className="font-bold text-sm md:text-base tracking-wider text-white">
              LABORATORIO TÉCNICO // HARDWARE BUS & KERNEL SYNC SANDBOX
            </h1>
            <p className="text-[10px] text-[#00ffff]/70">
              SIMULADOR DE ALTO RENDIMIENTO // DOUBLE-LAYER CO-DESIGN ARCHITECTURE
            </p>
          </div>
        </div>

        {/* Selector de Mecanismo de Sincronización */}
        <div className="hidden md:flex items-center gap-2 bg-[#09101f] p-1 rounded-lg border border-[#00ffff]/30">
          <button
            onClick={() => { setMechanism("tsl"); setSleepingThreads([]); setActiveThreadInCS(0); }}
            className={`px-3 py-1 text-xs rounded transition-colors cursor-pointer ${mechanism === "tsl" ? "bg-[#00ffff] text-black font-bold" : "text-white/70 hover:text-white"}`}
          >
            Test-and-Set Lock (Hardware)
          </button>
          <button
            onClick={() => { setMechanism("semaphore"); setSemaphoreValue(2); setSleepingThreads([2, 3]); }}
            className={`px-3 py-1 text-xs rounded transition-colors cursor-pointer ${mechanism === "semaphore" ? "bg-[#00ff88] text-black font-bold" : "text-white/70 hover:text-white"}`}
          >
            Semáforos (Kernel / Sleep)
          </button>
          <button
            onClick={() => { setMechanism("deadlock"); setActiveThreadInCS(null); setSleepingThreads([0, 1, 2, 3]); }}
            className={`px-3 py-1 text-xs rounded transition-colors cursor-pointer ${mechanism === "deadlock" ? "bg-[#ff2d2d] text-white font-bold" : "text-white/70 hover:text-white"}`}
          >
            Interbloqueo (Deadlock)
          </button>
        </div>

        {/* Botón de Cierre */}
        <button
          onClick={onClose}
          className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors border border-white/20 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </header>

      {/* Área Principal de Renderizado 3D y Telemetría */}
      <div className="relative flex-1 w-full h-full overflow-hidden">
        {/* Controles y Telemetría Lateral Izquierda */}
        <aside className="absolute top-4 left-4 z-10 w-72 bg-[#050b14]/90 backdrop-blur-xl border border-[#00ffff]/30 rounded-xl p-4 shadow-[0_0_30px_rgba(0,0,0,0.8)] space-y-4">
          <div className="border-b border-[#00ffff]/20 pb-2">
            <h2 className="text-xs font-bold text-[#00ffff] uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4" /> Telemetría en Vivo
            </h2>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-white/60">Hilos Concurrentes:</span>
              <span className="text-[#00ffff] font-bold">{threadCount}</span>
            </div>
            <input
              type="range"
              min="2"
              max="8"
              value={threadCount}
              onChange={(e) => setThreadCount(parseInt(e.target.value))}
              className="w-full accent-[#00ffff] h-1.5 bg-white/10 rounded-full appearance-none"
            />

            <div className="pt-2 border-t border-white/10 space-y-2">
              <div className="flex justify-between">
                <span className="text-white/60">En Sección Crítica:</span>
                <span className="text-emerald-400 font-bold">{activeThreadInCS !== null ? `Hilo #${activeThreadInCS}` : "Ninguno"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Hilos en Cola / Spinlock:</span>
                <span className="text-amber-400 font-bold">{threadCount - (activeThreadInCS !== null ? 1 : 0)}</span>
              </div>

              {mechanism === "tsl" && (
                <div className="bg-red-500/10 p-2 rounded border border-red-500/30 text-[11px] text-red-300">
                  <div className="flex items-center gap-1.5 font-bold mb-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> Espera Activa (Spinlock)
                  </div>
                  <p>Ciclos de CPU y bus gastados:</p>
                  <p className="text-base font-bold text-red-400 font-mono">{wastedCycles.toLocaleString()} ops</p>
                </div>
              )}

              {mechanism === "semaphore" && (
                <div className="bg-emerald-500/10 p-2 rounded border border-emerald-500/30 text-[11px] text-emerald-300">
                  <div className="flex items-center gap-1.5 font-bold mb-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Suspensión de Procesos
                  </div>
                  <p>Ciclos de CPU ahorrados (Sleep):</p>
                  <p className="text-base font-bold text-emerald-400 font-mono">+{savedCycles.toLocaleString()} ops</p>
                </div>
              )}

              {mechanism === "deadlock" && (
                <div className="bg-red-600/15 p-2 rounded border border-red-600/40 text-[11px] text-red-200">
                  <div className="flex items-center gap-1.5 font-bold mb-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> ⚠ DEADLOCK DETECTADO
                  </div>
                  <p>Todos los hilos están bloqueados esperando un recurso circular. Ningún progreso posible.</p>
                </div>
              )}
            </div>
          </div>

          {/* Botones de Control de la Simulación */}
          <div className="pt-2 border-t border-white/10 flex gap-2">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className="flex-1 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded text-xs flex items-center justify-center gap-1 font-bold cursor-pointer"
            >
              {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              {isRunning ? "Pausar" : "Reanudar"}
            </button>
            <button
              onClick={handleStepAction}
              className="flex-1 py-1.5 bg-[#00ffff]/20 hover:bg-[#00ffff]/30 border border-[#00ffff]/40 rounded text-xs text-[#00ffff] font-bold cursor-pointer"
            >
              Paso
            </button>
            <button
              onClick={handleReset}
              className="p-1.5 bg-white/10 hover:bg-white/20 rounded text-white cursor-pointer"
              title="Reiniciar"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </aside>

        {/* Canvas Three.js a Pantalla Completa */}
        <div className="w-full h-full">
          <Canvas 
            camera={{ position: [0, 5, 9], fov: 45 }}
            style={{ width: "100%", height: "100%" }}
          >
            <Suspense fallback={null}>
              <LabSceneInner
                mechanism={mechanism}
                threadCount={threadCount}
                activeThreadInCS={activeThreadInCS}
                isRunning={isRunning}
                onFrameTick={onFrameTick}
              />
            </Suspense>
          </Canvas>
        </div>

        {/* Guía de Controles de Cámara Inferior */}
        <div className="absolute bottom-4 right-4 z-10 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-[10px] text-white/50">
          Click Izquierdo + Arrastrar: Rotar Cámara 3D | Rueda: Zoom
        </div>
      </div>
    </div>
  );
}

/**
 * LabSceneInner — Componente interno del Canvas donde sí es válido usar useFrame.
 * Renderiza la escena 3D dual (hardware + microkernel).
 */
function LabSceneInner({
  mechanism,
  threadCount,
  activeThreadInCS,
  isRunning,
  onFrameTick,
}: {
  mechanism: "tsl" | "semaphore" | "deadlock";
  threadCount: number;
  activeThreadInCS: number | null;
  isRunning: boolean;
  onFrameTick: (delta: number) => void;
}) {
  const busLightRef = useRef<THREE.PointLight>(null);

  useFrame((state, delta) => {
    // Pulso de bus de hardware
    if (busLightRef.current) {
      busLightRef.current.intensity = 1.5 + Math.sin(state.clock.elapsedTime * 8) * 0.8;
    }
    // Despachar telemetría al componente padre
    onFrameTick(delta);
  });

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 15, 10]} intensity={1.5} />
      <pointLight ref={busLightRef} position={[0, -0.5, 0]} color={mechanism === "deadlock" ? "#ff2d2d" : "#00ffff"} distance={15} />

      <OrbitControls enablePan={true} maxPolarAngle={Math.PI / 2.05} minDistance={4} maxDistance={18} />

      {/* Grid de Fondo */}
      <gridHelper args={[20, 20, "#00ffff", "#0a2233"]} position={[0, -2.5, 0]} />

      {/* ========================================== */}
      {/* PLANO INFERIOR: HARDWARE / SILICIO (TSL)    */}
      {/* ========================================== */}
      <group position={[0, -1.8, 0]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[11, 0.2, 7]} />
          <meshStandardMaterial color="#081424" roughness={0.3} metalness={0.8} />
        </mesh>
        <Text position={[-4.5, 0.15, -2.8]} fontSize={0.2} color="#00ffff" anchorX="left">
          NIVEL 1: SILICIO / HARDWARE BUS & DPRAM
        </Text>

        {/* Bus de Datos Compartido con Señal Atómica LOCK# */}
        <mesh position={[0, 0.15, 0]}>
          <boxGeometry args={[9, 0.08, 0.6]} />
          <meshBasicMaterial color={mechanism === "tsl" ? "#ffaa00" : "#00ff88"} />
        </mesh>
        <Text position={[0, 0.25, 0]} fontSize={0.14} color="#000000" anchorX="center">
          SHARED BUS: HARDWARE LOCK# LINE
        </Text>

        {/* Celda Central de Bandera Atómica (target / lock) */}
        <group position={[0, 0.4, -1.8]}>
          <RoundedBox args={[1.8, 0.6, 1.2]} radius={0.05}>
            <meshStandardMaterial color="#030814" roughness={0.1} metalness={0.9} />
          </RoundedBox>
          <Text position={[0, 0.12, 0.61]} fontSize={0.12} color="#38bdf8">
            DPRAM FLAG
          </Text>
          <Text position={[0, -0.12, 0.61]} fontSize={0.16} color={activeThreadInCS !== null ? "#ff2d2d" : "#00ff88"}>
            {activeThreadInCS !== null ? "lock = TRUE" : "lock = FALSE"}
          </Text>
        </group>

        {/* Núcleos CPU Físicos (Core 0 a Core N) */}
        {Array.from({ length: Math.min(threadCount, 4) }).map((_, i) => (
          <group key={i} position={[-3.3 + i * 2.2, 0.3, 1.8]}>
            <RoundedBox args={[1.6, 0.4, 1.2]} radius={0.04}>
              <meshStandardMaterial color={activeThreadInCS === i ? "#0284c7" : "#0f172a"} metalness={0.8} roughness={0.2} />
            </RoundedBox>
            <Text position={[0, 0.08, 0.61]} fontSize={0.12} color="#ffffff">
              {`CPU CORE ${i}`}
            </Text>
            <Text position={[0, -0.08, 0.61]} fontSize={0.09} color={activeThreadInCS === i ? "#38bdf8" : "#64748b"}>
              {activeThreadInCS === i ? "EJECUTANDO CRÍTICA" : (mechanism === "tsl" ? "SPINLOCK" : mechanism === "deadlock" ? "BLOQUEADO" : "IDLE")}
            </Text>
          </group>
        ))}
      </group>

      {/* Columnas Conectoras entre Hardware y Microkernel */}
      {[-4.5, 4.5].map((x, i) => (
        <mesh key={i} position={[x, 0.2, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 3.8]} />
          <meshStandardMaterial color="#00ffff" roughness={0.2} metalness={0.9} />
        </mesh>
      ))}

      {/* ========================================== */}
      {/* PLANO SUPERIOR: MICROKERNEL / SOFTWARE    */}
      {/* ========================================== */}
      <group position={[0, 1.8, 0]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[11, 0.2, 7]} />
          <meshStandardMaterial color="#0b1728" roughness={0.4} metalness={0.6} transparent opacity={0.85} />
        </mesh>
        <Text position={[-4.5, 0.15, -2.8]} fontSize={0.2} color="#00ff88" anchorX="left">
          NIVEL 2: MICROKERNEL / PLANIFICADOR & SEMÁFOROS
        </Text>

        {/* Semáforo Central */}
        <group position={[0, 0.6, -0.5]}>
          <mesh>
            <cylinderGeometry args={[0.8, 0.8, 0.8, 32]} />
            <meshStandardMaterial color="#10b981" metalness={0.8} roughness={0.2} />
          </mesh>
          <Text position={[0, 0.15, 0.85]} fontSize={0.16} color="#ffffff">
            SEMAPHORE S
          </Text>
          <Text position={[0, -0.15, 0.85]} fontSize={0.25} color="#000000">
            {mechanism === "semaphore" ? "S = 2" : mechanism === "deadlock" ? "MUTEX LOCKED" : "MUTEX = 1"}
          </Text>
        </group>

        {/* Cola de Hilos Bloqueados (Sleep Queue) */}
        <group position={[-3.2, 0.4, 0.8]}>
          <Text position={[0, 0.5, 0]} fontSize={0.14} color="#f87171">
            SLEEP QUEUE (S.queue)
          </Text>
          {Array.from({ length: Math.max(0, threadCount - 1) }).map((_, i) => (
            <mesh key={i} position={[i * 0.7 - 0.7, 0, 0]}>
              <capsuleGeometry args={[0.18, 0.35, 8, 16]} />
              <meshStandardMaterial color={mechanism === "deadlock" ? "#991b1b" : "#ef4444"} roughness={0.5} opacity={0.7} transparent />
            </mesh>
          ))}
        </group>

        {/* Hilo Activo en Sección Crítica */}
        <group position={[3.2, 0.4, 0.8]}>
          <Text position={[0, 0.5, 0]} fontSize={0.14} color="#34d399">
            {mechanism === "deadlock" ? "NINGUNO EJECUTANDO" : "RUNNING IN CS"}
          </Text>
          {activeThreadInCS !== null && (
            <mesh position={[0, 0, 0]}>
              <capsuleGeometry args={[0.22, 0.5, 8, 16]} />
              <meshStandardMaterial color="#10b981" roughness={0.2} metalness={0.5} />
            </mesh>
          )}
        </group>

        {/* Deadlock: Flechas circulares de espera */}
        {mechanism === "deadlock" && (
          <group position={[0, 0.8, 1.5]}>
            <Text position={[0, 0, 0]} fontSize={0.18} color="#ff4444" anchorX="center">
              ⚠ ESPERA CIRCULAR DETECTADA: T0→R1→T1→R0→T0
            </Text>
          </group>
        )}
      </group>
    </>
  );
}
