import { Badge } from '@/components/ui/badge';
import { getBadgeVariant, getBadgeLabel } from '@/types/types';
import type { DetectionResultType } from '@/types/types';
import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

interface ResultBadgeProps {
  result: DetectionResultType;
  confidence: number;
  showIcon?: boolean;
}

export function ResultBadge({ result, confidence, showIcon = true }: ResultBadgeProps) {
  const variant = getBadgeVariant(confidence);
  const label = getBadgeLabel(result, confidence);

  const getIcon = () => {
    if (!showIcon) return null;
    
    const iconClass = 'w-4 h-4 mr-1';
    if (variant === 'success') return <CheckCircle2 className={iconClass} />;
    if (variant === 'warning') return <AlertTriangle className={iconClass} />;
    return <XCircle className={iconClass} />;
  };

  return (
    <Badge 
      variant={variant}
      className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide"
    >
      {getIcon()}
      {label}
    </Badge>
  );
}
