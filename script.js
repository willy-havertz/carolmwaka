let menuIcon = document.querySelector("#menu-icon");
let navbar = document.querySelector(".navbar");
let sections = document.querySelectorAll("section");
let navLinks = document.querySelectorAll("header nav ul li a");

window.onscroll = () => {
  sections.forEach((sec) => {
    let top = window.scrollY;
    let offset = sec.offsetTop - 150;
    let height = sec.offsetHeight;
    let id = sec.getAttribute("id");
    if (top >= offset && top < offset + height) {
      navLinks.forEach((links) => {
        links.classList.remove("active");
        document
          .querySelector(`header nav ul li a[href*="#${id}"]`)
          .classList.add("active");
      });
    }
  });
};

menuIcon.onclick = () => {
  menuIcon.classList.toggle("bx-x");
  navbar.classList.toggle("active");
};
closeIcon.addEventListener("click", function () {
  navbar.classList.toggle("show-navbar");
});
require("dotenv").config();
const apiKey = process.env.API_KEY;

async function fetchData() {
  try {
    const response = await fetch("https://api.example.com/data");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error("Network error:", error.message);
    logErrorToServer(error.message);
  }
}

function logErrorToServer(errorDetails) {
  fetch("http://localhost:3000/log-error", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": "dc2615d2-330f-4729-a5ab-29a473a32d52",
    },
    body: JSON.stringify({ errorDetails }),
  });
}
