import { UserProfile } from "./supabase/auth-module/services/user.services";
export interface Program {
  id: string;
  university: string;
  previous_or_current_study?: string;
  degree_going_for?: string;
  course_name?: string;
  ielts_requirement?: string;
  special_requirements?: string;
  remarks?: string;
  created_at: string;
  updated_at: string;
}

// export interface AcademicEntry {
//   id: string;
//   enquiry_id: string;
//   study_level?: string | null;
//   stream?: string | null;
//   pursue?: string | null;
//   score?: number | null;
//   completion_year?: number | null;
//   duration_years?: number | null;
//   completion_date?: string | null;
//   course?: string | null;
// }

export interface Enquiry {
  id: string;
  student_name: string;
  email: string;
  phone?: string;
  overall_percentage?: number | null;
  is_gap?: boolean;
  gap_years?: number | null;
  custom_fields?: string | null;
  created_at: string;
  createdby?: string | null;
  updated_at?: string;

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
  status?: "pending" | "in_progress" | "completed" | "rejected";
  assigned_to_user_id?: string;

  academic_entries?: {
    error: string | null;
    data: AcademicEntry[];
    count: number | null;
    status: number;
    statusText: string;
  };
}

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: "admin" | "user";
  phone?: string;
  password?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProgramFormData {
  university: string;
  previous_or_current_study: string;
  degree_going_for: string;
  course_name: string;
  ielts_requirement?: string;
  special_requirements?: string;
  remarks?: string;
  ielts_na: boolean;
  special_requirements_na: boolean;
  remarks_na: boolean;
}

export interface EnquiryFormData {
  student_name: string;
  email: string;
  phone?: string;
  academics?: {
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
  organization?: string;
  state?: string;
  city?: string;
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
  comparison: ">" | ">=" | "<" | "<=" | "=";
}

export interface AcademicEntry {
  study_level: string;
  study_area: string;
  duration: string;
  discipline_area: string; // New field
  what_to_pursue: string; // New field
  study_year: string;
  score?: number;
  completion_date: string;
}

export interface IDocument {
  id: string;
  title: string;
  description?: string | null;
  file_path: string;
  file_type: string | null;
  created_at: string;
  updated_at: string;
}
