import React, { useState } from 'react';
import { read, utils } from 'xlsx';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ChartTool = () => {
  const [chartData, setChartData] = useState<any>(null);
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');
  const [columns, setColumns] = useState<string[]>([]);
  const [selectedX, setSelectedX] = useState<string>('');
  const [selectedY, setSelectedY] = useState<string>('');

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
        setSelectedX(cols[0]);
        setSelectedY(cols[1]);
        
        updateChart(jsonData, cols[0], cols[1]);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const updateChart = (data: any[], xAxis: string, yAxis: string) => {
    const chartData = {
      labels: data.map(row => row[xAxis]),
      datasets: [
        {
          label: yAxis,
          data: data.map(row => row[yAxis]),
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
        },
      ],
    };
    setChartData(chartData);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Chart Tool</h1>
      
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chart Type
              </label>
              <select
                value={chartType}
                onChange={(e) => setChartType(e.target.value as 'line' | 'bar')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="line">Line Chart</option>
                <option value="bar">Bar Chart</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                X Axis
              </label>
              <select
                value={selectedX}
                onChange={(e) => setSelectedX(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                {columns.map(col => (
                  <option key={col} value={col}>{col}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Y Axis
              </label>
              <select
                value={selectedY}
                onChange={(e) => setSelectedY(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                {columns.map(col => (
                  <option key={col} value={col}>{col}</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {chartData && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="h-[400px]">
            {chartType === 'line' ? (
              <Line
                data={chartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top' as const,
                    },
                    title: {
                      display: true,
                      text: 'Data Visualization',
                    },
                  },
                }}
              />
            ) : (
              <Bar
                data={chartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top' as const,
                    },
                    title: {
                      display: true,
                      text: 'Data Visualization',
                    },
                  },
                }}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChartTool;