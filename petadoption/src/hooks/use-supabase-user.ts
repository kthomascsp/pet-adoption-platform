/**
 * Custom React hook to retrieve and track the current Supabase user's ID.
 * - Fetches the user on mount.
 * - Listens for login and logout changes in real time.
 * - Returns `null` when no user is logged in.
 */

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

export function useSupabaseUser() {
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        const supabase = createClient();

        // Fetch the current user once on mount
        supabase.auth.getUser().then(({ data }) => {
            setUserId(data.user?.id ?? null);
        });

        // Subscribe to auth changes (login/logout)
        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            setUserId(session?.user?.id ?? null);
        });

        // Clean up listener on unmount
        return () => listener.subscription.unsubscribe();
    }, []);

    return userId;
}
