"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "./ui/button";
import {
  CirclePlay,
  CirclePause,
  Repeat,
  MinusIcon,
  PlusIcon,
} from "lucide-react";
import {
  Book,
  Chapter as ChapterType,
  Paragraph,
  Section,
  Verse,
} from "@prisma/client";
import {
  useCurrentTimeStore,
  useSelectedTextTimeStore,
} from "@/utils/useStore";
import { Input } from "./ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface CustomAudioPlayerProps {
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

const CustomAudioPlayer = ({ src, chapter }: CustomAudioPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isRepeatActive, setIsRepeatActive] = useState(false);
  const [repeatCount, setRepeatCount] = useState(2);
  const [currentRepeat, setCurrentRepeat] = useState(1);
  const [contentIndex, setContentIndex] = useState(0);

  const { selectedTextTime, setSelectedTextTime } = useSelectedTextTimeStore();

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
    const audio = audioRef.current;

    if (!audio) return;
    const updateCurrentTime = () => {
      useCurrentTimeStore.setState({
        currentTime: audio.currentTime,
      });
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
    const audio = audioRef.current;
    if (!audio) return;

    audio.currentTime = 0;

    if (!src) {
      audio.src = "";
      return;
    }

    if (selectedTextTime !== undefined) {
      audio.currentTime = selectedTextTime;
    }

    if (!src && audioRef.current && audioRef.current) {
      audioRef.current.src = "";
    }
  }, [src, selectedTextTime]);

  useEffect(() => {
    const audio = audioRef.current;

    if (audio && isRepeatActive) {
      audio.currentTime = content[contentIndex].begin;
      audio.play();

      const handleTimeUpdate = () => {
        if (audio.currentTime >= content[contentIndex].end) {
          if (currentRepeat < repeatCount) {
            setCurrentRepeat(currentRepeat + 1);
            audio.currentTime = content[contentIndex].begin;
          } else {
            setCurrentRepeat(1);
            if (contentIndex < content.length - 1) {
              setContentIndex(contentIndex + 1);
            } else {
              audio.pause();
            }
          }
        }
      };

      audio.addEventListener("timeupdate", handleTimeUpdate);

      return () => {
        audio.removeEventListener("timeupdate", handleTimeUpdate);
      };
    }
  }, [isRepeatActive, content, repeatCount, currentRepeat, contentIndex]);

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const onLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const onTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const onSeek = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      audioRef.current.currentTime = Number(event.target.value);
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const onVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number(event.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const RepeatControls = () => {
    return (
      <Popover>
        <PopoverTrigger>
          <Repeat
            color="gray"
            size={30}
            className={isRepeatActive ? "bg-gray-200 shadow-sm px-2 py-1" : ""}
          />
        </PopoverTrigger>
        <PopoverContent className="flex flex-col gap-2">
          <div className="flex gap-2 items-center">
            <span>Repeat each</span>
            <Button
              disabled={repeatCount === 2}
              variant="ghost"
              size="icon"
              onClick={() => setRepeatCount(Math.max(repeatCount - 1, 2))}
            >
              {" "}
              <MinusIcon />{" "}
            </Button>
            {repeatCount}
            <Button
              disabled={repeatCount === 5}
              variant="ghost"
              size="icon"
              onClick={() => setRepeatCount(Math.min(repeatCount + 1, 5))}
            >
              {" "}
              <PlusIcon />{" "}
            </Button>
          </div>
          <div>Repeat range start 1 and 5</div>
          <div className="flex justify-between">
            <Button
              variant={"outline"}
              onClick={() => setIsRepeatActive(false)}
            >
              Cancel
            </Button>
            <Button variant="outline" onClick={() => setIsRepeatActive(true)}>
              Apply
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    );
  };

  return (
    <div className="w-full bg-gray-50 mx-auto py-2 px-4 shadow-sm flex flex-col items-center gap-1">
      <audio
        ref={audioRef}
        onLoadedMetadata={onLoadedMetadata}
        onTimeUpdate={onTimeUpdate}
        src={src}
      >
        Your browser does not support the audio element.
      </audio>
      <div className="w-full flex items-center justify-between gap-1">
        <span className="text-red">
          {Math.floor(currentTime / 60)}:
          {Math.floor(currentTime % 60)
            .toString()
            .padStart(2, "0")}
        </span>
        <Input
          type="range"
          value={currentTime}
          max={duration}
          onChange={onSeek}
          className="w-full "
        />
        <span className="">
          {Math.floor(duration / 60)}:
          {Math.floor(duration % 60)
            .toString()
            .padStart(2, "0")}
        </span>
      </div>

      <div className="w-full flex items-center justify-between gap-2">
        <RepeatControls />
        <Button variant="ghost" onClick={togglePlayPause}>
          {isPlaying ? <CirclePause size={30} /> : <CirclePlay size={30} />}
        </Button>
        <input
          type="range"
          value={volume}
          min={0}
          max={1}
          step={0.01}
          onChange={onVolumeChange}
          className=""
        />
      </div>
    </div>
  );
};

export default CustomAudioPlayer;
