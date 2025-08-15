import type React from 'react';
import Link from 'next/link';
import { AuthFormContainer } from '@/shared/base';
import { SignupForm } from '@/shared/forms';

export default function SignupPage() {
  return (
    <AuthFormContainer
      title="Create your account"
      description="Get started with your free 14-day trial"
      bottomText={
        <>
          Already have an account?{' '}
          <Link href="/auth/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <SignupForm />
    </AuthFormContainer>
  );
}
