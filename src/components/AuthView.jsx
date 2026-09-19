import React, { useState } from 'react';
import { ShieldCheck, ArrowRight, Phone, Lock, Heart } from 'lucide-react';

export default function AuthView({ onLoginWithPin, therapistPin = '998877' }) {
  // ESTADOS 100% VACÍOS
  const [identifier, setIdentifier] = useState('');
  const [pin, setPin] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handlePinChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Solo dígitos
    if (value.length <= 6) {
      setPin(value);
      setErrorMessage('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setErrorMessage('Por favor ingresa tu número de teléfono o usuario.');
      return;
    }
    if (pin.length !== 6) {
      setErrorMessage('El PIN de seguridad debe tener exactamente 6 dígitos.');
      return;
    }

    const success = onLoginWithPin(identifier.trim(), pin);
    if (!success) {
      setErrorMessage('Teléfono o PIN incorrecto. Verifica tus datos con la Psic. Nayely.');
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] flex justify-center items-center p-6 selection:bg-emerald-100 select-none">
      <div className="w-full max-w-sm bg-white rounded-[40px] p-8 shadow-2xl border border-stone-200/80 flex flex-col items-center text-center space-y-6 animate-fadeIn">
        
        {/* Distintivo de Marca */}
        <div className="space-y-2">
          <div className="w-14 h-14 rounded-3xl bg-gradient-to-br from-[#436146] to-[#253827] text-white flex items-center justify-center text-xl font-semibold shadow-md mx-auto">
            NY
          </div>
          <div>
            <span className="text-[10px] font-bold tracking-widest uppercase text-[#436146] bg-emerald-50 border border-emerald-200/60 px-3 py-0.5 rounded-full inline-flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-700" /> Espacio Clínico Privado
            </span>
            <h1 className="text-xl font-light text-stone-800 mt-2">
              Psic. <span className="font-semibold text-stone-900">Nayely</span>
            </h1>
            <p className="text-xs text-stone-400 mt-0.5">Ingreso con PIN de Seguridad</p>
          </div>
        </div>

        {/* Formulario con bloqueo de autocompletado */}
        <form onSubmit={handleSubmit} autoComplete="off" className="w-full space-y-4 text-xs">
          
          {/* Teléfono o Usuario */}
          <div className="space-y-1.5 text-left">
            <label className="font-semibold text-stone-700 block text-[11px] uppercase tracking-wider">
              Tu Teléfono o Usuario:
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input 
                type="text"
                name="clinical_user_id"
                autoComplete="off"
                required
                placeholder="Ej: 55 1234 5678"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-2xl border border-stone-200 bg-stone-50/50 text-stone-800 text-xs focus:outline-none focus:ring-2 focus:ring-[#436146] transition-all"
              />
            </div>
          </div>

          {/* PIN de 6 Dígitos */}
          <div className="space-y-2 text-left">
            <div className="flex justify-between items-center text-[11px]">
              <label className="font-semibold text-stone-700 uppercase tracking-wider">
                PIN de 6 dígitos:
              </label>
              <span className="text-stone-400 text-[10px]">
                {pin.length} de 6 números
              </span>
            </div>

            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input 
                type="text"
                name="clinical_pin_code"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                required
                placeholder="••••••"
                value={pin}
                onChange={handlePinChange}
                style={{ WebkitTextSecurity: 'disc' }}
                className="w-full pl-10 pr-4 py-3 rounded-2xl border border-stone-200 bg-stone-50/50 text-stone-800 text-center tracking-[0.6em] font-mono text-base font-bold focus:outline-none focus:ring-2 focus:ring-[#436146] transition-all"
              />
            </div>

            {/* Visualizador de Casillas (Solo se llenan conforme tecleas) */}
            <div className="flex justify-between gap-1.5 pt-1">
              {[0, 1, 2, 3, 4, 5].map((idx) => (
                <div 
                  key={idx}
                  className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                    idx < pin.length ? 'bg-[#436146]' : 'bg-stone-200/80'
                  }`}
                />
              ))}
            </div>
          </div>

          {errorMessage && (
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-[11px] text-left leading-relaxed animate-fadeIn">
              {errorMessage}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3.5 bg-[#436146] hover:bg-[#253827] text-white rounded-2xl font-medium text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer pt-3"
          >
            <span>Ingresar a mi Espacio Seguro</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-2 border-t border-stone-100 flex items-center justify-center gap-1.5 text-[10px] text-stone-400 font-light">
          <Heart className="w-3 h-3 text-rose-400" />
          <span>Acceso cifrado y protegido</span>
        </div>

      </div>
    </div>
  );
}