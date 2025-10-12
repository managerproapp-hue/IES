import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCreator } from '../contexts/CreatorContext';
import { useData } from '../contexts/DataContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();
  const { creatorInfo } = useCreator();
  const { companyInfo } = useData();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');
    const user = login(email, password);
    if (user) {
      if (user.mustChangePassword) {
        navigate('/force-change-password');
      } else {
        navigate('/select-profile');
      }
    } else {
      setError('Credenciales inválidas o usuario inactivo.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-gray-900 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
        <div className="h-1.5 bg-indigo-500"></div>
        <div className="p-8 space-y-8">
            <div className="text-center">
                <img src={companyInfo.logoUI} alt="Logo" className="mx-auto h-20 w-20 rounded-md object-cover"/>
                <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
                    Bienvenidos al {companyInfo.name}
                </h2>
            </div>
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              {error && <p className="text-center text-red-500 bg-red-100 dark:bg-red-900/50 p-3 rounded-lg">{error}</p>}
              <div className="rounded-md shadow-sm -space-y-px">
                <div>
                  <label htmlFor="email-address" className="sr-only">Email</label>
                  <input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white bg-white dark:bg-gray-700 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="password-sr" className="sr-only">Contraseña</label>
                  <input
                    id="password-sr"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white bg-white dark:bg-gray-700 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Iniciar sesión
                </button>
              </div>
            </form>
        </div>
      </div>
      <div className="text-center mt-8">
        <p className="text-sm text-gray-600 dark:text-gray-400">{companyInfo.name}</p>
        <p className="text-xs text-gray-500 dark:text-gray-500">{creatorInfo.copyrightText}</p>
      </div>
    </div>
  );
};

export default Login;