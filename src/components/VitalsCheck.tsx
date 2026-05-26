import React, { useState, useId } from 'react';
import { HeartPulse, Check, UserPlus } from 'lucide-react';
import { Visit, VitalSigns } from '../types';

interface VitalsCheckProps {
  pendingVisits: Visit[];
  onRecordVitals: (visitId: number, vitals: Omit<VitalSigns, 'id' | 'visit_id'>) => void;
}

export function VitalsCheck({ pendingVisits, onRecordVitals }: VitalsCheckProps) {
  const [selectedVisitId, setSelectedVisitId] = useState<number | null>(null);
  const [bpSystolic, setBpSystolic] = useState('120');
  const [bpDiastolic, setBpDiastolic] = useState('80');
  const [heartRate, setHeartRate] = useState('72');
  const [temperature, setTemperature] = useState('98.6'); // Fahrenheit or Celsius
  const [respRate, setRespRate] = useState('16');
  const [spo2, setSpo2] = useState('98');
  const [weight, setWeight] = useState('70'); // kg
  const [height, setHeight] = useState('175'); // cm
  const [validationError, setValidationError] = useState('');

  const selectedVisit = pendingVisits.find(v => v.id === selectedVisitId);

  const bpSysInputId = useId();
  const bpDiaInputId = useId();
  const hrInputId = useId();
  const tempInputId = useId();
  const respInputId = useId();
  const spo2InputId = useId();
  const weightInputId = useId();
  const heightInputId = useId();

  const handleSelectPatient = (visitId: number) => {
    setSelectedVisitId(visitId);
    setValidationError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVisitId) return;

    // Standard ranges validations
    const sys = parseInt(bpSystolic);
    const dia = parseInt(bpDiastolic);
    const hr = parseInt(heartRate);
    const temp = parseFloat(temperature);
    const resp = parseInt(respRate);
    const pulse2 = parseInt(spo2);
    const wt = parseFloat(weight);
    const ht = parseFloat(height);

    if (isNaN(sys) || sys < 50 || sys > 250) return setValidationError('Systolic BP looks invalid.');
    if (isNaN(dia) || dia < 30 || dia > 150) return setValidationError('Diastolic BP looks invalid.');
    if (isNaN(hr) || hr < 20 || hr > 220) return setValidationError('Heart Rate looks invalid.');
    if (isNaN(temp) || temp < 94 || temp > 108) return setValidationError('Body Temperature looks invalid.');
    if (isNaN(resp) || resp < 5 || resp > 60) return setValidationError('Respiratory Rate looks invalid.');
    if (isNaN(pulse2) || pulse2 < 50 || pulse2 > 100) return setValidationError('SpO2 level must be between 50 and 100%.');
    if (isNaN(wt) || wt <= 0) return setValidationError('Weight must be positive.');
    if (isNaN(ht) || ht <= 0) return setValidationError('Height must be positive.');

    onRecordVitals(selectedVisitId, {
      bp_systolic: sys,
      bp_diastolic: dia,
      heart_rate: hr,
      temperature: temp,
      resp_rate: resp,
      spo2: pulse2,
      weight: wt,
      height: ht
    });

    // Reset State
    setSelectedVisitId(null);
    setBpSystolic('120');
    setBpDiastolic('80');
    setHeartRate('72');
    setTemperature('98.6');
    setRespRate('16');
    setSpo2('98');
    setWeight('70');
    setHeight('175');
    setValidationError('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="bg-white rounded-sm border border-slate-200 shadow-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-sm bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
            <HeartPulse className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide">Vitals Queue</h3>
            <p className="text-slate-400 text-xs text-[11px]">Select walk-ins to record health parameters</p>
          </div>
        </div>

        <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
          {pendingVisits.length === 0 ? (
            <div className="text-center py-12">
              <UserPlus className="w-12 h-12 text-slate-200 mx-auto mb-3" />
              <p className="text-slate-400 text-xs">No pending walk-in registrations.</p>
            </div>
          ) : (
            pendingVisits.map((visit) => (
              <button
                key={visit.id}
                onClick={() => handleSelectPatient(visit.id)}
                className={`w-full text-left p-3.5 rounded-sm border transition-all flex justify-between items-center cursor-pointer ${
                  selectedVisitId === visit.id
                    ? 'border-blue-500 bg-blue-50/20 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div>
                  <h4 className="text-xs font-bold text-slate-800">{visit.patient?.name}</h4>
                  <div className="mt-1 flex items-center gap-2 text-[10px] text-slate-400">
                    <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded-sm border border-slate-200/50 text-slate-500">{visit.patient?.op_number}</span>
                    <span>Age: {visit.patient?.age}</span>
                  </div>
                </div>
                <span className="text-[9px] bg-amber-50 text-amber-700 border border-amber-200 px-1.5 py-0.5 rounded-sm font-bold uppercase tracking-wider">
                  Awaiting Vitals
                </span>
              </button>
            ))
          )}
        </div>
      </div>

      <div className="lg:col-span-2 bg-white rounded-sm border border-slate-200 shadow-sm p-6">
        {selectedVisit ? (
          <div>
            <div className="flex justify-between items-start border-b border-slate-200 pb-4 mb-4">
              <div>
                <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wide">Record Parameters: {selectedVisit.patient?.name}</h3>
                <p className="text-slate-440 text-[11px] mt-0.5">OP Card: <span className="font-mono font-bold">{selectedVisit.patient?.op_number}</span> &middot; Gender: {selectedVisit.patient?.gender}</p>
              </div>
              <span className="p-1 px-2.5 text-[9px] bg-blue-50 text-blue-700 border border-blue-200 rounded-sm font-bold uppercase tracking-wider">Intake Stage</span>
            </div>

            {validationError && (
              <div className="p-3 mb-4 text-xs font-bold text-red-700 bg-red-50 border border-red-200 rounded-sm">
                ⚠️ {validationError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label htmlFor={bpSysInputId} className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wide">BP (Systolic)</label>
                  <div className="relative">
                    <input
                      id={bpSysInputId}
                      type="number"
                      value={bpSystolic}
                      onChange={(e) => setBpSystolic(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-sm bg-slate-50 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                      required
                    />
                    <span className="absolute right-3 top-2.5 text-[10px] text-slate-400 font-bold">mmHg</span>
                  </div>
                </div>

                <div>
                  <label htmlFor={bpDiaInputId} className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wide">BP (Diastolic)</label>
                  <div className="relative">
                    <input
                      id={bpDiaInputId}
                      type="number"
                      value={bpDiastolic}
                      onChange={(e) => setBpDiastolic(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-sm bg-slate-50 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                      required
                    />
                    <span className="absolute right-3 top-2.5 text-[10px] text-slate-400 font-bold">mmHg</span>
                  </div>
                </div>

                <div>
                  <label htmlFor={hrInputId} className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wide">Heart Rate</label>
                  <div className="relative">
                    <input
                      id={hrInputId}
                      type="number"
                      value={heartRate}
                      onChange={(e) => setHeartRate(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-sm bg-slate-50 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                      required
                    />
                    <span className="absolute right-3 top-2.5 text-[10px] text-slate-400 font-bold">bpm</span>
                  </div>
                </div>

                <div>
                  <label htmlFor={tempInputId} className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wide">Temperature</label>
                  <div className="relative">
                    <input
                      id={tempInputId}
                      type="number"
                      step="0.1"
                      value={temperature}
                      onChange={(e) => setTemperature(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-sm bg-slate-50 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                      required
                    />
                    <span className="absolute right-3 top-2.5 text-[10px] text-slate-400 font-bold">°F</span>
                  </div>
                </div>

                <div>
                  <label htmlFor={respInputId} className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wide">Resp. Rate</label>
                  <div className="relative">
                    <input
                      id={respInputId}
                      type="number"
                      value={respRate}
                      onChange={(e) => setRespRate(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-sm bg-slate-50 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                      required
                    />
                    <span className="absolute right-3 top-2.5 text-[10px] text-slate-400 font-bold">/min</span>
                  </div>
                </div>

                <div>
                  <label htmlFor={spo2InputId} className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wide">SpO₂</label>
                  <div className="relative">
                    <input
                      id={spo2InputId}
                      type="number"
                      value={spo2}
                      onChange={(e) => setSpo2(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-sm bg-slate-50 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                      required
                    />
                    <span className="absolute right-3 top-2.5 text-[10px] text-slate-400 font-bold">%</span>
                  </div>
                </div>

                <div>
                  <label htmlFor={weightInputId} className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wide">Weight</label>
                  <div className="relative">
                    <input
                      id={weightInputId}
                      type="number"
                      step="0.1"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-sm bg-slate-50 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                      required
                    />
                    <span className="absolute right-3 top-2.5 text-[10px] text-slate-400 font-bold">kg</span>
                  </div>
                </div>

                <div>
                  <label htmlFor={heightInputId} className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wide">Height</label>
                  <div className="relative">
                    <input
                      id={heightInputId}
                      type="number"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-sm bg-slate-50 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                      required
                    />
                    <span className="absolute right-3 top-2.5 text-[10px] text-slate-400 font-bold">cm</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-200">
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-bold text-white bg-blue-600 rounded-sm hover:bg-blue-700 shadow-sm cursor-pointer flex items-center gap-2 uppercase tracking-wide transition-all"
                >
                  <Check className="w-4 h-4" /> Finalize Vitals & Forward to Doctor
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-slate-50/50 rounded-sm border border-dashed border-slate-200">
            <HeartPulse className="w-16 h-16 text-slate-350 stroke-1 mb-4 animate-pulse" />
            <h4 className="font-bold text-slate-600 text-sm uppercase tracking-wider">No Active Patient Profile</h4>
            <p className="text-slate-400 text-xs text-center mt-1 max-w-sm leading-normal">Please select a patient from the left column queue to key in physiological parameters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
