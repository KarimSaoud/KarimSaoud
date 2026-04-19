export function getTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

export function calculateAgeFromBirthDate(birthDate: string, today = new Date()) {
  if (!birthDate) {
    return null;
  }

  const birth = new Date(`${birthDate}T12:00:00`);
  if (Number.isNaN(birth.getTime())) {
    return null;
  }

  let age = today.getFullYear() - birth.getFullYear();
  const hasHadBirthdayThisYear =
    today.getMonth() > birth.getMonth() ||
    (today.getMonth() === birth.getMonth() && today.getDate() >= birth.getDate());

  if (!hasHadBirthdayThisYear) {
    age -= 1;
  }

  return age >= 0 ? age : null;
}

export function formatFullDate(dateKey: string) {
  return new Intl.DateTimeFormat("it-IT", {
    weekday: "long",
    day: "numeric",
    month: "long"
  }).format(new Date(`${dateKey}T12:00:00`));
}

export function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("it-IT", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

export function getLastNDays(count: number, fromDate = new Date()) {
  return Array.from({ length: count }, (_, index) => {
    const current = new Date(fromDate);
    current.setDate(current.getDate() - index);
    return current.toISOString().slice(0, 10);
  }).reverse();
}
