"use client"
import { useState } from 'react';
import WaveformView from '@/components//WaveformView';
import PointTable from '@/components//PointTable';
import { Point } from 'peaks.js';
import { Input } from '@/components/ui/input';

const PeaksComp: React.FC = () => {
  const [audioData, setAudioData] = useState({
    audioUrl: '',
    audioContentType: '',
    audioBuffer: null as AudioBuffer | null,
    audioContext: null as AudioContext | null,
    points: [] as Point[]
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const audioContext = new AudioContext();
    const audioBuffer = await audioContext.decodeAudioData(
      await fetch(URL.createObjectURL(file)).then(res => res.arrayBuffer())
    );

    setAudioData({
      audioUrl: URL.createObjectURL(file),
      audioContentType: file.type,
      audioContext: audioContext,
      audioBuffer: audioBuffer,
      points: []
    });
  };

  return (
    <div className="container mx-auto py-5">
      <h1 className="text-2xl font-semibold text-center">Peaks.js App</h1>

      <Input
        type="file"
        accept='audio/*'
        className="my-4 max-w-fit"
        onChange={handleFileChange}
      />

      <WaveformView
        audioUrl={audioData.audioUrl}
        audioContentType={audioData.audioContentType}
        // waveformDataUrl={audioData.waveformDataUrl}
        audioContext={audioData.audioContext}
        audioBuffer={audioData.audioBuffer}
        // setSegments={(segments) => setAudioData({ ...audioData, segments })}
        setPoints={(points) => setAudioData({ ...audioData, points })}
      />
      <PointTable points={audioData.points} />
    </div>
  );
};

export default PeaksComp;
