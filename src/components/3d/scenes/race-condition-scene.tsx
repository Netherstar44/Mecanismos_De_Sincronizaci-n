import { useState, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Text, RoundedBox, OrbitControls } from "@react-three/drei";
import { Zap, Play, CheckCircle2, AlertTriangle } from "lucide-react";
import { ExplanationButton } from "@/components/ui/ExplanationButton";

export interface RaceConditionProps {
  counter?: number;
  isRunning?: boolean;
}

/**
 * RaceCondition3DScene — Componente puramente 3D (sin Drei Html transform).
 * No contiene elementos HTML proyectados que desfasen el cursor del mouse.
 */
export function RaceCondition3DScene({
  counter = 0,
  isRunning = false
}: RaceConditionProps) {
  return (
    <group position={[0, -0.2, 0]}>
      <ambientLight intensity={0.8} />
      <pointLight position={[0, 4, 3]} intensity={2.5} color="#00ffff" />

      <Text position={[0, 2.5, 0]} fontSize={0.14} color="#00ffff" anchorX="center" outlineWidth={0.005} outlineColor="#000">
        CONDICIÓN DE CARRERA VS EXCLUSIÓN MUTUA
      </Text>

      {/* Hilo 1 (Azul) */}
      <group position={[-1.6, 1.2, 0]}>
        <mesh>
          <sphereGeometry args={[0.38, 32, 32]} />
          <meshStandardMaterial color="#0284c7" metalness={0.7} roughness={0.2} />
        </mesh>
        <Text position={[0, 0, 0.42]} fontSize={0.11} color="#ffffff">HILO A (+1000)</Text>
      </group>

      {/* Hilo 2 (Naranja) */}
      <group position={[1.6, 1.2, 0]}>
        <mesh>
          <sphereGeometry args={[0.38, 32, 32]} />
          <meshStandardMaterial color="#ea580c" metalness={0.7} roughness={0.2} />
        </mesh>
        <Text position={[0, 0, 0.42]} fontSize={0.11} color="#ffffff">HILO B (+1000)</Text>
      </group>

      {/* Variable Compartida en Memoria */}
      <group position={[0, -0.2, 0]}>
        <RoundedBox args={[2.0, 1.1, 0.3]} radius={0.05}>
          <meshStandardMaterial color="#0b1329" metalness={0.9} roughness={0.1} />
        </RoundedBox>
        <Text position={[0, 0.28, 0.18]} fontSize={0.1} color="#94a3b8">
          VARIABLE COMPARTIDA: CONTADOR
        </Text>
        <Text position={[0, -0.12, 0.18]} fontSize={0.25} color={counter === 2000 ? "#00ff88" : (counter > 0 && !isRunning ? "#ff2d2d" : "#00d9ff")}>
          {counter}
        </Text>
      </group>
    </group>
  );
}

/**
 * RaceConditionApp — Aplicación Completa con Panel HTML Nativo
 * Los botones son elementos HTML DOM reales sin desfase de puntero ni matrices 3D CSS.
 */
