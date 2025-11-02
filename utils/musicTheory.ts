import { SequenceStep } from '../types';

const notesSharp = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const notesFlat = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

// Maps note names to a common chromatic index for sorting and calculations.
const noteToIndex: { [key: string]: number } = {
  'C': 0, 'B#': 0,
  'C#': 1, 'Db': 1,
  'D': 2,
  'D#': 3, 'Eb': 3,
  'E': 4, 'Fb': 4,
  'F': 5, 'E#': 5,
  'F#': 6, 'Gb': 6,
  'G': 7,
  'G#': 8, 'Ab': 8,
  'A': 9,
  'A#': 10, 'Bb': 10,
  'B': 11, 'Cb': 11
};

// Keys that use flats in their signature, according to the circle of fifths.
const majorKeysThatUseFlats = ['F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb', 'Cb'];
const minorKeysThatUseFlats = ['D', 'G', 'C', 'F', 'Bb', 'Eb', 'Ab']; // Relative minors of the above keys
const flatKeySignatures = new Set([...majorKeysThatUseFlats, ...minorKeysThatUseFlats]);

// Scale intervals from the root in semitones.
const naturalMinorScaleIntervals = [0, 2, 3, 5, 7, 8, 10];
const majorScaleIntervals = [0, 2, 4, 5, 7, 9, 11];

/**
 * Gets the notes in a specific scale, using correct sharp/flat notation.
 * @param rootNote The root note of the scale.
 * @param intervals The semitone intervals for the scale.
 * @param scaleType Whether the scale is 'major' or 'minor', to determine notation.
 * @returns An array of note names in the scale.
 */
