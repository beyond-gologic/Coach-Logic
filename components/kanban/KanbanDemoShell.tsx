"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  Circle,
  Clock,
  AlertCircle,
  Volume2,
  Globe,
  X,
  Upload,
  ExternalLink,
  CheckCheck,
  Plus,
  Search,
  Filter,
  Archive,
  ChevronDown,
  LayoutGrid,
  Settings2,
  MessageSquare,
  Paperclip,
  Check,
  Pencil,
  MoreHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Status = "not-started" | "in-progress" | "blocked" | "completed";

interface PlayCard {
  id: string;
  title: string;
  titlePl: string;
  desc: string;
  descPl: string;
  status: Status;
  tag: string;
  priority: "High" | "Medium" | "Low";
  assignee: string;
  comments: number;
  attachments: number;
  suggestedBy?: string;
}

const PLAYS: PlayCard[] = [
  {
    id: "1",
    title: "Verify Ownership Eligibility",
    titlePl: "Zweryfikuj Kwalifikowalność Własności",
    desc: "Confirm 51%+ ownership by a minority U.S. citizen and Illinois residency.",
    descPl: "Potwierdź co najmniej 51% własności mniejszości będącej obywatelem USA.",
    status: "completed",
    tag: "Eligibility",
    priority: "High",
    assignee: "MK",
    comments: 12,
    attachments: 2,
  },
  {
    id: "2",
    title: "Create CMBE Portal Account",
    titlePl: "Utwórz Konto w Portalu CMBE",
    desc: "Register at the Illinois CMBE online portal to begin your application.",
    descPl: "Zarejestruj się w portalu Illinois CMBE online.",
    status: "completed",
    tag: "Admin",
    priority: "High",
    assignee: "MK",
    comments: 3,
    attachments: 0,
  },
  {
    id: "3",
    title: "Gather Required Documents",
    titlePl: "Zbierz Wymagane Dokumenty",
    desc: "Compile all ownership, formation, and financial documents required by the state.",
    descPl: "Skompletuj wymagane dokumenty własności, założenia firmy i finansów.",
    status: "in-progress",
    tag: "Documentation",
    priority: "High",
    assignee: "MK",
    comments: 12,
    attachments: 1,
    suggestedBy: "GT",
  },
  {
    id: "4",
    title: "Complete Online Application",
    titlePl: "Wypełnij Wniosek Online",
    desc: "Submit the MBE application form through the CMBE portal with all documents.",
    descPl: "Złóż formularz wniosku MBE przez portal CMBE z dokumentami.",
    status: "not-started",
    tag: "Application",
    priority: "High",
    assignee: "MK",
    comments: 0,
    attachments: 0,
    suggestedBy: "GT",
  },
  {
    id: "5",
    title: "Pay Application Fee",
    titlePl: "Opłać Opłatę Aplikacyjną",
    desc: "Submit the $150 non-refundable certification application fee online.",
    descPl: "Opłać bezzwrotną opłatę certyfikacyjną w wysokości $150.",
    status: "not-started",
    tag: "Admin",
    priority: "Medium",
    assignee: "MK",
    comments: 0,
    attachments: 0,
  },
  {
    id: "6",
    title: "Obtain Notarized Affidavit",
    titlePl: "Uzyskaj Notarialnie Poświadczone Oświadczenie",
    desc: "Have the Personal Certification Affidavit notarized before submission.",
    descPl: "Notarialnie poświadcz oświadczenie certyfikacyjne.",
    status: "blocked",
    tag: "Legal",
    priority: "High",
    assignee: "MK",
    comments: 8,
    attachments: 1,
  },
  {
    id: "7",
    title: "Schedule Site Visit / Interview",
    titlePl: "Zaplanuj Wizytę / Rozmowę",
    desc: "Coordinate with CMS for an on-site review of your business operations.",
    descPl: "Skoordynuj z CMS wizytę w celu weryfikacji firmy.",
    status: "blocked",
    tag: "Review",
    priority: "Medium",
    assignee: "MK",
    comments: 3,
    attachments: 1,
  },
  {
    id: "8",
    title: "Enhance Call to Action (CTA)",
    titlePl: "Ulepsz Wezwanie do Działania",
    desc: "Make sure your CTAs are clear and compelling for the reviewer.",
    descPl: "Upewnij się, że wezwania do działania są jasne i przekonujące.",
    status: "blocked",
    tag: "HR",
    priority: "Medium",
    assignee: "MK",
    comments: 8,
    attachments: 0,
  },
  {
    id: "9",
    title: "Respond to Reviewer Questions",
    titlePl: "Odpowiedz na Pytania Recenzenta",
    desc: "Address any follow-up questions or document requests from the CMS reviewer.",
    descPl: "Odpowiedz na pytania uzupełniające od recenzenta CMS.",
    status: "not-started",
    tag: "Review",
    priority: "Medium",
    assignee: "MK",
    comments: 0,
    attachments: 0,
  },
  {
    id: "10",
    title: "Analyze Current Data",
    titlePl: "Analizuj Bieżące Dane",
    desc: "Ensure your website and business data meets state verification standards.",
    descPl: "Upewnij się, że dane spełniają standardy weryfikacji stanowej.",
    status: "completed",
    tag: "Administrative",
    priority: "Medium",
    assignee: "MK",
    comments: 12,
    attachments: 1,
  },
  {
    id: "11",
    title: "Improve Checkout Process",
    titlePl: "Ulepsz Proces Kasowania",
    desc: "Improve cards readability and flow for the certification portal.",
    descPl: "Ulepsz czytelność kart i przepływ w portalu certyfikacji.",
    status: "completed",
    tag: "Marketing",
    priority: "Medium",
    assignee: "MK",
    comments: 3,
    attachments: 1,
  },
  {
    id: "12",
    title: "Analyze Current Data",
    titlePl: "Analizuj Bieżące Dane",
    desc: "Ensure your website data meets state verification requirements.",
    descPl: "Upewnij się, że dane strony spełniają wymagania weryfikacji.",
    status: "completed",
    tag: "Administrative",
    priority: "Medium",
    assignee: "MK",
    comments: 8,
    attachments: 0,
    suggestedBy: "GT",
  },
  {
    id: "13",
    title: "Enhance Call to Action (CTA)",
    titlePl: "Ulepsz Wezwanie do Działania",
    desc: "Make sure your CTAs are clear and meet MBE portal standards.",
    descPl: "Upewnij się, że wezwania do działania spełniają standardy portalu MBE.",
    status: "completed",
    tag: "HR",
    priority: "High",
    assignee: "MK",
    comments: 8,
    attachments: 0,
    suggestedBy: "GT",
  },
];

