export type CurrencyConvertToSelected = {
  [key: string]: CurrencyPair[];
};

export type CurrencyPair = {
  base: string;
  target: string;
  rate: number;
  amount?: number;
};