import React from "react"
import { useSelector, useDispatch } from 'react-redux';
export default function Sidebar(props) {
    // Get the notes and currentNoteId from the Redux store
    const notes = useSelector(state => state.notes);
    const currentNoteId = useSelector(state => state.currentNoteId);
    // Get the dispatch function from the Redux store
    const dispatch = useDispatch();
    // Find the current note
    const currentNote = notes.find(note => note.id === currentNoteId) || notes[0];
    // rendering note elements
    const noteElements = props.notes.map((note, index) => (

        <div key={note.id}>
            <div
                
                className={`title ${
                    note.id === currentNote.id ? "selected-note" : ""
                }`}
                onClick={() => dispatch({ type: 'SET_CURRENT_NOTE_ID', currentNoteId: note.id })}
            >
                <h4 className="text-snippet">{note.noteContent.split("\n")[0]}</h4>
                <button 
                    className="delete-btn"
                    onClick={(event) => props.deleteNote(event, note.id)}
                >
                    <i className="gg-trash trash-icon"></i>
                </button>
            </div>
        </div>
    ))

    return (
        <section className="pane sidebar">
            <div className="sidebar--header">
                <h3>Notes</h3>
                <button className="new-note" onClick={props.newNote}>+</button>
            </div>
            {noteElements}
        </section>
    )
}






