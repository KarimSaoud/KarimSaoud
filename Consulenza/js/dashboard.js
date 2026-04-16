import { DASHBOARD_DEFINITIONS, PALETTE, START_YEAR, TOTAL_YEARS } from "./dashboard-config.js";
import { drawChart } from "./dashboard-charts.js";

function createCurrencyFormatter() {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  });
}

function collectVoices(form, valueName, labelName) {
  const values = Array.from(form?.querySelectorAll(`[name="${valueName}"]`) || []);
  const labels = Array.from(form?.querySelectorAll(`[name="${labelName}"]`) || []);
  return values.map((input, index) => ({
    name: labels[index]?.value?.trim() || `Voce ${index + 1}`,
    value: Number(input.value || 0),
  }));
}

function createYearSeries(years, builder) {
  const series = [];
  for (let year = 0; year <= years; year += 1) {
    series.push(builder(year, START_YEAR + year));
  }
  return series;
}

function buildGenericSeries(form, config) {
  const groupedVoices = config.groups.map((group) => ({
    ...group,
    voices: collectVoices(form, group.valueName, group.labelName),
  }));

  const lines = groupedVoices.flatMap((group, groupIndex) =>
    group.voices.map((voice, voiceIndex) => ({
      key: `${group.prefix}_${voiceIndex}`,
      label: voice.name,
      color: PALETTE[(groupIndex * 2 + voiceIndex) % PALETTE.length],
    }))
  );

  const series = createYearSeries(TOTAL_YEARS, (yearIndex, labelYear) => {
    const point = { label: String(labelYear), [config.resultKey]: 0 };

    groupedVoices.forEach((group) => {
      group.voices.forEach((voice, voiceIndex) => {
        let value = voice.value;

        if (group.annualGrowth) {
          value = Math.max(0, value * (1 + group.annualGrowth * yearIndex));
        } else {
          value *= Math.abs(group.multiplier ?? 1) * yearIndex;
        }

        point[`${group.prefix}_${voiceIndex}`] = value;

        if (!group.annualGrowth) {
          point[config.resultKey] += value * Math.sign(group.multiplier ?? 1);
        } else {
          point[config.resultKey] += value;
        }
      });
    });

    return point;
  });

  return { lines, series };
}

function buildInvestmentSeries(form) {
  const initialVoices = collectVoices(form, "initialCapital", "initialCapitalLabel");
  const monthlyVoices = collectVoices(form, "monthlyContribution", "monthlyContributionLabel");
  const annualVoices = collectVoices(form, "annualContribution", "annualContributionLabel");
  const annualReturn = Number(form?.elements.namedItem("annualReturn")?.value || 0);
  const managementFee = Number(form?.elements.namedItem("managementFee")?.value || 0);
  const managementFeeFrequency = form?.elements.namedItem("managementFeeFrequency")?.value || "annual";
  const monthlyRate = annualReturn / 100 / 12;
  const monthlyFeeRate = managementFeeFrequency === "monthly" ? managementFee / 100 : managementFee / 100 / 12;

  const lines = [
    ...initialVoices.map((voice, index) => ({
      key: `initial_${index}`,
      label: voice.name,
      color: PALETTE[index % PALETTE.length],
    })),
    ...monthlyVoices.map((voice, index) => ({
      key: `monthly_${index}`,
      label: voice.name,
      color: PALETTE[(index + 2) % PALETTE.length],
    })),
    ...annualVoices.map((voice, index) => ({
      key: `annual_${index}`,
      label: voice.name,
      color: PALETTE[(index + 4) % PALETTE.length],
    })),
  ];

  const initialBuckets = initialVoices.map((voice) => voice.value);
  const monthlyBuckets = monthlyVoices.map(() => 0);
  const annualBuckets = annualVoices.map(() => 0);
  const totalMonths = TOTAL_YEARS * 12;
  const series = [];

  for (let month = 0; month <= totalMonths; month += 1) {
    if (month > 0) {
      initialBuckets.forEach((value, index) => {
        initialBuckets[index] = value * (1 + monthlyRate) * (1 - monthlyFeeRate);
      });

      monthlyBuckets.forEach((_value, index) => {
        monthlyBuckets[index] = monthlyBuckets[index] * (1 + monthlyRate) * (1 - monthlyFeeRate);
        monthlyBuckets[index] += monthlyVoices[index].value;
      });

      annualBuckets.forEach((_value, index) => {
        annualBuckets[index] = annualBuckets[index] * (1 + monthlyRate) * (1 - monthlyFeeRate);
        if (month % 12 === 0) {
          annualBuckets[index] += annualVoices[index].value;
        }
      });
    }

    if (month % 12 === 0 || month === totalMonths) {
      const point = { label: String(START_YEAR + month / 12), portfolio: 0 };

      initialBuckets.forEach((value, index) => {
        point[`initial_${index}`] = value;
        point.portfolio += value;
      });

      monthlyBuckets.forEach((value, index) => {
        point[`monthly_${index}`] = value;
        point.portfolio += value;
      });

      annualBuckets.forEach((value, index) => {
        point[`annual_${index}`] = value;
        point.portfolio += value;
      });

      series.push(point);
    }
  }

  return { lines, series };
}

function updateLegend(card, lines) {
  const legend = card.querySelector(".chart-legend");
  if (!legend) {
    return;
  }

  legend.classList.add("dynamic");
  legend.innerHTML = lines
    .map((line) => `<span><i style="background:${line.color}"></i>${line.label}</span>`)
    .join("");
}

function syncBounds(state) {
  const maxStart = Math.max(0, state.series.length - state.visiblePoints);
  state.viewStartIndex = Math.min(Math.max(0, state.viewStartIndex), maxStart);
}

function buildCardData(key, form) {
  if (key === "investment") {
    return buildInvestmentSeries(form);
  }
  return buildGenericSeries(form, DASHBOARD_DEFINITIONS[key]);
}

function buildResult(key, series, currencyFormatter) {
  const config = DASHBOARD_DEFINITIONS[key];
  const resultKey = key === "investment" ? "portfolio" : config.resultKey;
  return currencyFormatter.format(series[series.length - 1]?.[resultKey] ?? 0);
}

function appendVoiceRow(form, voiceType) {
  const container = form.querySelector(`[data-voice-list="${voiceType}"]`);
  if (!(container instanceof HTMLElement)) {
    return;
  }

  const sampleValue = container.querySelector(`[name="${voiceType}"]`);
  const sampleLabel = container.querySelector(`[name="${voiceType}Label"]`);
  const min = sampleValue instanceof HTMLInputElement ? sampleValue.min : "0";
  const step = sampleValue instanceof HTMLInputElement ? sampleValue.step : "1";
  const placeholder = sampleLabel instanceof HTMLInputElement ? sampleLabel.placeholder : "Nome voce";

  const row = document.createElement("div");
  row.className = "voice-row";
  row.innerHTML = `
    <input class="voice-label" type="text" name="${voiceType}Label" value="" placeholder="${placeholder}" />
    <div class="input-wrap"><span>€</span><input type="number" name="${voiceType}" min="${min}" step="${step}" value="0" /></div>
  `;
  container.appendChild(row);
}

export function initDashboard() {
  const dashboardCards = document.querySelectorAll("[data-chart-card]");
  if (dashboardCards.length === 0) {
    return;
  }

  const currencyFormatter = createCurrencyFormatter();
  const chartStates = new Map();

  const updateCard = (card) => {
    const key = card.dataset.chartCard;
    const form = card.querySelector("[data-form]");
    const canvas = card.querySelector("canvas");
    const result = card.querySelector("[data-result]");
    const built = buildCardData(key, form);
    const state = chartStates.get(key);

    state.series = built.series;
    state.lines = built.lines;
    state.visiblePoints = Math.min(Math.max(4, state.visiblePoints), built.series.length);
    if (built.series.length - state.visiblePoints <= 1) {
      state.visiblePoints = built.series.length;
      state.viewStartIndex = 0;
    }

    syncBounds(state);
    if (result) {
      result.textContent = buildResult(key, built.series, currencyFormatter);
    }
    updateLegend(card, built.lines);
    if (canvas instanceof HTMLCanvasElement) {
      drawChart({ canvas, state, currencyFormatter });
    }
  };

  dashboardCards.forEach((card) => {
    const key = card.dataset.chartCard;
    const canvas = card.querySelector("canvas");
    const form = card.querySelector("[data-form]");
    const state = {
      series: [],
      lines: [],
      visiblePoints: 12,
      viewStartIndex: 0,
      dragging: false,
      dragStartX: 0,
      dragStartIndex: 0,
    };

    chartStates.set(key, state);

    form?.addEventListener("input", () => updateCard(card));
    form?.addEventListener("change", () => updateCard(card));
    form?.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) {
        return;
      }

      const button = target.closest("[data-add-voice]");
      if (!(button instanceof HTMLElement)) {
        return;
      }

      appendVoiceRow(form, button.getAttribute("data-add-voice"));
      updateCard(card);
    });

    canvas?.addEventListener("wheel", (event) => {
      event.preventDefault();
      if (event.deltaY < 0) {
        state.visiblePoints = Math.max(4, Math.floor(state.visiblePoints * 0.75));
      } else {
        state.visiblePoints = Math.min(state.series.length, Math.ceil(state.visiblePoints * 1.35));
      }

      if (state.series.length - state.visiblePoints <= 1) {
        state.visiblePoints = state.series.length;
        state.viewStartIndex = 0;
      }

      syncBounds(state);
      updateCard(card);
    });

    canvas?.addEventListener("pointerdown", (event) => {
      state.dragging = true;
      state.dragStartX = event.clientX;
      state.dragStartIndex = state.viewStartIndex;
      canvas.classList.add("is-dragging");
    });

    window.addEventListener("pointermove", (event) => {
      if (!state.dragging || !canvas) {
        return;
      }
      const deltaX = event.clientX - state.dragStartX;
      const pointsToMove = Math.round((-deltaX / canvas.clientWidth) * state.visiblePoints);
      state.viewStartIndex = state.dragStartIndex + pointsToMove;
      syncBounds(state);
      updateCard(card);
    });

    window.addEventListener("pointerup", () => {
      state.dragging = false;
      canvas?.classList.remove("is-dragging");
    });

    updateCard(card);
  });
}
