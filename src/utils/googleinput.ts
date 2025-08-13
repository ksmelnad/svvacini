/**
 * @file This file contains the core transliteration logic.
 * It is framework-agnostic and can be used in any TypeScript project.
 */

/**
 * The language codes supported by the Google Input Tools API.
 */
export type LanguageCode =
  | "am"
  | "ar"
  | "bn"
  | "el"
  | "gu"
  | "hi"
  | "kn"
  | "ml"
  | "mr"
  | "ne"
  | "or"
  | "fa"
  | "pa"
  | "ru"
  | "sa"
  | "si"
  | "sr"
  | "ta"
  | "te"
  | "ti"
  | "ur";

/**
 * The configuration options for the transliteration function.
 */
export interface TransliterationConfig {
  /**
   * The number of suggestions to fetch.
   * @default 5
   */
  numOptions?: number;
  /**
   * Whether to show the current word as the last suggestion.
   * @default true
   */
  showCurrentWordAsLastSuggestion?: boolean;
  /**
   * The language to transliterate to.
   * @default "hi"
   */
  lang?: LanguageCode;
}

/**
 * Fetches transliteration suggestions from the Google Input Tools API.
 *
 * @param word The word to transliterate.
 * @param config The configuration options.
 * @returns A promise that resolves with an array of transliteration suggestions.
 */
export const getTransliterateSuggestions = async (
  word: string,
  config?: TransliterationConfig
): Promise<string[]> => {
  const {
    numOptions = 5,
    showCurrentWordAsLastSuggestion = true,
    lang = "hi",
  } = config || {};

  const url = `https://inputtools.google.com/request?text=${word}&itc=${lang}-t-i0-und&num=${numOptions}&cp=0&cs=1&ie=utf-8&oe=utf-8&app=demopage`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (data && data[0] === "SUCCESS") {
      let suggestions = data[1][0][1];
      if (showCurrentWordAsLastSuggestion) {
        suggestions = [...suggestions, word];
      }
      return suggestions;
    } else {
      if (showCurrentWordAsLastSuggestion) {
        return [word];
      }
      return [];
    }
  } catch (e) {
    console.error("There was an error with transliteration", e);
    return [];
  }
};
