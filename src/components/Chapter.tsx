"use client";
import React, { useEffect, useRef, useState } from "react";
import { shobhika, shobhikaBold } from "@/utils/shobhika";
import { Line, Paragraph, Verse } from "@prisma/client";
import ParagraphComp from "./ParagraphComp";
import LineComp from "./LineComp";
import { useRouter } from "next/navigation";

const Chapter = ({
  chapter,
  currentTime,
  setSelectedTextTime,
  scrollToLineId,
}: {
  chapter: any;
  currentTime: number;
  setSelectedTextTime: React.Dispatch<React.SetStateAction<number>>;
  scrollToLineId: string | null;
}) => {
  const paragraphRefs: { [key: string]: React.RefObject<any> } = useRef(
    {}
  ).current;

  const verseRefs: { [key: string]: React.RefObject<any> } = useRef({}).current;

  const router = useRouter();
  // console.log(scrollToLineId);

  useEffect(() => {
    setTimeout(() => {
      if (scrollToLineId) {
        console.log(scrollToLineId, verseRefs[scrollToLineId!]);
        document.getElementById(scrollToLineId)?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
        // verseRefs[scrollToLineId].current.scrollIntoView({
        //   behavior: "smooth",
        //   block: "center",
        // });
      }
    }, 100);
  }, [scrollToLineId, verseRefs]);

  // console.log(scrollToLineId, verseRefs[scrollToLineId!].current);

  

  return (
    <div className={`${shobhika.className} px-4`}>
      <h2
        className={`text-xl font-bold text-yellow-800 pb-2 ${shobhikaBold.className} `}
      >
        {chapter.title}
      </h2>

      {chapter.paragraphs.map((para: Paragraph) => {
        if (!paragraphRefs[para.id]) {
          paragraphRefs[para.id] = React.createRef();
        }
        return (
          <ParagraphComp
            key={para.id}
            para={para}
            paraIdRef={paragraphRefs[para.id]}
            currentTime={currentTime}
            setSelectedTextTime={setSelectedTextTime}
          />
        );
      })}
      {chapter.verses?.map((verse: Verse) => {
        return (
          <div id={verse.id} key={verse.id} className="py-2 md:py-3">
            {verse.lines.map((line: Line, index: number) => {
              if (line && !verseRefs[verse.id + index]) {
                verseRefs[verse.id + index] = React.createRef();
              }
              return (
                <LineComp
                  lineId={verse.id}
                  key={index}
                  line={line}
                  index={index}
                  currentTime={currentTime}
                  setSelectedTextTime={setSelectedTextTime}
                  lineRef={verseRefs[verse.id + index]}
                />
              );
            })}
          </div>
        );
      })}

      {chapter.sections?.map((section: any) => {
        return (
          <div key={section.id}>
            <p
              className={`text-yellow-700 text-lg font-semibold pt-4 ${shobhikaBold.className} `}
            >
              {section.title}
            </p>
            {section.paragraphs.map((para: Paragraph) => {
              if (!paragraphRefs[para.id]) {
                paragraphRefs[para.id] = React.createRef();
              }
              return (
                <ParagraphComp
                  key={para.id}
                  para={para}
                  paraIdRef={paragraphRefs[para.id]}
                  currentTime={currentTime}
                  setSelectedTextTime={setSelectedTextTime}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default Chapter;
