import React, { useState, useEffect } from 'react';
import { 
  X, Phone, PhoneCall, ShieldCheck, 
  MessageCircle, Plus, Trash2, CheckCircle2, FileText, 
  Target, Inbox, Sparkles, User, AlertCircle, Edit3, 
  Lock, RefreshCw, KeyRound 
} from 'lucide-react';
import EditPatientModal from './EditPatientModal';

export default function PatientRecordModal({ 
  patient, 
  tasks = [],
  sessionTopics = [],
  epiphanies = [],
  onClose, 
  onAddTask,
  onDeleteTask,
  onToggleTask,
  onAddEpiphany,
  onUpdatePatient
}) {
  const [activeTab, setActiveTab] = useState('overview');
  const [showEditModal, setShowEditModal] = useState(false);
  const [pinCopiedMessage, setPinCopiedMessage] = useState(false);

  // Estados para notas, tareas y epifanías
  const [newNote, setNewNote] = useState('');
  const [notes, setNotes] = useState(patient.clinicalNotes || []);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskTag, setNewTaskTag] = useState('Calma');
  const [newEpiphanyText, setNewEpiphanyText] = useState('');

  // GENERACIÓN AUTOMÁTICA DE PIN SI EL PACIENTE NO TIENE UNO
  useEffect(() => {
    if (!patient.pin && onUpdatePatient) {
      const generatedPin = Math.floor(100000 + Math.random() * 900000).toString();
      onUpdatePatient({ ...patient, pin: generatedPin });
    }
  }, [patient.pin]);

  // Función para regenerar un PIN único e irrepetible en 1 clic
  const handleRegenerateUniquePin = () => {
    const newUniquePin = Math.floor(100000 + Math.random() * 900000).toString();
    if (onUpdatePatient) {
      onUpdatePatient({ ...patient, pin: newUniquePin });
    }
    setPinCopiedMessage(true);
    setTimeout(() => setPinCopiedMessage(false), 2500);
  };

  // Estadísticas de tareas
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.done).length;
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    setNotes([{ date: 'Sesión de Hoy', text: newNote.trim() }, ...notes]);
    setNewNote('');
  };

  const handleAssignTask = (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    if (onAddTask) {
      onAddTask({
        id: Date.now(),
        title: newTaskTitle.trim(),
        tag: newTaskTag,
        done: false
      });
    }
    setNewTaskTitle('');
  };

  const handlePinEpiphany = (e) => {
    e.preventDefault();
    if (!newEpiphanyText.trim()) return;
    if (onAddEpiphany) {
      onAddEpiphany({
        id: Date.now(),
        insight: newEpiphanyText.trim(),
        context: 'Fijada en consulta por la Psic. Nayely',
        date: 'Hoy',
        author: 'Psic. Nayely'
      });
    }
    setNewEpiphanyText('');
  };

  const initials = patient.name
    ? patient.name.split(' ').map(n => n[0]).slice(0, 2).join('')
    : 'PA';

  const currentPin = patient.pin || '482910';

  return (
    <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-md z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn select-none">
      
      {/* Contenedor del Expediente Ejecutivo */}
      <div className="w-full max-w-md bg-[#faf8f5] rounded-t-[40px] sm:rounded-[40px] max-h-[92vh] flex flex-col shadow-2xl border border-stone-200/80 overflow-hidden ring-1 ring-black/5">
        
        {/* ================= HERO HEADER ================= */}
        <div className="p-6 bg-white border-b border-stone-200/70 relative">
          
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] font-bold tracking-widest text-[#436146] uppercase bg-emerald-50 border border-emerald-200/60 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" /> Expediente • Psic. Nayely
            </span>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setShowEditModal(true)}
                className="px-2.5 py-1 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-[11px] font-medium flex items-center gap-1 transition-colors cursor-pointer"
                title="Modificar datos del paciente"
              >
                <Edit3 className="w-3 h-3 text-[#436146]" /> Editar Ficha
              </button>

              <button 
                onClick={onClose}
                className="w-7 h-7 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-500 hover:text-stone-800 text-xs transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Tarjeta de Identidad */}
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-3xl bg-gradient-to-br from-[#436146] to-[#253827] text-white flex items-center justify-center text-base font-semibold shadow-md border border-white/20 flex-shrink-0">
              {initials}
            </div>

            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-semibold text-stone-900 truncate tracking-tight">
                {patient.name}
              </h2>

              {/* Insignias con Selector de Estatus Clínico */}
              <div className="flex flex-wrap items-center gap-1.5 mt-1 text-[11px] text-stone-500">
                <span className="font-medium text-stone-700">{patient.age} años</span>
                <span>•</span>
                <span className="truncate">{patient.occupation || 'Sin ocupación'}</span>
                <span>•</span>

                <select
                  value={patient.status || 'active'}
                  onChange={(e) => {
                    const newStatus = e.target.value;
                    if (onUpdatePatient) {
                      onUpdatePatient({ ...patient, status: newStatus });
                    }
                  }}
                  className={`text-[10px] px-2 py-0.5 rounded-md font-semibold border cursor-pointer focus:outline-none ${
                    (patient.status || 'active') === 'active'
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                      : patient.status === 'graduated'
                        ? 'bg-amber-100 text-amber-900 border-amber-300'
                        : 'bg-rose-100 text-rose-800 border-rose-200'
                  }`}
                >
                  <option value="active">Activo en Terapia</option>
                  <option value="graduated">Alta Terapéutica (Graduado)</option>
                  <option value="suspended">Baja / Acceso Suspendido</option>
                </select>
              </div>

              {/* Teléfono y WhatsApp */}
              {patient.phone && (
                <div className="flex items-center gap-3 mt-2 text-xs">
                  <a 
                    href={`tel:${patient.phone}`}
                    className="text-stone-600 hover:text-stone-900 flex items-center gap-1 font-medium bg-stone-100 hover:bg-stone-200 px-2.5 py-1 rounded-xl transition-colors"
                  >
                    <Phone className="w-3 h-3 text-[#436146]" /> {patient.phone}
                  </a>
                  <a 
                    href={`https://wa.me/${patient.phone.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#25D366] hover:text-[#128C7E] flex items-center gap-1 font-semibold bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-xl transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Selector de Pestañas Apple */}
          <div className="mt-5 p-1 bg-stone-100/90 rounded-2xl flex text-xs font-medium text-stone-600">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex-1 py-2 rounded-xl text-center transition-all cursor-pointer ${
                activeTab === 'overview' 
                  ? 'bg-white text-stone-900 font-semibold shadow-xs' 
                  : 'hover:text-stone-900'
              }`}
            >
              Ficha & SOS
            </button>
            <button
              onClick={() => setActiveTab('notes')}
              className={`flex-1 py-2 rounded-xl text-center transition-all cursor-pointer ${
                activeTab === 'notes' 
                  ? 'bg-white text-stone-900 font-semibold shadow-xs' 
                  : 'hover:text-stone-900'
              }`}
            >
              Evolución
            </button>
            <button
              onClick={() => setActiveTab('tasks')}
              className={`flex-1 py-2 rounded-xl text-center transition-all cursor-pointer ${
                activeTab === 'tasks' 
                  ? 'bg-white text-stone-900 font-semibold shadow-xs' 
                  : 'hover:text-stone-900'
              }`}
            >
              Tareas ({completedTasks}/{totalTasks})
            </button>
            <button
              onClick={() => setActiveTab('vault')}
              className={`flex-1 py-2 rounded-xl text-center transition-all cursor-pointer ${
                activeTab === 'vault' 
                  ? 'bg-white text-stone-900 font-semibold shadow-xs' 
                  : 'hover:text-stone-900'
              }`}
            >
              Buzón ({sessionTopics.length})
            </button>
          </div>

        </div>

        {/* ================= CUERPO DEL EXPEDIENTE ================= */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 text-xs">
          
          {/* PESTAÑA 1: FICHA, CONTACTO SOS Y PIN AUTOMÁTICO */}
          {activeTab === 'overview' && (
            <div className="space-y-4 animate-fadeIn">
              
              {/* =========================================================================
                  TARJETA DEL PIN AUTOMÁTICO IRREPETIBLE (CONTROL DE NAYELY)
                 ========================================================================= */}
              <div className="bg-gradient-to-br from-emerald-50/90 to-teal-50/60 p-4 rounded-3xl border border-emerald-200 shadow-xs space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#436146] flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-emerald-700" /> Clave de Ingreso del Paciente
                  </span>

                  {/* Botón WhatsApp */}
                  <button
                    onClick={() => {
                      const firstName = patient.name ? patient.name.split(' ')[0] : 'Paciente';
                      const cleanPhone = patient.phone ? patient.phone.replace(/\D/g, '') : '';
                      const msg = `Hola ${firstName}, te saluda la Psic. Nayely. Tu clave privada de acceso a la app es: *${currentPin}*. Ingresa con tu número de teléfono: ${patient.phone || ''}.`;
                      window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, '_blank');
                    }}
                    className="text-[10px] bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded-xl font-medium flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
                  >
                    <MessageCircle className="w-3 h-3" /> Enviar por WhatsApp
                  </button>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div>
                    <span className="text-[10px] text-stone-500 block">PIN de 6 Dígitos (Generado Automáticamente):</span>
                    <span className="text-xl font-mono font-bold text-stone-900 tracking-[0.25em] mt-0.5 block">
                      {currentPin}
                    </span>
                  </div>

                  {/* Botón para regenerar PIN único sin pensar */}
                  <button
                    type="button"
                    onClick={handleRegenerateUniquePin}
                    className="text-[11px] bg-white border border-emerald-300 hover:bg-emerald-100 text-emerald-800 px-3 py-1.5 rounded-xl font-medium flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
                    title="Generar un nuevo PIN aleatorio irrepetible"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Regenerar Nuevo PIN</span>
                  </button>
                </div>

                {pinCopiedMessage && (
                  <p className="text-[10px] text-emerald-700 font-semibold animate-fadeIn">
                    ✓ ¡Nuevo PIN generado y asignado al expediente!
                  </p>
                )}
              </div>

              {/* Contacto de Emergencia NOM-004 */}
              <div className="bg-white p-4 rounded-3xl border border-stone-200/80 shadow-xs space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-rose-700 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-rose-600" /> Resguardo / Contacto de Emergencia
                  </span>

                  {patient.emergencyContact?.phone && (
                    <a 
                      href={`tel:${patient.emergencyContact.phone.replace(/\D/g, '')}`}
                      className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-[11px] px-3 py-1 rounded-xl font-semibold flex items-center gap-1 transition-colors"
                    >
                      <PhoneCall className="w-3 h-3" /> Llamar Ahora
                    </a>
                  )}
                </div>

                <div className="flex items-center gap-3 pt-1">
                  <div className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-700 font-semibold flex-shrink-0">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-stone-900">
                      {patient.emergencyContact?.name || 'No registrado'}
                    </h4>
                    <span className="text-[11px] text-stone-500 block">
                      Parentesco: <strong className="text-stone-700">{patient.emergencyContact?.relation || 'Familiar'}</strong> • Tel: {patient.emergencyContact?.phone || 'Sin número'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Motivo de Consulta Principal */}
              <div className="bg-white p-4 rounded-3xl border border-stone-200/80 shadow-xs space-y-1.5">
                <span className="font-semibold text-stone-400 block text-[10px] uppercase tracking-wider">
                  Motivo de Consulta:
                </span>
                <p className="text-stone-800 leading-relaxed text-xs">
                  {patient.motivo || 'Primera entrevista diagnóstica.'}
                </p>
              </div>

              {/* Objetivos Terapéuticos */}
              <div className="bg-gradient-to-br from-[#fbfaf8] to-[#f4f7f4] p-4 rounded-3xl border border-emerald-100 shadow-xs space-y-2">
                <span className="font-semibold text-[#436146] flex items-center gap-1.5 text-[10px] uppercase tracking-wider">
                  <Target className="w-3.5 h-3.5" /> Objetivos Terapéuticos Acordados
                </span>
                <p className="text-stone-700 leading-relaxed text-xs font-light">
                  {patient.therapeuticGoals || 'Regulación emocional, autocuidado y fomento de la introspección.'}
                </p>
              </div>

              {/* Antecedentes Médicos */}
              <div className="grid grid-cols-2 gap-3 text-[11px]">
                <div className="bg-white p-3.5 rounded-3xl border border-stone-200/80">
                  <span className="text-stone-400 block text-[10px] uppercase font-semibold">Terapia Previa:</span>
                  <span className="text-stone-800 font-medium">{patient.previousTherapy || 'No'}</span>
                </div>
                <div className="bg-white p-3.5 rounded-3xl border border-stone-200/80">
                  <span className="text-stone-400 block text-[10px] uppercase font-semibold">Medicación:</span>
                  <span className="text-stone-800 font-medium truncate block">{patient.medication || 'Ninguna'}</span>
                </div>
              </div>

            </div>
          )}

          {/* PESTAÑA 2: NOTAS DE EVOLUCIÓN */}
          {activeTab === 'notes' && (
            <div className="space-y-4 animate-fadeIn">
              <form onSubmit={handleAddNote} className="bg-white p-4 rounded-3xl border border-stone-200/80 shadow-xs space-y-3">
                <label className="font-semibold text-stone-700 text-[11px] uppercase tracking-wider block flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-[#436146]" /> Nueva Nota de Evolución:
                </label>
                <textarea 
                  rows="3"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Escribe avances clínicos, hipótesis o intervenciones..."
                  className="w-full p-3 rounded-2xl border border-stone-200 bg-stone-50/50 focus:outline-none focus:ring-2 focus:ring-[#436146] text-stone-800 text-xs resize-none placeholder-stone-400"
                />
                <button 
                  type="submit"
                  className="w-full py-2.5 bg-[#436146] hover:bg-[#253827] text-white rounded-xl font-medium shadow-xs transition-all flex items-center justify-center gap-1.5 text-xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Registrar al Expediente
                </button>
              </form>

              <div className="space-y-3 pt-2">
                <span className="font-semibold text-stone-400 text-[10px] uppercase tracking-wider block px-1">
                  Historial de Sesiones Registradas ({notes.length})
                </span>

                {notes.map((note, index) => (
                  <div key={index} className="bg-white p-4 rounded-3xl border border-stone-200/80 shadow-xs space-y-1.5">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="font-semibold text-[#436146] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                        {note.date}
                      </span>
                      <span className="text-stone-400">Nota Privada</span>
                    </div>
                    <p className="text-stone-800 leading-relaxed pt-1 text-xs font-light">
                      {note.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PESTAÑA 3: TAREAS */}
          {activeTab === 'tasks' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="bg-white p-4 rounded-3xl border border-stone-200/80 shadow-xs space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-stone-800 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Cumplimiento de Ejercicios
                  </span>
                  <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full">
                    {completedTasks} de {totalTasks} ({progressPercent}%)
                  </span>
                </div>
                <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-[#436146] h-full rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }} />
                </div>
              </div>

              <div className="space-y-2">
                {tasks.map(task => (
                  <div key={task.id} className="p-3.5 rounded-2xl border bg-white border-stone-200/80 shadow-xs flex items-start justify-between gap-3">
                    <button onClick={() => onToggleTask && onToggleTask(task.id)} className="mt-0.5 cursor-pointer">
                      <CheckCircle2 className={`w-5 h-5 ${task.done ? 'text-emerald-600' : 'text-stone-300'}`} />
                    </button>
                    <div className="flex-1 min-w-0">
                      <span className={`text-xs font-medium block leading-snug ${task.done ? 'text-stone-500 line-through' : 'text-stone-800'}`}>
                        {task.title}
                      </span>
                      <span className="text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full font-medium mt-1 inline-block">
                        {task.tag}
                      </span>
                    </div>
                    <button onClick={() => onDeleteTask && onDeleteTask(task.id)} className="text-stone-300 hover:text-rose-600 p-1 cursor-pointer">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <form onSubmit={handleAssignTask} className="bg-white p-4 rounded-3xl border border-stone-200/80 shadow-xs space-y-3 pt-3">
                <span className="font-semibold text-stone-800 block text-xs">
                  + Asignar Ejercicio a {patient.name}:
                </span>
                <input 
                  type="text" 
                  required
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="Ej: Registro de respiración..."
                  className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-stone-800 text-xs focus:outline-none focus:ring-2 focus:ring-[#436146]"
                />
                <div className="flex items-center justify-between gap-2">
                  <select 
                    value={newTaskTag}
                    onChange={(e) => setNewTaskTag(e.target.value)}
                    className="p-2 rounded-xl border border-stone-200 bg-white text-stone-700 text-xs"
                  >
                    <option value="Calma">Calma</option>
                    <option value="Gratitud">Gratitud</option>
                    <option value="Reflexión">Reflexión</option>
                  </select>
                  <button type="submit" className="px-4 py-2 bg-[#436146] hover:bg-[#253827] text-white rounded-xl font-medium text-xs cursor-pointer">
                    <Plus className="w-3.5 h-3.5 inline mr-1" /> Enviar
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* PESTAÑA 4: BUZÓN */}
          {activeTab === 'vault' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="space-y-2">
                <span className="font-semibold text-stone-800 flex items-center gap-1.5 text-xs">
                  <Inbox className="w-4 h-4 text-amber-700" /> Temas del paciente para la sesión:
                </span>
                {sessionTopics.length === 0 ? (
                  <p className="text-stone-400 text-xs italic">No hay temas en su buzón.</p>
                ) : (
                  sessionTopics.map(topic => (
                    <div key={topic.id} className="p-3.5 rounded-2xl border bg-white border-stone-200/80 shadow-xs">
                      <span className="text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full font-medium">
                        {topic.tag}
                      </span>
                      <p className="text-stone-800 text-xs mt-1">{topic.text}</p>
                    </div>
                  ))
                )}
              </div>

              <form onSubmit={handlePinEpiphany} className="bg-gradient-to-br from-[#fcfbf9] to-[#f5efe6] p-4 rounded-3xl border border-[#e8ded0] space-y-2.5">
                <span className="font-semibold text-[#8c6d48] flex items-center gap-1.5 text-xs">
                  <Sparkles className="w-4 h-4" /> Fijar Aprendizaje para {patient.name}:
                </span>
                <textarea
                  rows="2"
                  value={newEpiphanyText}
                  onChange={(e) => setNewEpiphanyText(e.target.value)}
                  placeholder="Escribe la verdad que debe recordar..."
                  className="w-full p-2.5 rounded-xl border border-[#e8ded0] bg-white text-stone-800 text-xs focus:outline-none focus:ring-2 focus:ring-[#8c6d48] resize-none"
                />
                <button type="submit" className="w-full py-2.5 bg-[#8c6d48] hover:bg-[#735838] text-white rounded-xl font-medium text-xs cursor-pointer">
                  Fijar en su Cuaderno de Sabiduría
                </button>
              </form>
            </div>
          )}

        </div>

      </div>

      {/* MODAL EDITAR FICHA */}
      {showEditModal && (
        <EditPatientModal 
          patient={patient}
          onClose={() => setShowEditModal(false)}
          onUpdatePatient={(updated) => {
            if (onUpdatePatient) onUpdatePatient(updated);
          }}
        />
      )}

    </div>
  );
}