import React, { useState } from 'react';
import PlateRecognition from '../components/vehicle/PlateRecognition';
import PaymentProcessor from '../components/vehicle/PaymentProcessor';
import GateControl from '../components/vehicle/GateControl';
import { useParkingContext } from '../context/ParkingContext';
import { Car, Search, AlertTriangle } from 'lucide-react';

const VehicleExit: React.FC = () => {
  const { vehicles, exitVehicle } = useParkingContext();

  const [capturedPlate, setCapturedPlate] = useState<string | null>(null);
  const [vehicleId, setVehicleId] = useState<string | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [showGateControl, setShowGateControl] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [manualSearchPlate, setManualSearchPlate] = useState<string>('');

  // Process captured plate (camera or manual)
  const processPlate = (licensePlate: string) => {
    setCapturedPlate(licensePlate);
    setError(null);

    const vehicle = vehicles.find(
      v => v.licensePlate.toLowerCase() === licensePlate.toLowerCase() && !v.exitTime
    );

    if (!vehicle) {
      setError('Vehicle not found or already exited.');
      return;
    }

    setVehicleId(vehicle.id);

    if (!vehicle.isPaid) {
      setShowPayment(true);
      setShowGateControl(false);
    } else {
      completeExit(vehicle.id);
    }
  };

  const handleCameraCapture = (plate: string) => processPlate(plate);

  const handlePaymentSuccess = () => {
    if (vehicleId) completeExit(vehicleId);
  };

  const completeExit = (id: string) => {
    setShowPayment(false);
    setShowGateControl(true);
    exitVehicle(id); // triggers context logic to update backend
  };

  const handleManualSearch = () => {
    if (manualSearchPlate.trim()) {
      processPlate(manualSearchPlate.trim());
    }
  };

  const reset = () => {
    setCapturedPlate(null);
    setVehicleId(null);
    setShowPayment(false);
    setShowGateControl(false);
    setError(null);
    setManualSearchPlate('');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Vehicle Exit</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Panel */}
        <div className="space-y-6">
          {/* Camera Recognition */}
          <PlateRecognition onCapture={handleCameraCapture} title="Exit Camera" />

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-red-500 mt-1" />
                <div>
                  <h3 className="font-semibold text-red-800">Error</h3>
                  <p className="text-red-700 text-sm">{error}</p>
                  <button
                    onClick={reset}
                    className="mt-2 text-sm text-red-700 hover:underline"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Manual Plate Search */}
          <div className="bg-white p-5 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold flex items-center mb-4">
              <Search className="h-5 w-5 mr-2 text-gray-500" />
              Manual Plate Search
            </h2>
            <div className="flex space-x-2">
              <input
                type="text"
                value={manualSearchPlate}
                onChange={(e) => setManualSearchPlate(e.target.value)}
                placeholder="Enter license plate"
                className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleManualSearch}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div>
          {showPayment && vehicleId ? (
            <PaymentProcessor vehicleId={vehicleId} onSuccess={handlePaymentSuccess} />
          ) : showGateControl && vehicleId ? (
            <GateControl vehicleId={vehicleId} gate="exit" />
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8 text-center flex flex-col items-center justify-center h-full">
              <Car className="h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-xl font-medium text-gray-500">No Vehicle Detected</h3>
              <p className="text-gray-500 max-w-sm">
                Use the camera or manual search to initiate vehicle exit process.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Exit Instructions */}
      <div className="bg-white rounded-lg shadow-md p-5">
        <h2 className="text-lg font-semibold mb-4">Exit Instructions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InstructionStep
            number="1"
            color="blue"
            title="Scan License Plate"
            description="Position vehicle in front of camera for automatic detection."
          />
          <InstructionStep
            number="2"
            color="green"
            title="Process Payment"
            description="Complete the payment if pending."
          />
          <InstructionStep
            number="3"
            color="amber"
            title="Exit Through Gate"
            description="Gate opens automatically upon successful payment."
          />
        </div>
      </div>
    </div>
  );
};

// Instruction Step Card
const InstructionStep = ({
  number,
  color,
  title,
  description,
}: {
  number: string;
  color: string;
  title: string;
  description: string;
}) => (
  <div className={`p-4 bg-${color}-50 rounded-lg text-center`}>
    <div className={`w-10 h-10 mx-auto mb-3 rounded-full flex items-center justify-center bg-${color}-100`}>
      <span className={`text-${color}-700 font-bold`}>{number}</span>
    </div>
    <h3 className={`text-sm font-medium text-${color}-700 mb-1`}>{title}</h3>
    <p className={`text-xs text-${color}-600`}>{description}</p>
  </div>
);

export default VehicleExit;
