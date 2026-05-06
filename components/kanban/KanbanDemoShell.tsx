"use client";

import React, { useState } from "react";
import {
  Play,
  CheckCircle2,
  Circle,
  Clock,
  AlertCircle,
  Volume2,
  ChevronRight,
  Globe,
  X,
  FileText,
  Upload,
  ExternalLink,
  CheckCheck,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

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
}

// ─── MBE Certification Plays ──────────────────────────────────────────────────

const PLAYS: PlayCard[] = [
  {
    id: "1",
    title: "Verify Ownership Eligibility",
    titlePl: "Zweryfikuj Kwalifikowalność Własności",
    desc: "Confirm 51%+ ownership by a minority U.S. citizen and Illinois residency.",
    descPl: "Potwierdź, że co najmniej 51% firmy należy do mniejszości będącej obywatelem USA i mieszkańcem Illinois.",
    status: "completed",
    tag: "Eligibility",
    priority: "High",
    assignee: "MK",
  },
  {
    id: "2",
    title: "Create CMBE Portal Account",
    titlePl: "Utwórz Konto w Portalu CMBE",
    desc: "Register at the Illinois CMBE online portal to begin your application.",
    descPl: "Zarejestruj się w portalu Illinois CMBE online, aby rozpocząć wniosek.",
    status: "completed",
    tag: "Admin",
    priority: "High",
    assignee: "MK",
  },
  {
    id: "3",
    title: "Gather Required Documents",
    titlePl: "Zbierz Wymagane Dokumenty",
    desc: "Compile all ownership, formation, and financial documents required by the state.",
    descPl: "Skompletuj wszystkie wymagane przez stan dokumenty dotyczące własności, założenia firmy i finansów.",
    status: "in-progress",
    tag: "Documentation",
    priority: "High",
    assignee: "MK",
  },
  {
    id: "4",
    title: "Complete Online Application",
    titlePl: "Wypełnij Wniosek Online",
    desc: "Submit the MBE application form through the CMBE portal with all documents attached.",
    descPl: "Złóż formularz wniosku MBE przez portal CMBE z dołączonymi wszystkimi dokumentami.",
    status: "not-started",
    tag: "Application",
    priority: "High",
    assignee: "MK",
  },
  {
    id: "5",
    title: "Pay Application Fee",
    titlePl: "Opłać Opłatę Aplikacyjną",
    desc: "Submit the $150 non-refundable certification application fee online.",
    descPl: "Opłać bezzwrotną opłatę certyfikacyjną w wysokości $150 online.",
    status: "not-started",
    tag: "Admin",
    priority: "Medium",
    assignee: "MK",
  },
  {
    id: "6",
    title: "Obtain Notarized Affidavit",
    titlePl: "Uzyskaj Notarialnie Poświadczone Oświadczenie",
    desc: "Have the Personal Certification Affidavit notarized before submission.",
    descPl: "Notarialnie poświadcz oświadczenie certyfikacyjne przed złożeniem wniosku.",
    status: "blocked",
    tag: "Legal",
    priority: "High",
    assignee: "MK",
  },
  {
    id: "7",
    title: "Schedule Site Visit / Interview",
    titlePl: "Zaplanuj Wizytę / Rozmowę Kwalifikacyjną",
    desc: "Coordinate with CMS for an on-site review of your business operations.",
    descPl: "Skoordynuj z CMS wizytę w celu weryfikacji działalności Twojej firmy.",
    status: "not-started",
    tag: "Review",
    priority: "Medium",
    assignee: "MK",
  },
  {
    id: "8",
    title: "Respond to Reviewer Questions",
    titlePl: "Odpowiedz na Pytania Recenzenta",
    desc: "Address any follow-up questions or document requests from the CMS reviewer.",
    descPl: "Odpowiedz na wszelkie pytania uzupełniające lub prośby o dokumenty od recenzenta CMS.",
    status: "not-started",
    tag: "Review",
    priority: "Medium",
    assignee: "MK",
  },
  {
    id: "9",
    title: "Receive Certification Decision",
    titlePl: "Otrzymaj Decyzję Certyfikacyjną",
    desc: "Await the official MBE certification decision letter from the state.",
    descPl: "Oczekuj oficjalnego pisma z decyzją dotyczącą certyfikatu MBE od stanu.",
    status: "not-started",
    tag: "Outcome",
    priority: "Low",
    assignee: "MK",
  },
];

