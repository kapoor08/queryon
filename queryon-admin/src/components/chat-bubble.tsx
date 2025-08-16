import Image from 'next/image';
import { cn } from '@/lib/utils';
import { ALL_THEMES } from '@/data';
import { CheckIcon, DoubleCheckIcon } from './icons';
import { TranslatableText } from '@/shared/elements/client';

interface IChatBubble {
  message: string;
  type?: 'sent' | 'received';
  timestamp?: string;
  avatar?: string;
  status?: 'sending' | 'sent' | 'delivered' | 'read';
}

const ChatBubble = ({
  message,
  type = 'sent',
  timestamp,
  avatar,
  status,
}: IChatBubble) => {
  const WidgetConfig = ALL_THEMES[3];
  const isReceived = type === 'received';
  const theme = WidgetConfig.colors;

  const getStatusIcon = () => {
    if (type === 'received') return null;

    switch (status) {
      case 'sending':
        return (
          <div className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin" />
        );
      case 'sent':
        return <CheckIcon className="w-3 h-3 text-gray-400" />;
      case 'delivered':
        return <DoubleCheckIcon className="w-3 h-3 text-gray-400" />;
      case 'read':
        return <DoubleCheckIcon className="w-3 h-3 text-blue-500" />;
      default:
        return null;
    }
  };

  return (
    <div
      className={cn('flex items-start space-x-2 mb-4', {
        'flex-row-reverse space-x-reverse': type === 'sent',
      })}
    >
      {/* Avatar for received messages */}
      {isReceived && (
        <div
          className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
          style={{ backgroundColor: theme.primary }}
        >
          {avatar ? (
            <Image
              src={avatar || '/placeholder.svg'}
              alt="Support"
              width={32}
              height={32}
              className="w-8 h-8 rounded-full"
            />
          ) : (
            <span className="text-white text-xs font-medium">CS</span>
          )}
        </div>
      )}

      <div
        className={cn('flex flex-col', {
          'items-end': type === 'sent',
          'items-start': isReceived,
        })}
      >
        {/* Message bubble */}
        <TranslatableText
          className={cn(
            'px-4 py-2 rounded-2xl text-sm max-w-[240px] word-wrap break-words',
            {
              'rounded-br-md': type === 'sent',
              'rounded-bl-md shadow-sm': isReceived,
            }
          )}
          style={{
            backgroundColor: type === 'sent' ? theme.sent : theme.received,
            color: type === 'sent' ? 'white' : theme.text,
            border: type === 'received' ? `1px solid ${theme.border}` : 'none',
          }}
          text={message}
          as="div"
        />

        {/* Timestamp and Status */}
        {(timestamp || status) && (
          <div className="flex items-center space-x-1 mt-1 px-1">
            {timestamp && (
              <span className="text-xs" style={{ color: theme.textSecondary }}>
                {timestamp}
              </span>
            )}
            {getStatusIcon()}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatBubble;
