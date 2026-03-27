export type LangCode = string;

export const langCodeMap: Record<string, LangCode> = {
  English:    "en",
  Spanish:    "es",
  French:     "fr",
  German:     "de",
  Italian:    "it",
  Portuguese: "pt",
  Dutch:      "nl",
  Russian:    "ru",
  Japanese:   "ja",
  Chinese:    "zh",
  Korean:     "ko",
  Arabic:     "ar",
  Hindi:      "hi",
  Turkish:    "tr",
  Polish:     "pl",
};

// Patterns for detecting language from text
const langPatterns: { lang: string; pattern: RegExp }[] = [
  { lang: "Japanese",    pattern: /[\u3040-\u30ff\u31f0-\u31ff]/ },
  { lang: "Chinese",     pattern: /[\u4e00-\u9fff]/ },
  { lang: "Korean",      pattern: /[\uac00-\ud7af\u1100-\u11ff]/ },
  { lang: "Arabic",      pattern: /[\u0600-\u06ff]/ },
  { lang: "Russian",     pattern: /[\u0400-\u04ff]/ },
  { lang: "Hindi",       pattern: /[\u0900-\u097f]/ },
  // Latin-script languages — check common words
  { lang: "Spanish",     pattern: /\b(el|la|los|las|un|una|es|son|está|que|de|en|con|por|para|como|muy|pero|más|también|hola|gracias|sí|yo|tú|nosotros|vosotros|ellos)\b/i },
  { lang: "French",      pattern: /\b(le|la|les|un|une|des|est|sont|avec|dans|pour|sur|pas|plus|très|aussi|mais|et|ou|je|tu|nous|vous|ils|elles|bonjour|merci|oui|non)\b/i },
  { lang: "German",      pattern: /\b(der|die|das|ein|eine|ist|sind|mit|von|für|auf|nicht|auch|aber|und|oder|ich|du|wir|sie|hallo|danke|ja|nein|über|schon|noch)\b/i },
  { lang: "Italian",     pattern: /\b(il|lo|la|gli|le|un|una|è|sono|con|per|su|non|più|anche|ma|e|o|io|tu|noi|voi|loro|ciao|grazie|sì)\b/i },
  { lang: "Portuguese",  pattern: /\b(o|a|os|as|um|uma|é|são|com|de|em|por|para|não|mais|também|mas|e|ou|eu|tu|nós|vós|eles|elas|olá|obrigado|sim)\b/i },
  { lang: "Dutch",       pattern: /\b(de|het|een|is|zijn|met|van|voor|op|niet|ook|maar|en|of|ik|jij|wij|zij|hallo|dank|ja|nee|dat|dit)\b/i },
  { lang: "Turkish",     pattern: /\b(bir|bu|ve|de|da|için|ile|var|çok|ama|ya|mı|mi|mu|mü|ben|sen|biz|siz|onlar|merhaba|teşekkür|evet|hayır)\b/i },
  { lang: "Polish",      pattern: /\b(i|w|z|na|to|jest|są|nie|tak|ale|do|jak|się|co|że|po|przy|przed|przez|dla|cześć|dziękuję|tak|nie)\b/i },
];

/**
 * Attempt to detect the language of the given text.
 * Returns an English display name (e.g. "Spanish") or null if uncertain.
 */
export function detectLanguage(text: string): string | null {
  if (!text || text.trim().length < 4) return null;

  for (const { lang, pattern } of langPatterns) {
    if (pattern.test(text)) return lang;
  }

  return null; // default: assume English / keep current
}
