document.querySelectorAll(".stepper").forEach((stepper) => {
  const options = JSON.parse(stepper.dataset.options || "[]");
  if (!options.length) return;

  const value = stepper.querySelector(".stepper-value");
  const buttons = stepper.querySelectorAll(".stepper-button");
  let index = options.indexOf(value?.textContent?.trim() || "");

  if (index < 0) index = 0;
  if (value) value.textContent = options[index];

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const step = Number(button.dataset.step || 0);
      index = (index + step + options.length) % options.length;
      if (value) value.textContent = options[index];
    });
  });
});
