import React, { useMemo, useState } from 'react';
import { Search, Server } from 'lucide-react';
import type { ApiEndpoint, ApiResponse } from './types';
import { apiEndpoints, exampleRequests, generateMockResponse } from './data';
import { Sidebar } from './components/Sidebar';
import { EndpointDetails } from './components/EndpointDetails';
import { ResponseView } from './components/ResponseView';

export const ApiDoc: React.FC = () => {
  const defaultEndpoint = apiEndpoints[0]!; // We know this exists since we define the array
  const [selectedEndpoint, setSelectedEndpoint] = useState<ApiEndpoint>(defaultEndpoint);
  const [requestBody, setRequestBody] = useState<string>(JSON.stringify(exampleRequests[defaultEndpoint.id], null, 2));
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const filteredEndpoints = useMemo(() =>
    apiEndpoints.filter((endpoint) =>
      endpoint.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      endpoint.path.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    [searchTerm]
  );

  const updateRequestForEndpoint = (endpoint: ApiEndpoint) => {
    setRequestBody(JSON.stringify(exampleRequests[endpoint.id] || {}, null, 2));
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleTestEndpoint = async () => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    try {
      const data = generateMockResponse(selectedEndpoint.id, requestBody);
      const res: ApiResponse = {
        status: 200,
        statusText: 'OK',
        data,
        headers: {
          'content-type': 'application/json',
          'x-ratelimit-remaining': '99',
          'x-response-time': '127ms'
        }
      };
      setResponse(res);
    } catch (e) {
      setResponse({ status: 400, statusText: 'Bad Request', data: { error: 'Invalid request format' } });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Server className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Payment Gateway API</h1>
                <p className="text-sm text-gray-500">Mock API Testing Interface</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search endpoints..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>{apiEndpoints.length} endpoints active</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-4">
            <Sidebar
              endpoints={filteredEndpoints}
              selectedId={selectedEndpoint.id}
              onSelect={(ep) => {
                setSelectedEndpoint(ep);
                updateRequestForEndpoint(ep);
                setResponse(null);
              }}
            />
          </div>

          <div className="col-span-8">
            <div className="space-y-6">
              <EndpointDetails
                endpoint={selectedEndpoint}
                requestBody={requestBody}
                isLoading={isLoading}
                copiedField={copiedField}
                onChangeBody={setRequestBody}
                onCopy={copyToClipboard}
                onTest={handleTestEndpoint}
              />
              <ResponseView response={response} onCopy={copyToClipboard} copiedField={copiedField} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiDoc;
