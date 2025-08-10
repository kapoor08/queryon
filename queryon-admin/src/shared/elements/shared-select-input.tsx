import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { BaseInputProps } from "@/types/base";

interface SelectInputProps extends BaseInputProps {
  id: string;
  options: { value: string; label: string }[];
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
}

const SharedSelect = ({
  id,
  label,
  error,
  options,
  placeholder = "Select an option",
  className,
  containerClassName,
  required = false,
  value,
  onChange,
}: SelectInputProps) => {
  return (
    <div className={cn("space-y-2", containerClassName)}>
      {label && (
        <Label htmlFor={id} className="text-foreground">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}
      <select
        id={id}
        value={value || ""}
        onChange={(e) => onChange?.(e.target.value)}
        required={required}
        className={cn(
          "flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          error && "border-destructive focus-visible:ring-destructive",
          className
        )}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
};

export default SharedSelect;
