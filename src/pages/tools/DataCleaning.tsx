import React, { useState } from 'react';
import { read, utils, writeFile } from 'xlsx';

interface Column {
  name: string;
  type: 'text' | 'number' | 'date';
  format?: string;
}

const DataCleaning = () => {
  const [data, setData] = useState<any[]>([]);
  const [columns, setColumns] = useState<Column[]>([]);
  const [cleanedData, setCleanedData] = useState<any[]>([]);
  const [stats, setStats] = useState<{
    duplicatesRemoved: number;
    formattingFixed: number;
    nullsFixed: number;
  }>({ duplicatesRemoved: 0, formattingFixed: 0, nullsFixed: 0 });

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
        setData(jsonData);
        const cols = Object.keys(jsonData[0]).map(name => ({
          name,
          type: 'text' as const
        }));
        setColumns(cols);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const inferColumnType = (value: any): 'text' | 'number' | 'date' => {
    if (typeof value === 'number') return 'number';
    if (!isNaN(Date.parse(value))) return 'date';
    return 'text';
  };

  const cleanData = () => {
    let duplicatesRemoved = 0;
    let formattingFixed = 0;
    let nullsFixed = 0;

    const uniqueRows = new Map();
    data.forEach(row => {
      const key = JSON.stringify(row);
      if (!uniqueRows.has(key)) {
        uniqueRows.set(key, row);
      } else {
        duplicatesRemoved++;
      }
    });

    const cleaned = Array.from(uniqueRows.values()).map(row => {
      const cleanedRow: any = {};
      
      columns.forEach(col => {
        let value = row[col.name];
        
        if (value === null || value === undefined || value === '') {
          nullsFixed++;
          value = col.type === 'number' ? 0 : col.type === 'date' ? new Date().toISOString() : '';
        }

        if (col.type === 'number' && typeof value === 'string') {
          const num = parseFloat(value.replace(/[^0-9.-]/g, ''));
          if (!isNaN(num)) {
            value = num;
            formattingFixed++;
          }
        } else if (col.type === 'date' && value) {
          const date = new Date(value);
          if (date.toString() !== 'Invalid Date') {
            value = date.toISOString().split('T')[0];
            formattingFixed++;
          }
        } else if (col.type === 'text' && typeof value !== 'string') {
          value = String(value);
          formattingFixed++;
        }

        cleanedRow[col.name] = value;
      });

      return cleanedRow;
    });

    setCleanedData(cleaned);
    setStats({ duplicatesRemoved, formattingFixed, nullsFixed });
  };

  const downloadCleanedData = () => {
    if (cleanedData.length === 0) return;

    const worksheet = utils.json_to_sheet(cleanedData);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, 'Очищенные данные');
    writeFile(workbook, 'cleaned_data.xlsx');
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Очистка данных</h1>
      
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
          <>
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Настройки столбца</h3>
              <div className="space-y-4">
                {columns.map((col, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <span className="w-1/3">{col.name}</span>
                    <select
                      value={col.type}
                      onChange={(e) => {
                        const newColumns = [...columns];
                        newColumns[index].type = e.target.value as any;
                        setColumns(newColumns);
                      }}
                      className="w-1/3 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    >
                      <option value="text">Text</option>
                      <option value="number">Number</option>
                      <option value="date">Date</option>
                    </select>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={cleanData}
                className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700"
              >
                Чистые данные
              </button>
              {cleanedData.length > 0 && (
                <button
                  onClick={downloadCleanedData}
                  className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700"
                >
                  Загрузка очищенных данных
                </button>
              )}
            </div>
          </>
        )}
      </div>

      {cleanedData.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Результаты очистки</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Удалены дубликаты</p>
              <p className="text-2xl font-semibold">{stats.duplicatesRemoved}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Исправлено форматирование</p>
              <p className="text-2xl font-semibold">{stats.formattingFixed}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Фиксированные значения Null</p>
              <p className="text-2xl font-semibold">{stats.nullsFixed}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataCleaning;