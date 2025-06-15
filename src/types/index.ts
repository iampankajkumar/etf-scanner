export interface AssetItem {
  ticker: string;
  rsi: number | 'N/A';
  currentPrice: string;
  oneDayReturn: string;
  oneWeekReturn: string;
  oneMonthReturn: string;
  discount: string;
  fiftyTwoWeekHigh: number | null;
  rawRsi: number | null;
  rawCurrentPrice: number | null;
  rawOneDayReturn: number | null;
  rawOneWeekReturn: number | null;
  rawOneMonthReturn: number | null;
  rawThreeMonthReturn: number | null;
  rawSixMonthReturn: number | null;
  allPrices: { date: string; price: number }[];

  // All fields from API
  recordDate?: string;
  lastClosePrice?: string;
  lastDayVolume?: string;
  downFrom2YearHigh?: string;
  dailyRSI?: string;
  weeklyRSI?: string;
  monthlyRSI?: string;
  oneWeekReturns?: string;
  oneMonthReturns?: string;
  oneYearReturns?: string;
  twoYearReturns?: string;
  twoYearNiftyReturns?: string;
  priceToEarning?: string;
  niftyPriceToEarning?: string;
  priceRange?: any;
  priceToEarningRange?: any;
  rsiObj?: any;
  returnsObj?: any;
  // New structured data for details page
  priceRangeData?: {
    weeklyRange?: { min: string; max: string; current: string };
    monthlyRange?: { min: string; max: string; current: string };
    yearlyRange?: { min: string; max: string; current: string };
    "2yearlyRange"?: { min: string; max: string; current: string };
  };
  rsiData?: {
    daily?: string;
    weekly?: string;
    monthly?: string;
  };
  returnsData?: {
    "1week"?: string;
    "1month"?: string;
    "1year"?: string;
    "2year"?: string;
  };
}

export interface SortConfig {
  key: keyof AssetItem | null;
  direction: 'asc' | 'desc';
}
