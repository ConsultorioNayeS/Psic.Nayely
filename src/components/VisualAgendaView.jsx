import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, Clock, MapPin, Video, 
  MessageCircle, Edit3, Plus, CheckCircle2, Sparkles, FileText, Eye 
} from 'lucide-react';

export default function VisualAgendaView({ 
  appointments = [], 
  onEditAppointment, 
  onSendWhatsApp, 
  onOpenNewAppointment,
  onOpenCheckout,
  onOpenPreSession // <-- Abre la Radiografía Pre-Sesión
}) {
  const defaultDate = appointments[0]?.rawDate || '2026-10-24';
  const [selectedDate, setSelectedDate] = useState(defaultDate);

  const baseDateObj = new Date(defaultDate + 'T00:00:00');
  
  const weekDays = [-2, -1, 0, 1, 2, 3, 4].map(offset => {
    const d = new Date(baseDateObj);
    d.setDate(d.getDate() + offset);
    const raw = d.toISOString().split('T')[0];
    const dayName = d.toLocaleDateString('es-ES', { weekday: 'short' }).toUpperCase().replace('.', '');
    const dayNumber = d.getDate();
    const fullDateName = d.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
    const capitalized = fullDateName.charAt(0).toUpperCase() + fullDateName.slice(1);
    
    const count = appointments.filter(a => a.rawDate === raw).length;

    return {
      rawDate: raw,
      dayName,
      dayNumber,
      fullDateName: capitalized,
      appointmentCount: count
    };
  });

  const appointmentsForSelectedDay = appointments.filter(a => a.rawDate === selectedDate);
  const currentDayInfo = weekDays.find(w => w.rawDate === selectedDate) || weekDays[2];

  return (
    <div className="space-y-4">
      
      {/* 1. Barra de Control */}
      <div className="flex justify-between items-center px-1">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-800">
            Agenda Clínica
          </span>
          <h2 className="text-base font-semibold text-stone-800">Organizador de Consultas</h2>
        </div>

        <button
          onClick={onOpenNewAppointment}
          className="px-3.5 py-2 bg-[#436146] hover:bg-[#253827] text-white rounded-2xl text-xs font-medium flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Nueva Cita
        </button>
      </div>

      {/* 2. Tira Semanal de Días */}
      <div className="bg-white p-3 rounded-3xl border border-stone-200/80 shadow-xs">
        <div className="flex justify-between items-center gap-1.5 overflow-x-auto no-scrollbar">
          {weekDays.map((item) => {
            const isSelected = item.rawDate === selectedDate;
            const hasAppointments = item.appointmentCount > 0;

            return (
              <button
                key={item.rawDate}
                type="button"
                onClick={() => setSelectedDate(item.rawDate)}
                className={`flex-1 min-w-[46px] py-2.5 px-1 rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer ${
                  isSelected 
                    ? 'bg-[#253827] text-white shadow-md scale-105' 
                    : 'bg-stone-50/70 hover:bg-stone-100 text-stone-600'
                }`}
              >
                <span className={`text-[10px] font-semibold tracking-wider ${
                  isSelected ? 'text-emerald-300' : 'text-stone-400'
                }`}>
                  {item.dayName}
                </span>

                <span className="text-base font-semibold my-0.5">
                  {item.dayNumber}
                </span>

                <div className="h-2 flex items-center justify-center">
                  {hasAppointments && (
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      isSelected ? 'bg-emerald-400' : 'bg-emerald-600'
                    }`} />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Encabezado del Día */}
      <div className="flex justify-between items-center px-2 pt-1">
        <div>
          <h3 className="text-sm font-semibold text-stone-800">
            {currentDayInfo.fullDateName}
          </h3>
          <span className="text-[11px] text-stone-400 font-medium">
            {appointmentsForSelectedDay.length === 0 
              ? 'Día libre de consultas' 
              : `${appointmentsForSelectedDay.length} sesión${appointmentsForSelectedDay.length > 1 ? 'es' : ''}`}
          </span>
        </div>
      </div>

      {/* 4. Tarjetas de Citas con Botón "Preparar Sesión" y "Concluir" */}
      <div className="space-y-3 pt-1">
        {appointmentsForSelectedDay.length === 0 ? (
          <div className="bg-white p-8 rounded-3xl border border-dashed border-stone-200 text-center space-y-3">
            <CalendarIcon className="w-6 h-6 text-stone-300 mx-auto" />
            <p className="text-xs font-semibold text-stone-700">Sin pacientes en este día</p>
          </div>
        ) : (
          appointmentsForSelectedDay.map(apt => {
            const isPresencial = apt.modality === 'Presencial';
            const isCompleted = apt.status === 'Completada';

            return (
              <div 
                key={apt.id}
                className="bg-white rounded-3xl p-4 border border-stone-200/80 shadow-sm relative overflow-hidden flex flex-col space-y-3"
              >
                {/* Franja de estado */}
                <div className={`absolute top-0 left-0 bottom-0 w-2 ${
                  isCompleted ? 'bg-emerald-500' : isPresencial ? 'bg-[#436146]' : 'bg-sky-500'
                }`} />

                {/* Info Cita */}
                <div className="pl-2 flex justify-between items-start">
                  <div>
                    <span className="text-sm font-semibold text-stone-800 block">{apt.patientName}</span>
                    <span className="text-xs text-stone-500 flex items-center gap-1.5 mt-0.5">
                      {isPresencial ? (
                        <>
                          <MapPin className="w-3.5 h-3.5 text-[#436146]" /> 
                          <span>{apt.location}</span>
                        </>
                      ) : (
                        <>
                          <Video className="w-3.5 h-3.5 text-sky-600" /> 
                          <span>{apt.location}</span>
                        </>
                      )}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full inline-block bg-emerald-50 text-emerald-800">
                      {apt.time}
                    </span>
                    {isCompleted && (
                      <span className="text-[10px] text-emerald-700 font-bold block mt-1">
                        ✓ Realizada
                      </span>
                    )}
                  </div>
                </div>

                {/* DOS ACCIONES CLÍNICAS PRINCIPALES */}
                <div className="pl-2 pt-2 border-t border-stone-100 space-y-2">
                  
                  {/* BOTÓN 1: PREPARAR SESIÓN (LA RADIOGRAFÍA PREVIA) */}
                  <button
                    onClick={() => onOpenPreSession(apt)}
                    className="w-full py-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-[#436146] font-semibold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-emerald-700" />
                    Preparar Sesión (Ver qué pasó en su semana)
                  </button>

                  {/* BOTÓN 2: CONCLUIR SESIÓN Y ANOTAR APRENDIZAJE */}
                  <button
                    onClick={() => onOpenCheckout(apt)}
                    className="w-full py-2 bg-[#436146] hover:bg-[#253827] text-white font-medium text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5 text-emerald-300" />
                    {isCompleted ? 'Editar Notas y Aprendizaje' : 'Concluir Sesión y Anotar Aprendizaje'}
                  </button>

                  {/* Acciones Secundarias */}
                  <div className="flex justify-between items-center text-xs pt-1">
                    <button
                      onClick={() => onEditAppointment(apt)}
                      className="text-stone-500 hover:text-stone-800 font-medium flex items-center gap-1 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Reagendar
                    </button>

                    <button
                      onClick={() => onSendWhatsApp(apt)}
                      className="text-[#25D366] hover:text-[#128C7E] font-medium flex items-center gap-1 cursor-pointer"
                    >
                      <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                    </button>
                  </div>
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
}