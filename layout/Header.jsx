import React from 'react';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = ({ title, setSidebarOpen }) => {
  return (
    <header className="glass-effect border-b border-white/20 p-4 sticky top-0 z-40">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-gray-800">
              {title}
            </h1>
            <p className="text-sm text-gray-600">
              Consejo Comunal Territorio Social Pantano Abajo I
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-800">Administrador</p>
            <p className="text-xs text-gray-600">Sistema de Gestión</p>
          </div>
          <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold">A</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;