'use client';

import React from 'react';
import { ChatMessage } from '@/hooks/use-realtime-chat';

interface ChatMessageItemProps {
    message: ChatMessage;
}

export const ChatMessageItem: React.FC<ChatMessageItemProps> = ({ message }) => {
    const formattedTime = message.messageDateTime
        ? new Date(message.messageDateTime).toLocaleString([], {
            hour: '2-digit',
            minute: '2-digit',
            month: 'short',
            day: 'numeric',
        })
        : 'No time';

    return (
        <div className="p-4 border rounded-lg bg-white shadow-sm hover:shadow transition">
            <div className="flex justify-between items-center mb-1 text-sm text-gray-500">
                {/* Sender ID (first 8 chars to keep it compact) */}
                <span className="font-semibold text-indigo-600">
          {message.senderId ? message.senderId.slice(0, 8) : 'Unknown'}
        </span>

                {/* Timestamp */}
                <span className="text-gray-400">{formattedTime}</span>
            </div>

            {/* Message content */}
            <p className="text-gray-800 leading-relaxed">
                {message.content || <span className="italic text-gray-400">No content</span>}
            </p>
        </div>
    );
};
