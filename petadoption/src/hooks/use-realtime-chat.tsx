/**
 * Hook that manages real-time chat behavior.
 * - Fetches all existing messages and sender names.
 * - Subscribes to new message inserts via Supabase Realtime.
 * - Provides a function to send new messages.
 */

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

// Message structure from the database
export interface ChatMessage {
    id: number;
    senderId: string;
    content: string;
    messageDateTime: string;
    threadKey: string;
}

/**
 * useRealtimeChat
 * @param threadKey string that identifies the "room" (for multiple threads)
 *
 */

export function useRealtimeChat(threadKey: string) {//, currentUser: any
    const supabase = createClient();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [userNames, setUserNames] = useState<Record<string, string>>({});

    // Load initial messages for THIS thread + sender names
    useEffect(() => {
        const fetchMessages = async () => {
            const { data, error } = await supabase
                .from('message')
                .select(`
          id: MessageID,
          senderId: SenderID,
          content: Content,
          messageDateTime: MessageDateTime,
          threadKey: ThreadKey
        `)
                .eq('ThreadKey', threadKey)
                .order('MessageDateTime', { ascending: true });

            if (error) {
                console.error('Fetch error:', error);
                return;
            }

            setMessages(data || []);

            // Extract unique sender IDs
            const senderIds = [...new Set((data ?? []).map(m => m.senderId))];

            if (senderIds.length > 0) {
                const { data: profiles } = await supabase
                    .from('Profile')
                    .select('ProfileID, ProfileName, LastName')
                    .in('ProfileID', senderIds);

                const nameMap = Object.fromEntries(
                    (profiles ?? []).map(p => [p.ProfileID, `${p.ProfileName} ${p.LastName}`.trim()])
                );
                setUserNames(nameMap);
            }
        };

        fetchMessages();
    }, [threadKey]);

    // Subscribe to new messages for THIS thread in real-time
    useEffect(() => {
        const channel = supabase
            .channel(`message-room-${threadKey}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'message',
                    filter: `ThreadKey=eq.${threadKey}`,
                },
                async (payload) => {
                    const m = payload.new as any;
                    const senderId = m.SenderID;

                    // Fetch name for unknown sender IDs
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
                        threadKey: m.ThreadKey,
                    };

                    setMessages(prev => [...prev, newMessage]);
                }
            )
            .subscribe();

        return () => {
            channel.unsubscribe();
        };
    }, [threadKey, userNames]);

    /**
     * Sends a new message to the Supabase database for THIS thread.
     */
    const sendMessage = async (senderId: string, content: string) => {

        //check supa base names
        //if(currentUser.accountType == "shelter" && userNames.id !== currentUser.ProfileID) {
          //  return ("error");
        //}

        await supabase.from('message').insert([
            {
                SenderID: senderId,
                Content: content,
                MessageDateTime: new Date().toISOString(),
                ThreadKey: threadKey, // 👈 tie it to this board
            },
        ]);
    };

    return { messages, sendMessage, userNames };
}
