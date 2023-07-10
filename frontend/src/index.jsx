import React from "react"
import ReactDOM from "react-dom"
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import App from "./App"
// Define the initial state of your application
const initialState = {
    notes: [],
    currentNoteId: null
  };
  
  // Define a reducer function to handle actions
  function reducer(state = initialState, action) {
    switch (action.type) {
      case 'SET_NOTES':
        return {
          ...state,
          notes: action.notes
        };
      case 'SET_CURRENT_NOTE_ID':
        return {
          ...state,
          currentNoteId: action.currentNoteId
        };
      default:
        return state;
    }
  }
  
  // Create a Redux store
  const store = createStore(reducer);
ReactDOM.render(
    <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>

, document.getElementById('root'));