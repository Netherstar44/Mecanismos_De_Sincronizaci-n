import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, Html, RoundedBox } from "@react-three/drei";
import * as THREE from "three";

/**
 * ParkingCounterScene — Simulador Didáctico 3D:
 * "El Estacionamiento con Pantalla Contadora" (Semáforos Contadores)
 * 
 * Analogía de Semáforos en Sistemas Operativos:
 * - Capacidad N = 3 plazas de estacionamiento (S = 3).
 * - wait(S): Representa el ticket / barrera de entrada.
 *     S.value--;
 *     si S.value < 0 -> El auto apaga motor y entra a la cola de espera (Sleep).
 * - signal(S): Representa la salida / pago en barrera de egreso.
 *     S.value++;
 *     si S.value <= 0 -> El sistema despierta al primer auto de la cola (Wakeup).
 */
export function ParkingCounterScene() {
  const [semaphoreS, setSemaphoreS] = useState(3);
  const [parkedCars, setParkedCars] = useState<number[]>([1, 2]); // Autos 1 y 2 inicialmente
  const [waitingQueue, setWaitingQueue] = useState<number[]>([]); // Cola S.queue
  const [barrierOpen, setBarrierOpen] = useState(false);
  const [traceLog, setTraceLog] = useState<string>("Estado Inicial: S = 3. Capacidad para 3 vehículos.");

  const barrierArmRef = useRef<THREE.Group>(null);

  // Animación suave de la barrera levadiza
  useFrame((_, delta) => {
    if (barrierArmRef.current) {
      // 0 rad = horizontal (cerrada), -Math.PI / 2.3 = levantada (abierta)
      const targetAngle = barrierOpen ? -Math.PI / 2.3 : 0;
      barrierArmRef.current.rotation.z = THREE.MathUtils.lerp(barrierArmRef.current.rotation.z, targetAngle, delta * 5);
    }
  });

  // Operación atómica wait(S)
  const handleWait = () => {
    const nextCarId = parkedCars.length + waitingQueue.length + 1;
    const newS = semaphoreS - 1;
    setSemaphoreS(newS);

    if (newS >= 0) {
      // Hay espacio disponible: barrera se levanta y el auto ingresa
      setBarrierOpen(true);
      setParkedCars(prev => [...prev, nextCarId]);
      setTraceLog(`Auto ${nextCarId} ejecuta wait(S) -> S = ${newS}. Hay cupo (S >= 0), la barrera se eleva e ingresa.`);
      setTimeout(() => setBarrierOpen(false), 1200);
    } else {
      // S < 0: No hay espacio. Barrera cerrada. Auto 4 entra en cola de suspensión (Sleep)
      setBarrierOpen(false);
      setWaitingQueue(prev => [...prev, nextCarId]);
      setTraceLog(`Auto ${nextCarId} ejecuta wait(S) -> S = ${newS} (< 0). Barrera bloqueada. El auto apaga su motor y entra a la cola S.queue [SLEEP].`);
    }
  };

  // Operación atómica signal(S)
  const handleSignal = () => {
    if (parkedCars.length === 0) return;

    const leavingCar = parkedCars[0];
    const newParked = parkedCars.slice(1);
    const newS = semaphoreS + 1;
    setSemaphoreS(newS);

    if (newS <= 0 && waitingQueue.length > 0) {
      // S <= 0: Se despierta al primer auto de la cola
      const wakingCar = waitingQueue[0];
      setWaitingQueue(prev => prev.slice(1));
      setParkedCars([...newParked, wakingCar]);
      setBarrierOpen(true);
      setTraceLog(`Sale Auto ${leavingCar}: ejecuta signal(S) -> S = ${newS}. Como S <= 0, el SO despierta a Auto ${wakingCar} de la cola [WAKEUP] e ingresa.`);
      setTimeout(() => setBarrierOpen(false), 1200);
    } else {
      setParkedCars(newParked);
      setTraceLog(`Sale Auto ${leavingCar}: ejecuta signal(S) -> S = ${newS}. Se libera un cupo en el estacionamiento.`);
    }
  };

  const handleReset = () => {
    setSemaphoreS(3);
    setParkedCars([1]);
    setWaitingQueue([]);
    setBarrierOpen(false);
    setTraceLog("Sistema reiniciado. S = 3.");
  };

  return (
    <group position={[0, -0.4, 0]}>
      {/* Luces */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 6, 4]} intensity={1.8} castShadow />
      <pointLight 
        position={[0, 2.2, 0.4]} 
        intensity={3} 
        color={semaphoreS > 0 ? "#00ff88" : (semaphoreS === 0 ? "#ffaa00" : "#ff2d2d")} 
        distance={5} 
      />

      {/* Pantalla Contadora LED Superior (Variable S) */}
      <mesh position={[0, 2.3, 0]}>
        <boxGeometry args={[2.4, 0.7, 0.15]} />
        <meshStandardMaterial color="#090d16" roughness={0.2} metalness={0.9} />
      </mesh>
      <mesh position={[0, 2.3, 0.08]}>
        <planeGeometry args={[2.2, 0.55]} />
        <meshBasicMaterial color="#020408" />
      </mesh>
      <Text
        position={[0, 2.35, 0.1]}
        fontSize={0.22}
        color={semaphoreS > 0 ? "#00ff88" : (semaphoreS === 0 ? "#ffaa00" : "#ff2d2d")}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.008}
        outlineColor="#000000"
      >
        {`S = ${semaphoreS} ${semaphoreS > 0 ? "[DISPONIBLE]" : (semaphoreS === 0 ? "[LLENO]" : `[COLA: ${Math.abs(semaphoreS)}]`)}`}
      </Text>

      {/* Rótulo superior */}
      <Text
        position={[0, 2.8, 0]}
        fontSize={0.12}
        color="#00ffff"
        anchorX="center"
        outlineWidth={0.005}
        outlineColor="#000000"
      >
        ESTACIONAMIENTO CONTADOR (N = 3 PLAZAS)
      </Text>

      {/* Piso del Estacionamiento */}
      <mesh position={[0, -0.6, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[6.5, 4.5]} />
        <meshStandardMaterial color="#1e293b" roughness={0.8} />
      </mesh>

      {/* Líneas divisorias de los 3 cajones */}
      {[-1.6, -0.5, 0.6, 1.7].map((x, i) => (
        <mesh key={i} position={[x, -0.59, -0.6]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.08, 2.2]} />
          <meshBasicMaterial color="#e2e8f0" />
        </mesh>
      ))}

      {/* 3 Plazas de Estacionamiento Numeradas */}
      {[-1.05, 0.05, 1.15].map((x, i) => (
        <group key={i} position={[x, -0.5, -0.6]}>
          <Text position={[0, 0.01, -0.8]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.2} color="#64748b">
            {`P${i + 1}`}
          </Text>
          
          {/* Si hay un auto estacionado en este cajón */}
          {parkedCars[i] !== undefined && (
            <group position={[0, 0.3, 0]}>
              <RoundedBox args={[0.7, 0.4, 1.3]} radius={0.05}>
                <meshStandardMaterial color={i === 0 ? "#0284c7" : (i === 1 ? "#10b981" : "#8b5cf6")} roughness={0.3} metalness={0.6} />
              </RoundedBox>
              <Text position={[0, 0.45, 0]} fontSize={0.14} color="#ffffff" outlineWidth={0.005} outlineColor="#000">
                {`AUTO ${parkedCars[i]}`}
              </Text>
            </group>
          )}
        </group>
      ))}

      {/* Poste y Barrera Mecánica de Acceso */}
      <group position={[-2.2, 0, 1.2]}>
        {/* Poste soporte */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.25, 1.2, 0.25]} />
          <meshStandardMaterial color="#f59e0b" roughness={0.3} metalness={0.5} />
        </mesh>

        {/* Eje y Brazo levadizo de la barrera */}
        <group position={[0.15, 0.4, 0]} ref={barrierArmRef}>
          <mesh position={[1.4, 0, 0]}>
            <boxGeometry args={[2.8, 0.12, 0.06]} />
            <meshStandardMaterial color={barrierOpen ? "#00ff88" : "#ef4444"} roughness={0.4} />
          </mesh>
        </group>
      </group>

      {/* Autos en Cola de Espera (S.queue / Estado Sleep) */}
      <group position={[0, -0.2, 1.8]}>
        {waitingQueue.length > 0 && (
          <group position={[0, 0, 0]}>
            <RoundedBox args={[0.7, 0.4, 1.3]} radius={0.05}>
              <meshStandardMaterial color="#64748b" roughness={0.8} opacity={0.6} transparent />
            </RoundedBox>
            <Text position={[0, 0.5, 0]} fontSize={0.12} color="#f87171" outlineWidth={0.005} outlineColor="#000">
              {`AUTO ${waitingQueue[0]} [SUSPENDIDO / SLEEP]`}
            </Text>
          </group>
        )}
      </group>

      {/* Interfaz de Control (HTML en 3D) */}
      <Html position={[0, -0.9, 1.4]} center transform distanceFactor={5.5}>
        <div className="w-[410px] bg-[#030811]/95 backdrop-blur-md p-4 rounded-xl border border-[#00ffff]/40 shadow-[0_0_25px_rgba(0,255,255,0.2)] text-white font-mono text-xs select-none">
          <div className="flex justify-between items-center border-b border-[#00ffff]/30 pb-2 mb-2.5">
            <span className="text-[#00ffff] font-bold tracking-wider">SEMÁFORO CONTADOR // KERNEL</span>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-white/60">S.value:</span>
              <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${semaphoreS > 0 ? "bg-emerald-500/20 text-emerald-400" : (semaphoreS === 0 ? "bg-amber-500/20 text-amber-400" : "bg-red-500/20 text-red-400")}`}>
                {semaphoreS}
              </span>
            </div>
          </div>

          {/* Registro de traza didáctica */}
          <div className="bg-black/60 p-2 rounded border border-white/10 mb-2.5 text-[11px] leading-relaxed text-cyan-200">
            {traceLog}
          </div>

          <div className="flex justify-between text-[10px] text-white/70 mb-2">
            <span>En Estacionamiento: <strong>{parkedCars.length} / 3</strong></span>
            <span>Cola Bloqueados (Sleep): <strong>{waitingQueue.length} hilos</strong></span>
          </div>

          {/* Botones de acción atómica */}
          <div className="grid grid-cols-2 gap-2 text-[10px]">
            <button
              onClick={handleWait}
              className="px-2.5 py-1.5 bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-400/50 rounded text-emerald-200 font-bold transition-colors"
            >
              Llega Auto → wait(S)
            </button>
            <button
              onClick={handleSignal}
              disabled={parkedCars.length === 0}
              className="px-2.5 py-1.5 bg-cyan-600/30 hover:bg-cyan-600/50 disabled:opacity-30 border border-cyan-400/50 rounded text-cyan-200 font-bold transition-colors"
            >
              Sale Auto → signal(S)
            </button>
          </div>

          <div className="mt-2 flex justify-between items-center text-[10px]">
            <span className="text-white/40">Edsger Dijkstra (1965) [P / V]</span>
            <button onClick={handleReset} className="text-white/50 hover:text-white underline">
              Reiniciar
            </button>
          </div>
        </div>
      </Html>
    </group>
  );
}
