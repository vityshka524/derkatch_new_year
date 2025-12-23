// ===== МОДАЛЬНЫЙ ТУЛТИП =====
let overlay;
let modalContent;
let closeBtn;

let specialDaysList = [];
let currentIndex = 0;


function openModal(text) {
  modalContent.textContent = text;
  overlay.style.display = "flex";
}

function closeModal() {
  overlay.style.display = "none";
}

function openModalByIndex(index) {
  const item = specialDaysList[index];

  modalDate.textContent =
    `${item.day}.${item.month + 1}.${item.year}`;

  modalContent.textContent = item.text;

  overlay.style.display = "flex";
}

document.addEventListener("DOMContentLoaded", () => {
  overlay = document.getElementById("modal-overlay");
  modalContent = document.getElementById("modal-content");
  modalDate = document.getElementById("modal-date");

  closeBtn = document.querySelector(".modal-close");

  // === обработчики закрытия ===
  closeBtn.addEventListener("click", closeModal);

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeModal();
  });

  const calendarEl = document.getElementById("calendar-grid");
  const year = new Date().getFullYear();

  
  fetch("data/memorable_days.json")
    .then(res => res.json())
    .then(data => {
        const yearData = data[year] || {};

        // формируем плоский список
        specialDaysList = [];

        Object.keys(yearData).forEach(month => {
        Object.keys(yearData[month]).forEach(day => {
            specialDaysList.push({
            year,
            month: Number(month),
            day: Number(day),
            text: yearData[month][day]
            });
        });
        });

        // сортировка по дате
        specialDaysList.sort((a, b) =>
        new Date(a.year, a.month, a.day) - new Date(b.year, b.month, b.day)
        );

        createCalendar(calendarEl, year, yearData);
    });

    document.addEventListener("keydown", (e) => {
    // если модалка закрыта — ничего не делаем
    if (overlay.style.display !== "flex") return;

    if (e.key === "ArrowLeft") {
        if (currentIndex > 0) {
        currentIndex--;
        openModalByIndex(currentIndex);
        }
    }

    if (e.key === "ArrowRight") {
        if (currentIndex < specialDaysList.length - 1) {
        currentIndex++;
        openModalByIndex(currentIndex);
        }
    }

    if (e.key === "Escape") {
        closeModal();
    }
    });
});


function createCalendar(container, year, specialDays, fixedTooltip) {
  const monthNames = [
    "Январь","Февраль","Март","Апрель",
    "Май","Июнь","Июль","Август",
    "Сентябрь","Октябрь","Ноябрь","Декабрь"
  ];

  const dayNames = ["Пн","Вт","Ср","Чт","Пт","Сб","Вс"];

  monthNames.forEach((monthName, monthIndex) => {
    const monthEl = document.createElement("div");
    monthEl.classList.add("month");

    const caption = document.createElement("div");
    caption.classList.add("month-caption");
    caption.textContent = monthName;
    monthEl.appendChild(caption);

    const daysGrid = document.createElement("div");
    daysGrid.classList.add("days-grid");

    dayNames.forEach(dn => {
      const dnEl = document.createElement("div");
      dnEl.classList.add("day-name");
      dnEl.textContent = dn;
      daysGrid.appendChild(dnEl);
    });

    const firstDay = new Date(year, monthIndex, 1);
    const lastDay = new Date(year, monthIndex + 1, 0);
    const startWeekDay = (firstDay.getDay() + 6) % 7;

    for (let i = 0; i < startWeekDay; i++) {
      const emptyEl = document.createElement("div");
      daysGrid.appendChild(emptyEl);
    }

    for (let day = 1; day <= lastDay.getDate(); day++) {
      const dayEl = document.createElement("div");
      dayEl.classList.add("day");
      dayEl.textContent = day;

      if (specialDays[monthIndex] && specialDays[monthIndex][day]) {
        dayEl.classList.add("special");

        const tooltipText = specialDays[monthIndex][day];
        // const tooltip = document.createElement("div");
        // tooltip.classList.add("tooltip");
        // tooltip.textContent = tooltipText;
        // dayEl.appendChild(tooltip);

        // --- Новое: клик фиксирует сообщение ---
        dayEl.addEventListener("click", (e) => {
        e.stopPropagation();

        currentIndex = specialDaysList.findIndex(d =>
            d.month === monthIndex && d.day === day
        );

        openModalByIndex(currentIndex);
        });

      }

      daysGrid.appendChild(dayEl);
    }

    monthEl.appendChild(daysGrid);
    container.appendChild(monthEl);
  });
}


