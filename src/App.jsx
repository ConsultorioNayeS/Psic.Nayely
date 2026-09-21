import React, { useState, useEffect } from 'react';
import PatientView from './components/PatientView';
import TherapistView from './components/TherapistView';
import AuthView from './components/AuthView';
import { supabase } from './lib/supabase';
import { LogOut } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('nayely_auth_session');
    return saved ? JSON.parse(saved) : null;
  });

  const [isLoading, setIsLoading] = useState(false);

  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [patientTasks, setPatientTasks] = useState([]);
  const [epiphanies, setEpiphanies] = useState([]);
  const [sessionTopics, setSessionTopics] = useState([]);
  const [victories, setVictories] = useState([]);
  const [rescueLetter, setRescueLetter] = useState(null);
  const [audioLibrary, setAudioLibrary] = useState([]);
  const [moodCheckIns, setMoodCheckIns] = useState([]);
  const [clinicalNotes, setClinicalNotes] = useState([]);

  const formatPatientFromDB = (p) => {
    const emergency = p.emergency_contact || p.emergencyContact || {
      name: 'No asignado',
      phone: '',
      relation: 'Familiar'
    };

    return {
      ...p,
      firstName: p.first_name || p.firstName || p.name?.split(' ')[0] || '',
      paternalLastName: p.paternal_last_name || p.paternalLastName || '',
      maternalLastName: p.maternal_last_name || p.maternalLastName || '',
      gender: p.gender || 'Masculino',
      emergencyContact: emergency,
      emergency_contact: emergency,
      previousTherapy: p.previous_therapy || p.previousTherapy || 'No',
      therapeuticGoals: p.therapeutic_goals || p.therapeuticGoals || '',
      clinicalNotes: p.clinicalNotes || []
    };
  };

  const formatAppointmentFromDB = (a) => ({
    ...a,
    patientId: a.patient_id || a.patientId,
    patient_id: a.patient_id || a.patientId,
    patientName: a.patient_name || a.patientName || 'Paciente',
    patient_name: a.patient_name || a.patientName || 'Paciente',
    patientPhone: a.patient_phone || a.patientPhone || '',
    patient_phone: a.patient_phone || a.patientPhone || '',
    rawDate: a.raw_date || a.rawDate,
    raw_date: a.raw_date || a.rawDate,
  });

  // CARGA DE DATOS CONDICIONAL: Solo se ejecuta si hay un usuario autenticado
  const fetchCloudData = async (user) => {
    if (!user) return;
    setIsLoading(true);

    try {
      if (user.role === 'therapist') {
        // La terapeuta descarga el consultorio completo
        const [pts, apts, tsks, eps, tops, vics, auds, moods, cNotes] = await Promise.all([
          supabase.from('patients').select('*').order('created_at', { ascending: false }),
          supabase.from('appointments').select('*').order('created_at', { ascending: false }),
          supabase.from('patient_tasks').select('*').order('created_at', { ascending: false }),
          supabase.from('epiphanies').select('*').order('created_at', { ascending: false }),
          supabase.from('session_topics').select('*').order('created_at', { ascending: false }),
          supabase.from('micro_victories').select('*').order('created_at', { ascending: false }),
          supabase.from('audio_library').select('*').order('created_at', { ascending: false }),
          supabase.from('mood_checkins').select('*').order('created_at', { ascending: false }),
          supabase.from('clinical_notes').select('*').order('created_at', { ascending: false }),
        ]);

        if (pts.data) setPatients(pts.data.map(formatPatientFromDB));
        if (apts.data) setAppointments(apts.data.map(formatAppointmentFromDB));
        if (tsks.data) setPatientTasks(tsks.data);
        if (eps.data) setEpiphanies(eps.data);
        if (tops.data) setSessionTopics(tops.data);
        if (vics.data) setVictories(vics.data);
        if (auds.data) setAudioLibrary(auds.data);
        if (moods.data) setMoodCheckIns(moods.data);
        if (cNotes.data) setClinicalNotes(cNotes.data);

      } else if (user.role === 'patient') {
        // Un paciente descarga ÚNICAMENTE sus propios registros (Máxima privacidad)
        const pId = user.patientId;
        const [patientData, apts, tsks, eps, tops, vics, auds, moods, letter] = await Promise.all([
          supabase.from('patients').select('*').eq('id', pId).single(),
          supabase.from('appointments').select('*').eq('patient_id', pId).order('created_at', { ascending: false }),
          supabase.from('patient_tasks').select('*').eq('patient_id', pId).order('created_at', { ascending: false }),
          supabase.from('epiphanies').select('*').eq('patient_id', pId).order('created_at', { ascending: false }),
          supabase.from('session_topics').select('*').eq('patient_id', pId).order('created_at', { ascending: false }),
          supabase.from('micro_victories').select('*').eq('patient_id', pId).order('created_at', { ascending: false }),
          supabase.from('audio_library').select('*').order('created_at', { ascending: false }),
          supabase.from('mood_checkins').select('*').eq('patient_id', pId).order('created_at', { ascending: false }),
          supabase.from('rescue_letters').select('*').eq('patient_id', pId).order('created_at', { ascending: false }).limit(1)
        ]);

        if (patientData.data) setPatients([formatPatientFromDB(patientData.data)]);
        if (apts.data) setAppointments(apts.data.map(formatAppointmentFromDB));
        if (tsks.data) setPatientTasks(tsks.data);
        if (eps.data) setEpiphanies(eps.data);
        if (tops.data) setSessionTopics(tops.data);
        if (vics.data) setVictories(vics.data);
        if (auds.data) setAudioLibrary(auds.data);
        if (moods.data) setMoodCheckIns(moods.data);
        if (letter.data && letter.data.length > 0) setRescueLetter(letter.data[0]);
      }
    } catch (err) {
      console.error('Error cargando datos protegidos:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchCloudData(currentUser);
    }
  }, [currentUser]);

  // LOGIN ASÍNCRONO SEGURO (VALIDADO CONTRA LA BASE DE DATOS)
  const handleLoginWithPin = async (identifier, enteredPin) => {
    const cleanId = identifier.replace(/\D/g, '') || identifier.toLowerCase().trim();

    // 1. Validar si intenta entrar la terapeuta (Nayely)
    if (cleanId === 'nayely' || identifier.toLowerCase().includes('nayely')) {
      try {
        const { data, error } = await supabase
          .from('therapist_credentials')
          .select('pin')
          .eq('id', 'nayely')
          .single();

        // Si existe en Supabase y el PIN coincide:
        if (data && data.pin === enteredPin) {
          const authData = { role: 'therapist', name: 'Psicóloga Nayely', id: 'nayely' };
          setCurrentUser(authData);
          localStorage.setItem('nayely_auth_session', JSON.stringify(authData));
          return true;
        }
      } catch (e) {
        console.error('Error validando credenciales de terapeuta:', e);
      }
      return false;
    }

    // 2. Validar si intenta entrar un paciente (Consulta directa y segura en Supabase)
    try {
      let query = supabase.from('patients').select('id, name, pin, phone, email');

      if (/^\d+$/.test(cleanId) && cleanId.length >= 7) {
        query = query.ilike('phone', `%${cleanId}%`);
      } else {
        query = query.ilike('email', cleanId);
      }

      const { data: candidates, error } = await query;

      if (candidates && candidates.length > 0) {
        const patientMatch = candidates.find(p => p.pin === enteredPin);
        if (patientMatch) {
          const authData = { role: 'patient', patientId: patientMatch.id, name: patientMatch.name };
          setCurrentUser(authData);
          localStorage.setItem('nayely_auth_session', JSON.stringify(authData));
          return true;
        }
      }
    } catch (e) {
      console.error('Error validando paciente:', e);
    }

    return false;
  };

  const handleLogout = () => {
    localStorage.removeItem('nayely_auth_session');
    setCurrentUser(null);
    setPatients([]);
    setAppointments([]);
    setPatientTasks([]);
    setClinicalNotes([]);
    setMoodCheckIns([]);
  };

  const handleSaveMoodCheckIn = async (entry) => {
    if (!currentUser?.patientId) return;

    const payload = {
      patient_id: currentUser.patientId,
      mood: entry.mood,
      tags: entry.tags || [],
      note: entry.note || '',
    };

    const { data } = await supabase.from('mood_checkins').insert([payload]).select();
    if (data && data[0]) {
      setMoodCheckIns(prev => [data[0], ...prev]);
    }
  };

  const handleSavePatient = async (newPatient) => {
    const pin = newPatient.pin || Math.floor(100000 + Math.random() * 900000).toString();
    const emergency = newPatient.emergencyContact || newPatient.emergency_contact || {};

    const patientPayload = {
      first_name: newPatient.firstName,
      paternal_last_name: newPatient.paternalLastName,
      maternal_last_name: newPatient.maternalLastName,
      name: newPatient.name,
      phone: newPatient.phone,
      email: newPatient.email,
      pin: pin,
      age: newPatient.age,
      gender: newPatient.gender || 'Masculino',
      occupation: newPatient.occupation,
      status: 'active',
      emergency_contact: emergency,
      motivo: newPatient.motivo,
      medication: newPatient.medication,
      previous_therapy: newPatient.previousTherapy,
      therapeutic_goals: newPatient.therapeuticGoals,
    };

    const { data } = await supabase.from('patients').insert([patientPayload]).select();
    if (data && data[0]) {
      setPatients([formatPatientFromDB(data[0]), ...patients]);
    }
  };

  const handleUpdatePatient = async (updatedPatient) => {
    const formatted = formatPatientFromDB(updatedPatient);
    setPatients(prev => prev.map(p => p.id === formatted.id ? formatted : p));

    const emergency = updatedPatient.emergencyContact || updatedPatient.emergency_contact || {};

    await supabase
      .from('patients')
      .update({
        first_name: updatedPatient.firstName,
        paternal_last_name: updatedPatient.paternalLastName,
        maternal_last_name: updatedPatient.maternalLastName,
        name: updatedPatient.name,
        phone: updatedPatient.phone,
        email: updatedPatient.email,
        pin: updatedPatient.pin,
        age: updatedPatient.age,
        gender: updatedPatient.gender,
        occupation: updatedPatient.occupation,
        status: updatedPatient.status,
        emergency_contact: emergency,
        motivo: updatedPatient.motivo,
        medication: updatedPatient.medication,
        therapeutic_goals: updatedPatient.therapeuticGoals,
      })
      .eq('id', updatedPatient.id);
  };

  const handleDeletePatient = async (id) => {
    await supabase.from('patients').delete().eq('id', id);
    setPatients(prev => prev.filter(p => p.id !== id));
    setAppointments(prev => prev.filter(a => (a.patient_id !== id && a.patientId !== id)));
    setPatientTasks(prev => prev.filter(t => (t.patient_id !== id && t.patientId !== id)));
    setMoodCheckIns(prev => prev.filter(m => m.patient_id !== id));
    setClinicalNotes(prev => prev.filter(n => n.patient_id !== id));
  };

  const handleScheduleAppointment = async (newAppointment) => {
    const payload = {
      patient_id: newAppointment.patientId,
      patient_name: newAppointment.patientName,
      patient_phone: newAppointment.patientPhone,
      date: newAppointment.date,
      raw_date: newAppointment.rawDate,
      time: newAppointment.time,
      modality: newAppointment.modality,
      location: newAppointment.location,
      status: 'Confirmada',
    };

    const { data } = await supabase.from('appointments').insert([payload]).select();
    if (data && data[0]) {
      setAppointments([formatAppointmentFromDB(data[0]), ...appointments]);
    } else {
      const fallback = formatAppointmentFromDB({ ...newAppointment, id: Date.now() });
      setAppointments([fallback, ...appointments]);
    }
  };

  const handleUpdateAppointment = async (updatedAppointment) => {
    const formatted = formatAppointmentFromDB(updatedAppointment);
    setAppointments(appointments.map(a => a.id === formatted.id ? formatted : a));

    await supabase
      .from('appointments')
      .update({
        date: updatedAppointment.date,
        raw_date: updatedAppointment.rawDate || updatedAppointment.raw_date,
        time: updatedAppointment.time,
        modality: updatedAppointment.modality,
        location: updatedAppointment.location,
      })
      .eq('id', updatedAppointment.id);
  };

  const handleDeleteAppointment = async (id) => {
    await supabase.from('appointments').delete().eq('id', id);
    setAppointments(appointments.filter(a => a.id !== id));
  };

  const handleCompleteSession = async ({ appointmentId, patientId, clinicalNote, epiphanies: newEpiphanies = [], tasks: newTasks = [], date }) => {
    await supabase.from('appointments').update({ status: 'Completada' }).eq('id', appointmentId);
    setAppointments(prev => prev.map(a => a.id === appointmentId ? { ...a, status: 'Completada' } : a));

    const notePayload = { 
      patient_id: patientId, 
      date: date || 'Hoy', 
      text: clinicalNote 
    };
    const { data: savedNote } = await supabase.from('clinical_notes').insert([notePayload]).select();
    if (savedNote && savedNote[0]) {
      setClinicalNotes(prev => [savedNote[0], ...prev]);
    } else {
      setClinicalNotes(prev => [{ ...notePayload, id: Date.now() }, ...prev]);
    }

    if (newEpiphanies.length > 0) {
      const payloadEps = newEpiphanies.map(e => ({
        patient_id: patientId,
        insight: e.insight,
        context: e.context,
        date: e.date,
        author: 'Psicóloga Nayely',
      }));
      const { data: savedEps } = await supabase.from('epiphanies').insert(payloadEps).select();
      if (savedEps) setEpiphanies(prev => [...savedEps, ...prev]);
    }

    if (newTasks.length > 0) {
      const payloadTasks = newTasks.map(t => ({
        patient_id: patientId,
        title: t.title,
        tag: t.tag,
        done: false,
      }));
      const { data: savedTasks } = await supabase.from('patient_tasks').insert(payloadTasks).select();
      if (savedTasks) setPatientTasks(prev => [...savedTasks, ...prev]);
    }
  };

  const handleAddClinicalNote = async ({ patientId, text, date }) => {
    const payload = {
      patient_id: patientId,
      date: date || 'Hoy',
      text: text.trim()
    };
    const { data } = await supabase.from('clinical_notes').insert([payload]).select();
    if (data && data[0]) {
      setClinicalNotes(prev => [data[0], ...prev]);
    } else {
      setClinicalNotes(prev => [{ ...payload, id: Date.now() }, ...prev]);
    }
  };

  const handleAddAudio = async (newAudio) => {
    const payload = {
      title: newAudio.title,
      category: newAudio.category,
      duration: newAudio.duration,
      author: 'Psicóloga Nayely',
      date: newAudio.date || 'Reciente',
    };
    const { data } = await supabase.from('audio_library').insert([payload]).select();
    if (data && data[0]) setAudioLibrary([data[0], ...audioLibrary]);
  };

  const handleAddTask = async (newTask) => {
    const payload = {
      patient_id: newTask.patientId || (currentUser?.role === 'patient' ? currentUser.patientId : null),
      title: newTask.title,
      tag: newTask.tag,
      done: false,
    };
    const { data } = await supabase.from('patient_tasks').insert([payload]).select();
    if (data && data[0]) setPatientTasks([data[0], ...patientTasks]);
  };

  const handleToggleTask = async (id) => {
    const task = patientTasks.find(t => t.id === id);
    if (!task) return;
    const newDone = !task.done;
    await supabase.from('patient_tasks').update({ done: newDone }).eq('id', id);
    setPatientTasks(patientTasks.map(t => t.id === id ? { ...t, done: newDone } : t));
  };

  const handleDeleteTask = async (id) => {
    await supabase.from('patient_tasks').delete().eq('id', id);
    setPatientTasks(patientTasks.filter(t => t.id !== id));
  };

  const handleAddSessionTopic = async (newTopic) => {
    const payload = {
      patient_id: currentUser?.patientId,
      text: newTopic.text,
      tag: newTopic.tag,
      priority: newTopic.priority,
      date: newTopic.date,
    };
    const { data } = await supabase.from('session_topics').insert([payload]).select();
    if (data && data[0]) setSessionTopics([data[0], ...sessionTopics]);
  };

  const handleDeleteSessionTopic = async (id) => {
    await supabase.from('session_topics').delete().eq('id', id);
    setSessionTopics(sessionTopics.filter(t => t.id !== id));
  };

  const handleAddEpiphany = async (newEpiphany) => {
    const payload = {
      patient_id: currentUser?.patientId,
      insight: newEpiphany.insight,
      context: newEpiphany.context,
      date: newEpiphany.date,
      author: newEpiphany.author || 'Paciente',
    };
    const { data } = await supabase.from('epiphanies').insert([payload]).select();
    if (data && data[0]) setEpiphanies([data[0], ...epiphanies]);
  };

  const handleAddVictory = async (newVictory) => {
    const payload = {
      patient_id: currentUser?.patientId,
      text: newVictory.text,
      tag: newVictory.tag,
      date: newVictory.date,
    };
    const { data } = await supabase.from('micro_victories').insert([payload]).select();
    if (data && data[0]) setVictories([data[0], ...victories]);
  };

  const handleSaveRescueLetter = async (letter) => {
    const payload = {
      patient_id: currentUser?.patientId,
      text: letter.text,
      anchors: letter.anchors,
      updated_at: letter.updatedAt,
    };
    const { data } = await supabase.from('rescue_letters').insert([payload]).select();
    if (data && data[0]) setRescueLetter(data[0]);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center text-xs text-stone-400 font-light">
        Verificando credenciales con el consultorio privado...
      </div>
    );
  }

  // SI NO HAY SESIÓN ACTIVA, MUESTRA LOGIN (SIN NINGÚN DATO CARGADO EN MEMORIA)
  if (!currentUser) {
    return (
      <AuthView 
        onLoginWithPin={handleLoginWithPin}
      />
    );
  }

  const isTherapist = currentUser.role === 'therapist';
  const currentPatient = !isTherapist ? (patients[0] || null) : null;

  const patientSpecificAppointments = currentPatient 
    ? appointments.filter(a => a.patient_id === currentPatient.id || a.patientId === currentPatient.id) 
    : [];
  const patientUpcomingAppointment = patientSpecificAppointments.find(a => a.status !== 'Completada');
  const patientCompletedSessionsCount = patientSpecificAppointments.filter(a => a.status === 'Completada').length;

  const patientSpecificTasks = currentPatient ? patientTasks : [];
  const patientSpecificTopics = currentPatient ? sessionTopics : [];
  const patientSpecificEpiphanies = currentPatient ? epiphanies : [];
  const patientSpecificVictories = currentPatient ? victories : [];
  const patientSpecificMoodCheckIns = currentPatient ? moodCheckIns : [];

  return (
    <div className="min-h-screen bg-[#faf8f5] flex justify-center selection:bg-emerald-100">
      <div className="w-full max-w-md bg-[#faf8f5] min-h-screen pb-20 relative shadow-xl border-x border-stone-200/50">
        
        <div className="bg-white/90 backdrop-blur-md px-4 py-2.5 border-b border-stone-200/80 flex items-center justify-between text-xs sticky top-0 z-40">
          <span className="text-[11px] text-stone-600 truncate max-w-[220px]">
            Sesión: <strong className="font-semibold text-stone-900">{currentUser.name}</strong>
          </span>

          <button
            onClick={handleLogout}
            className="text-[10px] text-stone-500 hover:text-rose-600 font-medium flex items-center gap-1 bg-stone-100 hover:bg-rose-50 px-2.5 py-1 rounded-xl transition-colors cursor-pointer"
            title="Cerrar sesión"
          >
            <LogOut className="w-3 h-3" /> Salir
          </button>
        </div>

        {!isTherapist ? (
          <PatientView 
            currentPatient={currentPatient}
            audioLibrary={audioLibrary}
            tasks={patientSpecificTasks}
            sessionTopics={patientSpecificTopics}
            epiphanies={patientSpecificEpiphanies}
            victories={patientSpecificVictories}
            rescueLetter={rescueLetter}
            moodCheckIns={patientSpecificMoodCheckIns}
            completedSessionsCount={patientCompletedSessionsCount}
            onSaveMoodCheckIn={handleSaveMoodCheckIn}
            patientStatus={currentPatient?.status || 'active'}
            onToggleTask={handleToggleTask}
            onAddSessionTopic={handleAddSessionTopic}
            onDeleteSessionTopic={handleDeleteSessionTopic}
            onAddEpiphany={handleAddEpiphany}
            onAddVictory={handleAddVictory}
            onSaveRescueLetter={handleSaveRescueLetter}
            upcomingAppointment={patientUpcomingAppointment}
          />
        ) : (
          <TherapistView 
            audioLibrary={audioLibrary}
            appointments={appointments}
            patients={patients}
            tasks={patientTasks}
            sessionTopics={sessionTopics}
            epiphanies={epiphanies}
            moodCheckIns={moodCheckIns}
            clinicalNotes={clinicalNotes}
            onAddClinicalNote={handleAddClinicalNote}
            onAddAudio={handleAddAudio}
            onAddTaskToPatient={handleAddTask}
            onDeleteTask={handleDeleteTask}
            onToggleTask={handleToggleTask}
            onAddEpiphany={handleAddEpiphany}
            onScheduleAppointment={handleScheduleAppointment}
            onUpdateAppointment={handleUpdateAppointment}
            onDeleteAppointment={handleDeleteAppointment}
            onSavePatient={handleSavePatient}
            onUpdatePatient={handleUpdatePatient}
            onDeletePatient={handleDeletePatient}
            onCompleteSession={handleCompleteSession}
          />
        )}

      </div>
    </div>
  );
}