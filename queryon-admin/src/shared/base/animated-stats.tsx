import { STATS } from '@/data';
import { cn } from '@/lib/utils';
import { ICommonTypes } from '@/types/base';
import { TranslatableText } from '../elements/client';

const AnimatedStats = ({ isLoaded }: Pick<ICommonTypes, 'isLoaded'>) => {
  return (
    <div className="grid grid-cols-3 gap-8 pt-8 border-t border-slate-700/50">
      {STATS.map((stat, index) => (
        <div
          key={index}
          className={cn(
            'text-center group cursor-pointer transition-all duration-500 hover:scale-110 will-change-transform',
            isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          )}
          style={{ transitionDelay: `${(index + 1) * 200}ms` }}
        >
          <div className="flex items-center justify-center mb-2">
            <div
              className={cn(
                'p-2 rounded-full bg-white/5 group-hover:bg-white/10 transition-all duration-300',
                stat.color
              )}
            >
              <stat.icon className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
            </div>
          </div>
          <div
            className={cn(
              'text-3xl font-bold group-hover:scale-110 transition-all duration-300',
              stat.color
            )}
          >
            {stat.value}
          </div>
          <TranslatableText
            text={stat.label}
            as="div"
            className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors duration-300"
          />
        </div>
      ))}
    </div>
  );
};

export default AnimatedStats;
