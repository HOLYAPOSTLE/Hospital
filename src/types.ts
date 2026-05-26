/**
 * Hospital Management System - Shared Types
 */

export interface Role {
  id: number;
  role_name: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role_id: number;
  role_name: string;
}

export interface Patient {
  id: number;
  op_number: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  contact: string;
  address: string;
  insurance_provider?: string;
  insurance_policy?: string;
  created_at: string;
}

export interface VitalSigns {
  id: number;
  visit_id: number;
  bp_systolic: number; // e.g. 120
  bp_diastolic: number; // e.g. 80
  heart_rate: number; // e.g. 72
  temperature: number; // e.g. 37.2
  resp_rate: number; // e.g. 16
  spo2: number; // e.g. 98
  weight: number; // kg
  height: number; // cm
}

export interface LabRequest {
  id: number;
  visit_id: number;
  test_name: string;
  status: 'Pending' | 'Completed';
  technician_id?: number;
  report_file?: string;
  result_text?: string;
  requested_at: string;
  completed_at?: string;
}

export interface Prescription {
  id: number;
  visit_id: number;
  drug_name: string;
  dosage: string;
  frequency: string;
  duration: string;
}

export interface Billing {
  id: number;
  visit_id: number;
  total_amount: number;
  insurance_deduction: number;
  final_amount: number;
  payment_method: 'Cash' | 'Card' | 'Insurance Claim';
  payment_date?: string;
}

export interface Visit {
  id: number;
  patient_id: number;
  doctor_id: number;
  nurse_id?: number;
  visit_date: string;
  status: 'Registered' | 'Vitals Recorded' | 'Consultation' | 'Lab Pending' | 'Lab Completed' | 'Billing' | 'Completed';
  patient?: Patient;
  vitals?: VitalSigns;
  labRequests: LabRequest[];
  prescriptions: Prescription[];
  billing?: Billing;
  diagnosis?: string;
  notes?: string;
}

export interface UserActivityLog {
  id: number;
  user_id: number;
  user_name: string;
  role_name: string;
  action: string;
  ip_address: string;
  created_at: string;
}

export interface MasterItem {
  id: number;
  name: string;
  price: number;
}
