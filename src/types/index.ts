export interface AssetItem {
  ticker: string;
  rsi: number | 'N/A';
  currentPrice: string;
  oneDayReturn: string;
  oneWeekReturn: string;
  oneMonthReturn: string;
  rawRsi: number | null;
  rawCurrentPrice: number | null;
  rawOneDayReturn: number | null;
  rawOneWeekReturn: number | null;
  rawOneMonthReturn: number | null;
  rawThreeMonthReturn: number | null;
  rawSixMonthReturn: number | null;
  allPrices: { date: string; price: number }[];
}

export interface SortConfig {
  key: keyof AssetItem | null;
  direction: 'asc' | 'desc';
}