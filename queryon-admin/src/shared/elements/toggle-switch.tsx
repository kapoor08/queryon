'use client';

import { cn } from '@/lib/utils';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import TranslatableText from './translatable-text';

interface ToggleSwitchProps {
  leftLabel: string;
  rightLabel: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  showBadge?: boolean;
  badgeText?: string;
}

const ToggleSwitch = ({
  leftLabel,
  rightLabel,
  checked,
  onChange,
  showBadge = false,
  badgeText,
}: ToggleSwitchProps) => {
  return (
    <div className="flex items-center justify-center gap-4 mb-12">
      <span
        className={cn(
          'text-sm font-medium',
          !checked ? 'text-foreground' : 'text-muted-foreground'
        )}
      >
        <TranslatableText text={leftLabel} />
      </span>

      <Switch
        checked={checked}
        onCheckedChange={onChange}
        className="data-[state=checked]:bg-primary"
      />

      <span
        className={cn(
          'text-sm font-medium',
          checked ? 'text-foreground' : 'text-muted-foreground'
        )}
      >
        <TranslatableText text={rightLabel} />
      </span>

      {showBadge && checked && (
        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
          {badgeText}
        </Badge>
      )}
    </div>
  );
};

export default ToggleSwitch;
