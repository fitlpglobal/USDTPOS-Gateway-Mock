export interface ApiEndpoint {
  id: string;
  name: string;
  method: string;
  path: string;
  description: string;
  requestSchema: Record<string, string>;
  responseSchema: Record<string, string>;
  color: string; // UI hue tag
}

export interface ApiResponse {
  status: number;
  statusText: string;
  data: Record<string, unknown>;
  headers?: Record<string, string>;
}
