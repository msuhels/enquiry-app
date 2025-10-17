# Auth Module Configuration Guide

This guide explains how to use the comprehensive configuration system for the auth module. With this system, you can control every aspect of the authentication components including text content, styling, visibility, and behavior.

## Table of Contents

1. [Quick Start](#quick-start)
2. [Configuration Structure](#configuration-structure)
3. [Available Components](#available-components)
4. [Configuration Options](#configuration-options)
5. [Examples](#examples)
6. [Best Practices](#best-practices)

## Quick Start

### Basic Usage (Default Configuration)

```tsx
import { LoginForm } from "@/components/modules/auth-module";

export function LoginPage() {
  return <LoginForm />;
}
```

### Custom Configuration

```tsx
import { LoginForm } from "@/components/modules/auth-module";
import type { AuthModuleConfig } from "@/config/auth-config.types";

export function CustomLoginPage() {
  const config: Partial<AuthModuleConfig> = {
    login: {
      title: {
        text: "Welcome Back!",
        show: true,
      },
      submitButton: {
        text: {
          buttonText: "Sign In Now",
          loadingText: "Signing in...",
        },
      },
    },
  };

  return <LoginForm config={config} />;
}
```

## Configuration Structure

The configuration system is built around a hierarchical structure that mirrors the component tree:

```
AuthModuleConfig
├── login
├── signUp
├── forgotPassword
├── updatePassword
├── profileInfo
├── profileForm
├── profileActions
├── globalStyles
└── theme
```

Each section contains:
- **Text Configuration**: Control all text content
- **Style Configuration**: Customize CSS classes
- **Visibility Configuration**: Show/hide elements
- **Behavior Configuration**: Control component behavior

## Available Components

### Form Components
- `LoginForm` - User login form
- `SignUpForm` - User registration form
- `ForgotPasswordForm` - Password reset request form
- `UpdatePasswordForm` - Password update form

### Profile Components
- `ProfileInfo` - Display user profile information
- `ProfileForm` - Edit user profile form
- `ProfileActions` - Account actions (logout, change password)

## Configuration Options

### Global Styles

Apply styles across all components:

```tsx
const config = {
  globalStyles: {
    container: "max-w-md mx-auto p-6",
    card: "shadow-xl rounded-lg",
    title: "text-2xl font-bold text-gray-900",
    button: "w-full bg-blue-600 hover:bg-blue-700",
    input: "border-2 focus:border-blue-500",
    label: "font-medium text-gray-700",
    errorMessage: "text-red-600",
    successMessage: "text-green-600",
    helperText: "text-gray-500",
    link: "text-blue-600 hover:text-blue-800",
  },
};
```

### Text Configuration

Customize all text content:

```tsx
const config = {
  login: {
    title: {
      text: "Welcome Back",
      show: true,
    },
    description: {
      text: "Please sign in to continue",
      show: true,
    },
    email: {
      label: "Email Address",
      placeholder: "Enter your email",
    },
    submitButton: {
      text: {
        buttonText: "Sign In",
        loadingText: "Signing in...",
      },
    },
  },
};
```

### Visibility Configuration

Show or hide any element:

```tsx
const config = {
  signUp: {
    title: { show: false }, // Hide title
    description: { show: true }, // Show description
    password: {
      showStrengthIndicator: false, // Hide password strength
    },
    passwordMatch: { show: false }, // Hide password match indicator
  },
};
```

### Style Configuration

Override styles for specific components:

```tsx
const config = {
  login: {
    styles: {
      card: "bg-gradient-to-r from-blue-500 to-purple-600",
      title: "text-white",
      button: "bg-white text-blue-600 hover:bg-gray-100",
    },
  },
};
```

### Password Strength Configuration

Customize password strength indicators:

```tsx
const config = {
  signUp: {
    password: {
      showStrengthIndicator: true,
      strengthIndicator: {
        showLabel: true,
        showProgressBar: true,
        showRequirements: true,
        colors: {
          weak: "bg-red-500",
          fair: "bg-orange-500",
          good: "bg-yellow-500",
          strong: "bg-green-500",
          veryStrong: "bg-emerald-500",
        },
      },
    },
  },
};
```

## Examples

### 1. Minimal Configuration

Hide unnecessary elements for a clean look:

```tsx
const minimalConfig = {
  login: {
    description: { show: false },
    forgotPasswordLink: { show: false },
    signUpLink: { show: false },
  },
};

<LoginForm config={minimalConfig} />
```

### 2. Corporate Branding

Apply company branding:

```tsx
const corporateConfig = {
  globalStyles: {
    card: "border-2 border-blue-200 shadow-xl",
    title: "text-blue-800 font-bold",
    button: "bg-blue-600 hover:bg-blue-700",
  },
  login: {
    title: { text: "Welcome to [Company Name]" },
    description: { text: "Access your corporate dashboard" },
  },
};

<LoginForm config={corporateConfig} />
```

### 3. Dark Theme

Create a dark theme:

```tsx
const darkConfig = {
  globalStyles: {
    card: "bg-gray-900 border-gray-700 text-white",
    input: "bg-gray-800 border-gray-600 text-white",
    button: "bg-blue-600 hover:bg-blue-700",
    errorMessage: "text-red-400",
    helperText: "text-gray-400",
  },
};

<LoginForm config={darkConfig} />
```

### 4. Custom Profile Configuration

Customize profile components:

```tsx
const profileConfig = {
  profileInfo: {
    fields: {
      role: { show: false }, // Hide role
      lastSignIn: { show: false }, // Hide last sign in
    },
  },
  profileForm: {
    phone: { show: false }, // Hide phone field
    bio: {
      validation: { maxLength: 300 }, // Custom character limit
    },
  },
};

<ProfileForm config={profileConfig} />
```

## Best Practices

### 1. Use Partial Configuration

You don't need to specify every option. The system merges your configuration with sensible defaults:

```tsx
// This is sufficient for basic customization
const config = {
  login: {
    title: { text: "Custom Title" },
  },
};
```

### 2. Global vs Local Styles

Use `globalStyles` for consistent theming across all components, and component-specific styles for unique requirements:

```tsx
const config = {
  globalStyles: {
    button: "rounded-lg font-semibold", // Applied to all buttons
  },
  login: {
    styles: {
      button: "bg-green-600", // Only for login button
    },
  },
};
```

### 3. Environment-Based Configuration

Create different configurations for different environments:

```tsx
const getAuthConfig = () => {
  if (process.env.NODE_ENV === 'development') {
    return developmentConfig;
  }
  return productionConfig;
};

<LoginForm config={getAuthConfig()} />
```

### 4. Configuration Management

For large applications, consider managing configurations in separate files:

```tsx
// configs/auth/login.ts
export const loginConfig = {
  login: {
    title: { text: "Welcome Back" },
    // ... other options
  },
};

// configs/auth/index.ts
export const authConfig = {
  ...loginConfig,
  ...signUpConfig,
  ...profileConfig,
};
```

### 5. Type Safety

Always use the TypeScript interfaces for type safety:

```tsx
import type { AuthModuleConfig } from "@/config/auth-config.types";

const config: Partial<AuthModuleConfig> = {
  // Your configuration with full type checking
};
```

## Advanced Configuration

### Custom Validation

Add custom validation rules:

```tsx
const config = {
  signUp: {
    email: {
      validation: {
        pattern: "^[a-zA-Z0-9._%+-]+@company\\.com$", // Only company emails
        customValidation: (value: string) => {
          if (!value.endsWith('@company.com')) {
            return 'Please use your company email address';
          }
          return null;
        },
      },
    },
  },
};
```

### Dynamic Configuration

Load configuration from an API or CMS:

```tsx
const [config, setConfig] = useState<Partial<AuthModuleConfig>>({});

useEffect(() => {
  fetchAuthConfig().then(setConfig);
}, []);

return config ? <LoginForm config={config} /> : <Loading />;
```

## Configuration Reference

For a complete reference of all available configuration options, see the TypeScript definitions in `config/auth-config.types.ts`.

## Examples Repository

Check the `examples/auth-config-examples.tsx` file for more comprehensive examples and use cases.
