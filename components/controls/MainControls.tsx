import React from 'react';
import NoteSelector from '../NoteSelector';
import { RocketIcon } from '../icons';
import Panel from '../layout/Panel';

const styles = [
    'acid techno', 'blues', 'californian punk', 'charly garcía', 'classic rock', 'ebm',
    'electro', 'hard rock', 'hardcore', 'industrial techno', 'jazz',
    'milonga', 'minimal techno', 'progressive rock', 'psychedelic rock',
    'punk', 'riff de rock famoso', 'seattle grunge', 'tango'
];

interface MainControlsProps {
    rootNote: string;
    onRootNoteChange: (note: string) => void;
    octave: number;
    onOctaveChange: (octave: number) => void;
    scaleType: 'minor' | 'major';
    onScaleTypeChange: (scale: 'minor' | 'major') => void;
    style: string;
    onStyleChange: (style: string) => void;
    pulses: number;
    onPulsesChange: (pulses: number) => void;
    useNegativeHarmony: boolean;
    onUseNegativeHarmonyChange: (use: boolean) => void;
    onGenerate: () => void;
    onRandomize: () => void;
    isLoading: boolean;
    isProgressionEmpty: boolean;
    famousSong: string;
    onFamousSongChange: (song: string) => void;
}

const MainControls: React.FC<MainControlsProps> = (props) => {
    const {
        rootNote, onRootNoteChange, octave, onOctaveChange, scaleType, onScaleTypeChange,
        style, onStyleChange, pulses, onPulsesChange, useNegativeHarmony, onUseNegativeHarmonyChange,
        onGenerate, onRandomize, isLoading, isProgressionEmpty, famousSong, onFamousSongChange
    } = props;

    const isGenerateDisabled = isLoading || (style === 'riff de rock famoso' && famousSong.trim() === '');

    return (
        <Panel>
            <div className="control-section">
                <h2 className="control-section-title">Núcleo</h2>
                <div className="grid grid-cols-2 gap-4">
                    <NoteSelector
                        label="Nota"
                        selectedNote={rootNote}
                        onNoteChange={onRootNoteChange}
                    />
                    <div>
                        <label htmlFor="octave-selector" className="form-label">Octava</label>
                        <select
                            id="octave-selector"
                            value={octave}
                            onChange={(e) => onOctaveChange(Number(e.target.value))}
                            className="form-input form-select"
                        >
                            {[0, 1, 2, 3, 4].map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="scale-type-selector" className="form-label">Escala</label>
                        <select
                            id="scale-type-selector"
                            value={scaleType}
                            onChange={(e) => onScaleTypeChange(e.target.value as 'minor' | 'major')}
                            className="form-input form-select"
                        >
                            <option value="minor">Menor</option>
                            <option value="major">Mayor</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="style-selector" className="form-label">Estilo</label>
                        <select
                            id="style-selector"
                            value={style}
                            onChange={(e) => onStyleChange(e.target.value)}
                            className="form-input form-select"
                        >
                            {styles.map(s => <option key={s} value={s}>{s.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</option>)}
                        </select>
                    </div>
                </div>

                {style === 'riff de rock famoso' && (
                    <div className="mt-4">
                        <label htmlFor="famous-song-input" className="form-label">Canción + Artista</label>
                        <input
                            id="famous-song-input"
                            type="text"
                            value={famousSong}
                            onChange={(e) => onFamousSongChange(e.target.value)}
                            placeholder="Ej: 'Another One Bites the Dust' de Queen"
                            className="form-input"
                        />
                    </div>
                )}

                <div className="mt-4">
                    <label htmlFor="generation-pulses" className="form-label">Pulsos</label>
                    <div className="flex items-center gap-4">
                        <input
                            type="range"
                            id="generation-pulses"
                            aria-label="Pulsos para la generación"
                            min="1"
                            max="16"
                            value={pulses}
                            onChange={(e) => onPulsesChange(Number(e.target.value))}
                            className="form-range w-full"
                        />
                        <span className="font-display text-lg w-8 text-right flex-shrink-0">{pulses}</span>
                    </div>
                </div>

                <div className="tonal-flavor-control">
                    <h2 className="control-section-title">Tono</h2>
                    <label className="tonal-flavor-label">
                        <input
                            type="checkbox"
                            checked={useNegativeHarmony}
                            onChange={(e) => onUseNegativeHarmonyChange(e.target.checked)}
                            className="form-checkbox"
                        />
                        <span>Armonía Negativa</span>
                    </label>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4">
                    <button
                        onClick={onGenerate}
                        disabled={isGenerateDisabled}
                        className="btn btn-primary w-full"
                    >
                        {isLoading ? 'Componiendo...' : 'Componer'}
                    </button>
                     <button
                        onClick={onRandomize}
                        className="btn w-full"
                        disabled={isProgressionEmpty}
                        title={isProgressionEmpty ? "Genere una progresión primero" : "Añadir variación y caos"}
                     >
                       <RocketIcon className="w-4 h-4" />
                       <span style={{marginLeft: '0.5rem'}}>Temperatura</span>
                    </button>
                </div>
            </div>
        </Panel>
    );
};

export default MainControls;