import { Activity, Users, DollarSign, FlaskConical } from 'lucide-react';

interface MetricsProps {
  totalPatients: number;
  totalRevenue: number;
  pendingLabs: number;
  completedVisits: number;
}

export function SummaryMetricsFlat({ totalPatients, totalRevenue, pendingLabs, completedVisits }: MetricsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white p-5 rounded-sm border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Total Intake</span>
          <h3 className="text-2xl font-bold text-slate-800 font-sans tracking-tight">{totalPatients} Patients</h3>
        </div>
        <div className="w-10 h-10 rounded-sm bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
          <Users className="w-5 h-5" />
        </div>
      </div>

      <div className="bg-white p-5 rounded-sm border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Revenue Ledger</span>
          <h3 className="text-2xl font-bold text-blue-600 font-sans tracking-tight">${totalRevenue.toFixed(2)}</h3>
        </div>
        <div className="w-10 h-10 rounded-sm bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
          <DollarSign className="w-5 h-5" />
        </div>
      </div>

      <div className="bg-white p-5 rounded-sm border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Pending Lab Work</span>
          <h3 className="text-2xl font-bold text-orange-500 font-sans tracking-tight">{pendingLabs} Tests</h3>
        </div>
        <div className="w-10 h-10 rounded-sm bg-orange-50 text-orange-600 flex items-center justify-center border border-orange-100">
          <FlaskConical className="w-5 h-5" />
        </div>
      </div>

      <div className="bg-white p-5 rounded-sm border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Completed Cases</span>
          <h3 className="text-2xl font-bold text-slate-800 font-sans tracking-tight">{completedVisits} Runs</h3>
        </div>
        <div className="w-10 h-10 rounded-sm bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
          <Activity className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}
