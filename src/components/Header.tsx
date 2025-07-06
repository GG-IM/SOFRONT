import React from 'react';
import { Stethoscope, User, LogOut } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Header: React.FC = () => {
  const { currentUser, logout } = useApp();

  return (
    <header className="bg-white shadow-lg border-b border-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Stethoscope className="h-8 w-8 text-blue-600" />
              <div className="ml-3">
                <h1 className="text-xl font-bold text-gray-900">VitalCare</h1>
                <p className="text-xs text-gray-500">Sistema de Gestión Médica</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-gray-500" />
              <div className="text-sm">
                <div className="font-medium text-gray-900">{currentUser?.name}</div>
                <div className="text-gray-500 capitalize">
                  {currentUser?.role === 'receptionist' ? 'Recepcionista' : 'Médico'}
                </div>
              </div>
            </div>
            <button
              onClick={logout}
              className="p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              title="Cerrar sesión"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;