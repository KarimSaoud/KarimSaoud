"use client";

import { StepSidebar } from "@/components/layout/step-sidebar";
import { StepActions } from "@/components/layout/step-actions";
import { ClientFamilyStep } from "@/components/steps/client-family-step";
import { LifeProjectsStep } from "@/components/steps/life-projects-step";
import { EconomicResourcesStep } from "@/components/steps/economic-resources-step";
import { AssetsStep } from "@/components/steps/assets-step";
import { FinancialProfileStep } from "@/components/steps/financial-profile-step";
import { FamilyNeedsStep } from "@/components/steps/family-needs-step";
import { FinalSummaryStep } from "@/components/steps/final-summary-step";
import { NotesReferencesStep } from "@/components/steps/notes-references-step";
import { ReportStep } from "@/components/steps/report-step";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { stepDefinitions } from "@/lib/steps";
import { getOverallCompletion, getStepCompletion, getEconomicTotals, getMissingFieldsForStep } from "@/lib/calculations";
import { formatCurrency } from "@/lib/format";
import { useProfileStore } from "@/store/profile-store";

export function ConsultingProfilerApp() {
  const profile = useProfileStore((state) => state.profile);
  const currentStep = useProfileStore((state) => state.currentStep);
  const setCurrentStep = useProfileStore((state) => state.setCurrentStep);
  const nextStep = useProfileStore((state) => state.nextStep);
  const previousStep = useProfileStore((state) => state.previousStep);
  const resetDraft = useProfileStore((state) => state.resetDraft);

  const currentDefinition = stepDefinitions.find((step) => step.id === currentStep)!;
  const overallCompletion = getOverallCompletion(profile);
  const currentCompletion = getStepCompletion(profile, currentStep);
  const missingFields = getMissingFieldsForStep(profile, currentStep);
  const totals = getEconomicTotals(profile);
  const dialogoHints: Record<number, string> = {
    1: "Apri la conversazione su famiglia, stile di vita, interessi e preoccupazioni: qui nasce la relazione consulenziale.",
    2: "Trasforma i progetti in una timeline: costo, orizzonte e priorità rendono concreta la pianificazione.",
    3: "Usa entrate, uscite e disponibilità per misurare sostenibilità reale prima di parlare di soluzioni.",
    4: "Distingui liquidità, attività finanziarie e immobili: il patrimonio deve diventare leggibile al cliente.",
    5: "Collega rischio, orizzonte, esperienza ed ESG alla coerenza delle scelte future.",
    6: "Esplora protezione, risparmio, investimento e previdenza come bisogni, non come prodotti.",
    7: "Chiudi il profilo con poche priorità condivise e una lettura consulenziale comprensibile.",
    8: "Registra note e referenze mentre il dialogo e fresco: sono informazioni operative per il follow-up.",
    9: "Il report deve poter essere letto dal cliente senza spiegazioni tecniche: chiaro, ordinato, firmabile.",
  };

  const activeStep = (() => {
    switch (currentStep) {
      case 1:
        return <ClientFamilyStep />;
      case 2:
        return <LifeProjectsStep />;
      case 3:
        return <EconomicResourcesStep />;
      case 4:
        return <AssetsStep />;
      case 5:
        return <FinancialProfileStep />;
      case 6:
        return <FamilyNeedsStep />;
      case 7:
        return <FinalSummaryStep />;
      case 8:
        return <NotesReferencesStep />;
      case 9:
        return <ReportStep />;
      default:
        return null;
    }
  })();

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,_#0C2752_0%,_#5899C3_100%)] px-4 py-6 md:px-6 lg:px-8">
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-[32px] border border-[rgba(255,255,255,0.24)] bg-[linear-gradient(120deg,_rgba(12,39,82,0.96)_0%,_rgba(88,153,195,0.84)_100%)] p-5 shadow-panel backdrop-blur">
          <div>
            <p className="text-xs uppercase tracking-[0.26em] text-[rgba(255,255,255,0.72)]">Profilo & Dialogo 2.0 MVP</p>
            <h1 className="mt-2 text-3xl font-semibold text-[#FFFFFF]">Journey guidato dalla conoscenza al report</h1>
            <p className="mt-2 max-w-3xl text-sm text-[rgba(255,255,255,0.84)]">Un percorso consulenziale centrato su cliente, famiglia, progetti, risorse e bisogni: raccolta progressiva, sintesi visuale, warning e report finale.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Badge tone="blue">Autosave attivo</Badge>
            <Badge tone={totals.annualAvailability >= 0 ? "emerald" : "rose"}>
              Disponibilità {formatCurrency(totals.annualAvailability)}
            </Badge>
            <Button variant="secondary" onClick={() => resetDraft()}>Reset bozza</Button>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
          <StepSidebar />
          <main className="min-w-0">
            <div className="rounded-[32px] border border-[rgba(255,255,255,0.32)] bg-[#FFFFFF] p-6 shadow-panel backdrop-blur">
              <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#5899C3]">Step {currentDefinition.id}</p>
                  <h2 className="mt-2 text-3xl font-semibold text-[#0C2752]">{currentDefinition.title}</h2>
                  <p className="mt-2 text-sm text-[rgba(12,39,82,0.72)]">{currentDefinition.description}</p>
                </div>
                <div className="w-full max-w-[320px] rounded-[28px] border border-[rgba(88,153,195,0.4)] bg-[rgba(88,153,195,0.08)] p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm text-[rgba(12,39,82,0.72)]">Completezza step</span>
                    <span className="text-sm font-semibold text-[#0C2752]">{currentCompletion}%</span>
                  </div>
                  <Progress value={currentCompletion} />
                  <div className="mt-4 flex items-center justify-between text-sm">
                    <span className="text-[rgba(12,39,82,0.72)]">Dossier totale</span>
                    <span className="font-semibold text-[#0C2752]">{overallCompletion}%</span>
                  </div>
                </div>
              </div>

              <div className="mb-6 grid gap-3 lg:grid-cols-[minmax(0,1fr)_320px]">
                <div className="rounded-[24px] border border-[rgba(220,110,45,0.35)] bg-[rgba(237,130,50,0.12)] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#DC6E2D]">Dialogo</p>
                  <p className="mt-2 text-sm leading-6 text-[#0C2752]">{dialogoHints[currentStep]}</p>
                </div>
                <div className="rounded-[24px] border border-[rgba(88,153,195,0.35)] bg-[rgba(88,153,195,0.08)] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#5899C3]">Dati mancanti</p>
                  {missingFields.length ? (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {missingFields.slice(0, 4).map((field) => (
                        <Badge key={field} tone="amber">{field}</Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-2 text-sm text-[#0C2752]">Step pronto per la sintesi consulenziale.</p>
                  )}
                </div>
              </div>

              {activeStep}

              <StepActions
                onPrev={() => previousStep()}
                onNext={() => (currentStep === 9 ? setCurrentStep(1) : nextStep())}
                disablePrev={currentStep === 1}
                nextLabel={currentStep === 9 ? "Torna all'inizio" : "Salva e continua"}
              />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
