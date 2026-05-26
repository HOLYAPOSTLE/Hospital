import React, { useState, useId } from 'react';
import { UserPlus, Sparkles, ClipboardList } from 'lucide-react';
import { Patient, Visit, User } from '../types';

interface PatientRegistrationProps {
  doctors: User[];
  onRegister: (patient: Omit<Patient, 'id' | 'created_at'>, doctorId: number) => void;
  recentVisits: Visit[];
}

export function PatientRegistration({ doctors, onRegister, recentVisits }: PatientRegistrationProps) {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [contact, setContact] = useState('');
  const [address, setAddress] = useState('');
  const [insuranceProvider, setInsuranceProvider] = useState('');
  const [insurancePolicy, setInsurancePolicy] = useState('');
  const [doctorId, setDoctorId] = useState(doctors[0]?.id || 0);
  const [validationError, setValidationError] = useState('');

  const nameInputId = useId();
  const ageInputId = useId();
  const genderInputId = useId();
  const contactInputId = useId();
  const providerInputId = useId();
  const policyInputId = useId();
  const doctorInputId = useId();
  const addressInputId = useId();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!name.trim()) return setValidationError('Patient Name feels empty.');
    if (!age || parseInt(age) <= 0) return setValidationError('Please provide a valid numeric age.');
    if (!contact.trim()) return setValidationError('Please configure a phone contact.');
    if (!address.trim()) return setValidationError('Residential address is mandatory.');
    if (!doctorId) return setValidationError('Please assign a doctor.');

    onRegister({
      op_number: `OP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      name: name.trim(),
      age: parseInt(age),
      gender,
      contact: contact.trim(),
      address: address.trim(),
      insurance_provider: insuranceProvider.trim() || undefined,
      insurance_policy: insurancePolicy.trim() || undefined,
    }, doctorId);

    // Reset fields
    setName('');
    setAge('');
    setGender('Male');
    setContact('');
    setAddress('');
    setInsuranceProvider('');
    setInsurancePolicy('');
    if (doctors[0]) setDoctorId(doctors[0].id);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-white rounded-sm border border-slate-200 shadow-sm p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-sm bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
            <UserPlus className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide">New Patient Intake Form</h3>
            <p className="text-slate-400 text-xs text-[11px]">Standard intake registration with token creation</p>
          </div>
        </div>

        {validationError && (
          <div className="p-3 mb-4 text-xs font-semibold text-red-700 bg-red-50 border border-red-200 rounded-sm">
            ⚠️ {validationError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor={nameInputId} className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Patient Full Name</label>
              <input
                id={nameInputId}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Johnathan Doe"
                className="w-full px-4 py-2 text-sm border border-slate-200 rounded-sm bg-slate-50 focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor={ageInputId} className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Age</label>
                <input
                  id={ageInputId}
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="34"
                  className="w-full px-4 py-2 text-sm border border-slate-200 rounded-sm bg-slate-50 focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium"
                  required
                />
              </div>

              <div>
                <label htmlFor={genderInputId} className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Gender</label>
                <select
                  id={genderInputId}
                  value={gender}
                  onChange={(e) => setGender(e.target.value as any)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-sm bg-slate-50 focus:outline-hidden focus:ring-1 focus:ring-blue-500 cursor-pointer font-medium"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor={contactInputId} className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Phone Number</label>
              <input
                id={contactInputId}
                type="tel"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="+1 (555) 019-2834"
                className="w-full px-4 py-2 text-sm border border-slate-200 rounded-sm bg-slate-50 focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium"
                required
              />
            </div>

            <div>
              <label htmlFor={doctorInputId} className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Assign Doctor (On-Duty)</label>
              <select
                id={doctorInputId}
                value={doctorId}
                onChange={(e) => setDoctorId(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-sm bg-slate-50 focus:outline-hidden focus:ring-1 focus:ring-blue-500 cursor-pointer font-medium"
                required
              >
                {doctors.map(doc => (
                  <option key={doc.id} value={doc.id}>
                    {doc.name} (On Duty)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor={providerInputId} className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Insurance Provider (Optional)</label>
              <input
                id={providerInputId}
                type="text"
                value={insuranceProvider}
                onChange={(e) => setInsuranceProvider(e.target.value)}
                placeholder="BlueCross BlueShield"
                className="w-full px-4 py-2 text-sm border border-slate-200 rounded-sm bg-slate-50 focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>

            <div>
              <label htmlFor={policyInputId} className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Insurance Policy Number</label>
              <input
                id={policyInputId}
                type="text"
                value={insurancePolicy}
                onChange={(e) => setInsurancePolicy(e.target.value)}
                placeholder="TX-84930-22"
                className="w-full px-4 py-2 text-sm border border-slate-200 rounded-sm bg-slate-50 focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
                disabled={!insuranceProvider}
              />
            </div>
          </div>

          <div>
            <label htmlFor={addressInputId} className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Residential Address</label>
            <textarea
              id={addressInputId}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="128 Walnut Street, Houston, TX 77002"
              rows={2}
              className="w-full px-4 py-2 text-sm border border-slate-200 rounded-sm bg-slate-50 focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
              required
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-bold text-white bg-blue-600 rounded-sm hover:bg-blue-700 shadow-sm cursor-pointer flex items-center gap-2 transition-all uppercase tracking-wide"
            >
              <Sparkles className="w-4 h-4" /> Save Registration & Generate OP Token
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-sm border border-slate-200 shadow-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-sm bg-slate-100 text-slate-600 flex items-center justify-center border border-slate-200">
            <ClipboardList className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide">Recent Intake Queue</h3>
            <p className="text-slate-400 text-xs text-[11px]">Patients awaiting primary vitals check</p>
          </div>
        </div>

        <div className="space-y-3.5 divide-y divide-slate-100">
          {recentVisits.length === 0 ? (
            <p className="text-slate-400 text-xs text-center py-8">No current patients in queue.</p>
          ) : (
            recentVisits.map((visit) => (
              <div key={visit.id} className="pt-3.5 first:pt-0">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">{visit.patient?.name}</h4>
                    <span className="text-[9px] font-mono font-bold text-slate-500 block mt-1 bg-slate-100 px-1.5 py-0.5 rounded-sm inline-block border border-slate-200/50">{visit.patient?.op_number}</span>
                  </div>
                  <span className={`text-[9px] px-2 py-0.5 rounded-sm font-bold uppercase tracking-wide border ${
                    visit.status === 'Registered' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-blue-50 text-blue-700 border-blue-200'
                  }`}>
                    {visit.status}
                  </span>
                </div>
                <div className="mt-2 text-[10px] text-slate-400 flex flex-wrap gap-x-2">
                  <span>Age: {visit.patient?.age}</span>
                  <span>&middot;</span>
                  <span>Dr. {doctors.find(d => d.id === visit.doctor_id)?.name.replace('Dr. ', '')}</span>
                  {visit.patient?.insurance_provider && (
                    <>
                      <span>&middot;</span>
                      <span className="text-blue-600 font-bold uppercase text-[9px] tracking-wide">Insured</span>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
