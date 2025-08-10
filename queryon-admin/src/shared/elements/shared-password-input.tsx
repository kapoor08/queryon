"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BaseInputProps } from "@/types/base";
import { Eye, EyeOff } from "lucide-react";
import { forwardRef } from "react";

interface PasswordInputProps extends BaseInputProps {
  id: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showStrengthIndicator?: boolean;
}

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  (
    {
      id,
      label = "Password",
      error,
      placeholder = "Enter your password",
      className,
      containerClassName,
      required = false,
      value,
      onChange,
      showStrengthIndicator = false,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);

    const getPasswordStrength = (password: string) => {
      if (!password) return { strength: 0, text: "" };

      let strength = 0;
      if (password.length >= 8) strength++;
      if (/[a-z]/.test(password)) strength++;
      if (/[A-Z]/.test(password)) strength++;
      if (/[0-9]/.test(password)) strength++;
      if (/[^A-Za-z0-9]/.test(password)) strength++;

      const strengthTexts = ["Very Weak", "Weak", "Fair", "Good", "Strong"];
      return { strength, text: strengthTexts[strength - 1] || "" };
    };

    const passwordStrength =
      showStrengthIndicator && value ? getPasswordStrength(value) : null;

    return (
      <div className={cn("space-y-2", containerClassName)}>
        {label && (
          <Label htmlFor={id} className="text-foreground">
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </Label>
        )}
        <div className="relative">
          <Input
            ref={ref}
            id={id}
            type={showPassword ? "text" : "password"}
            placeholder={placeholder}
            required={required}
            value={value}
            onChange={onChange}
            className={cn(
              "bg-background border-border text-foreground pr-10",
              error && "border-destructive focus-visible:ring-destructive",
              className
            )}
            {...props}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Eye className="h-4 w-4 text-muted-foreground" />
            )}
          </Button>
        </div>
        {passwordStrength && (
          <div className="space-y-1">
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((level) => (
                <div
                  key={level}
                  className={cn(
                    "h-1 w-full rounded-full",
                    level <= passwordStrength.strength
                      ? level <= 2
                        ? "bg-destructive"
                        : level <= 3
                        ? "bg-yellow-500"
                        : "bg-green-500"
                      : "bg-muted"
                  )}
                />
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              {passwordStrength.text}
            </p>
          </div>
        )}
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";

export default PasswordInput;
