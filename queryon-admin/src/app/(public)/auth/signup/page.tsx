import type React from 'react';
import Link from 'next/link';
import { AuthFormContainer } from '@/shared/base';
import { SignupForm } from '@/shared/forms';
import { TranslatableText } from '@/shared/elements';

export default function SignupPage() {
  return (
    <AuthFormContainer
      title="Create your account"
      description="Get started with your free 14-day trial"
      bottomText={
        <>
          <TranslatableText text="Don't have an account?" />{' '}
          <Link href="/auth/login" className="text-primary hover:underline">
            <TranslatableText text="Sign in" />
          </Link>
        </>
      }
    >
      <SignupForm />
    </AuthFormContainer>
  );
}
