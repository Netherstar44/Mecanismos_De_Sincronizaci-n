import { useState, useRef, useEffect } from "react";
import { Terminal, Send } from "lucide-react";

interface HistoryEntry {
  command?: string;
  output: string | React.ReactNode;
  isError?: boolean;
}

export function KernelTerminal({ onOpenMap, onOpenSim }: { onOpenMap?: () => void; onOpenSim?: (appId: string) => void }) {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<HistoryEntry[]>([
    {
      output: (
        <div className="space-y-1 text-[#00ffff]">
          <p className="font-bold">══════════════════════════════════════════════════════════════════</p>
          <p className="font-bold">KERNEL-OS // TERMINAL DE CONTROL DE CONCURRENCIA v2.4 (x86_64)</p>
          <p className="text-white/70">Arquitectura de Procesos & Mecanismos de Sincronización</p>
          <p className="text-white/50 text-[11px]">Escribe <span className="text-[#00ff88] font-bold">help</span> para desplegar la lista de comandos disponibles.</p>
          <p className="font-bold">══════════════════════════════════════════════════════════════════</p>
        </div>
      )
    }
  ]);

  const [semValue, setSemValue] = useState(3);
  const [tslLock, setTslLock] = useState(false);
  const [bufferItems, setBufferItems] = useState<number[]>([101, 102]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = input.trim();
    if (!cmd) return;

    setInput("");
    const parts = cmd.split(" ");
    const main = parts[0].toLowerCase();
    const arg = parts[1]?.toLowerCase();

    const newHistory = [...history, { command: cmd, output: "" }];

    switch (main) {
      case "help":
        newHistory[newHistory.length - 1].output = (
          <div className="space-y-1.5 text-xs text-white/80 my-2">
            <p className="text-[#00ffff] font-bold">COMANDOS DISPONIBLES EN KERNEL-OS CLI:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pl-2">
              <p><span className="text-[#00ff88] font-bold">tsl --test</span> : Ejecuta instrucción TestAndSet atómica</p>
              <p><span className="text-[#00ff88] font-bold">tsl --unlock</span> : Libera candado TSL (lock = 0)</p>
              <p><span className="text-[#00ff88] font-bold">sem --wait</span> : Ejecuta primitiva wait(S)</p>
              <p><span className="text-[#00ff88] font-bold">sem --signal</span> : Ejecuta primitiva signal(S)</p>
              <p><span className="text-[#00ff88] font-bold">buffer --produce</span> : Inserta item en búfer N=5</p>
              <p><span className="text-[#00ff88] font-bold">buffer --consume</span> : Consume item del búfer</p>
              <p><span className="text-[#00ff88] font-bold">easteregg</span> : Abre el Mapa Táctico de Planificación</p>
              <p><span className="text-[#00ff88] font-bold">authors</span> : Ver equipo de desarrollo (Jose, Carlos, Sebastian)</p>
              <p><span className="text-[#00ff88] font-bold">biblio</span> : Despliega las 7 referencias APA 7ma Edición</p>
              <p><span className="text-[#00ff88] font-bold">status</span> : Ver telemetría de semáforos y CPU</p>
              <p><span className="text-[#00ff88] font-bold">clear</span> : Limpia la pantalla de la terminal</p>
            </div>
          </div>
        );
        break;

      case "authors":
      case "autores":
        newHistory[newHistory.length - 1].output = (
          <div className="bg-[#030c18] p-3 rounded border border-[#00ffff]/30 my-2 space-y-1.5">
            <p className="text-[#00ffff] font-bold tracking-wider">&lt; ARQUITECTOS Y DESARROLLADORES DEL SISTEMA /&gt;</p>
            <p className="text-white font-bold">1. Jose Correa <span className="text-white/40 text-xs font-normal">— Ingeniería & Sistemas</span></p>
            <p className="text-white font-bold">2. Carlos Rincon <span className="text-white/40 text-xs font-normal">— Ingeniería & Sistemas</span></p>
            <p className="text-white font-bold">3. Sebastian Charry <span className="text-white/40 text-xs font-normal">— Ingeniería & Sistemas</span></p>
            <p className="text-emerald-400 text-xs mt-2">Proyecto de Mecanismos de Sincronización en Sistemas Operativos.</p>
          </div>
        );
        break;

      case "tsl":
        if (arg === "--test" || arg === "test") {
          if (!tslLock) {
            setTslLock(true);
            newHistory[newHistory.length - 1].output = (
              <p className="text-emerald-400 font-bold">
                [TSL SUCCESS] TestAndSet(&lock) retornó FALSE. lock fijado a TRUE. Hilo ingresó a Sección Crítica.
              </p>
            );
          } else {
            newHistory[newHistory.length - 1].output = (
              <p className="text-amber-400 font-bold">
                [TSL BUSY] TestAndSet(&lock) retornó TRUE. lock sigue en TRUE. Hilo queda atrapado en SPINLOCK (Espera Activa).
              </p>
            );
          }
        } else if (arg === "--unlock" || arg === "unlock") {
          setTslLock(false);
          newHistory[newHistory.length - 1].output = (
            <p className="text-cyan-400 font-bold">
              [TSL UNLOCKED] Escritura simple: lock = false. Recurso liberado.
            </p>
          );
        } else {
          newHistory[newHistory.length - 1].output = (
            <p className="text-white/70">Uso: <span className="text-cyan-300">tsl --test</span> | <span className="text-cyan-300">tsl --unlock</span></p>
          );
        }
        break;

      case "sem":
      case "semaphore":
        if (arg === "--wait" || arg === "wait") {
          const nextVal = semValue - 1;
          setSemValue(nextVal);
          newHistory[newHistory.length - 1].output = (
            <p className={nextVal >= 0 ? "text-emerald-400" : "text-rose-400 font-bold"}>
              {nextVal >= 0 
                ? `[WAIT OK] S.value decrementado a ${nextVal}. Proceso adquiere recurso sin bloqueo.`
                : `[WAIT SLEEP] S.value = ${nextVal} (< 0). Proceso suspendido y encolado en S.queue [SLEEP].`}
            </p>
          );
        } else if (arg === "--signal" || arg === "signal") {
          const nextVal = semValue + 1;
          setSemValue(nextVal);
          newHistory[newHistory.length - 1].output = (
            <p className="text-cyan-400">
              {nextVal <= 0 
                ? `[SIGNAL WAKEUP] S.value incrementado a ${nextVal}. Sistema despierta al primer hilo en cola [WAKEUP].`
                : `[SIGNAL OK] S.value incrementado a ${nextVal}. Recurso añadido al pool disponible.`}
            </p>
          );
        } else {
          newHistory[newHistory.length - 1].output = (
            <p className="text-white/70">Uso: <span className="text-cyan-300">sem --wait</span> | <span className="text-cyan-300">sem --signal</span></p>
          );
        }
        break;

      case "buffer":
        if (arg === "--produce" || arg === "produce") {
          if (bufferItems.length >= 5) {
            newHistory[newHistory.length - 1].output = (
              <p className="text-rose-400 font-bold">[BUFFER FULL] empty=0. Productor suspendido esperando espacio.</p>
            );
          } else {
            const nextId = (bufferItems[bufferItems.length - 1] || 100) + 1;
            setBufferItems(prev => [...prev, nextId]);
            newHistory[newHistory.length - 1].output = (
              <p className="text-emerald-400">
                [PRODUCED] Item #{nextId} insertado. Búfer: [{[...bufferItems, nextId].join(", ")}] ({bufferItems.length + 1}/5).
              </p>
            );
          }
        } else if (arg === "--consume" || arg === "consume") {
          if (bufferItems.length === 0) {
            newHistory[newHistory.length - 1].output = (
              <p className="text-amber-400 font-bold">[BUFFER EMPTY] full=0. Consumidor suspendido esperando elementos.</p>
            );
          } else {
            const consumed = bufferItems[0];
            const nextBuf = bufferItems.slice(1);
            setBufferItems(nextBuf);
            newHistory[newHistory.length - 1].output = (
              <p className="text-cyan-400">
                [CONSUMED] Item #{consumed} retirado. Búfer: [{nextBuf.join(", ")}] ({nextBuf.length}/5).
              </p>
            );
          }
        } else {
          newHistory[newHistory.length - 1].output = (
            <p className="text-white/70">Uso: <span className="text-cyan-300">buffer --produce</span> | <span className="text-cyan-300">buffer --consume</span></p>
          );
        }
        break;

      case "status":
        newHistory[newHistory.length - 1].output = (
          <div className="space-y-1 text-xs text-white/80 my-2 bg-black/40 p-3 rounded border border-white/10">
            <p className="text-[#00ffff] font-bold">ESTADO DEL KERNEL:</p>
            <p>• Lock Hardware (TSL): <span className={tslLock ? "text-rose-400 font-bold" : "text-emerald-400 font-bold"}>{tslLock ? "1 (LOCKED / SPINLOCK ACTIVO)" : "0 (LIBRE)"}</span></p>
            <p>• Semáforo Contador S: <span className="text-cyan-400 font-bold">{semValue}</span> {semValue < 0 ? `(${Math.abs(semValue)} en cola sleep)` : "(recursos disponibles)"}</p>
            <p>• Búfer Productor-Consumidor: <span className="text-amber-400 font-bold">{bufferItems.length} / 5</span> elementos en cola</p>
            <p>• CPU Load: 12% | Bus Memory: Interlocked DPRAM Active</p>
          </div>
        );
        break;

      case "biblio":
        newHistory[newHistory.length - 1].output = (
          <div className="space-y-2 text-[11px] text-white/80 my-2">
            <p className="text-[#00ffff] font-bold">REFERENCIAS OFICIALES (FORMATO APA 7MA EDICIÓN):</p>
            <p>[1] Dijkstra, E. W. (1965). Cooperating sequential processes. Tech. Univ. Eindhoven.</p>
            <p>[2] Silberschatz, A., Galvin, P. B., & Gagne, G. (2018). Operating System Concepts (10th ed.). Wiley.</p>
            <p>[3] Rinard, M. C. (1998). Operating Systems Lecture Notes. MIT CSAIL.</p>
            <p>[4] GeeksforGeeks. (2025). Hardware Synchronization Algorithms.</p>
            <p>[5] Wikipedia. (2026). Test-and-set.</p>
            <p>[6] BYJU&apos;S CS. (2023). Semaphores in Operating System.</p>
            <p>[7] TutorialsPoint. (2026). Semaphores in Operating System.</p>
          </div>
        );
        break;

      case "easteregg":
      case "map":
        if (onOpenMap) {
          onOpenMap();
          newHistory[newHistory.length - 1].output = (
            <p className="text-purple-400 font-bold">
              [EASTER EGG] Abriendo Mapa Táctico de Planificación de Procesos...
            </p>
          );
        }
        break;

      case "clear":
        setHistory([]);
        return;

      default:
        newHistory[newHistory.length - 1].output = (
          <p className="text-rose-400">
            Comando no reconocido: '{cmd}'. Escribe <span className="text-cyan-400 underline cursor-pointer" onClick={() => setInput("help")}>help</span> para ver la lista.
          </p>
        );
        newHistory[newHistory.length - 1].isError = true;
    }

    setHistory(newHistory);
  };

  return (
    <div className="h-full flex flex-col bg-[#050914] text-white font-mono text-xs select-none p-4 overflow-hidden">
      <div className="flex items-center justify-between border-b border-[#00ffff]/20 pb-2 mb-3">
        <div className="flex items-center gap-2 text-[#00ffff]">
          <Terminal className="w-4 h-4" />
          <span className="font-bold tracking-wider">KERNEL SHELL v2.4 // /bin/bash</span>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-white/40">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          ONLINE
        </div>
      </div>

      {/* Salida de la Terminal */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
        {history.map((entry, idx) => (
          <div key={idx} className="space-y-1">
            {entry.command && (
              <div className="flex items-center gap-2 text-white/90">
                <span className="text-[#00ffff] font-bold">root@sync-kernel:~$</span>
                <span className="text-white">{entry.command}</span>
              </div>
            )}
            <div className="pl-4">{entry.output}</div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Entrada de Comandos */}
      <form onSubmit={handleCommand} className="mt-3 flex items-center gap-2 pt-2 border-t border-white/10">
        <span className="text-[#00ff88] font-bold">root@sync-kernel:~$</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe un comando... (ej: 'help', 'authors', 'tsl --test', 'sem --wait')"
          className="flex-1 bg-transparent text-white placeholder-white/30 outline-none text-xs"
          autoFocus
        />
        <button type="submit" className="text-[#00ffff] hover:text-white p-1">
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
}
