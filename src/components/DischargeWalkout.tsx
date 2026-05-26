import { useState, useRef } from 'react';
import { Sparkles, Printer, ClipboardCheck, ArrowRight, ShieldCheck, HeartPulse, Stethoscope, FlaskConical, CircleAlert } from 'lucide-react';
import { Visit } from '../types';

interface DischargeWalkoutProps {
  completedVisits: Visit[];
}

export function DischargeWalkout({ completedVisits }: DischargeWalkoutProps) {
  const [selectedVisitId, setSelectedVisitId] = useState<number | null>(null);
  const printRef = useRef<HTMLDivElement>(null);

  const selectedVisit = completedVisits.find(v => v.id === selectedVisitId);

  const handlePrint = () => {
    const printContent = printRef.current?.innerHTML;
    const originalContent = document.body.innerHTML;

    if (printContent) {
      // Temporary window printing override
      const printWindow = window.open('', '', 'height=600,width=800');
      if (printWindow) {
        printWindow.document.write('<html><head><title>Hospital Case Discharge Summary</title>');
        printWindow.document.write('<style>body { font-family: sans-serif; padding: 20px; color: #333; } h2, h3 { color: #0d6efd; } .section { margin-bottom: 20px; border-bottom: 1px solid #eee; padding-bottom: 15px; } .grid { display: grid; grid-template-cols: repeat(2, 1fr); gap: 10px; } .font-mono { font-family: monospace; }</style>');
        printWindow.document.write('</head><body>');
        printWindow.document.write(printContent);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.print();
        printWindow.close();
      }
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="bg-white rounded-sm border border-slate-200 shadow-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-sm bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
            <ClipboardCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide">Discharged Patient Files</h3>
            <p className="text-slate-400 text-xs text-[11px]">Access case details and checkout records</p>
          </div>
        </div>

        <div className="space-y-2 max-h-[440px] overflow-y-auto pr-1">
          {completedVisits.length === 0 ? (
            <div className="text-center py-12 bg-slate-50/50 rounded-sm border border-dashed border-slate-200">
              <CircleAlert className="w-12 h-12 text-slate-350 mx-auto mb-3" />
              <p className="text-slate-400 text-xs">No discharged patient files are available.</p>
            </div>
          ) : (
            completedVisits.map((visit) => (
              <button
                key={visit.id}
                onClick={() => setSelectedVisitId(visit.id)}
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
                    <span>Discharged</span>
                  </div>
                </div>
                <div className="p-1 text-slate-400 hover:text-blue-600">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      <div className="lg:col-span-2 bg-white rounded-sm border border-slate-200 shadow-sm p-6 flex flex-col justify-between">
        {selectedVisit ? (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-slate-200 pb-4">
              <div>
                <span className="text-[9px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-sm uppercase tracking-wider mb-1 inline-block">Closed Case File</span>
                <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide">Case File: {selectedVisit.patient?.name}</h3>
                <p className="text-slate-400 text-xs mt-0.5">Discharged Clinical outcome sheet & receipt logs</p>
              </div>

              <button
                onClick={handlePrint}
                className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 border border-slate-200 rounded-sm hover:bg-slate-200 cursor-pointer flex items-center gap-2 uppercase tracking-wide transition-all"
              >
                <Printer className="w-4 h-4" /> Print Custom Summary Slip
              </button>
            </div>

            {/* Print Area */}
            <div ref={printRef} className="p-6 bg-slate-50 border border-slate-200 rounded-sm space-y-6 text-slate-700 text-xs">
              <div className="flex justify-between items-start border-b border-dashed border-slate-300 pb-4">
                <div>
                  <h2 className="text-xs font-black text-blue-800 font-sans tracking-wide uppercase">CAREPORT HOSPITAL SUMMARY</h2>
                  <p className="text-[9px] text-slate-400 font-mono mt-0.5">GENERATED SECURE ID: OUT-FILE-X22394</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-800 text-xs uppercase">CarePort Global Clinic Ltd.</p>
                  <p className="text-[9px] text-slate-400 uppercase tracking-widest">Houston Health District, TX</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-blue-600" /> Patient Demographics</h3>
                  <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-[11px] font-medium">
                    <span className="text-slate-400">Name:</span>
                    <span className="font-bold text-slate-800">{selectedVisit.patient?.name}</span>
                    <span className="text-slate-400">OP Card:</span>
                    <span className="font-mono font-bold text-blue-700">{selectedVisit.patient?.op_number}</span>
                    <span className="text-slate-400">Age / Gender:</span>
                    <span>{selectedVisit.patient?.age} yrs / {selectedVisit.patient?.gender}</span>
                    <span className="text-slate-400">Contact #:</span>
                    <span>{selectedVisit.patient?.contact}</span>
                    <span className="text-slate-400">Address:</span>
                    <span>{selectedVisit.patient?.address}</span>
                  </div>
                </div>

                {selectedVisit.vitals && (
                  <div className="space-y-1.5">
                    <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5"><HeartPulse className="w-3.5 h-3.5 text-blue-600" /> Physiological Vitals Readings</h3>
                    <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-[11px] font-mono">
                      <span className="text-slate-400">Blood Pressure:</span>
                      <span className="font-bold">{selectedVisit.vitals.bp_systolic}/{selectedVisit.vitals.bp_diastolic} mmHg</span>
                      <span className="text-slate-400">Heart Pulse:</span>
                      <span>{selectedVisit.vitals.heart_rate} bpm</span>
                      <span className="text-slate-400">Phys Temperature:</span>
                      <span>{selectedVisit.vitals.temperature}°F</span>
                      <span className="text-slate-400">Oxygen SpO₂:</span>
                      <span>{selectedVisit.vitals.spo2}%</span>
                      <span className="text-slate-400">Height / Weight:</span>
                      <span>{selectedVisit.vitals.height} cm / {selectedVisit.vitals.weight} kg</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2 border-t border-dashed border-slate-200 pt-4">
                <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5"><Stethoscope className="w-3.5 h-3.5 text-blue-600" /> Clinical Diagnosis Summary</h3>
                <div className="bg-white p-3.5 rounded-sm border border-slate-200 flex flex-col md:flex-row justify-between gap-4">
                  <div>
                    <p className="font-bold text-slate-800 text-xs">Primary Assessment: {selectedVisit.diagnosis}</p>
                    <p className="text-slate-500 text-[11px] mt-1.5 italic font-medium leading-relaxed font-sans">Clinical Notes: "{selectedVisit.notes}"</p>
                  </div>
                </div>
              </div>

              {selectedVisit.prescriptions.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Prescribed Pharmacy Medications (Rx)</h3>
                  <div className="bg-white rounded-sm border border-slate-200 overflow-hidden">
                    <table className="w-full text-left text-[11px] divide-y divide-slate-200">
                      <thead className="bg-slate-50 font-bold text-slate-500">
                        <tr>
                          <th className="px-3 py-2">Formula / Drug Name</th>
                          <th className="px-3 py-2">Dosage</th>
                          <th className="px-3 py-2">Frequency</th>
                          <th className="px-3 py-2">Duration</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-150 text-slate-650 font-medium">
                        {selectedVisit.prescriptions.map((p, idx) => (
                          <tr key={idx}>
                            <td className="px-3 py-2 font-bold text-slate-800">{p.drug_name}</td>
                            <td className="px-3 py-2 font-mono">{p.dosage}</td>
                            <td className="px-3 py-2">{p.frequency}</td>
                            <td className="px-3 py-2 font-semibold text-slate-600">{p.duration}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {selectedVisit.labRequests.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5"><FlaskConical className="w-3.5 h-3.5 text-blue-600" /> Diagnostics Laboratory Findings</h3>
                  <div className="bg-white rounded-sm border border-slate-200 overflow-hidden divide-y divide-slate-150 p-3.5 text-[11px] space-y-2 font-mono text-slate-600">
                    {selectedVisit.labRequests.map((req, idx) => (
                      <div key={idx} className="flex justify-between items-start pt-2 first:pt-0">
                        <div>
                          <p className="font-bold text-slate-850 font-sans">{req.test_name}</p>
                          <p className="text-[9px] text-slate-400 mt-0.5 uppercase tracking-wide font-sans font-bold">Diagnostics Officer Assigned</p>
                        </div>
                        <div className="text-right">
                          <span className="text-blue-800 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-sm font-bold uppercase text-[9px] tracking-wide font-sans">{req.result_text || 'Standard Range (Healthy)'}</span>
                          {req.report_file && <span className="block text-[9px] text-slate-400 mt-1 underline">File: {req.report_file}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedVisit.billing && (
                <div className="border-t border-dashed border-slate-200 pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="text-[11px] text-slate-400 flex flex-col justify-end font-semibold">
                    <p>Processed Payment: <strong className="text-slate-700 uppercase">{selectedVisit.billing.payment_method}</strong></p>
                    <p>Settlement Date: {new Date(selectedVisit.billing.payment_date || '').toLocaleDateString('en-US')}</p>
                  </div>
                  <div className="bg-white rounded-sm border border-slate-200 p-3.5 text-right text-xs space-y-1 font-semibold">
                    <div className="flex justify-between text-slate-500">
                      <span>Raw Gross Bill:</span>
                      <span className="font-mono text-slate-800">${selectedVisit.billing.total_amount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-blue-700">
                      <span>Insurance Deduction:</span>
                      <span className="font-mono">-${selectedVisit.billing.insurance_deduction.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm font-black text-blue-700 pt-1.5 border-t border-slate-200">
                      <span>Paid Balance:</span>
                      <span className="font-mono">${selectedVisit.billing.final_amount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-slate-50/50 rounded-sm border border-dashed border-slate-200 my-auto">
            <ClipboardCheck className="w-16 h-16 text-slate-350 stroke-1 mb-4 animate-pulse" />
            <h4 className="font-bold text-slate-600 text-sm uppercase tracking-wider">Discharged Patient File Workspace</h4>
            <p className="text-slate-400 text-xs text-center mt-1 max-w-sm leading-normal">Access printable medical histories and payments invoice logs by choosing a patient from the discharged list.</p>
          </div>
        )}
      </div>
    </div>
  );
}
