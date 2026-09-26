import { useState, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Loader } from "@/components/ui/loader";
import { RoomScene } from "@/components/3d/RoomScene";
import { VirtualDesktopOS } from "@/components/desktop/VirtualDesktopOS";
import { ProcessSchedulingMap } from "@/components/interactive/ProcessSchedulingMap";
import { AdvancedSyncLab3D } from "@/components/3d/AdvancedSyncLab3D";
import { CreditsOverlay } from "@/components/library/CreditsOverlay";
import { ZineText } from "@/components/ui/zine-text";
import { Monitor, Map as MapIcon, Layers, Users, Sparkles } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";

export default function Home() {
  const [viewMode, setViewMode] = useState<"room" | "pc">("room");
  const [showCredits, setShowCredits] = useState(false);
  const [showLab, setShowLab] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Si estamos en modo PC, mostrar directamente el Sistema Operativo de Escritorio
  if (viewMode === "pc") {
    return <VirtualDesktopOS onReturnToRoom={() => setViewMode("room")} />;
  }

  return (
    <>
      <Loader />
      <div className="noise-overlay" />

      <main className="relative w-full h-screen bg-[#060a12] overflow-hidden select-none font-mono">
        {/* HUD Superior Izquierdo */}
        <div className="absolute top-8 left-8 z-20 pointer-events-none mix-blend-difference">
          <div className="text-xs md:text-sm tracking-widest text-[#00ffff]/80 mb-1 flex items-center gap-2 drop-shadow-[0_0_8px_rgba(0,255,255,0.5)]">
            <span className="w-2 h-2 rounded-full bg-[#00ffff] animate-pulse" />
            LABORATORIO DE SISTEMAS OPERATIVOS // WORKSTATION 3D
          </div>
          <ZineText 
            text="SINCRONIZACIÓN" 
            className="text-3xl md:text-5xl lg:text-6xl text-white font-black"
          />
          <div className="text-[11px] text-white/60 tracking-wider mt-1">
            ESTACIÓN DE TRABAJO & SIMULADORES DE CONCURRENCIA
          </div>
        </div>

        {/* HUD Superior Derecho: Botones de Acción */}
        <div className="absolute top-8 right-8 z-20 flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setViewMode("pc")}
            className="px-4 py-2 bg-[#00ffff]/20 hover:bg-[#00ffff]/30 border border-[#00ffff]/50 rounded-xl text-[#00ffff] text-xs font-bold tracking-wider backdrop-blur-md transition-all shadow-[0_0_20px_rgba(0,255,255,0.2)] flex items-center gap-2 cursor-pointer"
          >
            <Monitor className="w-4 h-4" />
            [ ENTRAR A LA PC (SyncOS) ]
          </button>

          <button
            onClick={() => setShowMap(true)}
            className="px-4 py-2 bg-purple-600/30 hover:bg-purple-600/50 border border-purple-400/50 rounded-xl text-purple-200 text-xs font-bold tracking-wider backdrop-blur-md transition-all shadow-[0_0_20px_rgba(192,132,252,0.2)] flex items-center gap-2 cursor-pointer"
          >
            <MapIcon className="w-4 h-4" />
            [ MAPA PLANIFICACIÓN (EASTER EGG) ]
          </button>

          <button
            onClick={() => setShowLab(true)}
            className="px-3.5 py-2 bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-400/50 rounded-xl text-emerald-200 text-xs font-bold tracking-wider backdrop-blur-md transition-all shadow-[0_0_15px_rgba(52,211,153,0.2)] flex items-center gap-2 cursor-pointer"
          >
            <Layers className="w-4 h-4" />
            [ SANDBOX 3D ]
          </button>

          <button
            onClick={() => setShowCredits(true)}
            className="px-3.5 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white text-xs font-bold tracking-wider backdrop-blur-md transition-colors cursor-pointer"
          >
            <Users className="w-4 h-4" />
            [ AUTORES & APA ]
          </button>
        </div>

        {/* ========================================================================= */}
        {/* ESCENA 3D DEL CUARTO DE INGENIERÍA                                        */}
        {/* ========================================================================= */}
        <div className="absolute inset-0">
          <Canvas
            shadows={!isMobile}
            dpr={isMobile ? 1 : [1, 1.5]}
            camera={{ position: [0, 2.5, 6.5], fov: 45 }}
            gl={{ antialias: !isMobile, powerPreference: "high-performance" }}
          >
            <Suspense fallback={null}>
              <RoomScene
                onFocusPC={() => setViewMode("pc")}
                onFocusMap={() => setShowMap(true)}
              />
              <OrbitControls
                enablePan={true}
                maxPolarAngle={Math.PI / 2.05}
                minDistance={3.5}
                maxDistance={12}
                target={[0, 1.5, -1]}
              />
            </Suspense>
          </Canvas>
        </div>

        {/* Guía Inferior Flotante */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center z-20 pointer-events-none">
          <div className="bg-[#030811]/90 backdrop-blur-md px-6 py-2.5 rounded-full border border-[#00ffff]/40 text-[#00ffff] text-xs uppercase tracking-widest shadow-[0_0_25px_rgba(0,255,255,0.2)] flex items-center gap-3">
            <Sparkles className="w-4 h-4 animate-spin text-[#00ff88]" />
            <span className="hidden md:inline">
              Haz clic en la Pantalla del PC para entrar a SyncOS o en el Mapa de la Pared para ver los algoritmos
            </span>
            <span className="md:hidden">Toca la PC para entrar al Sistema Operativo</span>
          </div>
        </div>

        {/* Modales Flotantes */}
        {showMap && (
          <ProcessSchedulingMap onClose={() => setShowMap(false)} />
        )}

        {showLab && (
          <AdvancedSyncLab3D onClose={() => setShowLab(false)} />
        )}

        {showCredits && (
          <CreditsOverlay isOpen={showCredits} onClose={() => setShowCredits(false)} />
        )}
      </main>
    </>
  );
}
