import React, { useState } from 'react';
import { X, Sparkles, BookOpen, Plus, ArrowLeft, Heart, Quote } from 'lucide-react';

export default function EpiphanyVaultModal({ 
  epiphanies = [], 
  onAddEpiphany, 
  onClose,
  patientName = 'Paciente' // ⭐ NOMBRE DINÁMICO (fallback seguro)
}) {
  const [newInsight, setNewInsight] = useState('');
  const [sessionContext, setSessionContext] = useState('');

  // ⭐ Solo el primer nombre para personalizar la firma
  const firstName = patientName ? patientName.split(' ')[0] : 'Paciente';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newInsight.trim()) return;

    onAddEpiphany({
      id: Date.now(),
      insight: newInsight.trim(),
      context: sessionContext.trim() || 'Sesión con Nayely',
      date: 'Anotado hoy',
      author: firstName // ⭐ ANTES: 'Camila' hardcodeado
    });

    setNewInsight('');
    setSessionContext('');
  };

  return (
  <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
    <div className="w-full max-w-md bg-[#faf8f5] text-stone-800 rounded-[32px] sm:rounded-[36px] max-h-[88vh] flex flex-col shadow-2xl border border-amber-100 overflow-hidden">
        
        {/* Cabecera Luminosa */}
        <div className="p-5 border-b border-warm-200/60 flex justify-between items-center bg-white/80 backdrop-blur-sm">
          <div className="flex items-center gap-2.5">
            <button 
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-600 transition-colors mr-1 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="w-10 h-10 rounded-2xl bg-[#f5efe6] border border-[#e8ded0] flex items-center justify-center text-[#8c6d48]">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8c6d48]">Bitácora Personal</span>
              <h3 className="text-sm font-semibold text-stone-800">Cuaderno de Sabiduría</h3>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-400 text-xs cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-5 flex-1 text-xs">
          
          <p className="text-stone-600 font-light leading-relaxed">
            Aquí residen tus mayores aprendizajes de consulta. Cuando sientas que estás retrocediendo, vuelve aquí para recordar cuánto has transformado con Nayely.
          </p>

          {/* Formulario para registrar un aprendizaje */}
          <form onSubmit={handleSubmit} className="bg-white p-4 rounded-3xl border border-stone-200/80 shadow-sm space-y-3">
            <label className="font-semibold text-stone-700 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#8c6d48]" /> ¿Qué verdad o aprendizaje te llevas hoy?
            </label>
            <textarea
              rows="2"
              required
              value={newInsight}
              onChange={(e) => setNewInsight(e.target.value)}
              placeholder="Ej: Entendí que la culpa no es por fallar, sino por la autoexigencia que aprendí de niña..."
              className="w-full p-3 rounded-2xl border border-stone-200 bg-stone-50/50 focus:outline-none focus:ring-2 focus:ring-[#8c6d48] text-stone-800 text-xs resize-none placeholder-stone-400"
            />

            <div className="flex justify-between items-center gap-2">
              <input
                type="text"
                value={sessionContext}
                onChange={(e) => setSessionContext(e.target.value)}
                placeholder="Contexto (ej: Sesión sobre límites)"
                className="flex-1 p-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-stone-700 text-xs placeholder-stone-400"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-[#436146] hover:bg-[#253827] text-white font-medium rounded-xl text-xs flex items-center gap-1 shadow-sm transition-all flex-shrink-0 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Guardar
              </button>
            </div>
          </form>

          {/* Lista de Tarjetas de Aprendizajes (Estilo Papel Editorial) */}
          <div className="space-y-3">
            <span className="font-semibold text-stone-400 text-[10px] uppercase tracking-wider block">
              Tus Aprendizajes Archivados ({epiphanies.length})
            </span>

            {epiphanies.map(item => (
              <div 
                key={item.id}
                className="bg-white border border-[#eaddcf] p-4 rounded-3xl shadow-sm space-y-2 relative"
              >
                <div className="flex justify-between items-center text-[10px] text-[#8c6d48]">
                  <span className="font-semibold">{item.context}</span>
                  <span className="text-stone-400">{item.date}</span>
                </div>

                <div className="flex gap-2 items-start">
                  <Quote className="w-4 h-4 text-[#8c6d48]/40 flex-shrink-0 mt-0.5" />
                  <p className="text-xs font-serif italic text-stone-800 leading-relaxed">
                    “{item.insight}”
                  </p>
                </div>

                <div className="pt-2 border-t border-stone-100 flex justify-between items-center text-[10px] text-stone-400">
                  <span className="text-stone-500 font-medium">Guiado por la Dra. Nayely</span>
                  <Heart className="w-3 h-3 text-rose-400" />
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
}