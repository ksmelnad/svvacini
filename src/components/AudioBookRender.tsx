"use client";
import React, { useEffect, useState } from "react";
import { shobhika, shobhikaBold } from "@/utils/shobhika";
import AudioPlayerComp from "@/components/AudioPlayerComp";
import "react-h5-audio-player/lib/styles.css";
import { Button } from "./ui/button";
import Chapter from "./Chapter";
import { ArrowLeft, Menu, UserPen, ArrowRight, Music } from "lucide-react";
import Sidebar from "./Sidebar";
import { useSearchParams } from "next/navigation";
import {
  Book,
  Chapter as ChapterType,
  Commentary,
  Paragraph as ParagraphType,
  Section,
  Subsection,
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetClose,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import {
  useDictionaryStore,
  useScriptStore,
  useSelectedTextTimeStore,
} from "@/utils/useStore";
import CustomAudioPlayer from "./CustomAudioPlayer";
import Dictionary from "./Dictionary";
import { Switch } from "./ui/switch";
import CustomAudioPlayerTwo from "./CustomAudioPlayerTwo";
// import CustomAudioPlayerTwo from "./CustomAudioPlayerTwo";

interface AudioBookRenderProps {
  bookData: BookWithRelations | null;
}

type BookWithRelations = Book & {
  chapters: (ChapterType & {
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
        })[];
        verses: Verse[];
      })[];
    })[];
  })[];
};

const scripts: {
  [key: string]: string;
} = {
  devanagari: "Devanagari",
  iast: "IAST",
  kannada: "Kannada",
  telugu: "Telugu",
  malayalam: "Malayalam",
  bengali: "Bengali",
  gujarati: "Gujarati",
  oriya: "Oriya",
  gurmukhi: "Gurmukhi",
  itrans: "ITRANS",
  hk: "Harvard-Kyoto",
  slp1: "SLP1",
  velthuis: "Velthuis",
  wx: "WX",
  // tamil: "Tamil",
};

