import { ClientProfile } from "@/types/profile";

export function getEconomicTotals(profile: ClientProfile) {
  const income =
    profile.economicResources.clientIncome +
    profile.economicResources.partnerIncome +
    profile.economicResources.otherIncome;
  const expenses =
    profile.economicResources.ordinaryExpenses +
    profile.economicResources.financialCommitments +
    profile.economicResources.loansMortgages;
  const annualSavings = income - expenses;
  return {
    totalIncome: income,
    totalExpenses: expenses,
    annualSavings,
    annualAvailability: annualSavings,
  };
}

export function getAssetsTotal(profile: ClientProfile) {
  return (
    profile.assets.liquidity +
    profile.assets.financialAssets +
    profile.assets.properties.reduce((sum, item) => sum + item.value, 0)
  );
}

export function getFamilyNeedWarnings(profile: ClientProfile) {
  const totals = getEconomicTotals(profile);
  const warnings: string[] = [];
  if (totals.totalExpenses > totals.totalIncome) {
    warnings.push("Le uscite superano le entrate: serve revisione del bilancio familiare.");
  }
  if (totals.annualAvailability <= 0) {
    warnings.push("Disponibilità annua nulla o negativa: verificare sostenibilità di risparmio e previdenza.");
  }
  if (profile.clientFamily.hasChildren) {
    warnings.push("Presenza di figli: priorità elevata su protezione e obiettivi futuri.");
  }
  return warnings;
}

function countFilled(values: Array<string | number | boolean | null>) {
  return values.filter((item) => {
    if (typeof item === "number") return item > 0;
    if (typeof item === "boolean") return true;
    return Boolean(item);
  }).length;
}

export function getStepCompletion(profile: ClientProfile, stepId: number) {
  switch (stepId) {
    case 1: {
      const base = [
        profile.clientFamily.firstName,
        profile.clientFamily.lastName,
        profile.clientFamily.birthDate,
        profile.clientFamily.profession,
        profile.clientFamily.workSector,
        profile.clientFamily.householdComposition,
        profile.clientFamily.concerns,
      ];
      const extra = profile.clientFamily.hasPartner ? [profile.clientFamily.partner.fullName] : [];
      return Math.round(((countFilled([...base, ...extra]) / (base.length + extra.length || 1)) * 100));
    }
    case 2:
      return profile.lifeProjects.projects.length ? 100 : 40;
    case 3: {
      const total = countFilled([
        profile.economicResources.clientIncome,
        profile.economicResources.ordinaryExpenses,
        profile.economicResources.familyExpenseSplit,
        profile.economicResources.incomeTrend,
      ]);
      return Math.round((total / 4) * 100);
    }
    case 4:
      return Math.round(
        (countFilled([profile.assets.liquidity, profile.assets.financialAssets]) / 2) * 100,
      );
    case 5:
      return Math.round(
        (countFilled([
          profile.financialProfile.riskTolerance,
          profile.financialProfile.timeHorizon,
          profile.financialProfile.lossCapacity,
          profile.financialProfile.knowledgeExperience,
          profile.financialProfile.esgPreference,
        ]) /
          5) *
          100,
      );
    case 6: {
      const needStates = [
        profile.familyNeeds.protection.status,
        profile.familyNeeds.saving.status,
        profile.familyNeeds.investment.status,
        profile.familyNeeds.retirement.status,
      ];
      return Math.round((countFilled(needStates) / 4) * 100);
    }
    case 7:
      return Math.round(
        (countFilled([
          profile.finalSummary.clientPriorities.join(","),
          profile.finalSummary.consultantNotes,
        ]) /
          2) *
          100,
      );
    case 8:
      return Math.min(100, profile.notesReferences.notes.length * 50 + profile.notesReferences.references.length * 50);
    case 9:
      return 100;
    default:
      return 0;
  }
}

export function getOverallCompletion(profile: ClientProfile) {
  const values = Array.from({ length: 9 }, (_, index) => getStepCompletion(profile, index + 1));
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

export function getCompletenessBadge(percentage: number) {
  if (percentage >= 85) return { label: "Pronto", tone: "emerald" };
  if (percentage >= 55) return { label: "In corso", tone: "amber" };
  return { label: "Da completare", tone: "rose" };
}

export function getMissingFieldsForStep(profile: ClientProfile, stepId: number) {
  const missing: string[] = [];

  if (stepId === 1) {
    if (!profile.clientFamily.firstName) missing.push("Nome cliente");
    if (!profile.clientFamily.lastName) missing.push("Cognome cliente");
    if (!profile.clientFamily.profession) missing.push("Professione");
    if (!profile.clientFamily.workSector) missing.push("Settore lavorativo");
    if (!profile.clientFamily.householdComposition) missing.push("Composizione nucleo");
    if (profile.clientFamily.hasPartner && !profile.clientFamily.partner.fullName) missing.push("Dati partner");
    if (profile.clientFamily.hasChildren && profile.clientFamily.children.length === 0) missing.push("Dati figli");
  }

  if (stepId === 2 && profile.lifeProjects.projects.length === 0) {
    missing.push("Almeno un progetto di vita");
  }

  if (stepId === 3) {
    if (!profile.economicResources.clientIncome) missing.push("Entrate cliente");
    if (!profile.economicResources.ordinaryExpenses) missing.push("Uscite ordinarie");
    if (!profile.economicResources.familyExpenseSplit) missing.push("Ripartizione spese");
  }

  if (stepId === 4) {
    if (!profile.assets.liquidity) missing.push("Liquidità");
    if (!profile.assets.financialAssets) missing.push("Attività finanziarie");
  }

  if (stepId === 5) {
    if (!profile.financialProfile.timeHorizon) missing.push("Orizzonte temporale");
    if (!profile.financialProfile.lossCapacity) missing.push("Capacità di sostenere perdite");
    if (!profile.financialProfile.knowledgeExperience) missing.push("Conoscenza ed esperienza");
  }

  if (stepId === 6) {
    for (const [label, area] of [
      ["Protezione", profile.familyNeeds.protection],
      ["Risparmio", profile.familyNeeds.saving],
      ["Investimento", profile.familyNeeds.investment],
      ["Previdenza", profile.familyNeeds.retirement],
    ] as const) {
      if (area.status === "non-analizzato") missing.push(`${label} da analizzare`);
    }
  }

  if (stepId === 7) {
    if (!profile.finalSummary.clientPriorities.length) missing.push("Priorità cliente");
    if (!profile.finalSummary.consultantNotes) missing.push("Note finali consulente");
  }

  if (stepId === 8) {
    if (!profile.notesReferences.notes.length) missing.push("Note di sezione");
    if (!profile.notesReferences.references.length) missing.push("Referenze/prospect");
  }

  return missing;
}
