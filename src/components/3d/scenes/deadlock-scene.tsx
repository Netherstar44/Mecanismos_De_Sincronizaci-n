import { useState, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Text, RoundedBox, OrbitControls } from "@react-three/drei";
import { AlertOctagon, RotateCcw, ShieldAlert, CheckCircle2 } from "lucide-react";
import { ExplanationButton } from "@/components/ui/ExplanationButton";

export interface DeadlockProps {
  step?: number;
  deadlockTriggered?: boolean;
}

/**
 * Deadlock3DScene — Componente puramente 3D (sin Drei Html transform).
 * No contiene elementos HTML proyectados que desfasen el cursor del mouse.
 */
export function Deadlock3DScene({
  step = 0,
  deadlockTriggered = false
}: DeadlockProps) {
  return (
    <group position={[0, -0.2, 0]}>
      <ambientLight intensity={0.8} />
      <pointLight position={[0, 4, 3]} intensity={2} color={deadlockTriggered ? "#ff2d2d" : "#00ffff"} />

      <Text position={[0, 2.5, 0]} fontSize={0.14} color="#00ffff" anchorX="center" outlineWidth={0.005} outlineColor="#000">
        GRAFO DE ASIGNACIÓN DE RECURSOS (RAG) // DEADLOCK
      </Text>

      {/* Proceso P1 */}
      <group position={[-1.8, 1.0, 0]}>
        <mesh>
          <sphereGeometry args={[0.45, 32, 32]} />
          <meshStandardMaterial color="#0284c7" metalness={0.6} roughness={0.3} />
        </mesh>
        <Text position={[0, 0, 0.48]} fontSize={0.12} color="#ffffff">P1</Text>
        <Text position={[0, -0.65, 0]} fontSize={0.09} color="#38bdf8">
          {step >= 3 ? "BLOQUEADO EN R2" : (step >= 1 ? "RETENIENDO R1" : "LISTO")}
        </Text>
      </group>

      {/* Proceso P2 */}
      <group position={[1.8, 1.0, 0]}>
        <mesh>
          <sphereGeometry args={[0.45, 32, 32]} />
          <meshStandardMaterial color="#ea580c" metalness={0.6} roughness={0.3} />
        </mesh>
        <Text position={[0, 0, 0.48]} fontSize={0.12} color="#ffffff">P2</Text>
        <Text position={[0, -0.65, 0]} fontSize={0.09} color="#fb923c">
          {step >= 3 ? "BLOQUEADO EN R1" : (step >= 2 ? "RETENIENDO R2" : "LISTO")}
        </Text>
      </group>

      {/* Recurso R1 */}
      <group position={[-1.8, -0.8, 0]}>
        <RoundedBox args={[0.8, 0.8, 0.8]} radius={0.05}>
          <meshStandardMaterial color="#10b981" metalness={0.8} roughness={0.2} />
        </RoundedBox>
        <Text position={[0, 0, 0.45]} fontSize={0.12} color="#ffffff">R1</Text>
        <Text position={[0, -0.6, 0]} fontSize={0.09} color="#34d399">RECURSO #1</Text>
      </group>

      {/* Recurso R2 */}
      <group position={[1.8, -0.8, 0]}>
        <RoundedBox args={[0.8, 0.8, 0.8]} radius={0.05}>
          <meshStandardMaterial color="#8b5cf6" metalness={0.8} roughness={0.2} />
        </RoundedBox>
        <Text position={[0, 0, 0.45]} fontSize={0.12} color="#ffffff">R2</Text>
        <Text position={[0, -0.6, 0]} fontSize={0.09} color="#a78bfa">RECURSO #2</Text>
      </group>

      {/* Líneas de Dependencia / Ciclo */}
      {step >= 1 && (
        <mesh position={[-1.8, 0.1, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 1.0]} />
          <meshBasicMaterial color="#00ff88" />
        </mesh>
      )}
      {step >= 2 && (
        <mesh position={[1.8, 0.1, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 1.0]} />
          <meshBasicMaterial color="#00ff88" />
        </mesh>
      )}
      {step >= 3 && (
        <>
          <mesh position={[0, 0.1, 0]} rotation={[0, 0, Math.PI / 4]}>
            <cylinderGeometry args={[0.04, 0.04, 3.2]} />
            <meshBasicMaterial color="#ff2d2d" />
          </mesh>
          <mesh position={[0, 0.1, 0]} rotation={[0, 0, -Math.PI / 4]}>
            <cylinderGeometry args={[0.04, 0.04, 3.2]} />
            <meshBasicMaterial color="#ff2d2d" />
          </mesh>
        </>
      )}
    </group>
  );
}

/**
 * DeadlockGraphApp — Aplicación Completa con Panel HTML Nativo
 * Los botones son elementos HTML DOM reales sin desfase de puntero ni matrices 3D CSS.
 */
