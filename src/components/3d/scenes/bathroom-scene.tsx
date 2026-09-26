import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, RoundedBox, Html } from "@react-three/drei";
import * as THREE from "three";

/**
 * BathroomLockScene — Simulador Didáctico 3D:
 * "El Baño de una Tienda y la Cerradura Digital" (Test-and-Set Lock)
 * 
 * Analogía del Hardware TSL:
 * - lock = false: El baño está libre (Cerradura en verde).
 * - TestAndSet(&lock): Girar el pomo y pasar el seguro en 1 movimiento atómico.
 * - while(TestAndSet(&lock)): Cliente B atrapado en espera activa (girando el pomo repetidamente).
 * - lock = false: Cliente A sale y abre el pestillo.
 */
export function BathroomLockScene() {
  const [isLocked, setIsLocked] = useState(false);
  const [p1Inside, setP1Inside] = useState(false);
  const [p2Spinning, setP2Spinning] = useState(false);
  const [spinAttempts, setSpinAttempts] = useState(0);
  const [traceStep, setTraceStep] = useState(0);

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

  // Acciones didácticas interactivas
  const handleP1Enter = () => {
    // TestAndSet(&lock) retorna false -> lock pasa a true
    setIsLocked(true);
    setP1Inside(true);
    setTraceStep(1);
  };

  const handleP2TryEnter = () => {
    if (isLocked) {
      // TestAndSet(&lock) retorna true -> entra en spinlock
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
    // lock = false
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
    <group position={[0, -0.6, 0]}>
      {/* Luces de la escena */}
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

      {/* Panel Interactivo Flotante (HTML UI en 3D) */}
      <Html position={[0, -0.9, 1.2]} center transform distanceFactor={5.5}>
        <div className="w-[390px] bg-[#030811]/95 backdrop-blur-md p-4 rounded-xl border border-[#00ffff]/40 shadow-[0_0_25px_rgba(0,255,255,0.2)] text-white font-mono text-xs select-none">
          <div className="flex justify-between items-center border-b border-[#00ffff]/30 pb-2 mb-3">
            <span className="text-[#00ffff] font-bold tracking-wider">HARDWARE TEST-AND-SET // TRAZA</span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${isLocked ? "bg-red-500/20 text-red-400 border border-red-500/40" : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"}`}>
              lock = {isLocked ? "true (Ocupado)" : "false (Libre)"}
            </span>
          </div>

          {/* Estado de la traza didáctica */}
          <div className="bg-black/50 p-2.5 rounded border border-white/10 mb-3 text-[11px] leading-relaxed">
            {traceStep === 0 && (
              <span className="text-white/80">
                <strong className="text-cyan-400">Paso 0 (Inicial):</strong> El baño está libre (<code className="text-emerald-400">lock = false</code>). Ningún cliente ha entrado.
              </span>
            )}
            {traceStep === 1 && (
              <span className="text-white/80">
                <strong className="text-cyan-400">Paso 1:</strong> P1 ejecuta <code className="text-yellow-300">TestAndSet(&lock)</code>. Retorna <code className="text-emerald-400">false</code> y fija <code className="text-red-400">lock = true</code>. P1 ingresa a la Sección Crítica.
              </span>
            )}
            {traceStep === 2 && (
              <span className="text-white/80">
                <strong className="text-orange-400">Paso 2 (Spinlock):</strong> P2 ejecuta <code className="text-yellow-300">while(TestAndSet(&lock))</code>. Retorna <code className="text-red-400">true</code>. P2 gira el pomo repetidamente en espera activa (Intentos: {spinAttempts}).
              </span>
            )}
            {traceStep === 3 && (
              <span className="text-white/80">
                <strong className="text-cyan-400">Paso 3:</strong> P1 finaliza y ejecuta <code className="text-emerald-400">lock = false</code>. La cerradura queda libre.
              </span>
            )}
            {traceStep === 4 && (
              <span className="text-white/80">
                <strong className="text-emerald-400">Paso 4:</strong> En el siguiente intento de P2, <code className="text-yellow-300">TestAndSet</code> retorna <code className="text-emerald-400">false</code>, fija <code className="text-red-400">lock = true</code> y P2 entra al baño.
              </span>
            )}
          </div>

          {/* Botones de control interactivo */}
          <div className="grid grid-cols-2 gap-2 text-[10px]">
            <button
              onClick={handleP1Enter}
              disabled={p1Inside || isLocked}
              className="px-2 py-1.5 bg-cyan-600/30 hover:bg-cyan-600/50 disabled:opacity-30 border border-cyan-400/50 rounded text-cyan-200 transition-colors"
            >
              1. P1 Entra [TestAndSet]
            </button>
            <button
              onClick={handleP2TryEnter}
              disabled={!p1Inside}
              className="px-2 py-1.5 bg-orange-600/30 hover:bg-orange-600/50 disabled:opacity-30 border border-orange-400/50 rounded text-orange-200 transition-colors"
            >
              2. P2 Gira Pomo [Spinlock]
            </button>
            <button
              onClick={handleP1Exit}
              disabled={!p1Inside}
              className="px-2 py-1.5 bg-emerald-600/30 hover:bg-emerald-600/50 disabled:opacity-30 border border-emerald-400/50 rounded text-emerald-200 transition-colors"
            >
              3. P1 Sale [lock = false]
            </button>
            <button
              onClick={handleP2Acquire}
              disabled={isLocked || p1Inside}
              className="px-2 py-1.5 bg-purple-600/30 hover:bg-purple-600/50 disabled:opacity-30 border border-purple-400/50 rounded text-purple-200 transition-colors"
            >
              4. P2 Adquiere Candado
            </button>
          </div>

          <div className="mt-2.5 flex justify-end">
            <button
              onClick={handleReset}
              className="text-[10px] text-white/50 hover:text-white underline"
            >
              Reiniciar Simulación
            </button>
          </div>
        </div>
      </Html>
    </group>
  );
}