const COLUMNS: { status: Status; label: string; accent: string; dot: string }[] = [
  { status: "not-started", label: "Not Started", accent: "text-[#52525B]", dot: "bg-[#D4D4D8]" },
  { status: "in-progress", label: "In Progress", accent: "text-blue-600", dot: "bg-blue-500" },
  { status: "blocked", label: "Blocked", accent: "text-orange-500", dot: "bg-orange-400" },
  { status: "completed", label: "Completed", accent: "text-green-600", dot: "bg-green-500" },
];

const PRIORITY_COLORS: Record<string, string> = {
  High: "bg-red-50 text-red-600 border-red-200",
  Medium: "bg-yellow-50 text-yellow-700 border-yellow-200",
  Low: "bg-green-50 text-green-700 border-green-200",
};

const TAG_COLORS: Record<string, string> = {
  Eligibility: "bg-purple-50 text-purple-700",
  Admin: "bg-blue-50 text-blue-700",
  Administrative: "bg-blue-50 text-blue-700",
  Documentation: "bg-indigo-50 text-indigo-700",
  Application: "bg-cyan-50 text-cyan-700",
  Legal: "bg-orange-50 text-orange-700",
  Review: "bg-teal-50 text-teal-700",
  HR: "bg-pink-50 text-pink-700",
  Marketing: "bg-green-50 text-green-700",
  Design: "bg-violet-50 text-violet-700",
  Communications: "bg-amber-50 text-amber-700",
};

const ASSIGNEE_COLORS: Record<string, string> = {
  MK: "bg-violet-500",
  GT: "bg-primary",
};

interface DocItem {
  id: string;
  label: string;
  labelPl: string;
  note: string;
  notePl: string;
  checked: boolean;
  uploaded: boolean;
}

