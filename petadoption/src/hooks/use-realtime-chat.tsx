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
    const [userNames, setUserNames] = useState<Record<string, string>>({});

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

            if (error) {
                console.error('Fetch error:', error);
                return;
            }

            setMessages(data || []);
            const senderIds = [...new Set(data?.map(m => m.senderId))];

            if (senderIds.length > 0) {
                const { data: profiles } = await supabase
                    .from('Profile')
                    .select('ProfileID, ProfileName, LastName')
                    .in('ProfileID', senderIds);

                const nameMap = Object.fromEntries(
                    profiles?.map(p => [p.ProfileID, `${p.ProfileName} ${p.LastName}`.trim()]) ?? []
                );
                setUserNames(nameMap);
            }
        };
        fetchMessages();
    }, []);

    useEffect(() => {
        const channel = supabase
            .channel('public:message')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'message' },
                async (payload) => {
                    const m = payload.new as any;
                    const senderId = m.SenderID;

                    if (!userNames[senderId]) {
                        const { data: profile } = await supabase
                            .from('Profile')
                            .select('ProfileName, LastName')
                            .eq('ProfileID', senderId)
                            .single();

                        if (profile) {
                            const fullName = `${profile.ProfileName} ${profile.LastName}`.trim();
                            setUserNames(prev => ({ ...prev, [senderId]: fullName }));
                        }
                    }

                    const newMessage: ChatMessage = {
                        id: m.MessageID,
                        senderId: m.SenderID,
                        content: m.Content,
                        messageDateTime: m.MessageDateTime,
                    };
                    setMessages(prev => [...prev, newMessage]);
                }
            )
            .subscribe();

        return () => { channel.unsubscribe(); };
    }, [userNames]);

    const sendMessage = async (senderId: string, content: string) => {
        await supabase.from('message').insert([
            {
                SenderID: senderId,
                Content: content,
                MessageDateTime: new Date().toISOString(),
            },
        ]);
    };

    return { messages, sendMessage, userNames };
}