import { Doctor, Appointment, User } from '../types';

export const mockDoctors: Doctor[] = [
  { id: '1', name: 'Dr. María García', specialty: 'Medicina General', available: true },
  { id: '2', name: 'Dr. Carlos Rodríguez', specialty: 'Cardiología', available: true },
  { id: '3', name: 'Dra. Ana López', specialty: 'Pediatría', available: true },
  { id: '4', name: 'Dr. Luis Martínez', specialty: 'Dermatología', available: false },
  { id: '5', name: 'Dra. Carmen Silva', specialty: 'Ginecología', available: true },
];

export const mockUsers: User[] = [
  { 
    id: '1', 
    name: 'Rosa Fernández', 
    email: 'recepcionista@vitalcare.com', 
    password: 'recepcionista123',
    role: 'receptionist' 
  },
  { 
    id: '2', 
    name: 'Dr. María García', 
    email: 'maria.garcia@vitalcare.com', 
    password: 'doctor123',
    role: 'doctor', 
    doctorId: '1' 
  },
  { 
    id: '3', 
    name: 'Dr. Carlos Rodríguez', 
    email: 'carlos.rodriguez@vitalcare.com', 
    password: 'doctor123',
    role: 'doctor', 
    doctorId: '2' 
  },
  { 
    id: '4', 
    name: 'Dra. Ana López', 
    email: 'ana.lopez@vitalcare.com', 
    password: 'doctor123',
    role: 'doctor', 
    doctorId: '3' 
  },
];

export const mockAppointments: Appointment[] = [
  {
    id: '1',
    doctorId: '1',
    doctorName: 'Dr. María García',
    patientName: 'Juan Pérez',
    patientPhone: '+1234567890',
    date: '2024-12-20',
    time: '09:00',
    reason: 'Consulta general de rutina',
    status: 'confirmed',
    createdAt: '2024-12-19T10:00:00Z'
  },
  {
    id: '2',
    doctorId: '2',
    doctorName: 'Dr. Carlos Rodríguez',
    patientName: 'María González',
    patientPhone: '+1234567891',
    date: '2024-12-20',
    time: '10:30',
    reason: 'Control cardiológico',
    status: 'pending',
    createdAt: '2024-12-19T11:00:00Z'
  },
  {
    id: '3',
    doctorId: '1',
    doctorName: 'Dr. María García',
    patientName: 'Pedro Martín',
    patientPhone: '+1234567892',
    date: '2024-12-21',
    time: '14:00',
    reason: 'Dolor de cabeza recurrente',
    status: 'pending',
    createdAt: '2024-12-19T12:00:00Z'
  },
  {
    id: '4',
    doctorId: '3',
    doctorName: 'Dra. Ana López',
    patientName: 'Sofia Ruiz',
    patientPhone: '+1234567893',
    date: '2024-12-22',
    time: '11:00',
    reason: 'Control pediátrico',
    status: 'pending',
    createdAt: '2024-12-19T13:00:00Z'
  },
];