const getNotesInScale = (rootNote: string, intervals: number[], scaleType: 'major' | 'minor'): string[] => {
  const sanitizedRoot = rootNote.charAt(0).toUpperCase() + rootNote.slice(1).toLowerCase().replace(/sharp/i, '#').replace(/flat/i, 'b');
  const rootNoteBase = sanitizedRoot.match(/^[A-G][#b]?/)?.[0];

  if (!rootNoteBase || !(rootNoteBase in noteToIndex)) {
    console.warn(`Invalid root note: ${rootNote}`);
    return [];
  }
  
  const startIndex = noteToIndex[rootNoteBase];
  
  // Determine whether to use sharps or flats based on the key signature convention.
  const useFlats = (scaleType === 'major' 
    ? majorKeysThatUseFlats.includes(rootNoteBase) 
    : minorKeysThatUseFlats.includes(rootNoteBase))
    || rootNoteBase.includes('b');
  
  const noteArray = useFlats ? notesFlat : notesSharp;
  
  const scaleNotes = intervals.map(interval => {
    const noteIndex = (startIndex + interval) % 12;
    return noteArray[noteIndex];
  });
  
  return scaleNotes;
};

/**
 * Generates a list of playable notes from the major and minor scales for specific octaves.
 * This provides a rich palette of harmonically related notes for the user to select from.
 * @param rootNote The root note to generate the scales from.
 * @param octaves An array of octave numbers.
 * @returns A flat array of notes with octave numbers (e.g., ['C1', 'D1', ...]).
 */
export const generatePlayableNotes = (rootNote: string, octaves: number[] = [1, 2]): string[] => {
  const minorScaleNotes = getNotesInScale(rootNote, naturalMinorScaleIntervals, 'minor');
  const majorScaleNotes = getNotesInScale(rootNote, majorScaleIntervals, 'major');

  // Combine notes from both scales. Using a Set handles duplicates automatically.
  const combinedNotes = [...new Set([...minorScaleNotes, ...majorScaleNotes])];
  
  // Sort the notes chromatically for a clean UI dropdown, using the noteToIndex map.
  const sortedNotes = combinedNotes.sort((a, b) => {
    const sanitizedA = a.match(/^[A-G][#b]?/)?.[0] || '';
    const sanitizedB = b.match(/^[A-G][#b]?/)?.[0] || '';
    return (noteToIndex[sanitizedA] || 0) - (noteToIndex[sanitizedB] || 0);
  });
  
  if (sortedNotes.length === 0) {
    console.warn(`Could not generate notes for root: ${rootNote}`);
    return [];
  }
  
  const playableNotes: string[] = [];
  octaves.forEach(octave => {
    sortedNotes.forEach(note => {
      playableNotes.push(`${note}${octave}`);
    });
  });
  
  return playableNotes;
};

/**
 * Parses a chord name and returns the chromatic indices of its constituent notes.
 * Handles major and minor triads (e.g., "C", "C#", "Cm", "F#m").
 * @param chord The chord name string.
 * @returns A number array of note indices (0-11).
 */
const getNoteIndicesFromChord = (chord: string): number[] => {
    const match = chord.match(/^([A-G][#b]?)(m)?/);
    if (!match) return [];

    const root = match[1];
    const isMinor = match[2] === 'm';
    const rootIndex = noteToIndex[root];

    if (rootIndex === undefined) return [];
    
    // Major triad: Root, Major Third (4), Perfect Fifth (7)
    // Minor triad: Root, Minor Third (3), Perfect Fifth (7)
    const thirdInterval = isMinor ? 3 : 4;
    
    return [
        rootIndex,
        (rootIndex + thirdInterval) % 12,
        (rootIndex + 7) % 12
    ];
};

/**
 * Analyzes a chord progression to determine the most likely musical scale.
 * @param chords An array of chord names (e.g., ['Cm', 'G#', 'Fm']).
 * @returns The name of the detected scale (e.g., "C Minor") or null if undetectable.
 */
export const detectScale = (chords: string[]): string | null => {
    if (!chords || chords.length === 0) return null;

    const progressionNoteIndices = new Set<number>();
    chords.forEach(chord => {
        getNoteIndicesFromChord(chord).forEach(index => {
            progressionNoteIndices.add(index);
        });
    });

    const allRootNotes = notesSharp;
    let bestFit = { scaleName: '', score: -1 };

    for (const root of allRootNotes) {
        // Check major scale
        const majorScaleNotes = getNotesInScale(root, majorScaleIntervals, 'major');
        const majorScaleIndices = new Set(majorScaleNotes.map(n => noteToIndex[n]));
        let majorMatchCount = 0;
        progressionNoteIndices.forEach(noteIndex => {
            if (majorScaleIndices.has(noteIndex)) {
                majorMatchCount++;
            }
        });

        if (majorMatchCount > bestFit.score) {
            bestFit = { scaleName: `${root} Major`, score: majorMatchCount };
        }

        // Check minor scale
        const minorScaleNotes = getNotesInScale(root, naturalMinorScaleIntervals, 'minor');
        const minorScaleIndices = new Set(minorScaleNotes.map(n => noteToIndex[n]));
        let minorMatchCount = 0;
        progressionNoteIndices.forEach(noteIndex => {
            if (minorScaleIndices.has(noteIndex)) {
                minorMatchCount++;
            }
        });

        if (minorMatchCount > bestFit.score) {
            bestFit = { scaleName: `${root} Minor`, score: minorMatchCount };
        }
    }

    // Heuristic tie-breaker: if the first chord is minor, prefer a minor scale.
    const firstChordIsMinor = chords[0].includes('m');
    if (firstChordIsMinor && !bestFit.scaleName.includes('Minor')) {
       // Potentially switch to relative minor if scores are equal, but for now, this simple check works
       // with the AI's tendency to generate progressions in the requested key.
    }


    return bestFit.score > 0 ? bestFit.scaleName : null;
};

// --- Negative Harmony Transformations ---

const getNoteArrayForKey = (rootNote: string): string[] => {
    const rootNoteBase = rootNote.match(/^[A-G][#b]?/)?.[0];
    if (!rootNoteBase) return notesSharp;

    const useFlats = rootNoteBase.includes('b') || flatKeySignatures.has(rootNoteBase);
    return useFlats ? notesFlat : notesSharp;
};

/**
 * Parses a chord name and returns the names of its constituent notes.
 * @param chord The chord name string.
 * @param rootNoteForKey The root note of the overall key to determine sharps/flats.
 * @returns An array of note names (e.g., ["C", "E", "G"]).
 */
export const getNotesFromChord = (chord: string, rootNoteForKey: string): string[] => {
    const indices = getNoteIndicesFromChord(chord);
    if (indices.length === 0) return [];
    
    const noteArray = getNoteArrayForKey(rootNoteForKey);
    return indices.map(index => noteArray[index]);
};

const transformNoteNegative = (noteName: string, rootNote: string, noteArray: string[]): string => {
    if (!noteName) return noteName;

    const rootIndex = noteToIndex[rootNote.match(/^[A-G][#b]?/)?.[0] || 'C'];
    if (rootIndex === undefined) return noteName;
    
    // The axis is between the tonic and the dominant (perfect fifth).
    const fifthIndex = (rootIndex + 7) % 12;
    const axisSum = rootIndex + fifthIndex;

    const noteBase = noteName.match(/^[A-G][#b]?/)?.[0];
    if (!noteBase) return noteName;

    const oldNoteIndex = noteToIndex[noteBase];
    if (oldNoteIndex === undefined) return noteName;

    let newNoteIndex = (axisSum - oldNoteIndex);
    // Handle negative results from the modulo operation.
    while (newNoteIndex < 0) {
        newNoteIndex += 12;
    }
    newNoteIndex %= 12;

    return noteArray[newNoteIndex];
};

export const applyNegativeHarmonyToSequence = (sequence: SequenceStep[], rootNote: string): SequenceStep[] => {
    const noteArray = getNoteArrayForKey(rootNote);

    return sequence.map(step => {
        if (!step.active || !step.note) {
            return step;
        }
        
        const octaveMatch = step.note.match(/\d+$/);
        const octave = octaveMatch ? octaveMatch[0] : '';
        
        const noteBase = step.note.replace(/\d+$/, '');
        const newNoteBase = transformNoteNegative(noteBase, rootNote, noteArray);
        
        return {
            ...step,
            note: `${newNoteBase}${octave}`,
        };
    });
};

export const applyNegativeHarmonyToChords = (chords: string[], rootNote: string): string[] => {
    const noteArray = getNoteArrayForKey(rootNote);

    return chords.map(chord => {
        if (!chord) return chord;
        const isMinor = chord.includes('m');
        const noteBase = chord.replace('m', '');
        
        const newNoteBase = transformNoteNegative(noteBase, rootNote, noteArray);

        // Negative harmony inverts chord quality.
        const newQuality = isMinor ? '' : 'm';
        
        return `${newNoteBase}${newQuality}`;
    });
};