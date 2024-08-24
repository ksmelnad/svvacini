"use client";
import AudioPlayer, { RHAP_UI } from "react-h5-audio-player";

import React, { useRef, useState } from "react";
import { Button } from "./ui/button";
import { CirclePlay, CirclePause, Repeat } from "lucide-react";

const CustomAudioPlayer = ({ src }: { src: string }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);

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
        <input
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
        <Repeat />
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
