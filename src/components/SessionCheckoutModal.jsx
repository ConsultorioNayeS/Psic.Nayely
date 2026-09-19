import React, { useState } from 'react';
import { 
  X, CheckCircle2, Sparkles, FileText, ListChecks, 
  Plus, Trash2, Lock 
} from 'lucide-react';

export default function SessionCheckoutModal({ appointment, onClose, onCompleteSession }) {
  // 1. Nota clínica
  const [clinicalNote, setClinicalNote] = useState('');

  // 2. Lista dinámica de Aprendizajes / Epifanías
  const [epiphaniesList, setEpiphaniesList] = useState([
    { id: 1, text: '' }
  ]);

  // 3. Lista dinámica de Tareas / Ejercicios
  const [tasksList, setTasksList] = useState([
    { id: 1, title: '', tag: 'Calma' }
  ]);

  // Funciones para Aprendizajes
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

  // Funciones para Tareas
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

    // Filtrar solo los aprendizajes que tengan texto escrito
    const validEpiphanies = epiphaniesList
      .filter(item => item.text.trim() !== '')
      .map(item => ({
        id: Date.now() + Math.random(),
        insight: item.text.trim(),
        context: `Sesión del ${appointment.date}`,
        date: 'Hoy',
        author: 'Psic. Nayely'
      }));

    // Filtrar solo las tareas que tengan título
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
      clinicalNote: clinicalNote.trim() || 'Sesión terapéutica llevada a cabo con normalidad.',
      epiphanies: validEpiphanies,
      tasks: validTasks
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-md z-50 flex items-center justify-center p-3 animate-fadeIn">
      <div className="w-full max-w-md bg-[#faf8f5] rounded-[36px] p-6 shadow-2xl border border-stone-200 flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* Cabecera */}
        <div className="flex justify-between items-center pb-3 border-b border-stone-200/70">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#436146] flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Cierre de Consulta
            </span>
            <h3 className="text-sm font-semibold text-stone-900 mt-0.5">
              Sesión con {appointment.patientName}
            </h3>
            <p className="text-[11px] text-stone-400">{appointment.date} • Psic. Nayely</p>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-500 text-xs transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Formulario Dinámico */}
        <form onSubmit={handleSubmit} className="p-1 overflow-y-auto space-y-4 flex-1 text-xs pt-3">
          
          {/* 1. NOTA CLÍNICA DE EVOLUCIÓN */}
          <div className="bg-white p-4 rounded-3xl border border-stone-200/80 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-stone-800 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[#436146]" /> 1. Nota Clínica de Evolución
              </label>
              <span className="text-[10px] text-stone-400 font-normal flex items-center gap-1">
                <Lock className="w-3 h-3 text-rose-500" /> Privada
              </span>
            </div>
            <textarea
              rows="3"
              required
              value={clinicalNote}
              onChange={(e) => setClinicalNote(e.target.value)}
              placeholder="Escribe los avances del paciente, hipótesis, intervenciones aplicadas o respuestas observadas..."
              className="w-full p-3 rounded-2xl border border-stone-200 bg-stone-50/50 focus:outline-none focus:ring-2 focus:ring-[#436146] text-stone-800 text-xs resize-none placeholder-stone-400"
            />
          </div>

          {/* 2. MÚLTIPLES APRENDIZAJES / EPIFANÍAS */}
          <div className="bg-gradient-to-br from-[#fcfbf9] to-[#f5efe6] p-4 rounded-3xl border border-[#e8ded0] space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-[#8c6d48] text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> 2. Aprendizajes Clave de Hoy
              </span>
              <span className="text-[10px] text-[#8c6d48] font-medium">
                Al celular del paciente
              </span>
            </div>

            <div className="space-y-2">
              {epiphaniesList.map((item, index) => (
                <div key={item.id} className="flex items-center gap-2">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={item.text}
                      onChange={(e) => handleUpdateEpiphany(item.id, e.target.value)}
                      placeholder={`Aprendizaje #${index + 1} (ej: Descansar no es un premio...)`}
                      className="w-full p-2.5 rounded-xl border border-[#e8ded0] bg-white text-stone-800 text-xs focus:outline-none focus:ring-2 focus:ring-[#8c6d48]"
                    />
                  </div>
                  {epiphaniesList.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveEpiphanyField(item.id)}
                      className="p-2 text-stone-400 hover:text-rose-500 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Botón agregar otro aprendizaje */}
            <button
              type="button"
              onClick={handleAddEpiphanyField}
              className="px-3 py-1.5 rounded-xl bg-white border border-[#e8ded0] text-[#8c6d48] font-medium text-[11px] hover:bg-[#faf5ee] transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3 h-3" /> Agregar otro aprendizaje
            </button>
          </div>

          {/* 3. MÚLTIPLES TAREAS / EJERCICIOS */}
          <div className="bg-white p-4 rounded-3xl border border-stone-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-stone-700 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                <ListChecks className="w-3.5 h-3.5 text-[#436146]" /> 3. Ejercicios para la Semana
              </span>
              <span className="text-[10px] text-stone-400">
                Casillas interactivas
              </span>
            </div>

            <div className="space-y-2.5">
              {tasksList.map((task, index) => (
                <div key={task.id} className="p-3 bg-stone-50/70 rounded-2xl border border-stone-200/60 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold text-stone-400 uppercase">Ejercicio #{index + 1}</span>
                    {tasksList.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveTaskField(task.id)}
                        className="text-stone-400 hover:text-rose-500 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <input
                    type="text"
                    value={task.title}
                    onChange={(e) => handleUpdateTask(task.id, 'title', e.target.value)}
                    placeholder="Ej: Escribir 3 límites claros en el trabajo..."
                    className="w-full p-2.5 rounded-xl border border-stone-200 bg-white text-stone-800 text-xs focus:outline-none focus:ring-2 focus:ring-[#436146]"
                  />

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-stone-500">Categoría:</span>
                    <select
                      value={task.tag}
                      onChange={(e) => handleUpdateTask(task.id, 'tag', e.target.value)}
                      className="p-1.5 rounded-lg border border-stone-200 bg-white text-[11px] text-stone-700 focus:outline-none"
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

            {/* Botón agregar otra tarea */}
            <button
              type="button"
              onClick={handleAddTaskField}
              className="px-3 py-1.5 rounded-xl bg-stone-100 text-stone-700 font-medium text-[11px] hover:bg-stone-200 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3 h-3" /> Agregar otro ejercicio
            </button>
          </div>

          {/* Botón Final de Guardado */}
          <button
            type="submit"
            className="w-full py-3.5 bg-[#436146] hover:bg-[#253827] text-white rounded-2xl font-medium text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer pt-3"
          >
            <CheckCircle2 className="w-4 h-4" /> Guardar Todo y Concluir Consulta
          </button>
        </form>

      </div>
    </div>
  );
}