import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { BaseInputProps } from "@/types/base";
import { forwardRef } from "react";

interface TextInputProps extends BaseInputProps {
  id: string;
  placeholder?: string;
  type?: "text" | "email" | "tel" | "url";
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  (
    {
      id,
      label,
      error,
      placeholder,
      type = "text",
      className,
      containerClassName,
      required = false,
      value,
      onChange,
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
        <Input
          ref={ref}
          id={id}
          type={type}
          placeholder={placeholder}
          required={required}
          value={value}
          onChange={onChange}
          className={cn(
            "bg-background border-border text-foreground",
            error && "border-destructive focus-visible:ring-destructive",
            className
          )}
          {...props}
        />
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    );
  }
);
TextInput.displayName = "TextInput";

export default TextInput;
