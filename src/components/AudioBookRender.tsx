"use client";
import React, { useState } from "react";
import { shobhika, shobhikaBold } from "@/utils/shobhika";
import AudioPlayerComp from "@/components/AudioPlayerComp";
import "react-h5-audio-player/lib/styles.css";
import { Button } from "./ui/button";
import Chapter from "./Chapter";
import { Menu } from "lucide-react";
import Sidebar from "./Sidebar";

interface AudioBookRenderProps {
  bookData: any;
}

const AudioBookRender: React.FC<AudioBookRenderProps> = ({ bookData }) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [selectedTextTime, setSelectedTextTime] = useState(0);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [sidebarActive, setSidebarActive] = useState(false);
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
    setCurrentChapterIndex((prev) => prev + 1);
  };

  const handlePreviousButton = () => {
    setCurrentChapterIndex((prev) => prev - 1);
  };

  if (bookData.chapters.length === 0) {
    return <div>No data</div>;
  }

  return (
    <div className="">
      <div>
        <Sidebar
          bookData={bookData}
          currentChapterIndex={currentChapterIndex}
          setCurrentChapterIndex={setCurrentChapterIndex}
          sidebarActive={sidebarActive}
          setSidebarActive={setSidebarActive}
        />
      </div>
      <div className="">
        <div className="max-w-3xl mx-auto md:ml-64 md:mr-auto min-h-screen">
          <div className="flex gap-4 mb-6 px-4">
            <Button
              variant="ghost"
              size="icon"
              className="-ml-2 my-2"
              onClick={() => setSidebarActive(!sidebarActive)}
            >
              <Menu />
            </Button>

            <div className="w-full  p-4 flex justify-center gap-4 ">
              <p className={`text-2xl ${shobhikaBold.className} `}>
                {bookData?.title}{" "}
              </p>

              <p className="">({bookData.author})</p>
            </div>
          </div>

          <Chapter
            chapter={bookData.chapters[currentChapterIndex]}
            currentTime={currentTime}
            setSelectedTextTime={setSelectedTextTime}
          />
          <div className="py-2 md:py-3 flex justify-center items-center gap-4">
            <Button
              variant="outline"
              onClick={handlePreviousButton}
              disabled={currentChapterIndex === 0}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              onClick={handleNextButton}
              disabled={currentChapterIndex === bookData.chapters.length - 1}
            >
              Next
            </Button>
          </div>
        </div>

        <div className="sticky bottom-0">
          {bookData.chapters[currentChapterIndex].audio && (
            <AudioPlayerComp
              src={bookData.chapters[currentChapterIndex].audio || ""}
              selectedTextTime={selectedTextTime}
              setCurrentTime={setCurrentTime}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AudioBookRender;
