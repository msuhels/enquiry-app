export interface AuthTextConfig {
  title?: string;
  text?: string;
  description?: string;
  placeholder?: string;
  label?: string;
  buttonText?: string;
  loadingText?: string;
  successText?: string;
  errorText?: string;
  helperText?: string;
  linkText?: string;
  show?: boolean;
}

export interface AuthStyleConfig {
  container?: string;
  card?: string;
  cardHeader?: string;
  cardContent?: string;
  title?: string;
  description?: string;
  input?: string;
  label?: string;
  button?: string;
  errorMessage?: string;
  successMessage?: string;
  helperText?: string;
  link?: string;
  progressBar?: string;
  badge?: string;
}

export interface AuthFieldConfig {
  show?: boolean;
  required?: boolean;
  placeholder?: string;
  label?: string;
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    customValidation?: (value: string) => string | null;
  };
  styles?: AuthStyleConfig;
}

export interface AuthFeatureConfig {
  show?: boolean;
  text?: AuthTextConfig;
  styles?: AuthStyleConfig;
}

export interface AuthPasswordConfig extends AuthFieldConfig {
  showStrengthIndicator?: boolean;
  showRequirements?: boolean;
  strengthIndicator?: {
    show?: boolean;
    showLabel?: boolean;
    showProgressBar?: boolean;
    showRequirements?: boolean;
    colors?: {
      weak?: string;
      fair?: string;
      good?: string;
      strong?: string;
      veryStrong?: string;
    };
  };
}

export interface AuthLoginConfig {
  title?: AuthTextConfig;
  description?: AuthTextConfig;
  email?: AuthFieldConfig;
  password?: AuthFieldConfig;
  submitButton?: AuthFeatureConfig;
  forgotPasswordLink?: AuthFeatureConfig;
  signUpLink?: AuthFeatureConfig;
  errorDisplay?: AuthFeatureConfig;
  styles?: AuthStyleConfig;
  redirectAfterLogin?: string;
}

export interface AuthSignUpConfig {
  title?: AuthTextConfig;
  description?: AuthTextConfig;
  email?: AuthFieldConfig;
  password?: AuthPasswordConfig;
  confirmPassword?: AuthFieldConfig;
  submitButton?: AuthFeatureConfig;
  loginLink?: AuthFeatureConfig;
  errorDisplay?: AuthFeatureConfig;
  successDisplay?: AuthFeatureConfig;
  passwordMatch?: AuthFeatureConfig;
  styles?: AuthStyleConfig;
  redirectAfterSignUp?: string;
}

export interface AuthForgotPasswordConfig {
  title?: AuthTextConfig;
  description?: AuthTextConfig;
  email?: AuthFieldConfig;
  submitButton?: AuthFeatureConfig;
  loginLink?: AuthFeatureConfig;
  successDisplay?: AuthFeatureConfig;
  errorDisplay?: AuthFeatureConfig;
  styles?: AuthStyleConfig;
}

export interface AuthUpdatePasswordConfig {
  title?: AuthTextConfig;
  description?: AuthTextConfig;
  password?: AuthPasswordConfig;
  confirmPassword?: AuthFieldConfig;
  submitButton?: AuthFeatureConfig;
  errorDisplay?: AuthFeatureConfig;
  styles?: AuthStyleConfig;
  redirectAfterUpdate?: string;
}

export interface AuthProfileInfoConfig {
  title?: AuthTextConfig;
  fields?: {
    email?: AuthFeatureConfig;
    status?: AuthFeatureConfig;
    role?: AuthFeatureConfig;
    memberSince?: AuthFeatureConfig;
    lastSignIn?: AuthFeatureConfig;
    accountStatus?: AuthFeatureConfig;
  };
  styles?: AuthStyleConfig;
}

export interface AuthProfileFormConfig {
  title?: AuthTextConfig;
  firstName?: AuthFieldConfig;
  lastName?: AuthFieldConfig;
  email?: AuthFieldConfig;
  phone?: AuthFieldConfig;
  bio?: AuthFieldConfig;
  submitButton?: AuthFeatureConfig;
  errorDisplay?: AuthFeatureConfig;
  styles?: AuthStyleConfig;
}

export interface AuthProfileActionsConfig {
  title?: AuthTextConfig;
  changePassword?: AuthFeatureConfig;
  signOut?: AuthFeatureConfig;
  styles?: AuthStyleConfig;
}

export interface AuthModuleConfig {
  login?: AuthLoginConfig;
  signUp?: AuthSignUpConfig;
  forgotPassword?: AuthForgotPasswordConfig;
  updatePassword?: AuthUpdatePasswordConfig;
  profileInfo?: AuthProfileInfoConfig;
  profileForm?: AuthProfileFormConfig;
  profileActions?: AuthProfileActionsConfig;
  globalStyles?: AuthStyleConfig;
  theme?: {
    primary?: string;
    secondary?: string;
    success?: string;
    error?: string;
    warning?: string;
    muted?: string;
  };
}
