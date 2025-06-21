import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import BitcoinDataGrid from '../BitcoinDataGrid';

describe('BitcoinDataGrid', () => {
  test('renders loading state correctly', () => {
    render(<BitcoinDataGrid isLoading={true} />);
    
    // Check if all the price cards are rendered
    expect(screen.getByText('实时价格')).toBeInTheDocument();
    expect(screen.getByText('3月回报率')).toBeInTheDocument();
    expect(screen.getByText('1年回报率')).toBeInTheDocument();
    expect(screen.getByText('10年回报率')).toBeInTheDocument();
    expect(screen.getByText('市值')).toBeInTheDocument();
    
    // Check if loading placeholders are shown
    const loadingPlaceholders = screen.getAllByText('--');
    expect(loadingPlaceholders.length).toBeGreaterThan(0);
  });

  test('renders data correctly when provided', () => {
    const mockData = {
      price: '$95,420',
      threeMonthReturn: '+15.8%',
      oneYearReturn: '+125.4%',
      tenYearReturn: '+8,900.2%',
      marketCap: '$1.9T'
    };

    render(<BitcoinDataGrid data={mockData} isLoading={false} />);
    
    // Check if actual data is displayed
    expect(screen.getByText('$95,420')).toBeInTheDocument();
    expect(screen.getByText('+15.8%')).toBeInTheDocument();
    expect(screen.getByText('+125.4%')).toBeInTheDocument();
    expect(screen.getByText('+8,900.2%')).toBeInTheDocument();
    expect(screen.getByText('$1.9T')).toBeInTheDocument();
  });

  test('has correct styling classes', () => {
    const { container } = render(<BitcoinDataGrid isLoading={true} />);
    
    // Check if the grid container has correct classes
    const gridContainer = container.querySelector('.grid');
    expect(gridContainer).toHaveClass('grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-5', 'gap-6');
  });
});
