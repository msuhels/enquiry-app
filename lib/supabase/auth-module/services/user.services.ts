import { createClient } from "@/lib/supabase/adapters/client";
import type { ProfileFormData } from "@/lib/schema/auth-module";

export interface UserProfile {
  id: string;
  created_at: string;
  role: string;
  email: string;
  updated_at: string;
  full_name: string | null;
  profile_picture_url: string | null;
  status: string;
  email_verified: boolean;
  phone_number: string | null;
  oauth_provider: string | null;
  oauth_id: string | null;
  bio: string | null;
  timezone: string | null;
  last_login_ip: string | null;
  last_login_at: string | null;
}

export interface UserServiceResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  tempPassword?: string;
}

export class UserService {
  private supabase;

  constructor() {
    this.supabase = createClient();
  }

  async createUser(authUserId: string, email: string): Promise<UserServiceResult<UserProfile>> {
    try {
      const { data, error } = await this.supabase
        .from('users')
        .insert([
          {
            id: authUserId,
            email: email,
            email_verified: false,
            role: 'user',
            status: 'active',
          }
        ])
        .select()
        .single();

      if (error) {
        console.error(error)
        return {
          success: false,
          error: error.message,
        };
      }

      return {
        success: true,
        data: data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
      };
    }
  }

  async getUserProfile(userId: string): Promise<UserServiceResult<UserProfile>> {
    try {
      const { data, error } = await this.supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      return {
        success: true,
        data: data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
      };
    }
  }

  async updateUserProfile(userId: string, profileData: ProfileFormData): Promise<UserServiceResult<UserProfile>> {
    try {
      const { data, error } = await this.supabase
        .from('users')
        .update({
          full_name: `${profileData.firstName} ${profileData.lastName}`.trim(),
          // email: profileData.email,
          phone_number: profileData.phone || null,
          bio: profileData.bio || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      return {
        success: true,
        data: data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
      };
    }
  }

  async updateLastLogin(userId: string, ip?: string): Promise<UserServiceResult> {
    try {
      const { error } = await this.supabase
        .from('users')
        .update({
          last_login_at: new Date().toISOString(),
          last_login_ip: ip || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
      };
    }
  }

  async updateEmailVerification(userId: string, verified: boolean): Promise<UserServiceResult> {
    try {
      const { error } = await this.supabase
        .from('users')
        .update({
          email_verified: verified,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
      };
    }
  }
}

export const userService = new UserService();
