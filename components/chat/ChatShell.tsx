"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import TopBar from "./TopBar";
import MessageThread from "./MessageThread";
import AudioPreview from "./AudioPreview";
import ComposerBar from "./ComposerBar";
import VoiceMode from "./VoiceMode";
import { detectLanguage } from "@/lib/language";
import { getVoiceId, type Personality, type Language } from "@/lib/voices";
import { cn } from "@/lib/utils";

export interface Message {
  id: string;
  role: "assistant" | "user";
  text?: string;
  audioUrl?: string;
  seed: number;
}

type HistoryEntry = { role: string; content: string };

interface AudioPreviewState {
  blob: Blob;
  mimeType: string;
  objectUrl: string;
}

const INITIAL_ASSISTANT_TEXT =
  "Hi, I'm Coach Logic! My mission is to offer you personalized support and deliver actionable insights to help you reach your goals. To help me provide you with personalized recommendations, I would love to learn more about you and your business — what is your business name?";

const FALLBACK_REPLIES: Record<string, string> = {
  English: "Thanks for sharing. I'm capturing that so I can tailor the next onboarding questions for your business.",
  Spanish: "Gracias por compartirlo. Lo estoy registrando para adaptar las siguientes preguntas de onboarding a tu negocio.",
  French: "Merci pour votre partage. Je l'enregistre pour adapter les prochaines questions d'onboarding à votre entreprise.",
  Portuguese: "Obrigado por compartilhar. Estou registrando isso para adaptar as próximas perguntas de onboarding ao seu negócio.",
  German: "Danke fürs Teilen. Ich erfasse das, um die nächsten Onboarding-Fragen auf Ihr Unternehmen abzustimmen.",
  Tagalog: "Salamat sa pagbabahagi. Itinatala ko ito upang maiakma ang mga susunod na tanong para sa iyong negosyo.",
};

const LANG_CODE_MAP: Record<string, string> = {
  en: "English", es: "Spanish", fr: "French", pt: "Portuguese",
  de: "German", it: "Italian", nl: "Dutch", ru: "Russian",
  ja: "Japanese", zh: "Chinese", ko: "Korean", ar: "Arabic",
  hi: "Hindi", tr: "Turkish", pl: "Polish",
};

let msgCounter = 0;
const mkId = () => `msg-${Date.now()}-${++msgCounter}`;

const STORAGE_KEY = "coach-logic-chat";

function loadPersistedChat() {
  if (typeof window === "undefined") return null;
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "null"); } catch { return null; }
}

interface ChatShellProps {
  hideTopBar?: boolean;
  headerTitle?: string;
  initialTexts?: string[];
  storageKey?: string;
}

