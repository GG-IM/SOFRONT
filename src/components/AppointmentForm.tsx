import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, FileText, Plus } from 'lucide-react';
// import { useApp } from '../context/AppContext';
// import { mockDoctors } from '../data/mockData';
const API_URL = "https://soback-dwgchhasgecnfqc6.canadacentral-01.azurewebsites.net";
const AppointmentForm: React.FC = () => {
  // const { addAppointment } = useApp();
  const [formData, setFormData] = useState({
    doctorId: '',
    name: '',
    phone: '',
    date: '',
    time: '',
    reason: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [doctors, setDoctors] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${API_URL}/api/doctors`)
      .then(res => res.json())
      .then(data => setDoctors(data))
      .catch(() => setDoctors([]));
  }, []);

  const timeSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '12:00', '12:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.doctorId) newErrors.doctorId = 'Seleccione un médico';
    if (!formData.name.trim()) newErrors.name = 'Ingrese el nombre del paciente';
    if (!formData.phone.trim()) newErrors.phone = 'Ingrese el teléfono del paciente';
    if (!formData.date) newErrors.date = 'Seleccione una fecha';
    if (!formData.time) newErrors.time = 'Seleccione una hora';
    if (!formData.reason.trim()) newErrors.reason = 'Ingrese el motivo de la consulta';

    // Validate date is not in the past
    if (formData.date) {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.date = 'La fecha no puede ser anterior a hoy';
      }
    }

    // Validate phone format (basic validation)
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
    if (formData.phone && !phoneRegex.test(formData.phone)) {
      newErrors.phone = 'Formato de teléfono inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Combina fecha y hora en formato MySQL
    const dateTime = `${formData.date} ${formData.time}:00`;

    // NOTA: Aquí deberías obtener el patient_id real según tu lógica de autenticación
    const appointmentData = {
      doctor_id: formData.doctorId,
      name: formData.name,
      phone: formData.phone,
      date: dateTime,
      reason: formData.reason,
      status: 'pending'
    };

    try {
      const res = await fetch(`${API_URL}/api/appointments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(appointmentData)
      });
      if (res.ok) {
        setFormData({
          doctorId: '',
          name: '',
          phone: '',
          date: '',
          time: '',
          reason: '',
        });
        setErrors({});
        alert('Cita agendada correctamente');
      } else {
        const error = await res.json();
        alert('Error al agendar cita: ' + error.error);
      }
    } catch (err) {
      alert('Error de conexión con el backend');
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const availableDoctors = doctors.filter(doctor => doctor.available !== false);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-xl shadow-lg border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center">
            <Plus className="h-6 w-6 text-blue-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">Agendar Nueva Cita</h2>
          </div>
          <p className="text-gray-600 mt-1">Complete el formulario para agendar una cita médica</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Doctor Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="h-4 w-4 inline mr-1" />
                Médico
              </label>
              <select
                value={formData.doctorId}
                onChange={(e) => handleInputChange('doctorId', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.doctorId ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Seleccionar médico</option>
                {availableDoctors.map(doctor => (
                  <option key={doctor.id} value={doctor.id}>
                    {doctor.name} - {doctor.specialty}
                  </option>
                ))}
              </select>
              {errors.doctorId && <p className="text-red-500 text-xs mt-1">{errors.doctorId}</p>}
            </div>

            {/* Patient Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="h-4 w-4 inline mr-1" />
                Nombre del Paciente
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ingrese el nombre completo"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            {/* Patient Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Teléfono del Paciente
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.phone ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="+1234567890"
              />
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="h-4 w-4 inline mr-1" />
                Fecha
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.date ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
            </div>

            {/* Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="h-4 w-4 inline mr-1" />
                Hora
              </label>
              <select
                value={formData.time}
                onChange={(e) => handleInputChange('time', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.time ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Seleccionar hora</option>
                {timeSlots.map(time => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
              {errors.time && <p className="text-red-500 text-xs mt-1">{errors.time}</p>}
            </div>
          </div>

          {/* Reason */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FileText className="h-4 w-4 inline mr-1" />
              Motivo de la Consulta
            </label>
            <textarea
              value={formData.reason}
              onChange={(e) => handleInputChange('reason', e.target.value)}
              rows={4}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.reason ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Describa el motivo de la consulta médica..."
            />
            {errors.reason && <p className="text-red-500 text-xs mt-1">{errors.reason}</p>}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => {
                setFormData({
                  doctorId: '',
                  name: '',
                  phone: '',
                  date: '',
                  time: '',
                  reason: '',
                });
                setErrors({});
              }}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Limpiar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              Agendar Cita
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppointmentForm;