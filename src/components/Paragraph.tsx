"use client";
import {
  useCurrentTimeStore,
  useDictionaryStore,
  useScriptStore,
  useSelectedTextTimeStore,
} from "@/utils/useStore";

import type {
  Commentary,
  Line,
  Paragraph as ParagraphType,
} from "@prisma/client";
import React, { useEffect, useRef, useState } from "react";
import Sanscript from "@/utils/sanscript";
import { Button } from "./ui/button";
import {
  CirclePlay,
  MinusIcon,
  Play,
  PlayCircle,
  PlusIcon,
} from "lucide-react";
import DialogDictionary from "./DialogDictionary";

interface ParagraphProps {
  para: ParagraphType & {
    commentaries: Commentary[];
  };
  paraIdRef: React.RefObject<any>;
}

const Paragraph = ({ para, paraIdRef }: ParagraphProps) => {
  const { currentTime } = useCurrentTimeStore();

  const isActive =
    currentTime >= parseFloat(para.line.begin) &&
    currentTime < parseFloat(para.line.end);

  const { script } = useScriptStore();
  const { setSelectedTextTime } = useSelectedTextTimeStore();
  const [isCommentary, setIsCommentary] = useState(false);
  const { isDictionaryActive } = useDictionaryStore();

  useEffect(() => {
    if (isActive && paraIdRef?.current) {
      paraIdRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [isActive, para.id, paraIdRef]);

  return (
    <div>
      <div className="flex items-center gap-4">
        {isDictionaryActive ? (
          <div className="ml-2 md:ml-4 py-2 lg:text-lg">
            {para.line.text.split(/\s+/).map((word, index) => (
              <DialogDictionary key={index.toString()} word={word} />
            ))}
          </div>
        ) : (
          <p
            id={para.id}
            key={para.id}
            ref={paraIdRef}
            className={`ml-2 md:ml-4  cursor-pointer break-all ${
              isActive ? "py-4 text-xl text-red-700" : "py-2 text-lg"
            }`}
            onClick={() => setSelectedTextTime(parseFloat(para.line.begin))}
          >
            {script !== "devanagari"
              ? Sanscript.t(para.line.text, "devanagari", script)
              : para.line.text}
          </p>
        )}

        {para.commentaries && para.commentaries.length > 0 && (
          <Button
            variant={isCommentary ? "ghost" : "ghost"}
            size={"icon"}
            onClick={() => setIsCommentary(!isCommentary)}
          >
            {isCommentary ? <MinusIcon size={15} /> : <PlusIcon size={15} />}
          </Button>
        )}
      </div>
      {isCommentary &&
        para.commentaries.map((commentary: Commentary, index: number) => (
          <div key={index} className="flex gap-4">
            <p>
              <Play size={15} />
            </p>
            {/* <audio src={commentary.audio} */}
            <p key={index} className="leading-loose">
              {commentary.lines.map((line: Line, index: number) => (
                <span key={index} className="break-all">
                  {line.text.replace(/ *(॥|।|\?) */g, "\u00A0$1 ")}
                </span>
              ))}
            </p>
          </div>
        ))}
    </div>
  );
};

export default Paragraph;
