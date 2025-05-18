import React, { useState } from 'react';
import PlateRecognition from '../components/vehicle/PlateRecognition';
import GateControl from '../components/vehicle/GateControl';
import { useParkingContext } from '../context/ParkingContext';
import { Car, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

const VehicleEntry: React.FC = () => {
  const { addVehicle, stats } = useParkingContext();
  const [capturedPlate, setCapturedPlate] = useState<string | null>(null);
  const [vehicleId, setVehicleId] = useState<string | null>(null);
  const [entryStatus, setEntryStatus] = useState<'success' | 'full' | 'blocked' | null>(null);
  
  const handleCapture = (licensePlate: string) => {
    setCapturedPlate(licensePlate);
    
    if (stats.availableSpaces <= 0) {
      setEntryStatus('full');
      return;
    }
    
    // Check if the vehicle is blocklisted (in a real app would check against database)
    const isBlocked = Math.random() > 0.9; // 10% chance for demo
    
    if (isBlocked) {
      setEntryStatus('blocked');
      return;
    }
    
    const id = Date.now().toString();
    addVehicle(licensePlate);
    setVehicleId(id);
    setEntryStatus('success');
  };
  
  const resetForm = () => {
    setCapturedPlate(null);
    setVehicleId(null);
    setEntryStatus(null);
  };
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Vehicle Entry</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <PlateRecognition onCapture={handleCapture} title="Vehicle Entry Camera" />
          
          {entryStatus === 'success' && capturedPlate && (
            <div className="mt-6 bg-green-50 border-l-4 border-green-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">
                    Entry Successful
                  </h3>
                  <div className="mt-2 text-sm text-green-700">
                    <p>License Plate: <strong>{capturedPlate}</strong></p>
                    <p>Entry Time: <strong>{new Date().toLocaleTimeString()}</strong></p>
                  </div>
                  <div className="mt-3">
                    <button
                      onClick={resetForm}
                      className="text-sm font-medium text-green-700 hover:text-green-600"
                    >
                      Record Another Entry
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {entryStatus === 'full' && (
            <div className="mt-6 bg-red-50 border-l-4 border-red-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <XCircle className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Entry Denied - Parking Full
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>The parking facility is currently at maximum capacity.</p>
                  </div>
                  <div className="mt-3">
                    <button
                      onClick={resetForm}
                      className="text-sm font-medium text-red-700 hover:text-red-600"
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {entryStatus === 'blocked' && capturedPlate && (
            <div className="mt-6 bg-amber-50 border-l-4 border-amber-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-5 w-5 text-amber-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-amber-800">
                    Entry Denied - Vehicle Blocklisted
                  </h3>
                  <div className="mt-2 text-sm text-amber-700">
                    <p>License Plate: <strong>{capturedPlate}</strong></p>
                    <p>This vehicle is not permitted to enter the facility.</p>
                  </div>
                  <div className="mt-3">
                    <button
                      onClick={resetForm}
                      className="text-sm font-medium text-amber-700 hover:text-amber-600"
                    >
                      Try Another Vehicle
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div>
          {vehicleId && entryStatus === 'success' ? (
            <GateControl vehicleId={vehicleId} gate="entry" />
          ) : (
            <div className="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col items-center justify-center p-8 text-center">
              <Car className="h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-xl font-medium text-gray-500 mb-2">No Vehicle Detected</h3>
              <p className="text-gray-500 max-w-md">
                Use the plate recognition camera to detect a vehicle and open the entry gate
              </p>
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-5">
        <h2 className="text-lg font-semibold mb-4">Parking Status</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium text-blue-700">Available Spaces</h3>
              <span className="text-2xl font-bold text-blue-700">{stats.availableSpaces}</span>
            </div>
          </div>
          
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium text-green-700">Total Capacity</h3>
              <span className="text-2xl font-bold text-green-700">100</span>
            </div>
          </div>
          
          <div className="p-4 bg-amber-50 rounded-lg">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium text-amber-700">Occupancy Rate</h3>
              <span className="text-2xl font-bold text-amber-700">
                {Math.round(((100 - stats.availableSpaces) / 100) * 100)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleEntry;