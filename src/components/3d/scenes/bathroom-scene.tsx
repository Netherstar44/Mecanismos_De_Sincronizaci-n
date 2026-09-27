import { useRef, useState, Suspense } from "react";
import { useFrame, Canvas } from "@react-three/fiber";
import { Text, RoundedBox, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { Key, RotateCcw, CheckCircle2, ShieldAlert } from "lucide-react";
import { ExplanationButton } from "@/components/ui/ExplanationButton";

export interface BathroomState {
  isLocked: boolean;
  p1Inside: boolean;
  p2Spinning: boolean;
  traceStep: number;
}

/**
 * Bathroom3DScene — Componente puramente 3D (sin Drei Html transform).
 * No contiene elementos HTML proyectados que desfasen el cursor del mouse.
 */
export function Bathroom3DScene({
  isLocked = false,
  p1Inside = false,
  p2Spinning = false,
  traceStep = 0
}: Partial<BathroomState>) {
  const doorRef = useRef<THREE.Group>(null);
  const handleRef = useRef<THREE.Group>(null);
  const p1Ref = useRef<THREE.Group>(null);
  const p2Ref = useRef<THREE.Group>(null);

  // Animaciones por cuadro
  useFrame((state, delta) => {
    // Puerta abierta o cerrada
    if (doorRef.current) {
      const targetAngle = p1Inside && isLocked ? 0 : (!p1Inside && !isLocked && traceStep === 0 ? 0 : (isLocked ? 0 : 0.6));
      doorRef.current.rotation.y = THREE.MathUtils.lerp(doorRef.current.rotation.y, targetAngle, delta * 4);
    }

    // Pomo girando en spinlock (vibración / giro repetido)
    if (handleRef.current) {
      if (p2Spinning) {
        handleRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 25) * 0.45;
      } else {
        handleRef.current.rotation.z = THREE.MathUtils.lerp(handleRef.current.rotation.z, 0, delta * 6);
      }
    }

    // Posición de Cliente 1 (P1)
    if (p1Ref.current) {
      const targetZ = p1Inside ? -1.8 : 2.5;
      p1Ref.current.position.z = THREE.MathUtils.lerp(p1Ref.current.position.z, targetZ, delta * 3);
    }

    // Posición de Cliente 2 (P2)
    if (p2Ref.current) {
      const targetZ = p2Spinning ? 0.7 : (traceStep === 4 ? -1.8 : 2.2);
      p2Ref.current.position.z = THREE.MathUtils.lerp(p2Ref.current.position.z, targetZ, delta * 3);
    }
  });

  return (
    <group position={[0, -0.6, 0]}>
      {/* Luces de la escena */}
      <ambientLight intensity={1.2} />
      <directionalLight position={[5, 8, 5]} intensity={2.0} />
      <pointLight position={[0, 3, 2]} intensity={2} color="#ffffff" distance={8} />
      <pointLight 
        position={[0.85, 0.4, 0.1]} 
        intensity={3} 
        color={isLocked ? "#ff2d2d" : "#00ff88"} 
        distance={3} 
      />

      {/* Marco de la Puerta */}
      <mesh position={[-1.05, 0.8, 0]}>
        <boxGeometry args={[0.1, 2.8, 0.15]} />
        <meshStandardMaterial color="#1a202c" roughness={0.3} metalness={0.8} />
      </mesh>
      <mesh position={[1.05, 0.8, 0]}>
        <boxGeometry args={[0.1, 2.8, 0.15]} />
        <meshStandardMaterial color="#1a202c" roughness={0.3} metalness={0.8} />
      </mesh>
      <mesh position={[0, 2.25, 0]}>
        <boxGeometry args={[2.2, 0.1, 0.15]} />
        <meshStandardMaterial color="#1a202c" roughness={0.3} metalness={0.8} />
      </mesh>

      {/* Rótulo superior */}
      <Text
        position={[0, 2.5, 0.1]}
        fontSize={0.14}
        color="#00ffff"
        anchorX="center"
        outlineWidth={0.006}
        outlineColor="#000000"
      >
        BAÑO INDIVIDUAL (SECCIÓN CRÍTICA)
      </Text>

      {/* Paredes laterales del baño */}
      <mesh position={[-1.7, 0.8, -1.0]}>
        <boxGeometry args={[1.2, 2.8, 2.2]} />
        <meshStandardMaterial color="#0f172a" roughness={0.7} />
      </mesh>
      <mesh position={[1.7, 0.8, -1.0]}>
        <boxGeometry args={[1.2, 2.8, 2.2]} />
        <meshStandardMaterial color="#0f172a" roughness={0.7} />
      </mesh>

      {/* Piso interior del baño */}
      <mesh position={[0, -0.6, -1.0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.2, 2.2]} />
        <meshStandardMaterial color="#1e293b" roughness={0.6} />
      </mesh>

      {/* Puerta Pivotante */}
      <group position={[-1.0, 0.8, 0]} ref={doorRef}>
        <RoundedBox args={[1.98, 2.7, 0.08]} position={[0.99, 0, 0]} radius={0.01}>
          <meshStandardMaterial color="#334155" roughness={0.4} metalness={0.3} />
        </RoundedBox>

        {/* Cerradura Digital Electrónica */}
        <mesh position={[1.8, 0.2, 0.06]}>
          <boxGeometry args={[0.22, 0.45, 0.06]} />
          <meshStandardMaterial color="#0b0f19" roughness={0.2} metalness={0.9} />
        </mesh>

        {/* Display LED de la Cerradura Digital (Variable lock) */}
        <mesh position={[1.8, 0.32, 0.095]}>
          <planeGeometry args={[0.18, 0.14]} />
          <meshBasicMaterial color={isLocked ? "#ff2d2d" : "#00ff88"} />
        </mesh>
        <Text
          position={[1.8, 0.32, 0.1]}
          fontSize={0.045}
          color="#000000"
          anchorX="center"
          anchorY="middle"
        >
          {isLocked ? "LOCK=1" : "LOCK=0"}
        </Text>

        {/* Pomo de la Puerta (Manija giratoria) */}
        <group position={[1.8, 0.08, 0.08]} ref={handleRef}>
          <mesh position={[0, 0, 0.04]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.08]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.2} />
          </mesh>
          <mesh position={[-0.08, 0, 0.08]}>
            <boxGeometry args={[0.16, 0.035, 0.03]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.1} />
          </mesh>
        </group>
      </group>

      {/* Proceso 1 (Cliente A) */}
      <group position={[-0.4, 0.2, 2.5]} ref={p1Ref}>
        <mesh castShadow>
          <capsuleGeometry args={[0.22, 0.7, 8, 16]} />
          <meshStandardMaterial color="#38bdf8" roughness={0.3} metalness={0.4} />
        </mesh>
        <Text position={[0, 0.8, 0]} fontSize={0.12} color="#38bdf8" outlineWidth={0.005} outlineColor="#000">
          PROCESO P1
        </Text>
      </group>

      {/* Proceso 2 (Cliente B) */}
      <group position={[0.4, 0.2, 2.2]} ref={p2Ref}>
        <mesh castShadow>
          <capsuleGeometry args={[0.22, 0.7, 8, 16]} />
          <meshStandardMaterial color="#f97316" roughness={0.3} metalness={0.4} />
        </mesh>
        <Text position={[0, 0.8, 0]} fontSize={0.12} color="#f97316" outlineWidth={0.005} outlineColor="#000">
          PROCESO P2
        </Text>
      </group>
    </group>
  );
}

