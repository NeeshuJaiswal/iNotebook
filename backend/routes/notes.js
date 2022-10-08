const express = require('express');
const router = express.Router();
var fetchuser = require('../middleware/fetchuser');
const Notes = require('../models/Notes')
const { body, validationResult } = require('express-validator');
const { findById, findByIdAndUpdate } = require('../models/Notes');


// ROUTE 1:Get All the notes using : GET "/api/notes/fetchallnotes".login required
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Notes.find({ user: req.user.id });
        res.json(notes);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
    }

})

// ROUTE 2:Add a new note using: POST "/api/notes/addnote".login required
router.post('/addnote', fetchuser, [
    body('title', 'Enter valid name').isLength({ min: 3 }),
    body('description', 'description must be at least 5 Charachter').isLength({ min: 5 }),
], async (req, res) => {
    try {
        const { title, description, tag } = req.body;
        // if there are errors return bad request and errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const note = new Notes({
            title, description, tag, user: req.user.id
        })
        const savedNote = await note.save()
        res.json(savedNote)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
    }
})

// ROUTE 3:Update an existing note using: PUT "/api/notes/updatenote".login required
router.put('/updatenote/:id', fetchuser, async (req, res) => {
    const { title, description, tag } = req.body;
    try {
    //create a newnote object
    const newNote = {};
    if (title) { newNote.title = title };
    if (description) { newNote.description = description };
    if (tag) { newNote.tag = tag };

    //find the note to be updated and update it
    let notes = await Notes.findById(req.params.id);
    if (!notes) {
       return res.status(404).send("Not found");
    }
    if (notes.user.toString() !== req.user.id) {
        return res.status(401).send("Not Allowed");
    }
    notes = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
    res.json({ notes });

} catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
}
})

// ROUTE 4:Delete an existing note using: Delete "/api/notes/deletenote".login required
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    try{
    //find the note to be delete and delete it
    let notes = await Notes.findById(req.params.id);
    if (!notes) {
        return res.status(404).send("Not found");
        
    }
    // allow deletion only if user owns this Notes
    if (notes.user.toString() !== req.user.id) {
        return res.status(401).send("Not Allowed");
    }
    notes = await Notes.findByIdAndDelete(req.params.id)
    res.json({ "Success":"Note has been deleted",notes: notes});
}catch(error){
    console.error(error.message);
    res.status(500).send("Internal server error");
}
})
module.exports = router;