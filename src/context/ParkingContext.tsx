import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Vehicle, DashboardStats, User, ParkingRate } from '../types';
import { generateMockUsers } from '../utils/mockData';

const API_BASE_URL = 'http://localhost:8080/api';

interface ParkingContextProps {
  vehicles: Vehicle[];
  users: User[];
  stats: DashboardStats;
  parkingRate: ParkingRate;
  addVehicle: (licensePlate: string) => Promise<void>;
  exitVehicle: (id: string) => Promise<void>;
  processPayment: (id: string) => Promise<void>;
  toggleBlocklist: (licensePlate: string) => Promise<void>;
  overrideGate: (action: 'open' | 'close', gate: 'entry' | 'exit') => void;
  searchVehicles: (query: string) => Vehicle[];
  calculateFee: (entryTime: Date, exitTime: Date) => Promise<number>;
  totalCapacity: number;
}

const ParkingContext = createContext<ParkingContextProps | null>(null);

export const useParkingContext = () => {
  const context = useContext(ParkingContext);
  if (!context) {
    throw new Error('useParkingContext must be used within a ParkingProvider');
  }
  return context;
};

export const ParkingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [users] = useState<User[]>(generateMockUsers());
  const totalCapacity = 100;

  const [parkingRate] = useState<ParkingRate>({
    hourlyRate: 2.5,
    minimumCharge: 2.5,
    dayMaximum: 25.0,
  });

  const fetchVehicles = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/vehicles/parked`);
      if (!response.ok) throw new Error('Failed to fetch vehicles');
      const data = await response.json();
      setVehicles(data);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    }
  };

  useEffect(() => {
    fetchVehicles();
    const interval = setInterval(fetchVehicles, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const calculateStats = (): DashboardStats => {
    const currentVehicles = vehicles.filter((v) => !v.exitTime).length;
    const todayRevenue = vehicles
      .filter(
        (v) =>
          v.isPaid &&
          v.paymentAmount &&
          v.exitTime &&
          new Date(v.exitTime).toDateString() === new Date().toDateString()
      )
      .reduce((acc, v) => acc + (v.paymentAmount || 0), 0);

    const unpaidSessions = vehicles.filter((v) => !v.isPaid && !v.exitTime).length;

    return {
      totalVehicles: currentVehicles,
      availableSpaces: totalCapacity - currentVehicles,
      todayRevenue,
      unpaidSessions,
    };
  };

  const [stats, setStats] = useState<DashboardStats>({
    totalVehicles: 0,
    availableSpaces: totalCapacity,
    todayRevenue: 0,
    unpaidSessions: 0,
  });

  useEffect(() => {
    setStats(calculateStats());
  }, [vehicles]);

  const calculateFee = async (entryTime: Date, exitTime: Date): Promise<number> => {
    try {
      // Assuming your backend expects entry and exit times to calculate fee
      const response = await fetch(
        `${API_BASE_URL}/vehicles/fee?entryTime=${entryTime.toISOString()}&exitTime=${exitTime.toISOString()}`
      );
      if (!response.ok) throw new Error('Failed to calculate fee');
      const data = await response.json();
      return data.fee ?? 0;
    } catch (error) {
      console.error('Error calculating fee:', error);
      return 0;
    }
  };

  const addVehicle = async (licensePlate: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/vehicles/entry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ licensePlate }),
      });
      if (!response.ok) throw new Error('Failed to add vehicle');
      await fetchVehicles();
    } catch (error) {
      console.error('Error adding vehicle:', error);
    }
  };

  const exitVehicle = async (id: string) => {
    try {
      const vehicle = vehicles.find((v) => v.id === id);
      if (!vehicle) return;

      const response = await fetch(`${API_BASE_URL}/vehicles/exit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ licensePlate: vehicle.licensePlate }),
      });
      if (!response.ok) throw new Error('Failed to exit vehicle');
      await fetchVehicles();
    } catch (error) {
      console.error('Error exiting vehicle:', error);
    }
  };

  const processPayment = async (id: string) => {
    try {
      const vehicle = vehicles.find((v) => v.id === id);
      if (!vehicle) return;

      const response = await fetch(`${API_BASE_URL}/vehicles/payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ licensePlate: vehicle.licensePlate }),
      });
      if (!response.ok) throw new Error('Failed to process payment');
      await fetchVehicles();
    } catch (error) {
      console.error('Error processing payment:', error);
    }
  };

  const toggleBlocklist = async (licensePlate: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/vehicles/blocklist/toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ licensePlate }),
      });
      if (!response.ok) throw new Error('Failed to toggle blocklist');
      await fetchVehicles();
    } catch (error) {
      console.error('Error toggling blocklist:', error);
    }
  };

  const overrideGate = (action: 'open' | 'close', gate: 'entry' | 'exit') => {
    // This would connect to a real gate control system
    console.log(`Gate ${gate} ${action}ed manually`);
  };

  const searchVehicles = (query: string): Vehicle[] => {
    if (!query.trim()) return vehicles;

    const lowerQuery = query.toLowerCase();
    return vehicles.filter((v) => {
      const entryTimeStr = v.entryTime ? new Date(v.entryTime).toDateString().toLowerCase() : '';
      return (
        v.licensePlate.toLowerCase().includes(lowerQuery) ||
        v.id.toLowerCase().includes(lowerQuery) ||
        entryTimeStr.includes(lowerQuery)
      );
    });
  };

  const value: ParkingContextProps = {
    vehicles,
    users,
    stats,
    parkingRate,
    addVehicle,
    exitVehicle,
    processPayment,
    toggleBlocklist,
    overrideGate,
    searchVehicles,
    calculateFee,
    totalCapacity,
  };

  return <ParkingContext.Provider value={value}>{children}</ParkingContext.Provider>;
};
