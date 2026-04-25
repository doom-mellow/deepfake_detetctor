import { cn } from '@/lib/utils';

interface ConfidenceScoreProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function ConfidenceScore({ score, size = 'md', className }: ConfidenceScoreProps) {
  // Determine color based on score
  const getColor = () => {
    if (score <= 30) return 'text-success';
    if (score <= 69) return 'text-warning';
    return 'text-destructive';
  };

  const getStrokeColor = () => {
    if (score <= 30) return 'stroke-success';
    if (score <= 69) return 'stroke-warning';
    return 'stroke-destructive';
  };

  const sizes = {
    sm: { radius: 40, stroke: 6, fontSize: 'text-lg', labelSize: 'text-xs' },
    md: { radius: 60, stroke: 8, fontSize: 'text-3xl', labelSize: 'text-sm' },
    lg: { radius: 80, stroke: 10, fontSize: 'text-5xl', labelSize: 'text-base' }
  };

  const config = sizes[size];
  const circumference = 2 * Math.PI * config.radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className={cn('flex flex-col items-center gap-2', className)}>
      <div className="relative">
        <svg
          width={(config.radius + config.stroke) * 2}
          height={(config.radius + config.stroke) * 2}
          className="transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            cx={config.radius + config.stroke}
            cy={config.radius + config.stroke}
            r={config.radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={config.stroke}
            className="text-muted"
          />
          {/* Progress circle */}
          <circle
            cx={config.radius + config.stroke}
            cy={config.radius + config.stroke}
            r={config.radius}
            fill="none"
            strokeWidth={config.stroke}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className={cn('transition-all duration-1000 ease-out', getStrokeColor())}
          />
        </svg>
        {/* Score text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn('font-bold', config.fontSize, getColor())}>{score}</span>
          <span className={cn('text-muted-foreground', config.labelSize)}>Confidence</span>
        </div>
      </div>
    </div>
  );
}
