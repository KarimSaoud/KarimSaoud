import assert from "node:assert/strict";
import test from "node:test";

import { getAssetsTotal, getEconomicTotals, getFamilyNeedWarnings } from "../lib/calculations";
import { mockProfile } from "../data/mock-profile";

test("getEconomicTotals computes annual availability from income and expenses", () => {
  const profile = {
    ...mockProfile,
    economicResources: {
      ...mockProfile.economicResources,
      clientIncome: 40000,
      partnerIncome: 10000,
      otherIncome: 5000,
      ordinaryExpenses: 25000,
      financialCommitments: 3000,
      loansMortgages: 7000
    }
  };

  assert.deepEqual(getEconomicTotals(profile), {
    totalIncome: 55000,
    totalExpenses: 35000,
    annualSavings: 20000,
    annualAvailability: 20000
  });
});

test("getAssetsTotal includes liquidity, financial assets and property values", () => {
  const profile = {
    ...mockProfile,
    assets: {
      ...mockProfile.assets,
      liquidity: 10000,
      financialAssets: 20000,
      properties: [
        { id: "home", label: "Casa", value: 150000 },
        { id: "garage", label: "Garage", value: 20000 }
      ]
    }
  };

  assert.equal(getAssetsTotal(profile), 200000);
});

test("getFamilyNeedWarnings flags negative annual availability", () => {
  const profile = {
    ...mockProfile,
    clientFamily: {
      ...mockProfile.clientFamily,
      hasChildren: true
    },
    economicResources: {
      ...mockProfile.economicResources,
      clientIncome: 10000,
      partnerIncome: 0,
      otherIncome: 0,
      ordinaryExpenses: 12000,
      financialCommitments: 2000,
      loansMortgages: 1000
    }
  };

  const warnings = getFamilyNeedWarnings(profile);
  assert.equal(warnings.length, 3);
  assert.match(warnings[0], /uscite superano le entrate/i);
  assert.match(warnings[2], /figli/i);
});
