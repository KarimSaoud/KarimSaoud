import {
  BadgeEuro,
  BriefcaseBusiness,
  ClipboardList,
  FileText,
  HeartHandshake,
  Landmark,
  ListChecks,
  Sparkles,
  Users,
  type LucideIcon,
} from "lucide-react";
import { StepDefinition } from "@/types/profile";

export const stepDefinitions: StepDefinition[] = [
  { id: 1, title: "Cliente e famiglia", description: "Quadro personale e nucleo familiare" },
  { id: 2, title: "Progetti di vita", description: "Obiettivi, priorità e timeline" },
  { id: 3, title: "Risorse economiche", description: "Entrate, uscite e capacità di risparmio" },
  { id: 4, title: "Patrimonio", description: "Liquidità, investimenti e immobili" },
  { id: 5, title: "Profilo finanziario", description: "Rischio, orizzonte e conoscenza" },
  { id: 6, title: "Bisogni della famiglia", description: "Protezione, risparmio, investimento, previdenza" },
  { id: 7, title: "Sintesi finale", description: "Visione consulenziale complessiva" },
  { id: 8, title: "Note e referenze", description: "Appunti, prospect e follow-up" },
  { id: 9, title: "Report finale", description: "Output stampabile e condivisibile" },
];

export const stepIcons: Record<number, LucideIcon> = {
  1: Users,
  2: Sparkles,
  3: BadgeEuro,
  4: Landmark,
  5: BriefcaseBusiness,
  6: HeartHandshake,
  7: ClipboardList,
  8: ListChecks,
  9: FileText,
};
