import type React from 'react';
import Link from 'next/link';
import { AuthFormContainer } from '@/shared/base';
import { LoginForm } from '@/shared/forms';

export default function LoginPage() {
  return (
    <AuthFormContainer
      title="Welcome back"
      description="Sign in to your account to continue"
      bottomText={
        <>
          Don&apos;t have an account?{' '}
          <Link href="/auth/signup" className="text-primary hover:underline">
            Sign up
          </Link>
        </>
      }
    >
      <LoginForm />
    </AuthFormContainer>
  );
}