export function DeadlockGraphApp() {
  const [deadlockTriggered, setDeadlockTriggered] = useState(false);
  const [step, setStep] = useState(0);
  const [log, setLog] = useState("Estado seguro. Ningún proceso bloqueado.");

  const step1 = () => {
    setStep(1);
    setLog("Hilo 1 adquiere Recurso R1. Todo en orden.");
  };

  const step2 = () => {
    setStep(2);
    setLog("Hilo 2 adquiere Recurso R2. Todo en orden.");
  };

  const step3 = () => {
    setStep(3);
    setDeadlockTriggered(true);
    setLog("¡DEADLOCK DETECTADO! Hilo 1 espera R2 (retenido por Hilo 2) e Hilo 2 espera R1 (retenido por Hilo 1). Ciclo cerrado.");
  };

  const resetAll = () => {
    setStep(0);
    setDeadlockTriggered(false);
    setLog("Grafo reiniciado. Sistema libre de interbloqueos.");
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
              <div className="w-8 h-8 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
                <AlertOctagon className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white tracking-tight">Grafo de Deadlock</h3>
                <p className="text-[11px] text-slate-400">Espera Circular (Coffman)</p>
              </div>
            </div>

            <div className={`px-2.5 py-1 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 shadow-md ${
              deadlockTriggered
                ? "bg-rose-500/20 text-rose-400 border border-rose-500/40"
                : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
            }`}>
              {deadlockTriggered ? <ShieldAlert className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
              <span>{deadlockTriggered ? "INTERBLOQUEO" : "SEGURO"}</span>
            </div>
          </div>

          {/* Registro del Estado */}
          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-xs text-cyan-200 font-mono leading-relaxed shadow-inner">
            <span className="text-slate-400 block text-[10px] font-sans font-bold uppercase mb-1">
              Registro del Grafo:
            </span>
            {log}
          </div>

          {/* Pasos Didácticos */}
          <div className="space-y-2">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Secuencia de Asignación:
            </div>
            <div className="grid grid-cols-1 gap-2">
              <button
                onClick={step1}
                disabled={step >= 1}
                className="w-full py-2.5 px-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-30 disabled:hover:bg-blue-600 text-white rounded-xl font-medium text-xs flex items-center justify-between transition-colors shadow-md cursor-pointer"
              >
                <span>1. P1 adquiere R1</span>
                <span className="text-[10px] font-mono opacity-80">[wait(R1)]</span>
              </button>

              <button
                onClick={step2}
                disabled={step < 1 || step >= 2}
                className="w-full py-2.5 px-3 bg-purple-600 hover:bg-purple-500 disabled:opacity-30 disabled:hover:bg-purple-600 text-white rounded-xl font-medium text-xs flex items-center justify-between transition-colors shadow-md cursor-pointer"
              >
                <span>2. P2 adquiere R2</span>
                <span className="text-[10px] font-mono opacity-80">[wait(R2)]</span>
              </button>

              <button
                onClick={step3}
                disabled={step < 2 || step >= 3}
                className="w-full py-2.5 px-3 bg-rose-600 hover:bg-rose-500 disabled:opacity-30 disabled:hover:bg-rose-600 text-white rounded-xl font-medium text-xs flex items-center justify-between transition-colors shadow-md cursor-pointer"
              >
                <span>3. Solicitud Cruzada</span>
                <span className="text-[10px] font-mono opacity-80">[Deadlock]</span>
              </button>
            </div>
          </div>
        </div>

        {/* Pie del Panel: Explicación y Reset */}
        <div className="pt-3 border-t border-slate-800">
          <div className="flex items-center justify-between gap-2">
            <ExplanationButton
              title="¿Qué representa cada elemento en el Grafo de Deadlock?"
              items={[
                { element: "Esfera P1 (Azul)", description: "Proceso/Hilo 1: solicita recursos compartidos. En deadlock, retiene R1 y espera por R2.", color: "#0284c7" },
                { element: "Esfera P2 (Naranja)", description: "Proceso/Hilo 2: solicita recursos compartidos. En deadlock, retiene R2 y espera por R1.", color: "#ea580c" },
                { element: "Cubo R1 (Verde)", description: "Recurso compartido #1 (ej. Impresora). Solo puede ser asignado a un proceso a la vez.", color: "#10b981" },
                { element: "Cubo R2 (Violeta)", description: "Recurso compartido #2 (ej. Archivo). Solo puede ser asignado a un proceso a la vez.", color: "#8b5cf6" },
                { element: "Líneas Verdes", description: "Aristas de Asignación: indican qué proceso retiene qué recurso actualmente.", color: "#00ff88" },
                { element: "Líneas Rojas Cruzadas", description: "Espera Circular (Coffman): ambos procesos esperan el recurso del otro. El ciclo cerrado = Deadlock.", color: "#ff2d2d" }
              ]}
            />

            <button
              onClick={resetAll}
              className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
              title="Reiniciar Grafo"
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
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }} style={{ width: "100%", height: "100%" }}>
          <Suspense fallback={null}>
            <Deadlock3DScene step={step} deadlockTriggered={deadlockTriggered} />
            <OrbitControls
              enablePan={true}
              maxPolarAngle={Math.PI / 2.05}
              minDistance={3}
              maxDistance={10}
              target={[0, 0.2, 0]}
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
export function DeadlockGraphScene() {
  return <Deadlock3DScene />;
}
