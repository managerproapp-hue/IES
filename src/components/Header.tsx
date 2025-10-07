import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ChevronDownIcon, LogoutIcon, ProfileIcon } from './icons';
import { Link } from 'react-router-dom';
import { Avatar } from './Avatar';
import { getProfileDisplayName } from '../../types';
import { useCompany } from '../contexts/CompanyContext';

const getCurrentAcademicYear = () => {
    return `Curso 2025/26`;
};


export const Header: React.FC = () => {
  const { currentUser, selectedProfile, logout } = useAuth();
  const { companyInfo } = useCompany();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const academicYear = getCurrentAcademicYear();

  if (!currentUser) return null;

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md h-16 flex items-center justify-between px-6">
      <div className="flex items-center space-x-4">
          <div className="bg-indigo-600 text-white font-bold text-sm py-2 px-4 rounded-lg shadow">
              <span>{academicYear}</span>
          </div>
          <div className="flex items-center space-x-2 bg-indigo-600 text-white font-bold text-sm py-2 px-4 rounded-lg shadow">
              <img src={companyInfo.logo} alt="Logo de la Empresa" className="h-5 w-auto" />
              <span>{companyInfo.name}</span>
          </div>
      </div>
      <div className="relative">
        <button 
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center space-x-2 focus:outline-none"
        >
          <Avatar user={currentUser} className="w-10 h-10" />
          <div className="text-left hidden md:block">
            <p className="font-semibold text-gray-800 dark:text-gray-200">{currentUser.name}</p>
            <p className="text-xs text-gray-500">
                {selectedProfile ? getProfileDisplayName(selectedProfile) : ''}
            </p>
          </div>
          <ChevronDownIcon className="w-5 h-5 text-gray-500" />
        </button>
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg py-1 z-20">
            <Link to={`/${selectedProfile}/profile`} className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600">
              <ProfileIcon className="w-5 h-5 mr-2" />
              Mi Perfil
            </Link>
            <button
              onClick={logout}
              className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
            >
              <LogoutIcon className="w-5 h-5 mr-2" />
              Cerrar Sesión
            </button>
          </div>
        )}
      </div>
    </header>
  );
};