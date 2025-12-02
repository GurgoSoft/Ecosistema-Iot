// Tipos para dispositivos IoT
export interface Device {
  id: string;
  name: string;
  type: DeviceType;
  status: DeviceStatus;
  location: string;
  lastUpdate: Date;
  data?: DeviceData;
}

export enum DeviceType {
  SENSOR = 'sensor',
  ACTUATOR = 'actuator',
  GATEWAY = 'gateway',
  CONTROLLER = 'controller'
}

export enum DeviceStatus {
  ONLINE = 'online',
  OFFLINE = 'offline',
  ERROR = 'error',
  MAINTENANCE = 'maintenance'
}

export interface DeviceData {
  temperature?: number;
  humidity?: number;
  pressure?: number;
  voltage?: number;
  current?: number;
  power?: number;
  [key: string]: any;
}

// Tipos para usuarios
export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  createdAt: Date;
}

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  VIEWER = 'viewer'
}