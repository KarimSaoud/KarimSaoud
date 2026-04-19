import { ClientProfile } from "@/types/profile";

export const mockProfile: ClientProfile = {
  clientFamily: {
    firstName: "Marco",
    lastName: "Rinaldi",
    birthDate: "1984-06-17",
    email: "marco.rinaldi@email.it",
    phone: "+39 333 1234567",
    civilStatus: "married",
    profession: "Libero professionista",
    workSector: "Consulenza IT",
    householdComposition: "Coppia con due figli",
    hasPartner: true,
    partner: {
      fullName: "Sara Conti",
      profession: "Architetto",
      annualIncome: 38000,
    },
    hasChildren: true,
    children: [
      { id: "c1", name: "Luca", birthYear: "2015", note: "Scuola primaria" },
      { id: "c2", name: "Giulia", birthYear: "2018", note: "Asilo bilingue" },
    ],
    otherFamilyMembers: "Madre anziana da supportare nel medio periodo",
    pets: "1 cane",
    hobbies: "Tennis, trekking, viaggi con la famiglia",
    concerns: "Tutela della famiglia, stabilità del reddito, pensione futura",
  },
  lifeProjects: {
    projects: [
      {
        id: "p1",
        title: "Università figli",
        projectType: "Istruzione",
        targetDate: "2033-09-01",
        estimatedCost: 80000,
        priority: "alta",
        note: "Piano graduale, possibilità estero",
      },
      {
        id: "p2",
        title: "Seconda casa al mare",
        projectType: "Acquisto immobiliare",
        targetDate: "2030-06-01",
        estimatedCost: 220000,
        priority: "media",
        note: "Valutare uso personale e locazione breve",
      },
    ],
  },
  economicResources: {
    clientIncome: 62000,
    partnerIncome: 38000,
    otherIncome: 6000,
    incomeTrend: "Stabile con lieve crescita",
    ordinaryExpenses: 54000,
    financialCommitments: 8400,
    loansMortgages: 12600,
    familyExpenseSplit: "60% cliente, 40% partner",
  },
  assets: {
    liquidity: 45000,
    financialAssets: 120000,
    properties: [
      { id: "a1", label: "Abitazione principale", value: 310000 },
      { id: "a2", label: "Box auto", value: 28000 },
    ],
  },
  financialProfile: {
    riskTolerance: "equilibrato",
    timeHorizon: "7-10 anni",
    lossCapacity: "Media",
    knowledgeExperience: "Buona conoscenza di fondi, ETF e polizze investimento",
    esgPreference: "Interesse moderato verso soluzioni ESG con impatto tangibile",
  },
  familyNeeds: {
    protection: {
      interested: true,
      status: "si",
      notes: "Focus su tutela reddito, salute e protezione casa.",
      indicators: ["Famiglia con 2 figli", "Reddito principale autonomo", "Mutuo attivo"],
      details: {
        premorienza: true,
        invaliditaPermanente: true,
        inabilitaTemporanea: true,
        cureMediche: true,
        nonAutosufficienza: false,
        danniTerzi: true,
        danniAbitazione: true,
        perditaLavoro: false,
        assistenzaSoccorso: true,
      },
    },
    saving: {
      interested: true,
      status: "si",
      notes: "Importo ricorrente sostenibile collegato a obiettivi educativi.",
      indicators: ["Capacità di risparmio positiva", "Obiettivo figli definito"],
      details: {
        annualAmount: 12000,
        goal: "Accantonamento per istruzione e riserva opportunità",
      },
    },
    investment: {
      interested: true,
      status: "si",
      notes: "Valutare riallocazione di parte della liquidità ferma.",
      indicators: ["Liquidità elevata", "Profilo equilibrato"],
      details: {
        investableLiquidity: 25000,
        reallocableAssets: 30000,
        proposedAmount: 40000,
        goal: "Crescita del capitale di medio-lungo periodo",
      },
    },
    retirement: {
      interested: true,
      status: "si",
      notes: "Percepisce gap previdenziale e vuole agire gradualmente.",
      indicators: ["Lavoratore autonomo", "Gap pensionistico percepito"],
      details: {
        pensionSituation: "Contributi regolari ma proiezione futura incerta",
        existingPlan: "PIC assicurativo avviato nel 2021",
        perceivedGap: "Medio-alto",
        interestedInIntegration: true,
      },
    },
  },
  finalSummary: {
    clientPriorities: ["Proteggere il reddito", "Pianificare istruzione figli", "Costruire integrazione pensione"],
    consultantNotes: "Cliente collaborativo, orientato a soluzioni semplici ma ben motivate.",
  },
  notesReferences: {
    notes: [
      {
        id: "n1",
        section: "Cliente e famiglia",
        note: "Forte attenzione alla serenità familiare e agli imprevisti di salute.",
        tag: "profilazione",
        createdAt: "2026-04-18",
      },
    ],
    references: [
      {
        id: "r1",
        name: "Alessandro Verdi",
        relationship: "Collega del cliente",
        tag: "prospect investimento",
        createdAt: "2026-04-18",
      },
    ],
  },
};
