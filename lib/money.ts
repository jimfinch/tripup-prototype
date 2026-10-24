// Money is stored as integer pence everywhere; only format at the edge.

export type Pence = number;

const GBP = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const formatPence = (pence: Pence) => GBP.format(pence / 100);

export const sumPence = (values: Pence[]) => values.reduce((a, b) => a + b, 0);
