import React, { useState } from 'react';
import { 
  Lock, Mail, Key, Shield, AlertTriangle, Eye, EyeOff, CheckCircle2,
  Users, Stethoscope, HeartPulse, FlaskConical, Receipt, ClipboardCheck
} from 'lucide-react';
import { User } from '../types';

interface LoginScreenProps {
  users: User[];
  onLoginSuccess: (user: User) => void;
}

// Map roles to their icons for visual feedback
const getRoleIcon = (roleName: string) => {
  switch (roleName) {
    case 'IT Admin':
      return <Shield className="w-5 h-5 text-indigo-600" />;
    case 'Doctor':
      return <Stethoscope className="w-5 h-5 text-teal-600" />;
    case 'Nurse/Assistant':
      return <HeartPulse className="w-5 h-5 text-pink-600" />;
    case 'Lab Technician':
      return <FlaskConical className="w-5 h-5 text-yellow-600" />;
    case 'Receptionist':
      return <Users className="w-5 h-5 text-blue-600" />;
    case 'Billing Staff':
      return <Receipt className="w-5 h-5 text-emerald-600" />;
    default:
      return <ClipboardCheck className="w-5 h-5 text-slate-600" />;
  }
};

// Map role to standard passwords
const getPasswordForUser = (email: string): string => {
  const prefix = email.split('@')[0];
  if (prefix.includes('admin')) return 'admin';
  if (prefix.includes('doctor')) return 'doctor';
  if (prefix.includes('nurse')) return 'nurse';
  if (prefix.includes('lab')) return 'lab';
  if (prefix.includes('reception')) return 'reception';
  if (prefix.includes('billing')) return 'billing';
  return 'password';
};

export function LoginScreen({ users, onLoginSuccess }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);
  const [successStatus, setSuccessStatus] = useState<boolean>(false);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorStatus(null);

    if (!email.trim() || !password.trim()) {
      setErrorStatus('Please enter both your hospital email and secret passcode.');
      return;
    }

    const matchedUser = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
    if (!matchedUser) {
      setErrorStatus('No registered staff profile found matching this email address.');
      return;
    }

    const correctPassword = getPasswordForUser(matchedUser.email);
    if (password !== correctPassword) {
      setErrorStatus('Invalid authentication passkey. Please double-check the credentials dashboard below.');
      return;
    }

    // Success login flow
    setSuccessStatus(true);
    setTimeout(() => {
      onLoginSuccess(matchedUser);
    }, 600);
  };

  const selectQuickFillUser = (user: User) => {
    setEmail(user.email);
    setPassword(getPasswordForUser(user.email));
    setErrorStatus(null);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 selection:bg-blue-600 selection:text-white relative overflow-hidden">
      {/* Dynamic ambient grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-25"></div>

      <div className="w-full max-w-md z-10 space-y-6">
        {/* Branding header */}
        <div className="text-center space-y-2 select-none animate-fade-in">
          <div className="inline-flex w-12 h-12 rounded-sm bg-blue-600 text-white items-center justify-center font-black text-xl tracking-tighter border border-blue-500 shadow-lg">
            H+
          </div>
          <div>
            <h1 className="text-white font-extrabold text-lg uppercase tracking-wider font-sans">HELIX CLINIC SYSTEM</h1>
            <p className="text-slate-400 text-xs text-[11px] uppercase tracking-widest font-mono mt-0.5">Secure Gateway Portal</p>
          </div>
        </div>

        {/* Security Alert / Main Login Form Container */}
        <div className="bg-slate-950 border border-slate-800 rounded-sm p-6 shadow-2xl relative space-y-4">
          <div className="border-b border-slate-800/80 pb-3">
            <h2 className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 text-blue-500" /> Administrative Authentication
            </h2>
            <p className="text-slate-500 text-[10px] mt-0.5">Sign in to initialize security token credentials</p>
          </div>

          {errorStatus && (
            <div className="p-3 bg-red-950/40 border border-red-900 text-red-400 text-xs rounded-sm flex items-start gap-2 animate-shake">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="font-semibold leading-normal">{errorStatus}</div>
            </div>
          )}

          {successStatus && (
            <div className="p-3 bg-emerald-950/40 border border-emerald-900 text-emerald-400 text-xs rounded-sm flex items-center gap-2 animate-pulse">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <div className="font-bold uppercase tracking-wider text-[10px]">Security verified... redirecting</div>
            </div>
          )}

          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">Hospital Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-500 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errorStatus) setErrorStatus(null);
                  }}
                  placeholder="your.name@hospital.com"
                  className="w-full bg-slate-900 border border-slate-800 rounded-sm py-2 pl-9 pr-4 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 font-medium"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">Security Passkey</label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[9px] font-bold text-blue-500 hover:text-blue-400 transition-colors uppercase tracking-wider uppercase cursor-pointer focus:outline-none"
                >
                  {showPassword ? (
                    <span className="flex items-center gap-1"><EyeOff className="w-3 h-3" /> Hide</span>
                  ) : (
                    <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> Show</span>
                  )}
                </button>
              </div>
              <div className="relative">
                <Key className="absolute left-3 top-2.5 w-4 h-4 text-slate-500 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorStatus) setErrorStatus(null);
                  }}
                  placeholder="••••••••"
                  className="w-full bg-slate-900 border border-slate-800 rounded-sm py-2 pl-9 pr-4 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={successStatus}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-sm text-xs font-bold uppercase tracking-wider cursor-pointer border border-blue-500/30 shadow-md transition-all flex items-center justify-center gap-2"
            >
              Sign In Securely
            </button>
          </form>
        </div>

        {/* Demo Credentials Helper Dashboard */}
        <div className="bg-slate-950 border border-slate-850 rounded-sm p-4 space-y-3 shadow-md">
          <div className="flex justify-between items-center border-b border-slate-900 pb-2">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Staff Directories</h3>
            <span className="text-[8px] bg-slate-900 text-blue-400 border border-blue-900 font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-wider font-mono">Quick-Fill Console</span>
          </div>

          <p className="text-slate-500 text-[10px] leading-relaxed">
            Choose any simulation persona below to automatically load their secure credentials on the terminal login panels.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
            {users.map(u => {
              const pass = getPasswordForUser(u.email);
              return (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => selectQuickFillUser(u)}
                  className="p-2 bg-slate-900 hover:bg-slate-850 border border-slate-850/80 hover:border-slate-800 text-left rounded-sm transition-all focus:outline-none focus:border-blue-500/40 cursor-pointer group flex items-start gap-2.5"
                >
                  <div className="w-8 h-8 rounded-sm bg-slate-950 flex items-center justify-center shrink-0 border border-slate-800 group-hover:bg-slate-900 transition-colors">
                    {getRoleIcon(u.role_name)}
                  </div>
                  <div className="truncate flex-1 min-w-0">
                    <span className="block text-[10px] font-bold text-slate-200 truncate group-hover:text-blue-400 transition-colors">{u.name}</span>
                    <span className="block text-[9px] text-slate-500 text-mono tracking-tight my-0.5 leading-none">{u.email}</span>
                    <span className="block text-[8px] text-slate-400 font-mono tracking-wider uppercase font-semibold">Pass: <span className="text-blue-500 font-bold">{pass}</span></span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
