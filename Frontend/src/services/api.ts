import axios from 'axios';
import { Device, User } from '../types';

// URL base de la API (configurar según el backend)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Instancia de axios configurada
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token de autenticación
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Servicios para dispositivos
export const deviceService = {
  // Obtener todos los dispositivos
  getAllDevices: async (): Promise<Device[]> => {
    const response = await api.get('/devices');
    return response.data;
  },

  // Obtener dispositivo por ID
  getDeviceById: async (id: string): Promise<Device> => {
    const response = await api.get(`/devices/${id}`);
    return response.data;
  },

  // Crear nuevo dispositivo
  createDevice: async (device: Omit<Device, 'id'>): Promise<Device> => {
    const response = await api.post('/devices', device);
    return response.data;
  },

  // Actualizar dispositivo
  updateDevice: async (id: string, device: Partial<Device>): Promise<Device> => {
    const response = await api.put(`/devices/${id}`, device);
    return response.data;
  },

  // Eliminar dispositivo
  deleteDevice: async (id: string): Promise<void> => {
    await api.delete(`/devices/${id}`);
  },
};

// Servicios para autenticación
export const authService = {
  // Iniciar sesión
  login: async (username: string, password: string): Promise<{ user: User; token: string }> => {
    const response = await api.post('/auth/login', { username, password });
    return response.data;
  },

  // Registrar usuario
  register: async (userData: { 
    username: string; 
    email: string; 
    password: string;
    firstName: string;
    lastName: string;
    areaOfWork: string;
    companyName: string;
    companyWebsite: string;
    phone?: string;
  }): Promise<any> => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // Cerrar sesión
  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
    localStorage.removeItem('token');
  },

  // Obtener usuario actual
  getCurrentUser: async (): Promise<User> => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

export default api;