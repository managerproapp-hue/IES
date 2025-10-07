import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../../components/Card';
import { WarningIcon } from '../../components/icons';

export const BlockedAccess: React.FC<{ message?: string }> = ({ message }) => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
        <div className="w-full max-w-lg">
            <Card title="Acceso Restringido">
                <div className="text-center p-4">
                    <WarningIcon className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                    <p className="text-lg">
                        {message || "Tu cuenta ha sido dada de baja o no tienes permiso para acceder."}
                    </p>
                    <Link to="/login" className="mt-6 inline-block bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700">
                        Volver a Inicio de Sesión
                    </Link>
                </div>
            </Card>
        </div>
    </div>
  );
};
