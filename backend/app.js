require('dotenv').config()
const Note=require('./model/dataModel')
const connectDB=require('./db/db')
const express = require('express');
const cors = require('cors');
// defining port for server to run at 
const port=3001 || process.env.port
const app = express();
// fixing CORS issues that may arise when from sever and frontend running at different ports
app.use(cors({
    origin:'*'
}));
app.use(express.json())
// API
// enpoint for retrieving all the notes from Note collection of the db
app.get('/api/getNotes', async(req, res)=>{
        try {
            const notes=await Note.find()
            res.status(200).json(notes)
        } catch (error) {
            console.log(error)

        }
});
// enpoint for posting a newly created note to the Note collection of the db
app.post('/api/postNote',async(req,res)=>{
    try {
        const note=await Note.create({...req.body})
        res.status(200).json(note)

    } catch (error) {
        console.log(error)
        
    }
})
// enpoint for updating notes in real-time whenever changes are made to them 
app.post('/api/updateNote',async(req,res)=>{
    try {
        const { id, noteContent } = req.body;
        const note=await Note.updateOne({id:id},{$set:{noteContent}})
        res.status(200).json(note)
    } catch (error) {
        
    }
})
// endpoint for deleting a note from Note collection of the db
app.delete('/api/deleteNote',async(req,res)=>{
    try {
        const note=await Note.deleteOne({id:req.body.id})
        res.status(200).json(note)
    } catch (error) {
        console.log(error)
    }
})

// function that initiates the server
const start=async()=>{
        try {
            await connectDB(process.env.MONGO_URI);
            app.listen(port, () =>console.log(`listening on port ${port}`) )
        } catch (error) {
            console.log(error)
        }

}
// calling the server initiating server
start()