const INITIAL_DOCS: DocItem[] = [
  { id: "d1", label: "Articles of Incorporation / Organization", labelPl: "Akt Założycielski / Statut", note: "Filed with Illinois Secretary of State", notePl: "Złożony w Sekretariacie Stanu Illinois", checked: true, uploaded: true },
  { id: "d2", label: "Business Licenses & Permits", labelPl: "Licencje i Zezwolenia Biznesowe", note: "All active state and local licenses", notePl: "Wszystkie aktywne licencje stanowe i lokalne", checked: true, uploaded: false },
  { id: "d3", label: "Proof of Minority Status", labelPl: "Dowód Statusu Mniejszości", note: "Passport, birth certificate, or naturalization papers", notePl: "Paszport, akt urodzenia lub dokumenty naturalizacji", checked: false, uploaded: false },
  { id: "d4", label: "3 Years of Federal Tax Returns", labelPl: "3 Lata Federalnych Zeznań Podatkowych", note: "Personal and business returns", notePl: "Zeznania osobiste i firmowe", checked: false, uploaded: false },
  { id: "d5", label: "Personal Net Worth Statement", labelPl: "Oświadczenie o Wartości Majątku", note: "Must not exceed $1.32M (IL threshold)", notePl: "Nie może przekraczać $1,32 mln (próg Illinois)", checked: false, uploaded: false },
  { id: "d6", label: "Signed Operating Agreement", labelPl: "Podpisana Umowa Operacyjna", note: "Showing 51%+ minority ownership", notePl: "Potwierdzająca ponad 51% własności mniejszości", checked: false, uploaded: false },
];

const EXPLANATION = {
  en: `This step is critical. Illinois requires every MBE applicant to upload verified ownership and financial documents before the application can be reviewed.\n\nStart with your Articles of Incorporation — that's your business birth certificate. Then gather proof of your minority status and 3 years of tax returns. The Personal Net Worth Statement is often the most time-consuming, so start it first.\n\nI've organized the full checklist below. Check each item off as you collect it, and upload the file directly here.`,
  pl: `Ten krok jest kluczowy. Illinois wymaga, aby każdy wnioskodawca MBE przesłał zweryfikowane dokumenty własności i finansowe przed przeglądem.\n\nZacznij od Aktu Założycielskiego — to świadectwo urodzenia Twojej firmy. Następnie zbierz dowód statusu mniejszości i 3 lata zeznań podatkowych. Oświadczenie o Wartości Majątku jest często najbardziej czasochłonne — zacznij od niego.\n\nPoniżej przygotowałem pełną listę kontrolną. Zaznacz każdy element po zebraniu go i prześlij plik bezpośrednio tutaj.`,
};

