import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Phone, FileText, Edit, Trash2, CheckCircle, XCircle, Filter } from 'lucide-react';

const AppointmentList: React.FC = () => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'cancelled'>('all');
  const [editingId, setEditingId] = useState<string | null>(null);

  // Obtener citas del backend
  useEffect(() => {
    fetch('http://localhost:3001/api/appointments')
      .then(res => res.json())
      .then(data => setAppointments(data))
      .catch(() => setAppointments([]));
  }, []);

  // Actualizar estado de la cita
  const updateAppointment = async (id: number, update: any) => {
    const res = await fetch(`http://localhost:3001/api/appointments/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(update)
    });
    if (res.ok) {
      setAppointments(prev =>
        prev.map(app => app.id === id ? { ...app, ...update } : app)
      );
    }
  };

  // Eliminar cita
  const deleteAppointment = async (id: number) => {
    const res = await fetch(`http://localhost:3001/api/appointments/${id}`, {
      method: 'DELETE'
    });
    if (res.ok) {
      setAppointments(prev => prev.filter(app => app.id !== id));
    }
  };

  const filteredAppointments = appointments.filter(appointment => {
    if (filter === 'all') return true;
    return appointment.status === filter;
  });

  const sortedAppointments = filteredAppointments.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateA.getTime() - dateB.getTime();
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ES-es', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmada';
      case 'pending':
        return 'Pendiente';
      case 'cancelled':
        return 'Cancelada';
      default:
        return status;
    }
  };

  const handleStatusChange = (appointmentId: number, newStatus: string) => {
    const appointment = appointments.find(app => app.id === appointmentId);
    if (!appointment) return;
    updateAppointment(appointmentId, {
      doctor_id: appointment.doctor_id || appointment.doctorId,
      patient_id: appointment.patient_id || appointment.patientId,
      date: appointment.date,
      reason: appointment.reason,
      status: newStatus
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-xl shadow-lg border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center mb-4 sm:mb-0">
              <Calendar className="h-6 w-6 text-blue-600 mr-3" />
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Gestión de Citas</h2>
                <p className="text-gray-600">Administra todas las citas médicas</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Todas</option>
                <option value="pending">Pendientes</option>
                <option value="confirmed">Confirmadas</option>
                <option value="cancelled">Canceladas</option>
              </select>
            </div>
          </div>
        </div>

        <div className="p-6">
          {sortedAppointments.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay citas</h3>
              <p className="text-gray-500">
                {filter === 'all' 
                  ? 'No hay citas programadas actualmente'
                  : `No hay citas ${getStatusText(filter).toLowerCase()}s`
                }
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {sortedAppointments.map((appointment) => (
                <div key={appointment.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-all duration-200">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4 lg:mb-0">
                      <div className="flex items-center">
                        <User className="h-5 w-5 text-blue-600 mr-2" />
                        <div>
                          <p className="text-sm text-gray-500">Paciente</p>
                          <p className="font-medium text-gray-900">{appointment.patientName}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <User className="h-5 w-5 text-green-600 mr-2" />
                        <div>
                          <p className="text-sm text-gray-500">Médico</p>
                          <p className="font-medium text-gray-900">{appointment.doctorName}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <Calendar className="h-5 w-5 text-purple-600 mr-2" />
                        <div>
                          <p className="text-sm text-gray-500">Fecha y Hora</p>
                          <p className="font-medium text-gray-900">
                            {formatDate(appointment.date)}
                          </p>
                          <p className="text-sm text-gray-600">{appointment.time}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <Phone className="h-5 w-5 text-orange-600 mr-2" />
                        <div>
                          <p className="text-sm text-gray-500">Teléfono</p>
                          <p className="font-medium text-gray-900">{appointment.patientPhone}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start md:col-span-2">
                        <FileText className="h-5 w-5 text-red-600 mr-2 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm text-gray-500">Motivo</p>
                          <p className="font-medium text-gray-900">{appointment.reason}</p>
                          {appointment.note && (
                            <div className="mt-2">
                              <p className="text-sm text-blue-500 font-medium">Nota del médico:</p>
                              <p className="text-gray-800 text-sm whitespace-pre-line bg-blue-50 rounded p-2">{appointment.note}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end space-y-2 sm:space-y-0 sm:space-x-2 lg:space-x-0 lg:space-y-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(appointment.status)}`}>
                        {getStatusText(appointment.status)}
                      </span>
                      
                      <div className="flex space-x-2">
                        {appointment.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleStatusChange(appointment.id, 'confirmed')}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Confirmar cita"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleStatusChange(appointment.id, 'cancelled')}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Cancelar cita"
                            >
                              <XCircle className="h-4 w-4" />
                            </button>
                          </>
                        )}
                        
                        <button
                          onClick={() => deleteAppointment(appointment.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Eliminar cita"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentList;