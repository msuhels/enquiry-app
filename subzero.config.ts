export const module = {
    "module": "auth-module",
    "pages/modules/auth-module/dashboard/profile/update-password": [
        "app/(protected)/dashboard/profile/update-password/page.tsx",
    ],
    "pages/modules/auth-module/dashboard/profile": [
        "app/(protected)/dashboard/profile/page.tsx",
    ],
    "pages/modules/auth-module/auth/error": [
        "app/auth/error/page.tsx",
    ],
    "pages/modules/auth-module/auth/forgot-password": [
        "app/auth/forgot-password/page.tsx",
    ],
    "pages/modules/auth-module/auth/login": [
        "app/auth/login/page.tsx",
    ],
    "pages/modules/auth-module/auth/sign-up": [
        "app/auth/sign-up/page.tsx",
    ],
    "pages/modules/auth-module/auth/sign-up-success": [
        "app/auth/sign-up-success/page.tsx",
    ],
    "api/modules/auth-module/admin/users": [
        "app/api/admin/users/route.ts",
    ],
    "components/modules/auth-module/forms/": [
        "components/modules/auth-module/forms/forgot-password-form.tsx",
        "components/modules/auth-module/forms/login-form.tsx",
        "components/modules/auth-module/forms/sign-up-form.tsx",
        "components/modules/auth-module/forms/update-password-form.tsx",
    ],
    "components/modules/auth-module/profile/": [
        "components/modules/auth-module/profile/profile-actions.tsx",
        "components/modules/auth-module/profile/profile-form.tsx",
        "components/modules/auth-module/profile/profile-info.tsx"
    ],
    "hooks/auth-modules": [
        "hooks/auth-modules/index.ts",
        "hooks/auth-modules/useAuth.ts",
        "hooks/auth-modules/useForgotPassword.ts",
        "hooks/auth-modules/useForgotPasswordForm.ts",
        "hooks/auth-modules/useLoginForm.ts",
        "hooks/auth-modules/useProfile.ts",
        "hooks/auth-modules/useProfileForm.ts",
        "hooks/auth-modules/useSignUp.ts",
        "hooks/auth-modules/useSignUpForm.ts",
        "hooks/auth-modules/useUpdatePassword.ts",
        "hooks/auth-modules/useUpdatePasswordForm.ts"
    ],
    "lib/handlers/auth-module/user": [
        "lib/handlers/auth-module/user/auth.handlers.ts",
        "lib/handlers/auth-module/user/index.ts"
    ],
    "lib/schema/auth-module": [
        "lib/schema/auth-module/index.ts",
        "lib/schema/auth-module/user.schema.ts"
    ],
    "lib/stores/auth-module": [
        "lib/stores/auth-module/index.ts",
        "lib/stores/auth-module/useUserStore.ts"
    ],
    "lib/supabase/adapters": [
        "lib/supabase/adapters/server.ts",
        "lib/supabase/adapters/client.ts",
        "lib/supabase/adapters/service-role.ts",
        "lib/supabase/adapters/auth-check-middleware.ts"
    ],
    "lib/supabase/auth-module/services": [
        "lib/supabase/auth-module/services/admin-user.services.ts",
        "lib/supabase/auth-module/services/user.services.ts"
    ],
    "lib/utils/auth-module": [
        "lib/utils/auth-module/password-strength.ts"
    ],
    "config/auth-config": [
        "config/auth-config.ts",
        "config/auth-config.types.ts"
    ],
    "docs": [
        "docs/docs.md"
    ]
};