import React from 'react';
import { useParkingContext } from '../../context/ParkingContext';
import { format } from 'date-fns';
import { Check, X } from 'lucide-react';

const RecentVehicles: React.FC = () => {
  const { vehicles } = useParkingContext();
  
  // Get the 5 most recent vehicles
  const recentVehicles = [...vehicles]
    .sort((a, b) => new Date(b.entryTime).getTime() - new Date(a.entryTime).getTime())
    .slice(0, 5);
  
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-5 border-b border-gray-200">
        <h3 className="text-lg font-medium">Recent Vehicles</h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                License Plate
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Entry Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Payment
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {recentVehicles.map((vehicle) => (
              <tr key={vehicle.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{vehicle.licensePlate}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {format(new Date(vehicle.entryTime), 'MMM d, yyyy h:mm a')}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {vehicle.exitTime ? (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Exited
                    </span>
                  ) : (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      Parking
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {vehicle.isPaid ? (
                    <span className="flex items-center text-green-600">
                      <Check size={16} className="mr-1" /> 
                      Paid ${vehicle.paymentAmount?.toFixed(2)}
                    </span>
                  ) : (
                    <span className="flex items-center text-red-600">
                      <X size={16} className="mr-1" /> 
                      Unpaid
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentVehicles;