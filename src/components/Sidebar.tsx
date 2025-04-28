import React from 'react';
import { Link } from 'react-router-dom';
import { 
  BarChart2, 
  Calculator, 
  FilePlus, 
  FileSearch, 
  DollarSign,
  Home
} from 'lucide-react';

const Sidebar = () => {
  const menuItems = [
    { icon: Home, label: 'Главная', path: '/' },
    { icon: BarChart2, label: 'Диаграммы', path: '/tools/chart' },
    { icon: Calculator, label: 'Статистика', path: '/tools/stats' },
    { icon: FilePlus, label: 'Объединение', path: '/tools/merge' },
    { icon: FileSearch, label: 'Очистка Данных', path: '/tools/clean' },
    { icon: DollarSign, label: 'Финансы', path: '/tools/finance' },
  ];

  return (
    <div className="w-64 bg-white shadow-lg h-[calc(100vh-4rem)]">
      <div className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className="flex items-center space-x-3 p-3 rounded-lg text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;