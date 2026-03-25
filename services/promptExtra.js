export const MAX_PROMPT_EXTRA_LENGTH = 400;

export function decodePromptExtraFromRoute(raw) {
  if (raw == null || raw === '') return '';
  try {
    return decodeURIComponent(String(raw));
  } catch {
    return String(raw);
  }
}

const BLOCKLIST = [
  /ignore\s+(all\s+)?(previous|prior|above)\s+instructions?/i,
  /disregard\s+(the\s+)?(system|above)/i,
  /you\s+are\s+now\s+(a|an)\s+/i,
  /\bSYSTEM\s*:/i,
  /\bADMIN\s*:/i,
  /\[INST\]/i,
  /<\s*script/i,
];


export function validatePromptExtraForUi(raw) {
  if (raw == null || raw === '') return { ok: true, value: '' };
  const s = String(raw);
  if (s.length > MAX_PROMPT_EXTRA_LENGTH) {
    return {
      ok: false,
      error: `Keep it under ${MAX_PROMPT_EXTRA_LENGTH} characters.`,
    };
  }
  const trimmed = s.trim();
  if (trimmed === '') return { ok: true, value: '' };
  for (const pattern of BLOCKLIST) {
    if (pattern.test(trimmed)) {
      return {
        ok: false,
        error: 'That text cannot be used. Describe visual details only.',
      };
    }
  }
  return { ok: true, value: trimmed };
}
