
import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import * as Tone from 'tone';
import html2canvas from 'html2canvas';
import Header from './components/layout/Header';
import Sequencer from './components/Sequencer';
import MainControls from './components/controls/MainControls';
import { generateBassProgression } from './services/geminiService';
import { useTone } from './hooks/useTone';
import { ChordProgressionResponse } from './types';
import { generatePlayableNotes, applyNegativeHarmonyToSequence, applyNegativeHarmonyToChords, getNotesFromChord } from './utils/musicTheory';
import GlobalTransport from './components/controls/GlobalTransport';
import { CameraIcon } from './components/icons';
import { generateEuclideanPattern } from './utils/rhythm';


const defaultSequence: ChordProgressionResponse = {
    chords: ['', '', '', ''],
    sequence: Array.from({ length: 16 }, (_, i) => ({
      step: i + 1,
      note: null,
      active: false,
      gate: 0,
    })),
};

const generatePunkManifestoName = (): string => {
  const adjectives = [
    'Rebelde', 'Anarquista', 'Radical', 'Liberado', 'Desafiante', 
    'Subversivo', 'Insurgente', 'Apasionado', 'SinCensura'
  ];
  const nouns = [
    'Beso', 'Disturbio', 'Corazon', 'Ritmo', 'Verdad', 
    'Himno', 'Amor', 'Igualdad', 'Libertad', 'Revolucion'
  ];

  const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
  const randomNumber = Math.floor(Math.random() * 1000) + 1;

  return `${randomAdjective}-${randomNoun}-${randomNumber}`;
};

