import { useState } from "react";
import { Text, Html, RoundedBox } from "@react-three/drei";

/**
 * DeadlockGraphScene — Simulador 3D de Interbloqueo (Deadlock)
 * Grafo de Asignación de Recursos (RAG) y Espera Circular
 */
export function DeadlockGraphScene() {
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
    <group position={[0, -0.2, 0]}>
      <ambientLight intensity={0.5} />
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

      {/* Panel Flotante */}
      <Html position={[0, -1.0, 1.4]} center transform distanceFactor={5.5}>
        <div className="w-[410px] bg-[#030811]/95 backdrop-blur-md p-4 rounded-xl border border-[#00ffff]/40 shadow-[0_0_25px_rgba(0,255,255,0.2)] text-white font-mono text-xs select-none">
          <div className="flex justify-between items-center border-b border-[#00ffff]/30 pb-2 mb-2">
            <span className="text-[#00ffff] font-bold">RIESGO EN SEMÁFOROS: DEADLOCK</span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${deadlockTriggered ? "bg-red-500/30 text-red-400 border border-red-500/50" : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"}`}>
              {deadlockTriggered ? "INTERBLOQUEO" : "SEGURO"}
            </span>
          </div>

          <div className="bg-black/60 p-2 rounded border border-white/10 mb-2.5 text-[11px] leading-relaxed text-cyan-200">
            {log}
          </div>

          <div className="grid grid-cols-3 gap-1.5 text-[10px] mb-2">
            <button onClick={step1} disabled={step >= 1} className="px-2 py-1.5 bg-blue-600/30 hover:bg-blue-600/50 disabled:opacity-30 border border-blue-400/50 rounded text-blue-200 font-bold">
              1. P1 wait(R1)
            </button>
            <button onClick={step2} disabled={step < 1 || step >= 2} className="px-2 py-1.5 bg-purple-600/30 hover:bg-purple-600/50 disabled:opacity-30 border border-purple-400/50 rounded text-purple-200 font-bold">
              2. P2 wait(R2)
            </button>
            <button onClick={step3} disabled={step < 2 || step >= 3} className="px-2 py-1.5 bg-red-600/30 hover:bg-red-600/50 disabled:opacity-30 border border-red-400/50 rounded text-red-200 font-bold">
              3. Cruce Deadlock
            </button>
          </div>

          <div className="flex justify-end">
            <button onClick={resetAll} className="text-[10px] text-white/50 hover:text-white underline">
              Reiniciar Grafo
            </button>
          </div>
        </div>
      </Html>
    </group>
  );
}
