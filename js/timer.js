document.addEventListener("DOMContentLoaded", () => {
  const daysEl = document.getElementById("days");
  const hoursEl = document.getElementById("hours");
  const minutesEl = document.getElementById("minutes");
  const secondsEl = document.getElementById("seconds");

  function updateTimer() {
    const now = new Date();
    const newYear = new Date(now.getFullYear() + 1, 0, 1);
    const diff = newYear - now;

    daysEl.textContent = Math.floor(diff / (1000 * 60 * 60 * 24));
    hoursEl.textContent = Math.floor((diff / (1000 * 60 * 60)) % 24);
    minutesEl.textContent = Math.floor((diff / (1000 * 60)) % 60);
    secondsEl.textContent = Math.floor((diff / 1000) % 60);
  }

  updateTimer();
  setInterval(updateTimer, 1000);
});
