import React from 'react';
import { Link } from 'react-router-dom';
import { LineChart, Users, LogOut } from 'lucide-react';
import { supabase } from '../lib/supabase';

const Navbar = () => {
  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <LineChart className="h-8 w-8 text-indigo-600" />
              <span className="text-xl font-bold text-gray-800">Аналитические Инструменты</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link to="/team" className="flex items-center space-x-1 text-gray-600 hover:text-indigo-600">
              <Users className="h-5 w-5" />
              <span>Команда</span>
            </Link>
            <button
              onClick={handleSignOut}
              className="flex items-center space-x-1 text-gray-600 hover:text-indigo-600"
            >
              <LogOut className="h-5 w-5" />
              <span>Выйти</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;