import { Vehicle, User } from '../types';

// Generate random license plates
const generateLicensePlate = () => {
  const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const numbers = '0123456789';
  
  let plate = '';
  
  // Format: 2 letters + 2 numbers + 3 letters
  for (let i = 0; i < 2; i++) plate += letters.charAt(Math.floor(Math.random() * letters.length));
  for (let i = 0; i < 2; i++) plate += numbers.charAt(Math.floor(Math.random() * numbers.length));
  for (let i = 0; i < 3; i++) plate += letters.charAt(Math.floor(Math.random() * letters.length));
  
  return plate;
};

// Generate random time within the last 24 hours
const generateRandomTime = (hoursAgo = 24) => {
  const now = new Date();
  const pastTime = new Date(now.getTime() - Math.random() * hoursAgo * 60 * 60 * 1000);
  return pastTime;
};

// Generate mock vehicles data
export const generateMockVehicles = (count: number): Vehicle[] => {
  const vehicles: Vehicle[] = [];
  
  for (let i = 0; i < count; i++) {
    const entryTime = generateRandomTime();
    const hasExited = Math.random() > 0.6;
    const exitTime = hasExited ? new Date(entryTime.getTime() + Math.random() * 3 * 60 * 60 * 1000) : undefined;
    const isPaid = hasExited ? Math.random() > 0.2 : Math.random() > 0.7;
    
    const hoursDiff = exitTime 
      ? (exitTime.getTime() - entryTime.getTime()) / (1000 * 60 * 60)
      : 0;
    
    const paymentAmount = isPaid ? parseFloat((hoursDiff * 2.5).toFixed(2)) : undefined;
    
    vehicles.push({
      id: (Date.now() - i * 1000).toString(),
      licensePlate: generateLicensePlate(),
      entryTime,
      exitTime,
      isPaid,
      paymentAmount,
      isBlocked: Math.random() > 0.95 // 5% chance of being blocked
    });
  }
  
  return vehicles;
};

// Generate mock user data
export const generateMockUsers = (): User[] => {
  return [
    {
      id: '1',
      username: 'admin',
      name: 'Admin User',
      role: 'admin',
      lastLogin: new Date()
    },
    {
      id: '2',
      username: 'operator1',
      name: 'Mohamed Bahir',
      role: 'operator',
      lastLogin: generateRandomTime(2)
    },
    {
      id: '3',
      username: 'viewer1',
      name: 'Bahir Hussain',
      role: 'viewer',
      lastLogin: generateRandomTime(5)
    }
  ];
};