export function RaceConditionApp() {
  const [counter, setCounter] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<"unsafe" | "safe">("unsafe");
  const [status, setStatus] = useState("Presiona 'Iniciar Carrera' para simular 2 hilos sumando 1000 iteraciones cada uno.");

  const runSimulation = () => {
    setIsRunning(true);
    setCounter(0);
    setStatus(mode === "unsafe" ? "Hilos ejecutándose sin sincronización (Condición de Carrera activa)..." : "Hilos ejecutándose con Exclusión Mutua protegida...");

    let val = 0;
    const interval = setInterval(() => {
      if (mode === "unsafe") {
        val += Math.floor(Math.random() * 45) + 20;
        if (val >= 1420) {
          clearInterval(interval);
          setCounter(1420);
          setIsRunning(false);
          setStatus("¡RESULTADO CORRUPTO! Valor final: 1420 (Esperado: 2000). 580 actualizaciones perdidas por carrera crítica.");
        } else {
          setCounter(val);
        }
      } else {
        val += 50;
        if (val >= 2000) {
          clearInterval(interval);
          setCounter(2000);
          setIsRunning(false);
          setStatus("¡ÉXITO ATÓMICO! Valor final: 2000 (Exacto). La exclusión mutua previno cualquier solapamiento.");
        } else {
          setCounter(val);
        }
      }
    }, 40);
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
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white tracking-tight">Condición de Carrera</h3>
                <p className="text-[11px] text-slate-400">Lecturas y Escrituras Concurrentes</p>
              </div>
            </div>

            <div className={`px-2.5 py-1 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 shadow-md ${
              mode === "safe"
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                : "bg-rose-500/20 text-rose-300 border border-rose-500/40"
            }`}>
              {mode === "safe" ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
              <span>{mode === "safe" ? "Con Mutex" : "Sin Lock"}</span>
            </div>
          </div>

          {/* Selector de Modo de Concurrencia */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Modo de Sincronización:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setMode("unsafe")}
                className={`py-2 px-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  mode === "unsafe"
                    ? "bg-rose-600/30 text-rose-300 border-rose-500/50 shadow-md"
                    : "bg-slate-800 text-slate-400 border-slate-700 hover:text-white"
                }`}
              >
                Sin Sincronizar
              </button>
              <button
                onClick={() => setMode("safe")}
                className={`py-2 px-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  mode === "safe"
                    ? "bg-emerald-600/30 text-emerald-300 border-emerald-500/50 shadow-md"
                    : "bg-slate-800 text-slate-400 border-slate-700 hover:text-white"
                }`}
              >
                Con Mutex
              </button>
            </div>
          </div>

          {/* Indicador de Variable Contador */}
          <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 text-center space-y-1">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider block">
              Valor del Contador Compartido:
            </span>
            <div className={`text-3xl font-bold font-mono ${counter === 2000 ? "text-emerald-400" : (counter > 0 && !isRunning ? "text-rose-400" : "text-cyan-400")}`}>
              {counter} <span className="text-xs font-normal text-slate-500">/ 2000</span>
            </div>
          </div>

          {/* Registro del Estado */}
          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-xs text-cyan-200 font-mono leading-relaxed shadow-inner">
            <span className="text-slate-400 block text-[10px] font-sans font-bold uppercase mb-1">
              Registro de Ejecución:
            </span>
            {status}
          </div>

          {/* Botón de Ejecución */}
          <button
            onClick={runSimulation}
            disabled={isRunning}
            className="w-full py-2.5 px-4 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-white rounded-xl font-medium text-xs flex items-center justify-center gap-2 transition-colors shadow-md cursor-pointer"
          >
            <Play className={`w-3.5 h-3.5 ${isRunning ? "animate-spin" : ""}`} />
            <span>{isRunning ? "Simulando Hilos en Paralelo..." : "Iniciar Carrera Concurrente"}</span>
          </button>
        </div>

        {/* Pie del Panel: Explicación */}
        <div className="pt-3 border-t border-slate-800">
          <ExplanationButton
            title="¿Qué representa cada elemento en la Carrera Crítica?"
            items={[
              { element: "Hilo A (Azul)", description: "Un hilo de ejecución que intenta sumar +1000 al contador compartido en memoria.", color: "#0284c7" },
              { element: "Hilo B (Naranja)", description: "Otro hilo que también intenta sumar +1000 al mismo contador. Ambos corren en paralelo.", color: "#ea580c" },
              { element: "Variable CONTADOR", description: "Posición de memoria compartida. Sin sincronización, las lecturas/escrituras se solapan y se pierden actualizaciones.", color: "#0b1329" },
              { element: "Modo Sin Sincronizar", description: "Condición de Carrera activa: ambos hilos leen el mismo valor antes de escribir, perdiendo incrementos (resultado < 2000).", color: "#ff2d2d" },
              { element: "Modo Con Mutex", description: "Exclusión Mutua protege la sección crítica: solo un hilo modifica el contador a la vez, resultado exacto = 2000.", color: "#00ff88" }
            ]}
          />
        </div>
      </aside>

      {/* ======================================================================= */}
      {/* CANVAS THREE.JS (Vista 3D Libre y sin Elementos HTML Desfasados)         */}
      {/* ======================================================================= */}
      <div className="flex-1 h-full relative">
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }} style={{ width: "100%", height: "100%" }}>
          <Suspense fallback={null}>
            <RaceCondition3DScene counter={counter} isRunning={isRunning} />
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
export function RaceConditionScene() {
  return <RaceCondition3DScene />;
}
