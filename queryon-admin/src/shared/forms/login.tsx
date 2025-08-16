'use client';
import Link from 'next/link';
import { SharedCheckbox, TextInput } from '../elements';
import { PasswordInput, TranslatableText } from '../elements/client';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Basic validation
    const newErrors: Record<string, string> = {};
    if (!formData.email) {
      newErrors.email = 'Email is required';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    setErrors({});

    // Simulate login
    setTimeout(() => {
      setIsLoading(false);
      toast('You have been successfully logged in.');
      router.push('/user/dashboard');
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <TextInput
        id="email"
        type="email"
        label="Email"
        placeholder="Enter your email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        error={errors.email}
        required
      />

      <PasswordInput
        id="password"
        label="Password"
        placeholder="Enter your password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        error={errors.password}
        required
      />

      <div className="flex items-center justify-between">
        <SharedCheckbox
          id="remember"
          label="Remember me"
          checked={formData.rememberMe}
          onChange={(checked) =>
            setFormData({ ...formData, rememberMe: checked })
          }
        />
        <Link
          href="/auth/forgot-password"
          className="text-sm text-primary hover:underline"
        >
          Forgot password?
        </Link>
      </div>

      <Button
        type="submit"
        className="w-full cursor-pointer"
        disabled={isLoading}
      >
        <TranslatableText text={isLoading ? 'Signing in...' : 'Sign in'} />
      </Button>
    </form>
  );
};

export default LoginForm;
