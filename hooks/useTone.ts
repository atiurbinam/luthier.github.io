import { useState, useEffect, useRef, useCallback } from 'react';
import * as Tone from 'tone';
import { SequenceStep } from '../types';

interface UseToneProps {
  sequence: SequenceStep[];
  tempo: number;
}

export const useTone = ({ sequence: sequenceSteps, tempo }: UseToneProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState<number | null>(null);

  const synthRef = useRef<Tone.MonoSynth | null>(null);
  const distortionRef = useRef<Tone.Distortion | null>(null);
  const sequenceRef = useRef<Tone.Sequence | null>(null);

  // Effect to set up the audio chain once on mount.
  useEffect(() => {
    // A MonoSynth is perfect for creating thick, Moog-style bass sounds.
    synthRef.current = new Tone.MonoSynth({
      oscillator: {
        type: 'sawtooth' // Rich in harmonics, classic for subtractive synthesis.
      },
      envelope: {
        attack: 0.005, // Fast attack for a punchy start.
        decay: 0.4,
        sustain: 0.1,
        release: 0.6
      },
      filter: {
        Q: 3, // Resonance for a bit of 'squelch'.
        type: 'lowpass',
        rolloff: -24 // 4-pole filter, characteristic of Moog synths.
      },
      filterEnvelope: {
        attack: 0.01,
        decay: 0.3,
        sustain: 0.2,
        release: 1,
        baseFrequency: 250, // The lowest frequency the filter will close to.
        octaves: 3.5 // How many octaves the filter sweeps.
      }
    });
    
    distortionRef.current = new Tone.Distortion(0.4);

    // Chain the synth through distortion to the main output.
    synthRef.current.chain(distortionRef.current, Tone.Destination);

    return () => {
      // Stop transport and dispose of all Tone objects on unmount
      Tone.Transport.stop();
      Tone.Transport.cancel();
      sequenceRef.current?.dispose();
      synthRef.current?.dispose();
      distortionRef.current?.dispose();
    };
  }, []);

  // Effect to re-create the sequence when the notes change.
  useEffect(() => {
    if (sequenceRef.current) {
      sequenceRef.current.dispose();
    }
    
    if (!synthRef.current) return;

    const noteLength = 16; // Hardcoded to 16th notes

    const toneSequence = new Tone.Sequence(
      (time, step) => {
        if (step.active && step.note) {
          // Calculate duration based on gate. Default to 0.8 if gate is missing or 0.
          const gateValue = step.gate > 0 ? step.gate : 0.8;
          const duration = Tone.Transport.toSeconds(`${noteLength}n`) * gateValue;
          synthRef.current?.triggerAttackRelease(step.note, duration, time);
        }
        Tone.Draw.schedule(() => {
          setCurrentStep(sequenceSteps.indexOf(step));
        }, time);
      },
      sequenceSteps,
      `${noteLength}n`
    );

    sequenceRef.current = toneSequence;
    sequenceRef.current.start(0);

    return () => {
        toneSequence.dispose();
    };
  }, [sequenceSteps]);

  // Effect to update tempo
  useEffect(() => {
    Tone.Transport.bpm.value = tempo;
  }, [tempo]);

  const togglePlayback = useCallback(async () => {
    if (Tone.context.state !== 'running') {
      await Tone.start();
    }
    if (isPlaying) {
      Tone.Transport.pause();
      setIsPlaying(false);
    } else {
      Tone.Transport.start();
      setIsPlaying(true);
    }
  }, [isPlaying]);

  const stopPlayback = useCallback(() => {
    Tone.Transport.stop();
    Tone.Transport.position = 0;
    setIsPlaying(false);
    setCurrentStep(null);
  }, []);

  return { isPlaying, currentStep, togglePlayback, stopPlayback };
};
