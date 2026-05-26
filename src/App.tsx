import { useState, useTransition, useId } from 'react';
import { 
  Users, Stethoscope, HeartPulse, FlaskConical, Receipt, 
  ClipboardCheck, Code, Download, ShieldAlert, Heart, 
  CheckCircle, Search, LogOut, Lock
} from 'lucide-react';
import JSZip from 'jszip';

// Import Types and codebase helpers
import { Patient, Visit, User, MasterItem, UserActivityLog, Prescription, Billing, VitalSigns } from './types';
import { PHP_CODEBASE, SourceFile } from './phpCodebase';

// Import Sub-components
import { SummaryMetricsFlat } from './components/SummaryMetricsFlat';
import { PatientRegistration } from './components/PatientRegistration';
import { VitalsCheck } from './components/VitalsCheck';
import { DoctorConsultation } from './components/DoctorConsultation';
import { LabReportUpload } from './components/LabReportUpload';
import { BillingCalculations } from './components/BillingCalculations';
import { DischargeWalkout } from './components/DischargeWalkout';
import { AdminAudits } from './components/AdminAudits';
import { LoginScreen } from './components/LoginScreen';

// Initial Demographics and Seeding
const MOCK_DOCTORS: User[] = [
  { id: 2, name: 'Dr. Sarah Connor', email: 'sarah.doctor@hospital.com', role_id: 2, role_name: 'Doctor' },
  { id: 3, name: 'Dr. Gregory House', email: 'house.doctor@hospital.com', role_id: 2, role_name: 'Doctor' }
];

const INITIAL_USERS: User[] = [
  { id: 1, name: 'System Admin', email: 'admin@hospital.com', role_id: 1, role_name: 'IT Admin' },
  ...MOCK_DOCTORS,
  { id: 4, name: 'Nurse Joy', email: 'joy.nurse@hospital.com', role_id: 3, role_name: 'Nurse/Assistant' },
  { id: 5, name: 'Tech Peter Parker', email: 'peter.lab@hospital.com', role_id: 4, role_name: 'Lab Technician' },
  { id: 6, name: 'Receptionist Lois Lane', email: 'lois.reception@hospital.com', role_id: 5, role_name: 'Receptionist' },
  { id: 7, name: 'Billing Bruce Wayne', email: 'bruce.billing@hospital.com', role_id: 6, role_name: 'Billing Staff' }
];

const LAB_MASTER: MasterItem[] = [
  { id: 1, name: 'Complete Blood Count (CBC)', price: 45.00 },
  { id: 2, name: 'Blood Glucose / Sugar', price: 15.00 },
  { id: 3, name: 'Lipid Profile', price: 60.00 },
  { id: 4, name: 'Chest X-Ray', price: 120.00 }
];

const PHARMACY_MASTER: MasterItem[] = [
  { id: 1, name: 'Paracetamol 500mg', price: 5.00 },
  { id: 2, name: 'Amoxicillin 250mg', price: 18.20 },
  { id: 3, name: 'Ibuprofen 400mg', price: 8.50 },
  { id: 4, name: 'Omeprazole 20mg', price: 15.00 }
];