export default function ChatShell({
  hideTopBar = false,
  headerTitle = "Let's get to know each other!",
  initialTexts,
  storageKey = STORAGE_KEY,
}: ChatShellProps) {
  const texts = initialTexts ?? [INITIAL_ASSISTANT_TEXT];
  const INITIAL_MESSAGES: Message[] = texts.map((text, i) => ({ id: mkId(), role: "assistant" as const, text, seed: i + 1 }));
  const INITIAL_HISTORY: HistoryEntry[] = texts.map((text) => ({ role: "assistant", content: text }));

  const persisted = (() => {
    if (typeof window === "undefined") return null;
    try { return JSON.parse(localStorage.getItem(storageKey) || "null"); } catch { return null; }
  })();
  const [messages, setMessages] = useState<Message[]>(persisted?.messages ?? INITIAL_MESSAGES);
  const [history, setHistory] = useState<HistoryEntry[]>(persisted?.history ?? INITIAL_HISTORY);
  const [tone, setToneState] = useState<Personality>(persisted?.tone ?? "Professional");
  const [language, setLanguageState] = useState<string>(persisted?.language ?? "English");
  const [voiceGender, setVoiceGender] = useState<"female" | "male">("female");
  const [messageCount, setMessageCount] = useState(persisted?.messages?.length ?? 1);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [audioPreview, setAudioPreview] = useState<AudioPreviewState | null>(null);
  const [isSendingAudio, setIsSendingAudio] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [showNewChatConfirm, setShowNewChatConfirm] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const threadEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    threadEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  // ── Persist chat to localStorage ───────────────────────────
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify({ messages, history, tone, language }));
    } catch {}
  }, [messages, history, tone, language, storageKey]);

  // ── New chat ────────────────────────────────────────────────
  const startNewChat = useCallback(() => {
    const fresh: Message[] = texts.map((text, i) => ({ id: mkId(), role: "assistant" as const, text, seed: i + 1 }));
    const freshHistory: HistoryEntry[] = texts.map((text) => ({ role: "assistant", content: text }));
    setMessages(fresh);
    setHistory(freshHistory);
    setMessageCount(fresh.length);
    setShowNewChatConfirm(false);
    try { localStorage.setItem(storageKey, JSON.stringify({ messages: fresh, history: freshHistory, tone, language })); } catch {}
  }, [tone, language, storageKey, texts]);

  // ── Tone / language setters ─────────────────────────────────
  const setTone = useCallback((value: Personality) => setToneState(value), []);

  const setLanguage = useCallback((value: string) => setLanguageState(value), []);

  // ── Fetch AI reply ─────────────────────────────────────────
  const fetchReply = useCallback(
    async (userMessage: string, currentHistory: HistoryEntry[]) => {
      setIsTyping(true);

      let reply: string;
      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: userMessage,
            language,
            tone,
            history: currentHistory.slice(-10),
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`);
        reply = data.reply as string;
      } catch {
        reply = FALLBACK_REPLIES[language] ?? FALLBACK_REPLIES.English;
      }

      const voiceId = getVoiceId(tone, voiceGender);
      const replySeed = Date.now() & 0xffffffff;

      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: mkId(),
          role: "assistant",
          text: reply,
          seed: replySeed,
          voiceId,
        } as Message,
      ]);
      setHistory((prev) => [
        ...prev,
        { role: "user", content: userMessage },
        { role: "assistant", content: reply },
      ]);
      setMessageCount((n: number) => n + 1);
    },
    [language, tone, voiceGender]
  );

  // ── Send text message ───────────────────────────────────────
  const handleSend = useCallback(() => {
    const text = inputValue.trim();
    if (!text || isTyping) return;

    // Auto-detect language from typed text
    const detected = detectLanguage(text);
    if (detected && detected !== language) setLanguage(detected);

    const userMsg: Message = { id: mkId(), role: "user", text, seed: Date.now() & 0xffffffff };
    setMessages((prev) => [...prev, userMsg]);
    setHistory((prev) => [...prev, { role: "user", content: text }]);
    setMessageCount((n: number) => n + 1);
    setInputValue("");

    fetchReply(text, [...history, { role: "user", content: text }]);
  }, [inputValue, isTyping, language, setLanguage, history, fetchReply]);

  // ── Mic recording ───────────────────────────────────────────
  const stopDictation = useCallback(() => {
    if (mediaRecorderRef.current?.state !== "inactive") {
      mediaRecorderRef.current?.stop();
    }
    micStreamRef.current?.getTracks().forEach((t) => t.stop());
    micStreamRef.current = null;
    mediaRecorderRef.current = null;
    setIsListening(false);
  }, []);

  const handleMicClick = useCallback(async () => {
    if (isListening) {
      stopDictation();
      return;
    }

    if (!navigator.mediaDevices?.getUserMedia) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;
      setIsListening(true);

      const mimeType = MediaRecorder.isTypeSupported("audio/webm") ? "audio/webm" : "audio/mp4";
      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = () => {
        stopDictation();
        const blob = new Blob(chunks, { type: mimeType });
        if (blob.size < 1000) return;
        const objectUrl = URL.createObjectURL(blob);
        setAudioPreview({ blob, mimeType, objectUrl });
      };

      recorder.start(200);
    } catch {
      setIsListening(false);
    }
  }, [isListening, stopDictation]);

  // ── Send voice message ──────────────────────────────────────
  const handleSendAudio = useCallback(async () => {
    if (!audioPreview || isSendingAudio) return;
    const { blob, mimeType, objectUrl } = audioPreview;

    setIsSendingAudio(true);
    setAudioPreview(null);

    const voiceMsg: Message = {
      id: mkId(),
      role: "user",
      audioUrl: objectUrl,
      seed: Date.now() & 0xffffffff,
    };
    setMessages((prev) => [...prev, voiceMsg]);
    setMessageCount((n: number) => n + 1);

    try {
      const formData = new FormData();
      formData.append("file", blob, mimeType === "audio/webm" ? "audio.webm" : "audio.mp4");
      formData.append("model_id", "scribe_v1");

      const res = await fetch("/api/transcribe", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok || !data.transcript) throw new Error(data.error ?? "No transcript");

      // Auto-detect language from STT
      if (data.language_code) {
        const detected = LANG_CODE_MAP[data.language_code.slice(0, 2)];
        if (detected && detected !== language) setLanguage(detected);
      }

      await fetchReply(data.transcript, [...history, { role: "user", content: data.transcript }]);
    } catch {
      // Voice message already shown — just skip the reply
    } finally {
      setIsSendingAudio(false);
    }
  }, [audioPreview, isSendingAudio, language, setLanguage, history, fetchReply]);

  const handleDiscardAudio = useCallback(() => {
    if (audioPreview) {
      URL.revokeObjectURL(audioPreview.objectUrl);
      setAudioPreview(null);
    }
  }, [audioPreview]);

  // ── Attach files (stub — no upload yet) ───────────────────
  const handleAttach = useCallback((_files: FileList) => {
    // Future: upload and add to message
  }, []);

  // ── Cleanup on unmount ─────────────────────────────────────
  useEffect(() => {
    return () => {
      stopDictation();
      if (audioPreview) URL.revokeObjectURL(audioPreview.objectUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col h-full">
      {!hideTopBar && (
        <TopBar
          messageCount={messageCount}
          onNewChat={() => setShowNewChatConfirm(true)}
        />
      )}

      {/* New chat confirmation */}
      {showNewChatConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full mx-4 space-y-4">
            <h2 className="font-bold text-lg text-foreground">Start a new chat?</h2>
            <p className="text-sm text-muted-foreground">Your current conversation will be saved and a fresh session will begin.</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowNewChatConfirm(false)}
                className="px-4 py-2 rounded-lg text-sm text-muted-foreground hover:bg-muted transition-colors"
              >
                Keep chatting
              </button>
              <button
                onClick={startNewChat}
                className="px-4 py-2 rounded-lg text-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Start new chat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main content: split when voice mode open */}
      <div className={cn("flex-1 overflow-hidden flex", isVoiceMode ? "flex-row" : "flex-col")}>

        {/* Chat column */}
        <div className={cn("flex flex-col overflow-hidden", isVoiceMode ? "flex-[0_0_60%]" : "flex-1")}>
          {/* Thread — scrollable middle */}
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-3xl mx-auto px-4 py-6">
              <div className="text-center mb-8">
                <h1 className="font-bold text-2xl text-foreground tracking-tight">
                  {headerTitle}
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>

              <MessageThread
                messages={messages}
                tone={tone}
                voiceGender={voiceGender}
                status={isTyping ? "Thinking…" : undefined}
                onToneChange={setTone}
                onToggleGender={() => setVoiceGender((g) => (g === "female" ? "male" : "female"))}
                voiceModeActive={isVoiceMode}
              />
              <div ref={threadEndRef} />
            </div>
          </div>

          {/* Audio preview strip */}
          {audioPreview && (
            <div className="flex-shrink-0 max-w-3xl mx-auto w-full px-4 pb-2">
              <AudioPreview
                objectUrl={audioPreview.objectUrl}
                seed={7}
                onDiscard={handleDiscardAudio}
                onSend={handleSendAudio}
                isSending={isSendingAudio}
              />
            </div>
          )}

          <ComposerBar
            value={inputValue}
            onChange={setInputValue}
            onSend={handleSend}
            onMicClick={handleMicClick}
            isListening={isListening}
            language={language}
            onLanguageChange={setLanguage}
            onAttach={handleAttach}
            onVoiceModeClick={() => setIsVoiceMode(true)}
            disabled={isTyping || isSendingAudio}
          />
        </div>

        {/* Voice mode — single instance, side panel on desktop / bottom sheet on mobile */}
        {isVoiceMode && (
          <div className="md:flex md:flex-col md:flex-[0_0_40%] md:border-l md:border-border fixed bottom-0 left-0 right-0 h-[55vh] md:static md:h-auto z-50 border-t border-border">
            <VoiceMode
              onClose={() => setIsVoiceMode(false)}
              tone={tone}
              voiceGender={voiceGender}
              language={language}
              history={history}
              onMessageExchange={(userText, assistantText, detectedLanguage) => {
                const voiceId = getVoiceId(tone, voiceGender);
                setMessages((prev) => [
                  ...prev,
                  { id: mkId(), role: "user", text: userText, seed: Date.now() & 0xffffffff },
                  { id: mkId(), role: "assistant", text: assistantText, seed: Date.now() & 0xffffffff, voiceId } as Message,
                ]);
                setHistory((prev) => [
                  ...prev,
                  { role: "user", content: userText },
                  { role: "assistant", content: assistantText },
                ]);
                if (detectedLanguage) setLanguage(detectedLanguage);
              }}
            />
          </div>
        )}

      </div>
    </div>
  );
}
