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
    const rawText = line.text.replace(/ *(॥|।)/g, " $1 ");
    const textArray = rawText.split("\n");
    return textArray.map((text) => Sanscript.t(text, "devanagari", script));
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
            return text.split(/\s+/).map((word, wordIdx) => (
              <Dialog key={textIdx + wordIdx}>
                <DialogTrigger asChild>
                  <span className="hover:underline hover:text-green-500 hover:cursor-pointer">
                    {" "}
                    {word}
                  </span>
                </DialogTrigger>
                <DialogContent className="sm:w-[800px] sm:max-h-[90vh]">
                  <DialogHeader>
                    <DialogTitle>Analysis and Dictionary Look Up</DialogTitle>
                    <DialogDescription>
                      Root forms are obtained from the{" "}
                      <a
                        className="text-blue-400 hover:underline"
                        href="https://sanskrit.inria.fr/DICO/reader.fr.html"
                        target="_blank"
                      >
                        Sanskrit Reader Companion
                      </a>{" "}
                      and Dictionaries from{" "}
                      <a
                        className="text-blue-400 hover:underline"
                        href="https://www.sanskrit-lexicon.uni-koeln.de/"
                        target="_blank"
                      >
                        Cologne Digital Sanskrit Dictionaries.
                      </a>
                    </DialogDescription>
                    <div>
                      <p className="my-2 text-lg text-red-700">{word}</p>
                      <ShowRoots query={word} />
                    </div>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
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
