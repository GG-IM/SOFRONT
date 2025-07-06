import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Phone, FileText, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

const DoctorDashboard: React.FC = () => {
  const { currentUser, appointments } = useApp();
  const [doctorAppointments, setDoctorAppointments] = useState<any[]>([]);
  const [noteEdits, setNoteEdits] = useState<{ [key: number]: string }>({});

  // Obtener citas del doctor actual desde el backend
  useEffect(() => {
    const fetchDoctorAppointments = async () => {
      try {
        console.log('🔍 Obteniendo citas para el doctor:', currentUser?.id);
        const res = await fetch(`/api/appointments?doctor_id=${currentUser?.id}`);
        if (res.ok) {
          const data = await res.json();
          console.log('✅ Citas obtenidas:', data);
          setDoctorAppointments(data);
          
          // Si no hay citas filtradas, obtener todas para debug
          if (data.length === 0) {
            console.log('🔍 No hay citas filtradas, obteniendo todas las citas...');
            const allRes = await fetch('/api/appointments');
            if (allRes.ok) {
              const allData = await allRes.json();
              console.log('📋 Todas las citas disponibles:', allData);
            }
          }
        } else {
          console.log('❌ Error al obtener citas:', res.status);
          setDoctorAppointments([]);
        }
      } catch (error) {
        console.log('💥 Error de conexión:', error);
        setDoctorAppointments([]);
      }
    };

    if (currentUser?.id) {
      fetchDoctorAppointments();
    }
  }, [currentUser?.id]);

  // Actualizar estado de la cita
  const updateAppointment = async (id: number, update: any) => {
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(update)
      });
      if (res.ok) {
        // Actualizar la lista local
        setDoctorAppointments(prev =>
          prev.map(app => app.id === id ? { ...app, ...update } : app)
        );
        console.log('✅ Cita actualizada:', update);
      } else {
        console.log('❌ Error al actualizar cita:', res.status);
      }
    } catch (error) {
      console.log('💥 Error de conexión al actualizar:', error);
    }
  };

  // Filtrar citas por fecha y estado
  const todayAppointments = doctorAppointments.filter(
    appointment => appointment.date && appointment.date.split('T')[0] === new Date().toISOString().split('T')[0]
  );

  const upcomingAppointments = doctorAppointments.filter(
    appointment => new Date(appointment.date) > new Date()
  ).sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateA.getTime() - dateB.getTime();
  });

  const pendingAppointments = doctorAppointments.filter(
    appointment => appointment.status === 'pending'
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  };

  const handleConfirmAppointment = (appointmentId: number) => {
    const appointment = doctorAppointments.find(app => app.id === appointmentId);
    if (!appointment) return;
    updateAppointment(appointmentId, {
      doctor_id: appointment.doctor_id || appointment.doctorId,
      patient_id: appointment.patient_id || appointment.patientId,
      date: appointment.date,
      reason: appointment.reason,
      status: 'confirmed'
    });
  };

  const handleRejectAppointment = (appointmentId: number) => {
    const appointment = doctorAppointments.find(app => app.id === appointmentId);
    if (!appointment) return;
    updateAppointment(appointmentId, {
      doctor_id: appointment.doctor_id || appointment.doctorId,
      patient_id: appointment.patient_id || appointment.patientId,
      date: appointment.date,
      reason: appointment.reason,
      status: 'cancelled'
    });
  };

  const handleNoteChange = (appointmentId: number, value: string) => {
    setNoteEdits(prev => ({ ...prev, [appointmentId]: value }));
  };

  const handleSaveNote = (appointment: any) => {
    updateAppointment(appointment.id, {
      doctor_id: appointment.doctor_id || appointment.doctorId,
      patient_id: appointment.patient_id || appointment.patientId,
      date: appointment.date,
      reason: appointment.reason,
      status: appointment.status,
      note: noteEdits[appointment.id] ?? appointment.note ?? ''
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

  console.log('👨‍⚕️ Doctor actual:', currentUser);
  console.log('📅 Citas del doctor:', doctorAppointments);
  console.log('⏰ Citas de hoy:', todayAppointments);
  console.log('⏳ Citas pendientes:', pendingAppointments);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 mb-6">
        <div className="px-6 py-4">
          <div className="flex items-center">
            <User className="h-6 w-6 text-blue-600 mr-3" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Panel del Médico</h2>
              <p className="text-gray-600">Bienvenido/a {currentUser?.name || 'Doctor'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Citas Hoy</p>
              <p className="text-2xl font-bold text-blue-600">{todayAppointments.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pendientes</p>
              <p className="text-2xl font-bold text-yellow-600">{pendingAppointments.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Citas</p>
              <p className="text-2xl font-bold text-green-600">{doctorAppointments.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Debug Info */}
      {doctorAppointments.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
            <div>
              <p className="text-sm font-medium text-yellow-800">No hay citas asignadas</p>
              <p className="text-xs text-yellow-700">ID del doctor: {currentUser?.id}</p>
            </div>
          </div>
        </div>
      )}

      {/* Pending Appointments */}
      {pendingAppointments.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center">
              <AlertCircle className="h-6 w-6 text-yellow-600 mr-3" />
              <h3 className="text-xl font-bold text-gray-900">Citas Pendientes de Confirmación</h3>
            </div>
          </div>
          <div className="p-6">
            <div className="grid gap-4">
              {pendingAppointments.map((appointment) => (
                <div key={appointment.id} className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 lg:mb-0">
                      <div className="flex items-center">
                        <User className="h-5 w-5 text-blue-600 mr-2" />
                        <div>
                          <p className="text-sm text-gray-600">Paciente</p>
                          <p className="font-medium text-gray-900">{appointment.patientName}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <Calendar className="h-5 w-5 text-purple-600 mr-2" />
                        <div>
                          <p className="text-sm text-gray-600">Fecha y Hora</p>
                          <p className="font-medium text-gray-900">
                            {formatDate(appointment.date)} - {formatTime(appointment.date)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <Phone className="h-5 w-5 text-orange-600 mr-2" />
                        <div>
                          <p className="text-sm text-gray-600">Teléfono</p>
                          <p className="font-medium text-gray-900">{appointment.patientPhone}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <FileText className="h-5 w-5 text-red-600 mr-2 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-600">Motivo</p>
                          <p className="font-medium text-gray-900">{appointment.reason}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleConfirmAppointment(appointment.id)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Confirmar
                      </button>
                      <button
                        onClick={() => handleRejectAppointment(appointment.id)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Rechazar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* All Appointments */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center">
            <Calendar className="h-6 w-6 text-blue-600 mr-3" />
            <h3 className="text-xl font-bold text-gray-900">Mis Citas Programadas</h3>
          </div>
        </div>
        
        <div className="p-6">
          {upcomingAppointments.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">No hay citas programadas</h4>
              <p className="text-gray-500">No tienes citas programadas próximamente</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {upcomingAppointments.map((appointment) => (
                <div key={appointment.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200">
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
                        <Calendar className="h-5 w-5 text-purple-600 mr-2" />
                        <div>
                          <p className="text-sm text-gray-500">Fecha y Hora</p>
                          <p className="font-medium text-gray-900">
                            {formatDate(appointment.date)}
                          </p>
                          <p className="text-sm text-gray-600">{formatTime(appointment.date)}</p>
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
                          <p className="text-sm text-gray-500">Motivo de la Consulta</p>
                          <p className="font-medium text-gray-900">{appointment.reason}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(appointment.status)}`}>
                        {getStatusText(appointment.status)}
                      </span>
                      <textarea
                        className="mt-2 w-64 p-2 border rounded-lg text-sm"
                        placeholder="Nota médica..."
                        value={noteEdits[appointment.id] !== undefined ? noteEdits[appointment.id] : (appointment.note || '')}
                        onChange={e => handleNoteChange(appointment.id, e.target.value)}
                        rows={3}
                      />
                      <button
                        className="mt-2 px-4 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                        onClick={() => handleSaveNote(appointment)}
                        type="button"
                      >
                        Guardar Nota
                      </button>
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

export default DoctorDashboard;