// Pre-seeding patients in various clinical stages to provide an exciting immediate sandbox experience!
const INITIAL_VISITS: Visit[] = [
  {
    id: 101,
    patient_id: 1,
    doctor_id: 2,
    visit_date: '2026-05-25T10:00:00Z',
    status: 'Registered',
    patient: {
      id: 1,
      op_number: 'OP-2026-1492',
      name: 'James T. Kirk',
      age: 42,
      gender: 'Male',
      contact: '+1 (555) 012-4433',
      address: 'Sector 4, Space Fleet HQ, Houston, TX',
      created_at: '2026-05-25T00:00:00Z'
    },
    labRequests: [],
    prescriptions: []
  },
  {
    id: 102,
    patient_id: 2,
    doctor_id: 3,
    visit_date: '2026-05-25T11:30:00Z',
    status: 'Vitals Recorded',
    patient: {
      id: 2,
      op_number: 'OP-2026-8344',
      name: 'Ellen Ripley',
      age: 36,
      gender: 'Female',
      contact: '+1 (555) 019-2184',
      address: 'Nostromo Deck A, Space Station Depot',
      insurance_provider: 'BlueCross BCBS',
      insurance_policy: 'AL-843920-SF',
      created_at: '2026-05-25T00:00:00Z'
    },
    vitals: {
      id: 1,
      visit_id: 102,
      bp_systolic: 118,
      bp_diastolic: 76,
      heart_rate: 68,
      temperature: 98.4,
      resp_rate: 14,
      spo2: 99,
      weight: 64,
      height: 172
    },
    labRequests: [],
    prescriptions: []
  },
  {
    id: 103,
    patient_id: 3,
    doctor_id: 2,
    visit_date: '2026-05-25T09:15:00Z',
    status: 'Lab Pending',
    patient: {
      id: 3,
      op_number: 'OP-2026-9023',
      name: 'Arthur Dent',
      age: 31,
      gender: 'Male',
      contact: '+1 (555) 441-2940',
      address: 'Cottington Lane, Islington, London',
      created_at: '2026-05-25T00:00:00Z'
    },
    vitals: {
      id: 2,
      visit_id: 103,
      bp_systolic: 124,
      bp_diastolic: 84,
      heart_rate: 85,
      temperature: 99.1,
      resp_rate: 18,
      spo2: 97,
      weight: 78,
      height: 181
    },
    diagnosis: 'Acute Anxiety & Vertigo',
    notes: 'Inexplicable dread of planetary destruction. Ordered sugar screenings.',
    labRequests: [
      { id: 501, visit_id: 103, test_name: 'Blood Glucose / Sugar', status: 'Pending', requested_at: '2026-05-25T09:15:00Z' }
    ],
    prescriptions: [
      { id: 801, visit_id: 103, drug_name: 'Paracetamol 500mg', dosage: '500mg', frequency: 'As Needed (PRN)', duration: '3 days' }
    ]
  },
  {
    id: 104,
    patient_id: 4,
    doctor_id: 3,
    visit_date: '2026-05-25T08:00:00Z',
    status: 'Completed',
    patient: {
      id: 4,
      op_number: 'OP-2026-7721',
      name: 'Bruce Banner',
      age: 46,
      gender: 'Male',
      contact: '+1 (555) 902-1184',
      address: 'Desert Hideout, New Mexico',
      created_at: '2026-05-25T00:00:00Z'
    },
    vitals: {
      id: 3,
      visit_id: 104,
      bp_systolic: 154,
      bp_diastolic: 98,
      heart_rate: 140, // Green levels!
      temperature: 101.2,
      resp_rate: 28,
      spo2: 94,
      weight: 120,
      height: 198
    },
    diagnosis: 'Gamma Radiation Toxicity & Mild Rosacea',
    notes: 'Anger triggers rapid physiological size scaling. Administered sedatives.',
    labRequests: [
      { id: 502, visit_id: 104, test_name: 'Complete Blood Count (CBC)', status: 'Completed', result_text: 'Extreme Gamma Spikes. Red Blood count critical.', requested_at: '2026-05-25T08:05:00Z', completed_at: '2026-05-25T08:30:00Z' }
    ],
    prescriptions: [
      { id: 802, visit_id: 104, drug_name: 'Ibuprofen 400mg', dosage: '400mg', frequency: 'Twice Daily (1-0-1)', duration: '7 days' }
    ],
    billing: {
      id: 901,
      visit_id: 104,
      total_amount: 95.00, // consult: 50 + cbc: 45
      insurance_deduction: 0,
      final_amount: 95.00,
      payment_method: 'Card',
      payment_date: '2026-05-25T08:50:00Z'
    }
  }
];

const INITIAL_LOGS: UserActivityLog[] = [
  { id: 1, user_id: 1, user_name: 'System Admin', role_name: 'IT Admin', action: 'Authorized login session established.', ip_address: '127.0.0.1', created_at: '2026-05-25T21:47:00Z' },
  { id: 2, user_id: 4, user_name: 'Nurse Joy', role_name: 'Nurse/Assistant', action: 'Vitals logged & recorded for Ellen Ripley (OP-2026-8344).', ip_address: '192.168.1.10', created_at: '2026-05-25T21:47:15Z' }
];

