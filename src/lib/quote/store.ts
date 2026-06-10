import { EMPTY_SELECTION, type QuoteSelection } from "./compute";

const STORAGE_KEY = "leviora:quote-selection";

/**
 * Quote selections live in sessionStorage so /quote can hand off to /intake
 * without a server round-trip or an unbounded URL.
 */
export function saveQuoteSelection(selection: QuoteSelection) {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(selection));
}

export function loadQuoteSelection(): QuoteSelection | null {
  if (typeof window === "undefined") return null;
  const raw = window.sessionStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return { ...EMPTY_SELECTION, ...JSON.parse(raw) } as QuoteSelection;
  } catch {
    return null;
  }
}

export function clearQuoteSelection() {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(STORAGE_KEY);
}
