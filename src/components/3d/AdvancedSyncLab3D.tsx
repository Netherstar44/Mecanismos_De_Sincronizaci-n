import { useRef, useState, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text, RoundedBox, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { X, Cpu, Play, Pause, RotateCcw, AlertTriangle, ShieldCheck, Zap, ArrowRight, CheckCircle2, HelpCircle } from "lucide-react";
import { ExplanationButton } from "@/components/ui/ExplanationButton";

/**
 * AdvancedSyncLab3D — Laboratorio Técnico Didáctico e Intuitivo
 * 
 * Enfoque educativo:
 * Compara visualmente los dos mundos de la sincronización en Sistemas Operativos:
 * 1. Nivel Hardware (TSL): Los hilos no admitidos quedan quemando CPU en bucle (Espera Activa / Spinlock).
 * 2. Nivel Sistema Operativo (Semáforos): Los hilos no admitidos son dormidos por el Kernel (Sleep), ahorrando CPU.
 * 3. Interbloqueo (Deadlock): Bloqueo mutuo circular entre recursos con grafos visuales.
 */
export function AdvancedSyncLab3D({ onClose }: { onClose: () => void }) {
  const [mechanism, setMechanism] = useState<"tsl" | "semaphore" | "deadlock">("tsl");
  const [threadCount, setThreadCount] = useState(4);
  const [isRunning, setIsRunning] = useState(true);
  const [activeThread, setActiveThread] = useState<number | null>(0);
  const [wastedCycles, setWastedCycles] = useState(1280);
  const [savedCycles, setSavedCycles] = useState(6450);
  const [semaphoreS, setSemaphoreS] = useState(1);
  const [deadlockBroken, setDeadlockBroken] = useState(false);
  const [statusMessage, setStatusMessage] = useState(
    "Core 0 ejecuta Sección Crítica con la señal LOCK# activa. Los Cores 1, 2 y 3 queman ciclos en spinlock."
  );

  // Callback de animación por cuadro para acumular ciclos
  const onFrameTick = (delta: number) => {
    if (!isRunning) return;
    if (mechanism === "tsl") {
      setWastedCycles(prev => prev + Math.floor(delta * 40 * (threadCount - 1)));
    } else if (mechanism === "semaphore") {
      setSavedCycles(prev => prev + Math.floor(delta * 60 * threadCount));
    }
  };

  // Acciones específicas para TSL
  const handleTSLReleaseLock = () => {
    setActiveThread(null);
    setStatusMessage("lock = 0: Core actual liberó el candado. El bus de hardware queda disponible para el siguiente intento atómico.");
  };

  const handleTSLAcquireNext = () => {
    const next = activeThread === null ? 0 : (activeThread + 1) % threadCount;
    setActiveThread(next);
    setStatusMessage(`Core ${next} ejecutó atómicamente TSL(&lock): Retornó 0, fijó lock = 1 y activó la línea LOCK# del bus. Entra a Sección Crítica.`);
  };

  // Acciones específicas para Semáforos
  const handleSemaphoreWait = () => {
    const newS = semaphoreS - 1;
    setSemaphoreS(newS);
    if (newS >= 0) {
      setStatusMessage(`wait(S): S decrece a ${newS} (>= 0). Se concede acceso a la sección crítica sin suspender ningún hilo.`);
    } else {
      setStatusMessage(`wait(S): S decrece a ${newS} (< 0). El Kernel retira el proceso de la CPU y lo suspende en S.queue [Sleep], ahorrando 100% de CPU.`);
    }
  };

  const handleSemaphoreSignal = () => {
    const newS = semaphoreS + 1;
    setSemaphoreS(newS);
    if (newS <= 0) {
      setStatusMessage(`signal(S): S sube a ${newS} (<= 0). Había hilos suspendidos; el Kernel ejecuta wakeup() en el primer hilo de la cola y lo reanuda.`);
    } else {
      setStatusMessage(`signal(S): S sube a ${newS}. Recurso liberado y disponible en el pool general.`);
    }
  };

  // Acciones específicas para Deadlock
  const handleTriggerDeadlock = () => {
    setDeadlockBroken(false);
    setActiveThread(null);
    setStatusMessage("Deadlock Activo: Core 0 retiene R1 y espera R2. Core 1 retiene R2 y espera R1. Ninguno puede avanzar (Espera Circular de Coffman).");
  };

  const handleBreakDeadlock = () => {
    setDeadlockBroken(true);
    setStatusMessage("Deadlock Roto: El Sistema Operativo aplicó Desalojo Forzado (Preemption) de R2 sobre Core 1, permitiendo a Core 0 finalizar su ejecución.");
  };

  const handleReset = () => {
    setWastedCycles(0);
    setSavedCycles(0);
    setActiveThread(0);
    setSemaphoreS(1);
    setDeadlockBroken(false);
    setStatusMessage("Simulación reiniciada al estado de fábrica.");
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 flex flex-col font-sans text-slate-100 select-none backdrop-blur-xl">
      {/* ========================================================================= */}
      {/* CABECERA ELEGANTE (Limpia, con tipografía humana y no genérica)            */}
      {/* ========================================================================= */}
      <header className="h-16 border-b border-slate-800 px-6 flex items-center justify-between bg-slate-900/80 z-20">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-sm md:text-base text-white tracking-tight">
              Laboratorio Técnico de Arquitectura & Concurrencia
            </h1>
            <p className="text-xs text-slate-400">
              Instrucción Hardware Atómica (TSL) vs. Control por Kernel (Semáforos de Dijkstra)
            </p>
          </div>
        </div>

        {/* Pestañas de Selección con diseño moderno */}
        <div className="hidden md:flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
          <button
            onClick={() => { setMechanism("tsl"); setActiveThread(0); setStatusMessage("Modo TSL seleccionado: Inspección de espera activa a nivel microarquitectura."); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              mechanism === "tsl"
                ? "bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Test-and-Set (TSL)</span>
          </button>

          <button
            onClick={() => { setMechanism("semaphore"); setSemaphoreS(1); setStatusMessage("Modo Semáforos seleccionado: Inspección de primitivas del Kernel y colas Sleep/Wakeup."); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              mechanism === "semaphore"
                ? "bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Semáforos (Kernel Sleep)</span>
          </button>

          <button
            onClick={() => { setMechanism("deadlock"); handleTriggerDeadlock(); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              mechanism === "deadlock"
                ? "bg-rose-500 text-white font-bold shadow-md shadow-rose-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Interbloqueo (Deadlock)</span>
          </button>
        </div>

        {/* Botón Cerrar */}
        <button
          onClick={onClose}
          className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </header>

      {/* ========================================================================= */}
      {/* CUERPO PRINCIPAL (Canvas 3D + Paneles Explicativos)                        */}
      {/* ========================================================================= */}
      <div className="relative flex-1 w-full h-full overflow-hidden">
        {/* Panel Didáctico Lateral Izquierdo */}
        <aside className="absolute top-4 left-4 z-10 w-80 md:w-96 bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4 max-h-[calc(100vh-6rem)] overflow-y-auto">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Mecanismo Activo
              </span>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                mechanism === "tsl" ? "bg-amber-500/20 text-amber-400" : (mechanism === "semaphore" ? "bg-emerald-500/20 text-emerald-400" : "bg-rose-500/20 text-rose-400")
              }`}>
                {mechanism === "tsl" ? "Nivel Hardware" : (mechanism === "semaphore" ? "Nivel Software/Kernel" : "Fallo Crítico")}
              </span>
            </div>
            <h2 className="text-base font-bold text-white">
              {mechanism === "tsl" && "Instrucción Atómica TSL (Hardware)"}
              {mechanism === "semaphore" && "Semáforo Contador con Suspensión"}
              {mechanism === "deadlock" && "Grafo de Espera Circular (Coffman)"}
            </h2>
          </div>

          {/* Explicación didáctica clara y humana */}
          <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/60 text-xs leading-relaxed text-slate-300 space-y-2">
            <span className="font-semibold text-blue-400 block mb-0.5">Bitácora de Eventos:</span>
            <p className="text-slate-200">{statusMessage}</p>
          </div>

          {/* Métrica de Telemetría Comparativa */}
          <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
            <div className="flex justify-between items-center text-slate-400">
              <span>Hilos en ejecución:</span>
              <strong className="text-white">{threadCount}</strong>
            </div>

            {mechanism === "tsl" && (
              <div className="bg-amber-500/10 border border-amber-500/30 p-3 rounded-xl text-amber-300">
                <div className="flex items-center gap-1.5 font-bold mb-1">
                  <Zap className="w-3.5 h-3.5 text-amber-400" /> Ciclos de CPU Malgastados:
                </div>
                <div className="text-xl font-bold font-mono text-amber-400">
                  {wastedCycles.toLocaleString()} ops
                </div>
                <p className="text-[10px] text-amber-400/80 mt-1">
                  Quemados en bucle Spinlock <code className="bg-slate-950 px-1 py-0.5 rounded">while(TSL)</code> en los otros núcleos.
                </p>
              </div>
            )}

            {mechanism === "semaphore" && (
              <div className="bg-emerald-500/10 border border-emerald-500/30 p-3 rounded-xl text-emerald-300">
                <div className="flex items-center gap-1.5 font-bold mb-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Ciclos de CPU Ahorrados:
                </div>
                <div className="text-xl font-bold font-mono text-emerald-400">
                  +{savedCycles.toLocaleString()} ops
                </div>
                <p className="text-[10px] text-emerald-400/80 mt-1">
                  Hilos dormidos por el Kernel en lugar de quemar ciclos en bucles activos.
                </p>
              </div>
            )}

            {mechanism === "deadlock" && (
              <div className={`p-3 rounded-xl border text-xs ${
                deadlockBroken
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                  : "bg-rose-500/10 border-rose-500/30 text-rose-300"
              }`}>
                <div className="flex items-center gap-1.5 font-bold mb-1">
                  {deadlockBroken ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />}
                  <span>{deadlockBroken ? "Estado del Sistema: Normalizado" : "Estado del Sistema: Interbloqueado"}</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  {deadlockBroken
                    ? "El ciclo de espera se ha roto exitosamente. Uno de los hilos cedió su recurso y el sistema continúa operando."
                    : "Ambos hilos retienen un recurso y esperan el del otro. Ninguno puede continuar."}
                </p>
              </div>
            )}
          </div>

          {/* Botones de Control Específicos por Modo */}
          <div className="pt-2 border-t border-slate-800 space-y-2">
            {mechanism === "tsl" && (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleTSLAcquireNext}
                  className="py-2.5 px-3 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-md shadow-amber-900/30"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Ejecutar TSL</span>
                </button>
                <button
                  onClick={handleTSLReleaseLock}
                  className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Liberar (lock=0)</span>
                </button>
              </div>
            )}

            {mechanism === "semaphore" && (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleSemaphoreWait}
                  className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-md shadow-emerald-900/30"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>wait(S) [P]</span>
                </button>
                <button
                  onClick={handleSemaphoreSignal}
                  className="py-2.5 px-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-md shadow-blue-900/30"
                >
                  <span>signal(S) [V]</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {mechanism === "deadlock" && (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleTriggerDeadlock}
                  className="py-2.5 px-3 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-md shadow-rose-900/30"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Provocar Ciclo</span>
                </button>
                <button
                  onClick={handleBreakDeadlock}
                  className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-md shadow-emerald-900/30"
                >
                  <span>Romper Deadlock</span>
                </button>
              </div>
            )}

            {/* Controles generales (Pausar y Reiniciar) */}
            <div className="flex gap-2">
              <button
                onClick={() => setIsRunning(!isRunning)}
                className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isRunning ? "Pausar Telemetría" : "Reanudar"}</span>
              </button>
              <button
                onClick={handleReset}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl transition-colors cursor-pointer"
                title="Reiniciar Simulación"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Botón de Explicación Contextual según el Modo */}
            <div className="pt-2 border-t border-slate-800">
              {mechanism === "tsl" && (
                <ExplanationButton
                  title="¿Qué representa cada elemento? (Modo TSL)"
                  items={[
                    { element: "CORE 0-3 (Procesadores)", description: "Núcleos de CPU independientes. Solo uno puede estar en Sección Crítica; los demás ejecutan Spinlock.", color: "#065f46" },
                    { element: "Heat Spreader (Color del Chip)", description: "Verde = en Sección Crítica. Amarillo = Spinlock activo (quemando CPU). Gris = en espera.", color: "#34d399" },
                    { element: "Bus de Hardware (Línea Dorada)", description: "Canal físico con señal LOCK# activa: bloquea el acceso al bus durante la ejecución atómica de TSL.", color: "#f59e0b" },
                    { element: "Módulo RAM (DPRAM)", description: "Memoria de Doble Puerto donde reside la variable lock. Muestra lock=0 (libre) o lock=1 (ocupado).", color: "#1e293b" },
                    { element: "Ciclos Malgastados", description: "Contador de CPU desperdiciada por los cores que giran en while(TSL) sin poder entrar.", color: "#fbbf24" }
                  ]}
                />
              )}
              {mechanism === "semaphore" && (
                <ExplanationButton
                  title="¿Qué representa cada elemento? (Modo Semáforos)"
                  items={[
                    { element: "CORE 0-3 (Procesadores)", description: "Hilos gestionados por el Kernel. Los admitidos trabajan; los bloqueados duermen (Sleep) sin consumir CPU.", color: "#065f46" },
                    { element: "Heat Spreader Gris", description: "Hilo dormido (Sleep): el Kernel lo retiró de la CPU y lo puso en S.queue. Ahorra 100% de ciclos.", color: "#475569" },
                    { element: "Bus Azul (Kernel)", description: "El bus es gestionado por el Sistema Operativo. Las operaciones wait/signal son atómicas a nivel de Kernel.", color: "#3b82f6" },
                    { element: "KERNEL: COLA SLEEP", description: "Cola FIFO donde el SO almacena los hilos suspendidos. signal() despierta al primero de la cola.", color: "#60a5fa" },
                    { element: "Ciclos Ahorrados", description: "CPU que se salvó porque los hilos bloqueados duermen en vez de girar en bucle activo.", color: "#34d399" }
                  ]}
                />
              )}
              {mechanism === "deadlock" && (
                <ExplanationButton
                  title="¿Qué representa cada elemento? (Modo Deadlock)"
                  items={[
                    { element: "CORE 0 y CORE 1", description: "Dos procesos que retienen un recurso y solicitan el del otro. Ninguno puede avanzar.", color: "#881337" },
                    { element: "Recurso R1 (Azul)", description: "Recurso compartido #1 (ej. Impresora). Retenido por CORE 0 en estado de deadlock.", color: "#3b82f6" },
                    { element: "Recurso R2 (Violeta)", description: "Recurso compartido #2 (ej. Archivo). Retenido por CORE 1 en estado de deadlock.", color: "#8b5cf6" },
                    { element: "Cartel de Estado", description: "Indica si el sistema está en Espera Circular (Coffman) o si el deadlock fue roto por Desalojo Forzado.", color: "#f43f5e" },
                    { element: "Botón Romper Deadlock", description: "Simula la solución del SO: Desalojo Forzado (Preemption) de un recurso para romper el ciclo.", color: "#34d399" }
                  ]}
                />
              )}
            </div>
          </div>
        </aside>

        {/* ======================================================================= */}
        {/* CANVAS THREE.JS (Placa Base de Hardware con Cores, Bus y RAM)           */}
        {/* ======================================================================= */}
        <div className="w-full h-full">
          <Canvas
            camera={{ position: [0, 6.2, 8.5], fov: 42 }}
            style={{ width: "100%", height: "100%" }}
          >
            <Suspense fallback={null}>
              <LabMotherboardScene
                mechanism={mechanism}
                threadCount={threadCount}
                activeThread={activeThread}
                isRunning={isRunning}
                semaphoreS={semaphoreS}
                deadlockBroken={deadlockBroken}
                onFrameTick={onFrameTick}
              />
              <OrbitControls
                enablePan={true}
                maxPolarAngle={Math.PI / 2.1}
                minDistance={4}
                maxDistance={14}
                target={[0, 0, 0]}
              />
            </Suspense>
          </Canvas>
        </div>

        {/* Guía de navegación orbital inferior derecha */}
        <div className="absolute bottom-4 right-4 z-10 bg-slate-900/85 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-slate-800 text-[11px] text-slate-400 pointer-events-none shadow-lg">
          🖱️ Click + Arrastrar: Rotar modelo 3D | Rueda: Zoom
        </div>
      </div>
    </div>
  );
}

/**
 * LabMotherboardScene — Escena 3D interna de la placa madre y procesadores
 */
function LabMotherboardScene({
  mechanism,
  threadCount,
  activeThread,
  isRunning,
  semaphoreS,
  deadlockBroken,
  onFrameTick
}: {
  mechanism: "tsl" | "semaphore" | "deadlock";
  threadCount: number;
  activeThread: number | null;
  isRunning: boolean;
  semaphoreS: number;
  deadlockBroken: boolean;
  onFrameTick: (delta: number) => void;
}) {
  const busPulseRef = useRef<THREE.PointLight>(null);
  const busLineRef = useRef<THREE.MeshStandardMaterial>(null);

  useFrame((state, delta) => {
    onFrameTick(delta);

    // Pulso lumínico del bus de hardware
    if (busPulseRef.current) {
      const freq = mechanism === "tsl" ? 8 : 3;
      busPulseRef.current.intensity = 2.0 + Math.sin(state.clock.elapsedTime * freq) * 1.0;
    }
  });

  return (
    <group position={[0, -0.4, 0]}>
      {/* Iluminación clara de estudio de hardware */}
      <ambientLight intensity={1.2} color="#ffffff" />
      <directionalLight position={[6, 9, 6]} intensity={2.5} castShadow />
      <directionalLight position={[-6, 4, 3]} intensity={1.2} color="#e0f2fe" />

      {/* ========================================================================= */}
      {/* PLACA BASE (PCB DE SILICIO)                                               */}
      {/* ========================================================================= */}
      <RoundedBox args={[8.4, 0.18, 6.6]} radius={0.06} receiveShadow>
        <meshStandardMaterial color="#0f172a" roughness={0.4} metalness={0.7} />
      </RoundedBox>

      {/* ========================================================================= */}
      {/* LOS 4 NÚCLEOS DE CPU (CORE 0 AL CORE 3)                                    */}
      {/* ========================================================================= */}
      {[-2.5, -0.8, 0.8, 2.5].map((x, idx) => {
        // Lógica de estado para cada core según el mecanismo
        let isCoreActive = false;
        let isCoreSpinning = false;
        let isCoreSleeping = false;
        let isCoreDeadlocked = false;

        if (mechanism === "tsl") {
          isCoreActive = activeThread === idx;
          isCoreSpinning = !isCoreActive;
        } else if (mechanism === "semaphore") {
          isCoreActive = idx < semaphoreS;
          isCoreSleeping = idx >= semaphoreS;
        } else if (mechanism === "deadlock") {
          if (!deadlockBroken) {
            isCoreDeadlocked = idx === 0 || idx === 1;
          } else {
            isCoreActive = idx === 0;
            isCoreSleeping = idx === 1;
          }
        }

        return (
          <group key={idx} position={[x, 0.18, -1.8]}>
            {/* Socket / Chasis del procesador */}
            <RoundedBox args={[1.25, 0.18, 1.25]} radius={0.03} castShadow>
              <meshStandardMaterial
                color={
                  isCoreDeadlocked
                    ? "#881337"
                    : isCoreActive
                    ? "#065f46"
                    : isCoreSpinning
                    ? "#78350f"
                    : isCoreSleeping
                    ? "#1e293b"
                    : "#1e3a8a"
                }
                metalness={0.7}
                roughness={0.3}
              />
            </RoundedBox>

            {/* Heat Spreader plateado superior del chip */}
            <mesh position={[0, 0.1, 0]}>
              <boxGeometry args={[0.95, 0.05, 0.95]} />
              <meshStandardMaterial
                color={
                  isCoreDeadlocked
                    ? "#f43f5e"
                    : isCoreActive
                    ? "#34d399"
                    : isCoreSpinning
                    ? "#fbbf24"
                    : isCoreSleeping
                    ? "#475569"
                    : "#60a5fa"
                }
                metalness={0.9}
                roughness={0.2}
              />
            </mesh>

            {/* Rótulo del Núcleo */}
            <Text position={[0, 0.35, 0]} fontSize={0.16} color="#ffffff">
              {`CORE ${idx}`}
            </Text>

            {/* Estado del Núcleo */}
            <Text
              position={[0, -0.05, 0.72]}
              fontSize={0.11}
              color={
                isCoreDeadlocked
                  ? "#fca5a5"
                  : isCoreActive
                  ? "#34d399"
                  : isCoreSpinning
                  ? "#fbbf24"
                  : isCoreSleeping
                  ? "#94a3b8"
                  : "#60a5fa"
              }
              anchorX="center"
            >
              {isCoreDeadlocked
                ? "[ DEADLOCK: BLOQUEADO ]"
                : isCoreActive
                ? "[ SECCIÓN CRÍTICA ]"
                : isCoreSpinning
                ? "[ SPINLOCK while(TSL) ]"
                : isCoreSleeping
                ? "[ DORMIDO / SLEEP ]"
                : "[ EN ESPERA ]"}
            </Text>
          </group>
        );
      })}

      {/* ========================================================================= */}
      {/* MODO DEADLOCK: RECURSOS COMPARTIDOS R1 Y R2 CON GRAFO DE DEPENDENCIAS      */}
      {/* ========================================================================= */}
      {mechanism === "deadlock" && (
        <group position={[0, 0.25, -0.2]}>
          {/* Recurso R1 */}
          <group position={[-1.2, 0.2, 0]}>
            <RoundedBox args={[0.8, 0.3, 0.8]} radius={0.03} castShadow>
              <meshStandardMaterial color="#3b82f6" metalness={0.8} roughness={0.2} />
            </RoundedBox>
            <Text position={[0, 0.22, 0]} fontSize={0.14} color="#ffffff">
              R1 (Impresora)
            </Text>
            <Text position={[0, -0.22, 0.45]} fontSize={0.1} color="#93c5fd">
              {deadlockBroken ? "Asignado a: CORE 0" : "Retenido por: CORE 0"}
            </Text>
          </group>

          {/* Recurso R2 */}
          <group position={[1.2, 0.2, 0]}>
            <RoundedBox args={[0.8, 0.3, 0.8]} radius={0.03} castShadow>
              <meshStandardMaterial color="#8b5cf6" metalness={0.8} roughness={0.2} />
            </RoundedBox>
            <Text position={[0, 0.22, 0]} fontSize={0.14} color="#ffffff">
              R2 (Archivo)
            </Text>
            <Text position={[0, -0.22, 0.45]} fontSize={0.1} color="#c4b5fd">
              {deadlockBroken ? "Liberado por Desalojo" : "Retenido por: CORE 1"}
            </Text>
          </group>

          {/* Cartel 3D de Estado de Deadlock */}
          <Text
            position={[0, 0.75, 0]}
            fontSize={0.15}
            color={deadlockBroken ? "#34d399" : "#f43f5e"}
            anchorX="center"
          >
            {deadlockBroken
              ? "CICLO ROTO // EJECUCIÓN NORMALIZADA MEDIANTE DESALOJO"
              : "ESPERA CIRCULAR MUTUA // INTERBLOQUEO COFFMAN"}
          </Text>
        </group>
      )}

      {/* ========================================================================= */}
      {/* BUS DE MEMORIA CENTRAL CON SEÑAL LOCK#                                    */}
      {/* ========================================================================= */}
      {mechanism !== "deadlock" && (
        <group position={[0, 0.12, 0]}>
          {/* Pista del bus en el circuito */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[7.0, 0.04, 0.35]} />
            <meshStandardMaterial
              ref={busLineRef as any}
              color={mechanism === "tsl" ? "#f59e0b" : "#3b82f6"}
              emissive={mechanism === "tsl" ? "#f59e0b" : "#2563eb"}
              emissiveIntensity={0.8}
            />
          </mesh>
          <pointLight
            ref={busPulseRef as any}
            position={[0, 0.4, 0]}
            color={mechanism === "tsl" ? "#f59e0b" : "#3b82f6"}
            distance={5}
          />

          {/* Rótulo del Bus */}
          <Text position={[0, 0.28, 0]} fontSize={0.13} color="#ffffff">
            {mechanism === "tsl"
              ? "BUS DE HARDWARE // SEÑAL LOCK# ACTIVA (Bus Bloqueado Atómicamente)"
              : "BUS DE DATOS COMPARTIDO // GESTIONADO POR EL KERNEL"}
          </Text>
        </group>
      )}

      {/* ========================================================================= */}
      {/* MÓDULO DE MEMORIA RAM COMPARTIDA (DPRAM)                                  */}
      {/* ========================================================================= */}
      <group position={[-1.9, 0.32, 1.8]}>
        <RoundedBox args={[2.3, 0.36, 1.2]} radius={0.04} castShadow>
          <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.3} />
        </RoundedBox>

        {/* Pantalla del registro de memoria */}
        <mesh position={[0, 0.19, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[2.0, 0.8]} />
          <meshBasicMaterial color="#020617" />
        </mesh>

        <Text position={[0, 0.21, -0.15]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.13} color="#94a3b8">
          MEMORIA RAM (DPRAM)
        </Text>

        <Text
          position={[0, 0.21, 0.15]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.2}
          color={mechanism === "tsl" ? (activeThread !== null ? "#fbbf24" : "#34d399") : "#34d399"}
        >
          {mechanism === "tsl"
            ? (activeThread !== null ? "lock = 1 [OCUPADO]" : "lock = 0 [LIBRE]")
            : `S.value = ${semaphoreS}`}
        </Text>
      </group>

      {/* ========================================================================= */}
      {/* BANDEJA DEL KERNEL: COLA DE SUSPENSIÓN (SLEEP QUEUE)                      */}
      {/* ========================================================================= */}
      <group position={[1.9, 0.32, 1.8]}>
        <RoundedBox args={[2.3, 0.36, 1.2]} radius={0.04} castShadow>
          <meshStandardMaterial color="#0f172a" metalness={0.5} roughness={0.5} />
        </RoundedBox>

        <mesh position={[0, 0.19, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[2.0, 0.8]} />
          <meshBasicMaterial color="#020617" />
        </mesh>

        <Text position={[0, 0.21, -0.15]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.13} color="#60a5fa">
          KERNEL: COLA SLEEP
        </Text>

        <Text position={[0, 0.21, 0.15]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.16} color="#e2e8f0">
          {mechanism === "semaphore"
            ? (semaphoreS < 0 ? `${Math.abs(semaphoreS)} Hilo(s) Suspendidos` : "0 Hilos en Espera")
            : (mechanism === "tsl" ? "Sin uso (Spinlocks en CPU)" : (deadlockBroken ? "1 Hilo Desalojado" : "Bloqueo Mutuo"))}
        </Text>
      </group>
    </group>
  );
}
