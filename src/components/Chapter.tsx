"use client";
import React, { useEffect, useRef, useState } from "react";
import { shobhika, shobhikaBold } from "@/utils/shobhika";
import {
  Line as LineType,
  Paragraph as ParagraphType,
  Verse,
} from "@prisma/client";
import Paragraph from "./Paragraph";
import Line from "./Line";
import { useRouter } from "next/navigation";

const Chapter = ({
  chapter,
  scrollToLineId,
}: {
  chapter: any;
  scrollToLineId: string | null;
}) => {
  const paragraphRefs: { [key: string]: React.RefObject<any> } = useRef(
    {}
  ).current;

  const verseRefs: { [key: string]: React.RefObject<any> } = useRef({}).current;

  // const router = useRouter();
  // console.log(scrollToLineId);
  // console.log("Chapter", chapter);

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
        className={`text-xl lg:text-2xl font-bold text-red-800 pb-2 border-b border-gray-300 ${shobhikaBold.className} `}
      >
        {chapter.title}
      </h2>

      {chapter.paragraphs.map((para: ParagraphType) => {
        if (!paragraphRefs[para.id]) {
          paragraphRefs[para.id] = React.createRef();
        }
        return (
          <Paragraph
            key={para.id}
            para={para}
            paraIdRef={paragraphRefs[para.id]}
          />
        );
      })}
      {chapter.verses?.map((verse: Verse) => {
        return (
          <div id={verse.id} key={verse.id} className="py-2 md:py-3">
            {verse.lines.map((line: LineType, index: number) => {
              if (line && !verseRefs[verse.id + index]) {
                verseRefs[verse.id + index] = React.createRef();
              }
              return (
                <Line
                  lineId={verse.id}
                  key={index}
                  line={line}
                  index={index}
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
              className={`text-lg lg:text-xl text-red-600   pt-4 ${shobhikaBold.className} `}
            >
              {section.title}
            </p>
            {section.paragraphs.map((para: ParagraphType) => {
              if (!paragraphRefs[para.id]) {
                paragraphRefs[para.id] = React.createRef();
              }
              return (
                <Paragraph
                  key={para.id}
                  para={para}
                  paraIdRef={paragraphRefs[para.id]}
                />
              );
            })}
            {section.subsections?.map((subsection: any) => {
              return (
                <div key={subsection.id}>
                  <p className={`pt-4 ${shobhikaBold.className} `}>
                    {subsection.title}
                  </p>
                  {subsection.paragraphs.map((para: ParagraphType) => {
                    if (!paragraphRefs[para.id]) {
                      paragraphRefs[para.id] = React.createRef();
                    }
                    return (
                      <Paragraph
                        key={para.id}
                        para={para}
                        paraIdRef={paragraphRefs[para.id]}
                      />
                    );
                  })}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default Chapter;
