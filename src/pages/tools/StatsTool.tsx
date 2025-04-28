import React, { useState } from 'react';
import { read, utils } from 'xlsx';

interface Stats {
  mean: number;
  median: number;
  mode: number[];
  standardDeviation: number;
  min: number;
  max: number;
  count: number;
}

const StatsTool = () => {
  const [selectedColumn, setSelectedColumn] = useState<string>('');
  const [columns, setColumns] = useState<string[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [data, setData] = useState<any[]>([]);

  const calculateStats = (numbers: number[]): Stats => {
    if (numbers.length === 0) {
      return {
        mean: 0,
        median: 0,
        mode: [0],
        standardDeviation: 0,
        min: 0,
        max: 0,
        count: 0
      };
    }

    const sorted = [...numbers].sort((a, b) => a - b);
    const count = numbers.length;
    
    const mean = numbers.reduce((a, b) => a + b, 0) / count;
    
    const median = count % 2 === 0
      ? (sorted[count / 2 - 1] + sorted[count / 2]) / 2
      : sorted[Math.floor(count / 2)];
    
    const frequency: { [key: number]: number } = {};
    let maxFreq = 0;
    numbers.forEach(num => {
      frequency[num] = (frequency[num] || 0) + 1;
      maxFreq = Math.max(maxFreq, frequency[num]);
    });
    const mode = Object.entries(frequency)
      .filter(([, freq]) => freq === maxFreq)
      .map(([num]) => Number(num));
    
    const variance = numbers.reduce((acc, num) => acc + Math.pow(num - mean, 2), 0) / count;
    const standardDeviation = Math.sqrt(variance);
    
    return {
      mean,
      median,
      mode,
      standardDeviation,
      min: sorted[0],
      max: sorted[sorted.length - 1],
      count,
    };
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = read(data, { type: 'array' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = utils.sheet_to_json(worksheet);
      
      if (jsonData.length > 0) {
        const cols = Object.keys(jsonData[0]);
        setColumns(cols);
        setSelectedColumn(cols[0]);
        setData(jsonData);
        
        const numbers = jsonData
          .map(row => Number(row[cols[0]]))
          .filter(n => !isNaN(n));
        setStats(calculateStats(numbers));
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleColumnChange = (column: string) => {
    setSelectedColumn(column);
    const numbers = data
      .map(row => Number(row[column]))
      .filter(n => !isNaN(n));
    setStats(calculateStats(numbers));
  };

  const formatNumber = (value: number): string => {
    return value.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Статистический калькулятор</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Data File (Excel or CSV)
          </label>
          <input
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleFileUpload}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-indigo-50 file:text-indigo-700
              hover:file:bg-indigo-100"
          />
        </div>

        {columns.length > 0 && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
            Выберите столбец для анализа
            </label>
            <select
              value={selectedColumn}
              onChange={(e) => handleColumnChange(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              {columns.map(col => (
                <option key={col} value={col}>{col}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {stats && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Результаты статистического анализа</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Mean</p>
              <p className="text-2xl font-semibold">{formatNumber(stats.mean)}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Median</p>
              <p className="text-2xl font-semibold">{formatNumber(stats.median)}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Mode</p>
              <p className="text-2xl font-semibold">
                {stats.mode.map(formatNumber).join(', ')}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Стандартное отклонение</p>
              <p className="text-2xl font-semibold">{formatNumber(stats.standardDeviation)}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Диапазон</p>
              <p className="text-2xl font-semibold">
                {formatNumber(stats.min)} - {formatNumber(stats.max)}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Количество</p>
              <p className="text-2xl font-semibold">{stats.count}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatsTool;