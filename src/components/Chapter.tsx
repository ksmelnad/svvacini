"use client";
import React, { useEffect, useRef, useState } from "react";
import { shobhika, shobhikaBold } from "@/utils/shobhika";
import {
  Commentary,
  Line as LineType,
  Paragraph as ParagraphType,
} from "@prisma/client";
import {
  Chapter as ChapterType,
  Section,
  Subsection,
  Verse,
} from "@prisma/client";
import Paragraph from "./Paragraph";
import Line from "./Line";
import { useRouter } from "next/navigation";
import alternateChapterData from "@/data/alternateChapterAudios.json";

type ChapterWithRelations = ChapterType & {
  paragraphs: (ParagraphType & {
    commentaries: Commentary[];
    // paraIdRef: React.RefObject<any>;
  })[];
  verses: Verse[];
  sections: (Section & {
    paragraphs: (ParagraphType & {
      commentaries: Commentary[];
      // paraIdRef: React.RefObject<any>;
    })[];
    verses: Verse[];
    subsections: (Subsection & {
      paragraphs: (ParagraphType & {
        commentaries: Commentary[];
        // paraIdRef: React.RefObject<any>;
      })[];
      verses: Verse[];
    })[];
  })[];
};
interface ParagraphProps {
  para: ParagraphType & {
    commentaries: Commentary[];
  };
}

const Chapter = ({
  chapter,
  scrollToLineId,
  selectedAudioIndex,
}: {
  chapter: ChapterWithRelations;
  scrollToLineId: string | null;
  selectedAudioIndex: string;
}) => {
  const paragraphRefs: { [key: string]: React.RefObject<any> } = useRef(
    {}
  ).current;

  const verseRefs: { [key: string]: React.RefObject<any> } = useRef({}).current;
  const [altChapter, setAltChapter] = useState<ChapterWithRelations>(
    {} as ChapterWithRelations
  );
  // const router = useRouter();
  // console.log(scrollToLineId);
  // console.log("Chapter", chapter);

  const [recievedSelectedAudioIndex, setRecievedSelectedAudioIndex] =
    useState(selectedAudioIndex);

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

  useEffect(() => {
    if (selectedAudioIndex === "1") {
      console.log("UseEffect");
      const updatedVerses = chapter.verses.map((verse, index) => {
        console.log("Verse", verse);
        const alternateVerse = alternateChapterData.find(
          (altVerse) => altVerse.order === verse.order
        );
        console.log(alternateVerse);
        if (alternateVerse) {
          return {
            id: verse.id,
            order: verse.order,
            chapterId: verse.chapterId,
            sectionId: verse.sectionId,
            subsectionId: verse.subsectionId,
            lines: alternateVerse.lines,
          };
        } else {
          return verse;
        }
      });
      setAltChapter({ ...chapter, verses: updatedVerses });
    }
  }, [selectedAudioIndex, chapter]);

  useEffect(() => {
    setRecievedSelectedAudioIndex(selectedAudioIndex);
  }, [selectedAudioIndex]);

  console.log("selectedAudioIndex", selectedAudioIndex);
  console.log("AltChapter also alternative", altChapter);

  return (
    <div className={`${shobhika.className} px-4 mt-6`}>
      <h2
        className={`text-xl lg:text-2xl font-bold text-red-800 pb-2 border-b border-gray-300 ${shobhikaBold.className} `}
      >
        {chapter.title}
      </h2>

      {chapter.paragraphs.map((para) => {
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
      {recievedSelectedAudioIndex !== "1" ? (
        <div>
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
        </div>
      ) : (
        <div>
          {altChapter.verses?.map((verse: Verse) => {
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
          })}{" "}
        </div>
      )}

      {chapter.sections?.map((section) => {
        return (
          <div key={section.id}>
            <p
              className={`text-lg lg:text-xl text-red-600 mt-4 bg-[#f0eee2] py-4 px-2 ${shobhikaBold.className} `}
            >
              {section.title}
            </p>
            {section.paragraphs.map((para) => {
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
            {section.subsections?.map((subsection) => {
              return (
                <div key={subsection.id}>
                  <p className={`pt-4 ${shobhikaBold.className} `}>
                    {subsection.title}
                  </p>
                  {subsection.paragraphs.map((para) => {
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
