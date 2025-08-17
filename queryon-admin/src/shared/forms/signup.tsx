'use client';
import { Button } from '@/components/ui/button';
import {
  NameInput,
  SharedCheckbox,
  TextInput,
  PasswordInput,
  TranslatableText,
} from '../elements';
import Link from 'next/link';
import { toast } from 'sonner';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const SignupForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    agreeToTerms: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Basic validation
    const newErrors: Record<string, string> = {};
    if (!formData.firstName) {
      newErrors.firstName = 'First name is required';
    }
    if (!formData.lastName) {
      newErrors.lastName = 'Last name is required';
    }
    if (!formData.email) {
      newErrors.email = 'Email is required';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    setErrors({});

    // Simulate signup
    setTimeout(() => {
      setIsLoading(false);
      toast("Welcome to ChatWidget. Let's get you started.");
      router.push('/dashboard');
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <NameInput
        firstNameValue={formData.firstName}
        lastNameValue={formData.lastName}
        onFirstNameChange={(e) =>
          setFormData({ ...formData, firstName: e.target.value })
        }
        onLastNameChange={(e) =>
          setFormData({ ...formData, lastName: e.target.value })
        }
        firstNameError={errors.firstName}
        lastNameError={errors.lastName}
        required
      />

      <TextInput
        id="email"
        type="email"
        label="Email"
        placeholder="john@example.com"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        error={errors.email}
        required
      />

      <PasswordInput
        id="password"
        label="Password"
        placeholder="Create a strong password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        error={errors.password}
        showStrengthIndicator
        required
      />

      <SharedCheckbox
        id="terms"
        label={
          <>
            <TranslatableText text="I agree to the" />{' '}
            <Link href="/terms" className="text-primary hover:underline">
              <TranslatableText text="Terms of Service" />
            </Link>{' '}
            <TranslatableText text="and" />{' '}
            <Link href="/privacy" className="text-primary hover:underline">
              <TranslatableText text="Privacy Policy" />
            </Link>
          </>
        }
        checked={formData.agreeToTerms}
        onChange={(checked) =>
          setFormData({ ...formData, agreeToTerms: checked })
        }
        error={errors.agreeToTerms}
        required
      />

      <Button
        type="submit"
        className="w-full cursor-pointer"
        disabled={isLoading}
      >
        <TranslatableText
          text={isLoading ? 'Creating account...' : 'Create account'}
        />
      </Button>
    </form>
  );
};

export default SignupForm;
