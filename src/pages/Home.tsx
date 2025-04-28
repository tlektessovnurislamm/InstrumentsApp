import React from 'react';
import { Link } from 'react-router-dom';
import { 
  BarChart2, 
  Calculator, 
  FilePlus, 
  FileSearch, 
  DollarSign 
} from 'lucide-react';

const tools = [
  {
    icon: BarChart2,
    title: 'Построение Диаграмм',
    description: 'Создавайте красивые диаграммы из ваших файлов данных',
    path: '/tools/chart',
    color: 'bg-blue-500',
  },
  {
    icon: Calculator,
    title: 'Статистический Калькулятор',
    description: 'Расчет среднего, медианы, моды и других статистических показателей',
    path: '/tools/stats',
    color: 'bg-green-500',
  },
  {
    icon: FilePlus,
    title: 'Объединение Файлов',
    description: 'Объединяйте несколько файлов данных в один',
    path: '/tools/merge',
    color: 'bg-purple-500',
  },
  {
    icon: FileSearch,
    title: 'Очистка Данных',
    description: 'Автоматическая очистка и форматирование данных',
    path: '/tools/clean',
    color: 'bg-orange-500',
  },
  {
    icon: DollarSign,
    title: 'Финансовый Калькулятор',
    description: 'Расчет ROI, маржинальности и точки безубыточности',
    path: '/tools/finance',
    color: 'bg-red-500',
  },
];

const Home = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Инструменты для Аналитиков
        </h1>
        <p className="text-xl text-gray-600">
          Мощные инструменты для анализа и визуализации данных
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {tools.map((tool) => (
          <Link
            key={tool.path}
            to={tool.path}
            className="transform hover:scale-105 transition-transform duration-200"
          >
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className={`${tool.color} p-6 flex justify-center`}>
                <tool.icon className="h-12 w-12 text-white" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {tool.title}
                </h3>
                <p className="text-gray-600">{tool.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;