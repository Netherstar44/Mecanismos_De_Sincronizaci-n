import { useRef, useState, Suspense } from "react";
import { useFrame, Canvas } from "@react-three/fiber";
import { Text, RoundedBox, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { Car, AlertCircle, CheckCircle2, RotateCcw, ArrowRight, ShieldAlert, Cpu, HelpCircle } from "lucide-react";
import { ExplanationButton } from "@/components/ui/ExplanationButton";

/**
 * Parking3DScene — Escena 3D Isométrica del Estacionamiento y Semáforo de Dijkstra
 * Funciona perfectamente tanto dentro de Canvas standalone como embebida en librerías.
 */
export function Parking3DScene({
  semaphoreS = 1,
  parkedCars = [1, 2],
  waitingQueue = [],
  barrierOpen = false
}: {
  semaphoreS?: number;
  parkedCars?: number[];
  waitingQueue?: number[];
  barrierOpen?: boolean;
}) {
  const barrierArmRef = useRef<THREE.Group>(null);
  const redLightRef = useRef<THREE.PointLight>(null);
  const yellowLightRef = useRef<THREE.PointLight>(null);
  const greenLightRef = useRef<THREE.PointLight>(null);

  // Animación del brazo de la barrera levadiza
  useFrame((_, delta) => {
    if (barrierArmRef.current) {
      // 0 = cerrado (horizontal), -Math.PI / 2.2 = abierto (levantado)
      const targetAngle = barrierOpen ? -Math.PI / 2.2 : 0;
      barrierArmRef.current.rotation.z = THREE.MathUtils.lerp(
        barrierArmRef.current.rotation.z,
        targetAngle,
        delta * 6
      );
    }
  });

  const isGreen = semaphoreS > 0;
  const isYellow = semaphoreS === 0;
  const isRed = semaphoreS < 0;

  return (
    <group position={[0, -0.2, 0]}>
      {/* Iluminación clara y nítida de estudio */}
      <ambientLight intensity={1.2} color="#ffffff" />
      <directionalLight position={[6, 9, 6]} intensity={2.4} castShadow />
      <directionalLight position={[-6, 4, 3]} intensity={1.2} color="#e0f2fe" />

      {/* ========================================================================= */}
      {/* SEMÁFORO DE TRÁNSITO FÍSICO 3D (Grande, Visible y con Rótulo 3D Claro)     */}
      {/* ========================================================================= */}
      <group position={[-2.4, 1.4, 0.2]}>
        {/* Poste metálico */}
        <mesh position={[0, -0.8, 0]} castShadow>
          <cylinderGeometry args={[0.07, 0.09, 2.0, 16]} />
          <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.3} />
        </mesh>

        {/* Caja protectora rectangular del semáforo */}
        <RoundedBox args={[0.55, 1.45, 0.35]} radius={0.05} castShadow>
          <meshStandardMaterial color="#0f172a" roughness={0.4} metalness={0.8} />
        </RoundedBox>

        {/* 1. Lente ROJO (Bloqueo / S < 0) */}
        <mesh position={[0, 0.45, 0.18]}>
          <circleGeometry args={[0.15, 24]} />
          <meshStandardMaterial
            color={isRed ? "#ef4444" : "#450a0a"}
            emissive={isRed ? "#ef4444" : "#000000"}
            emissiveIntensity={isRed ? 3.0 : 0}
            roughness={0.2}
          />
        </mesh>
        {isRed && (
          <pointLight ref={redLightRef as any} position={[0, 0.45, 0.4]} color="#ef4444" intensity={2.5} distance={3} />
        )}

        {/* 2. Lente AMARILLO (Límite / S = 0) */}
        <mesh position={[0, 0, 0.18]}>
          <circleGeometry args={[0.15, 24]} />
          <meshStandardMaterial
            color={isYellow ? "#f59e0b" : "#451a03"}
            emissive={isYellow ? "#f59e0b" : "#000000"}
            emissiveIntensity={isYellow ? 3.0 : 0}
            roughness={0.2}
          />
        </mesh>
        {isYellow && (
          <pointLight ref={yellowLightRef as any} position={[0, 0, 0.4]} color="#f59e0b" intensity={2.5} distance={3} />
        )}

        {/* 3. Lente VERDE (Disponible / S > 0) */}
        <mesh position={[0, -0.45, 0.18]}>
          <circleGeometry args={[0.15, 24]} />
          <meshStandardMaterial
            color={isGreen ? "#10b981" : "#022c22"}
            emissive={isGreen ? "#10b981" : "#000000"}
            emissiveIntensity={isGreen ? 3.0 : 0}
            roughness={0.2}
          />
        </mesh>
        {isGreen && (
          <pointLight ref={greenLightRef as any} position={[0, -0.45, 0.4]} color="#10b981" intensity={2.5} distance={3} />
        )}

        {/* Rótulo 3D indicador sobre el semáforo */}
        <Text position={[0, 0.95, 0]} fontSize={0.16} color="#ffffff" anchorX="center">
          SEMÁFORO S
        </Text>
        <Text
          position={[0, 0.78, 0]}
          fontSize={0.12}
          color={isGreen ? "#34d399" : (isYellow ? "#fbbf24" : "#f87171")}
          anchorX="center"
        >
          {isGreen ? "[ S > 0 DISPONIBLE ]" : (isYellow ? "[ S = 0 LLENO ]" : "[ S < 0 BLOQUEO ]")}
        </Text>
      </group>

      {/* ========================================================================= */}
      {/* PISO ASFALTADO Y 3 CAJONES DE ESTACIONAMIENTO                             */}
      {/* ========================================================================= */}
      {/* Superficie de asfalto del estacionamiento */}
      <mesh position={[0.4, -0.55, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[7.2, 5.0]} />
        <meshStandardMaterial color="#1e293b" roughness={0.7} />
      </mesh>

      {/* Líneas blancas divisorias viales */}
      {[-1.2, -0.1, 1.0, 2.1].map((x, i) => (
        <mesh key={i} position={[x, -0.54, -0.7]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.08, 2.6]} />
          <meshBasicMaterial color="#f8fafc" />
        </mesh>
      ))}

      {/* 3 Plazas de Estacionamiento Demarcadas (P1, P2, P3) */}
      {[-0.65, 0.45, 1.55].map((x, i) => (
        <group key={i} position={[x, -0.5, -0.7]}>
          {/* Identificador pintado en el suelo */}
          <Text position={[0, 0.01, -1.0]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.24} color="#94a3b8">
            {`PLAZA ${i + 1}`}
          </Text>

          {/* Vehículo estacionado si la plaza está ocupada */}
          {parkedCars[i] !== undefined ? (
            <group position={[0, 0.35, 0]}>
              {/* Carrocería del auto */}
              <RoundedBox args={[0.82, 0.42, 1.55]} radius={0.08} castShadow>
                <meshStandardMaterial
                  color={i === 0 ? "#2563eb" : (i === 1 ? "#059669" : "#7c3aed")}
                  roughness={0.3}
                  metalness={0.6}
                />
              </RoundedBox>
              {/* Techo y cabina con cristales */}
              <mesh position={[0, 0.28, -0.08]}>
                <boxGeometry args={[0.72, 0.25, 0.8]} />
                <meshStandardMaterial color="#0f172a" roughness={0.2} metalness={0.8} />
              </mesh>
              {/* Ruedas 3D */}
              {[-0.42, 0.42].map((rx, rIdx) => (
                <group key={rIdx}>
                  <mesh position={[rx, -0.15, 0.45]} rotation={[0, 0, Math.PI / 2]}>
                    <cylinderGeometry args={[0.14, 0.14, 0.08, 16]} />
                    <meshStandardMaterial color="#020617" roughness={0.9} />
                  </mesh>
                  <mesh position={[rx, -0.15, -0.45]} rotation={[0, 0, Math.PI / 2]}>
                    <cylinderGeometry args={[0.14, 0.14, 0.08, 16]} />
                    <meshStandardMaterial color="#020617" roughness={0.9} />
                  </mesh>
                </group>
              ))}
              {/* Faros delanteros encendidos */}
              <mesh position={[-0.28, 0, 0.79]}>
                <circleGeometry args={[0.07, 16]} />
                <meshBasicMaterial color="#fef08a" />
              </mesh>
              <mesh position={[0.28, 0, 0.79]}>
                <circleGeometry args={[0.07, 16]} />
                <meshBasicMaterial color="#fef08a" />
              </mesh>
              {/* Rótulo 3D del número de auto */}
              <Text position={[0, 0.52, 0]} fontSize={0.14} color="#ffffff">
                {`AUTO #${parkedCars[i]}`}
              </Text>
            </group>
          ) : (
            /* Marcador de vacante verde pulsante */
            <group position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <Text fontSize={0.18} color="#10b981">
                [ DISPONIBLE ]
              </Text>
            </group>
          )}
        </group>
      ))}

      {/* ========================================================================= */}
      {/* BARRERA LEVADIZA DE ACCESO CON RAYAS AMARILLAS Y NEGRAS                   */}
      {/* ========================================================================= */}
      <group position={[-1.7, 0, 1.1]}>
        {/* Cabina / Poste motorizado de la barrera */}
        <mesh position={[0, -0.05, 0]} castShadow>
          <boxGeometry args={[0.32, 1.1, 0.32]} />
          <meshStandardMaterial color="#d97706" roughness={0.3} metalness={0.6} />
        </mesh>

        {/* Eje giratorio y brazo levadizo */}
        <group position={[0.16, 0.35, 0]} ref={barrierArmRef}>
          <mesh position={[1.5, 0, 0]}>
            <boxGeometry args={[3.0, 0.14, 0.06]} />
            <meshStandardMaterial color={barrierOpen ? "#10b981" : "#ef4444"} roughness={0.3} />
          </mesh>
        </group>
      </group>

      {/* ========================================================================= */}
      {/* COLA DE SUSPENSIÓN (S.queue / ESTADO SLEEP DE LOS PROCESOS)               */}
      {/* ========================================================================= */}
      <group position={[0.4, -0.48, 1.95]}>
        {/* Rótulo en el piso delimitando la zona de suspensión */}
        <Text position={[0, 0.01, -0.9]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.14} color="#f87171">
          COLA DE SUSPENSIÓN KERNEL (S.queue — PROCESOS DORMIDOS)
        </Text>

        {/* Autos formados en cola esperando que signal(S) los despierte */}
        {waitingQueue.map((carId, idx) => (
          <group key={carId} position={[idx * 1.1 - 0.4, 0.3, 0]}>
            <RoundedBox args={[0.78, 0.38, 1.4]} radius={0.06} castShadow>
              <meshStandardMaterial color="#475569" roughness={0.8} transparent opacity={0.85} />
            </RoundedBox>
            {/* Indicador de proceso dormido */}
            <Text position={[0, 0.48, 0]} fontSize={0.13} color="#fca5a5">
              {`AUTO #${carId} [DORMIDO: wait()]`}
            </Text>
          </group>
        ))}

        {waitingQueue.length === 0 && (
          <Text position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.13} color="#64748b">
            Cola vacía: Ningún proceso suspendido en este momento.
          </Text>
        )}
      </group>
    </group>
  );
}

