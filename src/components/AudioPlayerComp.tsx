"use client";
import React, { useRef, useEffect, useState } from "react";
import H5AudioPlayer, { RHAP_UI } from "react-h5-audio-player";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "./ui/button";
import { Repeat } from "lucide-react";

interface AudioPlayerProps {
  src: string;
  selectedTextTime: number;
  setCurrentTime: React.Dispatch<React.SetStateAction<number>>;
}

const AudioPlayerComp: React.FC<AudioPlayerProps> = ({
  src,
  selectedTextTime,
  setCurrentTime,
}) => {
  const audioRef = useRef<H5AudioPlayer | null>(null);

  useEffect(() => {
    const audio = audioRef.current?.audio.current;

    if (audio) {
      const updateCurrentTime = () => {
        setCurrentTime(audioRef.current?.audio.current?.currentTime!);
      };

      audio.addEventListener("timeupdate", updateCurrentTime);

      return () => {
        audio.removeEventListener("timeupdate", updateCurrentTime);
      };
    }
  }, [setCurrentTime]);

  useEffect(() => {
    if (!src && audioRef.current && audioRef.current.audio.current) {
      audioRef.current?.audio.current?.pause();
    }
  }, [src]);

  useEffect(() => {
    const audio = audioRef.current?.audio.current;
    if (audio) {
      audio.currentTime = selectedTextTime;
    }
  }, [selectedTextTime]);

  // console.log(currentTime);

  // const RepeatControls = () => {
  //   return (
  //     <Popover>
  //       <PopoverTrigger>
  //         <Repeat />
  //       </PopoverTrigger>
  //       <PopoverContent>
  //         <Button>Repeat 1</Button>
  //         <Button>Repeat 2</Button>
  //         <Button>Repeat 3</Button>
  //         <Button>Repeat 4</Button>
  //       </PopoverContent>
  //     </Popover>
  //   );
  // };

  return (
    <H5AudioPlayer
      ref={audioRef}
      autoPlay={false}
      src={src}
      layout="horizontal"
      // customAdditionalControls={[<RepeatControls />]}
    />
  );
};

export default AudioPlayerComp;
