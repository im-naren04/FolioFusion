import express from "express";
import bodyParser from "body-parser";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const usersFile = path.join(__dirname, "users.json");


function loadUsers() {
  try {
    if (!fs.existsSync(usersFile)) {
      fs.writeFileSync(usersFile, JSON.stringify({}, null, 2));
      return {};
    }
    const data = fs.readFileSync(usersFile, "utf-8");
    return data ? JSON.parse(data) : {};
  } catch (err) {
    console.error("Error reading users file:", err);
    return {};
  }
}

function saveUsers(users) {
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
}

//Home route
app.get("/", (req, res) => {
  res.render("index");
});

//Create a new profile
app.post("/create-profile", (req, res) => {
  const users = loadUsers();
  const { username, name, github, linkedin, bio, theme, layout } = req.body;
  const uname = username.trim().toLowerCase();

  users[uname] = { name, github, linkedin, bio, theme, layout, sections: [] };
  saveUsers(users);

  res.redirect(`/profile/${uname}`);
});

//View profile
app.get("/profile/:username", (req, res) => {
  const users = loadUsers();
  const username = req.params.username.trim().toLowerCase();
  const user = users[username];

  if (!user) return res.send("User not found!");

  res.render("profile", { user, userKey: req.params.username });
});

//Add a new section to a user’s profile
app.post("/profile/:username/add-section", (req, res) => {
  const users = loadUsers();
  const username = req.params.username.trim().toLowerCase();
  const { sectionType, title, description } = req.body;

  if (!users[username]) {
    console.log("User not found while adding section");
    return res.redirect("/");
  }

  if (!users[username].sections) users[username].sections = [];

  users[username].sections.push({ sectionType, title, description });
  saveUsers(users);

  res.redirect(`/profile/${username}`);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