const findChapterOrderById = (bookData: BookWithRelations, lineId: string) => {
  for (const chapter of bookData.chapters) {
    // Check paragraphs in the chapter
    if (
      chapter.paragraphs.some(
        (paragraph: ParagraphType) => paragraph.id === lineId
      )
    ) {
      return chapter.order;
    }
    // Check verses in the chapter
    if (chapter.verses.some((verse: Verse) => verse.id === lineId)) {
      return chapter.order;
    }
    // Check paragraphs in sections and subsections
    for (const section of chapter.sections) {
      if (
        section.paragraphs.some(
          (paragraph: ParagraphType) => paragraph.id === lineId
        )
      ) {
        return chapter.order;
      }
      // Check verses in sections and subsections
      if (section.verses.some((verse: Verse) => verse.id === lineId)) {
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

interface AudioData {
  author: string;
  audioUrl: string;
}

const AudioBookRender: React.FC<AudioBookRenderProps> = ({ bookData }) => {
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [sidebarActive, setSidebarActive] = useState(false);
  const [audioData, setAudioData] = useState<AudioData[] | undefined>(
    bookData?.chapters[currentChapterIndex].audios
  );
  const [selectedAudioIndex, setSelectedAudioIndex] = useState("0");

  // console.log(
  //   "audioUrl",
  //   bookData?.chapters[currentChapterIndex].audios[Number(selectedAudioIndex)]
  //     .audioUrl
  // );

  const searchParams = useSearchParams();
  const lineId = searchParams.get("lineId");

  const { script, setScript } = useScriptStore();
  const { selectedTextTime, setSelectedTextTime } = useSelectedTextTimeStore();
  const { isDictionaryActive, setIsDictionaryActive } = useDictionaryStore();

  // console.log(script);
  // console.log("BookData: ", bookData);

  useEffect(() => {
    if (lineId) {
      const chapterOder = findChapterOrderById(bookData!, lineId);
      setCurrentChapterIndex(chapterOder - 1);
      // console.log(chapterOder - 1);
    }
  }, [bookData, lineId]);

  useEffect(() => {
    if (bookData?.chapters.length) {
      const chapter = bookData?.chapters[currentChapterIndex];
      const audioData = chapter?.audios;
      setAudioData(audioData);
    }
  }, [currentChapterIndex, bookData]);

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

      <main className="flex-1 lg:ml-64">
        <div className="flex-1">
          <div className="mb-16">
            <div className="bg-[#edeae1] rounded-md m-2 flex gap-2 items-start justify-between px-4 pb-10 pt-4 shadow-sm">
              {/* <Button
                variant="ghost"
                size="icon"
                className="lg:hidden -ml-2 my-2"
                onClick={() => setSidebarActive(!sidebarActive)}
              >
                <Menu />
              </Button> */}
              <Sheet>
                <SheetTrigger asChild className="lg:hidden">
                  <Button variant="ghost" size="icon" className="lg:hidden">
                    <Menu />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="left"
                  className={`left-2 ${shobhika.className}`}
                >
                  <SheetHeader>
                    <SheetTitle>
                      <SheetClose asChild className="flex justify-center">
                        <h3 className="px-4 text-xl py-4 mt-4">अनुक्रमणिका</h3>
                      </SheetClose>
                    </SheetTitle>
                    <SheetDescription>
                      <span></span>
                    </SheetDescription>
                  </SheetHeader>
                  <ul className="pl-6 pr-4 pt-4 space-y-4">
                    {bookData?.chapters &&
                      bookData?.chapters.map(
                        (chapter: any, chIndex: number) => (
                          <li key={chapter.id}>
                            <SheetClose>
                              <button
                                className={`block text-left text-sm hover:text-red-700 transition-colors
                                  ${
                                    currentChapterIndex === chIndex
                                      ? "text-red-700 font-semibold"
                                      : ""
                                  }`}
                                onClick={() => {
                                  setSelectedTextTime(0);
                                  setCurrentChapterIndex(chIndex);

                                  // setSidebarActive(false);
                                }}
                              >
                                {chapter.title}
                              </button>
                            </SheetClose>
                            {chapter.sections.map(
                              (section: any, index: number) => (
                                <ul
                                  key={section.id}
                                  className="block text-left pt-2 px-3 space-y-3 border-l border-l-gray-200"
                                >
                                  <li key={section.id} className="">
                                    <button
                                      className="text-sm hover:text-red-700 transition-colors"
                                      onClick={() => {
                                        setSelectedTextTime(0);
                                        setCurrentChapterIndex(chIndex);

                                        // setSidebarActive(false);
                                      }}
                                    >
                                      {section.title}
                                    </button>
                                  </li>
                                </ul>
                              )
                            )}
                          </li>
                        )
                      )}
                  </ul>
                </SheetContent>
              </Sheet>
              <span className="hidden lg:block">&nbsp;</span>

              <div className="px-2 flex flex-col justify-center items-center space-y-3 mt-2">
                <h2
                  className={`text-xl lg:text-2xl ${shobhikaBold.className} `}
                >
                  {bookData?.title}{" "}
                </h2>

                {bookData?.author !== "" && (
                  <div className="flex gap-2 items-center">
                    <UserPen size={20} className="text-gray-700" />
                    <p className="text-gray-700 text-lg">{bookData?.author}</p>
                  </div>
                )}
                {/* {bookData?.chapters[currentChapterIndex].audios.length !==
                  0 && (
                  <div className="flex gap-2 items-center">
                    <Music size={15} className="text-gray-600" />
                    <p className="text-sm text-gray-600">
                      {bookData?.chapters[currentChapterIndex].audios.map(
                        (audio) => audio.author
                      )}
                    </p>
                  </div>
                )} */}
                {bookData?.chapters[currentChapterIndex].audios.length !== 0 &&
                bookData?.chapters[currentChapterIndex].audios.length === 1 ? (
                  <div className="flex gap-2 items-center">
                    <Music size={15} className="text-gray-600" />
                    <p className="text-sm text-gray-600">
                      {bookData?.chapters[currentChapterIndex].audios.map(
                        (audio) => audio.author
                      )}
                    </p>
                  </div>
                ) : (
                  <RadioGroup
                    defaultValue={selectedAudioIndex}
                    onValueChange={(value) => setSelectedAudioIndex(value)}
                  >
                    {bookData?.chapters[currentChapterIndex].audios.map(
                      (audio, index) => (
                        <div
                          key={audio.audioUrl}
                          className="flex items-center space-x-2"
                        >
                          <RadioGroupItem
                            value={index.toString()}
                            id={audio.author}
                            checked={selectedAudioIndex === index.toString()}
                          />
                          <Label
                            className="text-sm text-gray-600 flex items-center gap-2"
                            htmlFor={audio.author}
                          >
                            <Music size={15} className="text-gray-600" />
                            <span>{audio.author}</span>
                          </Label>
                        </div>
                      )
                    )}
                  </RadioGroup>
                )}
              </div>
              <div className="flex flex-col gap-2 items-center mt-2">
                <div className="flex gap-2 items-center">
                  <Label htmlFor="dictionary-switch">Dictionary</Label>
                  <Switch
                    id="dictionary-switch"
                    checked={isDictionaryActive}
                    onCheckedChange={setIsDictionaryActive}
                  />
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
            </div>

            <div className="">
              <div className="flex justify-center">
                <Chapter
                  chapter={bookData?.chapters[currentChapterIndex]!}
                  selectedAudioIndex={selectedAudioIndex}
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
            {bookData?.chapters[currentChapterIndex].audios[0]?.audioUrl && (
              <AudioPlayerComp
                src={
                  selectedAudioIndex !== "1"
                    ? bookData.chapters[currentChapterIndex].audios[0]
                        .audioUrl || ""
                    : bookData.chapters[currentChapterIndex].audios[
                        Number(selectedAudioIndex)
                      ].audioUrl ||
                      bookData.chapters[currentChapterIndex].audios[0]
                        .audioUrl ||
                      ""
                }
                chapter={bookData.chapters[currentChapterIndex]}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AudioBookRender;
