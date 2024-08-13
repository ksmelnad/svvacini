"use client";
import { useScriptStore } from "@/utils/useScriptStore";
import { Paragraph } from "@prisma/client";
import React, { useEffect, useRef } from "react";
import Sanscript from "@/utils/sanscript";


interface ParagraphProps {
  para: Paragraph;
  currentTime: number;
  setSelectedTextTime: React.Dispatch<React.SetStateAction<number>>;
  paraIdRef: React.RefObject<any>;
}

const ParagraphComp = ({
  para,
  currentTime,
  setSelectedTextTime,
  paraIdRef,
}: ParagraphProps) => {
  const isActive =
    currentTime >= parseFloat(para.line.begin) &&
    currentTime < parseFloat(para.line.end);

  const { script } = useScriptStore();


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
      className={` py-2 md:py-3 cursor-pointer ${
        isActive ? "text-xl text-red-700" : ""
      }`}
      onClick={() => setSelectedTextTime(parseFloat(para.line.begin))}
    >
      {Sanscript.t(para.line.text, "devanagari", script)}
    </p>
  );
};

export default ParagraphComp;
