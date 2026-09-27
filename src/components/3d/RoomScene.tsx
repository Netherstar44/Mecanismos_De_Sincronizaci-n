import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, RoundedBox } from "@react-three/drei";
import * as THREE from "three";

/**
 * RoomScene — Estación de Trabajo 3D Luminosa, Realista y Sin Textos Invasivos
 * 
 * Mejoras aplicadas:
 * - Iluminación cálida y clara de estudio (no más penumbra ni objetos oscurecidos).
 * - Escritorio de madera nogal con contraste definido para teclado, mouse y monitor.
 * - Torre de PC visible y detallada con chasis de aluminio, componentes internos y ventilador RGB.
 * - Pantalla de monitor con preview de escritorio realista (sin botones flotantes que la tapen).
 * - Interacción natural con cursor pointer y hover sutil.
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
  const ramPulseRef = useRef<THREE.MeshStandardMaterial>(null);

  useFrame((state, delta) => {
    // Giro suave del ventilador del PC
    if (rgbFanRef.current) {
      rgbFanRef.current.rotation.z += delta * 10;
    }

    // Respiración lumínica sutil de la RAM en la torre
    if (ramPulseRef.current) {
      ramPulseRef.current.emissiveIntensity = 0.8 + Math.sin(state.clock.elapsedTime * 3) * 0.4;
    }
  });

  return (
    <group position={[0, -0.9, 0]}>
      {/* ========================================================================= */}
      {/* ILUMINACIÓN GENERAL DE ESTUDIO (Cálida, Clara y Difusa)                   */}
      {/* ========================================================================= */}
      {/* Luz ambiente general brillante para que nada quede en negro */}
      <ambientLight intensity={1.4} color="#ffffff" />

      {/* Luz principal cálida desde arriba-derecha */}
      <directionalLight
        position={[4, 6, 5]}
        intensity={2.6}
        color="#fffbf0"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />

      {/* Luz de relleno suave desde la izquierda */}
      <directionalLight position={[-5, 4, 3]} intensity={1.6} color="#e0f2fe" />

      {/* Luz focal de la lámpara de escritorio */}
      <spotLight
        position={[-1.8, 2.5, -0.2]}
        target-position={[0, 1.4, -0.5]}
        intensity={2.8}
        color="#fef3c7"
        angle={0.65}
        penumbra={0.5}
        distance={6}
      />

      {/* ========================================================================= */}
      {/* ARQUITECTURA DE LA HABITACIÓN (Piso y Paredes Estéticas)                   */}
      {/* ========================================================================= */}
      {/* Piso de baldosas de estudio arquitectónico */}
      <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[16, 14]} />
        <meshStandardMaterial color="#1e293b" roughness={0.5} metalness={0.2} />
      </mesh>

      {/* Pared Trasera con tono neutro agradable (Slate suave) */}
      <mesh position={[0, 4, -4]} receiveShadow>
        <planeGeometry args={[16, 9]} />
        <meshStandardMaterial color="#131c2e" roughness={0.8} />
      </mesh>

      {/* Listones de madera acústica decorativa detrás del escritorio */}
      {[-2.8, -2.1, -1.4, -0.7, 0, 0.7, 1.4, 2.1, 2.8].map((x, i) => (
        <mesh key={i} position={[x, 3.8, -3.95]}>
          <boxGeometry args={[0.08, 4.5, 0.04]} />
          <meshStandardMaterial color="#5c3a21" roughness={0.7} />
        </mesh>
      ))}

      {/* ========================================================================= */}
      {/* MAPA TÁCTICO EN LA PARED (Limpio, integrado, no invasivo)                 */}
      {/* ========================================================================= */}
      <group
        position={[0, 4.3, -3.88]}
        onPointerOver={() => { setHoveredMap(true); document.body.style.cursor = "pointer"; }}
        onPointerOut={() => { setHoveredMap(false); document.body.style.cursor = "auto"; }}
        onClick={onFocusMap}
      >
        {/* Marco elegante de aluminio anodizado */}
        <RoundedBox args={[7.2, 2.8, 0.08]} radius={0.03}>
          <meshStandardMaterial color="#334155" roughness={0.3} metalness={0.8} />
        </RoundedBox>

        {/* Superficie del mapa iluminada */}
        <mesh position={[0, 0, 0.05]}>
          <planeGeometry args={[7.0, 2.6]} />
          <meshBasicMaterial color="#0f172a" />
        </mesh>

        {/* Título integrado y legible del mapa */}
        <Text
          position={[0, 1.05, 0.07]}
          fontSize={0.15}
          color={hoveredMap ? "#d8b4fe" : "#f1f5f9"}
          anchorX="center"
        >
          MAPA URBANO: ALGORITMOS DE PLANIFICACIÓN DE PROCESOS
        </Text>

        {/* 4 Puntos de Interés bien distribuidos */}
        <group position={[-2.3, -0.1, 0.08]}>
          <mesh>
            <sphereGeometry args={[0.2, 24, 24]} />
            <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={0.6} />
          </mesh>
          <Text position={[0, -0.34, 0]} fontSize={0.12} color="#e0f2fe" anchorX="center">
            BANCO: FCFS
          </Text>
        </group>

        <group position={[-0.8, 0.05, 0.08]}>
          <mesh>
            <sphereGeometry args={[0.2, 24, 24]} />
            <meshStandardMaterial color="#34d399" emissive="#059669" emissiveIntensity={0.6} />
          </mesh>
          <Text position={[0, -0.34, 0]} fontSize={0.12} color="#d1fae5" anchorX="center">
            SUPERMERCADO: SJF
          </Text>
        </group>

        <group position={[0.8, -0.05, 0.08]}>
          <mesh>
            <sphereGeometry args={[0.2, 24, 24]} />
            <meshStandardMaterial color="#fbbf24" emissive="#d97706" emissiveIntensity={0.6} />
          </mesh>
          <Text position={[0, -0.34, 0]} fontSize={0.12} color="#fef3c7" anchorX="center">
            PARQUE: ROUND ROBIN
          </Text>
        </group>

        <group position={[2.3, 0.05, 0.08]}>
          <mesh>
            <sphereGeometry args={[0.2, 24, 24]} />
            <meshStandardMaterial color="#f43f5e" emissive="#e11d48" emissiveIntensity={0.6} />
          </mesh>
          <Text position={[0, -0.34, 0]} fontSize={0.12} color="#ffe4e6" anchorX="center">
            URGENCIAS: PRIORIDAD
          </Text>
        </group>

        {/* Tooltip 3D nativo (sin Html Drei para evitar desfase del cursor) */}
        {hoveredMap && (
          <Text
            position={[0, -1.52, 0.12]}
            fontSize={0.1}
            color="#d8b4fe"
            anchorX="center"
            outlineWidth={0.006}
            outlineColor="#1e1b4b"
          >
            🗺️ Clic para abrir el mapa interactivo de planificación
          </Text>
        )}
      </group>

      {/* ========================================================================= */}
      {/* ESCRITORIO DE TRABAJO (Maderanogal con alto contraste)                    */}
      {/* ========================================================================= */}
      <group position={[0, 0, -1]}>
        {/* Tablero de Madera Nogal Elegante */}
        <mesh position={[0, 1.3, 0]} castShadow receiveShadow>
          <boxGeometry args={[5.2, 0.12, 2.2]} />
          <meshStandardMaterial color="#452718" roughness={0.35} metalness={0.1} />
        </mesh>

        {/* Patas metálicas industriales en negro mate */}
        {[-2.35, 2.35].map((x, i) => (
          <group key={i} position={[x, 0.65, 0]}>
            <mesh position={[0, 0, -0.8]} castShadow>
              <boxGeometry args={[0.08, 1.2, 0.08]} />
              <meshStandardMaterial color="#0f172a" roughness={0.4} metalness={0.8} />
            </mesh>
            <mesh position={[0, 0, 0.8]} castShadow>
              <boxGeometry args={[0.08, 1.2, 0.08]} />
              <meshStandardMaterial color="#0f172a" roughness={0.4} metalness={0.8} />
            </mesh>
            {/* Barra estabilizadora inferior */}
            <mesh position={[0, -0.55, 0]} castShadow>
              <boxGeometry args={[0.06, 0.06, 1.6]} />
              <meshStandardMaterial color="#0f172a" roughness={0.4} metalness={0.8} />
            </mesh>
          </group>
        ))}

        {/* Desk Mat (Tapete de cuero negro donde reposan teclado y mouse) */}
        <mesh position={[0, 1.365, 0.2]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[2.5, 1.1]} />
          <meshStandardMaterial color="#18181b" roughness={0.7} />
        </mesh>

        {/* ======================================================================= */}
        {/* TORRE DE PC (Chasis visible de aluminio + cristal templado + luces)      */}
        {/* ======================================================================= */}
        <group position={[2.0, 1.95, -0.2]}>
          {/* Chasis exterior gris titanio / grafito claro para que destaque */}
          <RoundedBox args={[0.55, 1.15, 0.9]} radius={0.03} castShadow receiveShadow>
            <meshStandardMaterial color="#2d3748" roughness={0.3} metalness={0.85} />
          </RoundedBox>

          {/* Panel frontal con rejilla de ventilación */}
          <mesh position={[0, 0, 0.46]}>
            <planeGeometry args={[0.48, 1.05]} />
            <meshStandardMaterial color="#1a202c" roughness={0.6} />
          </mesh>

          {/* Ventilador frontal con anillo RGB giratorio */}
          <group position={[0, 0.15, 0.47]} ref={rgbFanRef}>
            <mesh>
              <ringGeometry args={[0.08, 0.18, 24]} />
              <meshBasicMaterial color="#38bdf8" side={THREE.DoubleSide} />
            </mesh>
          </group>

          {/* Cristal lateral templado transparente */}
          <mesh position={[-0.28, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
            <planeGeometry args={[0.82, 1.05]} />
            <meshStandardMaterial
              color="#ffffff"
              transparent
              opacity={0.35}
              roughness={0.1}
              metalness={0.9}
            />
          </mesh>

          {/* Componentes internos iluminados dentro de la torre */}
          {/* Módulos de memoria RAM RGB */}
          <mesh position={[-0.1, 0.15, -0.05]}>
            <boxGeometry args={[0.04, 0.22, 0.08]} />
            <meshStandardMaterial
              ref={ramPulseRef as any}
              color="#10b981"
              emissive="#10b981"
              emissiveIntensity={1.0}
            />
          </mesh>

          {/* Tarjeta Gráfica con backplate plateado */}
          <mesh position={[-0.08, -0.15, 0.05]}>
            <boxGeometry args={[0.15, 0.08, 0.55]} />
            <meshStandardMaterial color="#64748b" metalness={0.9} roughness={0.2} />
          </mesh>
        </group>

        {/* ======================================================================= */}
        {/* MONITOR ULTRA-WIDE CURVO PRINCIPAL (Sin textos invasivos en medio)       */}
        {/* ======================================================================= */}
        <group
          position={[0, 2.25, -0.4]}
          onPointerOver={() => { setHoveredPC(true); document.body.style.cursor = "pointer"; }}
          onPointerOut={() => { setHoveredPC(false); document.body.style.cursor = "auto"; }}
          onClick={onFocusPC}
        >
          {/* Marco del Monitor en Aluminio Titanio */}
          <RoundedBox args={[2.9, 1.6, 0.08]} radius={0.02} castShadow>
            <meshStandardMaterial color="#1e293b" roughness={0.25} metalness={0.8} />
          </RoundedBox>

          {/* Peana y Soporte Metálico Robusto */}
          <mesh position={[0, -0.85, 0]}>
            <cylinderGeometry args={[0.05, 0.07, 0.45]} />
            <meshStandardMaterial color="#334155" metalness={0.9} roughness={0.2} />
          </mesh>
          <mesh position={[0, -1.08, 0.1]}>
            <boxGeometry args={[0.9, 0.03, 0.4]} />
            <meshStandardMaterial color="#334155" metalness={0.9} roughness={0.2} />
          </mesh>

          {/* Pantalla Encendida (Simulando una interfaz limpia y realista de SyncOS) */}
          <mesh position={[0, 0, 0.045]}>
            <planeGeometry args={[2.8, 1.5]} />
            <meshBasicMaterial color="#0f172a" />
          </mesh>

          {/* Contenido Visual Estético dentro de la Pantalla (Desktop Wallpaper + Ventanitas) */}
          {/* Fondo de pantalla degradado azul noche dentro del monitor */}
          <mesh position={[0, 0, 0.048]}>
            <planeGeometry args={[2.78, 1.48]} />
            <meshStandardMaterial
              color={hoveredPC ? "#1e3a8a" : "#172554"}
              roughness={0.3}
              emissive={hoveredPC ? "#2563eb" : "#1e40af"}
              emissiveIntensity={hoveredPC ? 0.35 : 0.15}
            />
          </mesh>

          {/* Mini ventana simulada de Código / Terminal en la pantalla */}
          <group position={[-0.45, 0.1, 0.052]}>
            <RoundedBox args={[1.2, 0.8, 0.005]} radius={0.02}>
              <meshBasicMaterial color="#020617" />
            </RoundedBox>
            {/* Barra de título de la mini ventana */}
            <mesh position={[0, 0.35, 0.004]}>
              <planeGeometry args={[1.18, 0.08]} />
              <meshBasicMaterial color="#0f172a" />
            </mesh>
            <Text position={[-0.5, 0.35, 0.006]} fontSize={0.04} color="#60a5fa" anchorX="left">
              terminal - bash
            </Text>
            {/* Líneas de código simuladas */}
            {[-0.2, -0.1, 0.0, 0.1, 0.2].map((y, idx) => (
              <mesh key={idx} position={[-0.1, -y, 0.006]}>
                <planeGeometry args={[0.7 - idx * 0.08, 0.025]} />
                <meshBasicMaterial color={idx === 0 ? "#10b981" : (idx === 2 ? "#38bdf8" : "#475569")} />
              </mesh>
            ))}
          </group>

          {/* Mini ventana de Simulador didáctico en la derecha de la pantalla */}
          <group position={[0.75, 0.05, 0.052]}>
            <RoundedBox args={[0.9, 0.9, 0.005]} radius={0.02}>
              <meshBasicMaterial color="#0b1329" />
            </RoundedBox>
            <Text position={[0, 0.38, 0.006]} fontSize={0.045} color="#34d399" anchorX="center">
              SyncOS v2.4 Active
            </Text>
            {/* Visualización de semáforos en la pantalla */}
            <mesh position={[0, 0.1, 0.006]}>
              <boxGeometry args={[0.5, 0.25, 0.005]} />
              <meshBasicMaterial color="#1e293b" />
            </mesh>
          </group>

          {/* Barra de tareas inferior dentro de la pantalla */}
          <mesh position={[0, -0.68, 0.05]}>
            <planeGeometry args={[2.78, 0.12]} />
            <meshBasicMaterial color="#020617" />
          </mesh>
          <Text position={[-1.25, -0.68, 0.052]} fontSize={0.045} color="#38bdf8" anchorX="left">
            [ KERNEL ]
          </Text>

          {/* Tooltip 3D nativo (sin Html Drei para evitar desfase del cursor) */}
          {hoveredPC && (
            <Text
              position={[0, -0.9, 0.22]}
              fontSize={0.09}
              color="#93c5fd"
              anchorX="center"
              outlineWidth={0.006}
              outlineColor="#1e3a8a"
            >
              🖥️ Haz clic para interactuar con la computadora
            </Text>
          )}
        </group>

        {/* ======================================================================= */}
        {/* PERIFÉRICOS (Teclado Mecánico y Mouse Ergonómico)                        */}
        {/* ======================================================================= */}
        <group position={[0, 1.38, 0.35]}>
          {/* Teclado mecánico con chasis gris oscuro */}
          <RoundedBox args={[1.3, 0.04, 0.42]} radius={0.015} castShadow>
            <meshStandardMaterial color="#1e293b" roughness={0.3} metalness={0.7} />
          </RoundedBox>
          {/* Bloque de teclas con retroiluminación azul tenue */}
          <mesh position={[0, 0.025, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[1.22, 0.34]} />
            <meshStandardMaterial color="#0f172a" emissive="#3b82f6" emissiveIntensity={0.15} />
          </mesh>

          {/* Mouse pad y Mouse óptico ergonómico */}
          <group position={[1.05, 0.03, 0]}>
            <RoundedBox args={[0.16, 0.05, 0.26]} radius={0.02} castShadow>
              <meshStandardMaterial color="#1e293b" roughness={0.2} metalness={0.8} />
            </RoundedBox>
            {/* Línea iluminada de la rueda de desplazamiento */}
            <mesh position={[0, 0.028, -0.04]}>
              <boxGeometry args={[0.02, 0.01, 0.05]} />
              <meshBasicMaterial color="#38bdf8" />
            </mesh>
          </group>
        </group>

        {/* ======================================================================= */}
        {/* LÁMPARA DE ESCRITORIO (Diseño moderno arquitectónico)                     */}
        {/* ======================================================================= */}
        <group position={[-2.0, 1.38, -0.3]}>
          {/* Base pesada de metal */}
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[0.16, 0.18, 0.03, 24]} />
            <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.2} />
          </mesh>
          
          {/* Brazo articulado */}
          <mesh position={[0, 0.45, 0]} castShadow>
            <cylinderGeometry args={[0.02, 0.02, 0.9]} />
            <meshStandardMaterial color="#334155" metalness={0.9} />
          </mesh>
          {/* Cabezal cónico con luz cálida dirigida */}
          <mesh position={[0.2, 0.9, 0]} rotation={[0, 0, -Math.PI / 4]} castShadow>
            <coneGeometry args={[0.16, 0.28, 20]} />
            <meshStandardMaterial color="#475569" metalness={0.8} />
          </mesh>
        </group>
      </group>
    </group>
  );
}
