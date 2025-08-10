import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface CheckboxInputProps {
  id: string;
  label: React.ReactNode;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  required?: boolean;
  error?: string;
  className?: string;
  containerClassName?: string;
}

const SharedCheckbox = ({
  id,
  label,
  checked,
  onChange,
  required = false,
  error,
  className,
  containerClassName,
}: CheckboxInputProps) => {
  return (
    <div className={cn("space-y-2", containerClassName)}>
      <div className="flex items-center space-x-2">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange?.(e.target.checked)}
          required={required}
          className={cn(
            "rounded border-border text-primary focus:ring-primary",
            error && "border-destructive",
            className
          )}
        />
        <Label
          htmlFor={id}
          className="text-sm text-muted-foreground cursor-pointer"
        >
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
};

export default SharedCheckbox;
