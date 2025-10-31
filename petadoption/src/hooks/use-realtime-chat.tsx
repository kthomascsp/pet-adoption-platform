import { useEffect, useState } from 'react';
import { supabase } from '@/lib/client';

export interface ChatMessage {
  id: number;
  senderId: string;
  content: string;
  messageDateTime: string;
}

export function useRealtimeChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);


  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await supabase
          .from('message')
          .select(`
          id: MessageID,
          senderId: SenderID,
          content: Content,
          messageDateTime: MessageDateTime
        `)
          .order('MessageDateTime', { ascending: true });

      console.log('Fetched messages:', data, error);
      if (error) console.error('Fetch error:', error);
      else setMessages(data || []);
    };
    fetchMessages();
  }, []);


  useEffect(() => {
    console.log('Subscribing to realtime...');
    const channel = supabase
        .channel('public:message')
        .on(
            'postgres_changes',
            { event: 'INSERT', schema: 'public', table: 'message' },
            (payload) => {
              console.log('Realtime payload:', payload);
              const m = payload.new as any;
              const newMessage: ChatMessage = {
                id: m.MessageID,
                senderId: m.SenderID,
                content: m.Content,
                messageDateTime: m.MessageDateTime,
              };
              setMessages((prev) => [...prev, newMessage]);
            }
        )
        .subscribe((status) => console.log('Subscription status:', status));

    return () => {
      console.log('Unsubscribed from realtime');
      channel.unsubscribe();
    };
  }, []);


  const sendMessage = async (senderId: string, content: string) => {
    console.log('Inserting message:', { senderId, content });
    const { data, error } = await supabase.from('message').insert([
      {
        SenderID: senderId,
        Content: content,
        MessageDateTime: new Date().toISOString(),
      },
    ]);
    console.log('Insert result:', { data, error });
  };

  return { messages, sendMessage };
}
