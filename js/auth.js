document.addEventListener("DOMContentLoaded", () => {
  const passwordInput = document.getElementById("password");
  const enterBtn = document.getElementById("enterBtn");
  const errorEl = document.getElementById("error");

  const CORRECT_PASSWORD = "2025";

  function checkPassword() {
    if (passwordInput.value === CORRECT_PASSWORD) {
      errorEl.style.display = "none";
      window.location.href = "greeting.html";
    } else {
      errorEl.style.display = "block";
    }
  }

  // Старый обработчик кнопки
  enterBtn.addEventListener("click", checkPassword);

  // Новый обработчик: реагируем на Enter
  passwordInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      checkPassword();
    }
  });
});
