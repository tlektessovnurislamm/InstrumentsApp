import React, { useState } from 'react';
import { read, utils, writeFile } from 'xlsx';

interface FileData {
  name: string;
  data: any[];
  columns: string[];
}

const MergeFiles = () => {
  const [files, setFiles] = useState<FileData[]>([]);
  const [mergeColumn, setMergeColumn] = useState<string>('');
  const [commonColumns, setCommonColumns] = useState<string[]>([]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if (!fileList) return;

    Array.from(fileList).forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = utils.sheet_to_json(worksheet);
        
        if (jsonData.length > 0) {
          const columns = Object.keys(jsonData[0]);
          const newFile: FileData = {
            name: file.name,
            data: jsonData,
            columns: columns,
          };
          
          setFiles(prevFiles => {
            const updatedFiles = [...prevFiles, newFile];
            updateCommonColumns(updatedFiles);
            return updatedFiles;
          });
        }
      };
      reader.readAsArrayBuffer(file);
    });
  };

  const updateCommonColumns = (files: FileData[]) => {
    if (files.length === 0) {
      setCommonColumns([]);
      return;
    }

    let common = [...files[0].columns];
    for (let i = 1; i < files.length; i++) {
      common = common.filter(col => files[i].columns.includes(col));
    }
    setCommonColumns(common);
    if (common.length > 0 && !mergeColumn) {
      setMergeColumn(common[0]);
    }
  };

  const handleMerge = () => {
    if (files.length < 2 || !mergeColumn) return;

    const mergedMap = new Map();

    // Process each file
    files.forEach((file, fileIndex) => {
      file.data.forEach(row => {
        const key = row[mergeColumn];
        if (!key) return;

        if (!mergedMap.has(key)) {
          mergedMap.set(key, {});
        }

        const mergedRow = mergedMap.get(key);
        Object.entries(row).forEach(([col, value]) => {
          const columnName = col === mergeColumn ? col : 
            files.some((f, i) => i !== fileIndex && f.columns.includes(col)) 
              ? `${col}_${file.name}`
              : col;
          mergedRow[columnName] = value;
        });
      });
    });

    const mergedData = Array.from(mergedMap.values());

    const worksheet = utils.json_to_sheet(mergedData);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, 'Merged Data');
    writeFile(workbook, 'merged_data.xlsx');
  };

  const removeFile = (index: number) => {
    setFiles(prevFiles => {
      const updatedFiles = prevFiles.filter((_, i) => i !== index);
      updateCommonColumns(updatedFiles);
      return updatedFiles;
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Объединять файлы</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Files to Merge (Excel or CSV)
          </label>
          <input
            type="file"
            accept=".xlsx,.xls,.csv"
            multiple
            onChange={handleFileUpload}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-indigo-50 file:text-indigo-700
              hover:file:bg-indigo-100"
          />
        </div>

        {files.length > 0 && (
          <>
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Загруженные файлы</h3>
              <div className="space-y-2">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                    <span className="text-gray-700">{file.name}</span>
                    <button
                      onClick={() => removeFile(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Удалять
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {commonColumns.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                Выберите столбец для объединения
                 </label>
                <select
                  value={mergeColumn}
                  onChange={(e) => setMergeColumn(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  {commonColumns.map(col => (
                    <option key={col} value={col}>{col}</option>
                  ))}
                </select>
              </div>
            )}

            <button
              onClick={handleMerge}
              disabled={files.length < 2 || !mergeColumn}
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400"
            >
              Объединять файлы
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default MergeFiles;