/**
 * ParkingCounterApp — Aplicación Completa con Viewport 3D Isométrico
 * y Panel de Control Didáctico para el Escritorio SyncOS
 */
export function ParkingCounterApp() {
  const [semaphoreS, setSemaphoreS] = useState(1); // 1 plaza libre de 3
  const [parkedCars, setParkedCars] = useState<number[]>([1, 2]); // Autos 1 y 2
  const [waitingQueue, setWaitingQueue] = useState<number[]>([]); // Cola de suspensión
  const [barrierOpen, setBarrierOpen] = useState(false);
  const [lastAction, setLastAction] = useState<string>(
    "Estado Inicial: S = 1 (1 plaza disponible de 3). Semáforo en VERDE."
  );

  // Operación atómica wait(S) / P(S) de Dijkstra
  const handleWait = () => {
    const nextCarId = parkedCars.length + waitingQueue.length + 1;
    const newS = semaphoreS - 1;
    setSemaphoreS(newS);

    if (newS >= 0) {
      // Hay plaza disponible
      setBarrierOpen(true);
      setParkedCars(prev => [...prev, nextCarId]);
      setLastAction(
        `Auto #${nextCarId} ejecutó wait(S): S decrece a ${newS}. Como S >= 0, la barrera se eleva y el proceso entra a la Sección Crítica (Plaza P${newS + 1}).`
      );
      setTimeout(() => setBarrierOpen(false), 1400);
    } else {
      // Capacidad rebasada: S < 0 -> Kernel suspende al proceso
      setBarrierOpen(false);
      setWaitingQueue(prev => [...prev, nextCarId]);
      setLastAction(
        `Auto #${nextCarId} ejecutó wait(S): S decrece a ${newS} (< 0). La barrera permanece abajo. El Kernel suspende el hilo [sleep] y lo coloca en S.queue.`
      );
    }
  };

  // Operación atómica signal(S) / V(S) de Dijkstra
  const handleSignal = () => {
    if (parkedCars.length === 0) return;

    const leavingCar = parkedCars[0];
    const newParked = parkedCars.slice(1);
    const newS = semaphoreS + 1;
    setSemaphoreS(newS);

    if (newS <= 0 && waitingQueue.length > 0) {
      // Si había autos esperando, el SO despierta al primero de la cola
      const wakingCar = waitingQueue[0];
      setWaitingQueue(prev => prev.slice(1));
      setParkedCars([...newParked, wakingCar]);
      setBarrierOpen(true);
      setLastAction(
        `Sale Auto #${leavingCar} [signal(S)]: S sube a ${newS}. Como S <= 0, el Sistema Operativo despierta al Auto #${wakingCar} de S.queue [wakeup] y lo deja entrar.`
      );
      setTimeout(() => setBarrierOpen(false), 1400);
    } else {
      setParkedCars(newParked);
      setLastAction(
        `Sale Auto #${leavingCar} [signal(S)]: S sube a ${newS}. Queda una plaza libre. El semáforo actualiza su estado.`
      );
    }
  };

  const handleReset = () => {
    setSemaphoreS(1);
    setParkedCars([1, 2]);
    setWaitingQueue([]);
    setBarrierOpen(false);
    setLastAction("Escenario reiniciado: S = 1 (1 plaza libre de 3).");
  };

  const isGreen = semaphoreS > 0;
  const isYellow = semaphoreS === 0;
  const isRed = semaphoreS < 0;

  return (
    <div className="w-full h-full flex flex-col md:flex-row bg-slate-950 text-slate-100 select-none overflow-hidden">
      {/* ======================================================================= */}
      {/* PANEL DIDÁCTICO LATERAL IZQUIERDO (Explicaciones claras y humanas)      */}
      {/* ======================================================================= */}
      <aside className="w-full md:w-80 lg:w-96 bg-slate-900/90 border-r border-slate-800 p-5 flex flex-col justify-between overflow-y-auto z-10 space-y-4">
        <div>
          {/* Cabecera del Panel */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <Car className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white tracking-tight">Semáforos Contadores</h3>
                <p className="text-[11px] text-slate-400">Edsger W. Dijkstra (1965)</p>
              </div>
            </div>

            {/* Badge de Estado del Semáforo */}
            <div className={`px-2.5 py-1 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 shadow-md ${
              isGreen
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                : (isYellow
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                  : "bg-rose-500/20 text-rose-300 border border-rose-500/40")
            }`}>
              {isGreen && <CheckCircle2 className="w-3.5 h-3.5" />}
              {isYellow && <AlertCircle className="w-3.5 h-3.5" />}
              {isRed && <ShieldAlert className="w-3.5 h-3.5" />}
              <span>S = {semaphoreS}</span>
            </div>
          </div>

          {/* Telemetría del Sistema */}
          <div className="grid grid-cols-2 gap-2 text-xs mb-3">
            <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/50">
              <span className="text-slate-400 block text-[11px]">Plazas Ocupadas:</span>
              <span className="text-base font-bold text-white">{parkedCars.length} / 3</span>
            </div>
            <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/50">
              <span className="text-slate-400 block text-[11px]">Hilos Suspendidos:</span>
              <span className={`text-base font-bold ${waitingQueue.length > 0 ? "text-rose-400" : "text-emerald-400"}`}>
                {waitingQueue.length} (en Sleep)
              </span>
            </div>
          </div>

          {/* Registro Didáctico de la última acción del Kernel */}
          <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/60 mb-3 text-xs leading-relaxed text-slate-200">
            <span className="font-semibold text-blue-400 block mb-1 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5" /> Bitácora del Kernel:
            </span>
            <p className="text-slate-300">{lastAction}</p>
          </div>

          {/* Explicación de las Primitivas */}
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-1.5">
            <p>
              <strong className="text-emerald-400">wait(S) / P(S):</strong> Decrementa S. Si S &lt; 0, el hilo se suspende (sleep) y no quema CPU.
            </p>
            <p>
              <strong className="text-blue-400">signal(S) / V(S):</strong> Incrementa S. Si S &lt;= 0, despierta (wakeup) al primer hilo en cola.
            </p>
          </div>

          {/* Botón de Explicación */}
          <ExplanationButton
            title="¿Qué representa cada elemento en el estacionamiento?"
            items={[
              { element: "Semáforo de Tránsito 3D", description: "Representa el Semáforo Contador de Dijkstra: Verde (S>0 = plazas libres), Amarillo (S=0 = lleno), Rojo (S<0 = hilos suspendidos).", color: "#10b981" },
              { element: "Barrera Levadiza", description: "Simboliza la operación wait(S): si S >= 0, la barrera sube y el auto (proceso) entra. Si S < 0, el auto queda esperando.", color: "#f59e0b" },
              { element: "Autos Estacionados", description: "Cada auto es un proceso/hilo que actualmente usa un recurso (plaza del estacionamiento). Ocupan una instancia del recurso.", color: "#3b82f6" },
              { element: "Plazas (3 espacios)", description: "Las N=3 instancias del recurso compartido. El semáforo comienza en S=3 (3 recursos disponibles).", color: "#64748b" },
              { element: "Cola de Espera", description: "Hilos suspendidos por el Kernel (S.queue). No queman CPU: están dormidos (sleep) esperando signal(S).", color: "#ef4444" },
              { element: "Bitácora del Kernel", description: "Registro en tiempo real de las operaciones wait() y signal() ejecutadas por el microkernel del SO.", color: "#3b82f6" }
            ]}
          />
        </div>

        {/* Botones de Control de la Simulación */}
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleWait}
              className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-medium text-xs flex items-center justify-center gap-1.5 transition-colors shadow-lg shadow-emerald-900/30 cursor-pointer"
            >
              <Car className="w-3.5 h-3.5" />
              <span>Entra: wait(S)</span>
            </button>

            <button
              onClick={handleSignal}
              disabled={parkedCars.length === 0}
              className="py-2.5 px-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-30 disabled:hover:bg-blue-600 text-white rounded-xl font-medium text-xs flex items-center justify-center gap-1.5 transition-colors shadow-lg shadow-blue-900/30 cursor-pointer"
            >
              <span>Sale: signal(S)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={handleReset}
            className="w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reiniciar Escenario</span>
          </button>
        </div>
      </aside>

      {/* ======================================================================= */}
      {/* VIEWPORT 3D ISOMÉTRICO (Pleno, luminoso y con OrbitControls)             */}
      {/* ======================================================================= */}
      <div className="flex-1 h-full relative bg-slate-950">
        <Canvas
          camera={{ position: [0, 3.4, 5.8], fov: 42 }}
          style={{ width: "100%", height: "100%" }}
        >
          <Suspense fallback={null}>
            <Parking3DScene
              semaphoreS={semaphoreS}
              parkedCars={parkedCars}
              waitingQueue={waitingQueue}
              barrierOpen={barrierOpen}
            />
            <OrbitControls
              enablePan={true}
              maxPolarAngle={Math.PI / 2.1}
              minDistance={3.2}
              maxDistance={11}
              target={[0, 0, 0]}
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
export function ParkingCounterScene() {
  return <Parking3DScene />;
}
