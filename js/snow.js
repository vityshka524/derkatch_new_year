document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("snow");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  let width, height;
  let snowflakes = [];

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  window.addEventListener("resize", resize);
  resize();

  function createSnowflakes(count) {
    snowflakes = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 3 + 1,
      speed: Math.random() * 1 + 0.5,
      wind: Math.random() * 0.5 - 0.25
    }));
  }

  createSnowflakes(200);

  function update() {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "rgba(255,255,255,0.8)";
    ctx.beginPath();

    snowflakes.forEach(flake => {
      flake.y += flake.speed;
      flake.x += flake.wind;

      if (flake.y > height) {
        flake.y = -flake.radius;
        flake.x = Math.random() * width;
      }

      ctx.moveTo(flake.x, flake.y);
      ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
    });

    ctx.fill();
    requestAnimationFrame(update);
  }

  update();
});
