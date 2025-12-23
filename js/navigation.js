window.updateCarouselActiveFlag = function() {
  const summarySection = document.getElementById("summary");
  window.carouselActive = summarySection.classList.contains("active");
}


document.addEventListener("DOMContentLoaded", () => {
  const navItems = document.querySelectorAll(".nav-item");
  const sections = document.querySelectorAll(".section");

  navItems.forEach(item => {
    item.addEventListener("click", () => {
      const targetId = item.dataset.target;

      // переключаем кнопки
      navItems.forEach(i => i.classList.remove("active"));
      item.classList.add("active");

      // переключаем секции
      sections.forEach(section => {
        section.classList.remove("active");
        if (section.id === targetId) {
          section.classList.add("active");
        }
      });
      updateCarouselActiveFlag();
      if (carouselActive) {
        updateCarousel();
      }
    });
  });
});
