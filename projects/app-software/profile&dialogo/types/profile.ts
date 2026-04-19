export type CivilStatus = "single" | "married" | "cohabiting" | "separated" | "widowed";
export type PriorityLevel = "alta" | "media" | "bassa";
export type NeedState = "non-analizzato" | "si" | "no";
export type RiskTolerance = "prudente" | "equilibrato" | "dinamico";

export interface PartnerProfile {
  fullName: string;
  profession: string;
  annualIncome: number;
}

export interface ChildProfile {
  id: string;
  name: string;
  birthYear: string;
  note: string;
}

export interface LifeProject {
  id: string;
  title: string;
  projectType: string;
  targetDate: string;
  estimatedCost: number;
  priority: PriorityLevel;
  note: string;
}

export interface PropertyAsset {
  id: string;
  label: string;
  value: number;
}

export interface NeedArea<T> {
  interested: boolean | null;
  status: NeedState;
  notes: string;
  indicators: string[];
  details: T;
}

export interface ProtectionDetails {
  premorienza: boolean;
  invaliditaPermanente: boolean;
  inabilitaTemporanea: boolean;
  cureMediche: boolean;
  nonAutosufficienza: boolean;
  danniTerzi: boolean;
  danniAbitazione: boolean;
  perditaLavoro: boolean;
  assistenzaSoccorso: boolean;
}

export interface SavingDetails {
  annualAmount: number;
  goal: string;
}

export interface InvestmentDetails {
  investableLiquidity: number;
  reallocableAssets: number;
  proposedAmount: number;
  goal: string;
}

export interface RetirementDetails {
  pensionSituation: string;
  existingPlan: string;
  perceivedGap: string;
  interestedInIntegration: boolean | null;
}

export interface SectionNote {
  id: string;
  section: string;
  note: string;
  tag: string;
  createdAt: string;
}

export interface ReferenceContact {
  id: string;
  name: string;
  relationship: string;
  tag: string;
  createdAt: string;
}

export interface ClientProfile {
  clientFamily: {
    firstName: string;
    lastName: string;
    birthDate: string;
    email: string;
    phone: string;
    civilStatus: CivilStatus;
    profession: string;
    workSector: string;
    householdComposition: string;
    hasPartner: boolean;
    partner: PartnerProfile;
    hasChildren: boolean;
    children: ChildProfile[];
    otherFamilyMembers: string;
    pets: string;
    hobbies: string;
    concerns: string;
  };
  lifeProjects: {
    projects: LifeProject[];
  };
  economicResources: {
    clientIncome: number;
    partnerIncome: number;
    otherIncome: number;
    incomeTrend: string;
    ordinaryExpenses: number;
    financialCommitments: number;
    loansMortgages: number;
    familyExpenseSplit: string;
  };
  assets: {
    liquidity: number;
    financialAssets: number;
    properties: PropertyAsset[];
  };
  financialProfile: {
    riskTolerance: RiskTolerance;
    timeHorizon: string;
    lossCapacity: string;
    knowledgeExperience: string;
    esgPreference: string;
  };
  familyNeeds: {
    protection: NeedArea<ProtectionDetails>;
    saving: NeedArea<SavingDetails>;
    investment: NeedArea<InvestmentDetails>;
    retirement: NeedArea<RetirementDetails>;
  };
  finalSummary: {
    clientPriorities: string[];
    consultantNotes: string;
  };
  notesReferences: {
    notes: SectionNote[];
    references: ReferenceContact[];
  };
}

export interface StepDefinition {
  id: number;
  title: string;
  description: string;
}
