window.carouselActive = false;

function animateNumber(el, target) {
  let start = 0;
  const duration = 2000; // 2 секунды
  const startTime = performance.now();

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3); // плавное замедление
  }

  function update(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = easeOutCubic(progress);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = target; // финальное число точно
    }
  }

  requestAnimationFrame(update);
}

function runStatAnimation(card) {
  const statNumber = card.querySelector(".stat-number");
  if (!statNumber) return;

  const target = parseInt(statNumber.dataset.target, 10);

  // сброс числа перед анимацией
  statNumber.textContent = "0";

  animateNumber(statNumber, target);
}

function animateTable(card) {
  const cells = card.querySelectorAll(".cell");
  cells.forEach(cell => cell.classList.remove("visible"));

  cells.forEach((cell, index) => {
    setTimeout(() => {
      cell.classList.add("visible");
    }, index * 300);
  });
}

function runCardAnimation(card) {
  const type = card.dataset.type;

  if (type === "stat") {
    runStatAnimation(card);
  }

  if (type === "table") {
    animateTable(card);
  }

  if (type === "gif") playGifOnce(card);

  // text-card анимируется CSS-ом автоматически
}

function playGifOnce(card) {
  if (card.dataset.played === "true") return;

  const video = card.querySelector(".gif-video");
  if (!video) return;

  video.currentTime = 0;
  video.play();

  card.dataset.played = "true";

  video.addEventListener(
    "ended",
    () => {
      video.pause();
      video.currentTime = video.duration; // финальный кадр
    },
    { once: true }
  );
}



document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".carousel-card");
  const track = document.querySelector(".carousel-track");
  const dotsContainer = document.querySelector(".carousel-dots");
  const prevBtn = document.querySelector(".carousel-arrow.left");
  const nextBtn = document.querySelector(".carousel-arrow.right");

  const summarySection = document.getElementById("summary");

    // флаг активности в зависимости от видимости
    function checkCarouselActive() {
    carouselActive = summarySection.classList.contains("active");
    }

    // проверяем при загрузке
    checkCarouselActive();

  cards.forEach(card => {
    const bg = card.dataset.bg;
    if (bg) {
        card.style.backgroundImage = `url("media/images/carousel_src/${bg}")`;
    }
    });

  let currentIndex = 0;
  let interval;

  // === создаём точки ===
  cards.forEach((_, i) => {
    const dot = document.createElement("div");
    dot.classList.add("carousel-dot");
    if (i === 0) dot.classList.add("active");
    dotsContainer.appendChild(dot);
  });
  const dots = document.querySelectorAll(".carousel-dot");


    window.updateCarousel = function() {

      const cardWidth = cards[0].offsetWidth + 40;
      const viewportCenter = document.querySelector(".carousel-viewport").offsetWidth / 2;

      const offset = viewportCenter - cardWidth / 2 - currentIndex * cardWidth;
      console.log(offset, cards[0].offsetWidth, viewportCenter)

      track.style.transform = `translateX(${offset}px)`;

      cards.forEach((card, i) => {
        card.classList.toggle("active", i === currentIndex);
        if (i === currentIndex && carouselActive) {
          runCardAnimation(card);
        }
      });

      dots.forEach((dot, i) => {
        dot.classList.toggle("active", i === currentIndex);
      });
    }



    function next() {
    if (!carouselActive) return;
    currentIndex = (currentIndex + 1) % cards.length;
    window.updateCarousel();
    }

    function prev() {
    if (!carouselActive) return;
    currentIndex = (currentIndex - 1 + cards.length) % cards.length;
    window.updateCarousel();
    }

    // стрелки мышью
    nextBtn.addEventListener("click", () => { if (carouselActive) { resetAuto(); next(); } });
    prevBtn.addEventListener("click", () => { if (carouselActive) { resetAuto(); prev(); } });

    // клавиатура
    document.addEventListener("keydown", (e) => {
    if (!carouselActive) return;
    if (["INPUT","TEXTAREA"].includes(document.activeElement.tagName)) return;

    if (e.key === "ArrowLeft") { resetAuto(); prev(); }
    if (e.key === "ArrowRight") { resetAuto(); next(); }
    });

  function startAuto() { interval = setInterval(next, 15000); }
  function resetAuto() { clearInterval(interval); startAuto(); }

  startAuto();
  window.updateCarousel();
});

