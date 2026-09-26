import { useState } from "react";
import { Text, Html, RoundedBox } from "@react-three/drei";

/**
 * RaceConditionScene — Simulador 3D de Condiciones de Carrera vs Exclusión Mutua
 */
export function RaceConditionScene() {
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
        // Pérdida arbitraria de actualizaciones por lectura/escritura solapada
        val += Math.floor(Math.random() * 45) + 20;
        if (val >= 1420) {
          clearInterval(interval);
          setCounter(1420); // Resultado inconsistente (esperado 2000)
          setIsRunning(false);
          setStatus("¡RESULTADO CORRUPTO! Valor final: 1420 (Esperado: 2000). 580 actualizaciones perdidas por carrera crítica.");
        } else {
          setCounter(val);
        }
      } else {
        // Exclusión mutua perfecta
        val += 50;
        if (val >= 2000) {
          clearInterval(interval);
          setCounter(2000); // Exacto
          setIsRunning(false);
          setStatus("¡ÉXITO ATÓMICO! Valor final: 2000 (Exacto). La exclusión mutua previno cualquier solapamiento.");
        } else {
          setCounter(val);
        }
      }
    }, 40);
  };

  return (
    <group position={[0, -0.2, 0]}>
      <ambientLight intensity={0.5} />
      <pointLight position={[0, 4, 3]} intensity={2} color="#00ffff" />

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

      {/* Panel Flotante */}
      <Html position={[0, -1.0, 1.4]} center transform distanceFactor={5.5}>
        <div className="w-[420px] bg-[#030811]/95 backdrop-blur-md p-4 rounded-xl border border-[#00ffff]/40 shadow-[0_0_25px_rgba(0,255,255,0.2)] text-white font-mono text-xs select-none">
          <div className="flex justify-between items-center border-b border-[#00ffff]/30 pb-2 mb-2.5">
            <span className="text-[#00ffff] font-bold">CONTROL DE CONCURRENCIA</span>
            <div className="flex gap-1">
              <button
                onClick={() => setMode("unsafe")}
                className={`px-2 py-0.5 rounded text-[10px] font-bold border ${mode === "unsafe" ? "bg-red-500/30 text-red-400 border-red-500/50" : "bg-white/10 text-white/50 border-white/20"}`}
              >
                Sin Sincronizar
              </button>
              <button
                onClick={() => setMode("safe")}
                className={`px-2 py-0.5 rounded text-[10px] font-bold border ${mode === "safe" ? "bg-emerald-500/30 text-emerald-400 border-emerald-500/50" : "bg-white/10 text-white/50 border-white/20"}`}
              >
                Con Mutex
              </button>
            </div>
          </div>

          <div className="bg-black/60 p-2 rounded border border-white/10 mb-2.5 text-[11px] leading-relaxed text-cyan-200">
            {status}
          </div>

          <button
            onClick={runSimulation}
            disabled={isRunning}
            className="w-full py-2 bg-cyan-600/30 hover:bg-cyan-600/50 disabled:opacity-30 border border-cyan-400/50 rounded text-cyan-200 font-bold transition-colors"
          >
            {isRunning ? "Simulando Hilos en Paralelo..." : "Iniciar Carrera Concurrente"}
          </button>
        </div>
      </Html>
    </group>
  );
}
