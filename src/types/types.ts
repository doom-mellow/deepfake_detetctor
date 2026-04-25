// Media types supported by the detection platform
export type MediaType = 'image' | 'video' | 'audio' | 'text';

// Detection result types
export type DetectionResultType = 'real' | 'ai-generated';

// Detection result interface
export interface DetectionResult {
  result: DetectionResultType;
  confidence: number;
  explanation: string;
  indicators: string[];
}

// History record from database
export interface HistoryRecord {
  id: string;
  media_type: MediaType;
  result: DetectionResultType;
  confidence: number;
  content_preview: string | null;
  file_name: string | null;
  created_at: string;
}

// Detection request interface
export interface DetectionRequest {
  mediaType: MediaType;
  content?: string;
  file?: File;
  url?: string;
}

// Badge variant based on confidence score
export type BadgeVariant = 'success' | 'warning' | 'destructive';

export function getBadgeVariant(confidence: number): BadgeVariant {
  if (confidence <= 30) return 'success';
  if (confidence <= 69) return 'warning';
  return 'destructive';
}

export function getBadgeLabel(result: DetectionResultType, confidence: number): string {
  if (confidence <= 30) return 'Real Content';
  if (confidence <= 69) return 'Uncertain';
  return 'AI-Generated';
}
