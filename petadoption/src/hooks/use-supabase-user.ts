import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

export function useSupabaseUser() {
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        const supabase = createClient();

        // Initial check
        supabase.auth.getUser().then(({ data }) => {
            setUserId(data.user?.id ?? null);
        });

        // Listen for login/logout
        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            setUserId(session?.user?.id ?? null);
        });

        return () => listener.subscription.unsubscribe();
    }, []);

    return userId;
}