import { createClient } from "@/lib/supabase/client";

const supabase = createClient()

export async function getCurrentUser() {
    const {
        data: { user },
        error,
    } = await supabase.auth.getUser();

    if (error) throw error;

    return user;
}