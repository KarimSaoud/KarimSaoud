export function drawChart({ canvas, state, currencyFormatter }) {
  const context = canvas.getContext("2d");
  if (!context || state.series.length === 0 || state.lines.length === 0) {
    return;
  }

  const width = canvas.width;
  const height = canvas.height;
  const padding = { top: 56, right: 24, bottom: 58, left: 72 };
  const visibleSeries = state.series.slice(state.viewStartIndex, state.viewStartIndex + state.visiblePoints);
  const values = state.lines.flatMap((line) => visibleSeries.map((item) => item[line.key] || 0));
  const maxValue = Math.max(1000, ...values);
  const scaleMax = Math.ceil(maxValue / 10000) * 10000 || 1000;
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  const xAt = (index) => padding.left + (chartWidth / Math.max(visibleSeries.length - 1, 1)) * index;
  const yAt = (value) => padding.top + chartHeight - (value / scaleMax) * chartHeight;

  context.clearRect(0, 0, width, height);
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, width, height);

  context.strokeStyle = "rgba(15, 34, 61, 0.08)";
  context.lineWidth = 1;
  for (let i = 0; i <= 4; i += 1) {
    const y = padding.top + (chartHeight / 4) * i;
    context.beginPath();
    context.moveTo(padding.left, y);
    context.lineTo(width - padding.right, y);
    context.stroke();

    const axisValue = scaleMax - (scaleMax / 4) * i;
    context.fillStyle = "rgba(86, 101, 125, 0.95)";
    context.font = '600 12px "Avenir Next", "Segoe UI", sans-serif';
    context.textAlign = "right";
    context.fillText(currencyFormatter.format(axisValue), padding.left - 8, y + 4);
  }

  const maxXAxisLabels = Math.max(4, Math.floor(chartWidth / 88));
  const labelStep = Math.max(1, Math.ceil(visibleSeries.length / maxXAxisLabels));
  visibleSeries.forEach((item, index) => {
    if (index % labelStep !== 0 && index !== visibleSeries.length - 1) {
      return;
    }
    context.fillStyle = "rgba(86, 101, 125, 0.95)";
    context.font = '600 12px "Avenir Next", "Segoe UI", sans-serif';
    context.textAlign = "center";
    context.fillText(item.label, xAt(index), height - 20);
  });

  state.lines.forEach((line) => {
    context.beginPath();
    visibleSeries.forEach((item, index) => {
      const x = xAt(index);
      const y = yAt(item[line.key] || 0);
      if (index === 0) {
        context.moveTo(x, y);
      } else {
        const prevX = xAt(index - 1);
        const prevY = yAt(visibleSeries[index - 1][line.key] || 0);
        const controlX = (prevX + x) / 2;
        context.bezierCurveTo(controlX, prevY, controlX, y, x, y);
      }
    });
    context.strokeStyle = line.color;
    context.lineWidth = 4;
    context.stroke();
  });
}
