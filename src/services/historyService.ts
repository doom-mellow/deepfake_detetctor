import { supabase } from '@/db/supabase';
import type { HistoryRecord, DetectionResultType, MediaType } from '@/types/types';

/**
 * Save detection result to history
 */
export async function saveToHistory(
  mediaType: MediaType,
  result: DetectionResultType,
  confidence: number,
  contentPreview: string | null,
  fileName: string | null
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('detection_history')
      .insert({
        media_type: mediaType,
        result,
        confidence,
        content_preview: contentPreview,
        file_name: fileName
      });

    if (error) {
      console.error('Error saving to history:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Error saving to history:', error);
    return { success: false, error: 'Failed to save to history' };
  }
}

/**
 * Fetch detection history with pagination
 */
export async function fetchHistory(
  page = 1,
  pageSize = 10
): Promise<{ data: HistoryRecord[]; total: number; error?: string }> {
  try {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, error, count } = await supabase
      .from('detection_history')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) {
      console.error('Error fetching history:', error);
      return { data: [], total: 0, error: error.message };
    }

    return { data: data || [], total: count || 0 };
  } catch (error) {
    console.error('Error fetching history:', error);
    return { data: [], total: 0, error: 'Failed to fetch history' };
  }
}

/**
 * Delete a history record
 */
export async function deleteHistoryRecord(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('detection_history')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting record:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Error deleting record:', error);
    return { success: false, error: 'Failed to delete record' };
  }
}

/**
 * Fetch a single history record by ID
 */
export async function fetchHistoryRecord(id: string): Promise<{ data: HistoryRecord | null; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('detection_history')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching record:', error);
      return { data: null, error: error.message };
    }

    return { data };
  } catch (error) {
    console.error('Error fetching record:', error);
    return { data: null, error: 'Failed to fetch record' };
  }
}