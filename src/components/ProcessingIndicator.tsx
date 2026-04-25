import { Progress } from '@/components/ui/progress';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProcessingIndicatorProps {
  message?: string;
  className?: string;
}

export function ProcessingIndicator({ 
  message = 'Analyzing content...', 
  className 
}: ProcessingIndicatorProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-4 py-8', className)}>
      <Loader2 className="w-12 h-12 text-primary animate-spin" />
      <div className="w-full max-w-md space-y-2">
        <p className="text-sm font-medium text-center text-foreground">{message}</p>
        <Progress value={undefined} className="h-1" />
      </div>
    </div>
  );
}
