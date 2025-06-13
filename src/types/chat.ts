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

export interface ChatResponse {
  room_id: string;
  partner_id: string;
  sender_id: string;
  partner_avatar: string;
  partner_username: string;
  partner_display_name: string;
  last_message: ChatMessage;
}
