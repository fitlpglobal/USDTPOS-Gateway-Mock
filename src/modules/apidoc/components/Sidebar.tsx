import React from 'react';
import type { ApiEndpoint } from '../types';

interface Props {
  endpoints: ApiEndpoint[];
  selectedId: string;
  onSelect: (e: ApiEndpoint) => void;
}

export const Sidebar: React.FC<Props> = ({ endpoints, selectedId, onSelect }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">API Endpoints</h2>
        <p className="text-sm text-gray-500 mt-1">{endpoints.length} available</p>
      </div>
      <div className="divide-y divide-gray-200">
        {endpoints.map((endpoint) => (
          <button
            key={endpoint.id}
            onClick={() => onSelect(endpoint)}
            className={`w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors ${
              selectedId === endpoint.id ? 'bg-blue-50 border-r-2 border-blue-500' : ''
            }`}
          >
            <div className="flex items-start space-x-3">
              <div className={`${endpoint.color} p-2 rounded-lg flex-shrink-0`}>
                <div className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded text-gray-700">
                    {endpoint.method}
                  </span>
                </div>
                <p className="font-medium text-gray-900 mb-1">{endpoint.name}</p>
                <p className="text-xs text-gray-500 font-mono">{endpoint.path}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
