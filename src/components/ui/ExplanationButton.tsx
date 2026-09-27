import { useState } from "react";
import { HelpCircle, X } from "lucide-react";

interface ExplanationItem {
  element: string;
  description: string;
  color: string;
}

interface ExplanationButtonProps {
  title: string;
  items: ExplanationItem[];
  /** Optional: render inside a 3D Html component (use smaller styling) */
  compact?: boolean;
}

/**
 * ExplanationButton — Botón didáctico "Explicación" para simuladores
 * 
 * Al presionarlo, muestra un panel modal que describe qué representa
 * cada elemento visible en el simulador, facilitando la comprensión
 * del estudiante.
 */
export function ExplanationButton({ title, items, compact }: ExplanationButtonProps) {
  const [open, setOpen] = useState(false);

  if (compact) {
    // Versión compacta para paneles dentro de 3D (Html de drei)
    return (
      <>
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-1 px-2 py-1 bg-indigo-500/20 hover:bg-indigo-500/40 border border-indigo-400/50 rounded text-indigo-300 text-[10px] font-bold transition-colors"
        >
          <HelpCircle className="w-3 h-3" />
          <span>Explicación</span>
        </button>

        {open && (
          <div className="absolute inset-0 z-50 bg-[#030811]/98 backdrop-blur-sm p-3 rounded-xl flex flex-col overflow-y-auto">
            <div className="flex justify-between items-center border-b border-indigo-400/30 pb-2 mb-2">
              <span className="text-indigo-300 font-bold text-[11px]">
                📖 {title}
              </span>
              <button
                onClick={() => setOpen(false)}
                className="w-5 h-5 rounded bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-white text-[10px]"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
            <div className="space-y-1.5 text-[10px]">
              {items.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2 p-1.5 rounded-lg bg-slate-900/60 border border-slate-800">
                  <span
                    className="w-2.5 h-2.5 rounded-full mt-0.5 shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <div>
                    <strong className="text-white block">{item.element}</strong>
                    <span className="text-slate-400 leading-tight">{item.description}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </>
    );
  }

  // Versión normal (para paneles HTML estándar fuera de 3D)
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600/20 hover:bg-indigo-600/40 border border-indigo-500/40 rounded-xl text-indigo-300 text-xs font-semibold transition-all cursor-pointer shadow-md shadow-indigo-900/10"
      >
        <HelpCircle className="w-4 h-4" />
        <span>Explicación</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl overflow-y-auto max-h-[85vh]">
            <div className="flex justify-between items-center border-b border-slate-700 pb-3 mb-4">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-indigo-400" />
                {title}
              </h3>
              <button
                onClick={() => setOpen(false)}
                className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/60 border border-slate-700/60"
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full mt-0.5 shrink-0 ring-2 ring-offset-2 ring-offset-slate-900"
                    style={{ backgroundColor: item.color, borderColor: item.color }}
                  />
                  <div>
                    <strong className="text-white text-sm block mb-0.5">{item.element}</strong>
                    <span className="text-slate-400 text-xs leading-relaxed">{item.description}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 text-center">
              <button
                onClick={() => setOpen(false)}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer shadow-md"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
