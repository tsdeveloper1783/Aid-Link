import React, { useEffect, useState } from "react";
import { getNotes, createNote } from "../services/api";

function Notes() {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const res = await getNotes();
      setNotes(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddNote = async () => {
    try {
      await createNote(newNote);
      setNewNote("");
      fetchNotes(); // refresh list
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Notes</h1>
      <ul>
        {notes.map((n, index) => (
          <li key={index}>{n.body}</li>
        ))}
      </ul>
      <input
        type="text"
        value={newNote}
        onChange={(e) => setNewNote(e.target.value)}
        placeholder="Write a note..."
      />
      <button onClick={handleAddNote}>Add Note</button>
    </div>
  );
}

export default Notes;
