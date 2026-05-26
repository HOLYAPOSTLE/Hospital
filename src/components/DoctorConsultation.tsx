import React, { useState, useId } from 'react';
import { Stethoscope, Check, Plus, Trash2, ListFilter } from 'lucide-react';
import { Visit, Prescription, MasterItem } from '../types';

interface DoctorConsultationProps {
  visits: Visit[];
  labTests: MasterItem[];
  pharmacyDrugs: MasterItem[];
  onFinishConsult: (
    visitId: number,
    diagnosis: string,
    notes: string,
    tests: string[],
    prescriptions: Omit<Prescription, 'id' | 'visit_id'>[]
  ) => void;
}

export function DoctorConsultation({ visits, labTests, pharmacyDrugs, onFinishConsult }: DoctorConsultationProps) {
  const [selectedVisitId, setSelectedVisitId] = useState<number | null>(null);
  const [diagnosis, setDiagnosis] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedTests, setSelectedTests] = useState<string[]>([]);
  
  // Dynamic prescriptions builder list
  const [prescriptions, setPrescriptions] = useState<Omit<Prescription, 'id' | 'visit_id'>[]>([
    { drug_name: '', dosage: '500mg', frequency: 'Once Daily (1-0-0)', duration: '5 days' }
  ]);

  const [validationError, setValidationError] = useState('');

  const selectedVisit = visits.find(v => v.id === selectedVisitId);

  const diagnosisInputId = useId();
  const notesInputId = useId();

  const handleSelectVisit = (visitId: number) => {
    setSelectedVisitId(visitId);
    setValidationError('');
    setDiagnosis('');
    setNotes('');
    setSelectedTests([]);
    setPrescriptions([{ drug_name: '', dosage: '500mg', frequency: 'Once Daily (1-0-0)', duration: '5 days' }]);
  };

  const handleAddDrugRow = () => {
    setPrescriptions([...prescriptions, { drug_name: '', dosage: '500mg', frequency: 'Once Daily (1-0-0)', duration: '5 days' }]);
  };

  const handleRemoveDrugRow = (index: number) => {
    setPrescriptions(prescriptions.filter((_, i) => i !== index));
  };

  const handleUpdateDrug = (index: number, key: keyof Omit<Prescription, 'id' | 'visit_id'>, value: string) => {
    const updated = prescriptions.map((item, i) => {
      if (i === index) {
        return { ...item, [key]: value };
      }
      return item;
    });
    setPrescriptions(updated);
  };

  const handleToggleTest = (testName: string) => {
    if (selectedTests.includes(testName)) {
      setSelectedTests(selectedTests.filter(t => t !== testName));
    } else {
      setSelectedTests([...selectedTests, testName]);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVisitId) return;

    if (!diagnosis.trim()) return setValidationError('Diagnosis is required.');
    if (!notes.trim()) return setValidationError('Clinical consultation notes are required.');

    // Filter empty prescriptions
    const validRx = prescriptions.filter(p => p.drug_name.trim() !== '');

    onFinishConsult(selectedVisitId, diagnosis.trim(), notes.trim(), selectedTests, validRx);

    // Reset View
    setSelectedVisitId(null);
    setValidationError('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="bg-white rounded-sm border border-slate-200 shadow-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-sm bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide">Consultation Desk</h3>
            <p className="text-slate-400 text-xs text-[11px]">Awaiting therapeutic diagnosis sessions</p>
          </div>
        </div>

        <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
          {visits.length === 0 ? (
            <div className="text-center py-12">
              <ListFilter className="w-12 h-12 text-slate-200 mx-auto mb-3" />
              <p className="text-slate-400 text-xs">No active clients awaiting consults.</p>
            </div>
          ) : (
            visits.map((visit) => (
              <button
                key={visit.id}
                onClick={() => handleSelectVisit(visit.id)}
                className={`w-full text-left p-3.5 rounded-sm border transition-all flex justify-between items-center cursor-pointer ${
                  selectedVisitId === visit.id
                    ? 'border-blue-500 bg-blue-50/20 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div>
                  <h4 className="text-xs font-bold text-slate-800">{visit.patient?.name}</h4>
                  <div className="mt-1 flex items-center gap-2 text-[10px] text-slate-400">
                    <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded-sm border border-slate-200/55 text-slate-500">{visit.patient?.op_number}</span>
                    <span>Age: {visit.patient?.age}</span>
                  </div>
                </div>
                <span className="text-[9px] bg-blue-50 text-blue-700 border border-blue-200 px-1.5 py-0.5 rounded-sm font-bold uppercase tracking-wider">
                  Pending Consult
                </span>
              </button>
            ))
          )}
        </div>
      </div>

      <div className="lg:col-span-2 bg-white rounded-sm border border-slate-200 shadow-sm p-6">
        {selectedVisit ? (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-b border-slate-200 pb-4 mb-4">
              <div className="md:col-span-2">
                <span className="text-[9px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-sm uppercase tracking-wider mb-1 inline-block">Interactive session</span>
                <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide">{selectedVisit.patient?.name}</h3>
                <p className="text-slate-400 text-xs mt-0.5">Contact: {selectedVisit.patient?.contact} &middot; Insurance: {selectedVisit.patient?.insurance_provider || 'Private Pay'}</p>
              </div>

              {selectedVisit.vitals && (
                <div className="bg-slate-50 p-3 rounded-sm text-xs space-y-1 border border-slate-250/60">
                  <span className="font-bold text-slate-500 block mb-1 uppercase tracking-wider text-[9px]">Patient Vitals (Logged)</span>
                  <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 font-mono text-[10px] text-slate-600">
                    <span>BP: {selectedVisit.vitals.bp_systolic}/{selectedVisit.vitals.bp_diastolic}</span>
                    <span>HR: {selectedVisit.vitals.heart_rate} bpm</span>
                    <span>Temp: {selectedVisit.vitals.temperature}°F</span>
                    <span>SpO₂: {selectedVisit.vitals.spo2}%</span>
                    <span>Ht: {selectedVisit.vitals.height} cm</span>
                    <span>Wt: {selectedVisit.vitals.weight} kg</span>
                  </div>
                </div>
              )}
            </div>

            {validationError && (
              <div className="p-3 mb-4 text-xs font-bold text-red-700 bg-red-50 border border-red-200 rounded-sm">
                ⚠️ {validationError}
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor={diagnosisInputId} className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Diagnosis Heading</label>
                  <input
                    id={diagnosisInputId}
                    type="text"
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                    placeholder="Acute Bronchitis (J20.9)"
                    className="w-full px-4 py-2 text-sm border border-slate-200 rounded-sm bg-slate-50 focus:outline-hidden focus:ring-1 focus:ring-blue-500 transition-all font-medium"
                    required
                  />
                </div>

                <div>
                  <label htmlFor={notesInputId} className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Clinical Assessment / Notes</label>
                  <input
                    id={notesInputId}
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Wheezes present, prescribe hydration and inhalers..."
                    className="w-full px-4 py-2 text-sm border border-slate-200 rounded-sm bg-slate-50 focus:outline-hidden focus:ring-1 focus:ring-blue-500 transition-all font-medium"
                    required
                  />
                </div>
              </div>

              <div>
                <span className="block text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-wide">Request Diagnostics / Laboratory Tests</span>
                <div className="flex flex-wrap gap-2">
                  {labTests.map(test => (
                    <button
                      key={test.id}
                      type="button"
                      onClick={() => handleToggleTest(test.name)}
                      className={`px-3 py-1.5 rounded-sm text-xs font-semibold border cursor-pointer transition-all ${
                        selectedTests.includes(test.name)
                          ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-xs'
                          : 'border-slate-200 text-slate-600 bg-white hover:border-slate-300'
                      }`}
                    >
                      {test.name} (${test.price})
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide">Write Medical Prescription (Rx)</span>
                  <button
                    type="button"
                    onClick={handleAddDrugRow}
                    className="px-2 py-1 text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 rounded-sm hover:bg-blue-100 cursor-pointer flex items-center gap-1 transition-all uppercase tracking-wide"
                  >
                    <Plus className="w-3.5 h-3.5" /> Append Drug Row
                  </button>
                </div>

                <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
                  {prescriptions.map((p, index) => (
                    <div key={index} className="flex gap-2 items-center bg-slate-50 p-2 rounded-sm border border-slate-200">
                      <select
                        value={p.drug_name}
                        onChange={(e) => handleUpdateDrug(index, 'drug_name', e.target.value)}
                        className="flex-1 px-2 py-1.5 text-xs border border-slate-200 rounded-sm bg-white focus:outline-hidden font-medium"
                      >
                        <option value="">-- Choose Drug --</option>
                        {pharmacyDrugs.map(drug => (
                          <option key={drug.id} value={drug.name}>
                            {drug.name} (${drug.price})
                          </option>
                        ))}
                      </select>

                      <input
                        type="text"
                        placeholder="e.g. 500mg"
                        value={p.dosage}
                        onChange={(e) => handleUpdateDrug(index, 'dosage', e.target.value)}
                        className="w-20 px-2 py-1.5 text-xs border border-slate-200 rounded-sm bg-white font-medium"
                      />

                      <select
                        value={p.frequency}
                        onChange={(e) => handleUpdateDrug(index, 'frequency', e.target.value)}
                        className="w-40 px-2 py-1.5 text-xs border border-slate-200 rounded-sm bg-white font-medium"
                      >
                        <option value="Once Daily (1-0-0)">Once Daily (1-0-0)</option>
                        <option value="Twice Daily (1-0-1)">Twice Daily (1-0-1)</option>
                        <option value="Three Times (1-1-1)">Three Times (1-1-1)</option>
                        <option value="Every 4 Hours">Every 4 Hours</option>
                        <option value="As Needed (PRN)">As Needed (PRN)</option>
                      </select>

                      <input
                        type="text"
                        placeholder="e.g. 5 days"
                        value={p.duration}
                        onChange={(e) => handleUpdateDrug(index, 'duration', e.target.value)}
                        className="w-20 px-2 py-1.5 text-xs border border-slate-200 rounded-sm bg-white font-medium"
                      />

                      {prescriptions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveDrugRow(index)}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-sm cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-200">
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-sm shadow-sm cursor-pointer flex items-center gap-2 transition-all uppercase tracking-wide"
                >
                  <Check className="w-4 h-4" /> Complete Consult & Save records
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-slate-50/50 rounded-sm border border-dashed border-slate-200">
            <Stethoscope className="w-16 h-16 text-slate-350 stroke-1 mb-4 animate-pulse" />
            <h4 className="font-bold text-slate-600 text-sm uppercase tracking-wider">Clinical Desktop Inactive</h4>
            <p className="text-slate-400 text-xs text-center mt-1 max-w-sm leading-normal">Assign consultation logs by selecting a patient awaiting examination from the left pane queue.</p>
          </div>
        )}
      </div>
    </div>
  );
}
