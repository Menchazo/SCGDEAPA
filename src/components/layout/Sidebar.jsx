import React from 'react';
import { Users, Calendar, Gift, Heart, Shield, LogOut, Activity, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const UPTAG_LOGO_URL = "https://i.ibb.co/9FtcY2z/366288-removebg-preview.png";

const Sidebar = ({ currentView, setCurrentView, handleLogout, sidebarOpen, setSidebarOpen }) => {
  const navItems = [
    { id: 'dashboard', label: 'Panel Principal', icon: Activity },
    { id: 'elders', label: 'Adultos Mayores', icon: Users },
    { id: 'activities', label: 'Actividades', icon: Calendar },
    { id: 'raffles', label: 'Rifas', icon: Gift },
    { id: 'nutrition', label: 'Nutrición', icon: Heart },
    { id: 'health', label: 'Salud', icon: Shield },
  ];

  const handleNavClick = (view) => {
    setCurrentView(view);
    setSidebarOpen(false); // Close sidebar on mobile after navigation
  };

  return (
    <div className={`fixed inset-y-0 left-0 z-50 w-64 glass-effect transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 lg:translate-x-0`}>
      <div className="flex items-center justify-between p-4 border-b border-white/20">
        <div className="flex items-center space-x-3">
          <img src={UPTAG_LOGO_URL} alt="UPTAG Logo" className="w-10 h-10" />
          <div>
            <h2 className="font-bold text-gray-800">Sistema de Gestión</h2>
            <p className="text-sm text-gray-600">Pantano Abajo I</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      <nav className="p-4 space-y-2">
        {navItems.map(item => (
          <button 
            key={item.id} 
            className={`sidebar-item ${currentView === item.id ? 'active' : ''}`}
            onClick={() => handleNavClick(item.id)}
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="absolute bottom-4 left-4 right-4">
        <Button
          variant="ghost"
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5 mr-3" />
          Cerrar Sesión
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
