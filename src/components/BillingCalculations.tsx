import React, { useState, useId } from 'react';
import { Receipt, Check, CreditCard, DollarSign } from 'lucide-react';
import { Visit, MasterItem, Billing } from '../types';

interface BillingCalculationsProps {
  visits: Visit[];
  labTests: MasterItem[];
  pharmacyDrugs: MasterItem[];
  onProcessInvoice: (visitId: number, billing: Billing) => void;
}

export function BillingCalculations({ visits, labTests, pharmacyDrugs, onProcessInvoice }: BillingCalculationsProps) {
  const [selectedVisitId, setSelectedVisitId] = useState<number | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'Card' | 'Insurance Claim'>('Cash');
  const [customDeduction, setCustomDeduction] = useState<string>('');

  const selectedVisit = visits.find(v => v.id === selectedVisitId);

  const customDeductionInputId = useId();
  const paymentMethodInputId = useId();

  // Helper values checking
  const consultFee = 50.00;
  
  const calculateFees = () => {
    if (!selectedVisit) return { totalLabs: 0, totalRx: 0, rawTotal: 0, insuranceDeduction: 0, finalCost: 0 };
    
    // Sum labs
    let totalLabs = 0;
    selectedVisit.labRequests.forEach(req => {
      const match = labTests.find(t => t.name === req.test_name);
      if (match) totalLabs += match.price;
    });

    // Sum rx
    let totalRx = 0;
    selectedVisit.prescriptions.forEach(p => {
      const match = pharmacyDrugs.find(d => d.name === p.drug_name);
      if (match) totalRx += match.price;
    });

    const rawTotal = consultFee + totalLabs + totalRx;

    // Apply insurance reduction
    let insuranceDeduction = 0;
    if (selectedVisit.patient?.insurance_provider) {
      if (customDeduction !== '') {
        insuranceDeduction = parseFloat(customDeduction) || 0;
      } else {
        // Default co-pay reduction of 80% for insured patients
        insuranceDeduction = rawTotal * 0.8;
      }
    }

    const finalCost = Math.max(0, rawTotal - insuranceDeduction);

    return { totalLabs, totalRx, rawTotal, insuranceDeduction, finalCost };
  };

  const { totalLabs, totalRx, rawTotal, insuranceDeduction, finalCost } = calculateFees();

  const handleSelectVisit = (visitId: number) => {
    setSelectedVisitId(visitId);
    setCustomDeduction('');
    setPaymentMethod('Cash');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVisitId || !selectedVisit) return;

    onProcessInvoice(selectedVisitId, {
      id: Math.floor(1000 + Math.random() * 9000),
      visit_id: selectedVisitId,
      total_amount: rawTotal,
      insurance_deduction: insuranceDeduction,
      final_amount: finalCost,
      payment_method: paymentMethod,
      payment_date: new Date().toISOString()
    });

    setSelectedVisitId(null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="bg-white rounded-sm border border-slate-200 shadow-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-sm bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
            <Receipt className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide">Discharge Invoices</h3>
            <p className="text-slate-400 text-xs text-[11px]">Awaiting client ledger co-pay settlements</p>
          </div>
        </div>

        <div className="space-y-2 max-h-[440px] overflow-y-auto pr-1">
          {visits.length === 0 ? (
            <div className="text-center py-12">
              <CreditCard className="w-12 h-12 text-slate-200 mx-auto mb-3" />
              <p className="text-slate-400 text-xs">No pending billing profiles.</p>
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
                    <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded-sm border border-slate-200/50 text-slate-500">{visit.patient?.op_number}</span>
                    <span>Labs: {visit.labRequests.length} &middot; Prescriptions: {visit.prescriptions.length}</span>
                  </div>
                </div>
                <span className="text-[9px] bg-red-50 text-red-700 border border-red-200 px-1.5 py-0.5 rounded-sm font-bold uppercase tracking-wider">
                  Awaiting Pay
                </span>
              </button>
            ))
          )}
        </div>
      </div>

      <div className="lg:col-span-2 bg-white rounded-sm border border-slate-200 shadow-sm p-6">
        {selectedVisit ? (
          <div>
            <div className="border-b border-slate-200 pb-4 mb-4">
              <span className="text-[9px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-sm uppercase tracking-wider mb-1 inline-block">Accounts Ledger</span>
              <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide">{selectedVisit.patient?.name}</h3>
              <p className="text-slate-400 text-xs mt-0.5">Insurance provider: <span className="font-bold text-slate-700">{selectedVisit.patient?.insurance_provider || 'Self Pay'}</span> {selectedVisit.patient?.insurance_policy && `(Policy: ${selectedVisit.patient?.insurance_policy})`}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="bg-slate-50 rounded-sm border border-slate-200 p-4 space-y-3.5">
                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Session Charge Summary</h4>
                
                <div className="space-y-2 divide-y divide-slate-100 text-xs">
                  <div className="flex justify-between py-1.5">
                    <span className="text-slate-600 font-semibold">Primary Physician Consultation Fee</span>
                    <span className="font-mono font-bold text-slate-800">${consultFee.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between py-1.5">
                    <span className="text-slate-600 font-semibold">Lab Diagnostic Tests Fee ({selectedVisit.labRequests.length} tests)</span>
                    <div className="text-right">
                      <span className="font-mono block font-bold text-slate-800">${totalLabs.toFixed(2)}</span>
                      {selectedVisit.labRequests.map((l, i) => (
                        <span key={i} className="text-[10px] text-slate-400 block font-sans font-medium">{l.test_name}</span>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between py-1.5">
                    <span className="text-slate-600 font-semibold">Pharmacy Prescriptions Charge ({selectedVisit.prescriptions.length} drugs)</span>
                    <div className="text-right">
                      <span className="font-mono block font-bold text-slate-800">${totalRx.toFixed(2)}</span>
                      {selectedVisit.prescriptions.map((p, i) => (
                        <span key={i} className="text-[10px] text-slate-400 block font-sans font-medium">{p.drug_name} ({p.dosage})</span>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between py-2 text-sm font-bold border-t border-dashed border-slate-200">
                    <span className="text-slate-800">Gross Bill Amount</span>
                    <span className="font-mono font-bold text-slate-900">${rawTotal.toFixed(2)}</span>
                  </div>

                  {selectedVisit.patient?.insurance_provider ? (
                    <div className="flex justify-between py-2 text-xs text-blue-700 font-bold bg-blue-50 border border-blue-100 px-2.5 rounded-sm uppercase tracking-wide">
                      <span>Insurance Reduced Benefit (BlueCross 80%)</span>
                      <span className="font-mono">-${insuranceDeduction.toFixed(2)}</span>
                    </div>
                  ) : (
                    <div className="py-2 px-2.5 text-[10px] text-amber-900 uppercase tracking-wide font-bold bg-amber-50 border border-amber-100 rounded-sm">
                      No insurance recorded for this patient. This is an out-of-pocket self pay transaction.
                    </div>
                  )}

                  <div className="flex justify-between py-3 text-lg font-black text-blue-700 border-t border-slate-200">
                    <span>Final Outstanding Balance</span>
                    <span className="font-mono">${finalCost.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor={paymentMethodInputId} className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Set Payment Method</label>
                  <select
                    id={paymentMethodInputId}
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-sm bg-slate-50 font-medium"
                  >
                    <option value="Cash">Cash Payments</option>
                    <option value="Card">Visa/Master Debit Card</option>
                    <option value="Insurance Claim">Direct Insurance Billing</option>
                  </select>
                </div>

                <div>
                  <label htmlFor={customDeductionInputId} className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Edit Insurance Deduction ($)</label>
                  <input
                    id={customDeductionInputId}
                    type="number"
                    value={customDeduction}
                    onChange={(e) => setCustomDeduction(e.target.value)}
                    placeholder={selectedVisit.patient?.insurance_provider ? `Default: $${(rawTotal * 0.8).toFixed(2)}` : 'N/A - Self Pay'}
                    disabled={!selectedVisit.patient?.insurance_provider}
                    className="w-full px-4 py-2 text-sm border border-slate-200 rounded-sm bg-slate-50 font-medium focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-sm shadow-sm cursor-pointer flex items-center gap-2 uppercase tracking-wide transition-all"
                >
                  <DollarSign className="w-4 h-4" /> Process Payment & Authorize Walk-out
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-slate-50/50 rounded-sm border border-dashed border-slate-200">
            <Receipt className="w-16 h-16 text-slate-350 stroke-1 mb-4 animate-pulse" />
            <h4 className="font-bold text-slate-600 text-sm uppercase tracking-wider">Billing Ledger Off-line</h4>
            <p className="text-slate-400 text-xs text-center mt-1 max-w-sm leading-normal">Load accounting files by choosing any pending card from the discharge invoices queue.</p>
          </div>
        )}
      </div>
    </div>
  );
}
