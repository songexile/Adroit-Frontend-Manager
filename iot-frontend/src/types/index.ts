// TypeScript type definitions can be placed here to ensure type safety throughout the codebase.

import { User, Session } from "next-auth";
import { JWT } from "next-auth/jwt";

export interface CustomUser extends User {
  given_name: string;
  family_name: string;
  email: string;
}

export interface CustomSession extends Session {
  user: CustomUser;
}

export interface CustomToken extends JWT {
  given_name: string;
  family_name: string;
}

export interface DynamicMetricData {
  client_name: string;
  client_id: string;
  device_id: string;
  device_key: string;
  [key: string]: string | { timestamp: number; value: string } | undefined;
}

export interface SpinnerProps {
  className?: string; // Optional string prop
}

export interface HeaderProps {
  fetchDataAndUpdate?: () => Promise<void>;
  searchByClientName?: string;
  setSearchByClientName?: (value: string) => void;
  searchByDeviceKey?: string;
  setSearchByDeviceKey?: (value: string) => void;
  totalDevicesOfflineCount?: number;
  clientsOfflineCount?: number;
}

export interface RequestBody {
  to: string
  subject: string
  message: string
  deviceData: DynamicMetricData
}

export interface ToggleSwitchProps {
  text: string
  initialValue?: boolean
}
