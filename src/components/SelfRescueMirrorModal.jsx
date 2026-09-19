import React, { useState } from 'react';
import { X, ArrowLeft, Sparkles, Heart, Feather, ShieldCheck, Sun, CloudRain, Check } from 'lucide-react';

export default function SelfRescueMirrorModal({ 
  rescueLetter, 
  onSaveLetter, 
  onClose, 
  initialMode = 'read' // 'read' | 'write'
}) {
  const [mode, setMode] = useState(rescueLetter ? initialMode : 'write');
  const [letterText, setLetterText] = useState(rescueLetter?.text || '');
  const [anchorReminders, setAnchorReminders] = useState(
    rescueLetter?.anchors || '1. Respira hondo, esto también pasará.\n2. Lávate la cara con agua fresca.\n3. No tomes decisiones drásticas hoy.'
  );

  const handleSave = (e) => {
    e.preventDefault();
    if (!letterText.trim()) return;

    onSaveLetter({
      text: letterText.trim(),
      anchors: anchorReminders.trim(),
      date: 'Hoy (Día en Paz)',
      updatedAt: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
    });

    setMode('read');
  };

  return (
    <div className="fixed inset-0 bg-[#0c1412]/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn select-none">
      <div className="w-full max-w-sm bg-[#faf7f2] rounded-[40px] p-6 shadow-2xl border border-[#e8dfd1] flex flex-col max-h-[90vh] overflow-hidden relative">
        
        {/* Cabecera */}
        <div className="flex justify-between items-center pb-3 border-b border-[#e8ded0]">
          <div className="flex items-center gap-2">
            <button 
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-600 transition-colors mr-1 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#8c6d48] bg-amber-50 border border-amber-200/60 px-3 py-1 rounded-full flex items-center gap-1.5">
              <Feather className="w-3.5 h-3.5 text-[#8c6d48]" /> Espejo de Auto-Rescate
            </span>
          </div>

          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center text-stone-400 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* =========================================================================
            MODO 1: LEER LA CARTA (EN DÍAS OSCUROS)
           ========================================================================= */}
        {mode === 'read' && rescueLetter && (
          <div className="p-1 overflow-y-auto space-y-4 flex-1 text-xs pt-3 animate-fadeIn">
            
            {/* Mensaje de Contención */}
            <div className="bg-gradient-to-r from-amber-50 to-[#faf5ee] border border-amber-200/80 p-3.5 rounded-2xl flex items-center gap-3 shadow-2xs">
              <div className="w-8 h-8 rounded-xl bg-amber-100/80 text-[#8c6d48] flex items-center justify-center flex-shrink-0">
                <Sun className="w-4 h-4" />
              </div>
              <p className="text-[11px] text-stone-700 leading-snug">
                Tu yo en calma te escribió esto con amor para este momento exacto. Respira y lee despacio:
              </p>
            </div>

            {/* La Carta en Lino Editorial */}
            <div className="bg-white p-5 rounded-3xl border-2 border-[#eaddcf] shadow-sm space-y-3 relative">
              <div className="flex justify-between items-center text-[10px] text-[#8c6d48] font-semibold border-b border-stone-100 pb-2">
                <span>Para ti, de tu propia parte</span>
                <span className="text-stone-400">{rescueLetter.updatedAt || rescueLetter.date}</span>
              </div>

              <p className="text-xs font-serif italic text-stone-800 leading-relaxed whitespace-pre-line pt-1">
                “{rescueLetter.text}”
              </p>

              {/* Anclajes de emergencia */}
              {rescueLetter.anchors && (
                <div className="pt-3 border-t border-stone-100 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-[#8c6d48] tracking-wider block">
                    Recuerda tus 3 anclas:
                  </span>
                  <p className="text-[11px] text-stone-600 font-light leading-relaxed whitespace-pre-line">
                    {rescueLetter.anchors}
                  </p>
                </div>
              )}

              <div className="pt-2 flex justify-between items-center text-[10px] text-stone-400">
                <span>Espacio seguro con la Psic. Nayely</span>
                <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-100" />
              </div>
            </div>

            {/* Acciones */}
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setMode('write')}
                className="flex-1 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-medium transition-colors cursor-pointer"
              >
                Editar mi carta
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-2.5 bg-[#436146] hover:bg-[#253827] text-white rounded-xl text-xs font-medium transition-colors cursor-pointer shadow-sm"
              >
                Respirar y volver
              </button>
            </div>

          </div>
        )}

        {/* =========================================================================
            MODO 2: REDACTAR LA CARTA (EN DÍAS CLAROS Y DE PAZ)
           ========================================================================= */}
        {mode === 'write' && (
          <form onSubmit={handleSave} className="p-1 overflow-y-auto space-y-4 flex-1 text-xs pt-3 animate-fadeIn">
            
            <div className="bg-emerald-50/70 border border-emerald-200/80 p-3.5 rounded-2xl flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-[#436146] flex items-center justify-center flex-shrink-0">
                <Sun className="w-4 h-4" />
              </div>
              <p className="text-[11px] text-stone-700 leading-snug">
                Aprovecha este momento de claridad mental. Escríbele a tu <em>yo del futuro</em> para cuando lleguen los días nublados.
              </p>
            </div>

            {/* Campo de la Carta */}
            <div className="bg-white p-4 rounded-3xl border border-stone-200/80 shadow-xs space-y-2">
              <label className="font-semibold text-stone-800 text-[11px] uppercase tracking-wider block">
                ¿Qué necesitas recordarte cuando sientas que no puedes más?
              </label>
              <textarea
                rows="4"
                required
                value={letterText}
                onChange={(e) => setLetterText(e.target.value)}
                placeholder="Ej: Recuerda que esto es una emoción pasajera, no tu destino. Ya has salido de momentos así antes. No estás rota ni fallaste; solo estás cansada..."
                className="w-full p-3 rounded-2xl border border-stone-200 bg-stone-50/50 text-stone-800 text-xs focus:outline-none focus:ring-2 focus:ring-[#8c6d48] resize-none leading-relaxed"
              />
            </div>

            {/* Campo de Anclas Rápidas */}
            <div className="bg-white p-4 rounded-3xl border border-stone-200/80 shadow-xs space-y-2">
              <label className="font-semibold text-stone-700 text-[11px] uppercase tracking-wider block">
                3 Acciones de auto-rescate inmediato:
              </label>
              <textarea
                rows="3"
                value={anchorReminders}
                onChange={(e) => setAnchorReminders(e.target.value)}
                placeholder="1. Lavarme la cara con agua fría.&#10;2. Poner música suave.&#10;3. No tomar decisiones drásticas hoy."
                className="w-full p-3 rounded-2xl border border-stone-200 bg-stone-50/50 text-stone-800 text-xs focus:outline-none focus:ring-2 focus:ring-[#8c6d48] resize-none leading-relaxed"
              />
            </div>

            {/* Botón Guardar */}
            <button
              type="submit"
              className="w-full py-3.5 bg-[#8c6d48] hover:bg-[#735838] text-white rounded-2xl font-medium text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Check className="w-4 h-4" /> Guardar en mi Espejo de Rescate
            </button>
          </form>
        )}

      </div>
    </div>
  );
}