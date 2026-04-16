export const START_YEAR = 1995;
export const TOTAL_YEARS = 105;

export const PALETTE = [
  "#143a6f",
  "#56a7e4",
  "#c7ab79",
  "#7f93b5",
  "#2f5f97",
  "#9db8dd",
  "#b48c4b",
];

export const DASHBOARD_DEFINITIONS = {
  cashflow: {
    resultKey: "net",
    resultLabel: "Saldo finale",
    groups: [
      { valueName: "monthlyIncome", labelName: "monthlyIncomeLabel", multiplier: 12, prefix: "income" },
      { valueName: "monthlyExpenses", labelName: "monthlyExpensesLabel", multiplier: -12, prefix: "expense" },
      { valueName: "annualExpenses", labelName: "annualExpensesLabel", multiplier: -1, prefix: "annual" },
    ],
  },
  protection: {
    resultKey: "coverageTotal",
    resultLabel: "Copertura stimata",
    groups: [
      { valueName: "coverageBase", labelName: "coverageBaseLabel", prefix: "coverage", annualGrowth: 0.018 },
      { valueName: "monthlyPremium", labelName: "monthlyPremiumLabel", prefix: "monthlyPremium", multiplier: 12 },
      { valueName: "annualPremium", labelName: "annualPremiumLabel", prefix: "annualPremium", multiplier: 1 },
    ],
  },
  summary: {
    resultKey: "margin",
    resultLabel: "Margine finale",
    groups: [
      { valueName: "income", labelName: "incomeLabel", multiplier: 12, prefix: "income" },
      { valueName: "expenses", labelName: "expensesLabel", multiplier: -12, prefix: "expense" },
      { valueName: "investmentAllocation", labelName: "investmentAllocationLabel", multiplier: -12, prefix: "allocation" },
    ],
  },
};
