import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { BaseInputProps } from "@/types/base";
import { forwardRef } from "react";

interface PhoneInputProps extends BaseInputProps {
  id: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  countryCode?: string;
}

const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  (
    {
      id,
      label = "Phone number",
      error,
      placeholder = "+1 (555) 000-0000",
      className,
      containerClassName,
      required = false,
      value,
      onChange,
      countryCode = "+1",
      ...props
    },
    ref
  ) => {
    return (
      <div className={cn("space-y-2", containerClassName)}>
        {label && (
          <Label htmlFor={id} className="text-foreground">
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </Label>
        )}
        <div className="flex">
          <div className="flex items-center px-3 border border-r-0 border-border rounded-l-md bg-muted">
            <span className="text-sm text-muted-foreground">{countryCode}</span>
          </div>
          <Input
            ref={ref}
            id={id}
            type="tel"
            placeholder={placeholder}
            required={required}
            value={value}
            onChange={onChange}
            className={cn(
              "bg-background border-border text-foreground rounded-l-none",
              error && "border-destructive focus-visible:ring-destructive",
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    );
  }
);
PhoneInput.displayName = "PhoneInput";

export default PhoneInput;
