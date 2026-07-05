// ⚠️ STUB — not wired up yet. Lands in the next session (game loop).
//
// Purpose: authoritatively assign imposters + secret words at the start of
// each round, server-side, so a client can NEVER read another player's word
// by inspecting network traffic.
//
// Plan for next session:
//   1. Verify the caller is the room host (check auth uid == rooms.host_id).
//   2. Read the room's players + settings.
//   3. Randomly pick `settings.imposterCount` imposters.
//   4. Pick a [crewWord, imposterWord] pair (static list now; Groq later).
//   5. Write one row per player into `assignments`
//        (round_id, player_id, role, word)
//      using the service-role key (bypasses RLS for the write).
//   6. RLS on `assignments` lets each player SELECT only their own row
//        => the secret word is delivered privately per player.
//
// Deploy with: supabase functions deploy assign-roles

// deno-lint-ignore no-explicit-any
export default async function handler(_req: any): Promise<Response> {
  return new Response(
    JSON.stringify({ error: "not implemented yet" }),
    { status: 501, headers: { "content-type": "application/json" } },
  );
}
