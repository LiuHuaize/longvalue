import React from 'react';
import BitcoinPriceCard from './BitcoinPriceCard';

interface BitcoinData {
  price: string;
  threeMonthReturn: string;
  oneYearReturn: string;
  tenYearReturn: string;
  marketCap: string;
}

interface BitcoinDataGridProps {
  data?: BitcoinData;
  isLoading?: boolean;
}

const BitcoinDataGrid: React.FC<BitcoinDataGridProps> = ({
  data,
  isLoading = false
}) => {
  const defaultData = {
    price: '$--,---',
    threeMonthReturn: '--%',
    oneYearReturn: '--%',
    tenYearReturn: '--%',
    marketCap: '$-.-T'
  };

  const displayData = data || defaultData;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
      <BitcoinPriceCard
        title="实时价格"
        value={displayData.price}
        unit="USD"
        borderColor="border-blue-600"
        textColor="text-gray-900"
        isLoading={isLoading}
      />

      <BitcoinPriceCard
        title="3月回报率"
        value={displayData.threeMonthReturn}
        borderColor="border-blue-500"
        textColor="text-blue-600"
        isLoading={isLoading}
      />

      <BitcoinPriceCard
        title="1年回报率"
        value={displayData.oneYearReturn}
        borderColor="border-blue-500"
        textColor="text-blue-600"
        isLoading={isLoading}
      />

      <BitcoinPriceCard
        title="10年回报率"
        value={displayData.tenYearReturn}
        borderColor="border-blue-500"
        textColor="text-blue-600"
        isLoading={isLoading}
      />

      <BitcoinPriceCard
        title="市值"
        value={displayData.marketCap}
        unit="USD"
        borderColor="border-blue-600"
        textColor="text-blue-700"
        isLoading={isLoading}
      />
    </div>
  );
};

export default BitcoinDataGrid;
