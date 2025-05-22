import React from 'react';
import { LoginForm } from '@/components/login-form';
import { useTheme } from '@/components/theme-provider';

const LoginPage: React.FC = () => {

  const theme = useTheme();

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="/" className="flex items-center gap-2 self-center font-medium">
          <div className="flex items-center justify-center rounded-lg">
            {theme.isDark ? (
              <img src="/vilista_full.svg" alt="Vilista" className="h-8" />
            ) : (
              <img src="/vilista_full_light.svg" alt="Vilista" className="h-8" />
            )}
          </div>
        </a>
        <LoginForm className="w-full" />
      </div>
    </div>
  );
};

export default LoginPage;
