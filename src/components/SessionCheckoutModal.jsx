import React, { useState } from 'react';
import { 
  X, CheckCircle2, Sparkles, FileText, ListChecks, 
  Plus, Trash2, Lock 
} from 'lucide-react';

export default function SessionCheckoutModal({ appointment, onClose, onCompleteSession }) {
  const [clinicalNote, setClinicalNote] = useState('');

  // Aprendizajes clave dinámicos
  const [epiphaniesList, setEpiphaniesList] = useState([
    { id: 1, text: '' }
  ]);

  // Ejercicios dinámicos
  const [tasksList, setTasksList] = useState([
    { id: 1, title: '', tag: 'Calma' }
  ]);

  const handleAddEpiphanyField = () => {
    setEpiphaniesList([...epiphaniesList, { id: Date.now(), text: '' }]);
  };

  const handleUpdateEpiphany = (id, text) => {
    setEpiphaniesList(epiphaniesList.map(e => e.id === id ? { ...e, text } : e));
  };

  const handleRemoveEpiphanyField = (id) => {
    if (epiphaniesList.length > 1) {
      setEpiphaniesList(epiphaniesList.filter(e => e.id !== id));
    } else {
      setEpiphaniesList([{ id: Date.now(), text: '' }]);
    }
  };

  const handleAddTaskField = () => {
    setTasksList([...tasksList, { id: Date.now(), title: '', tag: 'Calma' }]);
  };

  const handleUpdateTask = (id, field, value) => {
    setTasksList(tasksList.map(t => t.id === id ? { ...t, [field]: value } : t));
  };

  const handleRemoveTaskField = (id) => {
    if (tasksList.length > 1) {
      setTasksList(tasksList.filter(t => t.id !== id));
    } else {
      setTasksList([{ id: Date.now(), title: '', tag: 'Calma' }]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validEpiphanies = epiphaniesList
      .filter(item => item.text.trim() !== '')
      .map(item => ({
        id: Date.now() + Math.random(),
        insight: item.text.trim(),
        context: `Sesión del ${appointment.date}`,
        date: 'Hoy',
        author: 'Psic. Nayely'
      }));

    const validTasks = tasksList
      .filter(item => item.title.trim() !== '')
      .map(item => ({
        id: Date.now() + Math.random(),
        title: item.title.trim(),
        tag: item.tag,
        done: false
      }));

    onCompleteSession({
      appointmentId: appointment.id,
      patientId: appointment.patientId,
      patientName: appointment.patientName,
      date: appointment.date,
      clinicalNote: clinicalNote.trim() || 'Sesión terapéutica llevada a cabo con normalidad y evolución favorable.',
      epiphanies: validEpiphanies,
      tasks: validTasks
    });

    onClose();
  };

  const patientName = appointment.patientName || 'Paciente';

  return (
    <div className="fixed inset-0 bg-stone-900/65 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn select-none">
      <div className="w-full max-w-md bg-[#faf8f5] rounded-[36px] p-6 shadow-2xl border border-stone-200/80 flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* Cabecera */}
        <div className="flex justify-between items-center pb-3.5 border-b border-stone-200/70">
          <div>
            <span className="text-[10px] font-bold tracking-[0.18em] uppercase text-[#335236] glass-pill px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 shadow-inner-light">
              <CheckCircle2 className="w-3 h-3 text-emerald-700" /> Cierre de Consulta
            </span>
            <h3 className="text-base font-serif text-stone-900 mt-1">
              Sesión con {patientName}
            </h3>
            <p className="text-[11px] text-stone-400 font-light">{appointment.date} • Psic. Nayely</p>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white border border-stone-200 hover:bg-stone-100 flex items-center justify-center text-stone-500 text-xs transition-colors tap-bounce cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Formulario Editorial */}
        <form onSubmit={handleSubmit} className="p-1 overflow-y-auto space-y-4 flex-1 text-xs pt-3 no-scrollbar">
          
          {/* 1. NOTA CLÍNICA DE EVOLUCIÓN (CONFIDENCIAL) */}
          <div className="glass-panel p-4 rounded-3xl border border-stone-200/80 shadow-ambient space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-stone-800 text-[11px] uppercase tracking-wider flex items-center gap-1.5 font-sans">
                <FileText className="w-3.5 h-3.5 text-[#335236]" /> 1. Nota Clínica de Evolución
              </label>
              <span className="text-[10px] text-rose-700 font-medium flex items-center gap-1 bg-rose-50 px-2 py-0.2 rounded-full border border-rose-200">
                <Lock className="w-2.5 h-2.5 text-rose-600" /> Privada
              </span>
            </div>
            <textarea
              rows="3"
              required
              value={clinicalNote}
              onChange={(e) => setClinicalNote(e.target.value)}
              placeholder="Describe intervenciones realizadas, hipótesis diagnósticas y avances observados..."
              className="w-full p-3 rounded-2xl border border-stone-200/80 bg-white text-stone-800 text-xs focus:outline-none focus:ring-2 focus:ring-[#335236]/30 font-light resize-none placeholder-stone-400 leading-relaxed shadow-inner-light"
            />
          </div>

          {/* 2. APRENDIZAJES CLAVE (AL CELULAR DEL PACIENTE) */}
          <div className="rounded-3xl p-4 bg-gradient-to-br from-[#fdfbf7] to-[#f7f2e8] border border-amber-200/80 shadow-ambient space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-[#7a5522] text-[11px] uppercase tracking-wider flex items-center gap-1.5 font-sans">
                <Sparkles className="w-3.5 h-3.5" /> 2. Aprendizajes Clave de Hoy
              </span>
              <span className="text-[10px] text-[#7a5522] font-medium bg-amber-100/70 px-2 py-0.2 rounded-full">
                Al cuaderno del paciente
              </span>
            </div>

            <div className="space-y-2">
              {epiphaniesList.map((item, index) => (
                <div key={item.id} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={item.text}
                    onChange={(e) => handleUpdateEpiphany(item.id, e.target.value)}
                    placeholder={`Aprendizaje #${index + 1} (ej: Descansar no es un premio, es una necesidad...)`}
                    className="flex-1 p-2.5 rounded-xl border border-amber-200/80 bg-white text-stone-800 text-xs focus:outline-none focus:ring-2 focus:ring-[#7a5522]/30 font-serif italic"
                  />
                  {epiphaniesList.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveEpiphanyField(item.id)}
                      className="p-2 text-stone-400 hover:text-rose-500 transition-colors tap-bounce cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={handleAddEpiphanyField}
              className="px-3 py-1.5 rounded-xl bg-white border border-amber-200 text-[#7a5522] font-medium text-[11px] hover:bg-amber-50/60 transition-colors flex items-center gap-1 tap-bounce cursor-pointer"
            >
              <Plus className="w-3 h-3" /> Agregar otro aprendizaje
            </button>
          </div>

          {/* 3. EJERCICIOS DE LA SEMANA */}
          <div className="glass-panel p-4 rounded-3xl border border-stone-200/80 shadow-ambient space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-stone-700 text-[11px] uppercase tracking-wider flex items-center gap-1.5 font-sans">
                <ListChecks className="w-3.5 h-3.5 text-[#335236]" /> 3. Ejercicios para la Semana
              </span>
              <span className="text-[10px] text-stone-400">
                Casillas interactivas
              </span>
            </div>

            <div className="space-y-2.5">
              {tasksList.map((task, index) => (
                <div key={task.id} className="p-3 bg-stone-50/70 rounded-2xl border border-stone-200/70 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Ejercicio #{index + 1}</span>
                    {tasksList.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveTaskField(task.id)}
                        className="text-stone-400 hover:text-rose-500 transition-colors tap-bounce cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <input
                    type="text"
                    value={task.title}
                    onChange={(e) => handleUpdateTask(task.id, 'title', e.target.value)}
                    placeholder="Ej: Registrar 3 límites claros en el trabajo..."
                    className="w-full p-2.5 rounded-xl border border-stone-200 bg-white text-stone-800 text-xs focus:outline-none focus:ring-2 focus:ring-[#335236]/30"
                  />

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-stone-500">Categoría:</span>
                    <select
                      value={task.tag}
                      onChange={(e) => handleUpdateTask(task.id, 'tag', e.target.value)}
                      className="p-1.5 rounded-lg border border-stone-200 bg-white text-[11px] text-stone-700 focus:outline-none cursor-pointer"
                    >
                      <option value="Calma">Calma</option>
                      <option value="Gratitud">Gratitud</option>
                      <option value="Reflexión">Reflexión</option>
                      <option value="Límites">Límites</option>
                      <option value="Conductual">Conductual</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={handleAddTaskField}
              className="px-3 py-1.5 rounded-xl bg-stone-100 text-stone-700 font-medium text-[11px] hover:bg-stone-200 transition-colors flex items-center gap-1 tap-bounce cursor-pointer"
            >
              <Plus className="w-3 h-3" /> Agregar otro ejercicio
            </button>
          </div>

          {/* Botón Final */}
          <button
            type="submit"
            className="w-full py-3.5 bg-[#2a422d] hover:bg-[#1d2f20] text-white rounded-2xl font-medium text-xs shadow-luxe transition-all flex items-center justify-center gap-2 tap-bounce cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-300" />
            <span>Concluir Consulta y Sincronizar</span>
          </button>
        </form>

      </div>
    </div>
  );
}