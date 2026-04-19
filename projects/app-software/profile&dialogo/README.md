# Profilazione Cliente Premium

MVP Next.js per consulenti finanziari e assicurativi, progettato come wizard multistep con sidebar fissa, salvataggio automatico in bozza, calcoli consulenziali live e report finale stampabile.

## Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui style components
- Zustand con persistenza `localStorage`

## Struttura

- `app/`: shell Next.js, pagina principale e stili globali
- `components/layout/`: shell applicativa, sidebar, azioni step
- `components/steps/`: componenti separati per i 9 step del wizard
- `components/ui/`: primitive UI riutilizzabili
- `store/`: stato globale e autosave
- `types/`: modello dati TypeScript
- `lib/`: utilities, formattazioni, steps e calcoli
- `data/`: mock realistici iniziali

## Avvio locale

```bash
npm install
npm run dev
```

Poi apri [http://localhost:3000](http://localhost:3000).

## Note MVP

- Bozza salvata automaticamente in `localStorage`
- Warning quando le uscite superano le entrate
- Calcolo live di entrate, uscite, risparmio annuo e disponibilità annua
- Campi familiari dinamici per partner e figli
- Sezione bisogni con warning sulle aree quando la disponibilità è insufficiente
- Report finale esportabile in PDF tramite stampa browser
