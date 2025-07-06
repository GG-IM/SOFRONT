import React, { useState, useEffect } from 'react';
import { Calendar, Users, Clock, TrendingUp, Heart, Shield } from 'lucide-react';
// import { useApp } from '../context/AppContext';
const API_URL = "https://soback-dwgchhasgecnfqc6.canadacentral-01.azurewebsites.net";
interface HomePageProps {
  onViewChange: (view: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onViewChange }) => {
  // Simula el usuario actual (ajusta según tu lógica real)
  const [currentUser] = useState<any>({
    name: 'Recepcionista',
    role: 'receptionist', // Cambia a 'doctor' para probar como doctor
  });
  const [appointments, setAppointments] = useState<any[]>([]);

  // Obtener citas del backend
  useEffect(() => {
    fetch(`${API_URL}/api/appointments`)
      .then(res => res.json())
      .then(data => setAppointments(data))
      .catch(() => setAppointments([]));
  }, []);

  const todayAppointments = appointments.filter(
    app => app.date && app.date.split('T')[0] === new Date().toISOString().split('T')[0]
  );

  const pendingAppointments = appointments.filter(app => app.status === 'pending');

  const stats = [
    {
      title: 'Citas Hoy',
      value: todayAppointments.length,
      icon: Calendar,
      color: 'bg-blue-500',
      textColor: 'text-blue-600'
    },
    {
      title: 'Citas Pendientes',
      value: pendingAppointments.length,
      icon: Clock,
      color: 'bg-yellow-500',
      textColor: 'text-yellow-600'
    },
    {
      title: 'Total Citas',
      value: appointments.length,
      icon: TrendingUp,
      color: 'bg-green-500',
      textColor: 'text-green-600'
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Sistema de Gestión de Citas Médicas
        </h1>
        <h2 className="text-2xl text-blue-600 font-semibold mb-6">
          Clínica VitalCare
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          Bienvenido{currentUser?.role === 'doctor' ? ' Dr./Dra.' : ''} {currentUser?.name}. 
          Gestiona citas médicas de manera eficiente y profesional.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {currentUser?.role === 'receptionist' && (
            <>
              <button
                onClick={() => onViewChange('schedule')}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                Agendar Nueva Cita
              </button>
              <button
                onClick={() => onViewChange('appointments')}
                className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                Ver Todas las Citas
              </button>
            </>
          )}
          {currentUser?.role === 'doctor' && (
            <button
              onClick={() => onViewChange('doctor')}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              Ver Mis Citas
            </button>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-200">
            <div className="flex items-center">
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className={`text-2xl font-bold ${stat.textColor}`}>{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-all duration-200 hover:-translate-y-1">
          <div className="bg-blue-100 p-4 rounded-lg w-fit mb-4">
            <Calendar className="h-8 w-8 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Gestión de Citas</h3>
          <p className="text-gray-600">
            Agenda, modifica y cancela citas médicas de manera rápida y eficiente.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-all duration-200 hover:-translate-y-1">
          <div className="bg-green-100 p-4 rounded-lg w-fit mb-4">
            <Users className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Gestión de Pacientes</h3>
          <p className="text-gray-600">
            Mantén un registro completo de pacientes y su historial de citas.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-all duration-200 hover:-translate-y-1">
          <div className="bg-purple-100 p-4 rounded-lg w-fit mb-4">
            <Heart className="h-8 w-8 text-purple-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Atención Personalizada</h3>
          <p className="text-gray-600">
            Brinda un servicio médico de calidad con seguimiento personalizado.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-all duration-200 hover:-translate-y-1">
          <div className="bg-yellow-100 p-4 rounded-lg w-fit mb-4">
            <Clock className="h-8 w-8 text-yellow-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Horarios Flexibles</h3>
          <p className="text-gray-600">
            Gestiona horarios de médicos y optimiza la disponibilidad de citas.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-all duration-200 hover:-translate-y-1">
          <div className="bg-red-100 p-4 rounded-lg w-fit mb-4">
            <TrendingUp className="h-8 w-8 text-red-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Reportes y Análisis</h3>
          <p className="text-gray-600">
            Genera reportes detallados sobre citas, médicos y rendimiento de la clínica.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-all duration-200 hover:-translate-y-1">
          <div className="bg-indigo-100 p-4 rounded-lg w-fit mb-4">
            <Shield className="h-8 w-8 text-indigo-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Seguridad de Datos</h3>
          <p className="text-gray-600">
            Protege la información médica con los más altos estándares de seguridad.
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 border border-blue-100">
        <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">Acciones Rápidas</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {currentUser?.role === 'receptionist' && (
            <>
              <button
                onClick={() => onViewChange('schedule')}
                className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 text-center group"
              >
                <Calendar className="h-8 w-8 text-blue-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <p className="font-medium text-gray-900">Nueva Cita</p>
              </button>
              <button
                onClick={() => onViewChange('appointments')}
                className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 text-center group"
              >
                <Users className="h-8 w-8 text-green-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <p className="font-medium text-gray-900">Ver Citas</p>
              </button>
            </>
          )}
          {currentUser?.role === 'doctor' && (
            <button
              onClick={() => onViewChange('doctor')}
              className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 text-center group"
            >
              <Heart className="h-8 w-8 text-purple-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <p className="font-medium text-gray-900">Mis Pacientes</p>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;