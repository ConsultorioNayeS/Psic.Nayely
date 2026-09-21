import React from 'react';
import { 
  X, Wind, Headphones, Heart, Inbox, CheckCircle2, 
  Sparkles, ArrowRight, Sun, Smile, Meh, AlertCircle, Frown 
} from 'lucide-react';

export default function PreSessionBriefingModal({ 
  appointment, 
  patient, 
  sessionTopics = [], 
  tasks = [],
  moodCheckIns = [], // HISTORIAL 100% REAL DE ESTE PACIENTE
  onClose,
  onStartSession
}) {
  const moodStyles = {
    'Radiante': { icon: Sun, color: 'text-amber-600 bg-amber-50/90 border-amber-200' },
    'En Paz': { icon: Smile, color: 'text-emerald-700 bg-emerald-50/90 border-emerald-200' },
    'Neutral': { icon: Meh, color: 'text-stone-600 bg-stone-50/90 border-stone-200' },
    'Abrumado': { icon: AlertCircle, color: 'text-rose-600 bg-rose-50/90 border-rose-200' },
    'Triste': { icon: Frown, color: 'text-sky-600 bg-sky-50/90 border-sky-200' },
  };

  const completedTasks = tasks.filter(t => t.done).length;
  const patientDisplayName = patient?.firstName || patient?.name?.split(' ')[0] || appointment.patientName;

  // Filtrar y ordenar los check-ins reales de los últimos días
  const realMoodHistory = moodCheckIns.slice(0, 5);

  return (
    <div className="fixed inset-0 bg-stone-900/65 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn select-none">
      <div className="w-full max-w-md bg-[#faf8f5] rounded-[36px] p-6 shadow-2xl border border-stone-200/80 flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* Cabecera */}
        <div className="flex justify-between items-center pb-3.5 border-b border-stone-200/70">
          <div>
            <span className="text-[10px] font-bold tracking-[0.18em] uppercase text-[#335236] glass-pill px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 shadow-inner-light">
              <Sparkles className="w-3 h-3 text-emerald-700" /> Radiografía Pre-Sesión
            </span>
            <h3 className="text-base font-serif text-stone-900 mt-1">
              Preparación: {patientDisplayName}
            </h3>
            <p className="text-[11px] text-stone-400 font-light">
              Consulta de las {appointment.time} • Modalidad {appointment.modality}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white border border-stone-200 hover:bg-stone-100 flex items-center justify-center text-stone-500 text-xs transition-colors tap-bounce cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Contenido Genuino */}
        <div className="p-1 overflow-y-auto space-y-4 flex-1 text-xs pt-3 no-scrollbar">
          
          {/* Métricas de Adherencia Terapéutica Reales */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="glass-panel p-3 rounded-2xl border border-stone-200/70 shadow-ambient text-center">
              <Heart className="w-4 h-4 text-rose-500 mx-auto mb-1" />
              <span className="text-base font-semibold font-serif text-stone-900 block">{moodCheckIns.length}</span>
              <span className="text-[10px] text-stone-400 font-light block">Check-ins de pulso</span>
            </div>

            <div className="glass-panel p-3 rounded-2xl border border-stone-200/70 shadow-ambient text-center">
              <Inbox className="w-4 h-4 text-amber-600 mx-auto mb-1" />
              <span className="text-base font-semibold font-serif text-stone-900 block">{sessionTopics.length}</span>
              <span className="text-[10px] text-stone-400 font-light block">Temas en buzón</span>
            </div>

            <div className="glass-panel p-3 rounded-2xl border border-stone-200/70 shadow-ambient text-center">
              <CheckCircle2 className="w-4 h-4 text-[#335236] mx-auto mb-1" />
              <span className="text-base font-semibold font-serif text-stone-900 block">{completedTasks}/{tasks.length}</span>
              <span className="text-[10px] text-stone-400 font-light block">Tareas listas</span>
            </div>
          </div>

          {/* Historial de Registro Emocional 100% Verídico */}
          <div className="glass-panel p-4 rounded-3xl border border-stone-200/80 shadow-ambient space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-stone-800 flex items-center gap-1.5 text-xs font-serif">
                <Heart className="w-3.5 h-3.5 text-rose-500" /> Registros de Estado de Ánimo
              </span>
              <span className="text-[10px] text-stone-400 font-mono">
                {realMoodHistory.length > 0 ? `${realMoodHistory.length} registrados` : 'Sin registros'}
              </span>
            </div>

            {realMoodHistory.length === 0 ? (
              <div className="p-4 bg-white/60 rounded-2xl border border-dashed border-stone-200 text-center text-[11px] text-stone-400 font-light italic">
                El paciente aún no ha realizado registros emocionales en su app.
              </div>
            ) : (
              <div className="space-y-2">
                {realMoodHistory.map((entry, idx) => {
                  const style = moodStyles[entry.mood] || moodStyles['Neutral'];
                  const MoodIcon = style.icon;
                  const dateStr = entry.created_at 
                    ? new Date(entry.created_at).toLocaleDateString('es-MX', { weekday: 'short', day: 'numeric', month: 'short' })
                    : 'Reciente';

                  return (
                    <div 
                      key={idx}
                      className="p-3 rounded-2xl border bg-white/80 border-stone-200/60 flex items-start gap-3 transition-all"
                    >
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 border ${style.color}`}>
                        <MoodIcon className="w-4 h-4" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center text-[10px] mb-0.5">
                          <span className="font-semibold text-stone-900">{dateStr} • {entry.mood}</span>
                          {entry.tags && entry.tags.length > 0 && (
                            <span className="bg-stone-100 border border-stone-200/60 text-stone-600 px-2 py-0.2 rounded-full font-medium">
                              {entry.tags[0]}
                            </span>
                          )}
                        </div>
                        {entry.note ? (
                          <p className="text-[11px] text-stone-600 font-serif italic">
                            “{entry.note}”
                          </p>
                        ) : (
                          <p className="text-[10px] text-stone-400 italic">Sin nota adjunta</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Temas del Buzón (Reales) */}
          <div className="glass-panel p-4 rounded-3xl border border-stone-200/80 shadow-ambient space-y-2.5">
            <span className="font-semibold text-stone-800 flex items-center gap-1.5 text-xs font-serif">
              <Inbox className="w-3.5 h-3.5 text-amber-700" /> Temas depositados en buzón por {patientDisplayName}:
            </span>

            {sessionTopics.length === 0 ? (
              <p className="text-stone-400 text-[11px] italic font-light p-2 text-center">No hay temas anotados en su buzón para esta sesión.</p>
            ) : (
              <div className="space-y-1.5 pt-1">
                {sessionTopics.map(topic => (
                  <div 
                    key={topic.id}
                    className={`p-3 rounded-2xl border text-[11px] ${
                      topic.priority 
                        ? 'bg-amber-50/80 border-amber-300 font-medium text-stone-900 shadow-2xs' 
                        : 'bg-white/80 border-stone-200/70 text-stone-700'
                    }`}
                  >
                    <div className="flex justify-between items-center text-[9px] mb-1">
                      <span className="bg-stone-100 border border-stone-200 px-2 py-0.2 rounded-full font-semibold text-stone-600">
                        {topic.tag}
                      </span>
                      {topic.priority && <span className="text-amber-800 font-bold">★ Prioritario</span>}
                    </div>
                    <p className="leading-relaxed font-light">{topic.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Botón de Entrada a la Consulta */}
        <div className="pt-3 border-t border-stone-200/70">
          <button
            onClick={() => {
              onClose();
              onStartSession(appointment);
            }}
            className="w-full py-3.5 bg-[#2a422d] hover:bg-[#1d2f20] text-white rounded-2xl font-medium text-xs shadow-luxe transition-all flex items-center justify-center gap-2 tap-bounce cursor-pointer"
          >
            <span>Iniciar Consulta con esta Información</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}