export default function KanbanDemoShell() {
  const [lang, setLang] = useState<"en" | "pl">("en");
  const [activePlay, setActivePlay] = useState<PlayCard | null>(null);
  const [docs, setDocs] = useState<DocItem[]>(INITIAL_DOCS);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);

  const isPl = lang === "pl";

  const toggleCheck = (id: string) => setDocs(prev => prev.map(d => d.id === id ? { ...d, checked: !d.checked } : d));
  const markUploaded = (id: string) => setDocs(prev => prev.map(d => d.id === id ? { ...d, uploaded: true, checked: true } : d));

  const checkedCount = docs.filter(d => d.checked).length;
  const uploadedCount = docs.filter(d => d.uploaded).length;
  const progress = Math.round((checkedCount / docs.length) * 100);

  const handlePlayAudio = () => {
    if (isPlaying) { setIsPlaying(false); return; }
    setIsPlaying(true);
    setAudioProgress(0);
    const interval = setInterval(() => {
      setAudioProgress(p => {
        if (p >= 100) { clearInterval(interval); setIsPlaying(false); return 100; }
        return p + 1;
      });
    }, 120);
  };

  const colPlays = (status: Status) => PLAYS.filter(p => p.status === status);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* ── Goal header ── */}
      <div className="flex-shrink-0 mx-5 mt-4 mb-3 rounded-xl border border-[#E5E7EB] bg-white p-4 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 text-2xl">🏀</div>
          <div className="flex-1 min-w-0">
            <h2 className="font-bold text-lg text-foreground">
              {isPl ? "Certyfikacja MBE — Illinois" : "Get Illinois MBE Certified"}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5 mb-2">
              {isPl
                ? "Ten cel pozostanie pusty do czasu zakończenia certyfikacji MBE przez urząd stanu Illinois."
                : "This goal tracks Maria Kowalski's full Illinois MBE certification journey, step by step."}
            </p>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden max-w-xs">
                <div className="h-full rounded-full bg-primary" style={{ width: "22%" }} />
              </div>
              <span className="text-xs font-semibold text-muted-foreground">22%</span>
              <span className="text-xs text-muted-foreground border border-[#E5E7EB] px-2 py-0.5 rounded-full">
                {isPl ? "Start: styczeń 2024" : "Goal Start Date: January 16, 2024"}
              </span>
            </div>
          </div>
          {/* Language toggle */}
          <div className="flex items-center gap-1.5 border border-[#E5E7EB] rounded-full px-3 py-1.5 text-xs font-medium text-muted-foreground flex-shrink-0">
            <Globe className="w-3.5 h-3.5" />
            <button onClick={() => setLang("en")} className={cn("transition-colors", lang === "en" ? "text-primary font-semibold" : "hover:text-foreground")}>EN</button>
            <span>/</span>
            <button onClick={() => setLang("pl")} className={cn("transition-colors", lang === "pl" ? "text-primary font-semibold" : "hover:text-foreground")}>PL</button>
          </div>
        </div>
      </div>

      {/* ── Plays label + toolbar ── */}
      <div className="flex-shrink-0 px-5 mb-2">
        <h3 className="font-bold text-xl text-foreground mb-1">{isPl ? "Plays" : "Plays"}</h3>
        <p className="text-xs text-muted-foreground mb-3">
          {isPl ? "Poniżej znajdziesz aktywne plays. Kliknij, aby pracować nad celem." : "Below you will find active plays (tasks).\nClick on each to work towards accomplishing this goal."}
        </p>

        {/* Toolbar */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Search */}
          <div className="flex items-center gap-2 border border-[#E5E7EB] rounded-lg px-3 py-1.5 bg-white w-52">
            <Search className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
            <input className="text-xs text-foreground placeholder:text-muted-foreground bg-transparent outline-none flex-1" placeholder={isPl ? "Szukaj..." : "Search..."} readOnly />
          </div>
          {/* Filters */}
          <button className="flex items-center gap-1.5 border border-[#E5E7EB] rounded-lg px-3 py-1.5 bg-white text-xs font-medium text-foreground hover:border-primary/40 transition-colors">
            <Filter className="w-3.5 h-3.5" />
            {isPl ? "Filtry" : "Filters"}
            <span className="w-4 h-4 rounded-full bg-primary text-white text-[9px] font-bold flex items-center justify-center leading-none">2</span>
          </button>
          {/* Archive */}
          <button className="flex items-center gap-1.5 border border-[#E5E7EB] rounded-lg px-3 py-1.5 bg-white text-xs font-medium text-foreground hover:border-primary/40 transition-colors">
            <Archive className="w-3.5 h-3.5" />
            {isPl ? "Archiwum" : "Archive"}
          </button>
          {/* This Week */}
          <button className="flex items-center gap-1.5 border border-[#E5E7EB] rounded-lg px-3 py-1.5 bg-white text-xs font-medium text-foreground hover:border-primary/40 transition-colors">
            {isPl ? "Ten tydzień" : "This Week"}
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
          {/* View Game Plan */}
          <button className="flex items-center gap-1.5 border border-[#E5E7EB] rounded-lg px-3 py-1.5 bg-white text-xs font-medium text-foreground hover:border-primary/40 transition-colors">
            {isPl ? "Plan Gry" : "View Game Plan"}
          </button>
          {/* View Field */}
          <button className="flex items-center gap-1.5 border border-[#E5E7EB] rounded-lg px-3 py-1.5 bg-white text-xs font-medium text-foreground hover:border-primary/40 transition-colors">
            <LayoutGrid className="w-3.5 h-3.5" />
            {isPl ? "Widok" : "View Field"}
          </button>
          <button className="flex items-center border border-[#E5E7EB] rounded-lg p-1.5 bg-white text-muted-foreground hover:border-primary/40 transition-colors">
            <Settings2 className="w-3.5 h-3.5" />
          </button>
          <div className="flex-1" />
          <button className="flex items-center gap-1.5 bg-primary hover:bg-primary/90 text-white text-xs font-semibold px-4 py-1.5 rounded-lg transition-colors">
            <Plus className="w-3.5 h-3.5" />
            {isPl ? "Dodaj Play" : "Add a Play"}
          </button>
        </div>
      </div>

      {/* ── Kanban columns ── */}
      <div className="flex-1 overflow-hidden px-5 pb-4">
        <div className="flex h-full gap-3 overflow-x-auto">
          {COLUMNS.map(col => {
            const cards = colPlays(col.status);
            return (
              <div key={col.status} className="flex flex-col flex-1 min-w-[240px] max-w-[280px] h-full">
                {/* Column header */}
                <div className="flex items-center gap-2 mb-2 px-0.5">
                  <span className={cn("w-2 h-2 rounded-full flex-shrink-0", col.dot)} />
                  <span className={cn("text-sm font-semibold flex-1", col.accent)}>{col.label}</span>
                  <span className="text-xs font-medium text-muted-foreground">{cards.length}</span>
                  <button className="text-muted-foreground hover:text-foreground transition-colors">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button className="text-muted-foreground hover:text-foreground transition-colors">
                    <MoreHorizontal className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Cards */}
                <div className="flex-1 overflow-y-auto space-y-2 pr-0.5">
                  {cards.map(play => {
                    const isActive = activePlay?.id === play.id;
                    return (
                      <div
                        key={play.id}
                        className={cn(
                          "rounded-xl border bg-white p-3 cursor-pointer transition-all group",
                          isActive ? "border-primary shadow-sm ring-1 ring-primary/20" : "border-[#E5E7EB] hover:border-primary/40 hover:shadow-sm"
                        )}
                        onClick={() => setActivePlay(isActive ? null : play)}
                      >
                        {/* Suggested by row */}
                        {play.suggestedBy && (
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-[10px] text-muted-foreground font-medium">Suggested By</span>
                            <div className={cn("w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0", ASSIGNEE_COLORS[play.suggestedBy] ?? "bg-gray-400")}>
                              {play.suggestedBy}
                            </div>
                            <div className="flex-1" />
                            <button className="w-5 h-5 rounded-full bg-green-500/10 text-green-600 flex items-center justify-center hover:bg-green-500/20 transition-colors" onClick={e => e.stopPropagation()}>
                              <Check className="w-3 h-3" />
                            </button>
                            <button className="w-5 h-5 rounded-full bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors" onClick={e => e.stopPropagation()}>
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        )}

                        {/* Title */}
                        <p className={cn("text-xs font-semibold leading-snug mb-1", isActive ? "text-primary" : "text-foreground")}>
                          {isPl ? play.titlePl : play.title}
                        </p>
                        {/* Desc */}
                        <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2 mb-2">
                          {isPl ? play.descPl : play.desc}
                        </p>

                        {/* Tags row */}
                        <div className="flex items-center gap-1.5 flex-wrap mb-2">
                          <span className={cn("text-[10px] font-medium px-1.5 py-0.5 rounded", TAG_COLORS[play.tag] ?? "bg-gray-100 text-gray-600")}>
                            {play.tag}
                          </span>
                          <span className={cn("text-[10px] font-medium px-1.5 py-0.5 rounded border", PRIORITY_COLORS[play.priority])}>
                            {play.priority}
                          </span>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                            <MessageSquare className="w-3 h-3" />
                            {play.comments}
                          </div>
                          {play.attachments > 0 && (
                            <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                              <Paperclip className="w-3 h-3" />
                              {play.attachments}
                            </div>
                          )}
                          <div className="flex-1" />
                          <div className={cn("w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0", ASSIGNEE_COLORS[play.assignee] ?? "bg-gray-400")}>
                            {play.assignee}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Create a play ghost */}
                  <button className="w-full text-[11px] text-muted-foreground/60 border border-dashed border-[#D1D5DB] rounded-xl py-2.5 hover:border-primary/30 hover:text-muted-foreground transition-colors">
                    + {isPl ? "Utwórz play" : "Create a new play"}
                  </button>
                </div>
              </div>
            );
          })}

          {/* Add column */}
          <div className="flex-shrink-0 w-10 flex items-start pt-0.5">
            <button className="w-8 h-8 rounded-lg border border-dashed border-[#D1D5DB] flex items-center justify-center text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors">
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Slide-out play detail panel ── */}
      {activePlay && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/20" onClick={() => setActivePlay(null)} />

          {/* Panel */}
          <div className="relative w-[420px] h-full bg-white shadow-2xl border-l border-[#E5E7EB] flex flex-col overflow-hidden">
            {/* Panel header */}
            <div className="flex-shrink-0 flex items-center gap-3 px-5 py-3.5 border-b border-[#E5E7EB]">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span className={cn("w-2 h-2 rounded-full flex-shrink-0",
                  activePlay.status === "completed" ? "bg-green-500" :
                  activePlay.status === "in-progress" ? "bg-blue-500" :
                  activePlay.status === "blocked" ? "bg-orange-400" : "bg-gray-300"
                )} />
                <h3 className="font-bold text-sm text-foreground truncate">
                  {isPl ? activePlay.titlePl : activePlay.title}
                </h3>
                <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full border flex-shrink-0", PRIORITY_COLORS[activePlay.priority])}>
                  {activePlay.priority}
                </span>
              </div>
              <button onClick={() => setActivePlay(null)} className="w-7 h-7 flex items-center justify-center rounded-full text-muted-foreground hover:bg-muted transition-colors flex-shrink-0">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {activePlay.id === "3" ? (
                <div className="p-4 space-y-4">
                  {/* Coach Logic explanation */}
                  <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-3">
                    <div className="flex items-center gap-2.5">
                      <div className="relative flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
                          <span className="text-primary text-[11px] font-bold">CL</span>
                        </div>
                        <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-green-500 border-2 border-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-foreground">Coach Logic</p>
                        <p className="text-[11px] text-muted-foreground">{isPl ? "Wyjaśnienie kroku" : "Step explanation"}</p>
                      </div>
                      <button
                        onClick={handlePlayAudio}
                        className={cn("flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all flex-shrink-0",
                          isPlaying ? "bg-primary text-white" : "bg-white border border-primary/30 text-primary hover:bg-primary/5"
                        )}
                      >
                        {isPlaying ? (
                          <>
                            <span className="flex gap-0.5 items-end h-3">
                              {[0, 150, 300, 75].map((delay, i) => (
                                <span key={i} className="w-0.5 bg-white rounded-full animate-bounce" style={{ height: ["60%","100%","40%","80%"][i], animationDelay: `${delay}ms` }} />
                              ))}
                            </span>
                            {isPl ? "Odtwarzanie..." : "Playing..."}
                          </>
                        ) : (
                          <><Volume2 className="w-3.5 h-3.5" />{isPl ? "Posłuchaj" : "Listen"}</>
                        )}
                      </button>
                    </div>

                    {(isPlaying || audioProgress > 0) && (
                      <div className="w-full h-1 rounded-full bg-primary/10 overflow-hidden">
                        <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${audioProgress}%` }} />
                      </div>
                    )}

                    <p className="text-xs text-foreground/80 leading-relaxed whitespace-pre-line">
                      {isPl ? EXPLANATION.pl : EXPLANATION.en}
                    </p>

                    <a href="#" onClick={e => e.preventDefault()} className="inline-flex items-center gap-1 text-[11px] font-medium text-primary hover:underline">
                      <ExternalLink className="w-3 h-3" />
                      {isPl ? "Otwórz portal CMBE Illinois" : "Open Illinois CMBE Portal"}
                    </a>
                  </div>

                  {/* Progress */}
                  <div className="flex items-center gap-3 px-1">
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="text-[11px] font-medium text-muted-foreground">{isPl ? "Postęp dokumentów" : "Document progress"}</span>
                        <span className="text-[11px] font-bold">{checkedCount}/{docs.length}</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-gray-100 overflow-hidden">
                        <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progress}%` }} />
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-[11px] text-muted-foreground">{isPl ? "Przesłane" : "Uploaded"}</p>
                      <p className="text-sm font-bold">{uploadedCount}/{docs.length}</p>
                    </div>
                  </div>

                  {/* Checklist */}
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-foreground px-1">{isPl ? "Lista Dokumentów" : "Document Checklist"}</p>
                    {docs.map(doc => (
                      <div key={doc.id} className={cn("rounded-xl border p-3 transition-colors",
                        doc.uploaded ? "border-green-200 bg-green-50" : doc.checked ? "border-blue-100 bg-blue-50/40" : "border-[#E5E7EB] bg-white"
                      )}>
                        <div className="flex items-start gap-2.5">
                          <button onClick={() => toggleCheck(doc.id)} className="mt-0.5 flex-shrink-0">
                            {doc.checked
                              ? <CheckCircle2 className={cn("w-4 h-4", doc.uploaded ? "text-green-500" : "text-blue-500")} />
                              : <Circle className="w-4 h-4 text-gray-300 hover:text-primary transition-colors" />}
                          </button>
                          <div className="flex-1 min-w-0">
                            <p className={cn("text-xs font-medium leading-snug", doc.checked ? "text-foreground" : "text-foreground/80")}>
                              {isPl ? doc.labelPl : doc.label}
                            </p>
                            <p className="text-[11px] text-muted-foreground mt-0.5">{isPl ? doc.notePl : doc.note}</p>
                          </div>
                          <div className="flex-shrink-0">
                            {doc.uploaded
                              ? <span className="flex items-center gap-1 text-[10px] font-semibold text-green-600 bg-green-100 px-2 py-0.5 rounded-full"><CheckCheck className="w-3 h-3" />{isPl ? "Przesłano" : "Uploaded"}</span>
                              : <button onClick={() => markUploaded(doc.id)} className="flex items-center gap-1 text-[10px] font-medium text-muted-foreground border border-[#E5E7EB] px-2 py-0.5 rounded-full hover:border-primary/40 hover:text-primary transition-colors"><Upload className="w-3 h-3" />{isPl ? "Prześlij" : "Upload"}</button>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <button
                    className={cn("w-full py-3 rounded-xl text-sm font-semibold transition-all",
                      checkedCount === docs.length ? "bg-primary text-white hover:bg-primary/90" : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    )}
                    disabled={checkedCount < docs.length}
                  >
                    {checkedCount === docs.length
                      ? (isPl ? "Przejdź do Wniosku →" : "Proceed to Application →")
                      : (isPl ? `Zbierz pozostałe ${docs.length - checkedCount} dokumenty` : `Collect ${docs.length - checkedCount} more document${docs.length - checkedCount !== 1 ? "s" : ""} to continue`)}
                  </button>
                </div>
              ) : (
                <div className="p-5 space-y-4">
                  <div className="rounded-xl border border-[#E5E7EB] p-4 space-y-2">
                    <p className="text-xs text-muted-foreground leading-relaxed">{isPl ? activePlay.descPl : activePlay.desc}</p>
                    <div className="flex gap-2 pt-1 flex-wrap">
                      <span className={cn("text-[10px] font-medium px-2 py-0.5 rounded border", PRIORITY_COLORS[activePlay.priority])}>{activePlay.priority}</span>
                      <span className={cn("text-[10px] font-medium px-2 py-0.5 rounded", TAG_COLORS[activePlay.tag] ?? "bg-gray-100 text-gray-600")}>{activePlay.tag}</span>
                    </div>
                  </div>
                  <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-primary text-[10px] font-bold">CL</span>
                    </div>
                    <div>
                      <p className="text-xs font-semibold mb-1">Coach Logic</p>
                      <p className="text-xs text-foreground/80 leading-relaxed">
                        {isPl ? `Kliknij "Zbierz Wymagane Dokumenty" aby zobaczyć krok w toku z interaktywną listą kontrolną.` : `Click "Gather Required Documents" to see a step actively in progress with Coach Logic's guided checklist.`}
                      </p>
                      <button className="mt-2 text-[11px] font-semibold text-primary flex items-center gap-1 hover:underline"
                        onClick={() => setActivePlay(PLAYS[2])}>
                        {isPl ? "Pokaż aktywny krok →" : "Show active step →"}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Ask GoTackle */}
            <div className="flex-shrink-0 border-t border-[#E5E7EB] px-4 py-3 bg-white">
              <div className="flex items-center gap-2 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB] px-3 py-2.5">
                <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary text-[8px] font-bold">CL</span>
                </div>
                <input className="flex-1 bg-transparent text-xs text-foreground placeholder:text-muted-foreground outline-none"
                  placeholder={isPl ? "Zapytaj Coach Logic o ten krok..." : "Ask Coach Logic about this step..."}
                  readOnly />
                <button className="text-xs font-semibold text-primary hover:text-primary/80 flex-shrink-0">{isPl ? "Wyślij" : "Send"}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
