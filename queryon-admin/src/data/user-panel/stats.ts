import { Bot, Key, MessageSquare, CreditCard } from 'lucide-react';

export const stats = [
  {
    title: 'Active Widgets',
    value: '2',
    limit: '3',
    icon: Bot,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 dark:bg-blue-950',
  },
  {
    title: 'Monthly Queries',
    value: '1,250',
    limit: '500',
    icon: MessageSquare,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50 dark:bg-purple-950',
    isOverLimit: true,
  },
  {
    title: 'API Keys',
    value: '1',
    icon: Key,
    color: 'text-green-600',
    bgColor: 'bg-green-50 dark:bg-green-950',
  },
  {
    title: 'Current Plan',
    value: 'Pro',
    icon: CreditCard,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50 dark:bg-orange-950',
  },
];
