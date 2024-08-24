"use client";
import {
  useCurrentTimeStore,
  useScriptStore,
  useSelectedTextTimeStore,
} from "@/utils/useStore";
import { Line as LineType } from "@prisma/client";
import React, { useEffect } from "react";
import Sanscript from "@/utils/sanscript";

interface LineProps {
  lineId: string;
  line: LineType;
  index: number;
  lineRef: React.RefObject<any>;
}

const Line = ({ lineId, line, index, lineRef }: LineProps) => {
  const { currentTime } = useCurrentTimeStore();

  const isActive =
    currentTime >= parseFloat(line.begin) && currentTime < parseFloat(line.end);

  const { script } = useScriptStore();
  const { setSelectedTextTime } = useSelectedTextTimeStore();

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
      className={`ml-2 md:ml-4 cursor-pointer ${
        isActive ? "text-xl text-red-700" : ""
      }`}
      onClick={() => setSelectedTextTime(parseFloat(line.begin))}
    >
      {line.text.includes("\n") ? (
        line.text.split("\n").map((text: string, index: number) => {
          return (
            <span className="" key={index}>
              {Sanscript.t(text, "devanagari", script)}
              <br />
            </span>
          );
        })
      ) : (
        <span className="">{Sanscript.t(line.text, "devanagari", script)}</span>
      )}
    </p>
  );
};

export default Line;
