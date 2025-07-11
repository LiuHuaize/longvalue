import React from 'react';

interface BitcoinPriceCardProps {
  title: string;
  value: string;
  unit?: string;
  borderColor: string;
  textColor: string;
  isLoading?: boolean;
}

const BitcoinPriceCard: React.FC<BitcoinPriceCardProps> = ({
  title,
  value,
  unit,
  borderColor,
  textColor,
  isLoading = false
}) => {
  return (
    <div className={`bg-white p-8 rounded-2xl shadow-xl border border-blue-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 ${borderColor} border-l-4`}>
      <h4 className="text-sm font-bold text-blue-600 uppercase tracking-wide mb-3">
        {title}
      </h4>
      <div className="mt-2">
        <div className={`text-3xl font-bold ${isLoading ? 'text-gray-400' : textColor}`}>
          {isLoading ? (
            <span className="text-gray-400">--</span>
          ) : (
            value
          )}
        </div>
        {unit && (
          <div className="text-sm text-blue-500 font-medium mt-1">{unit}</div>
        )}
      </div>
    </div>
  );
};

export default BitcoinPriceCard;
