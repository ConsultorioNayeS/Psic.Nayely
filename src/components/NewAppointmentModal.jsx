import React, { useState } from 'react';
import { X, Calendar, Clock, MapPin, Video, Check, MessageCircle, Phone } from 'lucide-react';

export default function NewAppointmentModal({ patients = [], onClose, onSchedule }) {
  const [selectedPatientId, setSelectedPatientId] = useState(patients[0]?.id || 1);
  const [date, setDate] = useState('2026-10-24');
  const [time, setTime] = useState('17:00');
  const [modality, setModality] = useState('Presencial');
  const [locationDetails, setLocationDetails] = useState('Consultorio 3B');
  const [openWhatsAppDirectly, setOpenWhatsAppDirectly] = useState(true);

  const currentPatient = patients.find(p => p.id === Number(selectedPatientId)) || patients[0];

  const formatPhoneForWhatsApp = (rawPhone) => {
    if (!rawPhone) return '';
    let cleaned = rawPhone.replace(/\D/g, '');
    if (cleaned.length === 10) cleaned = '52' + cleaned;
    return cleaned;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Fecha legible (ej: Jueves, 24 de Octubre)
    const dateObj = new Date(date + 'T00:00:00');
    const options = { weekday: 'long', day: 'numeric', month: 'long' };
    const formattedDate = dateObj.toLocaleDateString('es-ES', options);
    const capitalizedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

    // Hora (ej: 5:00 PM)
    const [hours, minutes] = time.split(':');
    const hourNum = parseInt(hours, 10);
    const ampm = hourNum >= 12 ? 'PM' : 'AM';
    const formattedHour = ((hourNum + 11) % 12 + 1) + ':' + minutes + ' ' + ampm;

    // Solo el primer nombre para saludo cálido
    const firstName = currentPatient.firstName || currentPatient.name.split(' ')[0];

    // Texto explícito del consultorio / modalidad
    const locationMessageText = modality === 'Presencial' 
      ? `en el consultorio: *${locationDetails}*` 
      : `vía videollamada (*${locationDetails}*)`;

    // Guardar en sistema
    onSchedule({
      id: Date.now(),
      patientId: currentPatient.id,
      patientName: currentPatient.name,
      patientFirstName: firstName,
      patientPhone: currentPatient.phone,
      date: capitalizedDate,
      rawDate: date,
      time: formattedHour,
      modality: modality,
      location: modality === 'Presencial' ? locationDetails : 'Videollamada Google Meet / Zoom',
      status: 'Confirmada'
    });

    // ABRIR WHATSAPP DIRECTO
    if (openWhatsAppDirectly && currentPatient.phone) {
      const cleanPhone = formatPhoneForWhatsApp(currentPatient.phone);
      const message = `Hola ${firstName}, te saluda la Dra. Nayely. Te confirmo nuestra sesión terapéutica para el *${capitalizedDate}* a las *${formattedHour}* ${locationMessageText}. ¡Nos vemos pronto para continuar con tu proceso!`;
      const encodedMsg = encodeURIComponent(message);
      
      const waUrl = cleanPhone 
        ? `https://wa.me/${cleanPhone}?text=${encodedMsg}` 
        : `https://wa.me/?text=${encodedMsg}`;

      window.open(waUrl, '_blank');
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="w-full max-w-sm bg-white rounded-[32px] p-6 space-y-5 shadow-2xl border border-stone-200">
        
        {/* Encabezado */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 flex items-center justify-center text-[#436146]">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Agenda Rápida</span>
              <h3 className="text-sm font-semibold text-stone-800">Programar Cita</h3>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-400 text-xs transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* Seleccionar Paciente */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="font-semibold text-stone-600">Paciente:</label>
              <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                <Phone className="w-3 h-3" /> {currentPatient?.phone || 'Sin cel'}
              </span>
            </div>
            <select
              value={selectedPatientId}
              onChange={(e) => setSelectedPatientId(e.target.value)}
              className="w-full p-3 rounded-2xl border border-stone-200 bg-stone-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-stone-800 font-medium"
            >
              {patients.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          {/* Fecha y Hora */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="space-y-1.5">
              <label className="font-semibold text-stone-600 block flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-stone-400" /> Fecha:
              </label>
              <input 
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-2.5 rounded-2xl border border-stone-200 bg-stone-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-stone-800 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-stone-600 block flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-stone-400" /> Hora:
              </label>
              <input 
                type="time"
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full p-2.5 rounded-2xl border border-stone-200 bg-stone-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-stone-800 text-xs"
              />
            </div>
          </div>

          {/* Modalidad */}
          <div className="space-y-1.5">
            <label className="font-semibold text-stone-600 block">Modalidad:</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => { setModality('Presencial'); setLocationDetails('Consultorio 3B'); }}
                className={`p-2.5 rounded-2xl border text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
                  modality === 'Presencial'
                    ? 'bg-[#436146] text-white border-[#436146] shadow-sm'
                    : 'bg-stone-50 text-stone-600 border-stone-200'
                }`}
              >
                <MapPin className="w-3.5 h-3.5" /> Presencial
              </button>

              <button
                type="button"
                onClick={() => { setModality('En línea'); setLocationDetails('Google Meet'); }}
                className={`p-2.5 rounded-2xl border text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
                  modality === 'En línea'
                    ? 'bg-[#436146] text-white border-[#436146] shadow-sm'
                    : 'bg-stone-50 text-stone-600 border-stone-200'
                }`}
              >
                <Video className="w-3.5 h-3.5" /> En línea
              </button>
            </div>
          </div>

          {/* Consultorio / Ubicación */}
          <div className="space-y-1.5">
            <label className="font-semibold text-stone-600 block">
              {modality === 'Presencial' ? 'Nombre / Número de Consultorio:' : 'Plataforma de videollamada:'}
            </label>
            <input 
              type="text"
              value={locationDetails}
              onChange={(e) => setLocationDetails(e.target.value)}
              placeholder="Ej: Consultorio 3B"
              className="w-full p-2.5 rounded-2xl border border-stone-200 bg-stone-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-stone-800 text-xs"
            />
          </div>

          {/* Casilla WhatsApp */}
          <label className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-100 cursor-pointer">
            <input 
              type="checkbox" 
              checked={openWhatsAppDirectly}
              onChange={(e) => setOpenWhatsAppDirectly(e.target.checked)}
              className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 accent-[#436146]"
            />
            <span className="text-[11px] text-stone-700 flex items-center gap-1 font-medium">
              <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" /> 
              Abrir WhatsApp con mensaje listo al guardar
            </span>
          </label>

          {/* Botón Guardar */}
          <button
            type="submit"
            className="w-full py-3 bg-[#436146] hover:bg-[#253827] text-white rounded-2xl font-medium shadow-md transition-all flex items-center justify-center gap-1.5 pt-3"
          >
            <Check className="w-4 h-4" /> Agendar y Notificar Paciente
          </button>
        </form>

      </div>
    </div>
  );
}