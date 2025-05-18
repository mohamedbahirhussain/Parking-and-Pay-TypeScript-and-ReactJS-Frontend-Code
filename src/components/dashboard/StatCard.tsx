import React, { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  color: string;
  trend?: {
    value: number;
    isUp: boolean;
  };
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, trend }) => {
  return (
    <div className="bg-white rounded-lg shadow p-5 flex items-center justify-between transition-transform hover:scale-[1.02]">
      <div>
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <p className="text-2xl font-bold mt-1">{value}</p>
        
        {trend && (
          <div className="flex items-center mt-1">
            <span className={`text-xs ${trend.isUp ? 'text-green-500' : 'text-red-500'}`}>
              {trend.isUp ? '↑' : '↓'} {trend.value}%
            </span>
            <span className="text-xs text-gray-500 ml-1">vs yesterday</span>
          </div>
        )}
      </div>
      
      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${color}`}>
        {icon}
      </div>
    </div>
  );
};

export default StatCard;