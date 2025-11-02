import { GoogleGenAI, Type } from "@google/genai";
import type { ChordProgressionResponse } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    chords: {
      type: Type.ARRAY,
      description: "An array of 4 chord names as strings. e.g. ['Cm', 'G#m', 'Fm', 'A#m']",
      items: { type: Type.STRING },
    },
    sequence: {
      type: Type.ARRAY,
      description: "A 16-step sequencer pattern. Each step is an object.",
      items: {
        type: Type.OBJECT,
        properties: {
          step: { type: Type.INTEGER, description: "The step number from 1 to 16." },
          note: {
            type: Type.STRING,
            description: "The note to be played (e.g., 'C2', 'G#1'). Use null for rests.",
          },
          active: {
            type: Type.BOOLEAN,
            description: "True if the note is played, false for a rest.",
          },
          gate: {
            type: Type.NUMBER,
            description: "The gate length of the note as a multiplier of the step duration (0.1 to 1.0). For rests, this should be 0.",
          },
        },
        required: ["step", "note", "active", "gate"],
      },
    },
  },
  required: ["chords", "sequence"],
};

const styleDescriptors: { [key: string]: string } = {
  'acid techno': 'hypnotic and squelchy, reminiscent of a Roland TB-303. The sequence should feature slides, accents, and a constantly modulating filter feel. It should be driving and repetitive.',
  'blues': 'groovy and soulful. The sequence should follow a 12-bar blues structure rhythmically, emphasizing the root, fifth, and flat seventh.',
  'californian punk': 'fast, melodic, and energetic, often with a pop-like catchiness. Basslines should be tight, following the root notes in a rapid, driving rhythm, typical of skate punk.',
  'charly garcía': "melodic, groovy, and highly musical, in the style of the basslines from Charly García's classic era (Serú Girán, early solo work). It should serve as both a solid foundation and a counter-melody to the chords. Incorporate arpeggios, walking bass elements, and tasteful syncopation to capture the progressive rock and tango-influenced feel. Think of the virtuosity and musicality of bassists like Pedro Aznar.",
  'classic rock': 'a solid, groovy, and melodic bassline that locks in with the drums. It should be the foundation of the song, using root notes and fifths with some simple fills.',
  'ebm': 'repetitive, danceable, and robotic with a strong 4/4 feel. Think body music.',
  'electro': 'funky, syncopated, and robotic. Inspired by classic 808 drum machines and Kraftwerk. The bassline should be punchy and often uses staccato notes to create a distinct, groovy bounce.',
  'hard rock': 'a powerful, driving, and often riff-based bassline. It should be punchy and aggressive, doubling the guitar riff or providing a heavy, solid low-end foundation.',
  'hardcore': 'fast, distorted, and energetic with a relentless, pounding rhythm.',
  'industrial techno': 'dark, dissonant, and groovy. The sequence should use syncopation and rests to create rhythmic tension.',
  'jazz': 'groovy and walking. The sequence should feature syncopation and chromatic passing tones, reminiscent of a classic walking bassline.',
  'milonga': "faster, more syncopated, and with a lighter, more rolling feel than tango. Translate its characteristic rhythmic cells into a hypnotic, driving techno bassline. The feel should be relentless but groovy.",
  'minimal techno': 'hypnotic, sparse, and subtle, focusing on gradual changes and a deep groove.',
  'progressive rock': 'a complex, melodic, and technically demanding bassline with odd time signatures and frequent changes. It should be treated as a lead instrument, with intricate runs and counter-melodies.',
  'psychedelic rock': 'a melodic, often improvisational-sounding bassline with a hypnotic feel. Use of arpeggios, scalar runs, and a more fluid rhythm is encouraged.',
  'punk': 'simple, driving, and aggressive, using mostly root notes with a straightforward rhythm.',
  'seattle grunge': 'heavy, distorted, and often sludgy with a slow to mid-tempo feel. Basslines should be thick, powerful, and closely follow the guitar riff, often using drop tunings and simple, impactful root note patterns.',
  'tango': "dramatic, passionate, and rhythmic, with a strong sense of tension and release. Adapt the characteristic 'habanera' rhythm and syncopation into a powerful, dark techno groove. Use staccato notes and sudden rests.",
};


export const generateBassProgression = async (rootNote: string, useNegativeHarmony: boolean, octave: number, scaleType: 'minor' | 'major', style: string, pulses: number, famousSong: string): Promise<ChordProgressionResponse> => {
  try {
    const negativeHarmonyInstruction = useNegativeHarmony
      ? `Apply the principles of negative harmony. The progression should be a reflection of a typical minor progression around the tonal axis, creating a sense of tension and resolution that feels 'inverted' or 'mirrored'.`
      : ``;

    let prompt: string;

    if (style === 'riff de rock famoso' && famousSong.trim() !== '') {
      prompt = `Generate a four-chord progression and a corresponding 16-step sequencer pattern for a bassline inspired by the song '${famousSong}'. Analyze the original song's bassline and chord structure to create a similar feel. The progression and sequence should be groovy and rhythmic, capturing the essence of the original. The root note '${rootNote}' in a ${scaleType} key should be considered as a starting point or tonal center, but the generated progression should prioritize emulating the song. The 16-step sequence must contain exactly ${pulses} active steps. For each active step, provide a 'gate' value between 0.2 and 1.0 to control the note's duration. A value of 1.0 means the note lasts the full step. The sequence should use notes in octave ${octave}. For rests where no note is played, the 'note' property should be null, 'active' should be false, and 'gate' should be 0. ${negativeHarmonyInstruction}`;
    } else {
      const specificStyleInstruction = styleDescriptors[style as keyof typeof styleDescriptors] || 'groovy and rhythmic.';
      prompt = `Generate a four-chord progression and a corresponding 16-step sequencer pattern for a ${style} bassline based on the root note '${rootNote}' in a ${scaleType} key. The progression and sequence should be ${specificStyleInstruction}. The 16-step sequence must contain exactly ${pulses} active steps (notes). For each active step, provide a 'gate' value between 0.2 and 1.0 to control the note's duration, creating a dynamic and groovy rhythm. A value of 1.0 means the note lasts the full step. The sequence should primarily use the root notes of the generated chords, in octave ${octave}. For rests where no note is played, the 'note' property should be null, 'active' should be false, and 'gate' should be 0. ${negativeHarmonyInstruction}`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: `You are 'Luthier', an AI with a punk rock attitude specializing in raw, powerful basslines for various electronic and rock genres. Your task is to generate chord progressions and 16-step sequences that hit hard and fit the requested style. For each note, define its gate (duration) to create a groovy, dynamic rhythm. If asked to emulate a specific song, analyze it and capture its essence. Respond only with the requested JSON object defined by the schema. Ensure the sequence has a strong, groovy, and aggressive feel appropriate for the specified genre or song.`,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const jsonText = response.text.trim();
    const data = JSON.parse(jsonText);

    // Validate the structure
    if (!data.chords || !data.sequence || data.sequence.length !== 16) {
        throw new Error("Invalid data structure received from API.");
    }

    return data;
  } catch (error) {
    console.error("Error generating progression:", error);
    throw new Error("Failed to generate progression. Please check your input and try again.");
  }
};