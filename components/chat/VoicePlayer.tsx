"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

interface VoicePlayerProps {
  src?: string;
  getSrc?: () => Promise<string>;
  seed?: number;
  variant?: "assistant" | "user";
}

const BAR_COUNT = 46;

function vpSeededRand(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = Math.imul(s ^ (s >>> 16), 0x45d9f3b);
    s = Math.imul(s ^ (s >>> 16), 0x45d9f3b);
    s ^= s >>> 16;
    return (s >>> 0) / 0x100000000;
  };
}

function vpGenerateBars(count: number, seed: number): number[] {
  const rand = vpSeededRand(seed);
  return Array.from({ length: count }, (_, i) => {
    const t = i / (count - 1);
    const envelope = Math.sin(Math.PI * t);
    const f1 = 0.6 * Math.exp(-Math.pow((t - 0.3) * 6, 2));
    const f2 = 0.8 * Math.exp(-Math.pow((t - 0.65) * 5, 2));
    const noise = rand() * 0.25;
    return Math.max(0.06, Math.min(1, envelope * 0.35 + f1 + f2 + noise));
  });
}

export default function VoicePlayer({
  src,
  getSrc,
  seed = 42,
  variant = "assistant",
}: VoicePlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // 0–1
  const [speed, setSpeed] = useState(1);
  const [audioSrc, setAudioSrc] = useState<string | null>(src || null);
  const [loading, setLoading] = useState(false);
  const rafRef = useRef<number | null>(null);

  const bars = vpGenerateBars(BAR_COUNT, seed);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      const audio = audioRef.current;
      if (audio) {
        audio.pause();
        audio.src = "";
      }
    };
  }, []);

  const updateProgress = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    setProgress(audio.currentTime / audio.duration);
    if (!audio.paused) {
      rafRef.current = requestAnimationFrame(updateProgress);
    }
  }, []);

  const ensureAudio = useCallback(async (): Promise<HTMLAudioElement | null> => {
    if (audioRef.current && audioSrc) return audioRef.current;

    let resolvedSrc = audioSrc;
    if (!resolvedSrc && getSrc) {
      setLoading(true);
      try {
        resolvedSrc = await getSrc();
        setAudioSrc(resolvedSrc);
      } catch (err) {
        console.error("VoicePlayer: failed to fetch audio", err);
        setLoading(false);
        return null;
      }
      setLoading(false);
    }

    if (!resolvedSrc) return null;

    const audio = new Audio(resolvedSrc);
    audio.playbackRate = speed;
    audioRef.current = audio;

    audio.addEventListener("ended", () => {
      setIsPlaying(false);
      setProgress(1);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    });

    return audio;
  }, [audioSrc, getSrc, speed]);

  const togglePlay = useCallback(async () => {
    if (loading) return;

    const audio = await ensureAudio();
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    } else {
      audio.playbackRate = speed;
      await audio.play().catch(console.error);
      setIsPlaying(true);
      rafRef.current = requestAnimationFrame(updateProgress);
    }
  }, [loading, isPlaying, speed, ensureAudio, updateProgress]);

  const handleSeek = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const audio = audioRef.current;
      if (!audio || !audio.duration) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const ratio = (e.clientX - rect.left) / rect.width;
      const clamped = Math.max(0, Math.min(1, ratio));
      audio.currentTime = clamped * audio.duration;
      setProgress(clamped);
    },
    []
  );

  const cycleSpeed = useCallback(() => {
    const speeds = [1, 1.25, 1.5, 2];
    const next = speeds[(speeds.indexOf(speed) + 1) % speeds.length];
    setSpeed(next);
    if (audioRef.current) audioRef.current.playbackRate = next;
  }, [speed]);

  const isAssistant = variant === "assistant";
  const accentColor = isAssistant ? "#6f63f6" : "#ffffff";
  const dimColor = isAssistant ? "#d4d3f8" : "rgba(255,255,255,0.4)";

  return (
    <div className="flex items-center gap-3 mt-2">
      {/* Play/Pause button */}
      <button
        onClick={togglePlay}
        disabled={loading}
        className={cn(
          "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all",
          "border border-border hover:border-primary/60",
          loading ? "opacity-50 cursor-wait" : "cursor-pointer hover:bg-muted"
        )}
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        {loading ? (
          <svg className="w-3 h-3 animate-spin text-muted-foreground" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
        ) : isPlaying ? (
          <svg width="10" height="12" viewBox="0 0 10 12" fill={accentColor}>
            <rect x="0" y="0" width="3.5" height="12" rx="1" />
            <rect x="6.5" y="0" width="3.5" height="12" rx="1" />
          </svg>
        ) : (
          <svg width="10" height="12" viewBox="0 0 10 12" fill={accentColor}>
            <path d="M0 0L10 6L0 12V0Z" />
          </svg>
        )}
      </button>

      {/* Waveform bars */}
      <div
        className="flex items-center gap-[2px] cursor-pointer flex-1 h-8"
        onClick={handleSeek}
        role="slider"
        aria-label="Audio progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress * 100)}
      >
        {bars.map((height, i) => {
          const barProgress = i / (BAR_COUNT - 1);
          const filled = barProgress <= progress;
          return (
            <div
              key={i}
              className="flex-1 rounded-full transition-colors duration-75"
              style={{
                height: `${height * 100}%`,
                backgroundColor: filled ? accentColor : dimColor,
                minHeight: "2px",
              }}
            />
          );
        })}
      </div>

      {/* Speed toggle */}
      <button
        onClick={cycleSpeed}
        className="flex-shrink-0 text-xs font-medium tabular-nums text-muted-foreground hover:text-foreground transition-colors w-9 text-center"
        aria-label="Playback speed"
      >
        {speed}x
      </button>
    </div>
  );
}
