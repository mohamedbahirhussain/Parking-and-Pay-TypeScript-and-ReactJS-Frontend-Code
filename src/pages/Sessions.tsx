import React, { useState } from 'react';
import { useParkingContext } from '../context/ParkingContext';
import { format } from 'date-fns';
import { Search, Filter, Check, X, Clock, FileDown } from 'lucide-react';

type FilterType = 'all' | 'active' | 'completed' | 'paid' | 'unpaid';

const Sessions: React.FC = () => {
  const { searchVehicles } = useParkingContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterType>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredVehicles = searchVehicles(searchQuery).filter(vehicle => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'active') return !vehicle.exitTime;
    if (filterStatus === 'completed') return !!vehicle.exitTime;
    if (filterStatus === 'paid') return vehicle.isPaid;
    if (filterStatus === 'unpaid') return !vehicle.isPaid;
    return true;
  });

  const paginatedVehicles = filteredVehicles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredVehicles.length / itemsPerPage);

  const formatDuration = (entryTime: Date, exitTime?: Date) => {
    const start = new Date(entryTime);
    const end = exitTime ? new Date(exitTime) : new Date();
    const durationMs = end.getTime() - start.getTime();
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Session Management</h1>
        <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none">
          <FileDown className="h-4 w-4 mr-2" />
          Export Data
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-5 border-b border-gray-200">
          <form className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search by license plate or date"
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter className="h-5 w-5 text-gray-400" />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => {
                  setFilterStatus(e.target.value as FilterType);
                  setCurrentPage(1);
                }}
                className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 appearance-none"
              >
                <option value="all">All Sessions</option>
                <option value="active">Active Sessions</option>
                <option value="completed">Completed Sessions</option>
                <option value="paid">Paid Sessions</option>
                <option value="unpaid">Unpaid Sessions</option>
              </select>
            </div>
          </form>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {['License Plate', 'Entry Time', 'Exit Time', 'Duration', 'Status', 'Payment', 'Actions'].map(header => (
                  <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedVehicles.length > 0 ? (
                paginatedVehicles.map((vehicle) => (
                  <tr key={vehicle.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{vehicle.licensePlate}</div>
                      {vehicle.isBlocked && (
                        <span className="ml-1 px-2 inline-flex text-xs font-semibold rounded-full bg-red-100 text-red-800">
                          Blocklisted
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {format(new Date(vehicle.entryTime), 'MMM d, yyyy h:mm a')}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {vehicle.exitTime ? (
                        format(new Date(vehicle.exitTime), 'MMM d, yyyy h:mm a')
                      ) : (
                        <span className="flex items-center text-blue-600">
                          <Clock size={14} className="mr-1" />
                          In Progress
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDuration(vehicle.entryTime, vehicle.exitTime)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 inline-flex text-xs font-semibold rounded-full ${vehicle.exitTime ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                        {vehicle.exitTime ? 'Completed' : 'Active'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {vehicle.isPaid ? (
                        <span className="flex items-center text-green-600">
                          <Check size={16} className="mr-1" />
                          {vehicle.paymentAmount ? `$${vehicle.paymentAmount.toFixed(2)}` : 'Paid'}
                        </span>
                      ) : (
                        <span className="flex items-center text-red-600">
                          <X size={16} className="mr-1" />
                          Unpaid
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-3">View</button>
                      <button className="text-amber-600 hover:text-amber-900">
                        {!vehicle.isPaid ? 'Process Payment' : 'Print Receipt'}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-gray-500">
                    No sessions found matching your criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Showing {paginatedVehicles.length} of {filteredVehicles.length} sessions
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-50"
                disabled={currentPage === 1}
              >
                Previous
              </button>
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => handlePageChange(index + 1)}
                  className={`px-3 py-1 rounded-md text-sm ${
                    currentPage === index + 1
                      ? 'bg-blue-600 text-white'
                      : 'border border-gray-300 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-50"
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sessions;
