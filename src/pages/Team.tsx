import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface Profile {
  id: string;
  full_name: string;
  email: string;
  department: string;
  role: string;
}

const Team = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: true });

        if (error) throw error;
        setProfiles(data || []);
      } catch (error) {
        console.error('Ошибка при загрузке профилей:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Команда Аналитиков</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {profiles.map((profile) => (
          <div
            key={profile.id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="bg-indigo-600 h-24"></div>
            <div className="p-6">
              <div className="flex items-center justify-center -mt-16 mb-4">
                <div className="bg-gray-200 rounded-full h-24 w-24 flex items-center justify-center border-4 border-white">
                  <span className="text-2xl font-bold text-gray-600">
                    {profile.full_name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </span>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-center mb-2">
                {profile.full_name}
              </h3>
              <div className="text-gray-600 text-center">
                <p>{profile.role}</p>
                <p>{profile.department}</p>
                <p className="text-sm">{profile.email}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Team;