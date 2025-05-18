import React from 'react';
import { BellRing, User, Clock } from 'lucide-react';
import { format } from 'date-fns';

const Header: React.FC = () => {
  const [currentTime, setCurrentTime] = React.useState<Date>(new Date());
  
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="bg-white shadow-sm h-16 px-6 flex items-center justify-between">
      <div className="text-sm breadcrumbs text-gray-500">
        <ul>
          <li>Smart Parking</li>
          <li>Dashboard</li>
        </ul>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="flex items-center text-gray-600">
          <Clock size={18} className="mr-2" />
          <span>{format(currentTime, 'EEEE, MMMM d, yyyy h:mm:ss a')}</span>
        </div>
        
        <div className="relative">
          <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <BellRing size={20} className="text-gray-600" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
        </div>
        
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
            <User size={20} />
          </div>
          <div className="ml-2">
            <p className="text-sm font-medium text-gray-700">Admin User</p>
            <p className="text-xs text-gray-500">Administrator</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;