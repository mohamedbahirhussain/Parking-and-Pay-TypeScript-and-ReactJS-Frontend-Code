import React from 'react';
import { useParkingContext } from '../../context/ParkingContext';

const VehicleStatusCard: React.FC = () => {
  const { stats, totalCapacity } = useParkingContext();
  
  // Calculate percentage of total capacity
  const occupiedPercentage = (stats.totalVehicles / totalCapacity) * 100;
  
  return (
    <div className="bg-white rounded-lg shadow p-5">
      <h3 className="text-lg font-medium mb-4">Parking Capacity</h3>
      
      <div className="mb-2 flex justify-between items-center">
        <span className="text-sm text-gray-500">Occupied ({stats.totalVehicles}/{totalCapacity})</span>
        <span className="text-sm font-medium">{occupiedPercentage.toFixed(0)}%</span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className={`h-2.5 rounded-full ${
            occupiedPercentage > 90 ? 'bg-red-500' : 
            occupiedPercentage > 70 ? 'bg-yellow-400' : 'bg-green-500'
          }`}
          style={{ width: `${occupiedPercentage}%` }}
        ></div>
      </div>
      
      <div className="mt-4 grid grid-cols-3 gap-4 text-center">
        <div className="bg-green-50 p-3 rounded-lg">
          <p className="text-sm text-gray-500">Available</p>
          <p className="text-xl font-bold text-green-600">{stats.availableSpaces}</p>
        </div>
        <div className="bg-blue-50 p-3 rounded-lg">
          <p className="text-sm text-gray-500">Total</p>
          <p className="text-xl font-bold text-blue-600">{totalCapacity}</p>
        </div>
        <div className="bg-amber-50 p-3 rounded-lg">
          <p className="text-sm text-gray-500">Unpaid</p>
          <p className="text-xl font-bold text-amber-600">{stats.unpaidSessions}</p>
        </div>
      </div>
    </div>
  );
};

export default VehicleStatusCard;