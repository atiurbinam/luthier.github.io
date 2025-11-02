import React from 'react';
import { PlayIcon, PauseIcon, CameraIcon } from '../icons';

interface GlobalTransportProps {
  isPlaying: boolean;
  togglePlayback: () => void;
  tempo: number;
  onTempoChange: (tempo: number) => void;
  onScreenshot: () => void;
}

const GlobalTransport: React.FC<GlobalTransportProps> = ({
  isPlaying,
  togglePlayback,
  tempo,
  onTempoChange,
  onScreenshot,
}) => {
  const playPauseClasses = `btn-play-postpunk ${isPlaying ? 'active' : ''}`;
  
  return (
    <div className="global-transport-bar">
      <button
        onClick={onScreenshot}
        className="btn-play-postpunk"
        aria-label="Capturar Pantalla"
      >
        <CameraIcon className="w-9 h-9" />
      </button>

      <div className="flex items-baseline gap-2">
        <input
            type="number"
            id="tempo"
            aria-label="Tempo (BPM)"
            min="40"
            max="240"
            value={tempo}
            onChange={(e) => onTempoChange(Number(e.target.value))}
            className="input-minimal"
        />
        <span className="text-muted-color uppercase text-sm font-display">BPM</span>
      </div>
      
      <button onClick={togglePlayback} className={playPauseClasses} aria-label={isPlaying ? 'Pause' : 'Play'}>
        {isPlaying ? (
          <PauseIcon className="w-9 h-9" />
        ) : (
          <PlayIcon className="w-9 h-9" />
        )}
      </button>
    </div>
  );
};

export default GlobalTransport;