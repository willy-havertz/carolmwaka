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

// URL of the API where errors will be reported
const errorReportingApi = "http://localhost:3000/report-error"; // Replace with your server URL

// Function to report errors to the API
function reportNetworkError(errorMessage) {
  const errorData = {
    message: errorMessage,
    url: window.location.href, // URL where the error occurred
    timestamp: new Date().toISOString(),
  };

  // Send error report to your API
  fetch(errorReportingApi, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(errorData),
  }).catch((err) => {
    console.error("Failed to report error:", err);
  });
}

// Detect general network errors (e.g., failed fetch requests)
window.addEventListener("error", (event) => {
  if (event.error && event.error.message === "Failed to fetch") {
    reportNetworkError("Network error: Failed to fetch resources.");
  }
});

// Detect if the user goes offline
window.addEventListener("offline", () => {
  reportNetworkError("Network error: User is offline.");
});

async function testNetwork() {
  try {
    const response = await fetch("https://willyhavertz.github.io/");
    if (!response.ok) {
      reportNetworkError(`Network error: HTTP status ${response.status}`);
    }
  } catch (error) {
    reportNetworkError("Network error: Failed to reach the website.");
  }
}

// Test network connectivity after page load
window.onload = () => {
  testNetwork();
};
