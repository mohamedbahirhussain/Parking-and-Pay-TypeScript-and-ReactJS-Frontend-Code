import React, { useState, useCallback, useRef } from 'react';
import Webcam from 'react-webcam';
import { Camera, Loader2, AlertTriangle } from 'lucide-react';

interface PlateRecognitionProps {
  onCapture: (licensePlate: string) => void;
  title: string;
}

const PlateRecognition: React.FC<PlateRecognitionProps> = ({ onCapture, title }) => {
  const webcamRef = useRef<Webcam>(null);
  const [recognizing, setRecognizing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [manualEntry, setManualEntry] = useState(false);
  const [licensePlate, setLicensePlate] = useState('');

  const capture = useCallback(() => {
    setRecognizing(true);
    setError(null);
    
    // Simulate plate recognition (in a real app, this would call an ANPR API)
    setTimeout(() => {
      const success = Math.random() > 0.3; // 70% success rate for demo
      
      if (success) {
        // Generate a random license plate for demo purposes
        const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
        const numbers = '0123456789';
        
        let plate = '';
        for (let i = 0; i < 2; i++) plate += letters.charAt(Math.floor(Math.random() * letters.length));
        for (let i = 0; i < 2; i++) plate += numbers.charAt(Math.floor(Math.random() * numbers.length));
        for (let i = 0; i < 3; i++) plate += letters.charAt(Math.floor(Math.random() * letters.length));
        
        onCapture(plate);
      } else {
        setError('Failed to recognize plate. Try again or enter manually.');
      }
      
      setRecognizing(false);
    }, 2000);
  }, [onCapture]);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (licensePlate.trim()) {
      onCapture(licensePlate.trim().toUpperCase());
      setLicensePlate('');
      setManualEntry(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 bg-blue-600 text-white">
        <h2 className="text-lg font-semibold flex items-center">
          <Camera className="mr-2" size={20} />
          {title}
        </h2>
      </div>
      
      <div className="p-4">
        {manualEntry ? (
          <form onSubmit={handleManualSubmit} className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                License Plate Number
              </label>
              <input
                type="text"
                value={licensePlate}
                onChange={(e) => setLicensePlate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter plate number"
                required
              />
            </div>
            <div className="flex space-x-2">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Submit
              </button>
              <button
                type="button"
                onClick={() => setManualEntry(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <>
            <div className="relative border-2 border-gray-300 rounded-lg overflow-hidden mb-4 aspect-video">
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                className="w-full h-full object-cover"
                videoConstraints={{
                  facingMode: "environment"
                }}
              />
              
              {recognizing && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                  <div className="text-white text-center p-4">
                    <Loader2 className="animate-spin h-8 w-8 mx-auto mb-2" />
                    <p>Recognizing plate number...</p>
                  </div>
                </div>
              )}
              
              <div className="absolute inset-x-0 top-2 flex justify-center">
                <div className="bg-black bg-opacity-50 text-white text-sm px-3 py-1 rounded-full">
                  Live Camera Feed
                </div>
              </div>
              
              <div className="absolute inset-0 border-4 border-transparent box-content">
                <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2/3 h-1/4 border-2 border-yellow-400 rounded-md"></div>
              </div>
            </div>
            
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertTriangle className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex space-x-3">
              <button
                onClick={capture}
                disabled={recognizing}
                className={`flex-1 py-2 px-4 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  recognizing
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'
                }`}
              >
                {recognizing ? 'Processing...' : 'Capture Plate'}
              </button>
              
              <button
                onClick={() => setManualEntry(true)}
                className="py-2 px-4 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Enter Manually
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PlateRecognition;