const COLUMNS: { status: Status; label: string; color: string; dotColor: string }[] = [
  { status: "not-started", label: "Not Started", color: "text-gray-500", dotColor: "bg-gray-300" },
  { status: "in-progress", label: "In Progress", color: "text-blue-600", dotColor: "bg-blue-500" },
  { status: "blocked", label: "Blocked", color: "text-orange-500", dotColor: "bg-orange-400" },
  { status: "completed", label: "Completed", color: "text-green-600", dotColor: "bg-green-500" },
];

const PRIORITY_COLORS: Record<string, string> = {
  High: "bg-red-50 text-red-600 border-red-200",
  Medium: "bg-yellow-50 text-yellow-700 border-yellow-200",
  Low: "bg-green-50 text-green-700 border-green-200",
};

// ─── Document checklist for the active play ───────────────────────────────────

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
  {
    id: "d1",
    label: "Articles of Incorporation / Organization",
    labelPl: "Akt Założycielski / Statut",
    note: "Filed with Illinois Secretary of State",
    notePl: "Złożony w Sekretariacie Stanu Illinois",
    checked: true,
    uploaded: true,
  },
  {
    id: "d2",
    label: "Business Licenses & Permits",
    labelPl: "Licencje i Zezwolenia Biznesowe",
    note: "All active state and local licenses",
    notePl: "Wszystkie aktywne licencje stanowe i lokalne",
    checked: true,
    uploaded: false,
  },
  {
    id: "d3",
    label: "Proof of Minority Status",
    labelPl: "Dowód Statusu Mniejszości",
    note: "Passport, birth certificate, or naturalization papers",
    notePl: "Paszport, akt urodzenia lub dokumenty naturalizacji",
    checked: false,
    uploaded: false,
  },
  {
    id: "d4",
    label: "3 Years of Federal Tax Returns",
    labelPl: "3 Lata Federalnych Zeznań Podatkowych",
    note: "Personal and business returns",
    notePl: "Zeznania osobiste i firmowe",
    checked: false,
    uploaded: false,
  },
  {
    id: "d5",
    label: "Personal Net Worth Statement",
    labelPl: "Oświadczenie o Wartości Majątku Osobistego",
    note: "Must not exceed $1.32M (IL threshold)",
    notePl: "Nie może przekraczać $1,32 mln (próg Illinois)",
    checked: false,
    uploaded: false,
  },
  {
    id: "d6",
    label: "Signed Operating Agreement",
    labelPl: "Podpisana Umowa Operacyjna",
    note: "Showing 51%+ minority ownership",
    notePl: "Potwierdzająca ponad 51% własności mniejszości",
    checked: false,
    uploaded: false,
  },
];

// ─── GoTackle explanation content ─────────────────────────────────────────────

