"use client";
import { Paragraph } from "@prisma/client";
import React, { useEffect, useRef } from "react";

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
      key={para.id}
      ref={paraIdRef}
      className={` py-2 md:py-3 cursor-pointer ${
        isActive ? "text-xl text-red-700" : ""
      }`}
      onClick={() => setSelectedTextTime(parseFloat(para.line.begin))}
    >
      {para.line.text}
    </p>
  );
};

export default ParagraphComp;
