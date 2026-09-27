import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Play, RotateCcw, Clock, Building, ShoppingCart, Repeat, HeartPulse, Sparkles } from "lucide-react";
import { ExplanationButton } from "@/components/ui/ExplanationButton";

export interface ProcessItem {
  id: string;
  name: string;
  burst: number;
  remaining?: number;
  priority?: number;
  qUsed?: number;
}

export interface SchedulingScenario {
  id: "fcfs" | "sjf" | "rr" | "priority";
  name: string;
  algorithm: string;
  location: string;
  icon: any;
  color: string;
  accent: string;
  description: string;
  analogy: string;
  initialQueue: ProcessItem[];
}

const SCENARIOS: SchedulingScenario[] = [
  {
    id: "fcfs",
    name: "La Fila del Banco",
    algorithm: "FCFS (First-Come, First-Served)",
    location: "Distrito Financiero Central",
    icon: Building,
    color: "from-blue-600 to-indigo-900",
    accent: "#38bdf8",
    description: "El primer proceso que solicita la CPU es el primero en ser atendido. No es apropiativo (no expulsivo).",
    analogy: "Como la ventanilla de un banco tradicional: si el primer cliente llega a pagar 50 facturas (tiempo de ráfaga muy largo), todos los clientes detrás sufren el 'Efecto Convoy' y esperan horas aunque solo vengan a consultar su saldo.",
    initialQueue: [
      { id: "P1", name: "Cliente VIP (50 facturas)", burst: 8 },
      { id: "P2", name: "Cliente Rápido (Retiro)", burst: 2 },
      { id: "P3", name: "Cliente Medio (Depósito)", burst: 4 },
      { id: "P4", name: "Cliente Consulta", burst: 1 }
    ]
  },
  {
    id: "sjf",
    name: "Caja Rápida del Supermercado",
    algorithm: "SJF (Shortest Job First)",
    location: "Zona Comercial Norte",
    icon: ShoppingCart,
    color: "from-emerald-600 to-teal-900",
    accent: "#34d399",
    description: "Asigna la CPU al proceso con la ráfaga más corta. Minimiza matemáticamente el tiempo de espera promedio.",
    analogy: "Como la caja rápida 'menos de 10 productos': la cajera atiende primero a quien lleva un solo refresco antes que al que tiene el carrito desbordado, haciendo que la mayoría de personas salgan de inmediato.",
    initialQueue: [
      { id: "P1", name: "Carrito Lleno", burst: 7 },
      { id: "P2", name: "Lleva 1 Refresco", burst: 1 },
      { id: "P3", name: "Lleva 3 Artículos", burst: 3 },
      { id: "P4", name: "Canasta Mediana", burst: 4 }
    ]
  },
  {
    id: "rr",
    name: "El Carrusel del Parque",
    algorithm: "Round Robin (RR con Quantum q=2s)",
    location: "Parque Metropolitano",
    icon: Repeat,
    color: "from-amber-600 to-orange-900",
    accent: "#fbbf24",
    description: "Cada proceso recibe una rebanada de tiempo fija (Quantum). Si no termina, es expulsado y va al final de la cola.",
    analogy: "Como un carrusel o juego infantil con fila: cada niño tiene derecho a girar exactamente 2 minutos. Si quiere seguir jugando, debe bajarse, formarse al final y esperar su próximo turno para que todos jueguen de forma equitativa.",
    initialQueue: [
      { id: "P1", name: "Niño A (quiere 5 vueltas)", burst: 5 },
      { id: "P2", name: "Niño B (quiere 2 vueltas)", burst: 2 },
      { id: "P3", name: "Niño C (quiere 4 vueltas)", burst: 4 },
      { id: "P4", name: "Niño D (quiere 1 vuelta)", burst: 1 }
    ]
  },
  {
    id: "priority",
    name: "Triage de Urgencias Médicas",
    algorithm: "Planificación por Prioridad (Preemptive)",
    location: "Hospital Universitario",
    icon: HeartPulse,
    color: "from-rose-600 to-red-900",
    accent: "#f43f5e",
    description: "La CPU se asigna al proceso con mayor prioridad. Puede causar inanición (starvation) si no se usa envejecimiento.",
    analogy: "Como la sala de urgencias de un hospital: si llega una ambulancia con un paciente en paro cardíaco (Prioridad 1 / Código Rojo), los médicos detienen la atención de alguien con un resfriado (Prioridad 4) para salvar la vida del prioritario.",
    initialQueue: [
      { id: "P1", name: "Resfriado Común", burst: 4, priority: 3 },
      { id: "P2", name: "Fractura de Brazo", burst: 3, priority: 2 },
      { id: "P3", name: "Emergencia Paro Cardíaco", burst: 5, priority: 1 },
      { id: "P4", name: "Control de Rutina", burst: 2, priority: 4 }
    ]
  }
];

