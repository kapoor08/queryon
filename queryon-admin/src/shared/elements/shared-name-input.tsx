import { cn } from "@/lib/utils";
import TextInput from "./shared-text-input";

interface NameInputProps {
  firstNameId?: string;
  lastNameId?: string;
  firstNameLabel?: string;
  lastNameLabel?: string;
  firstNamePlaceholder?: string;
  lastNamePlaceholder?: string;
  firstNameValue?: string;
  lastNameValue?: string;
  onFirstNameChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onLastNameChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  firstNameError?: string;
  lastNameError?: string;
  required?: boolean;
  containerClassName?: string;
}

const NameInput = ({
  firstNameId = "firstName",
  lastNameId = "lastName",
  firstNameLabel = "First name",
  lastNameLabel = "Last name",
  firstNamePlaceholder = "John",
  lastNamePlaceholder = "Doe",
  firstNameValue,
  lastNameValue,
  onFirstNameChange,
  onLastNameChange,
  firstNameError,
  lastNameError,
  required = false,
  containerClassName,
}: NameInputProps) => {
  return (
    <div className={cn("grid grid-cols-2 gap-4", containerClassName)}>
      <TextInput
        id={firstNameId}
        label={firstNameLabel}
        placeholder={firstNamePlaceholder}
        value={firstNameValue}
        onChange={onFirstNameChange}
        error={firstNameError}
        required={required}
      />
      <TextInput
        id={lastNameId}
        label={lastNameLabel}
        placeholder={lastNamePlaceholder}
        value={lastNameValue}
        onChange={onLastNameChange}
        error={lastNameError}
        required={required}
      />
    </div>
  );
};

export default NameInput;
