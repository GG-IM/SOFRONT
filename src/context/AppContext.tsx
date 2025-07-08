import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Appointment, User, Notification } from '../types';
import { mockAppointments, mockUsers } from '../data/mockData';
//import { useNavigate } from 'react-router-dom';
const API_URL = "https://soback-dwgchhasgecnfqc6.canadacentral-01.azurewebsites.net";
interface AppContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  appointments: Appointment[];
  notifications: Notification[];
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  addAppointment: (appointment: Omit<Appointment, 'id' | 'createdAt'>) => void;
  updateAppointment: (id: string, updates: Partial<Appointment>) => void;
  deleteAppointment: (id: string) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  clearNotification: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const getInitialUser = (): User | null => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }
  return null;
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(getInitialUser());
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!getInitialUser());
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const login = async (email: string, password: string): Promise<boolean> => {
    console.log('🔐 Contexto: Intentando login con:', { email });
    try {
      const res = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      console.log('📡 Contexto: Respuesta del servidor:', { status: res.status, ok: res.ok });
      
      if (res.ok) {
        const user = await res.json();
        console.log('✅ Contexto: Usuario recibido:', user);
        console.log('🎭 Contexto: Rol del usuario:', user.role);
        
        setCurrentUser(user);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(user));
        console.log('💾 Contexto: Usuario guardado en localStorage y estado actualizado');
        console.log('🔐 Contexto: Estado de autenticación actualizado - isAuthenticated:', true);
        console.log('👤 Contexto: Usuario actual:', user);
        addNotification({ type: 'success', message: `Bienvenido/a ${user.name}` });
        return true;
      } else {
        const errorData = await res.json();
        console.log('❌ Contexto: Error del servidor:', errorData);
        addNotification({ type: 'error', message: errorData.error || 'Credenciales incorrectas. Intente nuevamente.' });
        return false;
      }
    } catch (error) {
      console.log('💥 Contexto: Error de conexión:', error);
      addNotification({ type: 'error', message: 'Error de conexión con el servidor.' });
      return false;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    addNotification({
      type: 'info',
      message: 'Sesión cerrada exitosamente',
    });
    // Recargar la página para limpiar completamente el estado
    window.location.reload();
  };

  const fetchAppointments = async () => {
    try {
      const res = await fetch(`${API_URL}/api/appointments`);
      if (res.ok) {
        const data = await res.json();
        setAppointments(data);
      } else {
        addNotification({ type: 'error', message: 'No se pudieron obtener las citas.' });
      }
    } catch (error) {
      addNotification({ type: 'error', message: 'Error de conexión al obtener citas.' });
    }
  };

  React.useEffect(() => {
    fetchAppointments();
  }, []);

  const addAppointment = async (appointmentData: Omit<Appointment, 'id' | 'createdAt'>) => {
    try {
      const res = await fetch(`${API_URL}/api/appointments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(appointmentData),
      });
      if (res.ok) {
        await fetchAppointments();
        addNotification({ type: 'success', message: `Cita agendada exitosamente para ${appointmentData.patientName} con ${appointmentData.doctorName}` });
      } else {
        addNotification({ type: 'error', message: 'No se pudo agendar la cita.' });
      }
    } catch (error) {
      addNotification({ type: 'error', message: 'Error de conexión al agendar cita.' });
    }
  };

  const updateAppointment = async (id: string, updates: Partial<Appointment>) => {
    try {
      const res = await fetch(`${API_URL}/api/appointments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        await fetchAppointments();
        if (updates.status === 'confirmed') {
          addNotification({ type: 'success', message: 'Cita confirmada exitosamente' });
        } else if (updates.status === 'cancelled') {
          addNotification({ type: 'warning', message: 'Cita cancelada' });
        }
      } else {
        addNotification({ type: 'error', message: 'No se pudo actualizar la cita.' });
      }
    } catch (error) {
      addNotification({ type: 'error', message: 'Error de conexión al actualizar cita.' });
    }
  };

  const deleteAppointment = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/api/appointments/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        await fetchAppointments();
        addNotification({ type: 'info', message: 'Cita eliminada exitosamente' });
      } else {
        addNotification({ type: 'error', message: 'No se pudo eliminar la cita.' });
      }
    } catch (error) {
      addNotification({ type: 'error', message: 'Error de conexión al eliminar cita.' });
    }
  };

  const addNotification = (notificationData: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notificationData,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      read: false,
    };
    setNotifications(prev => [newNotification, ...prev]);
    
    // Auto-remove notification after 5 seconds
    setTimeout(() => {
      clearNotification(newNotification.id);
    }, 5000);
  };

  const clearNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      isAuthenticated,
      appointments,
      notifications,
      login,
      logout,
      addAppointment,
      updateAppointment,
      deleteAppointment,
      addNotification,
      clearNotification,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};