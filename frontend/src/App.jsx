import React from "react"
import Sidebar from "./components/Sidebar"
import Editor from "./components/Editor"

import { useSelector, useDispatch } from 'react-redux';
import {nanoid} from "nanoid"
import Split from "react-split"

export default function App() {
     // Get the notes and currentNoteId from the Redux store
    const notes = useSelector(state => state.notes);
    const currentNoteId = useSelector(state => state.currentNoteId);
    const [fetchError, setFetchError]=React.useState(false)
  // Get the dispatch function from the Redux store
  const dispatch = useDispatch();
    let timeoutId = null;
    React.useEffect(() => { 
        //fetching notes initially
        const dataFetch=async()=>{
            try {
                const res= await fetch('http://localhost:3001/api/getNotes')
                const data=await res.json()
                // Dispatch an action to update the notes in the Redux store
                dispatch({ type: 'SET_NOTES', notes: data });
                // Dispatch an action to update the currentNoteId in the Redux store
                //this will be the first note in the array as the note seen on screen
                dispatch({ type: 'SET_CURRENT_NOTE_ID', currentNoteId: (data[0] && data[0].id) || '' });
            
            } catch (error) {
                setFetchError(true)
            }
        }
        dataFetch()

    }, [])
    
   const createNewNote=async()=> {
     try {
        //creating new note with properties id and noteContent
        const newNote = {
            id: nanoid(),
            noteContent: "# Type your markdown note's title here"
        }
        //making call to endpoint for posting new note to database
        const response = await fetch('http://localhost:3001/api/postNote', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(newNote)
          });
        //making a call to getNotes api to get new updated notes
        const newNotes= await fetch('http://localhost:3001/api/getNotes')
        const data= await newNotes.json()
        //reassigning the new notes to "notes" state variable 
        dispatch({ type: 'SET_NOTES', notes: data });
        dispatch({ type: 'SET_CURRENT_NOTE_ID', currentNoteId: newNote.id });
     } catch (error) {
        console.log(error)
     }
    }
     //updateNote function to dispatch an action to the Redux store
   const updateNote=async(text)=> {
        // this timeoutId will help prevent performance bottlenecks as 
        // requests are only made to api every 5 seconds
        if (timeoutId) {
            clearTimeout(timeoutId);
          }
        
          // Set a new timeout to call the update function after 500ms
          timeoutId = setTimeout(async () => {
            const noteUpdate = await fetch('http://localhost:3001/api/updateNote', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ id: currentNoteId, noteContent: text })
            });
          }, 500);
           // Put the most recently-modified note at the top
           dispatch({
            type: 'SET_NOTES',
            notes: notes.reduce((newArray, oldNote) => {
              if (oldNote.id === currentNoteId) {
                newArray.unshift({ ...oldNote, noteContent: text });
              } else {
                newArray.push(oldNote);
              }
              return newArray;
            }, [])
          });
        }
        // deleteNote function to dispatch an action to the Redux store
    const deleteNote=async(event, noteId)=>{
        event.stopPropagation()

        try {
            //making call to endpoint at backend to delete notes
            const noteTodelete=await fetch('http://localhost:3001/api/deleteNote', {
                method: 'DELETE',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({id: noteId})
              });
            //making call to getNotes endpoint to get notes without the deleted one
              const getUpdatedNotes=await fetch('http://localhost:3001/api/getNotes')
              const newNotes=await getUpdatedNotes.json()
              //setting notes state variable to new updated notes
              dispatch({ type: 'SET_NOTES', notes: newNotes });
        } catch (error) {
            console.log(error)   
        }
    }
    // function to find current note to be displayed on screen
    const findCurrentNote=()=> {
        return notes.find(note => {
            return note.id === currentNoteId
        }) || notes[0]
    }
    
    return (

            <main>
            {
                notes.length > 0 
                ?
                <Split 
                    sizes={[30, 70]} 
                    direction="horizontal" 
                    className="split"
                >
                    <Sidebar
                        notes={notes}
                        currentNote={findCurrentNote()}
                        newNote={createNewNote}
                        deleteNote={deleteNote}
                    />
                    {
                        currentNoteId && 
                        notes.length > 0 &&
                        <Editor 
                            currentNote={findCurrentNote()} 
                            updateNote={updateNote} 
                        />
                    }
                </Split>
                :
                <div className="no-notes">
                    <h1>You have no notes</h1>
                   {
                    fetchError?
                   <p>(to start creating notes first make sure to connect to <br/>mongoDB
                     at backend and make sure server is running<br/> 
                    and by updating fetch links at frontend to match <br/> the same port that of 
                    as the backend server)</p>
                    :
                    ''
                }
                    <button 
                        className="first-note" 
                        onClick={createNewNote}
                    >
                        Create one now
                    </button>
                </div>
                
            }
            </main>


    )
}



