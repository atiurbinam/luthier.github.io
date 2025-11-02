import React from 'react';
import { SequenceStep } from '../types';
import { getNotesFromChord } from '../utils/musicTheory';

interface SequencerProps {
  sequence: SequenceStep[];
  currentStep: number | null;
  isPlaying: boolean;
  chords: string[];
  onStepClick: (stepIndex: number) => void;
  playableNotes: string[];
  onNoteChange: (stepIndex: number, newNote: string | null) => void;
  onGateChange: (stepIndex: number, newGate: number) => void;
  rootNote: string;
  octave: number;
}

const Sequencer: React.FC<SequencerProps> = ({
  sequence,
  currentStep,
  isPlaying,
  chords,
  onStepClick,
  playableNotes,
  onNoteChange,
  onGateChange,
  rootNote,
  octave,
}) => {
  const getStepClass = (step: SequenceStep, index: number) => {
    const classes = ['sequencer-step'];
    if (step.active) {
      classes.push('active');
    }
    if (currentStep === index) {
      if (isPlaying) {
        classes.push('playing');
      } else {
        classes.push('paused');
      }
    }
    return classes.join(' ');
  };

  const renderStep = (step: SequenceStep, index: number) => {
    // Determine which chord corresponds to the current step (4 steps per chord)
    const chordIndex = Math.floor(index / 4);
    const currentChord = chords[chordIndex];

    let chordToneOptions: string[] = [];
    if (currentChord) {
      const chordNoteBases = getNotesFromChord(currentChord, rootNote);
      // Generate chord tones for a range of octaves around the base octave
      // to give the user more creative options.
      [-1, 0, 1].forEach(octaveOffset => {
        const currentOctave = octave + octaveOffset;
        // Limit octaves to a reasonable range for bass.
        if (currentOctave >= 0 && currentOctave <= 5) {
          chordNoteBases.forEach(noteBase => {
            chordToneOptions.push(`${noteBase}${currentOctave}`);
          });
        }
      });
    }

    // Ensure chordToneOptions are unique.
    const uniqueChordTones = [...new Set(chordToneOptions)];

    // Filter out chord notes from the general playable notes list to avoid duplication.
    const scaleToneOptions = playableNotes.filter(note => !uniqueChordTones.includes(note));

    return (
    <div
      key={index}
      className={getStepClass(step, index)}
      onClick={() => onStepClick(index)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onStepClick(index)}
      aria-label={`Step ${index + 1}. ${step.active ? `Note: ${step.note}, Gate: ${step.gate}` : 'Inactive'}. Click to toggle.`}
    >
      {step.active ? (
        <div className="sequencer-step-controls">
            <select
              value={step.note || ''}
              onChange={(e) => onNoteChange(index, e.target.value === 'REST' ? null : e.target.value)}
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.stopPropagation()}
              className="sequencer-select"
              aria-label={`Selected note for step ${index + 1}`}
            >
              <option value="REST">--</option>
                {uniqueChordTones.length > 0 && (
                    <optgroup label="Chord Tones">
                        {uniqueChordTones.map(note => (
                            <option key={note} value={note}>{note}</option>
                        ))}
                    </optgroup>
                )}
                <optgroup label={uniqueChordTones.length > 0 ? "Scale Tones" : "All Notes"}>
                    {scaleToneOptions.map(note => (
                        <option key={note} value={note}>{note}</option>
                    ))}
                </optgroup>
            </select>
            <input
                type="range"
                min="0.1"
                max="1"
                step="0.05"
                value={step.gate}
                className="sequencer-gate-fader"
                onChange={(e) => onGateChange(index, Number(e.target.value))}
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => e.stopPropagation()}
                aria-label={`Gate for step ${index + 1}`}
            />
        </div>
      ) : (
        <span style={{ fontSize: '0.9rem' }}>{step.step}</span>
      )}
    </div>
  )};

  return (
    <div>
      <div className="chord-display-grid">
        {chords.map((chord, index) => (
          <div
            key={index}
            className="chord-display"
          >
            {chord || '----'}
          </div>
        ))}
      </div>
      <div className="sequencer-grid-container">
        <div className="sequencer-grid">
          {sequence.slice(0, 8).map((step, index) => renderStep(step, index))}
        </div>
        <div className="sequencer-grid">
          {sequence.slice(8, 16).map((step, i) => renderStep(step, i + 8))}
        </div>
      </div>
    </div>
  );
};

export default Sequencer;
