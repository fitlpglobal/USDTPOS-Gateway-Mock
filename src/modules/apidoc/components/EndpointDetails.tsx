import React from 'react';
import type { ApiEndpoint } from '../types';
import { CheckCircle, Copy, Play, Clock } from 'lucide-react';

interface Props {
  endpoint: ApiEndpoint;
  requestBody: string;
  isLoading: boolean;
  copiedField: string | null;
  onChangeBody: (v: string) => void;
  onCopy: (text: string, field: string) => void;
  onTest: () => void;
}

export const EndpointDetails: React.FC<Props> = ({
  endpoint,
  requestBody,
  isLoading,
  copiedField,
  onChangeBody,
  onCopy,
  onTest
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{endpoint.name}</h3>
            <p className="text-sm text-gray-500 mt-1">{endpoint.description}</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono bg-green-100 text-green-800 px-2 py-1 rounded">
              {endpoint.method}
            </span>
            <button
              onClick={() => onCopy(endpoint.path, 'path')}
              className="flex items-center space-x-1 text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded transition-colors"
            >
              {copiedField === 'path' ? <CheckCircle className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              <span className="font-mono">{endpoint.path}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Request Schema</h4>
            <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm">
              <pre className="text-gray-800">{JSON.stringify(endpoint.requestSchema, null, 2)}</pre>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Response Schema</h4>
            <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm">
              <pre className="text-gray-800">{JSON.stringify(endpoint.responseSchema, null, 2)}</pre>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-gray-900">Request Body</h4>
            <button onClick={() => onCopy(requestBody, 'request')} className="flex items-center space-x-1 text-xs text-gray-500 hover:text-gray-700">
              {copiedField === 'request' ? <CheckCircle className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              <span>Copy</span>
            </button>
          </div>
          <textarea
            value={requestBody}
            onChange={(e) => onChangeBody(e.target.value)}
            className="w-full h-32 font-mono text-sm border border-gray-300 rounded-lg p-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter JSON request body..."
          />
        </div>

        <button
          onClick={onTest}
          disabled={isLoading}
          className="flex items-center justify-center space-x-2 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-lg transition-colors"
        >
          {isLoading ? (
            <>
              <Clock className="w-4 h-4 animate-spin" />
              <span>Testing...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              <span>Test Endpoint</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
