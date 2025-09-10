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
  useRepeatStore,
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
  const { currentTime, setCurrentTime } = useCurrentTimeStore();
  const { selectedTextTime, setSelectedTextTime } = useSelectedTextTimeStore();
  const { repeatItems, setRepeatCount } = useRepeatStore();
  const [currentRepeatItem, setCurrentRepeatItem] = useState<{
    id: string;
    remaining: number;
  } | null>(null);
  const [globalRepeatCount, setGlobalRepeatCount] = useState(2);
  const [isGlobalRepeatEnabled, setIsGlobalRepeatEnabled] = useState(false);

  // Store content in an array
  const content: { id: string; begin: number; end: number }[] = useMemo(() => {
    return [
      ...chapter.paragraphs.map((para) => ({
        id: para.id,
        begin: parseFloat(para.line.begin),
        end: parseFloat(para.line.end),
      })),
      ...chapter.verses?.map((verse) => ({
        id: verse.id,
        begin: parseFloat(verse.lines[0].begin),
        end: parseFloat(verse.lines[verse.lines.length - 1].end),
      })),
      ...chapter.sections?.flatMap((section) => {
        return [
          ...section.paragraphs.map((para) => ({
            id: para.id,
            begin: parseFloat(para.line.begin),
            end: parseFloat(para.line.end),
          })),
          ...section.verses?.map((verse) => ({
            id: verse.id,
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
    setCurrentRepeatItem(null);
  }, [setSelectedTextTime]);

  useEffect(() => {
    if (selectedTextTime !== undefined && isGlobalRepeatEnabled) {
      const currentItem = content.find(
        (item) => selectedTextTime >= item.begin && selectedTextTime < item.end
      );
      if (currentItem) {
        setCurrentRepeatItem({
          id: currentItem.id,
          remaining: globalRepeatCount,
        });
      }
    }
  }, [selectedTextTime, isGlobalRepeatEnabled, globalRepeatCount, content]);

  useEffect(() => {
    // console.log("Rendered");
    const audio = audioRef.current?.audio.current;
    if (!audio) return;

    // Pause audio when src changes to prevent auto-play
    // audio.pause();
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
    if (!audio) return;

    const handleTimeUpdate = () => {
      const currentItem = content.find(
        (item) =>
          audio.currentTime >= item.begin && audio.currentTime < item.end
      );
      if (currentItem && repeatItems[currentItem.id] && !currentRepeatItem) {
        // Start repeating this item
        setCurrentRepeatItem({
          id: currentItem.id,
          remaining: repeatItems[currentItem.id],
        });
        audio.currentTime = currentItem.begin;
      } else if (
        currentRepeatItem &&
        audio.currentTime >=
          content.find((item) => item.id === currentRepeatItem.id)!.end
      ) {
        if (currentRepeatItem.remaining > 1) {
          audio.currentTime = content.find(
            (item) => item.id === currentRepeatItem.id
          )!.begin;
          setCurrentRepeatItem({
            ...currentRepeatItem,
            remaining: currentRepeatItem.remaining - 1,
          });
        } else {
          // Repeat finished, go to next item
          const currentIndex = content.findIndex(
            (item) => item.id === currentRepeatItem.id
          );
          const nextIndex = currentIndex + 1;
          if (nextIndex < content.length) {
            audio.currentTime = content[nextIndex].begin;
          }
          setCurrentRepeatItem(null);
        }
      }
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);

    return () => audio.removeEventListener("timeupdate", handleTimeUpdate);
  }, [content, repeatItems, currentRepeatItem]);

  // const getContentForCurrentTime = (time: number) => {
  //   return content.find((item) => time >= item.begin && time < item.end);
  // };

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
          <GlobalRepeatComp
            isGlobalRepeatEnabled={isGlobalRepeatEnabled}
            setIsGlobalRepeatEnabled={setIsGlobalRepeatEnabled}
            globalRepeatCount={globalRepeatCount}
            setGlobalRepeatCount={setGlobalRepeatCount}
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

const GlobalRepeatComp = ({
  isGlobalRepeatEnabled,
  setIsGlobalRepeatEnabled,
  globalRepeatCount,
  setGlobalRepeatCount,
}: {
  isGlobalRepeatEnabled: boolean;
  setIsGlobalRepeatEnabled: (value: boolean) => void;
  globalRepeatCount: number;
  setGlobalRepeatCount: (count: number) => void;
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon">
          <Repeat color={isGlobalRepeatEnabled ? "red" : "gray"} size={25} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="flex flex-col gap-2">
          <p>Global Repeat: {isGlobalRepeatEnabled ? "Enabled" : "Disabled"}</p>
          <div className="flex gap-2 items-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setGlobalRepeatCount(Math.max(globalRepeatCount - 1, 1))
              }
            >
              -
            </Button>
            <Input
              type="number"
              value={globalRepeatCount}
              onChange={(e) =>
                setGlobalRepeatCount(parseInt(e.target.value) || 1)
              }
              className="w-20"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => setGlobalRepeatCount(globalRepeatCount + 1)}
            >
              +
            </Button>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setIsGlobalRepeatEnabled(!isGlobalRepeatEnabled)}
            >
              {isGlobalRepeatEnabled ? "Disable" : "Enable"}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default AudioPlayerComp;
