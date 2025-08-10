"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components";
import { MessageSquare, Github, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  NameInput,
  PasswordInput,
  SharedCheckbox,
  TextInput,
} from "@/shared/elements";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
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
      newErrors.firstName = "First name is required";
    }
    if (!formData.lastName) {
      newErrors.lastName = "Last name is required";
    }
    if (!formData.email) {
      newErrors.email = "Email is required";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    }
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the terms and conditions";
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
      router.push("/dashboard");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <Card className="w-full max-w-md bg-card border-border">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">
              ChatWidget
            </span>
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">
            Create your account
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Get started with your free 14-day trial
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
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
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              error={errors.email}
              required
            />

            <PasswordInput
              id="password"
              label="Password"
              placeholder="Create a strong password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              error={errors.password}
              showStrengthIndicator
              required
            />

            <SharedCheckbox
              id="terms"
              label={
                <>
                  I agree to the{" "}
                  <Link href="/terms" className="text-primary hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="text-primary hover:underline"
                  >
                    Privacy Policy
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

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Create account"}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="w-full bg-transparent">
              <Github className="mr-2 h-4 w-4" />
              GitHub
            </Button>
            <Button variant="outline" className="w-full bg-transparent">
              <Mail className="mr-2 h-4 w-4" />
              Google
            </Button>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
