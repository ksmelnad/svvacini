"use client";
import { useEffect, useRef, useState } from "react";
import Peaks, { PeaksInstance, Point } from "peaks.js";
import { Button } from "./ui/button";
import { ZoomIn, ZoomOut } from "lucide-react";
import { useToast } from "./ui/use-toast";
import axios from "axios";
import useSWR from "swr";
import { Peaks as PeaksPrisma } from "@prisma/client";

import {
  Select,
  SelectGroup,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectLabel,
} from "@/components/ui/select";
import { Input } from "./ui/input";

interface WaveformViewProps {
  audioUrl: string;
  audioContentType: string;
  audioContext: AudioContext | null;
  audioBuffer: AudioBuffer | null;
  setPoints: (points: Point[]) => void;
}

const fetcher = async (url: string) => {
  const response = await axios.get(url);
  return response.data;
};

const WaveformView: React.FC<WaveformViewProps> = ({
  audioUrl,
  audioContentType,
  audioContext,
  audioBuffer,
  setPoints,
}) => {
  const zoomviewWaveformRef = useRef<HTMLDivElement>(null);
  const overviewWaveformRef = useRef<HTMLDivElement>(null);
  const audioElementRef = useRef<HTMLAudioElement>(null);

  const peaksRef = useRef<PeaksInstance | undefined>(undefined);
  const pointNumberRef = useRef<number>(0);
  const [isTitleForm, setIsTitleForm] = useState(false);

  const {
    data: savedPeaksData = [] as PeaksPrisma[],
    error,
    isLoading,
    mutate,
  } = useSWR<PeaksPrisma[]>("/api/peaks", fetcher);

  const [selectedTitle, setSelectedTitle] = useState<string>("");
  const [newTitle, setNewTitle] = useState<string>("");

  const { toast } = useToast();

  useEffect(() => {
    const initPeaks = () => {
      let options = {
        overview: {
          container: overviewWaveformRef.current!,
        },
        zoomview: {
          container: zoomviewWaveformRef.current!,
        },
        mediaElement: audioElementRef.current!,
        keyboard: true,
        logger: console.error.bind(console),
        webAudio: { audioContext: audioContext!, audioBuffer: audioBuffer! },
      };

      Peaks.init(options, (err, peaks) => {
        if (err) {
          console.error(err);
          return;
        }

        peaksRef.current = peaks;

        onPeaksReady();

        return () => {
          if (peaks) peaks.destroy();
        };
      });
    };

    initPeaks();
  }, [audioUrl, audioContentType, audioContext, audioBuffer]);

  useEffect(() => {
    if (peaksRef.current) {
      const itemData: PeaksPrisma = savedPeaksData.find(
        (item: PeaksPrisma) => item.title === selectedTitle
      )!;

      if (itemData) {
        itemData.points.map((item) =>
          peaksRef.current?.points.add({
            time: Number(item.time),
            labelText: item.labelText,
            editable: true,
          })
        );
        pointNumberRef.current = itemData.points.length;
      }
    }
  }, [selectedTitle, savedPeaksData]);

  const zoomIn = () => {
    if (peaksRef.current) {
      peaksRef.current.zoom.zoomIn();
    }
  };

  const zoomOut = () => {
    if (peaksRef.current) {
      peaksRef.current.zoom.zoomOut();
    }
  };

  const addPoint = () => {
    if (peaksRef.current) {
      const time = peaksRef.current.player.getCurrentTime();
      peaksRef.current.points.add({
        time: time,
        labelText: pointNumberRef.current.toString(),
        editable: true,
      });
      pointNumberRef.current++;
    }
  };

  const logMarkers = () => {
    if (peaksRef.current) {
      setPoints(peaksRef.current.points.getPoints());
    }
  };

  const generateJSON = () => {
    if (peaksRef.current) {
      const points = peaksRef.current.points.getPoints();
      if (points.length === 0) {
        return;
      }

      const pointsData = points.map((point) => ({
        labelText: point.labelText,
        time: point.time.toFixed(3),
      }));

      const jsonData = JSON.stringify(pointsData, null, 2);

      // if (typeof navigator !== 'undefined' && navigator.) {
      const blob = new Blob([jsonData], { type: "application/json" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "data.json";
      link.click();
      URL.revokeObjectURL(url);
      // link.setAttribute("download", "points.json");
      // document.body.appendChild(link);
      // link.click();
      // document.body.removeChild(link);
    }
  };

  const saveData = async () => {
    if (peaksRef.current) {
      if (newTitle.trim() === "") {
        toast({
          variant: "destructive",
          description: "Title cannot be empty!",
        });
        return;
      }

      const points = peaksRef.current.points.getPoints();
      if (points.length === 0) {
        toast({
          variant: "destructive",
          description: "No points found!",
        });
        return;
      }

      const pointsData = points.map((point) => ({
        labelText: point.labelText,
        time: point.time.toFixed(3),
      }));
      try {
        const response = await axios.post("/api/peaks", {
          title: newTitle,
          points: pointsData,
        });
        if (response.status === 201) {
          toast({
            description: "Successfully Saved!",
          });
          // mutate({ ...savedPeaksData, title: newTitle, points: pointsData });
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error(
            "Error: ",
            error.response?.data.message || "Unexpected Error"
          );
          toast({
            variant: "destructive",
            description: error.response?.data.message,
          });
        } else {
          console.log("Unexpected Error", error);
          toast({
            variant: "destructive",
            description: "Unexpected Error",
          });
        }
      }
    }
    setIsTitleForm(false);
  };

  const updateData = async () => {
    if (peaksRef.current) {
      if (selectedTitle.trim() === "") {
        toast({
          variant: "destructive",
          description: "No title selected to update",
        });
        return;
      }

      const points = peaksRef.current.points.getPoints();
      if (points.length === 0) {
        toast({
          variant: "destructive",
          description: "No points found!",
        });
        return;
      }

      const pointsData = points.map((point) => ({
        labelText: point.labelText,
        time: point.time.toFixed(3),
      }));

      const selectedTitleId = savedPeaksData.find(
        (item: PeaksPrisma) => item.title === selectedTitle
      )?.id;

      try {
        const response = await axios.put(`/api/peaks/${selectedTitleId}`, {
          points: pointsData,
        });
        if (response.status === 200) {
          toast({
            description: "Successfully Updated!",
          });
          // mutate({ ...savedPeaksData, title: newTitle, points: pointsData });
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error(
            "Error: ",
            error.response?.data.message || "Unexpected Error"
          );
          toast({
            variant: "destructive",
            description: error.response?.data.message,
          });
        } else {
          console.log("Unexpected Error", error);
          toast({
            variant: "destructive",
            description: "Unexpected Error",
          });
        }
      }
    }
  };

  const onPeaksReady = () => {
    console.log("Peaks.js is ready");
  };

  return (
    <div className="bg-[#f0eee2]/50 flex flex-col gap-2 p-4">
      {isLoading ? (
        <p className="animate-pulse text-gray-500">Loading...</p>
      ) : (
        savedPeaksData.length > 0 && (
          <Select
            onValueChange={(e) => setSelectedTitle(e)}
            value={selectedTitle}
            defaultValue=""
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Load" />
            </SelectTrigger>
            <SelectContent id="load-saved-data">
              <SelectGroup>
                <SelectLabel>Peaks</SelectLabel>
                {savedPeaksData.map((item: PeaksPrisma) => (
                  <SelectItem key={item.id} value={item.title}>
                    {item.title}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        )
      )}
      <audio ref={audioElementRef} controls src={audioUrl}>
        Your browser does not support the audio element.
      </audio>
      <div
        className="bg-white border-t border-b border-gray-500  mx-auto mb-2 h-24 w-full"
        ref={overviewWaveformRef}
      ></div>
      <div
        className="bg-white border-t border-b border-gray-500 mx-auto mt-6 mb-2 h-60 w-full"
        ref={zoomviewWaveformRef}
      ></div>

      <div className="flex gap-2 mb-4">
        <Button variant="outline" size="icon" onClick={zoomIn}>
          <ZoomIn />
        </Button>
        <Button variant="outline" size="icon" onClick={zoomOut}>
          <ZoomOut />
        </Button>
      </div>
      <div className="flex gap-2">
        <Button size="sm" onClick={addPoint}>
          Point +
        </Button>
        <Button variant="outline" size="sm" onClick={logMarkers}>
          Log
        </Button>
        <Button variant="outline" size="sm" onClick={generateJSON}>
          Json
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsTitleForm(true)}
        >
          Save
        </Button>
        <Button
          disabled={!selectedTitle}
          variant="outline"
          size="sm"
          onClick={updateData}
        >
          Update
        </Button>
      </div>
      {isTitleForm && (
        <div className="p-4 border rounded-sm  flex gap-2">
          <Input
            type="text"
            placeholder="Title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <Button onClick={saveData}>Submit</Button>
          <Button variant="outline" onClick={() => setIsTitleForm(false)}>
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
};

export default WaveformView;
