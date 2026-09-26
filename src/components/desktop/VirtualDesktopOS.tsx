import { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { 
  Terminal as TerminalIcon, 
  Cpu, 
  BookOpen, 
  Map as MapIcon, 
  Car, 
  Key, 
  Box, 
  AlertTriangle, 
  Users, 
  Maximize2, 
  Minimize2, 
  X, 
  Minus, 
  Power,
  RotateCcw,
  Sparkles,
  Layers
} from "lucide-react";

import { BathroomLockScene } from "@/components/3d/scenes/bathroom-scene";
import { ParkingCounterScene } from "@/components/3d/scenes/parking-scene";
import { ProducerConsumerScene } from "@/components/3d/scenes/producer-consumer-scene";
import { TSLHardwareScene } from "@/components/3d/scenes/tsl-scene";
import { DeadlockGraphScene } from "@/components/3d/scenes/deadlock-scene";
import { RaceConditionScene } from "@/components/3d/scenes/race-condition-scene";
import { KernelTerminal } from "./KernelTerminal";
import { ProcessSchedulingMap } from "@/components/interactive/ProcessSchedulingMap";
import { AdvancedSyncLab3D } from "@/components/3d/AdvancedSyncLab3D";
import { libraryBooks } from "@/data/library-books";

interface OpenWindow {
  id: string;
  title: string;
  icon: any;
  component: React.ReactNode;
  isMaximized?: boolean;
}

export function VirtualDesktopOS({ onReturnToRoom }: { onReturnToRoom: () => void }) {
  const [activeWindows, setActiveWindows] = useState<OpenWindow[]>([]);
  const [focusedWindowId, setFocusedWindowId] = useState<string | null>(null);
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const [time, setTime] = useState("");
  const [showEasterEggMap, setShowEasterEggMap] = useState(false);
  const [showAdvancedLab, setShowAdvancedLab] = useState(false);
  const [selectedTheoryBookId, setSelectedTheoryBookId] = useState<string>("tsl-intro");

  // Reloj de la barra de tareas
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("es-ES", { hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Abrir ventana por defecto (Terminal o bienvenida)
  useEffect(() => {
    openWindow("terminal");
  }, []);

  const openWindow = (appId: string) => {
    setStartMenuOpen(false);

    // Si ya está abierta, traer al frente
    const existing = activeWindows.find(w => w.id === appId);
    if (existing) {
      setFocusedWindowId(appId);
      return;
    }

    let win: OpenWindow | null = null;

    switch (appId) {
      case "terminal":
        win = {
          id: "terminal",
          title: "Terminal Shell CLI // /bin/bash",
          icon: TerminalIcon,
          component: (
            <KernelTerminal
              onOpenMap={() => setShowEasterEggMap(true)}
              onOpenSim={(id) => openWindow(id)}
            />
          )
        };
        break;

      case "bathroom":
        win = {
          id: "bathroom",
          title: "Simulador 3D: El Baño Digital (Test-and-Set Lock)",
          icon: Key,
          component: (
            <div className="w-full h-full relative bg-[#02050b]">
              <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                <Suspense fallback={null}>
                  <BathroomLockScene />
                </Suspense>
              </Canvas>
            </div>
          )
        };
        break;

      case "parking":
        win = {
          id: "parking",
          title: "Simulador 3D: Estacionamiento Contador (Semáforos)",
          icon: Car,
          component: (
            <div className="w-full h-full relative bg-[#02050b]">
              <Canvas camera={{ position: [0, 0, 5.5], fov: 45 }}>
                <Suspense fallback={null}>
                  <ParkingCounterScene />
                </Suspense>
              </Canvas>
            </div>
          )
        };
        break;

      case "producer":
        win = {
          id: "producer",
          title: "Simulador 3D: Productor-Consumidor (Búfer N=5)",
          icon: Box,
          component: (
            <div className="w-full h-full relative bg-[#02050b]">
              <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                <Suspense fallback={null}>
                  <ProducerConsumerScene />
                </Suspense>
              </Canvas>
            </div>
          )
        };
        break;

      case "tsl_hardware":
        win = {
          id: "tsl_hardware",
          title: "Simulador 3D: Arquitectura DPRAM & Bus Atómico",
          icon: Cpu,
          component: (
            <div className="w-full h-full relative bg-[#02050b]">
              <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                <Suspense fallback={null}>
                  <TSLHardwareScene />
                </Suspense>
              </Canvas>
            </div>
          )
        };
        break;

      case "race_deadlock":
        win = {
          id: "race_deadlock",
          title: "Simulador 3D: Condiciones de Carrera & Deadlocks",
          icon: AlertTriangle,
          component: (
            <div className="w-full h-full grid grid-cols-1 md:grid-cols-2 bg-[#02050b] divide-y md:divide-y-0 md:divide-x divide-white/10">
              <div className="h-full relative">
                <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                  <Suspense fallback={null}>
                    <RaceConditionScene />
                  </Suspense>
                </Canvas>
              </div>
              <div className="h-full relative">
                <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                  <Suspense fallback={null}>
                    <DeadlockGraphScene />
                  </Suspense>
                </Canvas>
              </div>
            </div>
          )
        };
        break;

      case "theory":
        win = {
          id: "theory",
          title: "Guía de Concurrencia // Teoría, Algoritmos & Citas APA",
          icon: BookOpen,
          component: (
            <TheoryExplorerWindow
              selectedBookId={selectedTheoryBookId}
              onSelectBook={setSelectedTheoryBookId}
            />
          )
        };
        break;

      case "authors":
        win = {
          id: "authors",
          title: "Registro de Autores & Bibliografía APA 7ma Edición",
          icon: Users,
          component: <AuthorsAndBiblioWindow />
        };
        break;

      case "easteregg":
        setShowEasterEggMap(true);
        return;

      case "advanced_lab":
        setShowAdvancedLab(true);
        return;
    }

    if (win) {
      setActiveWindows(prev => [...prev, win!]);
      setFocusedWindowId(win.id);
    }
  };

  const closeWindow = (id: string) => {
    setActiveWindows(prev => prev.filter(w => w.id !== id));
    if (focusedWindowId === id) {
      const remaining = activeWindows.filter(w => w.id !== id);
      setFocusedWindowId(remaining.length > 0 ? remaining[remaining.length - 1].id : null);
    }
  };

  const toggleMaximize = (id: string) => {
    setActiveWindows(prev =>
      prev.map(w => (w.id === id ? { ...w, isMaximized: !w.isMaximized } : w))
    );
  };

  return (
    <div className="relative w-full h-screen bg-[#050a14] overflow-hidden select-none font-mono text-white flex flex-col justify-between">
      {/* Fondo de Pantalla Cyberpunk / High-Tech Desktop */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(to right, #00ffff 1px, transparent 1px), linear-gradient(to bottom, #00ffff 1px, transparent 1px)",
          backgroundSize: "60px 60px"
        }}
      />
      <div className="absolute inset-0 bg-radial from-transparent via-[#03060c]/80 to-[#020408] pointer-events-none" />

      {/* Marca de Agua de Fondo */}
      <div className="absolute right-12 bottom-20 text-right opacity-10 pointer-events-none">
        <div className="text-7xl font-black text-[#00ffff]">SYNC_OS</div>
        <div className="text-xl tracking-widest text-white mt-1">KERNEL CONCURRENCY WORKSTATION</div>
      </div>

      {/* ========================================================================= */}
      {/* ICONOS DEL ESCRITORIO                                                     */}
      {/* ========================================================================= */}
      <div className="relative z-10 p-6 grid grid-flow-col grid-rows-6 gap-6 w-max">
        <DesktopIcon
          icon={TerminalIcon}
          label="Terminal Shell"
          color="text-[#00ffff]"
          onClick={() => openWindow("terminal")}
        />
        <DesktopIcon
          icon={Key}
          label="El Baño (TSL)"
          color="text-[#38bdf8]"
          onClick={() => openWindow("bathroom")}
        />
        <DesktopIcon
          icon={Car}
          label="Parking Dijkstra"
          color="text-[#00ff88]"
          onClick={() => openWindow("parking")}
        />
        <DesktopIcon
          icon={Box}
          label="Prod-Consumidor"
          color="text-[#f59e0b]"
          onClick={() => openWindow("producer")}
        />
        <DesktopIcon
          icon={Cpu}
          label="DPRAM Hardware"
          color="text-[#818cf8]"
          onClick={() => openWindow("tsl_hardware")}
        />
        <DesktopIcon
          icon={AlertTriangle}
          label="Carrera & Deadlock"
          color="text-[#f43f5e]"
          onClick={() => openWindow("race_deadlock")}
        />
        <DesktopIcon
          icon={BookOpen}
          label="Guía Teórica"
          color="text-[#a78bfa]"
          onClick={() => openWindow("theory")}
        />
        <DesktopIcon
          icon={MapIcon}
          label="Mapa Planificación"
          badge="Easter Egg"
          color="text-[#c084fc]"
          onClick={() => setShowEasterEggMap(true)}
        />
        <DesktopIcon
          icon={Layers}
          label="Sandbox Técnico"
          color="text-[#34d399]"
          onClick={() => setShowAdvancedLab(true)}
        />
        <DesktopIcon
          icon={Users}
          label="Autores & APA"
          color="text-white"
          onClick={() => openWindow("authors")}
        />
      </div>

      {/* ========================================================================= */}
      {/* GESTOR DE VENTANAS ACTIVAS                                                */}
      {/* ========================================================================= */}
      <div className="absolute inset-0 pointer-events-none p-4 md:p-8 flex items-center justify-center">
        {activeWindows.map((win) => {
          const isFocused = focusedWindowId === win.id;
          const Icon = win.icon;

          return (
            <div
              key={win.id}
              onClick={() => setFocusedWindowId(win.id)}
              style={{ zIndex: isFocused ? 40 : 20 }}
              className={`pointer-events-auto absolute rounded-xl overflow-hidden border shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col transition-all duration-200 ${
                win.isMaximized
                  ? "inset-4 md:inset-8"
                  : "w-[94vw] md:w-[850px] lg:w-[960px] h-[78vh] md:h-[620px]"
              } ${
                isFocused
                  ? "border-[#00ffff]/60 shadow-[0_0_30px_rgba(0,255,255,0.2)]"
                  : "border-white/20 opacity-80 hover:opacity-100"
              } bg-[#040813]/95 backdrop-blur-xl`}
            >
              {/* Barra de Título de la Ventana */}
              <div className="h-10 bg-[#061022] border-b border-white/10 px-4 flex items-center justify-between select-none">
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-[#00ffff]" />
                  <span className="text-xs font-bold text-white tracking-wider truncate max-w-xs md:max-w-md">
                    {win.title}
                  </span>
                </div>

                {/* Botones de Ventana (Estilo Mac / Linux) */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleMaximize(win.id); }}
                    className="w-3.5 h-3.5 rounded-full bg-amber-500/80 hover:bg-amber-400 flex items-center justify-center text-black"
                    title="Maximizar"
                  >
                    <Maximize2 className="w-2 h-2 opacity-0 hover:opacity-100" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); closeWindow(win.id); }}
                    className="w-3.5 h-3.5 rounded-full bg-rose-500/80 hover:bg-rose-400 flex items-center justify-center text-black"
                    title="Cerrar"
                  >
                    <X className="w-2.5 h-2.5 opacity-0 hover:opacity-100" />
                  </button>
                </div>
              </div>

              {/* Contenido de la Ventana */}
              <div className="flex-1 w-full h-full overflow-hidden relative">
                {win.component}
              </div>
            </div>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* BARRA DE TAREAS INFERIOR (TASKBAR)                                        */}
      {/* ========================================================================= */}
      <footer className="relative z-50 h-12 bg-[#02050c]/90 border-t border-[#00ffff]/30 backdrop-blur-md px-4 flex items-center justify-between">
        {/* Botón Menú Inicio "KERNEL" */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setStartMenuOpen(!startMenuOpen)}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-2 text-xs font-bold border transition-all cursor-pointer ${
              startMenuOpen
                ? "bg-[#00ffff] text-black border-[#00ffff] shadow-[0_0_15px_#00ffff]"
                : "bg-[#091529] text-[#00ffff] border-[#00ffff]/40 hover:bg-[#00ffff]/20"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>KERNEL</span>
          </button>

          {/* Separador */}
          <div className="h-5 w-px bg-white/20 mx-1" />

          {/* Pestañas de Ventanas Abiertas */}
          <div className="flex items-center gap-1.5 overflow-x-auto max-w-xl">
            {activeWindows.map(win => {
              const Icon = win.icon;
              const isFocused = focusedWindowId === win.id;
              return (
                <button
                  key={win.id}
                  onClick={() => setFocusedWindowId(win.id)}
                  className={`px-2.5 py-1 rounded text-xs flex items-center gap-1.5 border transition-all truncate max-w-36 ${
                    isFocused
                      ? "bg-[#00ffff]/20 text-[#00ffff] border-[#00ffff]/60 font-bold"
                      : "bg-white/5 text-white/60 border-white/10 hover:text-white"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="truncate">{win.title.split("//")[0].split(":")[0]}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* System Tray (Reloj, CPU, Botón Volver al Cuarto 3D) */}
        <div className="flex items-center gap-4 text-xs">
          <div className="hidden md:flex items-center gap-2 text-white/60 text-[11px]">
            <span>CPU: <strong className="text-emerald-400">14%</strong></span>
            <span>MEM: <strong className="text-cyan-400">2.1 GB</strong></span>
          </div>

          <div className="text-white font-bold tracking-wider px-2 py-0.5 rounded bg-black/50 border border-white/10">
            {time}
          </div>

          {/* Botón Salir al Cuarto 3D */}
          <button
            onClick={onReturnToRoom}
            className="px-3 py-1 bg-purple-600/30 hover:bg-purple-600/50 border border-purple-400/50 text-purple-200 rounded text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Volver a la vista del cuarto de ingeniería"
          >
            <Power className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Vista Cuarto 3D</span>
          </button>
        </div>

        {/* Menú de Inicio Desplegable */}
        {startMenuOpen && (
          <div className="absolute bottom-14 left-4 w-72 bg-[#040916]/95 backdrop-blur-2xl border border-[#00ffff]/40 rounded-xl p-4 shadow-[0_0_30px_rgba(0,0,0,0.9)] space-y-3 z-50">
            <div className="border-b border-white/10 pb-2 flex items-center gap-2 text-[#00ffff]">
              <Cpu className="w-5 h-5" />
              <div>
                <div className="font-bold text-xs">KERNEL-OS v2.4</div>
                <div className="text-[10px] text-white/50">Mecanismos de Sincronización</div>
              </div>
            </div>

            <div className="space-y-1 text-xs">
              <button
                onClick={() => openWindow("terminal")}
                className="w-full text-left p-2 rounded hover:bg-white/10 flex items-center gap-2.5 text-white/80 hover:text-white"
              >
                <TerminalIcon className="w-4 h-4 text-[#00ffff]" /> Terminal de Comandos (CLI)
              </button>
              <button
                onClick={() => openWindow("bathroom")}
                className="w-full text-left p-2 rounded hover:bg-white/10 flex items-center gap-2.5 text-white/80 hover:text-white"
              >
                <Key className="w-4 h-4 text-[#38bdf8]" /> El Baño Digital (TSL)
              </button>
              <button
                onClick={() => openWindow("parking")}
                className="w-full text-left p-2 rounded hover:bg-white/10 flex items-center gap-2.5 text-white/80 hover:text-white"
              >
                <Car className="w-4 h-4 text-[#00ff88]" /> Parking de Dijkstra (Semáforos)
              </button>
              <button
                onClick={() => openWindow("producer")}
                className="w-full text-left p-2 rounded hover:bg-white/10 flex items-center gap-2.5 text-white/80 hover:text-white"
              >
                <Box className="w-4 h-4 text-[#f59e0b]" /> Productor-Consumidor (N=5)
              </button>
              <button
                onClick={() => setShowEasterEggMap(true)}
                className="w-full text-left p-2 rounded hover:bg-white/10 flex items-center gap-2.5 text-purple-300 font-bold"
              >
                <MapIcon className="w-4 h-4 text-purple-400" /> Mapa Planificación (Easter Egg)
              </button>
              <button
                onClick={() => setShowAdvancedLab(true)}
                className="w-full text-left p-2 rounded hover:bg-white/10 flex items-center gap-2.5 text-emerald-300 font-bold"
              >
                <Layers className="w-4 h-4 text-emerald-400" /> Sandbox Técnico 3D
              </button>
              <button
                onClick={() => openWindow("authors")}
                className="w-full text-left p-2 rounded hover:bg-white/10 flex items-center gap-2.5 text-white/80 hover:text-white"
              >
                <Users className="w-4 h-4 text-cyan-300" /> Autores & Bibliografía APA
              </button>
            </div>

            <div className="border-t border-white/10 pt-2 text-[10px] text-white/40 flex justify-between">
              <span>Desarrollado para Sistemas Operativos</span>
              <button onClick={onReturnToRoom} className="text-purple-400 hover:underline">
                Salir al Cuarto
              </button>
            </div>
          </div>
        )}
      </footer>

      {/* Modales a Pantalla Completa (Easter Egg Map y Advanced Lab) */}
      {showEasterEggMap && (
        <ProcessSchedulingMap onClose={() => setShowEasterEggMap(false)} />
      )}

      {showAdvancedLab && (
        <AdvancedSyncLab3D onClose={() => setShowAdvancedLab(false)} />
      )}
    </div>
  );
}

// Subcomponente de icono de escritorio
function DesktopIcon({
  icon: Icon,
  label,
  color,
  badge,
  onClick
}: {
  icon: any;
  label: string;
  color: string;
  badge?: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center p-3 rounded-xl hover:bg-white/10 transition-all group w-24 text-center cursor-pointer relative"
    >
      {badge && (
        <span className="absolute -top-1 right-0 text-[8px] bg-purple-500/80 text-white font-bold px-1.5 py-0.5 rounded-full">
          {badge}
        </span>
      )}
      <div className="w-12 h-12 rounded-xl bg-[#09152b] border border-white/10 group-hover:border-[#00ffff] flex items-center justify-center mb-2 shadow-lg group-hover:scale-110 transition-transform">
        <Icon className={`w-6 h-6 ${color}`} />
      </div>
      <span className="text-[11px] text-white/80 group-hover:text-white font-bold leading-tight drop-shadow-md">
        {label}
      </span>
    </button>
  );
}

// Subcomponente para explorar los 14 temas teóricos con citas dentro de una ventana
function TheoryExplorerWindow({
  selectedBookId,
  onSelectBook
}: {
  selectedBookId: string;
  onSelectBook: (id: string) => void;
}) {
  const book = libraryBooks.find(b => b.id === selectedBookId) || libraryBooks[0];

  return (
    <div className="w-full h-full flex flex-col md:flex-row overflow-hidden bg-[#040916]">
      {/* Lista lateral de temas */}
      <div className="w-full md:w-72 border-b md:border-b-0 md:border-r border-white/10 p-4 overflow-y-auto space-y-3 bg-[#030610]/80">
        <div className="text-xs text-[#00ffff] font-bold tracking-wider uppercase border-b border-white/10 pb-2">
          ÍNDICE DE CONTENIDOS
        </div>
        <div className="space-y-1">
          {libraryBooks.map(b => (
            <button
              key={b.id}
              onClick={() => onSelectBook(b.id)}
              className={`w-full text-left p-2 rounded text-xs transition-colors flex items-center justify-between ${
                b.id === book.id
                  ? "bg-[#00ffff]/20 text-[#00ffff] font-bold border border-[#00ffff]/40"
                  : "text-white/70 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span className="truncate">{b.title}</span>
              <span className={`text-[9px] px-1 py-0.2 rounded ${b.shelf === 1 ? "bg-blue-500/20 text-blue-300" : "bg-emerald-500/20 text-emerald-300"}`}>
                {b.shelf === 1 ? "HW" : "SO"}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Contenido Teórico */}
      <div className="flex-1 p-6 overflow-y-auto space-y-6 text-white font-sans">
        <div className="border-b border-white/10 pb-4">
          <div className="text-xs font-mono text-[#00ffff] tracking-widest uppercase mb-1">
            {book.shelf === 1 ? "GRUPO 1: TEST-AND-SET (NIVEL HARDWARE)" : "GRUPO 2: SEMÁFOROS (NIVEL SOFTWARE / SO)"}
          </div>
          <h2 className="text-2xl font-bold text-white font-serif">{book.title}</h2>
          <p className="text-xs font-mono text-white/50 mt-1">{book.summary}</p>
        </div>

        <div className="space-y-4 text-white/80 leading-relaxed text-sm">
          {book.content.split("\n\n").map((par, i) => (
            <p key={i}>{par}</p>
          ))}
        </div>

        {/* Citas en texto */}
        {book.citations && book.citations.length > 0 && (
          <div className="p-4 rounded-xl bg-black/50 border border-[#00ffff]/30 space-y-2 font-mono text-xs">
            <span className="text-[#00ffff] font-bold">CITAS ACADÉMICAS DEL CAPÍTULO:</span>
            <div className="flex flex-wrap gap-2">
              {book.citations.map((cite, idx) => (
                <span key={idx} className="px-2.5 py-1 rounded bg-[#00ffff]/10 text-[#00ffff] border border-[#00ffff]/30 text-[11px]">
                  {cite}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Subcomponente de Autores & Bibliografía APA
function AuthorsAndBiblioWindow() {
  return (
    <div className="w-full h-full p-6 md:p-8 overflow-y-auto space-y-8 bg-[#040814] text-white">
      {/* Sección Autores */}
      <div>
        <h3 className="text-xs font-mono text-[#00ffff] border-b border-[#00ffff]/30 pb-2 mb-4 tracking-widest">
          &lt; ARQUITECTOS Y DESARROLLADORES DEL SISTEMA /&gt;
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#030811] p-5 border border-white/10 rounded-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-[#00ffff]" />
            <h4 className="font-bold text-lg mb-1">Jose Correa</h4>
            <p className="text-xs font-mono text-white/50">DESARROLLO & ARQUITECTURA</p>
          </div>
          <div className="bg-[#030811] p-5 border border-white/10 rounded-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-[#00ff88]" />
            <h4 className="font-bold text-lg mb-1">Carlos Rincon</h4>
            <p className="text-xs font-mono text-white/50">DESARROLLO & ARQUITECTURA</p>
          </div>
          <div className="bg-[#030811] p-5 border border-white/10 rounded-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-[#38bdf8]" />
            <h4 className="font-bold text-lg mb-1">Sebastian Charry</h4>
            <p className="text-xs font-mono text-white/50">DESARROLLO & ARQUITECTURA</p>
          </div>
        </div>
      </div>

      {/* Sección Bibliografía APA 7ma Edición */}
      <div>
        <h3 className="text-xs font-mono text-[#00ffff] border-b border-[#00ffff]/30 pb-2 mb-4 tracking-widest">
          &lt; BIBLIOGRAFÍA OFICIAL (FORMATO APA 7MA EDICIÓN) /&gt;
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-serif text-sm text-white/80">
          <div className="p-3 bg-black/40 rounded border border-white/10">
            <strong>[1] BYJU'S CS.</strong> (2023). <em>Semaphores in Operating System</em>. BYJU'S GATE Notes.
          </div>
          <div className="p-3 bg-black/40 rounded border border-white/10">
            <strong>[2] Dijkstra, E. W.</strong> (1965). <em>Cooperating sequential processes</em> (Technical Report EWD-123). Technological University Eindhoven.
          </div>
          <div className="p-3 bg-black/40 rounded border border-white/10">
            <strong>[3] GeeksforGeeks.</strong> (2025, July 23). <em>Hardware Synchronization Algorithms: Unlock and Lock, Test and Set, Swap</em>.
          </div>
          <div className="p-3 bg-black/40 rounded border border-white/10">
            <strong>[4] Rinard, M. C.</strong> (1998). <em>Operating Systems Lecture Notes: Implementing Synchronization Operations</em>. MIT CSAIL.
          </div>
          <div className="p-3 bg-black/40 rounded border border-white/10">
            <strong>[5] Silberschatz, A., Galvin, P. B., & Gagne, G.</strong> (2018). <em>Operating System Concepts</em> (10th ed.). John Wiley & Sons.
          </div>
          <div className="p-3 bg-black/40 rounded border border-white/10">
            <strong>[6] TutorialsPoint.</strong> (2026, March 17). <em>Semaphores in Operating System</em>. TutorialsPoint Computer Science Articles.
          </div>
          <div className="p-3 bg-black/40 rounded border border-white/10 col-span-1 md:col-span-2">
            <strong>[7] Wikipedia.</strong> (2026, September 8). <em>Test-and-set</em>. Wikimedia Foundation.
          </div>
        </div>
      </div>
    </div>
  );
}
