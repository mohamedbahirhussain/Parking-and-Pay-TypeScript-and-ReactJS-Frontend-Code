export interface Vehicle {
  id: string;
  licensePlate: string;
  entryTime: Date;
  exitTime?: Date;
  isPaid: boolean;
  paymentAmount?: number;
  isBlocked: boolean;
}

export interface User {
  id: string;
  username: string;
  name: string;
  role: 'admin' | 'operator' | 'viewer';
  lastLogin?: Date;
}

export interface DashboardStats {
  totalVehicles: number;
  availableSpaces: number;
  todayRevenue: number;
  unpaidSessions: number;
}

export interface ParkingRate {
  hourlyRate: number;
  minimumCharge: number;
  dayMaximum: number;
}