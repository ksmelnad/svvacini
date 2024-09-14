"use client";
import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import AudioPlayer, { RHAP_UI } from "react-h5-audio-player";
import {
  Book,
  Chapter as ChapterType,
  Paragraph,
  Section,
  Verse,
} from "@prisma/client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "./ui/button";
import {
  CircleMinus,
  CirclePlus,
  MinusIcon,
  Plus,
  PlusIcon,
  Repeat,
  Repeat1,
} from "lucide-react";
import {
  useCurrentTimeStore,
  useSelectedTextTimeStore,
} from "@/utils/useStore";
import CustomAudioPlayer from "./CustomAudioPlayer";
import { Input } from "./ui/input";

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

interface AudioPlayerProps {
  src: string;
  chapter: ChapterType & {
    paragraphs: Paragraph[];
    verses: Verse[];
    sections: (Section & {
      paragraphs: Paragraph[];
      verses: Verse[];
    })[];
  };
}

const AudioPlayerComp: React.FC<AudioPlayerProps> = ({ src, chapter }) => {
  const audioRef = useRef<AudioPlayer | null>(null);
  const [repeatCount, setRepeatCount] = useState(2);
  const [currentRepeat, setCurrentRepeat] = useState(1);
  const [contentIndex, setContentIndex] = useState(0);
  const [isRepeatActive, setIsRepeatActive] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [repeatMode, setRepeatMode] = useState<
    "verse" | "paragraph" | "range" | "chapter"
  >("verse");
  const [selectedRange, setSelectedRange] = useState<{
    start: number;
    end: number;
  }>({ start: 0, end: 0 });
  // const audioRef = useRef<HTMLAudioElement>(null);
  const { currentTime, setCurrentTime } = useCurrentTimeStore();
  const { selectedTextTime, setSelectedTextTime } = useSelectedTextTimeStore();

  // Store content in an array
  const content: { id: number; begin: number; end: number }[] = useMemo(() => {
    return [
      ...chapter.paragraphs.map((para, index) => ({
        id: index,
        begin: parseFloat(para.line.begin),
        end: parseFloat(para.line.end),
      })),
      ...chapter.verses?.map((verse, index) => ({
        id: chapter.paragraphs.length + index,
        begin: parseFloat(verse.lines[0].begin),
        end: parseFloat(verse.lines[verse.lines.length - 1].end),
      })),
      ...chapter.sections?.flatMap((section, index) => {
        return [
          ...section.paragraphs.map((para, index) => ({
            id: chapter.paragraphs.length + chapter.verses?.length! + index,
            begin: parseFloat(para.line.begin),
            end: parseFloat(para.line.end),
          })),
          ...section.verses?.map((verse, index) => ({
            id:
              chapter.paragraphs.length +
              chapter.verses?.length! +
              section.paragraphs.length +
              index,
            begin: parseFloat(verse.lines[0].begin),
            end: parseFloat(verse.lines[verse.lines.length - 1].end),
          })),
        ];
      }),
    ];
  }, [chapter]);

  useEffect(() => {
    const audio = audioRef.current?.audio.current;

    if (!audio) return;
    const updateCurrentTime = () => {
      useCurrentTimeStore.setState({
        currentTime: audio.currentTime,
      });
      // setCurrentTime(audio.currentTime);
    };

    audio.addEventListener("timeupdate", updateCurrentTime);

    return () => {
      audio.removeEventListener("timeupdate", updateCurrentTime);
    };
  }, []);

  useEffect(() => {
    setSelectedTextTime(0);
  }, [setSelectedTextTime]);

  useEffect(() => {
    // console.log("Rendered");
    const audio = audioRef.current?.audio.current;
    if (!audio) return;

    audio.currentTime = 0;
    // setCurrentTime(0);

    if (!src) {
      audio.src = "";
      // setCurrentTime(0);
      return;
    }

    if (selectedTextTime !== undefined) {
      audio.currentTime = selectedTextTime;
    }

    if (!src && audioRef.current && audioRef.current.audio.current) {
      audioRef.current.audio.current.src = "";
    }
  }, [src, selectedTextTime]);

  useEffect(() => {
    const audio = audioRef.current?.audio.current;

    if (audio && isRepeatActive) {
      audio.currentTime = content[contentIndex].begin;
      audio.loop = true;
      audio.play();

      const handleTimeUpdate = () => {
        const buffer = 0.1;
        if (audio.currentTime >= content[contentIndex].end - buffer) {
          if (currentRepeat < repeatCount) {
            setCurrentRepeat(currentRepeat + 1);
            audio.currentTime = content[contentIndex].begin;
          } else {
            setCurrentRepeat(1);
            audio.loop = false;
            if (contentIndex < content.length - 1) {
              setContentIndex(contentIndex + 1);
            } else {
              audio.pause();
            }
          }

          // let newContentIndex = contentIndex + 1;

          // // Handle range mode
          // if (repeatMode === "range") {
          //   newContentIndex = Math.min(contentIndex + 1, selectedRange.end);
          // }

          // // Handle end of content
          // if (newContentIndex >= content.length) {
          //   // Stop repeating, you can reset or handle as needed
          //   setIsRepeatActive(false);
          // } else {
          //   setContentIndex(newContentIndex);
          // }
        }
      };

      audio.addEventListener("timeupdate", handleTimeUpdate);

      return () => {
        audio.removeEventListener("timeupdate", handleTimeUpdate);
      };
    }
  }, [
    isRepeatActive,
    content,
    repeatCount,
    // repeatMode,
    currentRepeat,
    contentIndex,
    // selectedRange,
  ]);

  // const getContentForCurrentTime = (time: number) => {
  //   return content.find((item) => time >= item.begin && time < item.end);
  // };

  const setRepeatModeHandler = (
    mode: "verse" | "paragraph" | "range" | "chapter"
  ) => {
    setRepeatMode(mode);
    if (mode === "range") {
      // Define your logic for selecting range
      setSelectedRange({ start: 0, end: 5 }); // Example range
    }
  };

  // console.log("Selected Text Time in AudioPlayerComp: ", selectedTextTime);

  // console.log(currentTime);

  // const RepeatControls = () => {
  //   return (

  //   );
  // };

  return (
    <div className="">
      <AudioPlayer
        ref={audioRef}
        autoPlay={false}
        progressUpdateInterval={50}
        // defaultDuration={<RHAP_UI.DURATION />}
        preload="none"
        src={src}
        // layout="horizontal"
        className=""
        customAdditionalControls={[
          <PopoverComp
            isPopoverOpen={isPopoverOpen}
            setIsPopoverOpen={setIsPopoverOpen}
            isRepeatActive={isRepeatActive}
            setIsRepeatActive={setIsRepeatActive}
            repeatCount={repeatCount}
            setRepeatCount={setRepeatCount}
            setRepeatModeHandler={setRepeatModeHandler}
          />,
        ]}
      />
      {/* <audio
        className="sticky bottom-0 z-20"
        ref={audioRef}
        src={src}
        controls
      ></audio> */}
      {/* <CustomAudioPlayer ref={audioRef} src={src} /> */}
    </div>
  );
};

