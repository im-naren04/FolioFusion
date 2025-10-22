// Import required modules
import express from "express";
import bodyParser from "body-parser";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Resolve current file and directory paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize express app
const app = express();
const port = 3000;

// Configure express
app.set("view engine", "ejs");              // Set EJS as the template engine
app.use(bodyParser.urlencoded({ extended: true })); // Parse form data
app.use(express.static("public"));          // Serve static assets such as CSS and JS

// Path to users JSON file which is used as simple storage
const usersFile = path.join(__dirname, "users.json");

/**
 * Load all user profiles from users.json
 * Creates the file if it doesn't exist
 */
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

/**
 * Save all user profiles to users.json
 */
function saveUsers(users) {
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
}

// Home page - profile creation form
app.get("/", (req, res) => {
  res.render("index");
});

// Create new user profile
app.post("/create-profile", (req, res) => {
  const users = loadUsers();
  const { username, name, github, linkedin, bio, theme, layout } = req.body;
  const uname = username.trim().toLowerCase();

  // Store user data with chosen theme and layout
  users[uname] = { name, github, linkedin, bio, theme, layout, sections: [] };
  saveUsers(users);

  // Redirect to the new profile page
  res.redirect(`/profile/${uname}`);
});

// View a specific user’s profile
app.get("/profile/:username", (req, res) => {
  const users = loadUsers();
  const username = req.params.username.trim().toLowerCase();
  const user = users[username];

  if (!user) return res.send("User not found!");

// Render profile with user data
  res.render("profile", { user, userKey: req.params.username });
});

// Add a new custom section to an existing profile
app.post("/profile/:username/add-section", (req, res) => {
  const users = loadUsers();
  const username = req.params.username.trim().toLowerCase();
  const { sectionType, title, description } = req.body;

  if (!users[username]) {
    console.log("User not found while adding section");
    return res.redirect("/");
  }

  // Ensure the user has a 'sections' array, then add a new entry
  if (!users[username].sections) users[username].sections = [];
  users[username].sections.push({ sectionType, title, description });

  saveUsers(users);
  res.redirect(`/profile/${username}`);
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
