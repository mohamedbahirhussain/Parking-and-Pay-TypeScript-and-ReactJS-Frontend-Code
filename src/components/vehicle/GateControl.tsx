import React, { useState, useEffect } from 'react';
import { useParkingContext } from '../../context/ParkingContext';
import { DoorOpen, DoorClosed, AlertTriangle } from 'lucide-react';

interface GateControlProps {
  vehicleId: string;
  gate: 'entry' | 'exit';
}

const GateControl: React.FC<GateControlProps> = ({ vehicleId, gate }) => {
  const { vehicles, overrideGate } = useParkingContext();
  const [isOpen, setIsOpen] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  
  const vehicle = vehicles.find(v => v.id === vehicleId);
  
  useEffect(() => {
    // If a vehicle is detected and meets criteria, open the gate
    if (vehicle) {
      const shouldOpen = gate === 'entry' 
        ? !vehicle.isBlocked
        : vehicle.isPaid;
      
      if (shouldOpen && !isOpen) {
        openGate();
      }
    }
  }, [vehicle, gate]);
  
  const openGate = () => {
    setIsOpen(true);
    overrideGate('open', gate);
    setCountdown(10);
    
    // Auto close after 10 seconds
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev === null || prev <= 1) {
          clearInterval(timer);
          setIsOpen(false);
          overrideGate('close', gate);
          return null;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  };
  
  const manualControl = (action: 'open' | 'close') => {
    if (action === 'open') {
      openGate();
    } else {
      setIsOpen(false);
      setCountdown(null);
      overrideGate('close', gate);
    }
  };
  
  const isBlocked = vehicle?.isBlocked;
  const isPaid = vehicle?.isPaid;
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className={`p-4 ${isOpen ? 'bg-green-600' : 'bg-gray-600'} text-white`}>
        <h2 className="text-lg font-semibold flex items-center">
          {isOpen ? <DoorOpen className="mr-2" size={20} /> : <DoorClosed className="mr-2" size={20} />}
          {gate === 'entry' ? 'Entry' : 'Exit'} Gate Control
        </h2>
      </div>
      
      <div className="p-4">
        {gate === 'entry' && isBlocked && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  Vehicle is blocklisted. Gate will remain closed.
                </p>
              </div>
            </div>
          </div>
        )}
        
        {gate === 'exit' && !isPaid && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  Payment required. Gate will remain closed until payment is processed.
                </p>
              </div>
            </div>
          </div>
        )}
        
        <div className="text-center py-6">
          <div className={`w-36 h-36 mx-auto rounded-full mb-4 flex items-center justify-center ${
            isOpen ? 'bg-green-100' : 'bg-gray-100'
          }`}>
            {isOpen ? (
              <DoorOpen className="h-16 w-16 text-green-600" />
            ) : (
              <DoorClosed className="h-16 w-16 text-gray-600" />
            )}
          </div>
          
          <h3 className="text-xl font-medium mb-2">
            Gate is {isOpen ? 'Open' : 'Closed'}
          </h3>
          
          {countdown !== null && (
            <p className="text-sm text-gray-500 mb-4">
              Gate will close in {countdown} seconds
            </p>
          )}
          
          <div className="flex justify-center space-x-3">
            <button
              onClick={() => manualControl('open')}
              disabled={isOpen || (gate === 'entry' && isBlocked) || (gate === 'exit' && !isPaid)}
              className={`py-2 px-4 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                isOpen || (gate === 'entry' && isBlocked) || (gate === 'exit' && !isPaid)
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500'
              }`}
            >
              Open Gate
            </button>
            
            <button
              onClick={() => manualControl('close')}
              disabled={!isOpen}
              className={`py-2 px-4 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                !isOpen
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
              }`}
            >
              Close Gate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GateControl;