function App() {
  const [sourceProgression, setSourceProgression] = useState<ChordProgressionResponse>(defaultSequence);
  const [displayProgression, setDisplayProgression] = useState<ChordProgressionResponse>(defaultSequence);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Generation Parameters
  const [rootNote, setRootNote] = useState('C');
  const [octave, setOctave] = useState(2);
  const [scaleType, setScaleType] = useState<'minor' | 'major'>('minor');
  const [style, setStyle] = useState('industrial techno');
  const [pulses, setPulses] = useState(8);
  const [useNegativeHarmony, setUseNegativeHarmony] = useState(false);
  const [famousSong, setFamousSong] = useState('');
  
  // Playback Parameters
  const [tempo, setTempo] = useState(120);
  
  const sequencerRef = useRef<HTMLDivElement>(null);

  const { isPlaying, currentStep, togglePlayback, stopPlayback } = useTone({
    sequence: displayProgression?.sequence || [],
    tempo,
  });

  const isProgressionEmpty = useMemo(() => sourceProgression.chords.every(c => c === ''), [sourceProgression]);

  useEffect(() => {
    if (useNegativeHarmony) {
      const negativeSequence = applyNegativeHarmonyToSequence(sourceProgression.sequence, rootNote);
      const negativeChords = applyNegativeHarmonyToChords(sourceProgression.chords, rootNote);
      setDisplayProgression({
        chords: negativeChords,
        sequence: negativeSequence
      });
    } else {
      setDisplayProgression(sourceProgression);
    }
  }, [sourceProgression, useNegativeHarmony, rootNote]);
  
  const playableNotes = useMemo(() => {
    return generatePlayableNotes(rootNote, [0, 1, 2, 3, 4]);
  }, [rootNote]);

  const handleGenerate = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    if (Tone.context.state !== 'running') {
        await Tone.start();
    }
    stopPlayback();
    try {
      const result = await generateBassProgression(rootNote, useNegativeHarmony, octave, scaleType, style, pulses, famousSong);
      setSourceProgression(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [rootNote, useNegativeHarmony, octave, scaleType, style, pulses, stopPlayback, famousSong]);

  const handlePulsesChange = useCallback((newPulses: number) => {
    setPulses(newPulses);

    // Do not modify the default/empty state
    if (sourceProgression.chords.every(c => c === '')) {
        return;
    }

    const pattern = generateEuclideanPattern(16, newPulses);

    setSourceProgression(prev => {
        if (!prev || prev.chords.every(c => c === '')) return prev;

        const newSequence = prev.sequence.map((step, index) => {
            const isActive = pattern[index];
            const newStep = { ...step };

            if (isActive) {
                newStep.active = true;
                // If step was inactive, give it a new note based on the "melodic inverse proportionality" rule.
                if (!step.active) {
                    newStep.gate = 0.8; // Set default gate
                    const notesInCurrentOctave = playableNotes.filter(n => n.endsWith(String(octave)));
                    
                    if (notesInCurrentOctave.length > 0) {
                        // Probability of choosing the root note is proportional to the number of pulses.
                        // Higher pulses -> more rhythmic, less melodic -> higher chance of root note.
                        const probabilityOfRootNote = newPulses / 16;
                        
                        if (Math.random() < probabilityOfRootNote) {
                            newStep.note = `${rootNote}${octave}`;
                        } else {
                            // Pick a random note from the scale in the current octave.
                            const randomNote = notesInCurrentOctave[Math.floor(Math.random() * notesInCurrentOctave.length)];
                            newStep.note = randomNote;
                        }
                    } else {
                        // Fallback if no playable notes are available for the octave.
                        newStep.note = `${rootNote}${octave}`;
                    }
                }
            } else {
                newStep.active = false;
                newStep.note = null;
                newStep.gate = 0;
            }
            return newStep;
        });
        return { ...prev, sequence: newSequence };
    });
  }, [sourceProgression, rootNote, octave, playableNotes]);

  const handleRandomizeSequence = useCallback(() => {
    if (isProgressionEmpty || displayProgression.chords.every(c => c === '')) {
      console.warn("Cannot randomize sequence without a chord progression. Please generate one first.");
      return;
    }

    // 1. Generate a new rhythm
    const randomPulses = Math.floor(Math.random() * 9) + 5; // Generate between 5 and 13 pulses
    const rhythmPattern = generateEuclideanPattern(16, randomPulses);

    // 2. Generate new notes based on the existing chords
    const newSequence = rhythmPattern.map((isActive, i) => {
      if (isActive) {
        // Determine which chord corresponds to the current step (4 steps per chord)
        const chordIndex = Math.floor(i / 4);
        const currentChord = displayProgression.chords[chordIndex];

        if (currentChord) {
          // Get the notes (triad) of the current chord
          const chordNotes = getNotesFromChord(currentChord, rootNote);
          
          if (chordNotes.length > 0) {
            // Pick a random note from the chord triad
            const randomNoteBase = chordNotes[Math.floor(Math.random() * chordNotes.length)];
            const note = `${randomNoteBase}${octave}`;
            const gate = 0.6 + Math.random() * 0.4; // Random gate between 0.6 and 1.0
            return { step: i + 1, note, active: true, gate };
          }
        }
      }
      // Return an inactive step if not active or if chord/note generation fails
      return { step: i + 1, note: null, active: false, gate: 0 };
    });

    setSourceProgression(prev => ({
      chords: prev?.chords || defaultSequence.chords,
      sequence: newSequence,
    }));
  }, [isProgressionEmpty, displayProgression.chords, rootNote, octave]);

  const handleStepClick = useCallback((stepIndex: number) => {
    setSourceProgression(prev => {
      if (!prev) return prev;
      const newSequence = [...prev.sequence];
      const step = { ...newSequence[stepIndex] };

      if (step.active) {
        step.active = false;
        step.note = null;
        step.gate = 0;
      } else {
        step.active = true;
        step.note = `${rootNote}${octave}`;
        step.gate = 0.8;
      }
      
      newSequence[stepIndex] = step;
      return { ...prev, sequence: newSequence };
    });
  }, [rootNote, octave]);

  const handleNoteChange = useCallback((stepIndex: number, newNote: string | null) => {
    setSourceProgression(prev => {
        if (!prev) return prev;
        const newSequence = [...prev.sequence];
        const step = { ...newSequence[stepIndex] };

        if (newNote === null) {
            step.active = false;
            step.note = null;
            step.gate = 0;
        } else {
            step.active = true;
            step.note = newNote;
            if (step.gate === 0) {
              step.gate = 0.8;
            }
        }
        
        newSequence[stepIndex] = step;
        return { ...prev, sequence: newSequence };
    });
  }, []);

  const handleGateChange = useCallback((stepIndex: number, newGate: number) => {
    setSourceProgression(prev => {
        if (!prev) return prev;
        const newSequence = [...prev.sequence];
        const step = { ...newSequence[stepIndex] };
        step.gate = newGate;
        newSequence[stepIndex] = step;
        return { ...prev, sequence: newSequence };
    });
  }, []);

  const handleScreenshot = useCallback(() => {
    if (!sequencerRef.current) return;
    
    html2canvas(sequencerRef.current, {
      backgroundColor: '#0d0d0d',
      useCORS: true,
    }).then((canvas) => {
      const link = document.createElement('a');
      const fileName = generatePunkManifestoName();
      link.download = `${fileName}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    });
  }, []);

  // Keyboard shortcut for play/pause
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignore if the user is focused on an input or select element
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLSelectElement
      ) {
        return;
      }

      if (event.code === 'Space') {
        event.preventDefault();
        togglePlayback();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [togglePlayback]);

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <Header />
      <main className="app-grid">
        <aside className="flex flex-col gap-8">
            <MainControls
                rootNote={rootNote}
                onRootNoteChange={setRootNote}
                octave={octave}
                onOctaveChange={setOctave}
                scaleType={scaleType}
                onScaleTypeChange={setScaleType}
                style={style}
                onStyleChange={setStyle}
                pulses={pulses}
                onPulsesChange={handlePulsesChange}
                useNegativeHarmony={useNegativeHarmony}
                onUseNegativeHarmonyChange={setUseNegativeHarmony}
                onGenerate={handleGenerate}
                onRandomize={handleRandomizeSequence}
                isLoading={isLoading}
                isProgressionEmpty={isProgressionEmpty}
                famousSong={famousSong}
                onFamousSongChange={setFamousSong}
            />
        </aside>
        
        <section>
            <GlobalTransport
              isPlaying={isPlaying}
              togglePlayback={togglePlayback}
              tempo={tempo}
              onTempoChange={setTempo}
              onScreenshot={handleScreenshot}
            />
            <div ref={sequencerRef}>
                {!isProgressionEmpty && (
                    <div className="screenshot-info">
                        <span>{rootNote} {scaleType.charAt(0).toUpperCase() + scaleType.slice(1)}</span>
                    </div>
                )}
                {displayProgression && (
                    <Sequencer
                        sequence={displayProgression.sequence}
                        currentStep={currentStep}
                        chords={displayProgression.chords}
                        onStepClick={handleStepClick}
                        playableNotes={playableNotes}
                        onNoteChange={handleNoteChange}
                        onGateChange={handleGateChange}
                        isPlaying={isPlaying}
                        rootNote={rootNote}
                        octave={octave}
                    />
                )}
            </div>
          {error && (
            <div className="error-panel">
                <p className="error-text-title">Error:</p>
                <p className="error-text-body">{error}</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;