export function ProcessSchedulingMap({ onClose }: { onClose: () => void }) {
  const [selectedScenario, setSelectedScenario] = useState<SchedulingScenario>(SCENARIOS[0]);
  const [queue, setQueue] = useState(SCENARIOS[0].initialQueue);
  const [activeProcess, setActiveProcess] = useState<any | null>(null);
  const [completed, setCompleted] = useState<any[]>([]);
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [ganttHistory, setGanttHistory] = useState<{ id: string; time: number }[]>([]);

  // Cambiar escenario
  const handleSelectScenario = (scenario: SchedulingScenario) => {
    setSelectedScenario(scenario);
    setQueue([...scenario.initialQueue]);
    setActiveProcess(null);
    setCompleted([]);
    setTime(0);
    setIsRunning(false);
    setGanttHistory([]);
  };

  const handleReset = () => {
    setQueue([...selectedScenario.initialQueue]);
    setActiveProcess(null);
    setCompleted([]);
    setTime(0);
    setIsRunning(false);
    setGanttHistory([]);
  };

  // Ciclo de simulación interactiva
  useEffect(() => {
    if (!isRunning) return;

    const timer = setInterval(() => {
      setTime(t => t + 1);

      if (selectedScenario.id === "fcfs") {
        runFCFSStep();
      } else if (selectedScenario.id === "sjf") {
        runSJFStep();
      } else if (selectedScenario.id === "rr") {
        runRRStep();
      } else if (selectedScenario.id === "priority") {
        runPriorityStep();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, activeProcess, queue, completed, selectedScenario]);

  const runFCFSStep = () => {
    if (!activeProcess) {
      if (queue.length > 0) {
        const next = queue[0];
        setQueue(queue.slice(1));
        setActiveProcess({ ...next, remaining: next.burst });
      } else {
        setIsRunning(false);
      }
      return;
    }

    setGanttHistory(prev => [...prev, { id: activeProcess.id, time: time + 1 }]);
    const rem = activeProcess.remaining - 1;

    if (rem <= 0) {
      setCompleted(prev => [...prev, activeProcess]);
      if (queue.length > 0) {
        const next = queue[0];
        setQueue(queue.slice(1));
        setActiveProcess({ ...next, remaining: next.burst });
      } else {
        setActiveProcess(null);
        setIsRunning(false);
      }
    } else {
      setActiveProcess({ ...activeProcess, remaining: rem });
    }
  };

  const runSJFStep = () => {
    if (!activeProcess) {
      if (queue.length > 0) {
        // Ordenar por ráfaga más corta
        const sorted = [...queue].sort((a, b) => a.burst - b.burst);
        const next = sorted[0];
        setQueue(sorted.slice(1));
        setActiveProcess({ ...next, remaining: next.burst });
      } else {
        setIsRunning(false);
      }
      return;
    }

    setGanttHistory(prev => [...prev, { id: activeProcess.id, time: time + 1 }]);
    const rem = activeProcess.remaining - 1;

    if (rem <= 0) {
      setCompleted(prev => [...prev, activeProcess]);
      if (queue.length > 0) {
        const sorted = [...queue].sort((a, b) => a.burst - b.burst);
        const next = sorted[0];
        setQueue(sorted.slice(1));
        setActiveProcess({ ...next, remaining: next.burst });
      } else {
        setActiveProcess(null);
        setIsRunning(false);
      }
    } else {
      setActiveProcess({ ...activeProcess, remaining: rem });
    }
  };

  const runRRStep = () => {
    const quantum = 2;
    if (!activeProcess) {
      if (queue.length > 0) {
        const next = queue[0];
        setQueue(queue.slice(1));
        setActiveProcess({ ...next, remaining: next.remaining ?? next.burst, qUsed: 0 });
      } else {
        setIsRunning(false);
      }
      return;
    }

    setGanttHistory(prev => [...prev, { id: activeProcess.id, time: time + 1 }]);
    const rem = (activeProcess.remaining ?? activeProcess.burst) - 1;
    const qUsed = (activeProcess.qUsed || 0) + 1;

    if (rem <= 0) {
      setCompleted(prev => [...prev, activeProcess]);
      if (queue.length > 0) {
        const next = queue[0];
        setQueue(queue.slice(1));
        setActiveProcess({ ...next, remaining: next.remaining ?? next.burst, qUsed: 0 });
      } else {
        setActiveProcess(null);
        setIsRunning(false);
      }
    } else if (qUsed >= quantum) {
      // Fin de quantum: expulsión hacia el final de la cola
      const reEnqueued = { ...activeProcess, remaining: rem, qUsed: 0 };
      if (queue.length > 0) {
        const next = queue[0];
        setQueue([...queue.slice(1), reEnqueued]);
        setActiveProcess({ ...next, remaining: next.remaining ?? next.burst, qUsed: 0 });
      } else {
        setActiveProcess(reEnqueued);
      }
    } else {
      setActiveProcess({ ...activeProcess, remaining: rem, qUsed });
    }
  };

  const runPriorityStep = () => {
    if (!activeProcess) {
      if (queue.length > 0) {
        // Menor número = mayor prioridad (1 es máxima prioridad)
        const sorted = [...queue].sort((a, b) => (a.priority || 99) - (b.priority || 99));
        const next = sorted[0];
        setQueue(sorted.slice(1));
        setActiveProcess({ ...next, remaining: next.burst });
      } else {
        setIsRunning(false);
      }
      return;
    }

    setGanttHistory(prev => [...prev, { id: activeProcess.id, time: time + 1 }]);
    const rem = activeProcess.remaining - 1;

    if (rem <= 0) {
      setCompleted(prev => [...prev, activeProcess]);
      if (queue.length > 0) {
        const sorted = [...queue].sort((a, b) => (a.priority || 99) - (b.priority || 99));
        const next = sorted[0];
        setQueue(sorted.slice(1));
        setActiveProcess({ ...next, remaining: next.burst });
      } else {
        setActiveProcess(null);
        setIsRunning(false);
      }
    } else {
      setActiveProcess({ ...activeProcess, remaining: rem });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-2xl flex flex-col font-sans text-slate-100 select-none overflow-hidden">
      {/* Barra Superior */}
      <header className="h-16 border-b border-slate-800 px-6 flex items-center justify-between bg-slate-900/80 z-20">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-sm md:text-base tracking-tight text-white">
                Planificación de Procesos en la Vida Cotidiana
              </h1>
              <span className="px-2 py-0.5 text-[10px] bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-full font-semibold">
                Simulador Interactivo
              </span>
            </div>
            <p className="text-xs text-slate-400 font-normal">
              Comparativa didáctica: FCFS en Bancos, SJF en Cajas Rápidas, Round Robin en Parques y Prioridades en Urgencias
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </header>

      {/* Cuerpo Principal: Mapa + Simulador */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Panel Izquierdo: Selección de Puntos del Mapa */}
        <div className="w-full lg:w-96 border-b lg:border-b-0 lg:border-r border-slate-800 p-5 bg-slate-900/70 overflow-y-auto space-y-4">
          <div className="text-xs text-slate-400 font-bold tracking-wider uppercase border-b border-slate-800 pb-2">
            Escenarios del Entorno Urbano
          </div>

          <div className="space-y-2.5">
            {SCENARIOS.map((scen) => {
              const Icon = scen.icon;
              const isSelected = selectedScenario.id === scen.id;
              return (
                <button
                  key={scen.id}
                  onClick={() => handleSelectScenario(scen)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all relative overflow-hidden group cursor-pointer ${
                    isSelected
                      ? "bg-slate-800/90 border-blue-500/60 shadow-lg shadow-blue-500/10"
                      : "bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2.5 rounded-xl bg-gradient-to-br ${scen.color} text-white shadow-md`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-xs text-white group-hover:text-blue-400 transition-colors">
                        {scen.name}
                      </div>
                      <div className="text-[11px] text-blue-400 font-medium mt-0.5">
                        {scen.algorithm}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span>{scen.location}</span>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Tarjeta de Analogía Didáctica */}
          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2 text-xs">
            <div className="text-amber-400 font-semibold flex items-center gap-1.5 text-xs">
              <span>💡 Analogía en Sistemas Operativos:</span>
            </div>
            <p className="text-slate-300 leading-relaxed text-xs">
              "{selectedScenario.analogy}"
            </p>
          </div>
        </div>

        {/* Panel Derecho: Simulador del Algoritmo Seleccionado */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6 flex flex-col justify-between">
          <div className="space-y-6">
            {/* Header del Escenario Actual */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <div className="text-xs text-blue-400 font-semibold tracking-wide uppercase">
                  {selectedScenario.location} — Algoritmo en Simulación
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight mt-0.5">
                  {selectedScenario.name}
                </h2>
                <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
                  {selectedScenario.description}
                </p>
              </div>

              {/* Botones de Ejecución */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsRunning(!isRunning)}
                  className={`px-4 py-2 rounded-xl font-semibold text-xs flex items-center gap-2 border transition-all cursor-pointer shadow-md ${
                    isRunning
                      ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                      : "bg-blue-600 hover:bg-blue-500 text-white border-transparent shadow-blue-500/20"
                  }`}
                >
                  <Play className={`w-3.5 h-3.5 ${isRunning ? "animate-spin" : ""}`} />
                  <span>{isRunning ? "Pausar Simulación" : "Iniciar Ejecución"}</span>
                </button>
                <button
                  onClick={handleReset}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  title="Reiniciar"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <ExplanationButton
                  title="¿Qué representa cada elemento en la Planificación?"
                  items={[
                    { element: "CPU en Servicio", description: "El procesador atendiendo activamente la ráfaga de CPU del proceso en ejecución.", color: "#10b981" },
                    { element: "Cola de Listos (Ready Queue)", description: "Procesos en memoria esperando a ser despachados (dispatch) según la política del algoritmo.", color: "#38bdf8" },
                    { element: "Diagrama de Gantt", description: "Línea de tiempo que grafica qué proceso utilizó la CPU en cada segundo transcurrido.", color: "#fbbf24" },
                    { element: "Procesos Completados", description: "Procesos que finalizaron su tiempo de ráfaga y liberaron definitivamente el procesador.", color: "#a855f7" },
                    { element: "Quantum (En Round Robin)", description: "Rebanada máxima de tiempo (q=2s) asignada antes de que el proceso sea expulsado al final de la cola.", color: "#f97316" }
                  ]}
                />
              </div>
            </div>

            {/* Visualización de la CPU y la Cola de Listos */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* CPU en Ejecución */}
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 shadow-xl relative overflow-hidden flex flex-col justify-between">
                <div className="text-xs font-semibold text-slate-300 flex items-center justify-between mb-3">
                  <span className="uppercase tracking-wider">CPU en Servicio</span>
                  <Clock className="w-4 h-4 text-blue-400" />
                </div>

                {activeProcess ? (
                  <div className="bg-slate-800/80 p-4 rounded-xl border border-emerald-500/40 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-emerald-400 text-sm">{activeProcess.id}: {activeProcess.name}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-300 font-semibold animate-pulse">
                        EN EJECUCIÓN
                      </span>
                    </div>
                    <div className="text-xs text-slate-300">
                      Ráfaga Restante: <strong className="text-white text-base">{activeProcess.remaining} s</strong>
                    </div>
                    {activeProcess.qUsed !== undefined && (
                      <div className="text-[11px] text-amber-300">
                        Quantum Usado: {activeProcess.qUsed} / 2 s
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-6 rounded-xl border border-slate-800 bg-slate-950/40 text-center text-xs text-slate-400 italic">
                    CPU Ociosa (Esperando procesos en cola)
                  </div>
                )}

                <div className="text-xs text-slate-400 mt-3 pt-2 border-t border-slate-800 flex justify-between">
                  <span>Reloj Global:</span>
                  <strong className="text-white">{time} segundos</strong>
                </div>
              </div>

              {/* Cola de Listos (Ready Queue) */}
              <div className="md:col-span-2 p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between shadow-xl">
                <div className="text-xs font-semibold text-slate-300 flex items-center justify-between mb-3">
                  <span className="uppercase tracking-wider">Cola de Espera (Ready Queue) — [{queue.length} procesos]</span>
                  <span className="text-[11px] text-blue-400 font-medium">Secuencia de Planificación</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <AnimatePresence>
                    {queue.map((proc, i) => (
                      <motion.div
                        key={proc.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="p-3 bg-slate-800/80 border border-slate-700/60 rounded-xl flex items-center justify-between"
                      >
                        <div>
                          <div className="font-bold text-xs text-white">
                            #{i + 1} {proc.id}: {proc.name}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            Ráfaga requerida: {proc.burst} s
                          </div>
                        </div>
                        {proc.priority !== undefined && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/30 font-semibold">
                            Prioridad {proc.priority}
                          </span>
                        )}
                      </motion.div>
                    ))}
                    {queue.length === 0 && (
                      <div className="col-span-2 text-center py-6 text-xs text-slate-400 italic">
                        La cola de espera está vacía. Todos los procesos han sido despachados.
                      </div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="text-xs text-slate-400 mt-3 pt-2 border-t border-slate-800 flex justify-between">
                  <span>Procesos completados: <strong className="text-emerald-400">{completed.length}</strong></span>
                  <span>Criterio: <strong className="text-slate-200">{selectedScenario.algorithm}</strong></span>
                </div>
              </div>
            </div>

            {/* Diagrama de Gantt en Tiempo Real */}
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2.5 shadow-xl">
              <div className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span className="uppercase tracking-wider">Diagrama de Gantt (Historial Cronológico de CPU)</span>
                <span className="text-[11px] text-slate-400">{ganttHistory.length} intervalos registrados</span>
              </div>

              <div className="h-12 bg-slate-950 rounded-xl border border-slate-800 flex items-center overflow-x-auto p-1.5 gap-1.5 custom-scrollbar">
                {ganttHistory.map((g, idx) => (
                  <div
                    key={idx}
                    className="min-w-9 h-full rounded-lg bg-blue-600/30 border border-blue-500/50 flex flex-col items-center justify-center text-[10px] font-bold text-blue-200"
                    title={`Segundo ${g.time}: ${g.id}`}
                  >
                    <span>{g.id}</span>
                    <span className="text-[8px] text-slate-400">{g.time}s</span>
                  </div>
                ))}
                {ganttHistory.length === 0 && (
                  <div className="w-full text-center text-xs text-slate-500 italic">
                    El diagrama de Gantt se graficará en este panel al iniciar la simulación...
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="text-xs text-slate-500 border-t border-slate-800 pt-3 flex justify-between">
            <span>Sistemas Operativos // Algoritmos de Planificación de Procesador</span>
            <span>Módulo de Aprendizaje Activo</span>
          </div>
        </div>
      </div>
    </div>
  );
}
