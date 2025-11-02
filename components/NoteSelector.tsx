import React from 'react';

const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

interface NoteSelectorProps {
  label: string;
  selectedNote: string;
  onNoteChange: (note: string) => void;
  className?: string;
}

const NoteSelector: React.FC<NoteSelectorProps> = ({ label, selectedNote, onNoteChange, className }) => {
  return (
    <div className={className}>
      <label htmlFor="note-selector" className="form-label">{label}</label>
      <select
        id="note-selector"
        value={selectedNote}
        onChange={(e) => onNoteChange(e.target.value)}
        className="form-input form-select"
      >
        {notes.map(note => (
          <option key={note} value={note}>{note}</option>
        ))}
      </select>
    </div>
  );
};

export default NoteSelector;