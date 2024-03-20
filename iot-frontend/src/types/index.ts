// TypeScript type definitions can be placed here to ensure type safety throughout the codebase.

interface DynamicMetricData {
  client_name: string;
  client_id: string;
  device_id: string;
  device_key: string;
  [key: string]: string | { timestamp: number; value: string } | undefined;
}

interface SpinnerProps {
  className?: string; // Optional string prop
}
