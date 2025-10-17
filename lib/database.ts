import { createClient } from './supabase/server';
import { Program, Enquiry, User, ProgramFormData, EnquiryFormData } from './types';

export class DatabaseService {
  private supabase;

  constructor() {
    this.supabase = createClient();
  }

  private async getSupabase() {
    return await this.supabase;
  }

  // Programs CRUD operations
  async getPrograms(): Promise<Program[]> {
    const supabase = await this.getSupabase();
    const { data, error } = await supabase
      .from('programs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async getProgram(id: string): Promise<Program | null> {
    const supabase = await this.getSupabase();
    const { data, error } = await supabase
      .from('programs')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async createProgram(program: ProgramFormData): Promise<Program> {
    const supabase = await this.getSupabase();
    const { data, error } = await supabase
      .from('programs')
      .insert(program)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateProgram(id: string, program: Partial<ProgramFormData>): Promise<Program> {
    const supabase = await this.getSupabase();
    const { data, error } = await supabase
      .from('programs')
      .update(program)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteProgram(id: string): Promise<void> {
    const supabase = await this.getSupabase();
    const { error } = await supabase
      .from('programs')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Bulk insert programs
  async bulkInsertPrograms(programs: ProgramFormData[]): Promise<Program[]> {
    const supabase = await this.getSupabase();
    const { data, error } = await supabase
      .from('programs')
      .insert(programs)
      .select();

    if (error) throw error;
    return data || [];
  }

  // Enquiries operations
  async getEnquiries(): Promise<Enquiry[]> {
    const supabase = await this.getSupabase();
    const { data, error } = await supabase
      .from('enquiries')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async createEnquiry(enquiry: EnquiryFormData): Promise<Enquiry> {
    const supabase = await this.getSupabase();
    const { data, error } = await supabase
      .from('enquiries')
      .insert(enquiry)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateEnquiryStatus(id: string, status: Enquiry['status']): Promise<Enquiry> {
    const supabase = await this.getSupabase();
    const { data, error } = await supabase
      .from('enquiries')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // User management
  async getUsers(): Promise<User[]> {
    const supabase = await this.getSupabase();
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async createUser(email: string, role: 'admin' | 'user' = 'user'): Promise<User> {
    const supabase = await this.getSupabase();
    const { data, error } = await supabase
      .from('users')
      .insert({ email, role })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateUserRole(id: string, role: 'admin' | 'user'): Promise<User> {
    const supabase = await this.getSupabase();
    const { data, error } = await supabase
      .from('users')
      .update({ role })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteUser(id: string): Promise<void> {
    const supabase = await this.getSupabase();
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Search programs for suggestions
  async searchPrograms(criteria: Partial<EnquiryFormData>): Promise<Program[]> {
    const supabase = await this.getSupabase();
    let query = supabase.from('programs').select('*');

    if (criteria.study_level) {
      query = query.eq('study_level', criteria.study_level);
    }

    if (criteria.study_area) {
      query = query.eq('study_area', criteria.study_area);
    }

    if (criteria.preferred_university) {
      query = query.ilike('university', `%${criteria.preferred_university}%`);
    }

    if (criteria.percentage) {
      query = query.lte('percentage_required', criteria.percentage);
    }

    if (criteria.ielts_score) {
      query = query.lte('ielts_score', criteria.ielts_score);
    }

    if (criteria.toefl_score) {
      query = query.lte('toefl_score', criteria.toefl_score);
    }

    if (criteria.pte_score) {
      query = query.lte('pte_score', criteria.pte_score);
    }

    if (criteria.det_score) {
      query = query.lte('det_score', criteria.det_score);
    }

    if (criteria.gre_score) {
      query = query.lte('gre_score', criteria.gre_score);
    }

    if (criteria.gmat_score) {
      query = query.lte('gmat_score', criteria.gmat_score);
    }

    if (criteria.sat_score) {
      query = query.lte('sat_score', criteria.sat_score);
    }

    const { data, error } = await query.order('university_ranking', { ascending: true });

    if (error) throw error;
    return data || [];
  }
}