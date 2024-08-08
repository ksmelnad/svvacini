"use client";
import { Line, Paragraph, Verse } from "@prisma/client";
import React, { useEffect, useRef } from "react";

interface LineProps {
  lineId: string;
  line: Line;
  index: number;
  currentTime: number;
  setSelectedTextTime: React.Dispatch<React.SetStateAction<number>>;
  lineRef: React.RefObject<any>;
}

const LineComp = ({
  lineId,
  line,
  index,
  currentTime,
  setSelectedTextTime,
  lineRef,
}: LineProps) => {
  const isActive =
    currentTime >= parseFloat(line.begin) && currentTime < parseFloat(line.end);

  useEffect(() => {
    if (isActive && lineRef.current) {
      lineRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [isActive, lineRef]);

  return (
    <p
      id={lineId}
      key={index}
      ref={lineRef}
      className={`cursor-pointer ${isActive ? "text-xl text-red-700" : ""}`}
      onClick={() => setSelectedTextTime(parseFloat(line.begin))}
    >
      {line.text.includes("\n") ? (
        line.text.split("\n").map((text: string, index: number) => {
          return (
            <span className="" key={index}>
              {text}
              <br />
            </span>
          );
        })
      ) : (
        <span className="">{line.text}</span>
      )}
    </p>
  );
};

export default LineComp;
