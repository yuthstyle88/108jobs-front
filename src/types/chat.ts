export interface ChatMessage {
  id: string;
  sender_id: string;
  content: string;
  file_url: string | null;
  file_type: string | null;
  status: number;
  created_at: string;
  updated_at: string;
  room_id: string;
}
