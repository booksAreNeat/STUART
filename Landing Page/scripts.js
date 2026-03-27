document.addEventListener("DOMContentLoaded", function () {
    const track = document.getElementById("carouselTrack");
    const slides = document.querySelectorAll(".slide");
    const dots = document.querySelectorAll(".dot");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
  
    let currentSlide = 0;
    const totalSlides = slides.length;
  
    function updateCarousel() {
      track.style.transform = `translateX(-${currentSlide * 100}%)`;
  
      dots.forEach((dot, index) => {
        dot.classList.toggle("active", index === currentSlide);
      });
    }
  
    nextBtn.addEventListener("click", function () {
      currentSlide++;
      if (currentSlide >= totalSlides) {
        currentSlide = 0;
      }
      updateCarousel();
    });
  
    prevBtn.addEventListener("click", function () {
      currentSlide--;
      if (currentSlide < 0) {
        currentSlide = totalSlides - 1;
      }
      updateCarousel();
    });
  
    dots.forEach((dot, index) => {
      dot.addEventListener("click", function () {
        currentSlide = index;
        updateCarousel();
      });
    });
  
    updateCarousel();
  });

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }