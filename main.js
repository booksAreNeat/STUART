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