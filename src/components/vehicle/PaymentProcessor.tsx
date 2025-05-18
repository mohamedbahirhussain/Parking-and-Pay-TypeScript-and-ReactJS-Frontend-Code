// src/components/PaymentProcessor.tsx
import React, { useState, useEffect } from 'react';
import { useParkingContext } from '../../context/ParkingContext';
import { format } from 'date-fns';
import { CircleDollarSign, CreditCard, Clock, Check } from 'lucide-react';

interface PaymentProcessorProps {
  vehicleId: string;
  onSuccess: () => void;
}

const PaymentProcessor: React.FC<PaymentProcessorProps> = ({ vehicleId, onSuccess }) => {
  const { vehicles, calculateFee, processPayment } = useParkingContext();
  const [processing, setProcessing] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [exitTime, setExitTime] = useState<Date>(new Date());
  const [fee, setFee] = useState<number>(0);

  const vehicle = vehicles.find(v => v.id === vehicleId);
  const entryTime = vehicle ? new Date(vehicle.entryTime) : null;

  useEffect(() => {
    const now = new Date();
    setExitTime(now);

    const computeFee = async () => {
      if (entryTime) {
        const result = await calculateFee(entryTime, now);
        setFee(result);
      }
    };

    computeFee();
  }, [entryTime, calculateFee]);

  if (!vehicle || !entryTime) return <div>Vehicle not found</div>;

  const durationMs = exitTime.getTime() - entryTime.getTime();
  const hours = Math.floor(durationMs / (1000 * 60 * 60));
  const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));

  const handlePayment = async () => {
    setProcessing(true);
    const now = new Date();
    setExitTime(now);
    const result = await calculateFee(entryTime, now);
    setFee(result);

    setTimeout(async () => {
      await processPayment(vehicleId);
      setProcessing(false);
      setPaymentComplete(true);

      setTimeout(() => {
        onSuccess();
      }, 2000);
    }, 2000);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 bg-blue-600 text-white">
        <h2 className="text-lg font-semibold flex items-center">
          <CircleDollarSign className="mr-2" size={20} />
          Payment Processing
        </h2>
      </div>

      <div className="p-6">
        {paymentComplete ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-1">Payment Successful</h3>
            <p className="text-gray-500 mb-4">Amount: ${fee.toFixed(2)}</p>
            <p className="text-sm text-gray-500">Gate will open automatically</p>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-6">
              <InfoRow label="License Plate" value={vehicle.licensePlate} />
              <InfoRow label="Entry Time" value={format(entryTime, 'MMM d, yyyy h:mm a')} />
              <InfoRow label="Current Time" value={format(exitTime, 'MMM d, yyyy h:mm a')} />
              <InfoRow label="Duration" value={`${hours}h ${minutes}m`} icon={<Clock size={16} />} />
              <InfoRow
                label="Payment Status"
                value={vehicle.isPaid ? 'Paid' : 'Unpaid'}
                valueClass={vehicle.isPaid ? 'text-green-600' : 'text-red-600'}
              />
              <div className="flex justify-between items-center pb-3 text-lg">
                <span className="font-semibold">Total Amount:</span>
                <span className="font-bold text-xl">${fee.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handlePayment}
              disabled={processing || vehicle.isPaid}
              className={`w-full py-3 px-4 rounded-md font-medium flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                vehicle.isPaid
                  ? 'bg-green-600 text-white cursor-not-allowed'
                  : processing
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'
              }`}
            >
              {vehicle.isPaid ? (
                <>
                  <Check className="mr-2" size={20} />
                  Already Paid
                </>
              ) : processing ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291..." />
                  </svg>
                  Processing Payment...
                </>
              ) : (
                <>
                  <CreditCard className="mr-2" size={20} />
                  Process Payment
                </>
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

const InfoRow = ({
  label,
  value,
  icon,
  valueClass = '',
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
  valueClass?: string;
}) => (
  <div className="flex justify-between items-center pb-3 border-b border-gray-200">
    <span className="text-gray-600 flex items-center">
      {icon && <span className="mr-1">{icon}</span>}
      {label}:
    </span>
    <span className={`font-medium ${valueClass}`}>{value}</span>
  </div>
);

export default PaymentProcessor;
