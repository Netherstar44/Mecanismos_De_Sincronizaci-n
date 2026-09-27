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
  X, 
  Power,
  RotateCcw,
  Sparkles,
  Layers,
  Search,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Gamepad2,
  Tag
} from "lucide-react";

import { OrbitControls } from "@react-three/drei";
import { BathroomLockApp, BathroomLockScene } from "@/components/3d/scenes/bathroom-scene";
import { ParkingCounterApp, ParkingCounterScene } from "@/components/3d/scenes/parking-scene";
import { ProducerConsumerApp, ProducerConsumerScene } from "@/components/3d/scenes/producer-consumer-scene";
import { TSLHardwareApp, TSLHardwareScene } from "@/components/3d/scenes/tsl-scene";
import { DeadlockGraphApp, DeadlockGraphScene } from "@/components/3d/scenes/deadlock-scene";
import { RaceConditionApp, RaceConditionScene } from "@/components/3d/scenes/race-condition-scene";
import { KernelTerminal } from "./KernelTerminal";
import { ProcessSchedulingMap } from "@/components/interactive/ProcessSchedulingMap";
import { AdvancedSyncLab3D } from "@/components/3d/AdvancedSyncLab3D";
import { libraryBooks } from "@/data/library-books";

interface OpenWindow {
  id: string;
  title: string;
  icon: any;
  component?: React.ReactNode;
  isMaximized?: boolean;
}

