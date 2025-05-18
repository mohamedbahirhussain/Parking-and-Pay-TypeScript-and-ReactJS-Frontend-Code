import React, { useState } from 'react';
import { useParkingContext } from '../context/ParkingContext';
import { ShieldAlert, AlertTriangle, Search, Check, X } from 'lucide-react';

const BlockList: React.FC = () => {
  const { vehicles, toggleBlocklist } = useParkingContext();
  const [newBlockPlate, setNewBlockPlate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  const blockedVehicles = vehicles.filter(v => v.isBlocked);
  
  const filteredVehicles = searchQuery 
    ? blockedVehicles.filter(v => v.licensePlate.toLowerCase().includes(searchQuery.toLowerCase()))
    : blockedVehicles;
  
  const handleAddToBlocklist = (e: React.FormEvent) => {
    e.preventDefault();
    if (newBlockPlate.trim()) {
      toggleBlocklist(newBlockPlate.trim());
      setNewBlockPlate('');
    }
  };
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Vehicle Blocklist</h1>
      
      <div className="bg-amber-50 border-l-4 border-amber-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertTriangle className="h-5 w-5 text-amber-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-amber-800">
              Important Note
            </h3>
            <div className="mt-2 text-sm text-amber-700">
              <p>
                Vehicles on this list will be denied entry to the parking facility.
                Make sure to add vehicles to this list only for valid reasons.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow">
            <div className="p-5 border-b border-gray-200">
              <h3 className="text-lg font-medium flex items-center">
                <ShieldAlert className="h-5 w-5 mr-2 text-red-500" />
                Add to Blocklist
              </h3>
            </div>
            
            <div className="p-5">
              <form onSubmit={handleAddToBlocklist}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    License Plate Number
                  </label>
                  <input
                    type="text"
                    value={newBlockPlate}
                    onChange={(e) => setNewBlockPlate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Enter plate number"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reason
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500">
                    <option value="unpaid">Unpaid Fines</option>
                    <option value="rules">Repeated Rule Violations</option>
                    <option value="security">Security Concern</option>
                    <option value="temporary">Temporary Block</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Additional Notes
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    rows={3}
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  className="w-full py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  Add to Blocklist
                </button>
              </form>
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow">
            <div className="p-5 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Blocklisted Vehicles</h3>
                
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Search plates"
                  />
                </div>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      License Plate
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Seen
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredVehicles.length > 0 ? (
                    filteredVehicles.map((vehicle) => (
                      <tr key={vehicle.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0 rounded-full bg-red-100 flex items-center justify-center">
                              <ShieldAlert className="h-5 w-5 text-red-600" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{vehicle.licensePlate}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                            Blocked
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {new Date(vehicle.entryTime).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button 
                            onClick={() => toggleBlocklist(vehicle.licensePlate)}
                            className="text-green-600 hover:text-green-900 mr-3"
                          >
                            Remove Block
                          </button>
                          <button className="text-blue-600 hover:text-blue-900">
                            View History
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-10 text-center text-gray-500">
                        {searchQuery 
                          ? 'No blocked vehicles matching your search' 
                          : 'No vehicles are currently blocked'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="mt-6 bg-white rounded-lg shadow">
            <div className="p-5 border-b border-gray-200">
              <h3 className="text-lg font-medium">Recent Block Events</h3>
            </div>
            
            <div className="p-5">
              <div className="space-y-4">
                <div className="border-l-4 border-red-500 pl-4 py-2">
                  <div className="flex justify-between">
                    <div className="font-medium">AB12CDE</div>
                    <div className="text-sm text-gray-500">Today, 10:34 AM</div>
                  </div>
                  <div className="flex items-center mt-1">
                    <X className="h-4 w-4 text-red-500 mr-1" />
                    <span className="text-sm">Added to blocklist - Unpaid fines</span>
                  </div>
                </div>
                
                <div className="border-l-4 border-green-500 pl-4 py-2">
                  <div className="flex justify-between">
                    <div className="font-medium">LM34OPQ</div>
                    <div className="text-sm text-gray-500">Yesterday, 3:21 PM</div>
                  </div>
                  <div className="flex items-center mt-1">
                    <Check className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-sm">Removed from blocklist</span>
                  </div>
                </div>
                
                <div className="border-l-4 border-red-500 pl-4 py-2">
                  <div className="flex justify-between">
                    <div className="font-medium">TU98VWX</div>
                    <div className="text-sm text-gray-500">Nov 5, 2023, 9:12 AM</div>
                  </div>
                  <div className="flex items-center mt-1">
                    <X className="h-4 w-4 text-red-500 mr-1" />
                    <span className="text-sm">Added to blocklist - Security concern</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlockList;