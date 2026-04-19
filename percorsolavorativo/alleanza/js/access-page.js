const ACCESS_STORAGE_KEY = "karimsaoud_dashboard_access";

export function initAccessPage() {
  const codeForm = document.querySelector("[data-code-form]");

  const protectedDashboard = document.querySelector("[data-dashboard-protected]");

  if (protectedDashboard && sessionStorage.getItem(ACCESS_STORAGE_KEY) !== "granted") {
    window.location.replace("accesso.html");
    return;
  }

  if (!codeForm) {
    return;
  }

  const codeInput = codeForm.querySelector(".code-input");
  const feedback = document.querySelector("[data-access-feedback]");

  codeForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const value = codeInput instanceof HTMLInputElement ? codeInput.value.trim() : "";
    const isValid = /^\d{5}$/.test(value);

    if (!isValid) {
      if (feedback) {
        feedback.textContent = "Inserisci un codice numerico di 5 cifre.";
      }
      codeInput?.focus();
      codeInput?.select();
      return;
    }

    sessionStorage.setItem(ACCESS_STORAGE_KEY, "granted");
    window.location.href = "pianifica-il-tuo-futuro.html";
  });
}
