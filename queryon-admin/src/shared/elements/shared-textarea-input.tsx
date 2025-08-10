import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { BaseInputProps } from "@/types/base";
import { forwardRef } from "react";

interface TextareaInputProps extends BaseInputProps {
  id: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  rows?: number;
  maxLength?: number;
}

const SharedTextarea = forwardRef<HTMLTextAreaElement, TextareaInputProps>(
  (
    {
      id,
      label,
      error,
      placeholder,
      className,
      containerClassName,
      required = false,
      value,
      onChange,
      rows = 4,
      maxLength,
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
        <Textarea
          ref={ref}
          id={id}
          placeholder={placeholder}
          required={required}
          value={value}
          onChange={onChange}
          rows={rows}
          maxLength={maxLength}
          className={cn(
            "bg-background border-border text-foreground resize-none",
            error && "border-destructive focus-visible:ring-destructive",
            className
          )}
          {...props}
        />
        <div className="flex justify-between items-center">
          {error && <p className="text-sm text-destructive">{error}</p>}
          {maxLength && (
            <p className="text-xs text-muted-foreground ml-auto">
              {value?.length || 0}/{maxLength}
            </p>
          )}
        </div>
      </div>
    );
  }
);
SharedTextarea.displayName = "SharedTextarea";

export default SharedTextarea;
