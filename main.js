function options() {
    const showBtn = document.getElementById("showBtn");
    const optionButtons = document.getElementById("optionButtons");

    if (showBtn && optionButtons) {
        showBtn.addEventListener("click", () => {
            optionButtons.classList.remove("hidden");
        });
    }
}

let slideIndex = 1;
let autoSlide;

// Run when page loads
document.addEventListener("DOMContentLoaded", () => {
    options();
    showSlides(slideIndex);
    startAutoSlide();
});

// Next/previous controls
function plusSlides(n) {
    showSlides(slideIndex += n);
    restartAutoSlide();
}

// Thumbnail/image controls
function currentSlide(n) {
    showSlides(slideIndex = n);
    restartAutoSlide();
}

// Show one slide at a time
function showSlides(n) {
    const slides = document.getElementsByClassName("mySlides");

    if (slides.length === 0) return;

    if (n > slides.length) {
        slideIndex = 1;
    }

    if (n < 1) {
        slideIndex = slides.length;
    }

    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }

    slides[slideIndex - 1].style.display = "block";
}

// Start automatic slideshow
function startAutoSlide() {
    const slides = document.getElementsByClassName("mySlides");

    if (slides.length === 0) return;

    autoSlide = setInterval(() => {
        slideIndex++;
        showSlides(slideIndex);
    }, 5000); // 5000ms = 5 seconds
}

// Restart timer after manual navigation
function restartAutoSlide() {
    clearInterval(autoSlide);
    startAutoSlide();
}

// login js
function showLogin() {
    document.getElementById("loginButton").style.display = "none";
    document.getElementById("loginForm").style.display = "block";
}

async function loadCSV() {
    const response = await fetch("patients.csv");
    const data = await response.text();
    return parseCSV(data);
}

function parseCSV(csv) {
    const lines = csv.trim().split("\n");
    const result = [];

    for (let i = 1; i < lines.length; i++) { // skip header
        const [name, id] = lines[i].split(",");
        result.push({ name: name.trim(), id: id.trim() });
    }

    return result;
}

async function login() {
    const nameInput = document.getElementById("nameInput").value.trim();
    const idInput = document.getElementById("idInput").value.trim();
    const status = document.getElementById("status");

    const patients = await loadCSV();

    const match = patients.find(
        p => p.name.toLowerCase() === nameInput.toLowerCase() &&
             p.id === idInput
    );

    if (match) {
        status.textContent = "Login successful. Redirecting...";
        status.style.color = "green";

        setTimeout(() => {
            // 🔥 Route based on ID prefix
            if (idInput.startsWith("PRID")) {
                window.location.href = "prescriber.html";
            } else if (idInput.startsWith("PID")) {
                window.location.href = "patient.html";
            } else {
                status.textContent = "Unknown ID type.";
                status.style.color = "red";
            }
        }, 800);

    } else {
        status.textContent = "Invalid name or ID.";
        status.style.color = "red";
    }
}
