const toggle = document.createElement("button");
toggle.innerText = "🌙 Toggle Dark Mode";
toggle.className = "theme-toggle";
document.body.appendChild(toggle);

toggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});