import React from 'react';
import { useParkingContext } from '../context/ParkingContext';
import { Car, CircleDollarSign, Clock, CalendarRange } from 'lucide-react';
import StatCard from '../components/dashboard/StatCard';
import VehicleStatusCard from '../components/dashboard/VehicleStatusCard';
import RecentVehicles from '../components/dashboard/RecentVehicles';

const Dashboard: React.FC = () => {
  const { stats } = useParkingContext();
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Available Spaces" 
          value={stats.availableSpaces}
          icon={<Car className="h-6 w-6 text-white" />}
          color="bg-blue-600"
          trend={{ value: 5, isUp: true }}
        />
        
        <StatCard 
          title="Total Vehicles" 
          value={stats.totalVehicles}
          icon={<Car className="h-6 w-6 text-white" />}
          color="bg-indigo-600"
          trend={{ value: 12, isUp: true }}
        />
        
        <StatCard 
          title="Today's Revenue" 
          value={`$${stats.todayRevenue.toFixed(2)}`}
          icon={<CircleDollarSign className="h-6 w-6 text-white" />}
          color="bg-green-600"
          trend={{ value: 8, isUp: true }}
        />
        
        <StatCard 
          title="Unpaid Sessions" 
          value={stats.unpaidSessions}
          icon={<Clock className="h-6 w-6 text-white" />}
          color="bg-amber-600"
          trend={{ value: 3, isUp: false }}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <VehicleStatusCard />
          
          <div className="bg-white rounded-lg shadow mt-6 p-5">
            <h3 className="text-lg font-medium mb-4">Today's Statistics</h3>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center text-sm mb-1">
                  <span className="text-gray-500">Entries</span>
                  <span className="font-medium">24</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '65%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center text-sm mb-1">
                  <span className="text-gray-500">Exits</span>
                  <span className="font-medium">18</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div className="bg-green-600 h-1.5 rounded-full" style={{ width: '45%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center text-sm mb-1">
                  <span className="text-gray-500">Payments</span>
                  <span className="font-medium">16</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div className="bg-amber-600 h-1.5 rounded-full" style={{ width: '40%' }}></div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center">
                <CalendarRange className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-sm text-gray-500">Weekly Report</span>
              </div>
              <button className="text-sm text-blue-600 hover:text-blue-800">View</button>
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-2">
          <RecentVehicles />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;