"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import Logo from "@/components/ui/Logo";
import DoodleBg from "@/components/ui/DoodleBg";
import DoodleButton from "@/components/ui/DoodleButton";
import StickyCard from "@/components/ui/StickyCard";
import NumberStepper from "@/components/ui/NumberStepper";
import OfflineNotice from "@/components/ui/OfflineNotice";
import { getIdentity } from "@/lib/identity";
import { DEFAULT_SETTINGS, type GameSettings } from "@/lib/game/settings";
import { SETTING_BOUNDS } from "@/lib/game/constants";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { createRoom } from "@/lib/rooms";

export default function CreatePage() {
  const router = useRouter();
  const [settings, setSettings] = useState<GameSettings>(DEFAULT_SETTINGS);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasIdentity, setHasIdentity] = useState<boolean | null>(null);

  useEffect(() => {
    setHasIdentity(Boolean(getIdentity()));
  }, []);

  const set = (patch: Partial<GameSettings>) =>
    setSettings((s) => ({ ...s, ...patch }));

  const onCreate = async () => {
    const identity = getIdentity();
    if (!identity) {
      router.push("/");
      return;
    }
    setBusy(true);
    setError(null);
    const res = await createRoom(identity, settings);
    if (res.ok) router.push(`/room/${res.code}`);
    else {
      setError(res.error);
      setBusy(false);
    }
  };

  if (hasIdentity === false) {
    return (
      <main className="relative flex min-h-dvh flex-col items-center justify-center px-5">
        <DoodleBg />
        <StickyCard color="yellow" className="max-w-sm text-center">
          <p className="font-display mb-4 text-xl">Pick a name first! ✏️</p>
          <Link href="/">
            <DoodleButton variant="green">Back to start</DoodleButton>
          </Link>
        </StickyCard>
      </main>
    );
  }

  return (
    <main className="relative flex min-h-dvh flex-col items-center px-5 py-8">
      <DoodleBg />

      <Link href="/" className="self-start">
        <Logo size="sm" />
      </Link>

      <motion.h2
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-display mt-4 text-3xl sm:text-4xl"
      >
        🎨 Game Settings
      </motion.h2>
      <p className="font-hand mb-5 mt-1 text-lg text-ink-soft">
        Tune the game, then invite your friends. Any number of players can join!
      </p>

      {!isSupabaseConfigured && (
        <div className="mb-5">
          <OfflineNotice />
        </div>
      )}

      <StickyCard color="paper" tilt={-0.6} seed={17} className="w-full max-w-md">
        <div className="flex flex-col gap-3">
          <NumberStepper
            icon="🕵️"
            label="Imposters"
            hint="How many fakers per round"
            value={settings.imposterCount}
            min={SETTING_BOUNDS.imposterCount.min}
            max={SETTING_BOUNDS.imposterCount.max}
            onChange={(v) => set({ imposterCount: v })}
            seed={2}
          />
          <NumberStepper
            icon="⏱️"
            label="Turn time"
            hint="Seconds to add your strokes"
            value={settings.turnDurationSec}
            min={SETTING_BOUNDS.turnDurationSec.min}
            max={SETTING_BOUNDS.turnDurationSec.max}
            suffix="s"
            onChange={(v) => set({ turnDurationSec: v })}
            seed={4}
          />
          <NumberStepper
            icon="🔁"
            label="Turns each"
            hint="Turns per player, per round"
            value={settings.drawingCycles}
            min={SETTING_BOUNDS.drawingCycles.min}
            max={SETTING_BOUNDS.drawingCycles.max}
            onChange={(v) => set({ drawingCycles: v })}
            seed={6}
          />
          <NumberStepper
            icon="🏆"
            label="Rounds"
            hint="New imposter each round"
            value={settings.rounds}
            min={SETTING_BOUNDS.rounds.min}
            max={SETTING_BOUNDS.rounds.max}
            onChange={(v) => set({ rounds: v })}
            seed={8}
          />
          <NumberStepper
            icon="💬"
            label="Discussion"
            hint="Argue about who's sus"
            value={settings.discussionSec}
            min={SETTING_BOUNDS.discussionSec.min}
            max={SETTING_BOUNDS.discussionSec.max}
            suffix="s"
            onChange={(v) => set({ discussionSec: v })}
            seed={10}
          />
          <NumberStepper
            icon="🗳️"
            label="Voting"
            hint="Time to cast your vote"
            value={settings.votingSec}
            min={SETTING_BOUNDS.votingSec.min}
            max={SETTING_BOUNDS.votingSec.max}
            suffix="s"
            onChange={(v) => set({ votingSec: v })}
            seed={12}
          />
        </div>
      </StickyCard>

      {error && (
        <p className="font-hand mt-4 text-lg text-crayon-red">⚠️ {error}</p>
      )}

      <div className="mt-6">
        <DoodleButton
          variant="green"
          size="lg"
          seed={51}
          disabled={busy || !isSupabaseConfigured}
          onClick={onCreate}
        >
          {busy ? "Creating…" : "🎉 Create Room"}
        </DoodleButton>
      </div>
    </main>
  );
}
