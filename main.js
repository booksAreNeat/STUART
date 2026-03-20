function options() {
    const showBtn = document.getElementById("showBtn");
    const optionButtons = document.getElementById("optionButtons");

    showBtn.addEventListener("click", () => {
        optionButtons.classList.remove("hidden");
    });
}