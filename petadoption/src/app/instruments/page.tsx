//https://supabase.com/docs/guides/getting-started/quickstarts/nextjs
import { createClient } from "@/utils/supabase/server";

export default async function Instruments() {
    const supabase = await createClient();
    const { data: instruments } = await supabase
        .from("instruments" as never)
        .select();

    return <pre>{JSON.stringify(instruments, null, 2)}</pre>;
}
