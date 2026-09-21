import React, { useState, useEffect } from 'react';
import { 
  X, Phone, PhoneCall, ShieldCheck, 
  MessageCircle, Plus, Trash2, CheckCircle2, FileText, 
  Target, Inbox, Sparkles, User, Edit3, 
  RefreshCw, KeyRound, Copy, CheckCheck,
  Calendar, Heart, Activity, ArrowRight, Clock, AlertTriangle, BookOpen
} from 'lucide-react';
import EditPatientModal from './EditPatientModal';
import ClinicalReportModal from './ClinicalReportModal';

export default function PatientRecordModal({ 
  patient, 
  tasks = [],
  sessionTopics = [],
  epiphanies = [],
  clinicalNotes = [],
  completedSessionsCount = 0,
  onAddClinicalNote,
  onClose, 
  onAddTask,
  onDeleteTask,
  onToggleTask,
  onAddEpiphany,
  onUpdatePatient,
  onDeletePatient
}) {
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'notes' | 'tasks' | 'vault' | 'dossier'
  const [showEditModal, setShowEditModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [pinCopiedMessage, setPinCopiedMessage] = useState(false);
  const [copiedWhatsApp, setCopiedWhatsApp] = useState(false);
  const [confirmDeletePatient, setConfirmDeletePatient] = useState(false);

  const [localStatus, setLocalStatus] = useState(patient.status || 'active');

  useEffect(() => {
    setLocalStatus(patient.status || 'active');
  }, [patient.status]);

  const [newNote, setNewNote] = useState('');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskTag, setNewTaskTag] = useState('Calma');
  const [newEpiphanyText, setNewEpiphanyText] = useState('');

  const emergencyData = patient.emergencyContact || patient.emergency_contact || {};
  const emergencyName = emergencyData.name || 'No registrado';
  const emergencyRelation = emergencyData.relation || 'Familiar';
  const emergencyPhone = emergencyData.phone || '';

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.done).length;
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 100;

  const recentMood = patient.moodCheckIns && patient.moodCheckIns.length > 0 ? patient.moodCheckIns[0] : null;
  const latestNote = clinicalNotes.length > 0 ? clinicalNotes[0] : null;

  useEffect(() => {
    if (!patient.pin && onUpdatePatient) {
      const generatedPin = Math.floor(100000 + Math.random() * 900000).toString();
      onUpdatePatient({ ...patient, pin: generatedPin });
    }
  }, [patient.pin]);

  const handleRegenerateUniquePin = () => {
    const newUniquePin = Math.floor(100000 + Math.random() * 900000).toString();
    if (onUpdatePatient) {
      onUpdatePatient({ ...patient, pin: newUniquePin });
    }
    setPinCopiedMessage(true);
    setTimeout(() => setPinCopiedMessage(false), 2500);
  };

  const handleStatusChange = (newStatus) => {
    setLocalStatus(newStatus);
    if (onUpdatePatient) {
      onUpdatePatient({ ...patient, status: newStatus });
    }
  };

  const handleAddNoteSubmit = (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    if (onAddClinicalNote) {
      onAddClinicalNote({
        patientId: patient.id,
        text: newNote.trim(),
        date: new Date().toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' })
      });
    }
    setNewNote('');
  };

  const handleAssignTask = (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    if (onAddTask) {
      onAddTask({
        id: Date.now(),
        patientId: patient.id,
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
        context: 'Fijada en consulta por la Psicóloga Nayely',
        date: 'Hoy',
        author: 'Psicóloga Nayely'
      });
    }
    setNewEpiphanyText('');
  };

  const initials = patient.name
    ? patient.name.split(' ').map(n => n[0]).slice(0, 2).join('')
    : 'PA';

  const currentPin = patient.pin || '482910';
  const firstName = patient.firstName || patient.first_name || patient.name?.split(' ')[0] || 'Paciente';
  const cleanPhone = patient.phone ? patient.phone.replace(/\D/g, '') : '';

  const pinWhatsAppText = `🌿 *Hola ${firstName}*, te saluda la *Psicóloga Nayely* 🤍\n\nEste es tu acceso personal y confidencial a tu app terapéutica:\n📱 *Tu Teléfono:* ${patient.phone || ''}\n🔑 *Tu PIN seguro:* *${currentPin}*\n\nPuedes ingresar cuando lo necesites para realizar tus ejercicios, respiración y tu cuaderno de sabiduría ✨🕊️`;

  const handleSendPinWhatsApp = () => {
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    const encoded = encodeURIComponent(pinWhatsAppText);
    const url = isMobile 
      ? `whatsapp://send?phone=${cleanPhone}&text=${encoded}`
      : `https://web.whatsapp.com/send?phone=${cleanPhone}&text=${encoded}`;
    window.open(url, '_blank');
  };

  const handleCopyPinText = () => {
    navigator.clipboard.writeText(pinWhatsAppText);
    setCopiedWhatsApp(true);
    setTimeout(() => setCopiedWhatsApp(false), 2000);
  };

  return (
    // CENTRADO ABSOLUTO EN TODAS LAS PANTALLAS (items-center en lugar de items-end)
    <div className="fixed inset-0 bg-stone-900/65 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 animate-fadeIn select-none">
      <div className="w-full max-w-md bg-[#faf8f5] rounded-[32px] sm:rounded-[36px] max-h-[90vh] flex flex-col shadow-2xl border border-stone-200/80 overflow-hidden">
        
        {/* ================= CABECERA DEL EXPEDIENTE ================= */}
        <div className="p-4 sm:p-5 bg-white border-b border-stone-200/70 relative">
          
          <div className="flex justify-between items-center mb-2.5">
            <span className="text-[10px] font-bold tracking-[0.18em] text-[#335236] uppercase glass-pill px-2.5 py-0.5 rounded-full flex items-center gap-1.5 shadow-inner-light">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" /> Expediente Clínico Oficial
            </span>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setShowReportModal(true)}
                className="px-2.5 py-1 bg-[#2a422d] hover:bg-[#1d2f20] text-white rounded-xl text-[11px] font-semibold flex items-center gap-1 shadow-sm tap-bounce cursor-pointer transition-all"
              >
                <FileText className="w-3 h-3 text-emerald-300" /> Generar Informe
              </button>

              <button
                onClick={() => setShowEditModal(true)}
                className="p-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs tap-bounce cursor-pointer"
                title="Editar datos del paciente"
              >
                <Edit3 className="w-3.5 h-3.5 text-[#335236]" />
              </button>

              <button 
                onClick={onClose} 
                className="w-7 h-7 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-500 tap-bounce cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#2a422d] text-white flex items-center justify-center text-sm font-serif shadow-luxe flex-shrink-0">
              {initials}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1">
                <h2 className="text-base font-serif text-stone-900 truncate">
                  {patient.name}
                </h2>
                <select
                  value={localStatus}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className={`text-[9px] px-2 py-0.5 rounded-md font-semibold border cursor-pointer focus:outline-none transition-colors ${
                    localStatus === 'active'
                      ? 'bg-emerald-100/80 text-[#2a422d] border-emerald-300'
                      : localStatus === 'graduated'
                        ? 'bg-amber-100 text-[#7a5522] border-amber-300'
                        : 'bg-rose-100 text-rose-800 border-rose-200'
                  }`}
                >
                  <option value="active">Activo</option>
                  <option value="graduated">Alta</option>
                  <option value="suspended">Baja</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5 text-[11px] text-stone-500 mt-0.5">
                <span>{patient.age} años</span>
                <span>•</span>
                <span className="truncate">{patient.occupation || 'Sin ocupación'}</span>
              </div>

              {patient.phone && (
                <div className="flex items-center gap-2 mt-1.5 text-xs">
                  <a 
                    href={`tel:${patient.phone}`}
                    className="text-stone-600 hover:text-stone-900 flex items-center gap-1 font-medium bg-stone-100 hover:bg-stone-200 px-2 py-0.5 rounded-lg text-[11px] transition-colors"
                  >
                    <Phone className="w-3 h-3 text-[#335236]" /> {patient.phone}
                  </a>
                  <button 
                    onClick={handleSendPinWhatsApp}
                    className="text-[#128C7E] hover:text-[#0b6b5d] flex items-center gap-1 font-semibold bg-[#25D366]/10 hover:bg-[#25D366]/20 px-2 py-0.5 rounded-lg transition-colors tap-bounce cursor-pointer border border-[#25D366]/20 text-[10px]"
                  >
                    <MessageCircle className="w-3 h-3 text-[#25D366]" /> PIN WhatsApp
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Pestañas Optimizadas: Nunca se cortan */}
          <div className="mt-3.5 p-1 bg-stone-100 rounded-xl flex text-[11px] font-medium text-stone-600">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex-1 py-1 px-1.5 rounded-lg text-center transition-all tap-bounce cursor-pointer ${
                activeTab === 'dashboard' ? 'bg-white text-stone-900 font-bold shadow-xs' : 'hover:text-stone-900'
              }`}
            >
              Panorama
            </button>
            <button
              onClick={() => setActiveTab('notes')}
              className={`flex-1 py-1 px-1.5 rounded-lg text-center transition-all tap-bounce cursor-pointer ${
                activeTab === 'notes' ? 'bg-white text-stone-900 font-bold shadow-xs' : 'hover:text-stone-900'
              }`}
            >
              Evolución ({clinicalNotes.length})
            </button>
            <button
              onClick={() => setActiveTab('tasks')}
              className={`flex-1 py-1 px-1.5 rounded-lg text-center transition-all tap-bounce cursor-pointer ${
                activeTab === 'tasks' ? 'bg-white text-stone-900 font-bold shadow-xs' : 'hover:text-stone-900'
              }`}
            >
              Tareas ({completedTasks})
            </button>
            <button
              onClick={() => setActiveTab('vault')}
              className={`flex-1 py-1 px-1.5 rounded-lg text-center transition-all tap-bounce cursor-pointer ${
                activeTab === 'vault' ? 'bg-white text-stone-900 font-bold shadow-xs' : 'hover:text-stone-900'
              }`}
            >
              Buzón ({sessionTopics.length})
            </button>
            <button
              onClick={() => setActiveTab('dossier')}
              className={`flex-1 py-1 px-1.5 rounded-lg text-center transition-all tap-bounce cursor-pointer ${
                activeTab === 'dossier' ? 'bg-white text-stone-900 font-bold shadow-xs' : 'hover:text-stone-900'
              }`}
            >
              Ficha
            </button>
          </div>

        </div>

        {/* ================= CONTENIDO DEL EXPEDIENTE ================= */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-3.5 flex-1 text-xs no-scrollbar">
          
          {/* =========================================================
              1. PANORAMA 360°: LA RADIOGRAFÍA RÁPIDA DE NAYELY
             ========================================================= */}
          {activeTab === 'dashboard' && (
            <div className="space-y-3 animate-fadeIn">
              
              {/* Tarjetas de Métricas Rápidas */}
              <div className="grid grid-cols-3 gap-2">
                <div className="glass-panel p-2.5 rounded-2xl border border-stone-200/80 shadow-ambient text-center">
                  <Calendar className="w-4 h-4 text-[#335236] mx-auto mb-0.5" />
                  <span className="text-sm font-serif font-bold text-stone-900 block">{completedSessionsCount}</span>
                  <span className="text-[9px] text-stone-500 font-light">Sesiones Hechas</span>
                </div>

                <div className="glass-panel p-2.5 rounded-2xl border border-stone-200/80 shadow-ambient text-center">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto mb-0.5" />
                  <span className="text-sm font-serif font-bold text-stone-900 block">{progressPercent}%</span>
                  <span className="text-[9px] text-stone-500 font-light">Apego a Tareas</span>
                </div>

                <div className="glass-panel p-2.5 rounded-2xl border border-stone-200/80 shadow-ambient text-center">
                  <Heart className="w-4 h-4 text-rose-500 mx-auto mb-0.5" />
                  <span className="text-sm font-serif font-bold text-stone-900 block">
                    {recentMood ? recentMood.mood : 'Neutro'}
                  </span>
                  <span className="text-[9px] text-stone-500 font-light">Último Pulso</span>
                </div>
              </div>

              {/* Temas que el Paciente Preparó para Consulta */}
              <div className="glass-panel p-3.5 rounded-2xl border border-amber-200/80 shadow-ambient space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-stone-800 flex items-center gap-1.5 text-xs font-serif">
                    <Inbox className="w-3.5 h-3.5 text-amber-700" /> Temas Depositados en Buzón ({sessionTopics.length})
                  </span>
                  <span className="text-[9px] text-[#7a5522] font-medium">Próxima sesión</span>
                </div>

                {sessionTopics.length === 0 ? (
                  <p className="text-stone-400 text-[11px] italic font-light">Sin temas pendientes en buzón.</p>
                ) : (
                  <div className="space-y-1 pt-0.5">
                    {sessionTopics.slice(0, 3).map(topic => (
                      <div key={topic.id} className="p-2 rounded-xl bg-white border border-stone-200/70 text-[11px] flex justify-between items-start gap-2">
                        <span className="text-stone-800 font-light leading-relaxed">{topic.text}</span>
                        <span className="bg-stone-100 text-stone-600 px-1.5 py-0.2 rounded text-[9px] font-semibold flex-shrink-0">
                          {topic.tag}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Última Nota Clínica de Nayely */}
              <div className="glass-panel p-3.5 rounded-2xl border border-stone-200/80 shadow-ambient space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-stone-800 flex items-center gap-1.5 text-xs font-serif">
                    <FileText className="w-3.5 h-3.5 text-[#335236]" /> Última Nota Registrada
                  </span>
                  <button 
                    onClick={() => setActiveTab('notes')}
                    className="text-[10px] text-[#335236] font-semibold hover:underline flex items-center gap-0.5"
                  >
                    Ver todas ({clinicalNotes.length}) <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                {latestNote ? (
                  <div className="p-2.5 bg-white rounded-xl border border-stone-200/70 space-y-1">
                    <div className="flex justify-between items-center text-[9px] text-stone-400">
                      <span className="bg-emerald-50 text-[#2a422d] font-bold px-1.5 py-0.2 rounded">{latestNote.date}</span>
                      <span>Nota Oficial</span>
                    </div>
                    <p className="text-xs text-stone-700 leading-relaxed font-serif italic pt-0.5">
                      “{latestNote.text}”
                    </p>
                  </div>
                ) : (
                  <p className="text-stone-400 text-[11px] italic font-light">Sin notas de evolución previas.</p>
                )}
              </div>

              {/* Acceso Rápido a Contacto de Resguardo */}
              {emergencyPhone && (
                <div className="bg-rose-50/80 border border-rose-200/80 p-3 rounded-2xl flex items-center justify-between gap-2 shadow-2xs">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center flex-shrink-0">
                      <PhoneCall className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="text-[9px] text-rose-800 font-bold uppercase block">Contacto de Resguardo</span>
                      <span className="text-[11px] text-stone-800 font-medium">{emergencyName} ({emergencyRelation})</span>
                    </div>
                  </div>
                  <a
                    href={`tel:${emergencyPhone.replace(/\D/g, '')}`}
                    className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-[11px] font-semibold tap-bounce cursor-pointer shadow-xs"
                  >
                    Llamar SOS
                  </a>
                </div>
              )}

            </div>
          )}

          {/* =========================================================
              2. NOTAS DE EVOLUCIÓN HISTÓRICAS
             ========================================================= */}
          {activeTab === 'notes' && (
            <div className="space-y-3 animate-fadeIn">
              <form onSubmit={handleAddNoteSubmit} className="glass-panel p-3.5 rounded-2xl border border-stone-200/80 shadow-ambient space-y-2">
                <label className="font-semibold text-stone-800 text-[11px] uppercase tracking-wider block flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-[#335236]" /> Anexar Nota Manual de Sesión:
                </label>
                <textarea 
                  rows="3"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Describe avances, hipótesis o intervenciones de la sesión..."
                  className="w-full p-2.5 rounded-xl border border-stone-200 bg-white text-stone-800 text-xs focus:outline-none focus:ring-2 focus:ring-[#335236]/30 font-light resize-none leading-relaxed"
                />
                <button 
                  type="submit"
                  className="w-full py-2 bg-[#2a422d] hover:bg-[#1d2f20] text-white rounded-xl font-medium shadow-sm transition-all flex items-center justify-center gap-1.5 text-xs tap-bounce cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Guardar en Expediente
                </button>
              </form>

              <div className="space-y-2 pt-1">
                <span className="font-semibold text-stone-400 text-[10px] uppercase tracking-wider block px-1">
                  Historial de Notas ({clinicalNotes.length})
                </span>

                {clinicalNotes.length === 0 ? (
                  <div className="p-5 text-center text-xs text-stone-400 bg-white rounded-2xl border border-dashed border-stone-200 font-light">
                    No hay notas registradas.
                  </div>
                ) : (
                  clinicalNotes.map((note, idx) => (
                    <div key={note.id || idx} className="glass-panel p-3 rounded-2xl border border-stone-200/80 shadow-ambient space-y-1">
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="font-semibold text-[#2a422d] bg-emerald-50 px-2 py-0.2 rounded-md border border-emerald-100">
                          {note.date}
                        </span>
                        <span className="text-stone-400 font-mono">Nota #{clinicalNotes.length - idx}</span>
                      </div>
                      <p className="text-xs text-stone-800 leading-relaxed pt-0.5 font-serif whitespace-pre-line">
                        {note.text}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* =========================================================
              3. TAREAS Y EJERCICIOS
             ========================================================= */}
          {activeTab === 'tasks' && (
            <div className="space-y-3 animate-fadeIn">
              <div className="glass-panel p-3 rounded-2xl border border-stone-200/80 shadow-ambient space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-stone-800 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Cumplimiento Extramuros
                  </span>
                  <span className="font-bold text-[#2a422d] bg-emerald-50 px-2 py-0.5 rounded-full text-[11px]">
                    {completedTasks} de {totalTasks} ({progressPercent}% apego)
                  </span>
                </div>
                <div className="w-full bg-stone-200/60 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#2a422d] h-full rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }} />
                </div>
              </div>

              <div className="space-y-1.5">
                {tasks.map(task => (
                  <div key={task.id} className="p-3 rounded-xl border bg-white border-stone-200/80 shadow-ambient flex items-start justify-between gap-2.5">
                    <button onClick={() => onToggleTask && onToggleTask(task.id)} className="mt-0.5 tap-bounce cursor-pointer">
                      <CheckCircle2 className={`w-4 h-4 ${task.done ? 'text-emerald-600' : 'text-stone-300'}`} />
                    </button>
                    <div className="flex-1 min-w-0">
                      <span className={`text-xs font-medium block leading-snug ${task.done ? 'text-stone-400 line-through' : 'text-stone-800'}`}>
                        {task.title}
                      </span>
                      <span className="text-[9px] bg-stone-100 text-stone-600 px-1.5 py-0.2 rounded-full font-medium mt-1 inline-block">
                        {task.tag}
                      </span>
                    </div>
                    <button onClick={() => onDeleteTask && onDeleteTask(task.id)} className="text-stone-300 hover:text-rose-600 p-1 tap-bounce cursor-pointer">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              <form onSubmit={handleAssignTask} className="glass-panel p-3.5 rounded-2xl border border-stone-200/80 shadow-ambient space-y-2.5">
                <span className="font-semibold text-stone-800 block text-xs">
                  + Asignar Nuevo Ejercicio:
                </span>
                <input 
                  type="text" 
                  required
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="Ej: Registro de respiración 4-7-8 antes de dormir..."
                  className="w-full p-2.5 rounded-xl border border-stone-200 bg-white text-stone-800 text-xs focus:outline-none focus:ring-2 focus:ring-[#335236]/30"
                />
                <div className="flex items-center justify-between gap-2">
                  <select 
                    value={newTaskTag}
                    onChange={(e) => setNewTaskTag(e.target.value)}
                    className="p-1.5 rounded-lg border border-stone-200 bg-white text-stone-700 text-xs cursor-pointer"
                  >
                    <option value="Calma">Calma</option>
                    <option value="Gratitud">Gratitud</option>
                    <option value="Reflexión">Reflexión</option>
                    <option value="Límites">Límites</option>
                  </select>
                  <button type="submit" className="px-3.5 py-1.5 bg-[#2a422d] hover:bg-[#1d2f20] text-white rounded-xl font-medium text-xs tap-bounce cursor-pointer">
                    <Plus className="w-3.5 h-3.5 inline mr-1" /> Enviar
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* =========================================================
              4. BUZÓN DE SESIÓN Y APRENDIZAJES
             ========================================================= */}
          {activeTab === 'vault' && (
            <div className="space-y-3 animate-fadeIn">
              <div className="space-y-1.5">
                <span className="font-semibold text-stone-800 flex items-center gap-1.5 text-xs font-serif">
                  <Inbox className="w-3.5 h-3.5 text-amber-700" /> Temas del Paciente para Consulta:
                </span>
                {sessionTopics.length === 0 ? (
                  <p className="text-stone-400 text-xs italic font-light">No hay temas en su buzón.</p>
                ) : (
                  sessionTopics.map(topic => (
                    <div key={topic.id} className="p-3 rounded-xl border bg-white border-stone-200/80 shadow-ambient">
                      <span className="text-[9px] bg-stone-100 text-stone-600 px-2 py-0.2 rounded-full font-medium">
                        {topic.tag}
                      </span>
                      <p className="text-stone-800 text-xs mt-1 font-light leading-relaxed">{topic.text}</p>
                    </div>
                  ))
                )}
              </div>

              <form onSubmit={handlePinEpiphany} className="rounded-2xl p-3.5 bg-gradient-to-br from-[#fcfbf9] to-[#f5efe6] border border-[#e8ded0] space-y-2 shadow-ambient">
                <span className="font-semibold text-[#7a5522] flex items-center gap-1.5 text-xs">
                  <Sparkles className="w-3.5 h-3.5" /> Fijar Aprendizaje en su Cuaderno:
                </span>
                <textarea
                  rows="2"
                  value={newEpiphanyText}
                  onChange={(e) => setNewEpiphanyText(e.target.value)}
                  placeholder="Escribe la verdad que debe recordar..."
                  className="w-full p-2.5 rounded-xl border border-[#e8ded0] bg-white text-stone-800 text-xs focus:outline-none focus:ring-2 focus:ring-[#7a5522]/30 resize-none font-serif italic"
                />
                <button type="submit" className="w-full py-2 bg-[#7a5522] hover:bg-[#604218] text-white rounded-xl font-medium text-xs tap-bounce cursor-pointer shadow-sm">
                  Guardar en su Cuaderno
                </button>
              </form>
            </div>
          )}

          {/* =========================================================
              5. FICHA TÉCNICA NOM-004 Y CLAVE PIN
             ========================================================= */}
          {activeTab === 'dossier' && (
            <div className="space-y-3 animate-fadeIn">
              
              <div className="bg-gradient-to-br from-emerald-50/90 to-teal-50/60 p-3.5 rounded-2xl border border-emerald-200/80 shadow-ambient space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#335236] flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-emerald-700" /> Clave de Ingreso del Paciente
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={handleCopyPinText}
                      className="text-[10px] bg-white border border-emerald-200 text-[#2a422d] px-2 py-0.5 rounded-lg font-medium flex items-center gap-1 hover:bg-emerald-50 tap-bounce cursor-pointer"
                    >
                      {copiedWhatsApp ? <CheckCheck className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedWhatsApp ? 'Copiado' : 'Copiar'}</span>
                    </button>
                    <button
                      onClick={handleSendPinWhatsApp}
                      className="text-[10px] bg-[#2a422d] hover:bg-[#1d2f20] text-white px-2.5 py-0.5 rounded-lg font-medium flex items-center gap-1 tap-bounce cursor-pointer shadow-sm"
                    >
                      <MessageCircle className="w-3 h-3" /> WhatsApp
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-0.5">
                  <div>
                    <span className="text-[9px] text-stone-500 block">PIN de 6 Dígitos:</span>
                    <span className="text-xl font-mono font-bold text-stone-900 tracking-[0.25em] block">
                      {currentPin}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleRegenerateUniquePin}
                    className="text-[10px] bg-white border border-emerald-300/80 text-[#2a422d] px-2.5 py-1 rounded-lg font-medium flex items-center gap-1 tap-bounce cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" /> Regenerar
                  </button>
                </div>
              </div>

              <div className="glass-panel p-3.5 rounded-2xl border border-stone-200/80 shadow-ambient space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                  Motivo de Consulta Inicial:
                </span>
                <p className="text-xs text-stone-800 leading-relaxed font-light">
                  {patient.motivo || 'Primera entrevista diagnóstica.'}
                </p>
              </div>

              <div className="rounded-2xl p-3.5 bg-gradient-to-br from-[#faf8f5] to-[#f2ece4] border border-stone-200/80 shadow-ambient space-y-1">
                <span className="font-semibold text-[#335236] flex items-center gap-1.5 text-[10px] uppercase tracking-wider">
                  <Target className="w-3.5 h-3.5" /> Objetivos Terapéuticos:
                </span>
                <p className="text-stone-700 leading-relaxed text-xs font-serif italic">
                  {patient.therapeuticGoals || 'Regulación emocional, autocuidado y fomento de la introspección.'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="glass-panel p-2.5 rounded-2xl border border-stone-200/80">
                  <span className="text-stone-400 block text-[9px] uppercase font-semibold">Terapia Previa:</span>
                  <span className="text-stone-800 font-medium">{patient.previousTherapy || 'No'}</span>
                </div>
                <div className="glass-panel p-2.5 rounded-2xl border border-stone-200/80">
                  <span className="text-stone-400 block text-[9px] uppercase font-semibold">Medicación:</span>
                  <span className="text-stone-800 font-medium truncate block">{patient.medication || 'Ninguna'}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-stone-200/70">
                {!confirmDeletePatient ? (
                  <button
                    type="button"
                    onClick={() => setConfirmDeletePatient(true)}
                    className="w-full py-2 text-center text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-colors tap-bounce cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Dar de baja expediente de este paciente
                  </button>
                ) : (
                  <div className="bg-rose-50 p-3.5 rounded-2xl border border-rose-200 space-y-2 text-center animate-fadeIn">
                    <p className="text-xs font-bold text-rose-900">
                      ¿Segura que deseas eliminar a {patient.name}?
                    </p>
                    <p className="text-[10px] text-rose-700 leading-tight">
                      Se borrarán de forma permanente sus citas, tareas y notas en la nube.
                    </p>
                    <div className="flex gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setConfirmDeletePatient(false)}
                        className="flex-1 py-1.5 bg-white border border-stone-200 rounded-xl text-stone-700 text-xs font-medium tap-bounce cursor-pointer"
                      >
                        Cancelar
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (onDeletePatient) onDeletePatient(patient.id);
                          onClose();
                        }}
                        className="flex-1 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold tap-bounce cursor-pointer shadow-sm"
                      >
                        Sí, eliminar
                      </button>
                    </div>
                  </div>
                )}
              </div>

            </div>
          )}

        </div>

      </div>

      {showEditModal && (
        <EditPatientModal 
          patient={patient}
          onClose={() => setShowEditModal(false)}
          onUpdatePatient={(updated) => {
            if (onUpdatePatient) onUpdatePatient(updated);
          }}
        />
      )}

      {showReportModal && (
        <ClinicalReportModal 
          patient={patient}
          completedSessionsCount={completedSessionsCount}
          clinicalNotes={clinicalNotes}
          moodCheckIns={patient.moodCheckIns || []}
          tasks={tasks}
          epiphanies={epiphanies}
          sessionTopics={sessionTopics}
          onClose={() => setShowReportModal(false)}
        />
      )}

    </div>
  );
}