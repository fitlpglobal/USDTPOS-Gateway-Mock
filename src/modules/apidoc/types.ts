export interface ApiEndpoint {
  id: string;
  name: string;
  method: string;
  path: string;
  description: string;
  requestSchema: any;
  responseSchema: any;
  color: string; // UI hue tag
}

export interface ApiResponse {
  status: number;
  statusText: string;
  data: any;
  headers?: Record<string, string>;
}
