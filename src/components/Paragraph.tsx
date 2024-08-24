"use client";
import {
  useCurrentTimeStore,
  useScriptStore,
  useSelectedTextTimeStore,
} from "@/utils/useStore";
import { Paragraph as ParagraphType } from "@prisma/client";
import React, { useEffect, useRef } from "react";
import Sanscript from "@/utils/sanscript";

interface ParagraphProps {
  para: ParagraphType;
  paraIdRef: React.RefObject<any>;
}

const Paragraph = ({ para, paraIdRef }: ParagraphProps) => {
  const { currentTime } = useCurrentTimeStore();

  const isActive =
    currentTime >= parseFloat(para.line.begin) &&
    currentTime < parseFloat(para.line.end);

  const { script } = useScriptStore();
  const { setSelectedTextTime } = useSelectedTextTimeStore();

  useEffect(() => {
    if (isActive && paraIdRef?.current) {
      paraIdRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [isActive, para.id, paraIdRef]);

  return (
    <p
      id={para.id}
      key={para.id}
      ref={paraIdRef}
      className={` ml-2 md:ml-4 py-2 md:py-3 cursor-pointer ${
        isActive ? "text-base lg:text-xl text-red-700" : "text-sm"
      }`}
      onClick={() => setSelectedTextTime(parseFloat(para.line.begin))}
    >
      {Sanscript.t(para.line.text, "devanagari", script)}
    </p>
  );
};

export default Paragraph;
