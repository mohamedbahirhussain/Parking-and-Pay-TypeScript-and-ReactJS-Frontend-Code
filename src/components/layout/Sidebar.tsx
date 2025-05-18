import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Car, 
  CircleDollarSign, 
  ListFilter, 
  ShieldAlert, 
  Users, 
  Settings, 
  LogOut
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const navItems = [
    { path: '/', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { path: '/entry', icon: <Car size={20} />, label: 'Vehicle Entry' },
    { path: '/exit', icon: <Car size={20} />, label: 'Vehicle Exit' },
    { path: '/sessions', icon: <ListFilter size={20} />, label: 'Sessions' },
    { path: '/payments', icon: <CircleDollarSign size={20} />, label: 'Payments' },
    { path: '/blocklist', icon: <ShieldAlert size={20} />, label: 'Blocklist' },
    { path: '/users', icon: <Users size={20} />, label: 'Users' },
    { path: '/settings', icon: <Settings size={20} />, label: 'Settings' }
  ];

  return (
    <div className="flex flex-col h-full bg-gray-800 text-white w-64 p-4">
      <div className="flex items-center mb-8 px-2">
        <Car className="h-8 w-8 mr-2 text-blue-400" />
        <h1 className="text-xl font-bold">SmartPark</h1>
      </div>
      
      <nav className="flex-1">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) => 
                  `flex items-center px-3 py-2 rounded-md transition-colors ${
                    isActive 
                      ? 'bg-blue-700 text-white' 
                      : 'text-gray-300 hover:bg-gray-700'
                  }`
                }
              >
                <span className="mr-3">{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="mt-auto">
        <button className="flex items-center px-3 py-2 w-full text-gray-300 hover:bg-gray-700 rounded-md transition-colors">
          <LogOut size={20} className="mr-3" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;