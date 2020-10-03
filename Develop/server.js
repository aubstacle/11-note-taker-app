const express = require("express");
const fs = require("fs");
const app = express();
const path = require("path");

const PORT = process.env.PORT || 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.get("/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get("/api/", function (req, res) {
  return res.sendFile(path.join(__dirname, "db/db.json"));
});

// Displays a single character, or returns false
// app.get("/api/characters/:character", function (req, res) {
//   var chosen = req.params.character;

//   console.log(chosen);

//   for (var i = 0; i < characters.length; i++) {
//     if (chosen === characters[i].routeName) {
//       return res.json(characters[i]);
//     }
//   }

//   return res.json(false);
// });

app.post("/api/notes", (req, res) => {
  console.log(req.body);
  if (!req.body.name || !req.body.text) {
    return res.status(400).json({
      error: true,
      data: null,
      message: "Invalid. Please reformat and try again.",
    });
  }
  fs.readFile("./db/db.json", "utf-8", (err, data) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        error: true,
        data: null,
        message: "Unable to retrieve note.",
      });
    }
    const updatedData = JSON.parse(data);
    updatedData.push(req.body);
    fs.writeFile("./db/db.json", JSON.stringify(updatedData), (err) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          error: true,
          data: null,
          message: "Unable to save new student.",
        });
      }
      res.json({
        error: false,
        data: updatedData,
        message: "Successfully added new student.",
      });
    });
  });
});

app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`);
});
