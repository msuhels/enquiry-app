export interface PasswordStrengthResult {
  score: number; // 0-4 (0 = very weak, 4 = very strong)
  checks: {
    minLength: boolean;
    hasLowercase: boolean;
    hasUppercase: boolean;
    hasNumber: boolean;
  };
  feedback: string[];
}

export function validatePasswordStrength(password: string): PasswordStrengthResult {
  const checks = {
    minLength: password.length >= 8,
    hasLowercase: /[a-z]/.test(password),
    hasUppercase: /[A-Z]/.test(password),
    hasNumber: /\d/.test(password),
  };

  const feedback: string[] = [];
  
  if (!checks.minLength) {
    feedback.push("At least 8 characters long");
  }
  if (!checks.hasLowercase) {
    feedback.push("At least one lowercase letter");
  }
  if (!checks.hasUppercase) {
    feedback.push("At least one uppercase letter");
  }
  if (!checks.hasNumber) {
    feedback.push("At least one number");
  }

  // Calculate score based on fulfilled requirements
  const fulfilledChecks = Object.values(checks).filter(Boolean).length;
  let score = 0;

  if (password.length === 0) {
    score = 0;
  } else if (fulfilledChecks === 4) {
    // All requirements met, check additional complexity
    if (password.length >= 12) {
      score = 4; // Very strong
    } else {
      score = 3; // Strong
    }
  } else if (fulfilledChecks >= 3) {
    score = 2; // Medium
  } else if (fulfilledChecks >= 1) {
    score = 1; // Weak
  } else {
    score = 0; // Very weak
  }

  return {
    score,
    checks,
    feedback,
  };
}

export function getPasswordStrengthLabel(score: number): string {
  switch (score) {
    case 0:
      return "Very Weak";
    case 1:
      return "Weak";
    case 2:
      return "Medium";
    case 3:
      return "Strong";
    case 4:
      return "Very Strong";
    default:
      return "Unknown";
  }
}

export function getPasswordStrengthColor(score: number): string {
  switch (score) {
    case 0:
      return "text-red-600";
    case 1:
      return "text-red-500";
    case 2:
      return "text-yellow-500";
    case 3:
      return "text-blue-500";
    case 4:
      return "text-green-500";
    default:
      return "text-gray-500";
  }
}