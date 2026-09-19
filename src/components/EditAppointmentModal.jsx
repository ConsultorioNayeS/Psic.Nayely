import React, { useState } from 'react';
import { X, Calendar, Clock, MapPin, Video, Trash2, Check, MessageCircle } from 'lucide-react';

export default function EditAppointmentModal({ appointment, onClose, onUpdate, onDelete }) {
  const [date, setDate] = useState(appointment.rawDate || '2026-10-24');
  const [time, setTime] = useState('17:00');
  const [modality, setModality] = useState(appointment.modality || 'Presencial');
  const [locationDetails, setLocationDetails] = useState(appointment.location || 'Consultorio 3B');
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();

    // Formatear fecha amigable
    const dateObj = new Date(date + 'T00:00:00');
    const options = { weekday: 'long', day: 'numeric', month: 'long' };
    const formattedDate = dateObj.toLocaleDateString('es-ES', options);
    const capitalizedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

    // Formatear hora
    const [hours, minutes] = time.split(':');
    const hourNum = parseInt(hours, 10);
    const ampm = hourNum >= 12 ? 'PM' : 'AM';
    const formattedHour = ((hourNum + 11) % 12 + 1) + ':' + minutes + ' ' + ampm;

    onUpdate({
      ...appointment,
      rawDate: date,
      date: capitalizedDate,
      time: formattedHour,
      modality: modality,
      location: modality === 'Presencial' ? locationDetails : 'Videollamada Google Meet / Zoom'
    });

    onClose();
  };

  const handleNotifyRescheduleWhatsApp = () => {
    const text = `Hola ${appointment.patientName}, te saluda la Dra. Nayely. Te confirmo que hemos reprogramado nuestra cita para el ${appointment.date} a las ${appointment.time} (${appointment.location}).`;
    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="w-full max-w-sm bg-white rounded-[32px] p-6 space-y-5 shadow-2xl border border-stone-200">
        
        {/* Cabecera */}
        <div className="flex justify-between items-center">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Gestionar Cita</span>
            <h3 className="text-sm font-semibold text-stone-800">{appointment.patientName}</h3>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-400 text-xs transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          
          {/* Nueva Fecha y Hora */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="space-y-1.5">
              <label className="font-semibold text-stone-600 block flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-stone-400" /> Nueva Fecha:
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
                <Clock className="w-3.5 h-3.5 text-stone-400" /> Nueva Hora:
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
                onClick={() => { setModality('En línea'); setLocationDetails('Videollamada Google Meet / Zoom'); }}
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

          {/* Ubicación / Enlace */}
          <div className="space-y-1.5">
            <label className="font-semibold text-stone-600 block">Ubicación / Detalle:</label>
            <input 
              type="text"
              value={locationDetails}
              onChange={(e) => setLocationDetails(e.target.value)}
              className="w-full p-2.5 rounded-2xl border border-stone-200 bg-stone-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-stone-800 text-xs"
            />
          </div>

          {/* Botón Guardar Cambios */}
          <button
            type="submit"
            className="w-full py-3 bg-[#436146] hover:bg-[#253827] text-white rounded-2xl font-medium shadow-md transition-all flex items-center justify-center gap-1.5"
          >
            <Check className="w-4 h-4" /> Guardar Nueva Fecha
          </button>
        </form>

        {/* Notificar Reprogramación por WhatsApp */}
        <button
          type="button"
          onClick={handleNotifyRescheduleWhatsApp}
          className="w-full py-2.5 bg-emerald-50 hover:bg-emerald-100 text-[#25D366] rounded-2xl font-medium text-xs flex items-center justify-center gap-1.5 border border-emerald-200/60 transition-colors"
        >
          <MessageCircle className="w-4 h-4" /> Avisar reprogramación por WhatsApp
        </button>

        {/* ZONA DE CANCELAR / ELIMINAR CITA */}
        <div className="pt-2 border-t border-stone-100">
          {!confirmDelete ? (
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              className="w-full text-center text-rose-500 hover:text-rose-700 text-xs font-medium py-1.5 flex items-center justify-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" /> Cancelar y eliminar esta cita
            </button>
          ) : (
            <div className="bg-rose-50 p-3 rounded-2xl border border-rose-200 space-y-2 text-center">
              <span className="text-[11px] text-rose-800 font-medium block">
                ¿Segura que deseas eliminar la cita de {appointment.patientName}?
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setConfirmDelete(false)}
                  className="flex-1 py-1.5 bg-white border border-stone-200 rounded-xl text-stone-600 text-xs font-medium"
                >
                  No, mantener
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onDelete(appointment.id);
                    onClose();
                  }}
                  className="flex-1 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-medium"
                >
                  Sí, eliminar
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}