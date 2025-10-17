import type { AuthModuleConfig } from '@/types/auth-config.types';

// Default configuration for the auth module
export const defaultAuthConfig: AuthModuleConfig = {
  login: {
    title: {
      text: "Login",
      show: true,
    },
    description: {
      text: "Enter your email below to login to your account",
      show: true,
    },
    email: {
      show: true,
      required: true,
      placeholder: "m@example.com",
      label: "Email",
      validation: {
        pattern: "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$",
      },
    },
    password: {
      show: true,
      required: true,
      label: "Password",
    },
    submitButton: {
      show: true,
      text: {
        buttonText: "Sign in",
        loadingText: "Signing in...",
      },
    },
    forgotPasswordLink: {
      show: true,
      text: {
        linkText: "Forgot your password?",
      },
    },
    signUpLink: {
      show: true,
      text: {
        linkText: "Don't have an account? Sign up",
      },
    },
    errorDisplay: {
      show: true,
    },
    redirectAfterLogin: "/dashboard",
  },
  
  signUp: {
    title: {
      text: "Sign up",
      show: true,
    },
    description: {
      text: "Create a new account",
      show: true,
    },
    email: {
      show: true,
      required: true,
      placeholder: "m@example.com",
      label: "Email",
      validation: {
        pattern: "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$",
      },
    },
    password: {
      show: true,
      required: true,
      label: "Password",
      placeholder: "Enter a strong password",
      showStrengthIndicator: true,
      showRequirements: true,
      strengthIndicator: {
        show: true,
        showLabel: true,
        showProgressBar: true,
        showRequirements: true,
        colors: {
          weak: "bg-red-500",
          fair: "bg-red-400",
          good: "bg-yellow-500",
          strong: "bg-blue-500",
          veryStrong: "bg-green-500",
        },
      },
    },
    confirmPassword: {
      show: true,
      required: true,
      label: "Confirm Password",
      placeholder: "Confirm your password",
    },
    submitButton: {
      show: true,
      text: {
        buttonText: "Create account",
        loadingText: "Creating account...",
      },
    },
    loginLink: {
      show: true,
      text: {
        linkText: "Already have an account? Sign in",
      },
    },
    errorDisplay: {
      show: true,
    },
    passwordMatch: {
      show: true,
      text: {
        successText: "Passwords match",
        errorText: "Passwords do not match",
      },
    },
    redirectAfterSignUp: "/auth/sign-up-success",
  },
  
  forgotPassword: {
    title: {
      text: "Reset Your Password",
      show: true,
    },
    description: {
      text: "Type in your email and we'll send you a link to reset your password",
      show: true,
    },
    email: {
      show: true,
      required: true,
      placeholder: "m@example.com",
      label: "Email",
    },
    submitButton: {
      show: true,
      text: {
        buttonText: "Send reset email",
        loadingText: "Sending...",
      },
    },
    loginLink: {
      show: true,
      text: {
        linkText: "Already have an account? Login",
      },
    },
    successDisplay: {
      show: true,
      text: {
        title: "Check Your Email",
        description: "Password reset instructions sent",
        helperText: "If you registered using your email and password, you will receive a password reset email.",
      },
    },
    errorDisplay: {
      show: true,
    },
  },
  
  updatePassword: {
    title: {
      text: "Reset Your Password",
      show: true,
    },
    description: {
      text: "Please enter your new password below.",
      show: true,
    },
    password: {
      show: true,
      required: true,
      label: "New password",
      placeholder: "New password",
      showStrengthIndicator: true,
      showRequirements: true,
      strengthIndicator: {
        show: true,
        showLabel: true,
        showProgressBar: true,
        showRequirements: true,
      },
    },
    confirmPassword: {
      show: true,
      required: true,
      label: "Confirm new password",
      placeholder: "Confirm new password",
    },
    submitButton: {
      show: true,
      text: {
        buttonText: "Save new password",
        loadingText: "Saving...",
      },
    },
    errorDisplay: {
      show: true,
    },
    redirectAfterUpdate: "/dashboard",
  },
  
  profileInfo: {
    title: {
      text: "Profile Information",
      show: true,
    },
    fields: {
      email: {
        show: true,
        text: {
          label: "Email:",
        },
      },
      status: {
        show: true,
        text: {
          label: "Status:",
        },
      },
      role: {
        show: true,
        text: {
          label: "Role:",
        },
      },
      memberSince: {
        show: true,
        text: {
          label: "Member since:",
        },
      },
      lastSignIn: {
        show: true,
        text: {
          label: "Last sign in:",
        },
      },
      accountStatus: {
        show: true,
        text: {
          label: "Account Status:",
        },
      },
    },
  },
  
  profileForm: {
    title: {
      text: "Edit Profile",
      show: true,
    },
    firstName: {
      show: true,
      required: true,
      label: "First Name",
      placeholder: "John",
    },
    lastName: {
      show: true,
      required: true,
      label: "Last Name",
      placeholder: "Doe",
    },
    email: {
      show: true,
      required: true,
      label: "Email",
      placeholder: "john@example.com",
    },
    phone: {
      show: true,
      required: false,
      label: "Phone (Optional)",
      placeholder: "+1 (234) 567-8900",
    },
    bio: {
      show: true,
      required: false,
      label: "Bio (Optional)",
      placeholder: "Tell us about yourself...",
      validation: {
        maxLength: 500,
      },
    },
    submitButton: {
      show: true,
      text: {
        buttonText: "Save Changes",
        loadingText: "Saving...",
      },
    },
    errorDisplay: {
      show: true,
    },
  },
  
  profileActions: {
    title: {
      text: "Account Actions",
      show: true,
    },
    changePassword: {
      show: true,
      text: {
        title: "Security",
        description: "Manage your account security and access.",
        buttonText: "Change Password",
      },
    },
    signOut: {
      show: true,
      text: {
        title: "Session",
        description: "Sign out of your account on this device.",
        buttonText: "Sign Out",
        loadingText: "Signing out...",
      },
    },
  },
  
  globalStyles: {
    container: "flex flex-col gap-6",
    card: "",
    cardHeader: "",
    cardContent: "",
    title: "text-2xl",
    description: "",
    input: "",
    label: "",
    button: "w-full",
    errorMessage: "text-sm text-red-500",
    successMessage: "text-sm text-green-600",
    helperText: "text-xs text-muted-foreground",
    link: "underline underline-offset-4",
    progressBar: "w-full bg-muted rounded-full h-2",
    badge: "",
  },
  
  theme: {
    primary: "hsl(var(--primary))",
    secondary: "hsl(var(--secondary))",
    success: "hsl(142, 76%, 36%)",
    error: "hsl(0, 84%, 60%)",
    warning: "hsl(45, 93%, 47%)",
    muted: "hsl(var(--muted))",
  },
};

// Utility function to merge user config with defaults
export function mergeAuthConfig(userConfig: Partial<AuthModuleConfig> = {}): AuthModuleConfig {
  return deepMerge(defaultAuthConfig, userConfig);
}

// Deep merge utility function
function deepMerge<T extends Record<string, any>>(target: T, source: Partial<T>): T {
  const result = { ...target };
  
  for (const key in source) {
    if (source[key] !== null && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      result[key as keyof T] = deepMerge((result[key as keyof T] || {}) as T[keyof T], source[key] as any);
    } else if (source[key] !== undefined) {
      result[key] = source[key] as any;
    }
  }
  
  return result;
}

// Hook to access auth config
export function useAuthConfig(config?: Partial<AuthModuleConfig>) {
  return mergeAuthConfig(config);
}
