import {
  BitcoinAPIResponse,
  BitcoinReturnsAPIResponse,
  BitcoinComparisonAPIResponse,
  BitcoinNewsAPIResponse,
  BitcoinDataService
} from '../types/bitcoin';

// Mock data for development - replace with actual API calls
const mockBitcoinPrice = {
  price: 95420.50,
  priceChange24h: 2340.20,
  priceChangePercentage24h: 2.51,
  marketCap: 1890000000000,
  volume24h: 28500000000,
  circulatingSupply: 19800000,
  totalSupply: 21000000,
  lastUpdated: new Date().toISOString()
};

const mockReturnsData = {
  threeMonthReturn: 15.8,
  oneYearReturn: 125.4,
  tenYearReturn: 8900.2,
  allTimeHigh: 108135.00,
  allTimeLow: 0.0008
};

class BitcoinDataServiceImpl implements BitcoinDataService {
  private baseURL = import.meta.env.VITE_BITCOIN_API_URL || 'https://api.coingecko.com/api/v3';

  async getCurrentPrice(): Promise<BitcoinAPIResponse> {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`${this.baseURL}/simple/price?ids=bitcoin&vs_currencies=usd&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true`);
      // const data = await response.json();
      
      // For now, return mock data
      return {
        success: true,
        data: mockBitcoinPrice,
        timestamp: Date.now()
      };
    } catch (error) {
      console.error('Error fetching Bitcoin price:', error);
      return {
        success: false,
        data: mockBitcoinPrice,
        timestamp: Date.now()
      };
    }
  }

  async getReturnsData(): Promise<BitcoinReturnsAPIResponse> {
    try {
      // TODO: Implement actual API call for returns data
      return {
        success: true,
        data: mockReturnsData,
        timestamp: Date.now()
      };
    } catch (error) {
      console.error('Error fetching Bitcoin returns data:', error);
      return {
        success: false,
        data: mockReturnsData,
        timestamp: Date.now()
      };
    }
  }

  async getComparisonData(): Promise<BitcoinComparisonAPIResponse> {
    try {
      // TODO: Implement actual API call for comparison data
      const mockComparisonData = {
        bitcoinVsM2: {
          bitcoin: [30000, 45000, 65000, 95000],
          m2: [18000, 19000, 20500, 21000],
          dates: ['2021-01', '2022-01', '2023-01', '2024-01']
        },
        dollarPPPVsBitcoin: {
          dollarPPP: [100, 95, 88, 82],
          bitcoin: [30000, 45000, 65000, 95000],
          dates: ['2021-01', '2022-01', '2023-01', '2024-01']
        },
        bitcoinSupplyVsInflation: {
          bitcoinSupply: [18500000, 19000000, 19500000, 19800000],
          inflationRate: [7.0, 8.5, 3.2, 2.1],
          dates: ['2021-01', '2022-01', '2023-01', '2024-01']
        },
        bitcoinVsUSM2: {
          bitcoin: [30000, 45000, 65000, 95000],
          usM2: [19500, 21800, 20900, 21000],
          dates: ['2021-01', '2022-01', '2023-01', '2024-01']
        }
      };

      return {
        success: true,
        data: mockComparisonData,
        timestamp: Date.now()
      };
    } catch (error) {
      console.error('Error fetching Bitcoin comparison data:', error);
      throw error;
    }
  }

  async getLatestNews(limit: number = 10): Promise<BitcoinNewsAPIResponse> {
    try {
      // TODO: Implement actual API call for news data
      const mockNewsData = [
        {
          id: '1',
          title: 'Bitcoin Reaches New All-Time High',
          summary: 'Bitcoin continues its bullish trend as institutional adoption increases.',
          url: 'https://example.com/news/1',
          publishedAt: new Date().toISOString(),
          source: 'CoinDesk',
          sentiment: 'positive' as const
        },
        {
          id: '2',
          title: 'Major Corporation Adds Bitcoin to Treasury',
          summary: 'Another Fortune 500 company announces Bitcoin treasury strategy.',
          url: 'https://example.com/news/2',
          publishedAt: new Date(Date.now() - 3600000).toISOString(),
          source: 'Bitcoin Magazine',
          sentiment: 'positive' as const
        }
      ];

      return {
        success: true,
        data: mockNewsData.slice(0, limit),
        timestamp: Date.now(),
        totalCount: mockNewsData.length
      };
    } catch (error) {
      console.error('Error fetching Bitcoin news:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const bitcoinDataService = new BitcoinDataServiceImpl();

// Export utility functions for formatting
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
};

export const formatPercentage = (percentage: number): string => {
  return `${percentage >= 0 ? '+' : ''}${percentage.toFixed(1)}%`;
};

export const formatMarketCap = (marketCap: number): string => {
  if (marketCap >= 1e12) {
    return `$${(marketCap / 1e12).toFixed(1)}T`;
  } else if (marketCap >= 1e9) {
    return `$${(marketCap / 1e9).toFixed(1)}B`;
  } else if (marketCap >= 1e6) {
    return `$${(marketCap / 1e6).toFixed(1)}M`;
  }
  return `$${marketCap.toFixed(0)}`;
};
