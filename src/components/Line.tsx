"use client";
import {
  useCurrentTimeStore,
  useDictionaryStore,
  useScriptStore,
  useSelectedTextTimeStore,
} from "@/utils/useStore";
import { Line as LineType } from "@prisma/client";
import React, { useEffect, useMemo } from "react";
import Sanscript from "@/utils/sanscript";
import { Popover, PopoverTrigger } from "./ui/popover";
import { PopoverContent } from "@radix-ui/react-popover";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import ShowRoots from "./ShowRoots";
import DialogDictionary from "./DialogDictionary";

interface LineProps {
  lineId: string;
  line: LineType;
  index: number;
  lineRef: React.RefObject<any>;
}

const Line = ({ lineId, line, index, lineRef }: LineProps) => {
  const { currentTime } = useCurrentTimeStore();
  const { script } = useScriptStore();
  const { setSelectedTextTime } = useSelectedTextTimeStore();
  const { isDictionaryActive } = useDictionaryStore();

  // Memoized active state to avoid unnecessary recalculations
  const isActive = useMemo(() => {
    return (
      currentTime >= parseFloat(line.begin) &&
      currentTime < parseFloat(line.end)
    );
  }, [currentTime, line]);

  // Memoized transliterated text to avoid recalculations on every render
  const formattedText = useMemo(() => {
    const rawText = line.text.replace(/ *(॥|।)/g, "\u00A0$1 ");
    const textArray = rawText.split("\n");

    if (script !== "devanagari") {
      return textArray.map((text) => Sanscript.t(text, "devanagari", script));
    }

    return textArray;
  }, [line.text, script]);

  // Smooth scroll when line becomes active
  useEffect(() => {
    if (isActive && lineRef.current) {
      lineRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [isActive, lineRef]);

  const handleLineClick = () => {
    setSelectedTextTime(parseFloat(line.begin));
  };

  return (
    <div>
      {isDictionaryActive ? (
        <div className="ml-2 md:ml-4 py-2 lg:text-lg">
          {formattedText.map((text, textIdx) => {
            return text
              .split(/\s+/)
              .map((word, wordIdx) => (
                <DialogDictionary
                  key={textIdx.toString() + wordIdx.toString()}
                  word={word}
                />
              ));
          })}
        </div>
      ) : (
        <p
          id={lineId}
          key={index}
          ref={lineRef}
          className={`ml-2 md:ml-4 cursor-pointer ${
            isActive ? "py-4 text-xl text-red-700" : "py-2 lg:text-lg"
          }`}
          onClick={handleLineClick}
        >
          {formattedText.map((text, idx) => (
            <span key={idx}>
              {text}
              <br />
            </span>
          ))}
        </p>
      )}
    </div>
  );
};

export default Line;
