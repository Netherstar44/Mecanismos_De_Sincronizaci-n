import { useState, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Loader } from "@/components/ui/loader";
import { RoomScene } from "@/components/3d/RoomScene";
import { VirtualDesktopOS } from "@/components/desktop/VirtualDesktopOS";
import { ProcessSchedulingMap } from "@/components/interactive/ProcessSchedulingMap";
import { AdvancedSyncLab3D } from "@/components/3d/AdvancedSyncLab3D";
import { CreditsOverlay } from "@/components/library/CreditsOverlay";
import { Monitor, Map as MapIcon, Cpu, Users, Info, BookOpen } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";

export default function Home() {
  const [viewMode, setViewMode] = useState<"room" | "pc">("room");
  const [initialApp, setInitialApp] = useState<string>("terminal");
  const [showCredits, setShowCredits] = useState(false);
  const [showLab, setShowLab] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Si estamos en modo PC, mostrar directamente el Sistema Operativo de Escritorio (SyncOS)
  if (viewMode === "pc") {
    return (
      <VirtualDesktopOS 
        onReturnToRoom={() => setViewMode("room")} 
        initialApp={initialApp}
      />
    );
  }

  return (
    <>
      <Loader />
      <main className="relative w-full h-screen bg-[#0d131f] overflow-hidden select-none font-sans">
        {/* ========================================================================= */}
        {/* BARRA SUPERIOR INTEGRADA (Limpia, elegante, no invasiva)                  */}
        {/* ========================================================================= */}
        <header className="absolute top-4 left-4 right-4 z-30 flex items-center justify-between pointer-events-auto">
          {/* Identificador del Proyecto */}
          <div className="flex items-center gap-3 bg-slate-900/80 backdrop-blur-xl border border-slate-700/60 px-4 py-2 rounded-2xl shadow-xl">
            <div className="w-8 h-8 rounded-xl overflow-hidden border border-cyan-500/40 flex items-center justify-center shadow-lg shadow-cyan-500/10 bg-slate-950 p-0.5">
              <img src="/favicon.svg" alt="SyncLab Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white tracking-tight">SyncLab</span>
                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  Sistemas Operativos
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-normal">
                Estación de Trabajo & Simuladores de Concurrencia 3D
              </p>
            </div>
          </div>

          {/* Botones de Navegación Rápida */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setInitialApp("terminal");
                setViewMode("pc");
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold tracking-wide backdrop-blur-md transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2 cursor-pointer"
            >
              <Monitor className="w-4 h-4" />
              <span>Entrar a la PC (SyncOS)</span>
            </button>

            <button
              onClick={() => {
                setInitialApp("theory");
                setViewMode("pc");
              }}
              className="px-3.5 py-2 bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 text-slate-200 rounded-xl text-xs font-medium tracking-wide backdrop-blur-md transition-all flex items-center gap-2 cursor-pointer shadow-md"
              title="Abrir la Guía Teórica de Concurrencia"
            >
              <BookOpen className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden sm:inline">Guía Teórica</span>
            </button>

            <button
              onClick={() => setShowMap(true)}
              className="px-3.5 py-2 bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 text-slate-200 rounded-xl text-xs font-medium tracking-wide backdrop-blur-md transition-all flex items-center gap-2 cursor-pointer shadow-md"
            >
              <MapIcon className="w-3.5 h-3.5 text-purple-400" />
              <span className="hidden sm:inline">Mapa Planificación</span>
            </button>

            <button
              onClick={() => setShowLab(true)}
              className="px-3.5 py-2 bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 text-slate-200 rounded-xl text-xs font-medium tracking-wide backdrop-blur-md transition-all flex items-center gap-2 cursor-pointer shadow-md"
            >
              <Cpu className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Laboratorio Técnico</span>
            </button>

            <button
              onClick={() => setShowCredits(true)}
              className="px-3.5 py-2 bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 text-slate-200 rounded-xl text-xs font-medium tracking-wide backdrop-blur-md transition-all flex items-center gap-2 cursor-pointer shadow-md"
              title="Autores y Referencias Bibliográficas APA"
            >
              <Users className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden md:inline">Autores & APA</span>
            </button>
          </div>
        </header>

        {/* ========================================================================= */}
        {/* ESCENA 3D DEL CUARTO DE INGENIERÍA                                        */}
        {/* ========================================================================= */}
        <div className="absolute inset-0">
          <Canvas
            shadows={!isMobile}
            dpr={isMobile ? 1 : [1, 1.5]}
            camera={{ position: [0, 2.3, 6.2], fov: 44 }}
            gl={{ antialias: true, powerPreference: "high-performance" }}
          >
            <Suspense fallback={null}>
              <RoomScene
                onFocusPC={() => setViewMode("pc")}
                onFocusMap={() => setShowMap(true)}
              />
              <OrbitControls
                enablePan={true}
                maxPolarAngle={Math.PI / 2.05}
                minDistance={3.2}
                maxDistance={11}
                target={[0, 1.4, -0.8]}
              />
            </Suspense>
          </Canvas>
        </div>

        {/* ========================================================================= */}
        {/* PILL INFORMATIVO INFERIOR (Discreto y útil)                               */}
        {/* ========================================================================= */}
        <div className="absolute bottom-5 left-0 right-0 flex justify-center z-20 pointer-events-none">
          <div className="bg-slate-900/85 backdrop-blur-md px-5 py-2 rounded-full border border-slate-700/70 text-slate-300 text-xs font-medium shadow-xl flex items-center gap-2.5">
            <Info className="w-4 h-4 text-blue-400 shrink-0" />
            <span className="hidden md:inline">
              Haz clic directamente en la <strong>Pantalla del PC</strong> para abrir el Sistema Operativo SyncOS o en el <strong>Mapa de la Pared</strong>
            </span>
            <span className="md:hidden">Toca la PC para abrir el Sistema Operativo</span>
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
