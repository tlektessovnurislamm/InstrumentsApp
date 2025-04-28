import React, { useState } from 'react';

interface CalculationResult {
  label: string;
  value: number;
  description: string;
}

const FinanceCalc = () => {
  const [calculationType, setCalculationType] = useState<'roi' | 'margin' | 'breakeven'>('roi');
  const [inputs, setInputs] = useState<{ [key: string]: number }>({});
  const [results, setResults] = useState<CalculationResult[]>([]);

  const calculations = {
    roi: {
      inputs: [
        { key: 'investment', label: 'Первоначальные инвестиции'},
        { key: 'returns', label: 'Возвращается'},
      ],
      calculate: (values: { [key: string]: number }) => {
        const roi = ((values.returns - values.investment) / values.investment) * 100;
        return [
          {
            label: 'ROI',
            value: roi,
            description: 'Процент окупаемости инвестиций',
          },
          {
            label: 'Чистая прибыль',
            value: values.returns - values.investment,
            description: 'Абсолютное возвращаемое значение',
          },
        ];
      },
    },
    margin: {
      inputs: [
        { key: 'revenue', label: 'Revenue' },
        { key: 'costs', label: 'Costs' },
      ],
      calculate: (values: { [key: string]: number }) => {
        const grossMargin = ((values.revenue - values.costs) / values.revenue) * 100;
        const markup = ((values.revenue - values.costs) / values.costs) * 100;
        return [
          {
            label: 'Валовая прибыль',
            value: grossMargin,
            description: 'Процент от выручки, остающейся после вычета затрат',
          },
          {
            label: 'Разметка',
            value: markup,
            description: 'Процентное увеличение по сравнению с затратами',
          },
        ];
      },
    },
    breakeven: {
      inputs: [
        { key: 'fixedCosts', label: 'Fixed Costs' },
        { key: 'pricePerUnit', label: 'Price Per Unit' },
        { key: 'variableCostPerUnit', label: 'Variable Cost Per Unit' },
      ],
      calculate: (values: { [key: string]: number }) => {
        const breakEvenUnits = values.fixedCosts / (values.pricePerUnit - values.variableCostPerUnit);
        const breakEvenRevenue = breakEvenUnits * values.pricePerUnit;
        return [
          {
            label: 'Единицы безубыточности',
            value: breakEvenUnits,
            description: 'Количество единиц для достижения безубыточности',
          },
          {
            label: 'Безубыточный доход',
            value: breakEvenRevenue,
            description: 'Выручка, необходимая для достижения безубыточности',
          },
        ];
      },
    },
  };

  const handleInputChange = (key: string, value: string) => {
    setInputs(prev => ({
      ...prev,
      [key]: parseFloat(value) || 0,
    }));
  };

  const handleCalculate = () => {
    const calc = calculations[calculationType];
    const results = calc.calculate(inputs);
    setResults(results);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Финансовый калькулятор</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Тип расчета
          </label>
          <select
            value={calculationType}
            onChange={(e) => {
              setCalculationType(e.target.value as any);
              setInputs({});
              setResults([]);
            }}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="roi">Калькулятор рентабельности инвестиций</option>
            <option value="margin">Калькулятор маржи</option>
            <option value="breakeven">Анализ безубыточности</option>
          </select>
        </div>

        <div className="space-y-4 mb-6">
          {calculations[calculationType].inputs.map(({ key, label }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {label}
              </label>
              <input
                type="number"
                value={inputs[key] || ''}
                onChange={(e) => handleInputChange(key, e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="0"
              />
            </div>
          ))}
        </div>

        <button
          onClick={handleCalculate}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700"
        >
          Calculate
        </button>
      </div>

      {results.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Результат</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {results.map((result, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">{result.label}</p>
                <p className="text-2xl font-semibold">
                  {result.value.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                  {result.label.toLowerCase().includes('percentage') ? '%' : ''}
                </p>
                <p className="text-sm text-gray-500 mt-1">{result.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FinanceCalc;