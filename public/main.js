// Create a floating toggle button dynamically
const toggle = document.createElement("button");
toggle.innerText = "🌙 Toggle Dark Mode";
toggle.className = "theme-toggle";
document.body.appendChild(toggle);

// Add click event to switch dark mode on/off
toggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});
