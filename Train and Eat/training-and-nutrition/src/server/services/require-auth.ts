import "server-only"
import { createClient } from "../../lib/supabase/server"

export async function requireAuth() {

  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    throw new Error("UNAUTHORIZED");
  }

  return {
    id: data.claims.sub,
    email: data.claims.email,
  };
    
}