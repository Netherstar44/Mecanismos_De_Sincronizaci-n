import { useState, useEffect, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Text, RoundedBox, OrbitControls } from "@react-three/drei";
import { Box, Play, Pause, Plus, Minus } from "lucide-react";
import { ExplanationButton } from "@/components/ui/ExplanationButton";

export interface ProducerConsumerProps {
  buffer?: (number | null)[];
  mutex?: number;
}

/**
 * ProducerConsumer3DScene — Componente puramente 3D (sin Drei Html transform).
 * No contiene elementos HTML proyectados que desfasen el cursor del mouse.
 */
export function ProducerConsumer3DScene({
  buffer = [101, 102, null, null, null],
  mutex = 1
}: ProducerConsumerProps) {
  const BUFFER_SIZE = 5;

  return (
    <group position={[0, -0.4, 0]}>
      {/* Luces */}
      <ambientLight intensity={0.9} />
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
    </group>
  );
}

/**
 * ProducerConsumerApp — Aplicación Completa con Panel HTML Nativo
 * Los botones son elementos HTML DOM reales sin desfase de puntero ni matrices 3D CSS.
 */
export function ProducerConsumerApp() {
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

    const newEmpty = empty - 1;
    setMutex(0);

    const emptyIndex = buffer.findIndex(val => val === null);
    if (emptyIndex !== -1) {
      const newBuffer = [...buffer];
      newBuffer[emptyIndex] = nextItemId;
      setBuffer(newBuffer);
      setNextItemId(prev => prev + 1);

      setMutex(1);
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

    const newFull = full - 1;
    setMutex(0);

    const occupiedIndex = buffer.findIndex(val => val !== null);
    if (occupiedIndex !== -1) {
      const consumedId = buffer[occupiedIndex];
      const newBuffer = [...buffer];
      newBuffer[occupiedIndex] = null;
      setBuffer(newBuffer);

      setMutex(1);
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
      if (Math.random() > 0.45) {
        produceItem();
      } else {
        consumeItem();
      }
    }, 1800);
    return () => clearInterval(timer);
  }, [autoRun, empty, full, buffer, nextItemId]);

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
              <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <Box className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white tracking-tight">Productor-Consumidor</h3>
                <p className="text-[11px] text-slate-400">Búfer Acotado Circular (N=5)</p>
              </div>
            </div>

            <button
              onClick={() => setAutoRun(!autoRun)}
              className={`px-2.5 py-1 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all cursor-pointer shadow-md ${
                autoRun
                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                  : "bg-slate-800 text-slate-300 border-slate-700 hover:text-white"
              }`}
            >
              {autoRun ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{autoRun ? "Pausar" : "Auto Run"}</span>
            </button>
          </div>

          {/* Tres Semáforos en Tiempo Real */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="bg-slate-800/60 p-2 rounded-xl border border-slate-700/50">
              <div className="text-[10px] text-slate-400">mutex (Binario)</div>
              <div className={`text-base font-bold font-mono ${mutex === 1 ? "text-emerald-400" : "text-rose-400"}`}>
                {mutex} ({mutex === 1 ? "Libre" : "Lock"})
              </div>
            </div>
            <div className="bg-slate-800/60 p-2 rounded-xl border border-slate-700/50">
              <div className="text-[10px] text-slate-400">empty (Libres)</div>
              <div className="text-base font-bold font-mono text-cyan-400">{empty} / 5</div>
            </div>
            <div className="bg-slate-800/60 p-2 rounded-xl border border-slate-700/50">
              <div className="text-[10px] text-slate-400">full (Listos)</div>
              <div className="text-base font-bold font-mono text-amber-400">{full} / 5</div>
            </div>
          </div>

          {/* Registro de Operaciones */}
          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-xs text-cyan-200 font-mono leading-relaxed shadow-inner">
            <span className="text-slate-400 block text-[10px] font-sans font-bold uppercase mb-1">
              Registro del Kernel:
            </span>
            {log}
          </div>

          {/* Botones Manuales */}
          <div className="space-y-2">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Operaciones Manuales:
            </div>
            <div className="grid grid-cols-1 gap-2">
              <button
                onClick={produceItem}
                disabled={empty <= 0}
                className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-30 disabled:hover:bg-emerald-600 text-white rounded-xl font-medium text-xs flex items-center justify-between transition-colors shadow-md cursor-pointer"
              >
                <div className="flex items-center gap-1.5">
                  <Plus className="w-3.5 h-3.5" />
                  <span>Producir Item</span>
                </div>
                <span className="text-[10px] font-mono opacity-80">wait(empty)</span>
              </button>

              <button
                onClick={consumeItem}
                disabled={full <= 0}
                className="w-full py-2.5 px-3 bg-orange-600 hover:bg-orange-500 disabled:opacity-30 disabled:hover:bg-orange-600 text-white rounded-xl font-medium text-xs flex items-center justify-between transition-colors shadow-md cursor-pointer"
              >
                <div className="flex items-center gap-1.5">
                  <Minus className="w-3.5 h-3.5" />
                  <span>Consumir Item</span>
                </div>
                <span className="text-[10px] font-mono opacity-80">wait(full)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Pie del Panel: Explicación */}
        <div className="pt-3 border-t border-slate-800">
          <ExplanationButton
            title="¿Qué representa cada elemento en Productor-Consumidor?"
            items={[
              { element: "Celdas Circulares (SLOT 0-4)", description: "Las 5 ranuras del búfer circular compartido. Azul = ocupado con un paquete. Gris = vacío.", color: "#0284c7" },
              { element: "Cubos Verdes (#ID)", description: "Items/paquetes producidos por el hilo Productor. Cada uno tiene un identificador único.", color: "#00ff88" },
              { element: "Esfera Central (MUTEX)", description: "Semáforo binario de exclusión mutua. Verde (1) = búfer accesible. Rojo (0) = sección crítica bloqueada.", color: "#00ff88" },
              { element: "Semáforo empty", description: "Semáforo contador: indica cuántos espacios vacíos quedan. Si empty=0, el Productor se bloquea (sleep).", color: "#22d3ee" },
              { element: "Semáforo full", description: "Semáforo contador: indica cuántos items hay listos. Si full=0, el Consumidor se bloquea (sleep).", color: "#f97316" },
              { element: "Botón AUTO RUN", description: "Ejecuta automáticamente productores y consumidores aleatorios para observar la dinámica del búfer.", color: "#4ade80" }
            ]}
          />
        </div>
      </aside>

      {/* ======================================================================= */}
      {/* CANVAS THREE.JS (Vista 3D Libre y sin Elementos HTML Desfasados)         */}
      {/* ======================================================================= */}
      <div className="flex-1 h-full relative">
        <Canvas camera={{ position: [0, 2.5, 6], fov: 45 }} style={{ width: "100%", height: "100%" }}>
          <Suspense fallback={null}>
            <ProducerConsumer3DScene buffer={buffer} mutex={mutex} />
            <OrbitControls
              enablePan={true}
              maxPolarAngle={Math.PI / 2.05}
              minDistance={3}
              maxDistance={12}
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
export function ProducerConsumerScene() {
  return <ProducerConsumer3DScene />;
}