const PopoverComp = ({
  isPopoverOpen,
  setIsPopoverOpen,
  isRepeatActive,
  repeatCount,
  setRepeatCount,
  setRepeatModeHandler,
  setIsRepeatActive,
}: {
  isPopoverOpen: boolean;
  setIsPopoverOpen: (value: boolean) => void;
  isRepeatActive: boolean;
  repeatCount: number;
  setRepeatCount: (count: number) => void;
  setRepeatModeHandler: (
    mode: "verse" | "paragraph" | "range" | "chapter"
  ) => void;
  setIsRepeatActive: (value: boolean) => void;
}) => {
  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <PopoverTrigger className="relative">
        <Repeat color={isRepeatActive ? "black" : "gray"} size={25} />
        {isRepeatActive && (
          <span className="absolute bottom-0 -right-2 bg-[#f0eee2] p-2 rounded-full w-4 h-4 flex items-center justify-center">
            {repeatCount}
          </span>
        )}
      </PopoverTrigger>
      <PopoverContent className="flex flex-col gap-2">
        <div className="flex gap-2 items-center justify-between">
          <p>Repeat each</p>
          <div className="flex gap-2 items-center">
            <Button
              disabled={repeatCount <= 2}
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.preventDefault();
                setRepeatCount(Math.max(repeatCount - 1, 2));
              }}
            >
              {" "}
              <MinusIcon />{" "}
            </Button>
            <Input
              id="width"
              type="number"
              min={2}
              value={repeatCount.toString()}
              className="max-w-fit"
              onChange={(e) => setRepeatCount(parseInt(e.target.value, 10))}
            />

            <Button
              // disabled={repeatCount === 5}
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.preventDefault();
                setRepeatCount(repeatCount + 1);
              }}
            >
              {" "}
              <PlusIcon />{" "}
            </Button>
          </div>
        </div>

        <div className="mt-6 flex justify-between">
          <Button
            variant={"outline"}
            onClick={() => {
              setIsRepeatActive(!isRepeatActive);
              setIsPopoverOpen(false);
            }}
          >
            {isRepeatActive ? "Disable" : "Enable"}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default AudioPlayerComp;