const EXPLANATION = {
  en: `This step is critical. Illinois requires every MBE applicant to upload verified ownership and financial documents before the application can be reviewed.\n\nStart with your Articles of Incorporation — that's your business birth certificate. Then gather proof of your minority status and 3 years of tax returns. The Personal Net Worth Statement is often the most time-consuming, so start it first.\n\nI've organized the full checklist below. Check each item off as you collect it, and upload the file directly here. I'll flag anything that looks incomplete before you submit.`,
  pl: `Ten krok jest kluczowy. Illinois wymaga, aby każdy wnioskodawca MBE przesłał zweryfikowane dokumenty własności i finansowe przed przeglądem wniosku.\n\nZacznij od Aktu Założycielskiego — to jest świadectwo urodzenia Twojej firmy. Następnie zbierz dowód statusu mniejszości i 3 lata zeznań podatkowych. Oświadczenie o Wartości Majątku Osobistego jest często najbardziej czasochłonne, więc zacznij od niego.\n\nPoniżej przygotowałem pełną listę kontrolną. Zaznacz każdy element po zebraniu go i prześlij plik bezpośrednio tutaj. Przed złożeniem wniosku oznaczę wszystko, co wygląda na niekompletne.`,
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function KanbanDemoShell() {
  const [lang, setLang] = useState<"en" | "pl">("en");
  const [activePlay, setActivePlay] = useState<PlayCard>(PLAYS[2]); // "Gather Required Documents"
  const [docs, setDocs] = useState<DocItem[]>(INITIAL_DOCS);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [panelOpen, setPanelOpen] = useState(true);

  const isPl = lang === "pl";

  const toggleCheck = (id: string) => {
    setDocs((prev) =>
      prev.map((d) => (d.id === id ? { ...d, checked: !d.checked } : d))
    );
  };

  const markUploaded = (id: string) => {
    setDocs((prev) =>
      prev.map((d) => (d.id === id ? { ...d, uploaded: true, checked: true } : d))
    );
  };

  const checkedCount = docs.filter((d) => d.checked).length;
  const uploadedCount = docs.filter((d) => d.uploaded).length;
  const progress = Math.round((checkedCount / docs.length) * 100);

  const handlePlayAudio = () => {
    if (isPlaying) {
      setIsPlaying(false);
      return;
    }
    setIsPlaying(true);
    setAudioProgress(0);
    const interval = setInterval(() => {
      setAudioProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setIsPlaying(false);
          return 100;
        }
        return p + 1;
      });
    }, 120);
  };

  const colPlays = (status: Status) => PLAYS.filter((p) => p.status === status);

  const StatusIcon = ({ status }: { status: Status }) => {
    if (status === "completed") return <CheckCircle2 className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />;
    if (status === "in-progress") return <Clock className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />;
    if (status === "blocked") return <AlertCircle className="w-3.5 h-3.5 text-orange-400 flex-shrink-0" />;
    return <Circle className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" />;
  };

  return (
    <div className="flex h-full overflow-hidden">
      {/* ── LEFT: Kanban board ── */}
      <div className={cn("flex flex-col overflow-hidden transition-all duration-300", panelOpen ? "w-[52%]" : "flex-1")}>
        {/* Board header */}
        <div className="flex-shrink-0 px-5 py-3 border-b border-[#E5E7EB] bg-white flex items-center justify-between gap-3">
          <div>
            <h2 className="font-bold text-base text-foreground">
              {isPl ? "Plan Certyfikacji MBE" : "MBE Certification Journey"}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {isPl ? "Maria Kowalski · Cel: certyfikacja w ciągu 90 dni" : "Maria Kowalski · Goal: certified within 90 days"}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Language toggle */}
            <div className="flex items-center gap-1.5 border border-[#E5E7EB] rounded-full px-3 py-1.5 text-xs font-medium text-muted-foreground">
              <Globe className="w-3.5 h-3.5" />
              <button
                onClick={() => setLang("en")}
                className={cn("transition-colors", lang === "en" ? "text-primary font-semibold" : "hover:text-foreground")}
              >
                EN
              </button>
              <span>/</span>
              <button
                onClick={() => setLang("pl")}
                className={cn("transition-colors", lang === "pl" ? "text-primary font-semibold" : "hover:text-foreground")}
              >
                PL
              </button>
            </div>

            {/* Progress pill */}
            <div className="flex items-center gap-2 border border-[#E5E7EB] rounded-full px-3 py-1.5">
              <div className="w-16 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                <div className="h-full rounded-full bg-primary" style={{ width: "22%" }} />
              </div>
              <span className="text-xs font-medium text-muted-foreground">22%</span>
            </div>

            <button className="flex items-center gap-1 bg-primary hover:bg-primary/90 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors">
              <Plus className="w-3.5 h-3.5" />
              {isPl ? "Dodaj Play" : "Add a Play"}
            </button>
          </div>
        </div>

        {/* Columns */}
        <div className="flex-1 overflow-x-auto overflow-y-hidden">
          <div className="flex h-full gap-0 min-w-max">
            {COLUMNS.map((col, ci) => {
              const cards = colPlays(col.status);
              return (
                <div
                  key={col.status}
                  className={cn(
                    "flex flex-col h-full w-56 flex-shrink-0",
                    ci < COLUMNS.length - 1 && "border-r border-[#E5E7EB]"
                  )}
                >
                  {/* Column header */}
                  <div className="flex-shrink-0 flex items-center gap-2 px-3 py-2.5 border-b border-[#E5E7EB] bg-white">
                    <span className={cn("w-2 h-2 rounded-full flex-shrink-0", col.dotColor)} />
                    <span className={cn("text-xs font-semibold", col.color)}>{col.label}</span>
                    <span className="ml-auto text-xs text-muted-foreground font-medium bg-gray-100 rounded-full w-5 h-5 flex items-center justify-center">
                      {cards.length}
                    </span>
                  </div>

                  {/* Cards */}
                  <div className="flex-1 overflow-y-auto p-2 space-y-2">
                    {cards.map((play) => {
                      const isActive = activePlay.id === play.id;
                      return (
                        <button
                          key={play.id}
                          onClick={() => { setActivePlay(play); setPanelOpen(true); }}
                          className={cn(
                            "w-full text-left rounded-xl border p-3 transition-all group",
                            isActive
                              ? "border-primary bg-primary/5 shadow-sm"
                              : "border-[#E5E7EB] bg-white hover:border-primary/40 hover:shadow-sm"
                          )}
                        >
                          <div className="flex items-start gap-1.5 mb-1.5">
                            <StatusIcon status={play.status} />
                            <p className={cn("text-xs font-semibold leading-snug", isActive ? "text-primary" : "text-foreground")}>
                              {isPl ? play.titlePl : play.title}
                            </p>
                          </div>
                          <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2 ml-5">
                            {isPl ? play.descPl : play.desc}
                          </p>
                          <div className="flex items-center gap-1.5 mt-2 ml-5">
                            <span className={cn("text-[10px] font-medium px-1.5 py-0.5 rounded border", PRIORITY_COLORS[play.priority])}>
                              {play.priority}
                            </span>
                            <span className="text-[10px] text-muted-foreground bg-gray-100 px-1.5 py-0.5 rounded">
                              {play.tag}
                            </span>
                            <div className="ml-auto w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                              <span className="text-[9px] font-bold text-primary">{play.assignee}</span>
                            </div>
                          </div>
                        </button>
                      );
                    })}

                    {/* Add play ghost */}
                    <button className="w-full text-[11px] text-muted-foreground/60 border border-dashed border-[#D1D5DB] rounded-xl py-2.5 hover:border-primary/30 hover:text-muted-foreground transition-colors">
                      + {isPl ? "Dodaj play" : "Create a play"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── RIGHT: Active Play Panel ── */}
      {panelOpen && (
        <div className="flex-1 flex flex-col overflow-hidden border-l border-[#E5E7EB] bg-white">
          {/* Panel header */}
          <div className="flex-shrink-0 flex items-center gap-3 px-5 py-3 border-b border-[#E5E7EB]">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <StatusIcon status={activePlay.status} />
              <h3 className="font-bold text-sm text-foreground truncate">
                {isPl ? activePlay.titlePl : activePlay.title}
              </h3>
              <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full border flex-shrink-0", PRIORITY_COLORS[activePlay.priority])}>
                {activePlay.priority}
              </span>
            </div>
            <button
              onClick={() => setPanelOpen(false)}
              className="w-7 h-7 flex items-center justify-center rounded-full text-muted-foreground hover:bg-muted transition-colors flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {activePlay.id === "3" ? (
              /* ── In-progress play detail ── */
              <div className="p-4 space-y-4">

                {/* GoTackle explanation card */}
                <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-3">
                  <div className="flex items-center gap-2.5">
                    <div className="relative flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
                        <span className="text-primary text-[11px] font-bold">CL</span>
                      </div>
                      <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-green-500 border-2 border-white" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-foreground">Coach Logic</p>
                      <p className="text-[11px] text-muted-foreground">{isPl ? "Wyjaśnienie kroku" : "Step explanation"}</p>
                    </div>
                    <button
                      onClick={handlePlayAudio}
                      className={cn(
                        "ml-auto flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all",
                        isPlaying
                          ? "bg-primary text-white"
                          : "bg-white border border-primary/30 text-primary hover:bg-primary/5"
                      )}
                    >
                      {isPlaying ? (
                        <>
                          <span className="flex gap-0.5 items-end h-3">
                            <span className="w-0.5 bg-white rounded-full animate-bounce" style={{ height: "60%", animationDelay: "0ms" }} />
                            <span className="w-0.5 bg-white rounded-full animate-bounce" style={{ height: "100%", animationDelay: "150ms" }} />
                            <span className="w-0.5 bg-white rounded-full animate-bounce" style={{ height: "40%", animationDelay: "300ms" }} />
                            <span className="w-0.5 bg-white rounded-full animate-bounce" style={{ height: "80%", animationDelay: "75ms" }} />
                          </span>
                          {isPl ? "Odtwarzanie..." : "Playing..."}
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-3.5 h-3.5" />
                          {isPl ? "Posłuchaj" : "Listen"}
                        </>
                      )}
                    </button>
                  </div>

                  {/* Audio progress bar */}
                  {(isPlaying || audioProgress > 0) && (
                    <div className="w-full h-1 rounded-full bg-primary/10 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{ width: `${audioProgress}%` }}
                      />
                    </div>
                  )}

                  {/* Explanation text */}
                  <div className="text-xs text-foreground/80 leading-relaxed whitespace-pre-line">
                    {isPl ? EXPLANATION.pl : EXPLANATION.en}
                  </div>

                  <a
                    href="#"
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-primary hover:underline"
                    onClick={(e) => e.preventDefault()}
                  >
                    <ExternalLink className="w-3 h-3" />
                    {isPl ? "Otwórz portal CMBE Illinois" : "Open Illinois CMBE Portal"}
                  </a>
                </div>

                {/* Progress summary */}
                <div className="flex items-center gap-3 px-1">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-medium text-muted-foreground">
                        {isPl ? "Postęp dokumentów" : "Document progress"}
                      </span>
                      <span className="text-[11px] font-bold text-foreground">{checkedCount}/{docs.length}</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-gray-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-[11px] text-muted-foreground">{isPl ? "Przesłane" : "Uploaded"}</p>
                    <p className="text-sm font-bold text-foreground">{uploadedCount}/{docs.length}</p>
                  </div>
                </div>

                {/* Document checklist */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-foreground px-1">
                    {isPl ? "Lista Dokumentów" : "Document Checklist"}
                  </p>
                  {docs.map((doc) => (
                    <div
                      key={doc.id}
                      className={cn(
                        "rounded-xl border p-3 transition-colors",
                        doc.uploaded
                          ? "border-green-200 bg-green-50"
                          : doc.checked
                          ? "border-blue-100 bg-blue-50/40"
                          : "border-[#E5E7EB] bg-white"
                      )}
                    >
                      <div className="flex items-start gap-2.5">
                        <button
                          onClick={() => toggleCheck(doc.id)}
                          className="mt-0.5 flex-shrink-0"
                        >
                          {doc.checked ? (
                            <CheckCircle2 className={cn("w-4 h-4", doc.uploaded ? "text-green-500" : "text-blue-500")} />
                          ) : (
                            <Circle className="w-4 h-4 text-gray-300 hover:text-primary transition-colors" />
                          )}
                        </button>
                        <div className="flex-1 min-w-0">
                          <p className={cn("text-xs font-medium leading-snug", doc.checked ? "text-foreground" : "text-foreground/80")}>
                            {isPl ? doc.labelPl : doc.label}
                          </p>
                          <p className="text-[11px] text-muted-foreground mt-0.5">
                            {isPl ? doc.notePl : doc.note}
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          {doc.uploaded ? (
                            <span className="flex items-center gap-1 text-[10px] font-semibold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                              <CheckCheck className="w-3 h-3" />
                              {isPl ? "Przesłano" : "Uploaded"}
                            </span>
                          ) : (
                            <button
                              onClick={() => markUploaded(doc.id)}
                              className="flex items-center gap-1 text-[10px] font-medium text-muted-foreground border border-[#E5E7EB] px-2 py-0.5 rounded-full hover:border-primary/40 hover:text-primary transition-colors"
                            >
                              <Upload className="w-3 h-3" />
                              {isPl ? "Prześlij" : "Upload"}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Submit CTA */}
                <div className="pt-1">
                  <button
                    className={cn(
                      "w-full py-3 rounded-xl text-sm font-semibold transition-all",
                      checkedCount === docs.length
                        ? "bg-primary text-white hover:bg-primary/90 shadow-sm"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    )}
                    disabled={checkedCount < docs.length}
                  >
                    {checkedCount === docs.length
                      ? (isPl ? "Przejdź do Wniosku →" : "Proceed to Application →")
                      : (isPl
                        ? `Zbierz pozostałe ${docs.length - checkedCount} dokument(y)`
                        : `Collect ${docs.length - checkedCount} more document${docs.length - checkedCount !== 1 ? "s" : ""} to continue`)}
                  </button>
                </div>
              </div>
            ) : (
              /* ── Other plays: generic detail ── */
              <div className="p-5 space-y-4">
                <div className="rounded-xl border border-[#E5E7EB] p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <StatusIcon status={activePlay.status} />
                    <p className="text-xs font-semibold text-foreground">
                      {isPl ? activePlay.titlePl : activePlay.title}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {isPl ? activePlay.descPl : activePlay.desc}
                  </p>
                  <div className="flex gap-2 pt-1">
                    <span className={cn("text-[10px] font-medium px-2 py-0.5 rounded border", PRIORITY_COLORS[activePlay.priority])}>
                      {activePlay.priority}
                    </span>
                    <span className="text-[10px] text-muted-foreground bg-gray-100 px-2 py-0.5 rounded">
                      {activePlay.tag}
                    </span>
                  </div>
                </div>

                <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-primary text-[10px] font-bold">CL</span>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground mb-1">Coach Logic</p>
                    <p className="text-xs text-foreground/80 leading-relaxed">
                      {isPl
                        ? `Ten krok stanie się aktywny po ukończeniu poprzednich etapów. Kliknij „Zbierz Wymagane Dokumenty" po lewej, aby zobaczyć krok w toku.`
                        : `This step becomes active once prior stages are complete. Click "Gather Required Documents" on the left to see a step in progress.`}
                    </p>
                    <button
                      className="mt-2 text-[11px] font-semibold text-primary flex items-center gap-1 hover:underline"
                      onClick={() => { setActivePlay(PLAYS[2]); setPanelOpen(true); }}
                    >
                      {isPl ? "Pokaż aktywny krok" : "Show active step"}
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground border border-dashed border-[#D1D5DB] rounded-xl p-3">
                  <FileText className="w-4 h-4 flex-shrink-0" />
                  {isPl ? "Brak zadań do wyświetlenia dla tego Play." : "No tasks to display for this play yet."}
                </div>
              </div>
            )}
          </div>

          {/* Panel footer: Ask GoTackle */}
          <div className="flex-shrink-0 border-t border-[#E5E7EB] px-4 py-3 bg-white">
            <div className="flex items-center gap-2 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB] px-3 py-2.5">
              <Play className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
              <input
                className="flex-1 bg-transparent text-xs text-foreground placeholder:text-muted-foreground outline-none"
                placeholder={isPl ? "Zapytaj Coach Logic o ten krok..." : "Ask Coach Logic about this step..."}
                readOnly
              />
              <button className="text-xs font-semibold text-primary hover:text-primary/80 flex-shrink-0">
                {isPl ? "Wyślij" : "Send"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
