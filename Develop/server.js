// Dependencies
// =============================================================
const express = require("express");
const fs = require("fs");
const path = require("path");
const uniqid = require('uniqid');

// Sets up the Express App
// =============================================================
const app = express();
const PORT = process.env.PORT || 4000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname + "/public"))

// Routes
// =============================================================

// Basic route that sends the user first to the AJAX Page
app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
});


app.get("/api/notes", function(req, res){
    res.sendFile(path.join(__dirname,"/db/db.json"))
})

app.post("/api/notes", function(req, res){
    let newNote = req.body
    newNote.id = uniqid()
    fs.readFile((path.join(__dirname,"/db/db.json")), function (err, data){
        if (err) throw err;
        let notes = JSON.parse(data)
        notes.push(newNote)
        fs.writeFile((path.join(__dirname,"/db/db.json")), JSON.stringify(notes), (err) => {
            if (err) throw err;
            console.log("Success!")
        })
        console.log(notes)
        return res.json(notes)
    })
})

app.delete("/api/notes/:id", function(req, res){
    fs.readFile((path.join(__dirname,"/db/db.json")), function (err, data){
        if (err) throw err;
        let notes = JSON.parse(data)
        notesAfterDelete = notes.filter(note => note.id != req.params.id)
        fs.writeFile((path.join(__dirname,"/db/db.json")), JSON.stringify(notesAfterDelete), (err) => {
            if (err) throw err;
            console.log("Success!")
        })
        return res.json(notesAfterDelete)
    })
})

app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.get("*", function(req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});

// Starts the server to begin listening
// =============================================================
app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
});
