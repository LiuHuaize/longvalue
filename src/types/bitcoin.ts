// Bitcoin data types for API integration

export interface BitcoinPriceData {
  price: number;
  priceChange24h: number;
  priceChangePercentage24h: number;
  marketCap: number;
  volume24h: number;
  circulatingSupply: number;
  totalSupply: number;
  lastUpdated: string;
}

export interface BitcoinReturnData {
  threeMonthReturn: number;
  oneYearReturn: number;
  tenYearReturn: number;
  allTimeHigh: number;
  allTimeLow: number;
}

export interface BitcoinComparisonData {
  bitcoinVsM2: {
    bitcoin: number[];
    m2: number[];
    dates: string[];
  };
  dollarPPPVsBitcoin: {
    dollarPPP: number[];
    bitcoin: number[];
    dates: string[];
  };
  bitcoinSupplyVsInflation: {
    bitcoinSupply: number[];
    inflationRate: number[];
    dates: string[];
  };
  bitcoinVsUSM2: {
    bitcoin: number[];
    usM2: number[];
    dates: string[];
  };
}

export interface BitcoinNewsItem {
  id: string;
  title: string;
  summary: string;
  url: string;
  publishedAt: string;
  source: string;
  sentiment: 'positive' | 'negative' | 'neutral';
}

// API response types
export interface BitcoinAPIResponse {
  success: boolean;
  data: BitcoinPriceData;
  timestamp: number;
}

export interface BitcoinReturnsAPIResponse {
  success: boolean;
  data: BitcoinReturnData;
  timestamp: number;
}

export interface BitcoinComparisonAPIResponse {
  success: boolean;
  data: BitcoinComparisonData;
  timestamp: number;
}

export interface BitcoinNewsAPIResponse {
  success: boolean;
  data: BitcoinNewsItem[];
  timestamp: number;
  totalCount: number;
}

// Data fetching functions (to be implemented)
export interface BitcoinDataService {
  getCurrentPrice(): Promise<BitcoinAPIResponse>;
  getReturnsData(): Promise<BitcoinReturnsAPIResponse>;
  getComparisonData(): Promise<BitcoinComparisonAPIResponse>;
  getLatestNews(limit?: number): Promise<BitcoinNewsAPIResponse>;
}
