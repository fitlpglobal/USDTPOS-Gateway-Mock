import React from 'react';
import type { ApiResponse } from '../types';
import { CheckCircle, Copy, XCircle } from 'lucide-react';

interface Props {
  response: ApiResponse | null;
  onCopy: (text: string, field: string) => void;
  copiedField: string | null;
}

export const ResponseView: React.FC<Props> = ({ response, onCopy, copiedField }) => {
  if (!response) return null;
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Response</h3>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              {response.status === 200 ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : (
                <XCircle className="w-4 h-4 text-red-500" />
              )}
              <span
                className={`text-sm font-medium ${
                  response.status === 200 ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {response.status} {response.statusText}
              </span>
            </div>
            <button
              onClick={() => onCopy(JSON.stringify(response.data, null, 2), 'response')}
              className="flex items-center space-x-1 text-xs text-gray-500 hover:text-gray-700"
            >
              {copiedField === 'response' ? <CheckCircle className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              <span>Copy</span>
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {response.headers && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Headers</h4>
            <div className="bg-gray-50 rounded-lg p-3 text-xs font-mono">
              {Object.entries(response.headers).map(([key, value]) => (
                <div key={key} className="flex justify-between py-1">
                  <span className="text-gray-600">{key}:</span>
                  <span className="text-gray-900">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-2">Body</h4>
          <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
            <pre className="text-green-400 text-sm">{JSON.stringify(response.data, null, 2)}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};
