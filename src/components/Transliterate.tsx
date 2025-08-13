import * as React from "react";
import { useState, useRef } from "react";
import {
  getTransliterateSuggestions,
  type LanguageCode,
} from "@/utils/googleinput";
import { Input } from "@/components/ui/input";
import { on } from "events";

export interface TransliterateProps {
  lang: LanguageCode;
  value?: string;
  onChangeText?: (value: string) => void;
}

// The properties that we copy into a mirrored div.
// Note that some browsers, such as Firefox, do not concatenate properties
// into their shorthand (e.g. padding-top, padding-bottom etc. -> padding),
// so we have to list every single property explicitly.
const properties = [
  "direction",
  "boxSizing",
  "width",
  "height",
  "overflowX",
  "overflowY",

  "borderTopWidth",
  "borderRightWidth",
  "borderBottomWidth",
  "borderLeftWidth",
  "borderStyle",

  "paddingTop",
  "paddingRight",
  "paddingBottom",
  "paddingLeft",

  "fontStyle",
  "fontVariant",
  "fontWeight",
  "fontStretch",
  "fontSize",
  "fontSizeAdjust",
  "lineHeight",
  "fontFamily",

  "textAlign",
  "textTransform",
  "textIndent",
  "textDecoration",

  "letterSpacing",
  "wordSpacing",

  "tabSize",
  "MozTabSize",
];

const isBrowser = typeof window !== "undefined";
const isFirefox = isBrowser && (window as any).mozInnerScreenX != null;

function getCaretCoordinates(
  element: HTMLInputElement,
  position: number,
  options?: { debug?: boolean }
) {
  if (!isBrowser) {
    throw new Error("getCaretCoordinates should only be called in a browser");
  }

  const debug = (options && options.debug) || false;
  if (debug) {
    const el = document.querySelector(
      "#input-textarea-caret-position-mirror-div"
    );
    if (el) {
      el.parentNode?.removeChild(el);
    }
  }

  const div = document.createElement("div");
  div.id = "input-textarea-caret-position-mirror-div";
  document.body.appendChild(div);

  const style = div.style;
  const computed = window.getComputedStyle(element);

  style.whiteSpace = "pre-wrap";
  style.wordWrap = "break-word";
  style.position = "absolute";
  if (!debug) style.visibility = "hidden";

  properties.forEach(function (prop) {
    style[prop as any] = computed[prop as any];
  });

  if (isFirefox) {
    if (element.scrollHeight > parseInt(computed.height))
      style.overflowY = "scroll";
  } else {
    style.overflow = "hidden";
  }

  div.textContent = element.value.substring(0, position);

  const span = document.createElement("span");
  span.textContent = element.value.substring(position) || ".";
  div.appendChild(span);

  const coordinates = {
    top: span.offsetTop + parseInt(computed["borderTopWidth"]),
    left: span.offsetLeft + parseInt(computed["borderLeftWidth"]),
    height: parseInt(computed["lineHeight"]),
  };

  if (!debug) {
    document.body.removeChild(div);
  }

  return coordinates;
}

export const Transliterate: React.FC<TransliterateProps> = ({
  lang,
  value,
  onChangeText,
}) => {
  const [text, setText] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [suggestionsPosition, setSuggestionsPosition] = useState({
    top: 0,
    left: 0,
  });
  const InputRef = useRef<HTMLInputElement>(null);

  const updateSuggestionsPosition = () => {
    if (InputRef.current) {
      const { top, left } = getCaretCoordinates(
        InputRef.current,
        InputRef.current.selectionStart!
      );
      setSuggestionsPosition({ top: top + 20, left }); // Add a small offset to show below the line
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newText = e.target.value;
    setText(newText);
    // onChangeText?.(newText);

    const cursorPosition = e.target.selectionStart;
    const textUntilCursor = newText.slice(0, cursorPosition!);
    const words = textUntilCursor.split(/\s+/);
    const currentWord = words[words.length - 1];

    if (currentWord) {
      getTransliterateSuggestions(currentWord, { lang }).then((suggestions) => {
        setSuggestions(suggestions);
        setShowSuggestions(true);
        setHighlightedIndex(0);
        updateSuggestionsPosition();
      });
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    const cursorPosition = InputRef.current?.selectionStart || text.length;
    const textUntilCursor = text.slice(0, cursorPosition);
    const words = textUntilCursor.split(/\s+/);
    const currentWord = words[words.length - 1];

    const newText = `${text.slice(
      0,
      cursorPosition - currentWord.length
    )}${suggestion} ${text.slice(cursorPosition)}`;

    setText(newText);
    setShowSuggestions(false);
    onChangeText?.(newText);

    // Focus and set cursor position after state update
    setTimeout(() => {
      if (InputRef.current) {
        const newCursorPosition =
          cursorPosition - currentWord.length + suggestion.length + 1;
        InputRef.current.focus();
        InputRef.current.setSelectionRange(
          newCursorPosition,
          newCursorPosition
        );
      }
    }, 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (showSuggestions && suggestions.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlightedIndex((prevIndex) =>
          prevIndex < suggestions.length - 1 ? prevIndex + 1 : 0
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlightedIndex((prevIndex) =>
          prevIndex > 0 ? prevIndex - 1 : suggestions.length - 1
        );
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (highlightedIndex !== -1) {
          handleSuggestionClick(suggestions[highlightedIndex]);
        }
      } else if (e.key === " ") {
        if (highlightedIndex !== -1) {
          e.preventDefault();
          handleSuggestionClick(suggestions[highlightedIndex]);
        }
      } else if (e.key === "Escape") {
        setShowSuggestions(false);
      }
    }
  };

  return (
    <div className="relative w-full">
      <Input
        ref={InputRef}
        value={text}
        onChange={handleTextChange}
        onKeyDown={handleKeyDown}
        onSelect={updateSuggestionsPosition}
        placeholder="Start typing in Roman script..."
      />
      {showSuggestions && (
        <ul
          className="absolute z-10 w-[180px] bg-white border border-gray-300 rounded-md shadow-lg"
          style={{
            top: suggestionsPosition.top,
            left: suggestionsPosition.left,
          }}
        >
          {suggestions.map((suggestion, index) => (
            <li
              key={suggestion}
              onClick={() => handleSuggestionClick(suggestion)}
              className="p-2 cursor-pointer"
              style={{
                backgroundColor:
                  index === highlightedIndex ? "#f0f0f0" : "transparent",
              }}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
