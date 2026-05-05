export const PERSONALITIES = [
  "Professional",
  "Casual",
  "Friendly",
  "Formal",
  "Direct",
  "Encouraging",
  "Empathetic",
  "Creative",
  "Humorous",
  "Concise",
] as const;

export type Personality = (typeof PERSONALITIES)[number];

// Female voices per personality (ElevenLabs voice IDs)
export const FEMALE_VOICES: Record<Personality, string> = {
  Professional: "EXAVITQu4vr4xnSDxMaL", // Bella
  Casual:       "AZnzlk1XvdvUeBnXmlld", // Domi
  Friendly:     "MF3mGyEYCl7XYWbV9V6O", // Elli
  Formal:       "ThT5KcBeYPX3keUQqHPh", // Dorothy
  Direct:       "pFZP5JQG7iQjIQuC4Bku", // Lily
  Encouraging:  "XrExE9yKIg1WjnnlVkGX", // Matilda
  Empathetic:   "jsCqWAovK2LkecY7zXl4", // Freya
  Creative:     "oWAxZDx7w5VEj9dCyTzz", // Grace
  Humorous:     "z9fAnlkpzviPz146aGWa", // Glinda
  Concise:      "FGY2WhTYpPnrIDTdsKH5", // Laura
};

// Male voices per personality (ElevenLabs voice IDs)
export const MALE_VOICES: Record<Personality, string> = {
  Professional: "onwK4e9ZLuTAKqWW03F9", // Daniel
  Casual:       "N2lVS1w4EtoT3dr4eOWO", // Callum
  Friendly:     "CwhRBWXzGAHq8TQ4Fs17", // Roger
  Formal:       "IKne3meq5aSn9XLyUdCD", // Charlie
  Direct:       "JBFqnCBsd6RMkjVDRZzb", // George
  Encouraging:  "bIHbv24MWmeRgasZH58o", // Will
  Empathetic:   "nPczCjzI2devNBz1zQrb", // Brian
  Creative:     "iP95p4xoKVk53GoZ742B", // Chris
  Humorous:     "cjVigY5qzO86Huf0OWal", // Eric
  Concise:      "pqHfZKP75CvOlQylNhV4", // Bill
};

export function getVoiceId(personality: Personality, gender: "female" | "male"): string {
  return gender === "female" ? FEMALE_VOICES[personality] : MALE_VOICES[personality];
}

// Language options for the composer bar selector
export const LANGUAGES = [
  "English",
  "Spanish",
  "Arabic",
] as const;

export type Language = (typeof LANGUAGES)[number];
