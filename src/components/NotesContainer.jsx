import React, { useState, useEffect } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";

const NotesContainer = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");

  useEffect(() => {
    const savedNotes = localStorage.getItem("notes");
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
  }, []);

  const handleAddNote = () => {
    if (newNote.trim() !== "") {
      const updatedNotes = [...notes, newNote];
      setNotes(updatedNotes);
      localStorage.setItem("notes", JSON.stringify(updatedNotes));
      setNewNote("");
    }
  };

  const handleDeleteNote = (index) => {
    const updatedNotes = notes.filter((_, i) => i !== index);
    setNotes(updatedNotes);
    localStorage.setItem("notes", JSON.stringify(updatedNotes));
  };

  return (
    <div className="my-4 mx-4 lg:ml-0 lg:mr-4 p-4 border rounded">
      <h2 className="text-xl font-bold mb-4">Notes</h2>
      <div className="flex gap-2 items-center mb-4">
        <input
          type="text"
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          className="p-2 border rounded flex-1 placeholder:text-white bg-inherit"
          placeholder="New note"
        />
        <button
          onClick={handleAddNote}
          className="px-4 py-2 bg-inherit text-white rounded hover:border-b-2 transition-colors duration-300 flex items-center"
        >
          <FaPlus className="mr-2" /> Add Note
        </button>
      </div>
      <ul>
        {notes.map((note, index) => (
          <li
            key={index}
            className="note p-2 mb-2 bg-inherit border-b-2 rounded flex justify-between items-center"
          >
            {note}
            <button
              className="ml-4 text-white hover:text-white transition-colors duration-300"
              onClick={() => handleDeleteNote(index)}
            >
              <FaTrash />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotesContainer;
