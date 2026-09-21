import React, { useState } from 'react';
import { X, UserPlus, Phone, AlertCircle, CheckCircle2, ChevronRight, ChevronLeft, ShieldCheck, Mail, User } from 'lucide-react';

export default function NewPatientModal({ onClose, onSavePatient }) {
  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState({
    firstName: '',
    paternalLastName: '',
    maternalLastName: '',
    gender: 'Masculino', // <-- 'Masculino' | 'Femenino'
    email: '',
    age: '',
    occupation: '',
    phone: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelation: '',

    // Paso 2: Antecedentes
    motivo: '',
    previousTherapy: 'No',
    medication: 'Ninguna',
    sleepPattern: 'Normal',

    // Paso 3: Impresión Diagnóstica
    initialHypothesis: '',
    therapeuticGoals: '',
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFinish = (e) => {
    e.preventDefault();
    if (!formData.firstName.trim() || !formData.paternalLastName.trim()) {
      alert('Por favor ingresa al menos el Nombre y Apellido Paterno.');
      return;
    }

    const fullName = `${formData.firstName.trim()} ${formData.paternalLastName.trim()} ${formData.maternalLastName.trim()}`.trim();

    onSavePatient({
      id: Date.now(),
      firstName: formData.firstName.trim(),
      paternalLastName: formData.paternalLastName.trim(),
      maternalLastName: formData.maternalLastName.trim(),
      name: fullName,
      gender: formData.gender, // <-- Guardado oficial
      email: formData.email.trim().toLowerCase() || `${formData.firstName.toLowerCase()}@correo.com`,
      age: formData.age || '25',
      occupation: formData.occupation || 'No especificada',
      phone: formData.phone || 'Sin registrar',
      status: 'active',
      emergencyContact: {
        name: formData.emergencyContactName || 'No asignado',
        phone: formData.emergencyContactPhone || 'Sin teléfono',
        relation: formData.emergencyContactRelation || 'Familiar'
      },
      motivo: formData.motivo || 'Primera consulta diagnóstica',
      previousTherapy: formData.previousTherapy,
      medication: formData.medication,
      sleepPattern: formData.sleepPattern,
      initialHypothesis: formData.initialHypothesis || 'En evaluación',
      therapeuticGoals: formData.therapeuticGoals || 'Estabilización emocional y rapport',
      clinicalNotes: [
        {
          date: 'Sesión de Admisión (Hoy)',
          text: `Apertura de expediente clínico formal. Paciente ${formData.gender === 'Masculino' ? 'masculino' : 'femenino'}. ${formData.initialHypothesis ? 'Impresión inicial: ' + formData.initialHypothesis : 'Acude a primera entrevista diagnóstica.'}`
        }
      ]
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-md z-50 flex items-center justify-center p-3 animate-fadeIn select-none">
      <div className="w-full max-w-md bg-white rounded-[32px] flex flex-col max-h-[92vh] shadow-2xl border border-stone-200 overflow-hidden">
        
        {/* Cabecera */}
        <div className="p-5 border-b border-stone-100 flex justify-between items-center bg-stone-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 flex items-center justify-center text-[#436146]">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Historia Clínica NOM-004</span>
              <h3 className="text-sm font-semibold text-stone-800">Apertura de Expediente</h3>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-500 text-xs transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Indicador de Pasos */}
        <div className="flex border-b border-stone-100 bg-stone-50/40 text-[11px] font-medium px-4 py-2 justify-between">
          <span className={currentStep === 1 ? 'text-[#436146] font-semibold' : 'text-stone-400'}>
            1. Datos, Sexo & SOS
          </span>
          <span className={currentStep === 2 ? 'text-[#436146] font-semibold' : 'text-stone-400'}>
            2. Motivo & Salud
          </span>
          <span className={currentStep === 3 ? 'text-[#436146] font-semibold' : 'text-stone-400'}>
            3. Diagnóstico & Metas
          </span>
        </div>

        {/* Formulario */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1 text-xs">
          
          {/* PASO 1: IDENTIFICACIÓN, SEXO OBLIGATORIO Y CONTACTO SOS */}
          {currentStep === 1 && (
            <div className="space-y-3.5 animate-fadeIn">
              <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block">
                Ficha de Identificación del Paciente
              </span>

              {/* Nombre(s) */}
              <div>
                <label className="font-semibold text-stone-700 block mb-1">Nombre(s) *</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ej: Adrián" 
                  value={formData.firstName}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 focus:outline-none focus:ring-2 focus:ring-[#436146] text-stone-800 font-medium"
                />
              </div>

              {/* Apellidos */}
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Apellido Paterno *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Ej: Valle" 
                    value={formData.paternalLastName}
                    onChange={(e) => handleChange('paternalLastName', e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 focus:outline-none focus:ring-2 focus:ring-[#436146] text-stone-800"
                  />
                </div>
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Apellido Materno</label>
                  <input 
                    type="text" 
                    placeholder="Ej: Arreola" 
                    value={formData.maternalLastName}
                    onChange={(e) => handleChange('maternalLastName', e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 focus:outline-none focus:ring-2 focus:ring-[#436146] text-stone-800"
                  />
                </div>
              </div>

              {/* SELECTOR DE SEXO OBLIGATORIO (Para el reporte y pronombres) */}
              <div>
                <label className="font-semibold text-stone-700 block mb-1">Sexo del Paciente (Para gramática clínica):</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleChange('gender', 'Masculino')}
                    className={`py-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      formData.gender === 'Masculino'
                        ? 'bg-[#253827] text-white border-[#253827] shadow-xs'
                        : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    <span>♂ Masculino (El paciente)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleChange('gender', 'Femenino')}
                    className={`py-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      formData.gender === 'Femenino'
                        ? 'bg-[#253827] text-white border-[#253827] shadow-xs'
                        : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    <span>♀ Femenino (La paciente)</span>
                  </button>
                </div>
              </div>

              {/* Teléfono y Correo */}
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Teléfono (WhatsApp)</label>
                  <input 
                    type="tel" 
                    placeholder="Ej: 55 1234 5678" 
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-800 text-xs focus:outline-none focus:ring-2 focus:ring-[#436146]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-stone-700 block mb-1 flex items-center gap-1">
                    <Mail className="w-3 h-3 text-emerald-700" /> Correo
                  </label>
                  <input 
                    type="email" 
                    required
                    placeholder="paciente@correo.com" 
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-800 text-xs focus:outline-none focus:ring-2 focus:ring-[#436146]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Edad</label>
                  <input 
                    type="number" 
                    placeholder="Ej: 34" 
                    value={formData.age}
                    onChange={(e) => handleChange('age', e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 focus:outline-none focus:ring-2 focus:ring-[#436146] text-stone-800"
                  />
                </div>
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Ocupación</label>
                  <input 
                    type="text" 
                    placeholder="Ej: Ingeniero / Docente" 
                    value={formData.occupation}
                    onChange={(e) => handleChange('occupation', e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 focus:outline-none focus:ring-2 focus:ring-[#436146] text-stone-800"
                  />
                </div>
              </div>

              {/* Contacto de Emergencia NOM-004 */}
              <div className="bg-rose-50/70 p-3.5 rounded-2xl border border-rose-200/80 space-y-2.5 mt-2">
                <div className="flex items-center gap-1.5 text-rose-800 font-semibold text-[11px]">
                  <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                  <span>Contacto de Emergencia Obligatorio</span>
                </div>
                
                <div>
                  <label className="text-[10px] font-semibold text-stone-600 block mb-0.5">Nombre del Contacto:</label>
                  <input 
                    type="text" 
                    placeholder="Ej: Laura Valle" 
                    value={formData.emergencyContactName}
                    onChange={(e) => handleChange('emergencyContactName', e.target.value)}
                    className="w-full p-2 rounded-xl border border-stone-200 bg-white text-stone-800 text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-semibold text-stone-600 block mb-0.5">Parentesco:</label>
                    <input 
                      type="text" 
                      placeholder="Ej: Esposa / Madre" 
                      value={formData.emergencyContactRelation}
                      onChange={(e) => handleChange('emergencyContactRelation', e.target.value)}
                      className="w-full p-2 rounded-xl border border-stone-200 bg-white text-stone-800 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-stone-600 block mb-0.5">Teléfono SOS:</label>
                    <input 
                      type="tel" 
                      placeholder="Ej: 55 9876 5432" 
                      value={formData.emergencyContactPhone}
                      onChange={(e) => handleChange('emergencyContactPhone', e.target.value)}
                      className="w-full p-2 rounded-xl border border-stone-200 bg-white text-stone-800 text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PASO 2: MOTIVO Y ANTECEDENTES */}
          {currentStep === 2 && (
            <div className="space-y-3.5 animate-fadeIn">
              <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block">
                Motivo de Consulta y Antecedentes
              </span>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">
                  Motivo de Consulta Principal:
                </label>
                <textarea 
                  rows="3"
                  placeholder="Describe la sintomatología o detonante de consulta..."
                  value={formData.motivo}
                  onChange={(e) => handleChange('motivo', e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 focus:outline-none focus:ring-2 focus:ring-[#436146] text-stone-800 text-xs resize-none"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">¿Ha llevado psicoterapia antes?</label>
                <div className="flex gap-2">
                  {['No', 'Sí, hace meses', 'Sí, hace años'].map(opt => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => handleChange('previousTherapy', opt)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                        formData.previousTherapy === opt
                          ? 'bg-[#436146] text-white border-[#436146]'
                          : 'bg-stone-50 border-stone-200 text-stone-600'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Medicación Actual:</label>
                <input 
                  type="text" 
                  placeholder="Ej: Sertralina 50mg / Ninguna" 
                  value={formData.medication}
                  onChange={(e) => handleChange('medication', e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-800 text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Patrón de Sueño:</label>
                <input 
                  type="text" 
                  placeholder="Ej: Insomnio de conciliación / Normal" 
                  value={formData.sleepPattern}
                  onChange={(e) => handleChange('sleepPattern', e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-800 text-xs"
                />
              </div>
            </div>
          )}

          {/* PASO 3: IMPRESIÓN CLÍNICA */}
          {currentStep === 3 && (
            <div className="space-y-3.5 animate-fadeIn">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#436146] block">
                Evaluación Clínica de la Psicóloga Nayely
              </span>

              <div className="bg-emerald-50/60 p-3 rounded-2xl border border-emerald-100 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#436146] flex-shrink-0" />
                <p className="text-[11px] text-stone-600">
                  Esta información es 100% confidencial bajo secreto profesional.
                </p>
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Hipótesis Diagnóstica Inicial:</label>
                <textarea 
                  rows="3"
                  placeholder="Ej: Probable trastorno de adaptación con respuesta ansiosa..."
                  value={formData.initialHypothesis}
                  onChange={(e) => handleChange('initialHypothesis', e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 focus:outline-none focus:ring-2 focus:ring-[#436146] text-stone-800 text-xs resize-none"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Metas y Objetivos del Tratamiento:</label>
                <textarea 
                  rows="3"
                  placeholder="Ej: 1) Psicoeducación. 2) Regulación fisiológica con técnica 4-7-8..."
                  value={formData.therapeuticGoals}
                  onChange={(e) => handleChange('therapeuticGoals', e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 focus:outline-none focus:ring-2 focus:ring-[#436146] text-stone-800 text-xs resize-none"
                />
              </div>
            </div>
          )}

        </div>

        {/* Botones de Navegación */}
        <div className="p-4 border-t border-stone-100 bg-stone-50/60 flex justify-between gap-3">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={() => setCurrentStep(currentStep - 1)}
              className="px-4 py-2.5 rounded-xl border border-stone-200 bg-white text-stone-700 font-medium text-xs flex items-center gap-1 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" /> Anterior
            </button>
          ) : (
            <div />
          )}

          {currentStep < 3 ? (
            <button
              type="button"
              onClick={() => {
                if (currentStep === 1 && (!formData.firstName.trim() || !formData.paternalLastName.trim())) {
                  alert('Por favor ingresa el Nombre y Apellido Paterno');
                  return;
                }
                setCurrentStep(currentStep + 1);
              }}
              className="px-5 py-2.5 rounded-xl bg-[#436146] hover:bg-[#253827] text-white font-medium text-xs flex items-center gap-1 transition-all cursor-pointer"
            >
              Siguiente <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" /> Abrir Expediente
            </button>
          )}
        </div>

      </div>
    </div>
  );
}