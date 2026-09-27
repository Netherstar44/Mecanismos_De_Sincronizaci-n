import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export function CreditsOverlay({ 
  isOpen, 
  onClose 
}: { 
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-50 flex items-center justify-center p-4 md:p-8 pointer-events-auto"
        >
          {/* Backdrop blur */}
          <div 
            className="absolute inset-0 bg-slate-950/85 backdrop-blur-md"
            onClick={onClose}
          />
          
          <motion.div 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className="relative w-full max-w-4xl max-h-[88vh] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-y-auto custom-scrollbar text-slate-100 font-sans"
          >
            {/* Header */}
            <div className="sticky top-0 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 p-6 flex justify-between items-center z-10">
              <div>
                <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white">
                  Autores & Referencias Bibliográficas
                </h2>
                <div className="text-xs text-slate-400 mt-1">
                  Mecanismos de Sincronización en Sistemas Operativos — Formato APA 7ma Edición
                </div>
              </div>
              
              <button 
                onClick={onClose}
                className="w-9 h-9 bg-slate-800 hover:bg-slate-700 flex items-center justify-center rounded-xl text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 md:p-8 space-y-12">
              
              {/* Autores */}
              <section>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-2.5 mb-5 flex items-center gap-2">
                  <span>Arquitectos del Proyecto & Desarrollo</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-slate-950/60 p-5 rounded-2xl border border-slate-800 relative overflow-hidden group hover:border-slate-700 transition-all">
                    <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs mb-3">
                      JC
                    </div>
                    <h4 className="text-base font-bold text-white mb-1">Jose Correa</h4>
                    <p className="text-xs text-blue-400 font-medium">Desarrollo & Arquitectura 3D</p>
                    <p className="text-[11px] text-slate-400 mt-2">Sistemas Operativos — Concurrencia</p>
                  </div>

                  <div className="bg-slate-950/60 p-5 rounded-2xl border border-slate-800 relative overflow-hidden group hover:border-slate-700 transition-all">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs mb-3">
                      CR
                    </div>
                    <h4 className="text-base font-bold text-white mb-1">Carlos Rincon</h4>
                    <p className="text-xs text-emerald-400 font-medium">Desarrollo & Simulación Didáctica</p>
                    <p className="text-[11px] text-slate-400 mt-2">Sistemas Operativos — Algoritmos</p>
                  </div>

                  <div className="bg-slate-950/60 p-5 rounded-2xl border border-slate-800 relative overflow-hidden group hover:border-slate-700 transition-all">
                    <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-xs mb-3">
                      SC
                    </div>
                    <h4 className="text-base font-bold text-white mb-1">Sebastian Charry</h4>
                    <p className="text-xs text-purple-400 font-medium">Desarrollo & Modelado de Procesos</p>
                    <p className="text-[11px] text-slate-400 mt-2">Sistemas Operativos — Arquitectura</p>
                  </div>
                </div>
              </section>

              {/* Bibliografía Oficial APA 7ma Edición */}
              <section>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-2.5 mb-5 flex items-center gap-2">
                  <span>Referencias Bibliográficas Académicas (Normas APA 7ma Edición)</span>
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
                  <BibliographyEntry
                    num="01"
                    text='BYJU&apos;S CS. (2023). Semaphores in Operating System. BYJU&apos;S GATE Notes.'
                    href="https://byjus.com/gate/semaphores-in-operating-system-notes/"
                  />
                  <BibliographyEntry
                    num="02"
                    text='Dijkstra, E. W. (1965). Cooperating sequential processes (Technical Report EWD-123). Technological University Eindhoven.'
                    href="https://www.cs.utexas.edu/~EWD/transcriptions/EWD01xx/EWD123.html"
                  />
                  <BibliographyEntry
                    num="03"
                    text='GeeksforGeeks. (2025, July 23). Hardware Synchronization Algorithms: Unlock and Lock, Test and Set, Swap. GeeksforGeeks CS Corner.'
                    href="https://www.geeksforgeeks.org/operating-systems/hardware-synchronization-algorithms-unlock-and-lock-test-and-set-swap/"
                  />
                  <BibliographyEntry
                    num="04"
                    text='Rinard, M. C. (1998). Operating Systems Lecture Notes: Lecture 5 - Implementing Synchronization Operations. MIT Laboratory for Computer Science (CSAIL).'
                    href="https://people.csail.mit.edu/rinard/teaching/osnotes/h5.html"
                  />
                  <BibliographyEntry
                    num="05"
                    text='Silberschatz, A., Galvin, P. B., & Gagne, G. (2018). Operating System Concepts (10th ed.). John Wiley & Sons.'
                    href="https://www.wiley.com/en-us/Operating+System+Concepts%2C+10th+Edition-p-9781119320913"
                  />
                  <BibliographyEntry
                    num="06"
                    text='TutorialsPoint. (2026, March 17). Semaphores in Operating System. TutorialsPoint Computer Science Articles.'
                    href="https://www.tutorialspoint.com/article/semaphores-in-operating-system"
                  />
                  <BibliographyEntry
                    num="07"
                    text='Wikipedia. (2026, September 8). Test-and-set. Wikimedia Foundation.'
                    href="https://en.wikipedia.org/wiki/Test-and-set"
                  />
                </div>
              </section>

              {/* Guía de Citas en Texto */}
              <section>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-2.5 mb-5 flex items-center gap-2">
                  <span>Índice Rápido de Citas Aplicadas en el Simulador</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-300">
                  <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 flex items-start gap-2.5">
                    <span className="text-blue-400 font-bold">[1]</span>
                    <span>Dijkstra, E. W. (1965) — Origen histórico de semáforos, suspensión en kernel y primitivas atómicas P y V.</span>
                  </div>
                  <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 flex items-start gap-2.5">
                    <span className="text-blue-400 font-bold">[2]</span>
                    <span>Silberschatz et al. (2018) — Exclusión mutua, soporte de hardware (TSL) y semáforos contadores.</span>
                  </div>
                  <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 flex items-start gap-2.5">
                    <span className="text-blue-400 font-bold">[3]</span>
                    <span>Rinard, M. C. (MIT 1998) — Línea LOCK# de bus, operaciones atómicas indivisibles de procesador.</span>
                  </div>
                  <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 flex items-start gap-2.5">
                    <span className="text-blue-400 font-bold">[4]</span>
                    <span>GeeksforGeeks (2025) — Algoritmos de sincronización por hardware: Spinlocks, Test-and-Set y Swap.</span>
                  </div>
                  <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 flex items-start gap-2.5">
                    <span className="text-blue-400 font-bold">[5]</span>
                    <span>Wikipedia (2026) — Arquitectura de instrucción Test-and-Set en microprocesadores modernos.</span>
                  </div>
                  <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 flex items-start gap-2.5">
                    <span className="text-blue-400 font-bold">[6]</span>
                    <span>BYJU&apos;S (2023) — Semáforos binarios (Mutex) y contadores con colas de procesos bloqueados.</span>
                  </div>
                  <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 flex items-start gap-2.5">
                    <span className="text-blue-400 font-bold">[7]</span>
                    <span>TutorialsPoint (2026) — Implementación didáctica del problema Productor-Consumidor.</span>
                  </div>
                </div>
              </section>

              {/* Repositorio GitHub */}
              <section>
                <div className="p-5 bg-slate-950/60 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h4 className="font-bold text-white text-sm">Repositorio Oficial en GitHub</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Código fuente, esquemas 3D y documentación de despliegue en Cloudflare Pages.</p>
                  </div>
                  <a
                    href="https://github.com/Netherstar44/Mecanismos_De_Sincronizaci-n"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold tracking-wide transition-colors shrink-0 text-center"
                  >
                    Ver en GitHub
                  </a>
                </div>
              </section>

              <div className="pt-4 border-t border-slate-800 text-xs text-slate-500 flex justify-between">
                <span>Proyecto de Sistemas Operativos // Concurrencia & Sincronización</span>
                <span>Edición 2026</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function BibliographyEntry({ num, text, href }: { num: string; text: string; href?: string }) {
  return (
    <div className="relative pl-8">
      <span className="font-mono text-xs absolute left-0 top-1 text-blue-400 font-bold">[{num}]</span>
      <span className="leading-relaxed">{text}</span>
      {href && (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center ml-2 align-middle hover:scale-110 transition-transform opacity-70 hover:opacity-100 text-blue-400"
          title="Ver enlace a la fuente académica"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
            <polyline points="15 3 21 3 21 9"></polyline>
            <line x1="10" y1="14" x2="21" y2="3"></line>
          </svg>
        </a>
      )}
    </div>
  );
}
