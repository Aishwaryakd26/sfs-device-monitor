export type EnvironmentType = 'test' | 'quality' | 'production';

export interface AppEndpoints {
  config: string;
  devices: string;
  events: string;
  order: string;
}

export interface AppConfig {
  availableLanguages: string[];
  environment: EnvironmentType;
  environmentColour: 'blue' | 'orange' | 'red';
  environmentName: '[TEST]' | '[QUAL]' | '[PROD]' | string;
  endpoints: AppEndpoints;
}

export interface DeviceStatusEvent {
  timestamp: number;
  partsPerMinute: number;
  status: 'running' | 'stopped' | 'maintenance';
  deviceId: string;
  order: string;
}

export interface OrderInfo {
  orderNumber: string;
  productionTarget: number;
  productionState: number;
}

export interface ProductionInterrupt {
  id: string;
  deviceId: string;
  timestamp: number;
  status: 'stopped' | 'maintenance';
  durationSeconds?: number;
}

export interface TelemetryPoint {
  timestamp: Date;
  value: number;
}
