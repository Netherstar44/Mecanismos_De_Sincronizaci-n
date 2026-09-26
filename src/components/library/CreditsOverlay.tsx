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
            className="absolute inset-0 bg-[#030811]/90 backdrop-blur-md"
            onClick={onClose}
          />
          
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className="relative w-full max-w-4xl max-h-[85vh] bg-black border border-[#00ffff]/30 shadow-[0_0_30px_rgba(0,255,255,0.1)] overflow-y-auto custom-scrollbar"
          >
            {/* Header */}
            <div className="sticky top-0 bg-black/90 backdrop-blur-md border-b border-[#00ffff]/20 p-6 flex justify-between items-center z-10">
              <div>
                <h2 className="font-sans text-2xl md:text-3xl font-black uppercase tracking-tighter text-white">
                  Registro del Sistema
                </h2>
                <div className="font-mono text-xs text-[#00ffff]/70 mt-1">
                  &gt; AUTORES Y REFERENCIAS BIBLIOGRÁFICAS //
                </div>
              </div>
              
              <button 
                onClick={onClose}
                className="w-10 h-10 bg-[#00ffff]/10 hover:bg-[#00ffff]/20 flex items-center justify-center rounded-full text-[#00ffff] transition-colors border border-[#00ffff]/30"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 md:p-10 space-y-16">
              
              {/* Autores */}
              <section>
                <h3 className="font-mono text-sm text-[#00ffff] border-b border-[#00ffff]/20 pb-2 mb-6">
                  &lt; ARQUITECTOS DE LA SIMULACIÓN /&gt;
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-white">
                  <div className="bg-[#030811] p-6 border border-white/10 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-[#00ffff]" />
                    <h4 className="font-sans text-lg font-bold mb-2">Jose Correa</h4>
                    <p className="font-mono text-xs text-white/50">DESARROLLO & ARQUITECTURA</p>
                  </div>
                  <div className="bg-[#030811] p-6 border border-white/10 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-[#00ff88]" />
                    <h4 className="font-sans text-lg font-bold mb-2">Carlos Rincon</h4>
                    <p className="font-mono text-xs text-white/50">DESARROLLO & ARQUITECTURA</p>
                  </div>
                  <div className="bg-[#030811] p-6 border border-white/10 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-[#38bdf8]" />
                    <h4 className="font-sans text-lg font-bold mb-2">Sebastian Charry</h4>
                    <p className="font-mono text-xs text-white/50">DESARROLLO & ARQUITECTURA</p>
                  </div>
                </div>
              </section>

              {/* Bibliografía Oficial APA 7ma Edición */}
              <section>
                <h3 className="font-mono text-sm text-[#00ffff] border-b border-[#00ffff]/20 pb-2 mb-6">
                  &lt; BASES DE DATOS Y REFERENCIAS BIBLIOGRÁFICAS (FORMATO APA 7MA EDICIÓN) /&gt;
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-serif text-sm text-white/80">
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
                <h3 className="font-mono text-sm text-[#00ff88] border-b border-[#00ff88]/20 pb-2 mb-6">
                  &lt; ÍNDICE DE CITAS EN TEXTO /&gt;
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs text-white/70">
                  <div className="bg-[#030811] p-3 border border-white/10 rounded">
                    <span className="text-[#00ffff] font-bold">[1]</span> Dijkstra, E. W. (1965) — Origen de semáforos y operaciones P y V.
                  </div>
                  <div className="bg-[#030811] p-3 border border-white/10 rounded">
                    <span className="text-[#00ffff] font-bold">[2]</span> Silberschatz et al. (2018) — Mecanismos de sincronización, TSL y Semáforos.
                  </div>
                  <div className="bg-[#030811] p-3 border border-white/10 rounded">
                    <span className="text-[#00ffff] font-bold">[3]</span> Rinard, M. C. (MIT 1998) — Operaciones de sincronización a nivel hardware/software.
                  </div>
                  <div className="bg-[#030811] p-3 border border-white/10 rounded">
                    <span className="text-[#00ffff] font-bold">[4]</span> GeeksforGeeks (2025) — Algoritmos de sincronización de hardware.
                  </div>
                  <div className="bg-[#030811] p-3 border border-white/10 rounded">
                    <span className="text-[#00ffff] font-bold">[5]</span> Wikipedia (2026) — Instrucción Test-and-Set y exclusión con Spinlocks.
                  </div>
                  <div className="bg-[#030811] p-3 border border-white/10 rounded">
                    <span className="text-[#00ffff] font-bold">[6]</span> BYJU&apos;S (2023) — Semáforos binarios y contadores en SO.
                  </div>
                  <div className="bg-[#030811] p-3 border border-white/10 rounded">
                    <span className="text-[#00ffff] font-bold">[7]</span> TutorialsPoint (2026) — Implementación Productor-Consumidor.
                  </div>
                </div>
              </section>

              {/* Documentación técnica */}
              <section>
                <h3 className="font-mono text-sm text-[#00ffff] border-b border-[#00ffff]/20 pb-2 mb-6">
                  &lt; DEPENDENCIAS DEL SISTEMA /&gt;
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-serif text-sm text-white/80">
                  <BibliographyEntry num="T1" text="Three.js — Biblioteca JavaScript para gráficos 3D acelerados por GPU." href="https://threejs.org/docs/" />
                  <BibliographyEntry num="T2" text="React Three Fiber — Renderizador declarativo de React para Three.js." href="https://r3f.docs.pmnd.rs/" />
                  <BibliographyEntry num="T3" text="React 19 — Biblioteca central para interfaces de usuario reactivas." href="https://react.dev/" />
                  <BibliographyEntry num="T4" text="Cloudflare Pages — Plataforma de ejecución y despliegue edge global." href="https://pages.cloudflare.com/" />
                </div>
              </section>

              {/* Open Source */}
              <section>
                <h3 className="font-mono text-sm text-[#00ffff] border-b border-[#00ffff]/20 pb-2 mb-6">
                  &lt; REPOSITORIO CENTRAL GITHUB /&gt;
                </h3>
                <div className="font-sans text-base text-white/80 p-6 bg-[#030811] border border-white/10 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-[#00ffff]" />
                  Código fuente y arquitectura del simulador disponible en GitHub: <a href="https://github.com/Netherstar44/Mecanismos_De_Sincronizaci-n" target="_blank" rel="noopener noreferrer" className="text-[#00ffff] hover:text-white hover:underline transition-colors font-bold">Netherstar44/Mecanismos_De_Sincronizaci-n</a>.
                </div>
              </section>

              <div className="pt-8 border-t border-white/10 font-mono text-xs text-white/40 flex justify-between">
                <span>LABORATORIO DE SISTEMAS OPERATIVOS // V2.0</span>
                <span>FIN DEL REGISTRO</span>
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
      <span className="font-mono text-xs absolute left-0 top-1 text-[#00ffff]">[{num}]</span>
      <span>{text}</span>
      {href && (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center ml-2 align-middle hover:scale-110 transition-transform opacity-70 hover:opacity-100"
          title="Ver fuente"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00ffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
            <polyline points="15 3 21 3 21 9"></polyline>
            <line x1="10" y1="14" x2="21" y2="3"></line>
          </svg>
        </a>
      )}
    </div>
  );
}
