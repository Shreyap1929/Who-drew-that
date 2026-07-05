"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/ui/Logo";
import DoodleBg from "@/components/ui/DoodleBg";
import DoodleButton from "@/components/ui/DoodleButton";
import StickyCard from "@/components/ui/StickyCard";
import WobbleInput from "@/components/ui/WobbleInput";
import OfflineNotice from "@/components/ui/OfflineNotice";
import { getIdentity } from "@/lib/identity";
import { normalizeRoomCode, isValidRoomCode } from "@/lib/roomCode";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { joinRoom } from "@/lib/rooms";

export default function JoinPage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!getIdentity()) {
      router.replace("/");
      return;
    }
    // Prefill from an invite link (?code=ABCD) without needing Suspense.
    const url = new URL(window.location.href);
    const prefill = url.searchParams.get("code");
    if (prefill) setCode(normalizeRoomCode(prefill));
  }, [router]);

  const onJoin = async () => {
    const identity = getIdentity();
    if (!identity) return router.push("/");
    if (!isValidRoomCode(code)) {
      setError("That code doesn't look right (4 letters/numbers).");
      return;
    }
    setBusy(true);
    setError(null);
    const res = await joinRoom(code, identity);
    if (res.ok) router.push(`/room/${res.code}`);
    else {
      setError(res.error);
      setBusy(false);
    }
  };

  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center px-5 py-8">
      <DoodleBg />

      <Link href="/" className="mb-6">
        <Logo size="sm" />
      </Link>

      {!isSupabaseConfigured && (
        <div className="mb-5">
          <OfflineNotice />
        </div>
      )}

      <StickyCard color="blue" tilt={-1} seed={23} className="w-full max-w-sm">
        <h2 className="font-display mb-1 text-center text-3xl">🚪 Join a Room</h2>
        <p className="font-hand mb-4 text-center text-lg text-ink-soft">
          Enter the 4-character code your host shared.
        </p>

        <WobbleInput
          aria-label="Room code"
          placeholder="ABCD"
          value={code}
          onChange={(e) => setCode(normalizeRoomCode(e.target.value))}
          onKeyDown={(e) => e.key === "Enter" && onJoin()}
          fieldClassName="text-center text-4xl tracking-[0.4em] font-display uppercase"
          seed={14}
        />

        {error && (
          <p className="font-hand mt-3 text-center text-lg text-crayon-red">
            ⚠️ {error}
          </p>
        )}

        <div className="mt-5 flex justify-center">
          <DoodleButton
            variant="blue"
            size="lg"
            seed={61}
            disabled={busy || code.length < 4 || !isSupabaseConfigured}
            onClick={onJoin}
          >
            {busy ? "Joining…" : "Let me in! →"}
          </DoodleButton>
        </div>
      </StickyCard>
    </main>
  );
}
