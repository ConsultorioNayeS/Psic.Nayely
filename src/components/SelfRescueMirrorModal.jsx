import React, { useState } from 'react';
import { X, ArrowLeft, Heart, Feather, Sun, Check } from 'lucide-react';

export default function SelfRescueMirrorModal({ 
  rescueLetter, 
  onSaveLetter, 
  onClose, 
  initialMode = 'read'
}) {
  const [mode, setMode] = useState(rescueLetter ? initialMode : 'write');
  const [letterText, setLetterText] = useState(rescueLetter?.text || '');
  const [anchorReminders, setAnchorReminders] = useState(
    rescueLetter?.anchors || '1. Respira hondo, esta tormenta también pasará.\n2. Lávate la cara con agua fresca.\n3. No tomes decisiones drásticas hoy.'
  );

  const handleSave = (e) => {
    e.preventDefault();
    if (!letterText.trim()) return;

    onSaveLetter({
      text: letterText.trim(),
      anchors: anchorReminders.trim(),
      date: 'Hoy (Día en Paz)',
      updatedAt: new Date().toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })
    });

    setMode('read');
  };

  return (
    <div className="fixed inset-0 bg-stone-900/65 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn select-none">
      <div className="w-full max-w-sm glass-panel rounded-[36px] sm:rounded-[40px] p-6 shadow-2xl border border-stone-200/80 flex flex-col max-h-[90vh] overflow-hidden relative">
        
        {/* Cabecera */}
        <div className="flex justify-between items-center pb-3 border-b border-stone-200/70">
          <div className="flex items-center gap-2">
            <button 
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white border border-stone-200 flex items-center justify-center text-stone-600 tap-bounce cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#7a5522] glass-pill px-3 py-1 rounded-full shadow-inner-light flex items-center gap-1.5">
              <Feather className="w-3.5 h-3.5 text-[#b88a44]" /> Espejo de Auto-Rescate
            </span>
          </div>

          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/70 hover:bg-white flex items-center justify-center text-stone-400 tap-bounce cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ================= MODO 1: LEER LA CARTA ================= */}
        {mode === 'read' && rescueLetter && (
          <div className="p-1 overflow-y-auto space-y-4 flex-1 text-xs pt-3 no-scrollbar animate-fadeIn">
            
            <div className="bg-gradient-to-r from-amber-50 to-[#faf5ee] border border-amber-200/80 p-3.5 rounded-2xl flex items-center gap-3 shadow-ambient">
              <div className="w-8 h-8 rounded-xl bg-amber-100/90 text-[#7a5522] flex items-center justify-center flex-shrink-0">
                <Sun className="w-4 h-4" />
              </div>
              <p className="text-[11px] text-stone-700 leading-snug">
                Tu yo en calma te escribió esto con profundo amor para este instante. Respira y lee despacio:
              </p>
            </div>

            {/* Carta en Lino Editorial */}
            <div className="bg-white p-5 rounded-[28px] border-2 border-[#eaddcf] shadow-ambient space-y-3 relative">
              <div className="flex justify-between items-center text-[10px] text-[#7a5522] font-semibold border-b border-stone-100 pb-2">
                <span>Para ti, de tu propia parte</span>
                <span className="text-stone-400 font-mono">{rescueLetter.updatedAt || rescueLetter.date}</span>
              </div>

              <p className="text-xs font-serif italic text-stone-900 leading-relaxed whitespace-pre-line pt-1">
                “{rescueLetter.text}”
              </p>

              {rescueLetter.anchors && (
                <div className="pt-3 border-t border-stone-100 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-[#7a5522] tracking-wider block font-sans">
                    Tus 3 anclas de calma:
                  </span>
                  <p className="text-[11px] text-stone-600 font-light leading-relaxed whitespace-pre-line">
                    {rescueLetter.anchors}
                  </p>
                </div>
              )}

              <div className="pt-2 flex justify-between items-center text-[10px] text-stone-400">
                <span>Espacio seguro con Nayely</span>
                <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-100" />
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                onClick={() => setMode('write')}
                className="flex-1 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-medium tap-bounce cursor-pointer"
              >
                Editar mi carta
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-2.5 bg-[#2a422d] hover:bg-[#1d2f20] text-white rounded-xl text-xs font-medium tap-bounce cursor-pointer shadow-luxe"
              >
                Respirar y volver
              </button>
            </div>

          </div>
        )}

        {/* ================= MODO 2: REDACTAR LA CARTA ================= */}
        {mode === 'write' && (
          <form onSubmit={handleSave} className="p-1 overflow-y-auto space-y-4 flex-1 text-xs pt-3 no-scrollbar animate-fadeIn">
            
            <div className="bg-emerald-50/80 border border-emerald-200/80 p-3.5 rounded-2xl flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-[#335236] flex items-center justify-center flex-shrink-0">
                <Sun className="w-4 h-4" />
              </div>
              <p className="text-[11px] text-stone-700 leading-snug">
                Aprovecha tu claridad presente. Escríbele a tu <em>yo del futuro</em> para cuando el cielo se nuble.
              </p>
            </div>

            <div className="glass-panel p-4 rounded-3xl border border-stone-200/80 shadow-ambient space-y-2">
              <label className="font-semibold text-stone-800 text-[11px] uppercase tracking-wider block">
                ¿Qué necesitas recordarte cuando sientas que no puedes más?
              </label>
              <textarea
                rows="4"
                required
                value={letterText}
                onChange={(e) => setLetterText(e.target.value)}
                placeholder="Ej: Recuerda que esto es una ola pasajera, no tu destino final. Ya has salido de momentos difíciles antes. No estás rota ni fallaste; solo estás agotada..."
                className="w-full p-3 rounded-2xl border border-stone-200 bg-white text-stone-800 text-xs focus:outline-none focus:ring-2 focus:ring-[#7a5522]/30 resize-none leading-relaxed font-serif"
              />
            </div>

            <div className="glass-panel p-4 rounded-3xl border border-stone-200/80 shadow-ambient space-y-2">
              <label className="font-semibold text-stone-700 text-[11px] uppercase tracking-wider block">
                3 Acciones de rescate inmediato:
              </label>
              <textarea
                rows="3"
                value={anchorReminders}
                onChange={(e) => setAnchorReminders(e.target.value)}
                placeholder="1. Lavarme la cara con agua fría.&#10;2. Ponerme audífonos con sonidos de calma.&#10;3. No tomar decisiones drásticas hoy."
                className="w-full p-3 rounded-2xl border border-stone-200 bg-white text-stone-800 text-xs focus:outline-none focus:ring-2 focus:ring-[#7a5522]/30 resize-none leading-relaxed"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#7a5522] hover:bg-[#604218] text-white rounded-2xl font-medium text-xs shadow-luxe transition-all flex items-center justify-center gap-2 tap-bounce cursor-pointer"
            >
              <Check className="w-4 h-4" /> Guardar en mi Espejo de Rescate
            </button>
          </form>
        )}

      </div>
    </div>
  );
}