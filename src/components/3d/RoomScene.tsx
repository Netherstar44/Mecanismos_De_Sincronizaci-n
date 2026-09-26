import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, RoundedBox, Html } from "@react-three/drei";
import * as THREE from "three";

/**
 * RoomScene — Cuarto 3D de Ingeniería & Estación de Trabajo (Hacker Workstation)
 * 
 * Componentes 3D:
 * - Escritorio con PC Gamer / Workstation encendido con doble monitor.
 * - Mapa Holográfico en la pared con puntos de interés (Easter Eggs de Planificación).
 * - Torre de PC con ventiladores RGB luminosos.
 * - Silla gamer, teclado, mouse y lámpara.
 */
export function RoomScene({
  onFocusPC,
  onFocusMap
}: {
  onFocusPC: () => void;
  onFocusMap: () => void;
}) {
  const [hoveredPC, setHoveredPC] = useState(false);
  const [hoveredMap, setHoveredMap] = useState(false);

  const rgbFanRef = useRef<THREE.Group>(null);
  const mapPulseRef = useRef<THREE.PointLight>(null);

  useFrame((state, delta) => {
    // Giro de ventiladores de la torre
    if (rgbFanRef.current) {
      rgbFanRef.current.rotation.z += delta * 12;
    }

    // Pulso del mapa holográfico
    if (mapPulseRef.current) {
      mapPulseRef.current.intensity = 2.0 + Math.sin(state.clock.elapsedTime * 4) * 0.8;
    }
  });

  return (
    <group position={[0, -1, 0]}>
      {/* ========================================================================= */}
      {/* ILUMINACIÓN AMBIENTAL DEL CUARTO                                          */}
      {/* ========================================================================= */}
      <ambientLight intensity={0.4} />
      <pointLight position={[0, 4, 2]} intensity={1.8} color="#ffffff" distance={12} />
      <pointLight position={[-3, 2, 0]} intensity={2.5} color="#00ffff" distance={8} />
      <pointLight position={[3, 2, 0]} intensity={2.0} color="#9333ea" distance={8} />

      {/* ========================================================================= */}
      {/* ESTRUCTURA DE LA HABITACIÓN (Paredes, Piso)                               */}
      {/* ========================================================================= */}
      {/* Piso de Madera / Baldosa Oscura */}
      <mesh position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[14, 12]} />
        <meshStandardMaterial color="#0f172a" roughness={0.8} />
      </mesh>

      {/* Pared Trasera (Fondo) */}
      <mesh position={[0, 4, -4]} receiveShadow>
        <planeGeometry args={[14, 8]} />
        <meshStandardMaterial color="#060c18" roughness={0.9} />
      </mesh>

      {/* ========================================================================= */}
      {/* MAPA HOLOGRÁFICO TÁCTICO EN LA PARED (EASTER EGG DE PLANIFICACIÓN)        */}
      {/* ========================================================================= */}
      <group
        position={[0, 4.2, -3.9]}
        onPointerOver={() => { setHoveredMap(true); document.body.style.cursor = "pointer"; }}
        onPointerOut={() => { setHoveredMap(false); document.body.style.cursor = "auto"; }}
        onClick={onFocusMap}
      >
        <pointLight ref={mapPulseRef as any} position={[0, 0, 0.4]} color="#c084fc" distance={5} />

        {/* Marco del Mapa */}
        <RoundedBox args={[7.2, 3.2, 0.1]} radius={0.04}>
          <meshStandardMaterial color="#091124" roughness={0.3} metalness={0.8} />
        </RoundedBox>

        {/* Pantalla del Mapa con Grid */}
        <mesh position={[0, 0, 0.06]}>
          <planeGeometry args={[7.0, 3.0]} />
          <meshBasicMaterial color="#050a18" />
        </mesh>

        <Text
          position={[0, 1.25, 0.08]}
          fontSize={0.16}
          color="#c084fc"
          anchorX="center"
          outlineWidth={0.006}
          outlineColor="#000"
        >
          MAPA TÁCTICO // ALGORITMOS DE PLANIFICACIÓN EN LA CIUDAD (EASTER EGG)
        </Text>

        {/* 4 Puntos de Interés Interactivos en el Mapa */}
        {/* 1. Banco (FCFS) */}
        <group position={[-2.2, 0, 0.1]}>
          <mesh>
            <sphereGeometry args={[0.22, 16, 16]} />
            <meshBasicMaterial color="#38bdf8" />
          </mesh>
          <Text position={[0, -0.4, 0]} fontSize={0.12} color="#ffffff">
            BANCO: FCFS
          </Text>
        </group>

        {/* 2. Supermercado (SJF) */}
        <group position={[-0.8, -0.2, 0.1]}>
          <mesh>
            <sphereGeometry args={[0.22, 16, 16]} />
            <meshBasicMaterial color="#34d399" />
          </mesh>
          <Text position={[0, -0.4, 0]} fontSize={0.12} color="#ffffff">
            SUPER: SJF
          </Text>
        </group>

        {/* 3. Parque / Carrusel (Round Robin) */}
        <group position={[0.8, 0.2, 0.1]}>
          <mesh>
            <sphereGeometry args={[0.22, 16, 16]} />
            <meshBasicMaterial color="#fbbf24" />
          </mesh>
          <Text position={[0, -0.4, 0]} fontSize={0.12} color="#ffffff">
            PARQUE: RR
          </Text>
        </group>

        {/* 4. Hospital Urgencias (Prioridad) */}
        <group position={[2.2, -0.1, 0.1]}>
          <mesh>
            <sphereGeometry args={[0.22, 16, 16]} />
            <meshBasicMaterial color="#f43f5e" />
          </mesh>
          <Text position={[0, -0.4, 0]} fontSize={0.12} color="#ffffff">
            HOSPITAL: PRIO
          </Text>
        </group>

        {/* Botón flotante para abrir mapa */}
        <Html position={[0, -1.8, 0.2]} center transform distanceFactor={7}>
          <button
            onClick={onFocusMap}
            className={`px-4 py-1.5 rounded-full text-xs font-mono font-bold tracking-wider transition-all border cursor-pointer ${
              hoveredMap
                ? "bg-[#c084fc] text-black border-[#c084fc] shadow-[0_0_20px_#c084fc]"
                : "bg-black/80 text-[#c084fc] border-[#c084fc]/50 hover:bg-[#c084fc]/20"
            }`}
          >
            [ ABRIR MAPA DE PLANIFICACIÓN (EASTER EGG) ]
          </button>
        </Html>
      </group>

      {/* ========================================================================= */}
      {/* ESCRITORIO DE TRABAJO CON PC (WORKSTATION)                                */}
      {/* ========================================================================= */}
      <group position={[0, 0, -1]}>
        {/* Tablero del Escritorio */}
        <mesh position={[0, 1.3, 0]} castShadow receiveShadow>
          <boxGeometry args={[5.2, 0.12, 2.2]} />
          <meshStandardMaterial color="#1a202c" roughness={0.4} metalness={0.6} />
        </mesh>

        {/* Patas del Escritorio */}
        {[-2.4, 2.4].map((x, i) => (
          <group key={i} position={[x, 0.65, 0]}>
            <mesh position={[0, 0, -0.8]}>
              <boxGeometry args={[0.1, 1.2, 0.1]} />
              <meshStandardMaterial color="#0f172a" metalness={0.9} />
            </mesh>
            <mesh position={[0, 0, 0.8]}>
              <boxGeometry args={[0.1, 1.2, 0.1]} />
              <meshStandardMaterial color="#0f172a" metalness={0.9} />
            </mesh>
          </group>
        ))}

        {/* Torre de PC Gamer / Servidor (Derecha del escritorio) */}
        <group position={[2.0, 1.9, -0.2]}>
          <RoundedBox args={[0.55, 1.1, 0.9]} radius={0.03}>
            <meshStandardMaterial color="#0b0f19" roughness={0.2} metalness={0.9} />
          </RoundedBox>

          {/* Cristal Templado Lateral con Iluminación Interna */}
          <mesh position={[-0.28, 0, 0]}>
            <planeGeometry args={[0.8, 1.0]} />
            <meshStandardMaterial color="#00ffff" transparent opacity={0.3} metalness={0.9} />
          </mesh>

          {/* Ventilador Frontal con RGB giratorio */}
          <group position={[0, 0.15, 0.46]} ref={rgbFanRef}>
            <mesh>
              <ringGeometry args={[0.08, 0.18, 16]} />
              <meshBasicMaterial color="#00ff88" side={THREE.DoubleSide} />
            </mesh>
          </group>
        </group>

        {/* MONITOR 1 (Principal Curvo) — En el centro */}
        <group
          position={[0, 2.2, -0.4]}
          onPointerOver={() => { setHoveredPC(true); document.body.style.cursor = "pointer"; }}
          onPointerOut={() => { setHoveredPC(false); document.body.style.cursor = "auto"; }}
          onClick={onFocusPC}
        >
          {/* Marco y Soporte del Monitor */}
          <RoundedBox args={[2.8, 1.6, 0.1]} radius={0.02}>
            <meshStandardMaterial color="#0f172a" roughness={0.2} metalness={0.8} />
          </RoundedBox>
          <mesh position={[0, -0.9, 0]}>
            <cylinderGeometry args={[0.06, 0.08, 0.5]} />
            <meshStandardMaterial color="#1e293b" metalness={0.9} />
          </mesh>
          <mesh position={[0, -1.15, 0.1]}>
            <boxGeometry args={[0.8, 0.04, 0.4]} />
            <meshStandardMaterial color="#1e293b" metalness={0.9} />
          </mesh>

          {/* Pantalla Encendida (Simulando la interfaz del escritorio de SyncOS) */}
          <mesh position={[0, 0, 0.06]}>
            <planeGeometry args={[2.7, 1.5]} />
            <meshBasicMaterial color="#040916" />
          </mesh>

          {/* Luz que emite el monitor hacia el usuario */}
          <pointLight position={[0, 0, 0.5]} intensity={2.5} color="#00ffff" distance={4} />

          {/* Texto en Pantalla del Monitor */}
          <Text position={[0, 0.45, 0.08]} fontSize={0.12} color="#00ffff" anchorX="center">
            SYNC-OS // DESKTOP WORKSTATION
          </Text>
          <Text position={[0, 0.2, 0.08]} fontSize={0.09} color="#38bdf8" anchorX="center">
            Haga clic para interactuar con el Sistema Operativo
          </Text>

          {/* Mini iconos simulados en pantalla */}
          {[-0.9, -0.3, 0.3, 0.9].map((x, i) => (
            <mesh key={i} position={[x, -0.15, 0.08]}>
              <boxGeometry args={[0.2, 0.2, 0.02]} />
              <meshBasicMaterial color={i === 0 ? "#00ffff" : i === 1 ? "#00ff88" : i === 2 ? "#f59e0b" : "#c084fc"} />
            </mesh>
          ))}

          {/* Botón Flotante para Acceder al PC */}
          <Html position={[0, -0.5, 0.15]} center transform distanceFactor={5.5}>
            <button
              onClick={onFocusPC}
              className={`px-5 py-2 rounded-xl text-xs font-mono font-bold tracking-wider transition-all border cursor-pointer ${
                hoveredPC
                  ? "bg-[#00ffff] text-black border-[#00ffff] shadow-[0_0_25px_#00ffff] scale-105"
                  : "bg-[#091529]/90 text-[#00ffff] border-[#00ffff]/60 hover:bg-[#00ffff]/20"
              }`}
            >
              [ ENTRAR AL PC // INICIAR SyncOS ]
            </button>
          </Html>
        </group>

        {/* Teclado y Mouse sobre el escritorio */}
        <group position={[0, 1.38, 0.4]}>
          {/* Teclado */}
          <RoundedBox args={[1.2, 0.04, 0.4]} radius={0.01}>
            <meshStandardMaterial color="#090d16" roughness={0.3} metalness={0.7} />
          </RoundedBox>
          <mesh position={[0, 0.025, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[1.1, 0.32]} />
            <meshBasicMaterial color="#00ffff" />
          </mesh>

          {/* Mouse pad y Mouse */}
          <mesh position={[1.0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.5, 0.4]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
          <RoundedBox args={[0.15, 0.05, 0.24]} position={[1.0, 0.04, 0]} radius={0.02}>
            <meshStandardMaterial color="#0f172a" roughness={0.2} metalness={0.8} />
          </RoundedBox>
        </group>

        {/* Lámpara de Escritorio con Luz Focal */}
        <group position={[-2.0, 1.38, -0.4]}>
          <cylinderGeometry args={[0.15, 0.18, 0.04]} />
          <meshStandardMaterial color="#1e293b" metalness={0.9} />
          <mesh position={[0, 0.5, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 1.0]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
          <mesh position={[0.2, 1.0, 0]} rotation={[0, 0, -Math.PI / 4]}>
            <coneGeometry args={[0.18, 0.3, 16]} />
            <meshStandardMaterial color="#38bdf8" />
          </mesh>
          <spotLight position={[0.3, 0.9, 0]} target-position={[0, 1.3, 0]} intensity={2.5} color="#e0f2fe" distance={3} angle={0.8} />
        </group>
      </group>
    </group>
  );
}
