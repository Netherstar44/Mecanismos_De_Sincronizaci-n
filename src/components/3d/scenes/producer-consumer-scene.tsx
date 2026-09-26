import { useState, useEffect } from "react";
import { Text, Html, RoundedBox } from "@react-three/drei";

/**
 * ProducerConsumerScene — Simulador Didáctico 3D:
 * "Problema del Productor-Consumidor con Búfer Limitado (N = 5)"
 * 
 * Semáforos de Coordinación:
 * - semaphore mutex = 1; // Exclusión mutua para modificar el búfer compartido
 * - semaphore empty = 5; // Espacios vacíos disponibles (inicia en N=5)
 * - semaphore full  = 0; // Elementos listos para consumir (inicia en 0)
 */
export function ProducerConsumerScene() {
  const BUFFER_SIZE = 5;
  const [buffer, setBuffer] = useState<(number | null)[]>([101, 102, null, null, null]);
  const [mutex, setMutex] = useState(1);
  const [empty, setEmpty] = useState(3);
  const [full, setFull] = useState(2);
  const [autoRun, setAutoRun] = useState(false);
  const [log, setLog] = useState("Búfer inicializado con 2 elementos. empty=3, full=2, mutex=1.");
  const [nextItemId, setNextItemId] = useState(103);

  // Acción Productor()
  const produceItem = () => {
    if (empty <= 0) {
      setLog("PRODUCTOR BLOQUEADO: wait(empty) falló (empty <= 0). Búfer lleno. El hilo productor duerme.");
      return;
    }

    // 1. wait(empty)
    const newEmpty = empty - 1;
    // 2. wait(mutex)
    setMutex(0);

    // 3. insertar_item_en_bufer(item)
    const emptyIndex = buffer.findIndex(val => val === null);
    if (emptyIndex !== -1) {
      const newBuffer = [...buffer];
      newBuffer[emptyIndex] = nextItemId;
      setBuffer(newBuffer);
      setNextItemId(prev => prev + 1);

      // 4. signal(mutex)
      setMutex(1);
      // 5. signal(full)
      const newFull = full + 1;
      setEmpty(newEmpty);
      setFull(newFull);
      setLog(`PRODUCTOR: insertó paquete #${nextItemId} en ranura [${emptyIndex}]. empty=${newEmpty}, full=${newFull}, mutex=1.`);
    }
  };

  // Acción Consumidor()
  const consumeItem = () => {
    if (full <= 0) {
      setLog("CONSUMIDOR BLOQUEADO: wait(full) falló (full <= 0). Búfer vacío. El hilo consumidor duerme.");
      return;
    }

    // 1. wait(full)
    const newFull = full - 1;
    // 2. wait(mutex)
    setMutex(0);

    // 3. remover_item_del_bufer()
    const occupiedIndex = buffer.findIndex(val => val !== null);
    if (occupiedIndex !== -1) {
      const consumedId = buffer[occupiedIndex];
      const newBuffer = [...buffer];
      newBuffer[occupiedIndex] = null;
      setBuffer(newBuffer);

      // 4. signal(mutex)
      setMutex(1);
      // 5. signal(empty)
      const newEmpty = empty + 1;
      setEmpty(newEmpty);
      setFull(newFull);
      setLog(`CONSUMIDOR: removió paquete #${consumedId} de ranura [${occupiedIndex}]. empty=${newEmpty}, full=${newFull}, mutex=1.`);
    }
  };

  // Bucle automático
  useEffect(() => {
    if (!autoRun) return;
    const timer = setInterval(() => {
      // 55% de probabilidad de producir, 45% de consumir
      if (Math.random() > 0.45) {
        produceItem();
      } else {
        consumeItem();
      }
    }, 1800);
    return () => clearInterval(timer);
  }, [autoRun, empty, full, buffer, nextItemId]);

  return (
    <group position={[0, -0.4, 0]}>
      {/* Luces */}
      <ambientLight intensity={0.6} />
      <pointLight position={[0, 4, 3]} intensity={2.5} color="#00ffff" distance={10} />
      <pointLight position={[0, -2, -2]} intensity={1.5} color="#ff00ff" distance={8} />

      {/* Rótulo superior */}
      <Text
        position={[0, 2.5, 0]}
        fontSize={0.15}
        color="#00ffff"
        anchorX="center"
        outlineWidth={0.006}
        outlineColor="#000"
      >
        BÚFER CIRCULAR SINCRONIZADO (N = 5)
      </Text>

      {/* 5 Celdas del Búfer Dispuestas en Círculo */}
      {buffer.map((item, index) => {
        const angle = (index / BUFFER_SIZE) * Math.PI * 2 - Math.PI / 2;
        const radius = 1.6;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius * 0.7 + 0.5;

        return (
          <group key={index} position={[x, y, 0]}>
            {/* Base de la celda de memoria */}
            <mesh>
              <cylinderGeometry args={[0.35, 0.38, 0.15, 24]} />
              <meshStandardMaterial 
                color={item !== null ? "#0284c7" : "#1e293b"} 
                roughness={0.3} 
                metalness={0.7} 
              />
            </mesh>

            {/* Número de Ranura */}
            <Text position={[0, -0.3, 0.1]} fontSize={0.11} color="#64748b">
              {`SLOT ${index}`}
            </Text>

            {/* Si contiene un paquete/item producido */}
            {item !== null ? (
              <group position={[0, 0.28, 0]}>
                <RoundedBox args={[0.38, 0.38, 0.38]} radius={0.04}>
                  <meshStandardMaterial color="#00ff88" roughness={0.2} metalness={0.8} />
                </RoundedBox>
                <Text position={[0, 0, 0.21]} fontSize={0.1} color="#000000">
                  {`#${item}`}
                </Text>
              </group>
            ) : (
              <Text position={[0, 0.1, 0]} fontSize={0.12} color="#334155">
                VACÍO
              </Text>
            )}
          </group>
        );
      })}

      {/* Núcleo Central: Estado de Mutex Lock */}
      <group position={[0, 0.5, 0]}>
        <mesh>
          <sphereGeometry args={[0.42, 32, 32]} />
          <meshStandardMaterial 
            color={mutex === 1 ? "#00ff88" : "#ff2d2d"} 
            roughness={0.1} 
            metalness={0.9} 
          />
        </mesh>
        <Text position={[0, 0, 0.46]} fontSize={0.1} color="#000000">
          {mutex === 1 ? "MUTEX=1" : "MUTEX=0"}
        </Text>
        <Text position={[0, -0.6, 0]} fontSize={0.1} color={mutex === 1 ? "#00ff88" : "#ff2d2d"}>
          {mutex === 1 ? "CANDADO LIBRE" : "SECCIÓN CRÍTICA"}
        </Text>
      </group>

      {/* Panel Interactivo Flotante (HTML) */}
      <Html position={[0, -1.0, 1.4]} center transform distanceFactor={5.5}>
        <div className="w-[430px] bg-[#030811]/95 backdrop-blur-md p-4 rounded-xl border border-[#00ffff]/40 shadow-[0_0_25px_rgba(0,255,255,0.2)] text-white font-mono text-xs select-none">
          <div className="flex justify-between items-center border-b border-[#00ffff]/30 pb-2 mb-2.5">
            <span className="text-[#00ffff] font-bold">PRODUCTOR - CONSUMIDOR // BÚFER N=5</span>
            <button
              onClick={() => setAutoRun(!autoRun)}
              className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-colors ${autoRun ? "bg-green-500/20 text-green-400 border-green-500/40" : "bg-white/10 text-white/70 border-white/20"}`}
            >
              {autoRun ? "PAUSAR AUTO" : "AUTO RUN"}
            </button>
          </div>

          {/* Tres Semáforos en Tiempo Real */}
          <div className="grid grid-cols-3 gap-2 mb-2.5 text-center text-[10px]">
            <div className="bg-black/50 p-1.5 rounded border border-white/10">
              <div className="text-white/60">mutex (Binario)</div>
              <div className={`text-sm font-bold ${mutex === 1 ? "text-emerald-400" : "text-red-400"}`}>
                {mutex} ({mutex === 1 ? "Libre" : "Lock"})
              </div>
            </div>
            <div className="bg-black/50 p-1.5 rounded border border-white/10">
              <div className="text-white/60">empty (Contador)</div>
              <div className="text-sm font-bold text-cyan-400">{empty} / 5</div>
            </div>
            <div className="bg-black/50 p-1.5 rounded border border-white/10">
              <div className="text-white/60">full (Contador)</div>
              <div className="text-sm font-bold text-orange-400">{full} / 5</div>
            </div>
          </div>

          {/* Registro de operaciones */}
          <div className="bg-black/60 p-2 rounded border border-white/10 mb-2.5 text-[11px] leading-relaxed text-cyan-200">
            {log}
          </div>

          {/* Botones de acción manual */}
          <div className="grid grid-cols-2 gap-2 text-[10px]">
            <button
              onClick={produceItem}
              disabled={empty <= 0}
              className="px-2.5 py-1.5 bg-emerald-600/30 hover:bg-emerald-600/50 disabled:opacity-30 border border-emerald-400/50 rounded text-emerald-200 font-bold transition-colors"
            >
              + Producir Item [wait(empty)]
            </button>
            <button
              onClick={consumeItem}
              disabled={full <= 0}
              className="px-2.5 py-1.5 bg-orange-600/30 hover:bg-orange-600/50 disabled:opacity-30 border border-orange-400/50 rounded text-orange-200 font-bold transition-colors"
            >
              - Consumir Item [wait(full)]
            </button>
          </div>
        </div>
      </Html>
    </group>
  );
}