/**
 * BathroomLockApp — Aplicación Completa con Panel HTML Nativo
 * Los botones son elementos HTML DOM reales sin desfase de puntero ni matrices 3D CSS.
 */
export function BathroomLockApp() {
  const [isLocked, setIsLocked] = useState(false);
  const [p1Inside, setP1Inside] = useState(false);
  const [p2Spinning, setP2Spinning] = useState(false);
  const [spinAttempts, setSpinAttempts] = useState(0);
  const [traceStep, setTraceStep] = useState(0);

  const handleP1Enter = () => {
    setIsLocked(true);
    setP1Inside(true);
    setTraceStep(1);
  };

  const handleP2TryEnter = () => {
    if (isLocked) {
      setP2Spinning(true);
      setSpinAttempts(prev => prev + 1);
      setTraceStep(2);
    } else {
      setP2Spinning(false);
      setIsLocked(true);
      setTraceStep(4);
    }
  };

  const handleP1Exit = () => {
    setIsLocked(false);
    setP1Inside(false);
    setTraceStep(3);
  };

  const handleP2Acquire = () => {
    if (!isLocked) {
      setP2Spinning(false);
      setIsLocked(true);
      setTraceStep(4);
    }
  };

  const handleReset = () => {
    setIsLocked(false);
    setP1Inside(false);
    setP2Spinning(false);
    setSpinAttempts(0);
    setTraceStep(0);
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
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Key className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white tracking-tight">El Baño Digital</h3>
                <p className="text-[11px] text-slate-400">Test-and-Set Lock (Hardware)</p>
              </div>
            </div>

            {/* Badge de Estado del Candado */}
            <div className={`px-2.5 py-1 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 shadow-md ${
              isLocked
                ? "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
            }`}>
              {isLocked ? <ShieldAlert className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
              <span>lock = {isLocked ? "1 (Ocupado)" : "0 (Libre)"}</span>
            </div>
          </div>

          {/* Explicación de la Traza Didáctica */}
          <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed space-y-1.5 shadow-inner">
            <div className="text-[11px] font-bold text-blue-400 uppercase tracking-wider mb-1">
              Traza Paso a Paso:
            </div>
            {traceStep === 0 && (
              <p>
                <strong className="text-white">Paso 0 (Inicial):</strong> El baño está libre (<code className="text-emerald-400">lock = false</code>). Ningún cliente ha entrado.
              </p>
            )}
            {traceStep === 1 && (
              <p>
                <strong className="text-white">Paso 1:</strong> P1 ejecuta <code className="text-amber-300">TestAndSet(&lock)</code>. Retorna <code className="text-emerald-400">false</code> y fija <code className="text-rose-400">lock = true</code>. P1 ingresa a la Sección Crítica.
              </p>
            )}
            {traceStep === 2 && (
              <p>
                <strong className="text-amber-400">Paso 2 (Spinlock):</strong> P2 ejecuta <code className="text-amber-300">while(TestAndSet(&lock))</code>. Retorna <code className="text-rose-400">true</code>. P2 queda atrapado en espera activa girando el pomo (Intentos: {spinAttempts}).
              </p>
            )}
            {traceStep === 3 && (
              <p>
                <strong className="text-white">Paso 3:</strong> P1 finaliza su sección crítica y ejecuta <code className="text-emerald-400">lock = false</code>. La cerradura queda libre.
              </p>
            )}
            {traceStep === 4 && (
              <p>
                <strong className="text-emerald-400">Paso 4:</strong> En el siguiente intento de P2, <code className="text-amber-300">TestAndSet</code> retorna <code className="text-emerald-400">false</code>, fija <code className="text-rose-400">lock = true</code> y P2 entra al baño.
              </p>
            )}
          </div>

          {/* Botones de Control Interactivo con Clic Preciso */}
          <div className="space-y-2">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Acciones de los Procesos:
            </div>
            <div className="grid grid-cols-1 gap-2">
              <button
                onClick={handleP1Enter}
                disabled={p1Inside || isLocked}
                className="w-full py-2.5 px-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-30 disabled:hover:bg-blue-600 text-white rounded-xl font-medium text-xs flex items-center justify-between transition-colors shadow-md cursor-pointer"
              >
                <span>1. P1 Entra al Baño</span>
                <span className="text-[10px] font-mono opacity-80">[TestAndSet]</span>
              </button>

              <button
                onClick={handleP2TryEnter}
                disabled={!p1Inside}
                className="w-full py-2.5 px-3 bg-amber-600 hover:bg-amber-500 disabled:opacity-30 disabled:hover:bg-amber-600 text-white rounded-xl font-medium text-xs flex items-center justify-between transition-colors shadow-md cursor-pointer"
              >
                <span>2. P2 Gira Pomo repetidamente</span>
                <span className="text-[10px] font-mono opacity-80">[Spinlock]</span>
              </button>

              <button
                onClick={handleP1Exit}
                disabled={!p1Inside}
                className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-30 disabled:hover:bg-emerald-600 text-white rounded-xl font-medium text-xs flex items-center justify-between transition-colors shadow-md cursor-pointer"
              >
                <span>3. P1 Sale del Baño</span>
                <span className="text-[10px] font-mono opacity-80">[lock = 0]</span>
              </button>

              <button
                onClick={handleP2Acquire}
                disabled={isLocked || p1Inside}
                className="w-full py-2.5 px-3 bg-purple-600 hover:bg-purple-500 disabled:opacity-30 disabled:hover:bg-purple-600 text-white rounded-xl font-medium text-xs flex items-center justify-between transition-colors shadow-md cursor-pointer"
              >
                <span>4. P2 Adquiere Candado</span>
                <span className="text-[10px] font-mono opacity-80">[Ingresa]</span>
              </button>
            </div>
          </div>
        </div>

        {/* Pie del Panel: Explicación y Reset */}
        <div className="pt-3 border-t border-slate-800 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <ExplanationButton
              title="¿Qué representa cada elemento en El Baño?"
              items={[
                { element: "Puerta del Baño", description: "Representa la Sección Crítica: la zona de código donde solo un proceso puede ejecutarse a la vez.", color: "#334155" },
                { element: "Cerradura Digital (LED)", description: "Es la variable 'lock' en memoria compartida. Verde (lock=0) = libre. Rojo (lock=1) = ocupado.", color: "#00ff88" },
                { element: "Pomo de la Puerta", description: "Simboliza la instrucción TestAndSet(&lock): girar el pomo es ejecutar la instrucción atómica que lee y escribe en 1 ciclo.", color: "#cbd5e1" },
                { element: "Proceso P1 (Azul)", description: "Primer hilo/proceso que intenta entrar a la sección crítica. Ejecuta TestAndSet para adquirir el candado.", color: "#38bdf8" },
                { element: "Proceso P2 (Naranja)", description: "Segundo hilo que intenta entrar. Si está ocupado, queda girando el pomo repetidamente (Espera Activa / Spinlock).", color: "#f97316" },
                { element: "Vibración del Pomo", description: "Representa el Spinlock: while(TestAndSet(&lock)) — el proceso queda intentando repetidamente en un bucle activo.", color: "#fbbf24" }
              ]}
            />

            <button
              onClick={handleReset}
              className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
              title="Reiniciar Simulación"
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
            <Bathroom3DScene
              isLocked={isLocked}
              p1Inside={p1Inside}
              p2Spinning={p2Spinning}
              traceStep={traceStep}
            />
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
export function BathroomLockScene() {
  return <Bathroom3DScene />;
}