export function VirtualDesktopOS({ 
  onReturnToRoom, 
  initialApp = "terminal",
  initialBookId = "tsl-intro"
}: { 
  onReturnToRoom: () => void;
  initialApp?: string;
  initialBookId?: string;
}) {
  const [activeWindows, setActiveWindows] = useState<OpenWindow[]>([]);
  const [focusedWindowId, setFocusedWindowId] = useState<string | null>(null);
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const [time, setTime] = useState("");
  const [showEasterEggMap, setShowEasterEggMap] = useState(false);
  const [showAdvancedLab, setShowAdvancedLab] = useState(false);
  const [selectedTheoryBookId, setSelectedTheoryBookId] = useState<string>(initialBookId);

  // Reloj en tiempo real
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("es-ES", { hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Abrir ventana inicial solicitada
  useEffect(() => {
    openWindow(initialApp);
  }, [initialApp]);

  const openWindow = (appId: string) => {
    setStartMenuOpen(false);

    // Si ya existe la ventana, traer al frente
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
          title: "Terminal Shell CLI (/bin/bash)",
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
          title: "El Baño Digital — Test-and-Set Lock (TSL)",
          icon: Key,
          component: <BathroomLockApp />
        };
        break;

      case "parking":
        win = {
          id: "parking",
          title: "Estacionamiento Contador — Semáforos de Dijkstra (1965)",
          icon: Car,
          component: <ParkingCounterApp />
        };
        break;

      case "producer":
        win = {
          id: "producer",
          title: "Productor-Consumidor — Búfer Acotado (N=5)",
          icon: Box,
          component: <ProducerConsumerApp />
        };
        break;

      case "tsl_hardware":
        win = {
          id: "tsl_hardware",
          title: "Arquitectura DPRAM & Bus de Memoria Hardware",
          icon: Cpu,
          component: <TSLHardwareApp />
        };
        break;

      case "race_deadlock":
        win = {
          id: "race_deadlock",
          title: "Condiciones de Carrera & Grafos de Interbloqueo (Deadlock)",
          icon: AlertTriangle,
          component: <RaceDeadlockApp />
        };
        break;

      case "theory":
        win = {
          id: "theory",
          title: "Guía Teórica de Concurrencia & Citas Académicas",
          icon: BookOpen
        };
        break;

      case "authors":
        win = {
          id: "authors",
          title: "Autores del Proyecto & Referencias Bibliográficas APA",
          icon: Users
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
    <div className="relative w-full h-screen bg-slate-950 overflow-hidden select-none font-sans text-slate-100 flex flex-col justify-between">
      {/* Fondo de Pantalla Elegante (Gradiente sutil y agradable) */}
      <div 
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle at 50% 50%, #3b82f6 1px, transparent 1px)",
          backgroundSize: "40px 40px"
        }}
      />
      <div className="absolute inset-0 bg-radial from-blue-950/20 via-slate-950/70 to-slate-950 pointer-events-none" />

      {/* Marca de Agua Elegante y Discreta de Fondo */}
      <div className="absolute right-12 bottom-20 text-right opacity-15 pointer-events-none">
        <div className="text-6xl font-black text-slate-400 tracking-tighter">SyncOS</div>
        <div className="text-sm font-semibold tracking-wider text-slate-500 mt-1">
          LABORATORIO DE CONCURRENCIA & SISTEMAS OPERATIVOS
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ICONOS DEL ESCRITORIO                                                     */}
      {/* ========================================================================= */}
      <div className="relative z-10 p-6 grid grid-flow-col grid-rows-6 gap-5 w-max">
        <DesktopIcon
          icon={TerminalIcon}
          label="Terminal Shell"
          color="text-blue-400"
          onClick={() => openWindow("terminal")}
        />
        <DesktopIcon
          icon={Key}
          label="El Baño (TSL)"
          color="text-amber-400"
          onClick={() => openWindow("bathroom")}
        />
        <DesktopIcon
          icon={Car}
          label="Semáforo Dijkstra"
          color="text-emerald-400"
          onClick={() => openWindow("parking")}
        />
        <DesktopIcon
          icon={Box}
          label="Prod-Consumidor"
          color="text-indigo-400"
          onClick={() => openWindow("producer")}
        />
        <DesktopIcon
          icon={Cpu}
          label="DPRAM Hardware"
          color="text-cyan-400"
          onClick={() => openWindow("tsl_hardware")}
        />
        <DesktopIcon
          icon={AlertTriangle}
          label="Carrera & Deadlock"
          color="text-rose-400"
          onClick={() => openWindow("race_deadlock")}
        />
        <DesktopIcon
          icon={BookOpen}
          label="Guía Teórica"
          color="text-purple-400"
          onClick={() => openWindow("theory")}
        />
        <DesktopIcon
          icon={MapIcon}
          label="Mapa Planificación"
          badge="Easter Egg"
          color="text-fuchsia-400"
          onClick={() => setShowEasterEggMap(true)}
        />
        <DesktopIcon
          icon={Layers}
          label="Laboratorio 3D"
          color="text-teal-400"
          onClick={() => setShowAdvancedLab(true)}
        />
        <DesktopIcon
          icon={Users}
          label="Autores & APA"
          color="text-slate-300"
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
              className={`pointer-events-auto absolute rounded-2xl overflow-hidden border shadow-2xl flex flex-col transition-all duration-200 ${
                win.isMaximized
                  ? "inset-4 md:inset-8"
                  : "w-[94vw] md:w-[860px] lg:w-[980px] h-[78vh] md:h-[630px]"
              } ${
                isFocused
                  ? "border-slate-600 shadow-blue-950/40"
                  : "border-slate-800 opacity-85 hover:opacity-100"
              } bg-slate-900/95 backdrop-blur-2xl`}
            >
              {/* Barra de Título de la Ventana */}
              <div className="h-11 bg-slate-950/80 border-b border-slate-800 px-4 flex items-center justify-between select-none">
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 text-blue-400" />
                  <span className="text-xs font-semibold text-slate-200 tracking-tight truncate max-w-xs md:max-w-md">
                    {win.title}
                  </span>
                </div>

                {/* Botones de Control de Ventana */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleMaximize(win.id); }}
                    className="w-3.5 h-3.5 rounded-full bg-amber-500/80 hover:bg-amber-400 flex items-center justify-center text-black cursor-pointer"
                    title="Maximizar / Restaurar"
                  >
                    <Maximize2 className="w-2 h-2 opacity-0 hover:opacity-100" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); closeWindow(win.id); }}
                    className="w-3.5 h-3.5 rounded-full bg-rose-500/80 hover:bg-rose-400 flex items-center justify-center text-black cursor-pointer"
                    title="Cerrar Ventana"
                  >
                    <X className="w-2.5 h-2.5 opacity-0 hover:opacity-100" />
                  </button>
                </div>
              </div>

              {/* Contenido de la Ventana */}
              <div className="flex-1 w-full h-full overflow-hidden relative">
                {win.id === "theory" ? (
                  <TheoryExplorerWindow
                    selectedBookId={selectedTheoryBookId}
                    onSelectBook={setSelectedTheoryBookId}
                    onOpenSimulator={(appId) => openWindow(appId)}
                  />
                ) : win.id === "authors" ? (
                  <AuthorsAndBiblioWindow />
                ) : (
                  win.component
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* BARRA DE TAREAS INFERIOR (TASKBAR)                                        */}
      {/* ========================================================================= */}
      <footer className="relative z-50 h-12 bg-slate-900/90 border-t border-slate-800 backdrop-blur-md px-4 flex items-center justify-between">
        {/* Botón Menú Inicio "SyncOS" */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setStartMenuOpen(!startMenuOpen)}
            className={`px-3 py-1.5 rounded-xl flex items-center gap-2 text-xs font-semibold border transition-all cursor-pointer ${
              startMenuOpen
                ? "bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-500/20"
                : "bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700"
            }`}
          >
            <img src="/favicon.svg" alt="SyncOS" className="w-4 h-4 object-contain" />
            <span>SyncOS</span>
          </button>

          {/* Separador */}
          <div className="h-5 w-px bg-slate-800 mx-1" />

          {/* Pestañas de Ventanas Abiertas */}
          <div className="flex items-center gap-1.5 overflow-x-auto max-w-xl">
            {activeWindows.map(win => {
              const Icon = win.icon;
              const isFocused = focusedWindowId === win.id;
              return (
                <button
                  key={win.id}
                  onClick={() => setFocusedWindowId(win.id)}
                  className={`px-3 py-1 rounded-lg text-xs flex items-center gap-1.5 border transition-all truncate max-w-40 cursor-pointer ${
                    isFocused
                      ? "bg-blue-500/20 text-blue-300 border-blue-500/40 font-semibold"
                      : "bg-slate-800/40 text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-slate-800"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="truncate">{win.title.split("—")[0].trim()}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* System Tray (CPU, RAM, Reloj y Salir al Cuarto 3D) */}
        <div className="flex items-center gap-3.5 text-xs">
          <div className="hidden md:flex items-center gap-2.5 text-slate-400 text-[11px]">
            <span>CPU: <strong className="text-emerald-400">12%</strong></span>
            <span>MEM: <strong className="text-blue-400">1.8 GB</strong></span>
          </div>

          <div className="text-slate-200 font-semibold px-2.5 py-0.5 rounded-lg bg-slate-950 border border-slate-800">
            {time}
          </div>

          {/* Botón Salir al Cuarto 3D */}
          <button
            onClick={onReturnToRoom}
            className="px-3 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-lg text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
            title="Volver a la vista del cuarto de ingeniería"
          >
            <Power className="w-3.5 h-3.5 text-rose-400" />
            <span className="hidden sm:inline">Vista Cuarto 3D</span>
          </button>
        </div>

        {/* Menú de Inicio Desplegable */}
        {startMenuOpen && (
          <div className="absolute bottom-14 left-4 w-72 bg-slate-900/95 backdrop-blur-2xl border border-slate-800 rounded-2xl p-4 shadow-2xl space-y-3 z-50">
            <div className="border-b border-slate-800 pb-2.5 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <Cpu className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-xs text-white">SyncOS v2.4</div>
                <div className="text-[11px] text-slate-400">Sistemas Operativos</div>
              </div>
            </div>

            <div className="space-y-1 text-xs">
              <button
                onClick={() => openWindow("terminal")}
                className="w-full text-left p-2 rounded-lg hover:bg-slate-800 flex items-center gap-2.5 text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <TerminalIcon className="w-4 h-4 text-blue-400" />
                <span>Terminal de Comandos (CLI)</span>
              </button>
              <button
                onClick={() => openWindow("bathroom")}
                className="w-full text-left p-2 rounded-lg hover:bg-slate-800 flex items-center gap-2.5 text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <Key className="w-4 h-4 text-amber-400" />
                <span>El Baño Digital (TSL)</span>
              </button>
              <button
                onClick={() => openWindow("parking")}
                className="w-full text-left p-2 rounded-lg hover:bg-slate-800 flex items-center gap-2.5 text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <Car className="w-4 h-4 text-emerald-400" />
                <span>Semáforos de Dijkstra</span>
              </button>
              <button
                onClick={() => openWindow("producer")}
                className="w-full text-left p-2 rounded-lg hover:bg-slate-800 flex items-center gap-2.5 text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <Box className="w-4 h-4 text-indigo-400" />
                <span>Productor-Consumidor</span>
              </button>
              <button
                onClick={() => setShowEasterEggMap(true)}
                className="w-full text-left p-2 rounded-lg hover:bg-slate-800 flex items-center gap-2.5 text-purple-300 hover:text-white font-medium transition-colors cursor-pointer"
              >
                <MapIcon className="w-4 h-4 text-purple-400" />
                <span>Mapa Planificación (Easter Egg)</span>
              </button>
              <button
                onClick={() => setShowAdvancedLab(true)}
                className="w-full text-left p-2 rounded-lg hover:bg-slate-800 flex items-center gap-2.5 text-teal-300 hover:text-white font-medium transition-colors cursor-pointer"
              >
                <Layers className="w-4 h-4 text-teal-400" />
                <span>Laboratorio Técnico 3D</span>
              </button>
              <button
                onClick={() => openWindow("authors")}
                className="w-full text-left p-2 rounded-lg hover:bg-slate-800 flex items-center gap-2.5 text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <Users className="w-4 h-4 text-slate-400" />
                <span>Autores & Bibliografía APA</span>
              </button>
            </div>

            <div className="border-t border-slate-800 pt-2 text-[11px] text-slate-400 flex justify-between items-center">
              <span>Mecanismos de Sincronización</span>
              <button onClick={onReturnToRoom} className="text-blue-400 hover:underline cursor-pointer">
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

// Icono de Escritorio
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
      className="flex flex-col items-center justify-center p-2.5 rounded-xl hover:bg-slate-800/60 transition-all group w-24 text-center cursor-pointer relative"
    >
      {badge && (
        <span className="absolute -top-1 right-1 text-[9px] bg-purple-600 text-white font-bold px-1.5 py-0.2 rounded-full shadow-md">
          {badge}
        </span>
      )}
      <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 group-hover:border-slate-600 flex items-center justify-center mb-1.5 shadow-lg group-hover:scale-105 transition-transform">
        <Icon className={`w-6 h-6 ${color}`} />
      </div>
      <span className="text-[11px] text-slate-300 group-hover:text-white font-medium leading-tight">
        {label}
      </span>
    </button>
  );
}

// Subcomponente de Guía Teórica Avanzada y Reactiva
function TheoryExplorerWindow({
  selectedBookId,
  onSelectBook,
  onOpenSimulator
}: {
  selectedBookId: string;
  onSelectBook: (id: string) => void;
  onOpenSimulator?: (appId: string) => void;
}) {
  const [filterShelf, setFilterShelf] = useState<"all" | 1 | 2>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewTab, setViewTab] = useState<"read" | "sim">("read");

  const book = libraryBooks.find(b => b.id === selectedBookId) || libraryBooks[0];
  const currentIndex = libraryBooks.findIndex(b => b.id === book.id);

  // Filtrado reactivo de capítulos
  const filteredBooks = libraryBooks.filter(b => {
    const matchesShelf = filterShelf === "all" || b.shelf === filterShelf;
    const matchesSearch = searchQuery === "" || 
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesShelf && matchesSearch;
  });

  // Mapeo didáctico de capítulo a simulador correspondiente
  const getSimInfo = (bookId: string) => {
    if (bookId === "tsl-bano" || bookId === "tsl-traza") {
      return { id: "bathroom", name: "El Baño Digital (TSL)", color: "text-amber-400" };
    }
    if (bookId === "tsl-intro") {
      return { id: "race_deadlock", name: "Condición de Carrera", color: "text-rose-400" };
    }
    if (bookId.startsWith("tsl")) {
      return { id: "tsl_hardware", name: "DPRAM & Hardware TSL", color: "text-cyan-400" };
    }
    if (bookId === "sem-productor-consumidor") {
      return { id: "producer", name: "Búfer Productor-Consumidor", color: "text-indigo-400" };
    }
    if (bookId === "sem-analisis") {
      return { id: "race_deadlock", name: "Grafo de Deadlock", color: "text-rose-400" };
    }
    if (bookId.startsWith("sem")) {
      return { id: "parking", name: "Semáforo Contador Dijkstra", color: "text-emerald-400" };
    }
    return { id: "advanced_lab", name: "Laboratorio Técnico 3D", color: "text-teal-400" };
  };

  const simInfo = getSimInfo(book.id);

  const renderSimulatorForBook = (bookId: string) => {
    if (bookId === "tsl-bano" || bookId === "tsl-traza") return <BathroomLockApp />;
    if (bookId.startsWith("tsl")) return <TSLHardwareApp />;
    if (bookId === "sem-productor-consumidor") return <ProducerConsumerApp />;
    if (bookId === "sem-analisis") return <DeadlockGraphApp />;
    if (bookId.startsWith("sem")) return <ParkingCounterApp />;
    return <RaceConditionApp />;
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      onSelectBook(libraryBooks[currentIndex - 1].id);
    }
  };

  const handleNext = () => {
    if (currentIndex < libraryBooks.length - 1) {
      onSelectBook(libraryBooks[currentIndex + 1].id);
    }
  };

  const SceneComponent = book.Scene;

  return (
    <div className="w-full h-full flex flex-col md:flex-row overflow-hidden bg-slate-950 font-sans">
      {/* ===================================================================== */}
      {/* BARRA LATERAL: Buscador, Filtros y Lista de los 14 Capítulos           */}
      {/* ===================================================================== */}
      <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-slate-800 flex flex-col bg-slate-900/70 shrink-0">
        {/* Cabecera y Buscador */}
        <div className="p-3.5 border-b border-slate-800 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-300 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-blue-400" />
              <span>Capítulos ({filteredBooks.length}/14)</span>
            </span>
          </div>

          {/* Campo de Búsqueda */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Buscar tema, Dijkstra, TSL..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-700/80 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
              >
                ×
              </button>
            )}
          </div>

          {/* Filtros por Grupo (Hardware / Software) */}
          <div className="grid grid-cols-3 gap-1 text-[10px]">
            <button
              onClick={() => setFilterShelf("all")}
              className={`py-1 rounded-md font-medium transition-colors ${
                filterShelf === "all"
                  ? "bg-blue-600 text-white font-semibold shadow-sm"
                  : "bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700"
              }`}
            >
              Todos (14)
            </button>
            <button
              onClick={() => setFilterShelf(1)}
              className={`py-1 rounded-md font-medium transition-colors ${
                filterShelf === 1
                  ? "bg-amber-600 text-white font-semibold shadow-sm"
                  : "bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700"
              }`}
            >
              HW: TSL (7)
            </button>
            <button
              onClick={() => setFilterShelf(2)}
              className={`py-1 rounded-md font-medium transition-colors ${
                filterShelf === 2
                  ? "bg-emerald-600 text-white font-semibold shadow-sm"
                  : "bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700"
              }`}
            >
              SO: Sem (7)
            </button>
          </div>
        </div>

        {/* Lista con Scroll de Capítulos */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filteredBooks.map(b => (
            <button
              key={b.id}
              onClick={() => {
                onSelectBook(b.id);
                // Si cambiamos de libro, mantenemos pestaña o default
              }}
              className={`w-full text-left p-2 rounded-xl text-xs transition-all flex items-center justify-between cursor-pointer ${
                b.id === book.id
                  ? "bg-blue-600 text-white font-semibold shadow-md shadow-blue-900/30 ring-1 ring-blue-400/40"
                  : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-2 truncate pr-1">
                <span className="truncate">{b.title}</span>
              </div>
              <span className={`text-[9px] px-1.5 py-0.5 rounded-md shrink-0 font-mono ${
                b.id === book.id
                  ? "bg-blue-700 text-white"
                  : (b.shelf === 1 ? "bg-amber-500/20 text-amber-300" : "bg-emerald-500/20 text-emerald-300")
              }`}>
                {b.shelf === 1 ? "HW" : "SO"}
              </span>
            </button>
          ))}
          {filteredBooks.length === 0 && (
            <div className="text-center py-8 text-xs text-slate-500 italic">
              No se encontraron capítulos para "{searchQuery}"
            </div>
          )}
        </div>
      </div>

      {/* ===================================================================== */}
      {/* PANEL PRINCIPAL: Visualización Teórica o Simulador 3D en Vivo          */}
      {/* ===================================================================== */}
      <div className="flex-1 flex flex-col overflow-hidden bg-slate-950">
        {/* Cabecera del Capítulo & Pestañas */}
        <div className="border-b border-slate-800 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/40">
          <div>
            <div className="text-[11px] font-semibold tracking-wider uppercase mb-0.5 flex items-center gap-2">
              <span className={book.shelf === 1 ? "text-amber-400" : "text-emerald-400"}>
                {book.shelf === 1 ? "Grupo 1: Hardware (Test-and-Set Lock)" : "Grupo 2: Software / SO (Semáforos de Dijkstra)"}
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-400 text-[10px]">Capítulo {currentIndex + 1} de {libraryBooks.length}</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">{book.title}</h2>
          </div>

          {/* Selector de Pestaña: Texto vs Simulador 3D */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="bg-slate-900 p-1 rounded-xl border border-slate-800 flex items-center gap-1">
              <button
                onClick={() => setViewTab("read")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  viewTab === "read"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Teoría</span>
              </button>
              <button
                onClick={() => setViewTab("sim")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  viewTab === "sim"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Gamepad2 className="w-3.5 h-3.5" />
                <span>Simulador 3D</span>
              </button>
            </div>

            {/* Botón para abrir la ventana completa del simulador en SyncOS */}
            {onOpenSimulator && (
              <button
                onClick={() => onOpenSimulator(simInfo.id)}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs font-medium text-slate-200 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
                title={`Abrir ventana completa de ${simInfo.name}`}
              >
                <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
                <span className="hidden lg:inline">Abrir en Ventana</span>
              </button>
            )}
          </div>
        </div>

        {/* =================================================================== */}
        {/* MODO 1: LECTURA TEÓRICA DETALLADA                                   */}
        {/* =================================================================== */}
        {viewTab === "read" ? (
          <div className="flex-1 p-6 md:p-8 overflow-y-auto space-y-6 text-slate-200">
            {/* Resumen Ejecutivo */}
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 leading-relaxed shadow-sm">
              <strong className="text-white block mb-1">Concepto Clave:</strong>
              {book.summary}
            </div>

            {/* Párrafos de Contenido Académico */}
            <div className="space-y-4 text-slate-300 leading-relaxed text-sm">
              {book.content.split("\n\n").map((par, i) => (
                <p key={i} className="text-justify font-sans">{par}</p>
              ))}
            </div>

            {/* Etiquetas Académicas / Palabras Clave */}
            {book.tags && book.tags.length > 0 && (
              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                  Palabras Clave:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {book.tags.map((t, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-slate-800/80 text-slate-300 border border-slate-700/60 text-[11px] font-medium"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Citas académicas en el texto */}
            {book.citations && book.citations.length > 0 && (
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2 text-xs">
                <span className="text-slate-300 font-semibold block flex items-center gap-1.5">
                  <span>📚</span> Citas Académicas Referenciadas en este Capítulo:
                </span>
                <div className="flex flex-wrap gap-2">
                  {book.citations.map((cite, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-300 border border-blue-500/20 text-[11px] font-mono">
                      {cite}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Navegación Inferior entre Capítulos */}
            <div className="pt-6 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-30 border border-slate-800 text-xs font-medium text-slate-300 hover:text-white flex items-center gap-2 cursor-pointer transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Capítulo Anterior</span>
              </button>

              <button
                onClick={() => setViewTab("sim")}
                className="px-4 py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-xs font-semibold text-blue-300 flex items-center gap-2 cursor-pointer transition-colors"
              >
                <Gamepad2 className="w-4 h-4 text-blue-400" />
                <span>Ver Simulador 3D de este Tema</span>
              </button>

              <button
                onClick={handleNext}
                disabled={currentIndex === libraryBooks.length - 1}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-30 border border-slate-800 text-xs font-medium text-slate-300 hover:text-white flex items-center gap-2 cursor-pointer transition-colors"
              >
                <span>Siguiente Capítulo</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* ================================================================= */
          /* MODO 2: SIMULADOR 3D INTERACTIVO INTEGRADO CON CONTROLES NATIVOS  */
          /* ================================================================= */
          <div className="flex-1 relative w-full h-full bg-slate-950 overflow-hidden">
            {renderSimulatorForBook(book.id)}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * RaceDeadlockApp — Aplicación combinada de Carrera Crítica y Deadlocks
 * Pestañas intuitivas y controles HTML 100% nativos sin desfase de cursor.
 */
function RaceDeadlockApp() {
  const [activeTab, setActiveTab] = useState<"race" | "deadlock">("race");

  return (
    <div className="w-full h-full flex flex-col bg-slate-950 text-slate-100 select-none overflow-hidden font-sans">
      {/* Selector de Simulador Superior */}
      <div className="h-10 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("race")}
            className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === "race"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <span>🏎️ Condición de Carrera</span>
          </button>
          <button
            onClick={() => setActiveTab("deadlock")}
            className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === "deadlock"
                ? "bg-rose-600 text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <span>🔒 Grafo de Deadlock</span>
          </button>
        </div>
        <span className="text-[11px] text-slate-500 font-mono hidden sm:inline">
          {activeTab === "race" ? "Memoria Compartida y Exclusión Mutua" : "Condiciones de Coffman & Espera Circular"}
        </span>
      </div>

      <div className="flex-1 w-full h-full overflow-hidden">
        {activeTab === "race" ? <RaceConditionApp /> : <DeadlockGraphApp />}
      </div>
    </div>
  );
}

// Subcomponente de Autores & Bibliografía APA
function AuthorsAndBiblioWindow() {
  return (
    <div className="w-full h-full p-6 md:p-8 overflow-y-auto space-y-8 bg-slate-950 text-slate-100 font-sans">
      {/* Sección Autores */}
      <div>
        <h3 className="text-xs font-bold text-slate-400 border-b border-slate-800 pb-2 mb-4 tracking-wider uppercase">
          Equipo de Desarrollo & Arquitectura
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900 p-5 border border-slate-800 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500" />
            <h4 className="font-bold text-base text-white mb-1">Jose Correa</h4>
            <p className="text-xs text-slate-400">Ingeniería de Sistemas & Arquitectura</p>
          </div>
          <div className="bg-slate-900 p-5 border border-slate-800 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500" />
            <h4 className="font-bold text-base text-white mb-1">Carlos Rincon</h4>
            <p className="text-xs text-slate-400">Ingeniería de Sistemas & Arquitectura</p>
          </div>
          <div className="bg-slate-900 p-5 border border-slate-800 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-purple-500" />
            <h4 className="font-bold text-base text-white mb-1">Sebastian Charry</h4>
            <p className="text-xs text-slate-400">Ingeniería de Sistemas & Arquitectura</p>
          </div>
        </div>
      </div>

      {/* Sección Bibliografía APA 7ma Edición */}
      <div>
        <h3 className="text-xs font-bold text-slate-400 border-b border-slate-800 pb-2 mb-4 tracking-wider uppercase">
          Referencias Bibliográficas Oficiales (Formato APA 7ma Edición)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300 leading-relaxed">
          <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800">
            <strong>[1] BYJU'S CS.</strong> (2023). <em>Semaphores in Operating System</em>. BYJU'S GATE Notes.
          </div>
          <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800">
            <strong>[2] Dijkstra, E. W.</strong> (1965). <em>Cooperating sequential processes</em> (Technical Report EWD-123). Technological University Eindhoven.
          </div>
          <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800">
            <strong>[3] GeeksforGeeks.</strong> (2025, July 23). <em>Hardware Synchronization Algorithms: Unlock and Lock, Test and Set, Swap</em>.
          </div>
          <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800">
            <strong>[4] Rinard, M. C.</strong> (1998). <em>Operating Systems Lecture Notes: Implementing Synchronization Operations</em>. MIT CSAIL.
          </div>
          <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800">
            <strong>[5] Silberschatz, A., Galvin, P. B., & Gagne, G.</strong> (2018). <em>Operating System Concepts</em> (10th ed.). John Wiley & Sons.
          </div>
          <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800">
            <strong>[6] TutorialsPoint.</strong> (2026, March 17). <em>Semaphores in Operating System</em>. TutorialsPoint Computer Science Articles.
          </div>
          <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 col-span-1 md:col-span-2">
            <strong>[7] Wikipedia.</strong> (2026, September 8). <em>Test-and-set</em>. Wikimedia Foundation.
          </div>
        </div>
      </div>
    </div>
  );
}
