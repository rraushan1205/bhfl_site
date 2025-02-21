import { useState } from 'react';
import Head from 'next/head';
import Select from 'react-select';

export default function Home() {
  const [inputData, setInputData] = useState('');
  const [error, setError] = useState('');
  const [response, setResponse] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const filterOptions = [
    { value: 'alphabets', label: 'Alphabets' },
    { value: 'numbers', label: 'Numbers' },
    { value: 'highest_alphabet', label: 'Highest Alphabet' }
  ];

  const processData = async (e) => {
    e.preventDefault();
    setError('');
    setResponse(null);

    try {
      const parsedData = JSON.parse(inputData);
      if (!parsedData.data || !Array.isArray(parsedData.data)) {
        throw new Error('Input must be a JSON object with a "data" array');
      }

      setIsProcessing(true);
      const result = await fetch('/api/bfhl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: inputData,
      });

      const data = await result.json();
      if (!data.is_success) {
        throw new Error(data.error || 'Failed to process data');
      }

      setResponse(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const displayResponse = () => {
    if (!response || selectedFilters.length === 0) return null;

    const selectedFields = selectedFilters.map(filter => filter.value);
    
    return (
      <div className="mt-6 bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold mb-4">Results:</h3>
        {selectedFields.map(field => {
          if (!response[field]?.length) return null;
          
          return (
            <div key={field} className="mb-4">
              <p className="font-medium capitalize">{field.replace('_', ' ')}:</p>
              <p className="ml-4 text-gray-700">[{response[field].join(', ')}]</p>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen py-8 bg-gray-50">
      <Head>
        <title>YOUR_ROLL_NUMBER</title>
        <meta name="description" content="Data Processing Application" />
      </Head>

      <main className="container mx-auto px-4 max-w-2xl">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
          Data Processing Application
        </h1>
        
        <form onSubmit={processData} className="bg-white p-6 rounded-lg shadow-lg">
          <div className="mb-4">
            <label htmlFor="jsonInput" className="block text-sm font-medium text-gray-700 mb-2">
              Enter JSON Data
            </label>
            <textarea
              id="jsonInput"
              value={inputData}
              onChange={(e) => setInputData(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 shadow-sm"
              rows="4"
              placeholder='{ "data": ["A", "1", "B", "2", "C", "3"] }'
            />
          </div>

          <button
            type="submit"
            disabled={isProcessing}
            className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ${
              isProcessing ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isProcessing ? 'Processing...' : 'Process Data'}
          </button>

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
              {error}
            </div>
          )}
        </form>

        {response && (
          <div className="mt-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Display Filters
            </label>
            <Select
              isMulti
              options={filterOptions}
              value={selectedFilters}
              onChange={setSelectedFilters}
              className="basic-multi-select"
              classNamePrefix="select"
            />
            {displayResponse()}
          </div>
        )}
      </main>
    </div>
  );
}