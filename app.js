const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const messagesFilePath = path.join(__dirname, "data", "messages.json");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.get("/guestbook", (req, res) => {
  readMessages()
    .then((messages) => {
      res.render("guestbook", { messages });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error reading messages.");
    });
});

app.get("/newmessage", (req, res) => {
  res.sendFile(__dirname + "/views/newmessage.html");
});

app.get("/ajaxmessage", (req, res) => {
  res.sendFile(__dirname + "/views/ajaxmessage.html");
});

app.post("/newmessage", (req, res) => {
  const newMessage = req.body;

  if (newMessage.username && newMessage.country && newMessage.message) {
    fs.readFile(messagesFilePath, (err, data) => {
      if (err) throw err;

      const messages = JSON.parse(data);
      messages.push(newMessage);

      fs.writeFile(
        messagesFilePath,
        JSON.stringify(messages, null, 2),
        (err) => {
          if (err) throw err;
          res.redirect("/guestbook");
        }
      );
    });
  } else {
    res.status(400).send("All fields are required.");
  }
});

app.post("/ajaxmessage", (req, res) => {
  const newMessage = req.body;

  if (newMessage.username && newMessage.country && newMessage.message) {
    fs.readFile(messagesFilePath, (err, data) => {
      if (err) throw err;

      const messages = JSON.parse(data);
      messages.push(newMessage);

      fs.writeFile(
        messagesFilePath,
        JSON.stringify(messages, null, 2),
        (err) => {
          if (err) throw err;
          res.json(messages);
        }
      );
    });
  } else {
    res.status(400).send("All fields are required.");
  }
});

function readMessages() {
  return new Promise((resolve, reject) => {
    fs.readFile(messagesFilePath, "utf8", (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(data));
      }
    });
  });
}

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
