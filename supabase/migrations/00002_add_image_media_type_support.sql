-- Update the check constraint to include 'image' media type
ALTER TABLE detection_history 
DROP CONSTRAINT IF EXISTS detection_history_media_type_check;

ALTER TABLE detection_history 
ADD CONSTRAINT detection_history_media_type_check 
CHECK (media_type IN ('image', 'video', 'audio', 'text'));