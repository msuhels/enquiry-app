import { UserProfile } from './supabase/auth-module/services/user.services';
export interface Program {
  id: string;
  sr_no?: number;
  university: string;
  university_ranking?: number;
  study_level?: string;
  study_area?: string;
  programme_name: string;
  campus?: string;
  duration?: string;
  open_intake?: string;
  open_call?: string;
  application_deadline?: string;
  entry_requirements?: string;
  percentage_required?: number;
  moi?: string;
  ielts_score?: number;
  ielts_no_band_less_than?: number;
  toefl_score?: number;
  toefl_no_band_less_than?: number;
  pte_score?: number;
  pte_no_band_less_than?: number;
  det_score?: number;
  det_no_band_less_than?: number;
  tolc_score?: number;
  sat_score?: number;
  gre_score?: number;
  gmat_score?: number;
  cents_score?: number;
  til_score?: number;
  arched_test?: string;
  application_fees?: number;
  additional_requirements?: string;
  remarks?: string;
  created_at: string;
  updated_at: string;
}

export interface Enquiry {
  id: string;
  student_name: string;
  email: string;
  phone?: string;
  program_interest?: string;
  preferred_university?: string;
  preferred_country?: string;
  budget_range?: string;
  ielts_score?: number;
  toefl_score?: number;
  pte_score?: number;
  det_score?: number;
  percentage?: number;
  gre_score?: number;
  gmat_score?: number;
  sat_score?: number;
  preferred_intake?: string;
  additional_requirements?: string;
  message?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'rejected';
  assigned_to_user_id?: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  phone?: string;
  password?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProgramFormData {
  university: string;
  programme_name: string;
  university_ranking?: number;
  study_level?: string;
  study_area?: string;
  campus?: string;
  duration?: string;
  open_intake?: string;
  open_call?: string;
  application_deadline?: string;
  entry_requirements?: string;
  percentage_required?: number;
  moi?: string;
  ielts_score?: number;
  ielts_no_band_less_than?: number;
  toefl_score?: number;
  toefl_no_band_less_than?: number;
  pte_score?: number;
  pte_no_band_less_than?: number;
  det_score?: number;
  det_no_band_less_than?: number;
  tolc_score?: number;
  sat_score?: number;
  gre_score?: number;
  gmat_score?: number;
  cents_score?: number;
  til_score?: number;
  arched_test?: string;
  application_fees?: number;
  additional_requirements?: string;
  remarks?: string;
}

export interface EnquiryFormData {
  student_name: string;
  email: string;
  phone?: string;
  academics?:{
    study_level?: string;
    study_area?: string;
    duration?: string;
    completion_date?: string;
  };
  preferred_university?: string;
  preferred_country?: string;
  budget_range?: string;
  ielts_score?: number;
  toefl_score?: number;
  pte_score?: number;
  det_score?: number;
  percentage?: number;
  gre_score?: number;
  gmat_score?: number;
  sat_score?: number;
  preferred_intake?: string;
  additional_requirements?: string;
  message?: string;
}

export interface Suggestion {
  program: Program;
  match_score: number;
  reasons: string[];
}


export interface BulkUploadResult {
  success: boolean;
  total: number;
  successful: number;
  failed: number;
  errors: Array<{
    row: number;
    program: Partial<Program>;
    error: string;
  }>;
  data?: Program[];
}

export interface BulkUserInput {
  full_name: string;
  email: string;
  phone_number?: string; // Optional
}

export interface BulkUserUploadResult {
  success: boolean;
  total: number;
  successful: number;
  failed: number;
  errors: Array<{
    row: number;
    user: BulkUserInput;
    error: string;
  }>;
  data?: Array<{
    user: UserProfile;
    password: string;
  }>;
}

export interface CustomFieldEntry {
  field: string;
  value: number | "";
}

export interface AcademicEntry {
  study_level: string;
  study_area: string;
  duration: string;
  discipline_area: string; // New field
  what_to_pursue: string; // New field
  study_year: string;
  score ?: number;
  completion_date: string;
}