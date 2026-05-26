import React, { useState, useId } from 'react';
import { 
  Calendar, ShieldAlert, BadgeInfo, Download, FileSpreadsheet, 
  Search, Users, UserPlus, Trash2, Edit2, Shield, Plus, X, Check, Save 
} from 'lucide-react';
import { Visit, UserActivityLog, User } from '../types';

interface AdminAuditsProps {
  visits: Visit[];
  logs: UserActivityLog[];
  onDownloadCodebaseZip: () => void;
  users: User[];
  onAddUser: (user: Omit<User, 'id'>) => void;
  onUpdateUser: (user: User) => void;
  onDeleteUser: (userId: number) => void;
}

const AVAILABLE_ROLES = [
  { id: 1, name: 'IT Admin' },
  { id: 2, name: 'Doctor' },
  { id: 3, name: 'Nurse/Assistant' },
  { id: 4, name: 'Lab Technician' },
  { id: 5, name: 'Receptionist' },
  { id: 6, name: 'Billing Staff' }
];

export function AdminAudits({ 
  visits, 
  logs, 
  onDownloadCodebaseZip,
  users,
  onAddUser,
  onUpdateUser,
  onDeleteUser
}: AdminAuditsProps) {
  const [activeSegment, setActiveSegment] = useState<'trends' | 'staff' | 'security'>('trends');
  const [dateRange, setDateRange] = useState<'Daily' | 'Weekly' | 'Monthly'>('Weekly');
  const [searchQuery, setSearchQuery] = useState('');
  const [staffSearchQuery, setStaffSearchQuery] = useState('');

  // Local state for CRUD forms
  const [showStaffForm, setShowStaffForm] = useState(false);
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formRoleId, setFormRoleId] = useState<number>(2); // Default to Doctor
  const [isEditing, setIsEditing] = useState(false);
  const [targetUserId, setTargetUserId] = useState<number | null>(null);
  const [formError, setFormError] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const startDateInputId = useId();
  const endDateInputId = useId();

  // Simple static diagnoses counts for pie chart simulation
  const diagnosesStats = {
    'Acute Bronchitis': 4,
    'Hypertension': 3,
    'Diabetes Mellitus': 2,
    'Asthma Exacerbation': 1,
    'Dehydration': 1
  };

  const totalDiagnoses = Object.values(diagnosesStats).reduce((a, b) => a + b, 0);

  // Filtered visits for summary ledger
  const filteredVisits = visits.filter(visit => {
    if (!searchQuery) return true;
    const patientName = visit.patient?.name?.toLowerCase() || '';
    const opNumber = visit.patient?.op_number?.toLowerCase() || '';
    const diag = visit.diagnosis?.toLowerCase() || '';
    return patientName.includes(searchQuery.toLowerCase()) || 
           opNumber.includes(searchQuery.toLowerCase()) || 
           diag.includes(searchQuery.toLowerCase());
  });

  const exportCSV = () => {
    // Basic CSV compiler
    const headers = ['OP Number', 'Patient Name', 'Visit Date', 'Current Status', 'Diagnosis', 'Bill Paid ($)'];
    const rows = visits.map(v => [
      v.patient?.op_number || '',
      v.patient?.name || '',
      new Date(v.visit_date).toLocaleDateString(),
      v.status,
      v.diagnosis || 'Pending Assessment',
      v.billing?.final_amount ? v.billing.final_amount.toFixed(2) : '0.00'
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.map(val => `"${val}"`).join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `careport_hms_ledger_${dateRange.toLowerCase()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Helper to resolve passkey details for visual guidance
  const getPassphraseHint = (email: string) => {
    const prefix = email.split('@')[0];
    if (prefix.includes('admin')) return 'admin';
    if (prefix.includes('doctor')) return 'doctor';
    if (prefix.includes('nurse')) return 'nurse';
    if (prefix.includes('lab')) return 'lab';
    if (prefix.includes('reception')) return 'reception';
    if (prefix.includes('billing')) return 'billing';
    return 'password';
  };

  const handleOpenAddForm = () => {
    setFormName('');
    setFormEmail('');
    setFormRoleId(2); // default Doctor
    setIsEditing(false);
    setTargetUserId(null);
    setFormError('');
    setShowStaffForm(true);
  };

  const handleOpenEditForm = (user: User) => {
    setFormName(user.name);
    setFormEmail(user.email);
    setFormRoleId(user.role_id);
    setIsEditing(true);
    setTargetUserId(user.id);
    setFormError('');
    setShowStaffForm(true);
  };

  const handleCloseForm = () => {
    setShowStaffForm(false);
    setFormError('');
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!formName.trim()) {
      setFormError('Staff Display Name cannot be blank.');
      return;
    }

    if (!formEmail.trim() || !formEmail.includes('@')) {
      setFormError('Please input a valid hospital email address.');
      return;
    }

    const selectedRole = AVAILABLE_ROLES.find(r => r.id === formRoleId);
    if (!selectedRole) {
      setFormError('Please assign a valid clinical role type.');
      return;
    }

    if (isEditing && targetUserId !== null) {
      onUpdateUser({
        id: targetUserId,
        name: formName.trim(),
        email: formEmail.trim().toLowerCase(),
        role_id: selectedRole.id,
        role_name: selectedRole.name
      });
    } else {
      // Check for duplicated emails
      const exists = users.find(u => u.email.toLowerCase() === formEmail.trim().toLowerCase());
      if (exists) {
        setFormError('This email is already registered to another staff member profile.');
        return;
      }

      onAddUser({
        name: formName.trim(),
        email: formEmail.trim().toLowerCase(),
        role_id: selectedRole.id,
        role_name: selectedRole.name
      });
    }

    setShowStaffForm(false);
  };

  const getRoleHexColor = (roleName: string) => {
    switch (roleName) {
      case 'IT Admin':
        return 'bg-slate-900 border-slate-300 text-white';
      case 'Doctor':
        return 'bg-teal-50 border-teal-200 text-teal-700';
      case 'Nurse/Assistant':
        return 'bg-pink-50 border-pink-200 text-pink-700';
      case 'Lab Technician':
        return 'bg-amber-50 border-amber-200 text-amber-700';
      case 'Receptionist':
        return 'bg-blue-50 border-blue-200 text-blue-700';
      case 'Billing Staff':
        return 'bg-emerald-50 border-emerald-200 text-emerald-700';
      default:
        return 'bg-slate-50 border-slate-200 text-slate-700';
    }
  };

  // Filter staff
  const filteredStaff = users.filter(user => {
    if (!staffSearchQuery) return true;
    const nameMatch = user.name.toLowerCase().includes(staffSearchQuery.toLowerCase());
    const emailMatch = user.email.toLowerCase().includes(staffSearchQuery.toLowerCase());
    const roleMatch = user.role_name.toLowerCase().includes(staffSearchQuery.toLowerCase());
    return nameMatch || emailMatch || roleMatch;
  });

  return (
    <div className="space-y-6">
      {/* Segmented Controller Interface for Clinical IT */}
      <div className="bg-white rounded-sm border border-slate-200 shadow-xs p-3 flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
        <div className="flex border-b border-transparent gap-1 select-none flex-wrap">
          <button
            onClick={() => setActiveSegment('trends')}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-sm transition-all cursor-pointer flex items-center gap-2 ${
              activeSegment === 'trends'
                ? 'bg-blue-650 text-white shadow-xs font-black'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" /> Operations & Trends
          </button>
          
          <button
            onClick={() => setActiveSegment('staff')}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-sm transition-all cursor-pointer flex items-center gap-2 ${
              activeSegment === 'staff'
                ? 'bg-blue-650 text-white shadow-xs font-black'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
            }`}
          >
            <Users className="w-4 h-4" /> Staff Access Directory ({users.length})
          </button>

          <button
            onClick={() => setActiveSegment('security')}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-sm transition-all cursor-pointer flex items-center gap-2 ${
              activeSegment === 'security'
                ? 'bg-blue-650 text-white shadow-xs font-black'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
            }`}
          >
            <ShieldAlert className="w-4 h-4" /> IT System Audit Logs ({logs.length})
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onDownloadCodebaseZip}
            className="w-full md:w-auto px-4 py-2 text-xs font-extrabold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200/60 rounded-sm flex items-center gap-1.5 justify-center uppercase tracking-wider transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" /> Download PHP Code Base
          </button>
        </div>
      </div>

      {/* SEGMENT 1: OPERATIONS TRENDS & GENERAL LEDGER */}
      {activeSegment === 'trends' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Dynamic Graphic Logs */}
            <div className="lg:col-span-2 bg-white rounded-sm border border-slate-200 p-6 flex flex-col justify-between shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-slate-850 text-sm uppercase tracking-wide">Daily Admissions Trends</h3>
                  <p className="text-slate-400 text-[11px]">Dynamic patient intake indexes ({dateRange} frame)</p>
                </div>
                <span className="text-[9px] bg-blue-50 text-blue-800 border border-blue-200 font-bold px-2.5 py-0.5 rounded-sm uppercase tracking-wider">Intake volume</span>
              </div>

              <div className="h-60 mt-4 flex items-end justify-between px-4 pb-2 border-b border-slate-200">
                {[
                  { label: 'Mon', count: 4 },
                  { label: 'Tue', count: 8 },
                  { label: 'Wed', count: 6 },
                  { label: 'Thu', count: 9 },
                  { label: 'Fri', count: 12 },
                  { label: 'Sat', count: 3 },
                  { label: 'Sun', count: 2 }
                ].map((day, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-2 flex-1 group">
                    <span className="text-[10px] font-mono text-slate-400 font-bold group-hover:text-blue-700 transition-colors">{day.count}</span>
                    <div 
                      style={{ height: `${(day.count / 14) * 160}px` }} 
                      className="w-8 max-w-full rounded-t-sm bg-blue-600/20 group-hover:bg-blue-600 transition-all duration-300 relative shadow-sm border border-slate-200/50"
                    >
                      <div className="absolute inset-x-0 top-0 h-1 bg-blue-600 rounded-sm" />
                    </div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">{day.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Diagnosis stats pie widget */}
            <div className="bg-white rounded-sm border border-slate-200 p-6 shadow-sm">
              <div className="mb-4">
                <h3 className="font-bold text-slate-850 text-sm uppercase tracking-wide">Case Diagnosis Shares</h3>
                <p className="text-slate-400 text-[11px]">Primary active assessments in records</p>
              </div>

              <div className="space-y-3 mt-4">
                {Object.entries(diagnosesStats).map(([name, count], idx) => {
                  const widthPerc = (count / totalDiagnoses) * 100;
                  const barColors = ['bg-blue-600', 'bg-blue-800', 'bg-slate-705', 'bg-slate-400', 'bg-sky-450'];
                  return (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-700">{name}</span>
                        <span className="text-slate-400 font-mono font-bold">{count} cases ({widthPerc.toFixed(0)}%)</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-sm overflow-hidden border border-slate-200/30">
                        <div 
                          style={{ width: `${widthPerc}%` }} 
                          className={`h-full ${barColors[idx % barColors.length]} rounded-sm`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Structured Ledger Tables & Filters */}
          <div className="bg-white rounded-sm border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Admissions Ledger</h3>
                <p className="text-slate-400 text-xs text-[11px]">Consolidated financial and clinical listings index</p>
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                <div className="relative w-full md:w-72">
                  <span className="absolute left-3 top-2.5 text-slate-400">
                    <Search className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    placeholder="Filter ledger index..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-1.5 text-xs border border-slate-200 rounded-sm focus:outline-hidden focus:ring-1 focus:ring-blue-500 font-bold tracking-tight uppercase"
                  />
                </div>

                <button
                  onClick={exportCSV}
                  className="px-3.5 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-sm text-xs font-bold text-slate-700 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" /> Export (CSV)
                </button>
              </div>
            </div>

            <div className="overflow-x-auto rounded-sm border border-slate-200">
              <table className="w-full text-left text-xs divide-y divide-slate-200">
                <thead className="bg-slate-50 font-bold text-slate-500">
                  <tr>
                    <th className="px-4 py-2.5 uppercase tracking-wider text-[10px]">OP Number</th>
                    <th className="px-4 py-2.5 uppercase tracking-wider text-[10px]">Patient Family Name</th>
                    <th className="px-4 py-2.5 uppercase tracking-wider text-[10px]">Date Checked In</th>
                    <th className="px-4 py-2.5 uppercase tracking-wider text-[10px]">Administrative Status</th>
                    <th className="px-4 py-2.5 uppercase tracking-wider text-[10px]">Diagnosis</th>
                    <th className="px-4 py-2.5 text-right uppercase tracking-wider text-[10px]">Settled Billing ($)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-650">
                  {filteredVisits.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-10 text-slate-400 text-xs font-bold uppercase tracking-wider">
                        No active admissions matched your queries.
                      </td>
                    </tr>
                  ) : (
                    filteredVisits.map((visit) => (
                      <tr key={visit.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-4 py-2.5 font-mono font-bold text-blue-700">{visit.patient?.op_number}</td>
                        <td className="px-4 py-2.5 font-bold text-slate-800">{visit.patient?.name}</td>
                        <td className="px-4 py-2.5 font-medium text-slate-500">{new Date(visit.visit_date).toLocaleDateString()}</td>
                        <td className="px-4 py-2.5">
                          <span className={`px-2 py-0.5 rounded-sm font-bold text-[9px] uppercase tracking-wider border ${
                            visit.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                            visit.status === 'Billing' ? 'bg-red-50 text-red-750 border-red-200' :
                            visit.status === 'Lab Completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}>
                            {visit.status}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 font-medium text-slate-550 italic">
                          {visit.diagnosis || 'Pending Clinician Exam'}
                        </td>
                        <td className="px-4 py-2.5 font-mono font-bold text-right text-slate-850">
                          {visit.billing ? `$${visit.billing.final_amount.toFixed(2)}` : '$0.00'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SEGMENT 2: STAFF ACCESS DIRECTORY (FULL CRUD OVER USERS) */}
      {activeSegment === 'staff' && (
        <div className="space-y-6">
          <div className="bg-white rounded-sm border border-slate-200 shadow-sm p-6 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" /> Clinic Staff Directory Credentials Manager
                </h3>
                <p className="text-slate-405 text-xs">Register, update information levels, or revoke administrative access rights instantly.</p>
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                <div className="relative flex-1 md:flex-none">
                  <span className="absolute left-3 top-2 position-absolute text-slate-450">
                    <Search className="w-3.5 h-3.5" />
                  </span>
                  <input
                    type="text"
                    placeholder="Search staff members..."
                    value={staffSearchQuery}
                    onChange={(e) => setStaffSearchQuery(e.target.value)}
                    className="w-full md:w-56 pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-sm focus:outline-hidden focus:ring-1 focus:ring-blue-500 font-bold uppercase"
                  />
                </div>

                <button
                  onClick={handleOpenAddForm}
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-sm text-xs font-bold cursor-pointer flex items-center justify-center gap-1.5 transition-all shadow-xs uppercase tracking-wide border border-blue-500"
                >
                  <UserPlus className="w-4 h-4" /> Add Staff Profile
                </button>
              </div>
            </div>

            {/* In-Line Expandable CRUD Form Drawer */}
            {showStaffForm && (
              <form onSubmit={handleFormSubmit} className="p-5 bg-slate-50 border border-slate-200 rounded-sm space-y-4 animate-fade-in relative">
                <button
                  type="button"
                  onClick={handleCloseForm}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-650 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="border-b border-slate-200 pb-2">
                  <h4 className="text-xs font-bold text-slate-850 uppercase tracking-widest flex items-center gap-1.5">
                    {isEditing ? <Edit2 className="w-3.5 h-3.5 text-yellow-600" /> : <Plus className="w-3.5 h-3.5 text-blue-600" />}
                    {isEditing ? 'Modify Medical Staff Registry Profile' : 'Register New Hospital Staff Profile'}
                  </h4>
                  <p className="text-slate-400 text-[10px]">Enter current legal details. System matches authentication passkeys based on email prefix.</p>
                </div>

                {formError && (
                  <div className="p-3 text-xs font-bold text-red-700 bg-red-50 border border-red-200 rounded-sm">
                    ⚠️ {formError}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Full Legal Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dr. Beverly Crusher"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-sm bg-white focus:outline-hidden focus:ring-1 focus:ring-blue-500 font-semibold text-slate-800"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Hospital Email (Portal Login)</label>
                    <input
                      type="email"
                      required
                      disabled={isEditing}
                      placeholder="e.g. crusher.doctor@hospital.com"
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-sm bg-white focus:outline-hidden focus:ring-1 focus:ring-blue-500 font-mono disabled:opacity-50 disabled:bg-slate-100 disabled:cursor-not-allowed"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Hospital Clinical Role Group</label>
                    <select
                      value={formRoleId}
                      onChange={(e) => setFormRoleId(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-sm bg-white focus:outline-hidden focus:ring-1 focus:ring-blue-500 font-bold text-slate-705 uppercase"
                    >
                      {AVAILABLE_ROLES.map(role => (
                        <option key={role.id} value={role.id}>
                          {role.name} (Role ID {role.id})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2 text-xs font-bold">
                  <button
                    type="button"
                    onClick={handleCloseForm}
                    className="px-4 py-2 border border-slate-200 rounded-sm text-slate-500 hover:bg-slate-100 uppercase tracking-wider cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-sm flex items-center gap-1.5 uppercase tracking-wide cursor-pointer shadow-xs border border-blue-550"
                  >
                    <Save className="w-3.5 h-3.5" /> {isEditing ? 'Save Staff Changes' : 'Activate Employee Credentials'}
                  </button>
                </div>
              </form>
            )}

            <div className="overflow-x-auto rounded-sm border border-slate-200">
              <table className="w-full text-left text-xs divide-y divide-slate-200">
                <thead className="bg-slate-50 font-bold text-slate-500 select-none">
                  <tr>
                    <th className="px-4 py-2.5 uppercase tracking-wider text-[10px] text-center w-14">ID</th>
                    <th className="px-4 py-2.5 uppercase tracking-wider text-[10px]">Staff name</th>
                    <th className="px-4 py-2.5 uppercase tracking-wider text-[10px]">Clinical Role Group</th>
                    <th className="px-4 py-2.5 uppercase tracking-wider text-[10px]">Login Email Portal</th>
                    <th className="px-4 py-2.5 uppercase tracking-wider text-[10px] font-mono">Assigned Gateways passcode</th>
                    <th className="px-4 py-2.5 text-center uppercase tracking-wider text-[10px] w-36">Credentials Admin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-650">
                  {filteredStaff.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-12 text-slate-400 text-xs uppercase tracking-wider font-bold">
                        No active medical staff matched your filters.
                      </td>
                    </tr>
                  ) : (
                    filteredStaff.map((user) => (
                      <tr key={user.id} className="hover:bg-slate-50/50">
                        <td className="px-4 py-3 text-center font-mono font-bold text-slate-400 bg-slate-50/30">
                          {user.id}
                        </td>
                        <td className="px-4 py-3 font-bold text-slate-800">
                          {user.name}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2.5 py-0.5 rounded-sm font-bold text-[9px] uppercase tracking-wide border ${getRoleHexColor(user.role_name)}`}>
                            {user.role_name}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-mono text-slate-500">
                          {user.email}
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-mono text-xs bg-slate-100 hover:bg-blue-50 border border-slate-200 rounded px-2 py-0.5 font-bold text-blue-700/80 cursor-help select-all transition-colors" title="Double click or copy to paste at terminal sign-in">
                            {getPassphraseHint(user.email)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          {deleteConfirmId === user.id ? (
                            <div className="flex items-center justify-center gap-1.5 animate-shake">
                              <span className="text-[9px] text-red-650 font-extrabold uppercase tracking-wide mr-1">Sure Revoke?</span>
                              <button
                                onClick={() => {
                                  onDeleteUser(user.id);
                                  setDeleteConfirmId(null);
                                }}
                                className="p-1 px-1.5 bg-red-650 hover:bg-red-700 text-white rounded-sm text-[10px] font-bold font-sans cursor-pointer"
                              >
                                Revoke
                              </button>
                              <button
                                onClick={() => setDeleteConfirmId(null)}
                                className="p-1 px-1.5 bg-slate-200 text-slate-700 rounded-sm text-[10px] font-semibold cursor-pointer"
                              >
                                Stop
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleOpenEditForm(user)}
                                className="p-1 bg-white hover:bg-slate-55 border border-slate-200 text-slate-600 rounded-sm hover:text-slate-800 transition-all cursor-pointer inline-flex items-center gap-1 text-[10px] font-semibold hover:border-blue-200"
                                title={`Edit details for ${user.name}`}
                              >
                                <Edit2 className="w-3 h-3 text-blue-600" /> Edit
                              </button>
                              
                              <button
                                onClick={() => setDeleteConfirmId(user.id)}
                                className="p-1 bg-white hover:bg-red-50 border border-slate-200 text-red-600 rounded-sm hover:text-red-700 transition-all cursor-pointer inline-flex items-center gap-1 text-[10px] font-semibold hover:border-red-200"
                                title={`Revoke clinic console access for ${user.name}`}
                              >
                                <Trash2 className="w-3 h-3 text-red-600" /> Revoke
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SEGMENT 3: SYSTEM AUDIT & ADMISSIONS SECURITY LOGS */}
      {activeSegment === 'security' && (
        <div className="bg-white rounded-sm border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-red-650" />
            <div>
              <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide">System Security Logs</h3>
              <p className="text-slate-400 text-xs">Exhaustive IT administrator audit logs</p>
            </div>
          </div>

          <div className="overflow-x-auto rounded-sm border border-slate-200">
            <table className="w-full text-left text-[11px] divide-y divide-slate-200">
              <thead className="bg-slate-50 font-bold text-slate-500">
                <tr>
                  <th className="px-4 py-2 uppercase tracking-wider text-[9px]">ID</th>
                  <th className="px-4 py-2 uppercase tracking-wider text-[9px]">Operator</th>
                  <th className="px-4 py-2 uppercase tracking-wider text-[9px]">Security/Activity Action Description</th>
                  <th className="px-4 py-2 font-mono uppercase tracking-wider text-[9px]">Terminal Address</th>
                  <th className="px-4 py-2 uppercase tracking-wider text-[9px]">Audit Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150 text-slate-650 font-sans">
                {logs.slice().reverse().map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/50">
                    <td className="px-4 py-2 font-mono text-slate-450">{log.id}</td>
                    <td className="px-4 py-2 font-bold text-slate-800">
                      {log.user_name} <span className="text-[9px] bg-slate-100 text-slate-600 border border-slate-200 px-1 py-0.5 rounded-sm ml-1 font-bold uppercase">{log.role_name}</span>
                    </td>
                    <td className="px-4 py-2 text-slate-705 font-semibold">{log.action}</td>
                    <td className="px-4 py-2 font-mono text-slate-500">{log.ip_address}</td>
                    <td className="px-4 py-2 text-slate-500">{new Date(log.created_at).toLocaleTimeString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminAudits;
