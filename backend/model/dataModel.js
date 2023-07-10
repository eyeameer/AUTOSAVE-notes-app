const mongoose = require('mongoose');
// defining schema (structure) of the collection
const dataSchema = new mongoose.Schema({
    id:String,
    noteContent:String
});

const Note = mongoose.model('Note', dataSchema,'notes');

module.exports = Note;