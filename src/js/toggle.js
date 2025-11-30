window.addEventListener("DOMContentLoaded", () => {
  const toggles = document.querySelectorAll(".toggle-wrapper");

  toggles.forEach((wrapper) => {
    const switchEl = wrapper.querySelector(".toggle-switch");

    switchEl.addEventListener("click", () => {
      wrapper.classList.toggle("active");
      switchEl.classList.toggle("active");

      if (switchEl.classList.contains("active")) {
        // send signal to being invisible
        Protection_ON();
      } else {
        // send signal to being visible
        Protection_OFF();
      }
    });

    if (switchEl.classList.contains("active")) {
      // send signal to being invisible
      Protection_ON();
    } else {
      // send signal to being visible
      Protection_OFF();
    }
  });
});

function Protection_ON() {
  API.send("API:Protection:ON");
}

function Protection_OFF() {
  API.send("API:Protection:OFF");
}
