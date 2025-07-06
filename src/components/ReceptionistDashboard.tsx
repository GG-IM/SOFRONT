import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Plus, List, TrendingUp, Users } from 'lucide-react';
// import { useApp } from '../context/AppContext';
import AppointmentForm from './AppointmentForm';
import AppointmentList from './AppointmentList';
const API_URL = "https://soback-dwgchhasgecnfqc6.canadacentral-01.azurewebsites.net";
const ReceptionistDashboard: React.FC = () => {
  // const { appointments } = useApp();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [currentView, setCurrentView] = useState<'overview' | 'schedule' | 'appointments'>('overview');

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
  const confirmedAppointments = appointments.filter(app => app.status === 'confirmed');

  const stats = [
    {
      title: 'Citas Hoy',
      value: todayAppointments.length,
      icon: Calendar,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Pendientes',
      value: pendingAppointments.length,
      icon: Clock,
      color: 'bg-yellow-500',
      textColor: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      title: 'Confirmadas',
      value: confirmedAppointments.length,
      icon: Users,
      color: 'bg-green-500',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Total Citas',
      value: appointments.length,
      icon: TrendingUp,
      color: 'bg-purple-500',
      textColor: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
  ];

  const renderContent = () => {
    switch (currentView) {
      case 'schedule':
        return <AppointmentForm />;
      case 'appointments':
        return <AppointmentList />;
      default:
        return (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-all duration-200">
                <div className="text-center">
                  <div className="bg-blue-100 p-4 rounded-full w-fit mx-auto mb-4">
                    <Plus className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Agendar Nueva Cita</h3>
                  <p className="text-gray-600 mb-6">
                    Programa una nueva cita médica para un paciente
                  </p>
                  <button
                    onClick={() => setCurrentView('schedule')}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  >
                    Agendar Cita
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-all duration-200">
                <div className="text-center">
                  <div className="bg-green-100 p-4 rounded-full w-fit mx-auto mb-4">
                    <List className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Gestionar Citas</h3>
                  <p className="text-gray-600 mb-6">
                    Ver, editar y administrar todas las citas programadas
                  </p>
                  <button
                    onClick={() => setCurrentView('appointments')}
                    className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  >
                    Ver Citas
                  </button>
                </div>
              </div>
            </div>

            {/* Recent Appointments */}
            {todayAppointments.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg border border-gray-100">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center">
                    <Calendar className="h-6 w-6 text-blue-600 mr-3" />
                    Citas de Hoy
                  </h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {todayAppointments.slice(0, 5).map((appointment) => (
                      <div key={appointment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="bg-blue-100 p-2 rounded-lg">
                            <User className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{appointment.patientName}</p>
                            <p className="text-sm text-gray-600">{appointment.doctorName}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">{appointment.time}</p>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            appointment.status === 'confirmed' 
                              ? 'bg-green-100 text-green-800' 
                              : appointment.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {appointment.status === 'confirmed' ? 'Confirmada' : 
                             appointment.status === 'pending' ? 'Pendiente' : 'Cancelada'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-xl font-bold text-gray-900">Panel de Recepción</h1>
              <nav className="hidden md:flex space-x-8">
                <button
                  onClick={() => setCurrentView('overview')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentView === 'overview'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  Resumen
                </button>
                <button
                  onClick={() => setCurrentView('schedule')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentView === 'schedule'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  Agendar Citas
                </button>
                <button
                  onClick={() => setCurrentView('appointments')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentView === 'appointments'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  Ver Citas
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default ReceptionistDashboard;