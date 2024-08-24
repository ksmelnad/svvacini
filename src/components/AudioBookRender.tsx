"use client";
import React, { useEffect, useState } from "react";
import { shobhika, shobhikaBold } from "@/utils/shobhika";
import AudioPlayerComp from "@/components/AudioPlayerComp";
import "react-h5-audio-player/lib/styles.css";
import { Button } from "./ui/button";
import Chapter from "./Chapter";
import { ArrowLeft, Menu } from "lucide-react";
import Sidebar from "./Sidebar";
import { useSearchParams } from "next/navigation";
import {
  Book,
  Chapter as ChapterType,
  Paragraph,
  Section,
  Verse,
} from "@prisma/client";
import {
  Select,
  SelectGroup,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectLabel,
} from "@/components/ui/select";

import { ArrowRight } from "lucide-react";
import { useScriptStore, useSelectedTextTimeStore } from "@/utils/useStore";

interface AudioBookRenderProps {
  bookData: BookWithRelations | null;
}

type BookWithRelations = Book & {
  chapters: (ChapterType & {
    paragraphs: Paragraph[];
    verses: Verse[];
    sections: (Section & {
      paragraphs: Paragraph[];
      verses: Verse[];
    })[];
  })[];
};

const scripts: {
  [key: string]: string;
} = {
  itrans: "ITRANS",
  devanagari: "Devanagari",
  iast: "IAST",
  hk: "Harvard-Kyoto",
  slp1: "SLP1",
  velthuis: "Velthuis",
  wx: "WX",
  kannada: "Kannada",
  malayalam: "Malayalam",
  tamil: "Tamil",
  telugu: "Telugu",
  bengali: "Bengali",
  gurmukhi: "Gurmukhi",
  gujarati: "Gujarati",
  oriya: "Oriya",
};

const findChapterOrderById = (bookData: BookWithRelations, lineId: string) => {
  for (const chapter of bookData.chapters) {
    // Check paragraphs in the chapter
    if (chapter.paragraphs.some((paragraph) => paragraph.id === lineId)) {
      return chapter.order;
    }
    // Check verses in the chapter
    if (chapter.verses.some((verse) => verse.id === lineId)) {
      return chapter.order;
    }
    // Check paragraphs in sections and subsections
    for (const section of chapter.sections) {
      if (section.paragraphs.some((paragraph) => paragraph.id === lineId)) {
        return chapter.order;
      }
      // Check verses in sections and subsections
      if (section.verses.some((verse) => verse.id === lineId)) {
        return chapter.order;
      }
      // for (const subsection of section.subsections) {
      //   if (subsection.paragraphs.some(paragraph => paragraph.id === id)) {
      //     return chapter.order;
      //   }
      // }
    }
  }
  throw new Error(`ID not found`);
};

const AudioBookRender: React.FC<AudioBookRenderProps> = ({ bookData }) => {
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [sidebarActive, setSidebarActive] = useState(false);

  const searchParams = useSearchParams();
  const lineId = searchParams.get("lineId");

  const { script, setScript } = useScriptStore();
  const { selectedTextTime, setSelectedTextTime } = useSelectedTextTimeStore();

  // console.log(script);
  // console.log("BookData: ", bookData);

  useEffect(() => {
    if (lineId) {
      const chapterOder = findChapterOrderById(bookData!, lineId);
      setCurrentChapterIndex(chapterOder - 1);
      // console.log(chapterOder - 1);
    }
  }, [bookData, lineId]);

  //   console.log(currentTime);
  //   console.log("Content type:", typeof content);
  //   console.log(content.map);

  // SC1:1-SC2:0_PCID:0_CID:1 parse this and get me SC1:1 only

  // console.log("Book data in AudioBookRender", bookData);

  const sectionTitle = (line: string) => {
    const sectionTitle = line.split("-")[0];
    return sectionTitle;
  };

  const handleNextButton = () => {
    setSelectedTextTime(0);
    setCurrentChapterIndex((prev) => prev + 1);
  };

  const handlePreviousButton = () => {
    setSelectedTextTime(0);
    setCurrentChapterIndex((prev) => prev - 1);
  };

  if (bookData?.chapters.length === 0) {
    return <div className="max-w-3xl mx-auto">No data</div>;
  }

  return (
    <div className="flex">
      <Sidebar
        bookData={bookData}
        currentChapterIndex={currentChapterIndex}
        setCurrentChapterIndex={setCurrentChapterIndex}
        sidebarActive={sidebarActive}
        setSidebarActive={setSidebarActive}
      />

      <main className="flex-1  max-w-5xl mx-auto lg:ml-64  ">
        <div className="mb-16">
          <div className="flex gap-2 items-center justify-between mb-6 px-4 py-4 w-full">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden -ml-2 my-2"
              onClick={() => setSidebarActive(!sidebarActive)}
            >
              <Menu />
            </Button>

            <div className="px-2 flex flex-row lg:justify-center gap-4 ">
              <h2 className={`text-xl lg:text-2xl ${shobhikaBold.className} `}>
                {bookData?.title}{" "}
              </h2>

              <p className="text-sm">({bookData?.author})</p>
            </div>
            <Select onValueChange={setScript} value={script}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Choose script" />
              </SelectTrigger>
              <SelectContent id="select-script">
                <SelectGroup>
                  <SelectLabel>Script</SelectLabel>
                  {Object.keys(scripts).map((key) => (
                    <SelectItem key={key} value={key}>
                      {scripts[key]}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="">
            <div className="flex justify-center">
              <Chapter
                chapter={bookData?.chapters[currentChapterIndex]}
                scrollToLineId={lineId}
              />
            </div>
            <div className="py-2 md:py-3 flex justify-center items-center gap-4">
              <Button
                variant="outline"
                onClick={handlePreviousButton}
                disabled={currentChapterIndex === 0}
                className="flex gap-2 items-center"
              >
                <ArrowLeft size={16} /> <span>Previous</span>
              </Button>
              <Button
                variant="outline"
                onClick={handleNextButton}
                disabled={
                  currentChapterIndex === bookData?.chapters.length! - 1
                }
                className="flex gap-2 items-center"
              >
                <span>Next</span> <ArrowRight size={16} />
              </Button>
            </div>
          </div>
        </div>
        <div className="sticky bottom-0 w-full">
          {bookData?.chapters[currentChapterIndex].audio && (
            <AudioPlayerComp
              src={bookData.chapters[currentChapterIndex].audio || ""}
              chapter={bookData.chapters[currentChapterIndex]}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default AudioBookRender;