export default function App() {
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('careport_users');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem('careport_logged_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed;
      } catch (e) {}
    }
    return INITIAL_USERS[0]; // Default admin
  });

  const handleAddUser = (user: Omit<User, 'id'>) => {
    const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
    const newUser: User = { ...user, id: newId };
    const updated = [...users, newUser];
    setUsers(updated);
    localStorage.setItem('careport_users', JSON.stringify(updated));
    addLog(currentUser, `IT Admin registered a new staff member: "${newUser.name}" as role "${newUser.role_name}".`);
    setAlertMessage({ type: 'success', text: `Staff member "${newUser.name}" has been successfully added to the system directory.` });
  };

  const handleUpdateUser = (user: User) => {
    const updated = users.map(u => u.id === user.id ? user : u);
    setUsers(updated);
    localStorage.setItem('careport_users', JSON.stringify(updated));
    addLog(currentUser, `IT Admin updated staff details for "${user.name}" (${user.role_name}).`);
    setAlertMessage({ type: 'success', text: `Staff details for operator "${user.name}" updated successfully.` });

    // Update terminal session if updating self
    if (currentUser.id === user.id) {
      setCurrentUser(user);
      localStorage.setItem('careport_logged_user', JSON.stringify(user));
    }
  };

  const handleDeleteUser = (userId: number) => {
    const match = users.find(u => u.id === userId);
    if (!match) return;
    if (userId === currentUser.id) {
      setAlertMessage({ type: 'danger', text: "Security violation: You cannot revoke or delete your own active IT Admin credentials!" });
      return;
    }
    const updated = users.filter(u => u.id !== userId);
    setUsers(updated);
    localStorage.setItem('careport_users', JSON.stringify(updated));
    addLog(currentUser, `IT Admin revoked security access and deleted profile for staff: "${match.name}" (${match.role_name}).`);
    setAlertMessage({ type: 'success', text: `Revoked system credentials and deleted staff account for "${match.name}".` });
  };

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('careport_is_logged_in') === 'true';
  });
  const [activeTab, setActiveTab] = useState<'Admissions' | 'Intake' | 'Vitals' | 'Consult' | 'Labs' | 'Billing' | 'Discharge' | 'Explorer'>('Admissions');
  const [visits, setVisits] = useState<Visit[]>(INITIAL_VISITS);
  const [logs, setLogs] = useState<UserActivityLog[]>(INITIAL_LOGS);
  const [alertMessage, setAlertMessage] = useState<{ type: 'success' | 'danger', text: string } | null>(null);

  const [isPending, startTransition] = useTransition();

  // Codebase Explorer States
  const [selectedFile, setSelectedFile] = useState<SourceFile>(PHP_CODEBASE[0]);
  const [explorerSearch, setExplorerSearch] = useState('');

  const searchInputId = useId();

  // Unified logger helper
  const addLog = (operator: User, actionText: string) => {
    const newLog: UserActivityLog = {
      id: logs.length + 1,
      user_id: operator.id,
      user_name: operator.name,
      role_name: operator.role_name,
      action: actionText,
      ip_address: `10.0.3.${Math.floor(10 + Math.random() * 90)}`,
      created_at: new Date().toISOString()
    };
    setLogs(prev => [...prev, newLog]);
  };

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    setIsLoggedIn(true);
    localStorage.setItem('careport_is_logged_in', 'true');
    localStorage.setItem('careport_logged_user', JSON.stringify(user));
    
    const newLog: UserActivityLog = {
      id: logs.length + 1,
      user_id: user.id,
      user_name: user.name,
      role_name: user.role_name,
      action: 'Authorized login session established via secure gateway.',
      ip_address: `10.0.3.${Math.floor(10 + Math.random() * 90)}`,
      created_at: new Date().toISOString()
    };
    setLogs(prev => [...prev, newLog]);
    setAlertMessage({ type: 'success', text: `Access granted. Welcome back, ${user.name} (${user.role_name}).` });

    // Auto routing helper for user navigation ease:
    if (user.role_id === 1) setActiveTab('Admissions');
    else if (user.role_id === 2) setActiveTab('Consult');
    else if (user.role_id === 3) setActiveTab('Vitals');
    else if (user.role_id === 4) setActiveTab('Labs');
    else if (user.role_id === 5) setActiveTab('Intake');
    else if (user.role_id === 6) setActiveTab('Billing');
  };

  const handleLogout = () => {
    const newLog: UserActivityLog = {
      id: logs.length + 1,
      user_id: currentUser.id,
      user_name: currentUser.name,
      role_name: currentUser.role_name,
      action: 'Authentication session voluntarily revoked (Logged out).',
      ip_address: `10.0.3.${Math.floor(10 + Math.random() * 90)}`,
      created_at: new Date().toISOString()
    };
    setLogs(prev => [...prev, newLog]);

    setIsLoggedIn(false);
    localStorage.removeItem('careport_is_logged_in');
    localStorage.removeItem('careport_logged_user');
    setAlertMessage({ type: 'success', text: 'You have been safely signed out of the clinical terminal.' });
  };

  const handleRoleChange = (userId: number) => {
    const match = users.find(u => u.id === userId);
    if (match) {
      setCurrentUser(match);
      localStorage.setItem('careport_logged_user', JSON.stringify(match));
      addLog(match, `Operator contextual switch to Role: ${match.role_name}.`);
      setAlertMessage({ type: 'success', text: `Authorized. Signed in as ${match.name} (${match.role_name}).` });
      
      // Auto routing helper for user navigation ease:
      if (match.role_id === 1) setActiveTab('Admissions');
      else if (match.role_id === 2) setActiveTab('Consult');
      else if (match.role_id === 3) setActiveTab('Vitals');
      else if (match.role_id === 4) setActiveTab('Labs');
      else if (match.role_id === 5) setActiveTab('Intake');
      else if (match.role_id === 6) setActiveTab('Billing');
    }
  };

  // Intake Patient callback
  const handleRegisterPatient = (patient: Omit<Patient, 'id' | 'created_at'>, doctorId: number) => {
    const newPatient: Patient = {
      ...patient,
      id: visits.length + 1,
      created_at: new Date().toISOString()
    };

    const newVisit: Visit = {
      id: Math.floor(110 + Math.random() * 900),
      patient_id: newPatient.id,
      doctor_id: doctorId,
      visit_date: new Date().toISOString(),
      status: 'Registered',
      patient: newPatient,
      labRequests: [],
      prescriptions: []
    };

    setVisits(prev => [newVisit, ...prev]);
    addLog(currentUser, `Patient ${patient.name} intake registered. Generated Token: ${patient.op_number}.`);
    setAlertMessage({ type: 'success', text: `Successfully generated Admissions Token: ${patient.op_number} for ${patient.name}!` });
  };

  // Logging vitals signs callback
  const handleRecordVitals = (visitId: number, vitalParams: Omit<VitalSigns, 'id' | 'visit_id'>) => {
    setVisits(prev => prev.map(visit => {
      if (visit.id === visitId) {
        const fullVitals: VitalSigns = {
          ...vitalParams,
          id: Math.floor(1 + Math.random() * 1000),
          visit_id: visitId
        };
        return {
          ...visit,
          vitals: fullVitals,
          status: 'Vitals Recorded'
        };
      }
      return visit;
    }));

    const visitMatch = visits.find(v => v.id === visitId);
    addLog(currentUser, `Recorded vital parameters (BP: ${vitalParams.bp_systolic}/${vitalParams.bp_diastolic}, Temp: ${vitalParams.temperature}°F) for patient ${visitMatch?.patient?.name}.`);
    setAlertMessage({ type: 'success', text: `Vitals recorded! Patient redirected to Doctor Consultation queue.` });
  };

  // Clinical examinations outcomes callback
  const handleFinishConsult = (
    visitId: number,
    diagnosis: string,
    notes: string,
    tests: string[],
    prescriptions: Omit<Prescription, 'id' | 'visit_id'>[]
  ) => {
    setVisits(prev => prev.map(visit => {
      if (visit.id === visitId) {
        // Construct labs requests
        const reqs = tests.map((t, idx) => ({
          id: Math.floor(600 + idx * 5),
          visit_id: visitId,
          test_name: t,
          status: 'Pending' as const,
          requested_at: new Date().toISOString()
        }));

        // Construct prescriptions
        const rxs = prescriptions.map((p, idx) => ({
          id: Math.floor(900 + idx * 3),
          visit_id: visitId,
          ...p
        }));

        const finalStatus = tests.length > 0 ? 'Lab Pending' : 'Billing';

        return {
          ...visit,
          diagnosis,
          notes,
          labRequests: reqs,
          prescriptions: rxs,
          status: finalStatus
        };
      }
      return visit;
    }));

    const visitMatch = visits.find(v => v.id === visitId);
    const logDetails = tests.length > 0 ? `with ${tests.length} diagnostics laboratory requests.` : 'with direct billing checkout.';
    addLog(currentUser, `Diagnosis session Completed: "${diagnosis}" for ${visitMatch?.patient?.name} ${logDetails}`);
    setAlertMessage({ type: 'success', text: `Consultation finalized successfully. Records forwarded.` });
  };

  // Lab Upload results callback
  const handleUploadResult = (visitId: number, requestId: number, resultText: string, fileName?: string) => {
    setVisits(prev => prev.map(visit => {
      if (visit.id === visitId) {
        // Update specific request
        const updatedReqs = visit.labRequests.map(req => {
          if (req.id === requestId) {
            return {
              ...req,
              status: 'Completed' as const,
              result_text: resultText,
              report_file: fileName || 'lab_chart.pdf',
              completed_at: new Date().toISOString()
            };
          }
          return req;
        });

        // Check if all lab requests are completed
        const stillPending = updatedReqs.some(r => r.status === 'Pending');
        const nextStatus = stillPending ? 'Lab Pending' : 'Lab Completed';

        // Wait! If nextStatus is 'Lab Completed', auto advance to 'Billing' for ledger payment
        const finalStatus = nextStatus === 'Lab Completed' ? 'Billing' : 'Lab Pending';

        return {
          ...visit,
          labRequests: updatedReqs,
          status: finalStatus
        };
      }
      return visit;
    }));

    const visitMatch = visits.find(v => v.id === visitId);
    const reqMatch = visitMatch?.labRequests.find(r => r.id === requestId);
    addLog(currentUser, `Diagnostics test completed: ${reqMatch?.test_name} result values uploaded for patient ${visitMatch?.patient?.name}.`);
    setAlertMessage({ type: 'success', text: `Diagnostic report validated and logged successfully.` });
  };

  // Cashier invoice payment callback
  const handleProcessInvoice = (visitId: number, billing: Billing) => {
    setVisits(prev => prev.map(visit => {
      if (visit.id === visitId) {
        return {
          ...visit,
          billing,
          status: 'Completed'
        };
      }
      return visit;
    }));

    const visitMatch = visits.find(v => v.id === visitId);
    addLog(currentUser, `Settle ledger invoicing of $${billing.final_amount.toFixed(2)} via ${billing.payment_method} for patient ${visitMatch?.patient?.name}.`);
    setAlertMessage({ type: 'success', text: `Outstanding balance settled. Discharged file summary is ready for printing!` });
  };

  // Complete ZIP Download creator!
  const handleDownloadCodebaseZip = () => {
    const zip = new JSZip();
    zip.file('README.md', 'Hospital Management System codebase files...');
    
    PHP_CODEBASE.forEach(file => {
      zip.file(file.path, file.content);
    });

    zip.generateAsync({ type: 'blob' }).then((content) => {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(content);
      link.download = 'careport_hms_php_project.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setAlertMessage({ type: 'success', text: 'Downloaded CarePort HMS vanilla PHP + MySQL database project package zip!' });
    });
  };

  // Sidebar role filter visibility checks
  const canAccess = (tab: typeof activeTab) => {
    if (currentUser.role_id === 1) return true; // Administrator full access
    if (tab === 'Admissions') return false; // ONLY Admin
    if (tab === 'Explorer') return true; // Everyone can see code files

    if (currentUser.role_id === 2 && tab === 'Consult') return true;
    if (currentUser.role_id === 3 && (tab === 'Intake' || tab === 'Vitals' || tab === 'Discharge')) return true;
    if (currentUser.role_id === 4 && tab === 'Labs') return true;
    if (currentUser.role_id === 5 && (tab === 'Intake' || tab === 'Discharge')) return true;
    if (currentUser.role_id === 6 && (tab === 'Billing' || tab === 'Discharge')) return true;

    return false;
  };

  // Statistics summaries
  const totalPatients = visits.length;
  const totalRevenue = visits.reduce((acc, curr) => acc + (curr.billing?.final_amount || 0), 0);
  const pendingLabs = visits.reduce((acc, curr) => acc + curr.labRequests.filter(l => l.status === 'Pending').length, 0);
  const completedVisits = visits.filter(v => v.status === 'Completed').length;

  // Filtered Explorer List
  const filteredExplorerFiles = PHP_CODEBASE.filter(f => {
    return f.path.toLowerCase().includes(explorerSearch.toLowerCase()) || 
           f.category.toLowerCase().includes(explorerSearch.toLowerCase());
  });

  if (!isLoggedIn) {
    return <LoginScreen users={users} onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between font-sans text-slate-900">
      
      {/* Dynamic Simulation Header & Role Changer */}
      <div className="bg-slate-900 text-white px-4 md:px-6 py-3 flex flex-col lg:flex-row justify-between lg:items-center gap-4 border-b border-slate-800 shadow-sm animate-fade-in">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-sm bg-blue-600 text-white flex items-center justify-center font-bold text-md tracking-tight select-none">
            H+
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-white uppercase text-xs tracking-wider">Helix Hospital</h1>
              <span className="p-1 px-2.5 text-[9px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-sm select-none">Simulation Console</span>
            </div>
            <p className="text-slate-400 text-[11px] mt-0.5">Explore the patient digital twin with dynamic roles and production-ready PHP + MySQL codebase files.</p>
          </div>
        </div>

        {/* Mock Signin credentials selections / Switcing */}
        <div className="flex flex-wrap items-center gap-3 lg:gap-4">
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-slate-500 text-[9px] font-bold uppercase tracking-wider leading-none">Terminal Operator</span>
            <span className="text-white text-xs font-bold mt-1">{currentUser.name}</span>
          </div>

          <div className="flex items-center gap-2 bg-slate-950/40 p-1 px-2.5 rounded-sm border border-slate-800/80">
            <span className="text-slate-500 text-[9px] font-bold uppercase tracking-wider font-mono">Emulate:</span>
            <select
              value={currentUser.id}
              onChange={(e) => handleRoleChange(Number(e.target.value))}
              className="py-0.5 text-[11px] text-blue-400 bg-transparent border-0 focus:ring-0 cursor-pointer font-bold uppercase tracking-tight focus:outline-hidden"
            >
              {users.map(user => (
                <option key={user.id} value={user.id} className="bg-slate-900 text-slate-300">
                  {user.role_name} ({user.name})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleLogout}
            className="px-3 py-1.5 bg-red-600/10 hover:bg-red-650 text-red-400 hover:text-white border border-red-500/20 rounded-sm text-xs font-bold cursor-pointer flex items-center gap-1.5 uppercase tracking-wide transition-all shadow-xs"
          >
            <LogOut className="w-3.5 h-3.5" /> Sign Out
          </button>
        </div>
      </div>

      <div className="max-w-[1450px] mx-auto w-full px-4 md:px-6 py-6 flex-1 flex flex-col lg:flex-row gap-6">
        
        {/* Dynamic Sidebar menu list */}
        <div className="w-full lg:w-60 shrink-0 space-y-4">
          <div className="bg-white rounded-sm border border-slate-200 shadow-xs p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-sm bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-700 border border-slate-200">
                  {currentUser.name.charAt(0)}
                </div>
                <div className="truncate max-w-[120px]">
                  <strong className="text-xs text-slate-800 block leading-tight truncate">{currentUser.name}</strong>
                  <span className="text-[9px] text-blue-600 font-bold block bg-blue-50 px-1.5 py-0.5 rounded-sm inline-block mt-0.5 border border-blue-100 uppercase tracking-wide truncate">{currentUser.role_name}</span>
                </div>
              </div>
              <button 
                onClick={handleLogout}
                title="Sign out of system"
                className="p-1 px-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 rounded-sm cursor-pointer transition-all"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>

            <nav className="space-y-1">
              {[
                { id: 'Admissions' as const, label: 'Auditor Terminal', icon: Users },
                { id: 'Intake' as const, label: 'Patient Intake', icon: Users },
                { id: 'Vitals' as const, label: 'Vitals Record', icon: HeartPulse },
                { id: 'Consult' as const, label: 'Physician Console', icon: Stethoscope },
                { id: 'Labs' as const, label: 'Laboratory desk', icon: FlaskConical },
                { id: 'Billing' as const, label: 'Billing Desk', icon: Receipt },
                { id: 'Discharge' as const, label: 'Closed Case Files', icon: ClipboardCheck },
                { id: 'Explorer' as const, label: 'PHP Code Explorer', icon: Code }
              ].map(item => {
                const disabled = !canAccess(item.id);
                const active = activeTab === item.id;
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (!disabled) {
                        startTransition(() => {
                           setActiveTab(item.id);
                        });
                      }
                    }}
                    disabled={disabled}
                    className={`w-full text-left px-3 py-2 rounded-sm flex items-center gap-2.5 text-xs font-semibold cursor-pointer transition-all ${
                      active
                        ? 'bg-blue-600 text-white shadow-xs'
                        : disabled
                          ? 'text-slate-300 bg-slate-50/10 cursor-not-allowed opacity-40'
                          : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    <IconComponent className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                    {disabled && (
                      <span className="ml-auto text-[8px] font-bold text-red-400 uppercase tracking-widest leading-none bg-red-50 px-1 py-0.5 rounded-sm border border-red-100/30">Lock</span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="bg-blue-50/30 border border-blue-100/50 rounded-sm p-4 space-y-1 text-center select-none">
            <Heart className="w-6 h-6 text-blue-500 mx-auto fill-blue-500/10 stroke-1" />
            <span className="block text-[11px] font-bold text-slate-800 tracking-tight">CarePort Health System</span>
            <span className="block text-[10px] text-slate-400">Offline persistent state layer active. Local files synchronization.</span>
          </div>
        </div>

        {/* Dashboard Panels Container */}
        <div className="flex-1 space-y-6">
          
          {/* Real-Time Flash Alerts Box */}
          {alertMessage && (
            <div className={`p-4 rounded-sm border flex items-center gap-3 shadow-xs animate-fade-in ${
              alertMessage.type === 'success' 
                ? 'bg-blue-50 border-blue-100/80 text-blue-950' 
                : 'bg-red-50 border-red-200 text-red-950'
            }`}>
              <CheckCircle className="w-5 h-5 shrink-0" />
              <div className="text-xs font-semibold">{alertMessage.text}</div>
              <button 
                onClick={() => setAlertMessage(null)}
                className="ml-auto text-xs hover:underline cursor-pointer opacity-80"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* IT Admin Summary metrics display */}
          <SummaryMetricsFlat 
            totalPatients={totalPatients}
            totalRevenue={totalRevenue}
            pendingLabs={pendingLabs}
            completedVisits={completedVisits}
          />

          {/* Active Router Transition Panel */}
          <div className={`transition-opacity duration-200 ${isPending ? 'opacity-50' : 'opacity-100'}`}>
            {activeTab === 'Admissions' && (
              <AdminAudits 
                visits={visits} 
                logs={logs} 
                onDownloadCodebaseZip={handleDownloadCodebaseZip}
                users={users}
                onAddUser={handleAddUser}
                onUpdateUser={handleUpdateUser}
                onDeleteUser={handleDeleteUser}
              />
            )}

            {activeTab === 'Intake' && (
              <PatientRegistration 
                doctors={users.filter(u => u.role_id === 2)}
                onRegister={handleRegisterPatient}
                recentVisits={visits.filter(v => v.status === 'Registered')}
              />
            )}

            {activeTab === 'Vitals' && (
              <VitalsCheck 
                pendingVisits={visits.filter(v => v.status === 'Registered')}
                onRecordVitals={handleRecordVitals}
              />
            )}

            {activeTab === 'Consult' && (
              <DoctorConsultation 
                visits={visits.filter(v => v.status === 'Vitals Recorded')}
                labTests={LAB_MASTER}
                pharmacyDrugs={PHARMACY_MASTER}
                onFinishConsult={handleFinishConsult}
              />
            )}

            {activeTab === 'Labs' && (
              <LabReportUpload 
                visits={visits.filter(v => v.status === 'Lab Pending')}
                onUploadResult={handleUploadResult}
              />
            )}

            {activeTab === 'Billing' && (
              <BillingCalculations 
                visits={visits.filter(v => v.status === 'Billing' || v.status === 'Lab Completed')}
                labTests={LAB_MASTER}
                pharmacyDrugs={PHARMACY_MASTER}
                onProcessInvoice={handleProcessInvoice}
              />
            )}

            {activeTab === 'Discharge' && (
              <DischargeWalkout 
                completedVisits={visits.filter(v => v.status === 'Completed')}
              />
            )}

            {activeTab === 'Explorer' && (
              <div className="bg-white rounded-sm border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide">CarePort PHP File Tree Explorer</h3>
                    <p className="text-slate-400 text-[11px] mt-0.5">Explore each line of the vanilla PHP + MySQL MVC system</p>
                  </div>

                  <div className="flex flex-wrap gap-2.5 w-full md:w-auto">
                    <div className="relative flex-1 md:flex-none">
                      <span className="absolute left-3 top-2 position-absolute text-slate-400"><Search className="w-4 h-4" /></span>
                      <input
                        id={searchInputId}
                        type="text"
                        placeholder="Filter file path..."
                        value={explorerSearch}
                        onChange={(e) => setExplorerSearch(e.target.value)}
                        className="w-full md:w-56 pl-9 pr-4 py-1.5 text-xs border border-slate-200 rounded-sm focus:outline-hidden focus:ring-1 focus:ring-blue-500 bg-slate-50"
                      />
                    </div>

                    <button
                      onClick={handleDownloadCodebaseZip}
                      className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-sm text-xs font-bold cursor-pointer flex items-center justify-center gap-1.5 transition-all shadow-xs"
                    >
                      <Download className="w-4 h-4" /> Download Complete ZIP
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
                  <div className="lg:col-span-1 p-4 bg-slate-50/35 overflow-y-auto max-h-[500px] space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 px-2 select-none uppercase tracking-wider block mb-2">Workspace Catalog</span>
                    {filteredExplorerFiles.map(file => {
                      const selected = selectedFile.path === file.path;
                      return (
                        <button
                          key={file.path}
                          onClick={() => setSelectedFile(file)}
                          className={`w-full text-left px-3 py-2 rounded-sm text-xs font-semibold cursor-pointer block transition-all ${
                            selected
                              ? 'bg-blue-50 text-blue-700 border-l-2 border-blue-600'
                              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <span className="truncate font-sans">{file.path}</span>
                          </div>
                          <span className={`text-[9px] font-bold rounded-sm px-1.5 py-0.5 mt-0.5 inline-block ${
                            file.category === 'Database Schema' ? 'bg-amber-100 text-amber-700 border border-amber-200/45' :
                            file.category === 'Core System' ? 'bg-blue-100 text-blue-700 border border-blue-200/45' : 'bg-slate-100 text-slate-600 border border-slate-200/45'
                          }`}>
                            {file.category}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="lg:col-span-3 p-4 flex flex-col justify-between">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-100 mb-3 select-none">
                      <span className="text-xs font-bold font-mono text-slate-700">File: {selectedFile.path}</span>
                      <span className="text-[10px] bg-slate-100 text-slate-500 font-mono px-2 py-0.5 rounded-sm">{selectedFile.content.split('\n').length} lines</span>
                    </div>

                    <div className="bg-slate-900 text-slate-100 p-4 rounded-sm font-mono text-xs overflow-x-auto max-h-[420px] shadow-sm select-text border border-slate-800">
                      <pre className="text-blue-300 leading-relaxed text-[11px]">
                        <code>
                          {selectedFile.content}
                        </code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
