import React, { useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useCompany } from '../../contexts/CompanyContext';
import { useCreator } from '../../contexts/CreatorContext';

export const Login: React.FC = () => {
  const { login } = useAuth();
  const { companyInfo } = useCompany();
  const { creatorInfo } = useCreator();

  useEffect(() => {
    // Automatically log in the super user
    login('all@example.com', 'password123');
  }, [login]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-200 dark:bg-gray-900">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
        <div className="flex justify-center mb-6">
          <img src={companyInfo.logo} alt="Logotipo de la Empresa" className="h-12 w-auto" />
        </div>
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white">Bienvenido a {companyInfo.name}</h2>
        
        {/* Replaced form with a loading state */}
        <div className="mt-8 text-center">
            <p className="text-gray-600 dark:text-gray-400">Iniciando sesión...</p>
            <div className="mt-4 animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
        </div>
        
        {/* Add creator info below */}
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 text-center text-xs text-gray-500">
             <p>{creatorInfo.copyright}</p>
             <a href={creatorInfo.website} target="_blank" rel="noopener noreferrer" className="hover:text-primary-400">
                 {creatorInfo.name}
             </a>
        </div>
      </div>
    </div>
  );
};
