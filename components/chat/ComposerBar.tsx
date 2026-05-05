"use client";

import React, { useRef, useCallback, useEffect } from "react";
import {
  Paperclip,
  Smile,
  AtSign,
  Bold,
  Italic,
  Strikethrough,
  Code,
  List,
  Table,
  Mic,
  SendHorizonal,
  ChevronDown,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { LANGUAGES, type Language } from "@/lib/voices";

interface ComposerBarProps {
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
  onMicClick: () => void;
  isListening: boolean;
  language: Language | string;
  onLanguageChange: (lang: string) => void;
  onAttach: (files: FileList) => void;
  disabled?: boolean;
}

const PLACEHOLDERS: Record<string, string> = {
  English: "Message Coach Logic…",
  Spanish: "Escribe a Coach Logic…",
  French: "Envoyez un message à Coach Logic…",
  Portuguese: "Envie uma mensagem para o Coach Logic…",
  German: "Nachricht an Coach Logic…",
  Italian: "Scrivi a Coach Logic…",
  Tagalog: "Mag-message kay Coach Logic…",
};

export default function ComposerBar({
  value,
  onChange,
  onSend,
  onMicClick,
  isListening,
  language,
  onLanguageChange,
  onAttach,
  disabled,
}: ComposerBarProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "36px";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }, [value]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        onSend();
      }
    },
    [onSend]
  );

  const wrapSelection = useCallback(
    (prefix: string, suffix = prefix) => {
      const el = textareaRef.current;
      if (!el) return;
      const start = el.selectionStart;
      const end = el.selectionEnd;
      const selected = value.slice(start, end);
      const next = value.slice(0, start) + prefix + selected + suffix + value.slice(end);
      onChange(next);
      requestAnimationFrame(() => {
        el.focus();
        const cursor = start + prefix.length + selected.length + suffix.length;
        el.setSelectionRange(cursor, cursor);
      });
    },
    [value, onChange]
  );

  const prependLine = useCallback(
    (prefix: string) => {
      const el = textareaRef.current;
      if (!el) return;
      const start = el.selectionStart;
      const lineStart = value.lastIndexOf("\n", start - 1) + 1;
      const next = value.slice(0, lineStart) + prefix + value.slice(lineStart);
      onChange(next);
      requestAnimationFrame(() => {
        el.focus();
        const cursor = start + prefix.length;
        el.setSelectionRange(cursor, cursor);
      });
    },
    [value, onChange]
  );

  const insertTable = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    const table =
      "\n| Column 1 | Column 2 | Column 3 |\n|----------|----------|----------|\n| Cell     | Cell     | Cell     |\n";
    const start = el.selectionStart;
    onChange(value.slice(0, start) + table + value.slice(start));
    requestAnimationFrame(() => el.focus());
  }, [value, onChange]);

  const insertEmoji = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    const emojis = ["🙂", "👏", "🚀", "💡"];
    const emoji = emojis[Math.floor(Math.random() * emojis.length)];
    const start = el.selectionStart;
    onChange(value.slice(0, start) + emoji + value.slice(start));
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(start + emoji.length, start + emoji.length);
    });
  }, [value, onChange]);

  const insertMention = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    const mention = "@CoachLogic ";
    const start = el.selectionStart;
    onChange(value.slice(0, start) + mention + value.slice(start));
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(start + mention.length, start + mention.length);
    });
  }, [value, onChange]);

  const iconBtn =
    "w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors";

  return (
    <div className="flex-shrink-0 bg-white/80 backdrop-blur-lg">
      <div className="max-w-3xl mx-auto px-4 py-3 space-y-2">
        {/* Composer box */}
        <div className="rounded-xl border border-border bg-white px-4 pt-3 pb-2 space-y-2">
        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={PLACEHOLDERS[language] ?? PLACEHOLDERS.English}
          disabled={disabled}
          rows={1}
          className={cn(
            "w-full resize-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground",
            "outline-none leading-relaxed py-1",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
          style={{ height: "36px", maxHeight: "160px" }}
        />

        {/* Toolbar */}
        <div className="flex items-center gap-1">
          {/* Left cluster — attach/emoji/mention */}
          <div className="flex items-center gap-0.5">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={iconBtn}
              title="Attach file"
            >
              <Paperclip className="w-4 h-4" />
            </button>
            <button type="button" onClick={insertEmoji} className={iconBtn} title="Insert emoji">
              <Smile className="w-4 h-4" />
            </button>
            <button type="button" onClick={insertMention} className={iconBtn} title="Mention">
              <AtSign className="w-4 h-4" />
            </button>
          </div>

          {/* Divider */}
          <div className="w-px h-5 bg-border mx-1" />

          {/* Format cluster */}
          <div className="flex items-center gap-0.5">
            <button
              type="button"
              onClick={() => wrapSelection("**")}
              className={iconBtn}
              title="Bold"
            >
              <Bold className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => wrapSelection("*")}
              className={iconBtn}
              title="Italic"
            >
              <Italic className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => wrapSelection("~~")}
              className={iconBtn}
              title="Strikethrough"
            >
              <Strikethrough className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => wrapSelection("`")}
              className={iconBtn}
              title="Code"
            >
              <Code className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => prependLine("- ")}
              className={iconBtn}
              title="Bullet list"
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button type="button" onClick={insertTable} className={iconBtn} title="Insert table">
              <Table className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Right cluster — language / mic / send */}
          <div className="flex items-center gap-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-border bg-transparent text-xs text-muted-foreground hover:border-primary/40 hover:text-foreground transition-all">
                  {language}
                  <ChevronDown className="w-3 h-3 opacity-60" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-32">
                {LANGUAGES.map((l) => (
                  <DropdownMenuItem
                    key={l}
                    onClick={() => onLanguageChange(l)}
                    className={cn(l === language && "text-primary font-medium")}
                  >
                    {l}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mic */}
            <button
              type="button"
              onClick={onMicClick}
              disabled={disabled}
              className={cn(
                "w-8 h-8 flex items-center justify-center rounded-lg transition-all",
                isListening
                  ? "bg-red-500/20 text-red-400 hover:bg-red-500/30 animate-pulse"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
              title={isListening ? "Stop recording" : "Record voice message"}
            >
              <Mic className="w-4 h-4" />
            </button>

            {/* Send */}
            <button
              type="button"
              onClick={onSend}
              disabled={disabled || !value.trim()}
              className={cn(
                "w-8 h-8 flex items-center justify-center rounded-lg transition-all",
                "bg-primary text-primary-foreground hover:bg-primary/90",
                "disabled:opacity-40 disabled:cursor-not-allowed"
              )}
              title="Send message (Enter)"
            >
              <SendHorizonal className="w-4 h-4" />
            </button>
          </div>
        </div>
        </div>{/* end composer box */}

        {/* Hint */}
        <p className="text-[11px] text-muted-foreground/60 select-none">
          <kbd className="font-mono">Enter</kbd> to send ·{" "}
          <kbd className="font-mono">Shift+Enter</kbd> for new line
        </p>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        hidden
        onChange={(e) => {
          if (e.target.files?.length) onAttach(e.target.files);
        }}
      />
    </div>
  );
}
