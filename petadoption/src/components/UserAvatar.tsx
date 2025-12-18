/**
 * UserAvatar Component
 * -------------------------------------------------------
 * Displays a user's profile image. Used in chat-message.tsx component for chat functionality.
 *
 */

"use client";

import Image from "next/image";

interface UserAvatarProps {
    imageUrl?: string | null;
    size?: number;
}

export default function UserAvatar({ imageUrl, size = 36 }: UserAvatarProps) {
    return (
        <Image
            src={imageUrl || "/profile-generic.jpg"}
            alt="User avatar"
            width={size}
            height={size}
            className="rounded-full object-cover border border-gray-300"
        />
    );
}
