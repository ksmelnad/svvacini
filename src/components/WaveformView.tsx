"use client";
import { useEffect, useRef } from "react";
import Peaks, { PeaksInstance, Point } from "peaks.js";
import { Button } from "./ui/button";

interface WaveformViewProps {
  audioUrl: string;
  audioContentType: string;
  audioContext: AudioContext | null;
  audioBuffer: AudioBuffer | null;
  setPoints: (points: Point[]) => void;
}

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

      const blob = new Blob([jsonData], { type: "application/json" });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "points.json");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const onPeaksReady = () => {
    console.log("Peaks.js is ready");
  };

  return (
    <div className="flex flex-col gap-2 py-4">
      <audio ref={audioElementRef} controls src={audioUrl}>
        Your browser does not support the audio element.
      </audio>
      <div
        className="shadow-md mx-auto mb-2 h-24 w-full"
        ref={overviewWaveformRef}
      ></div>
      <div
        className="shadow-md mx-auto mt-6 mb-2 h-60 w-full"
        ref={zoomviewWaveformRef}
      ></div>

      <div className="flex gap-2 mb-4">
        <Button variant="outline" onClick={zoomIn}>
          Zoom In
        </Button>
        <Button variant="outline" onClick={zoomOut}>
          Zoom Out
        </Button>
      </div>
      <div className="flex gap-2">
        <Button onClick={addPoint}>Add Point</Button>
        <Button onClick={logMarkers}>Log Markers</Button>
        <Button onClick={generateJSON}>Generate JSON</Button>
      </div>
    </div>
  );
};

export default WaveformView;
