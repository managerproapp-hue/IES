import React, { useRef } from 'react';
// FIX: Add file extensions to imports to resolve module resolution errors.
import { useData } from '../../contexts/DataContext.tsx';
// FIX: Add file extensions to imports to resolve module resolution errors.
import { Card } from '../../components/Card.tsx';
// FIX: Add file extensions to imports to resolve module resolution errors.
import { DownloadIcon, UploadIcon, BookIcon } from '../../components/icons/index.tsx';
// FIX: Add file extensions to imports to resolve module resolution errors.
import { useCreator } from '../../contexts/CreatorContext.tsx';

export const Support: React.FC = () => {
    const data = useData();
    const { creatorInfo } = useCreator();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleBackup = () => {
        const { setUsers, setProducts, setOrders, setSuppliers, setEvents, setTrainingCycles, setModules, setGroups, setAssignments, setIncidents, ...backupData } = data;
        const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(backupData, null, 2))}`;
        const link = document.createElement("a");
        link.href = jsonString;
        link.download = "manager-pro-backup.json";
        link.click();
    };

    const handleRestore = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const text = e.target?.result;
                if (typeof text !== 'string') throw new Error("File is not readable");
                const restoredData = JSON.parse(text);
                
                if (window.confirm("¿Estás seguro de que quieres restaurar? Esta acción sobrescribirá todos los datos actuales.")) {
                   data.setUsers(restoredData.users || []);
                   data.setProducts(restoredData.products || []);
                   data.setOrders(restoredData.orders || []);
                   data.setSuppliers(restoredData.suppliers || []);
                   data.setEvents(restoredData.events || []);
                   data.setTrainingCycles(restoredData.trainingCycles || []);
                   data.setModules(restoredData.modules || []);
                   data.setGroups(restoredData.groups || []);
                   data.setAssignments(restoredData.assignments || []);
                   data.setIncidents(restoredData.incidents || []);
                   alert("¡Datos restaurados con éxito!");
                   window.location.reload();
                }
            } catch (error) {
                console.error("Error al analizar o restaurar el archivo de copia de seguridad", error);
                alert("Error: Archivo de copia de seguridad no válido.");
            }
        };
        reader.readAsText(file);
    };

    const triggerFileUpload = () => {
        fileInputRef.current?.click();
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-6">Soporte y Mantenimiento</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card title="Copia de Seguridad y Restauración">
                    <p className="mb-4">Descarga una copia completa de todos los datos de la aplicación en un fichero JSON o restaura la aplicación a partir de uno.</p>
                    <div className="space-y-3">
                        <button onClick={handleBackup} className="w-full flex items-center justify-center bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
                            <DownloadIcon className="w-5 h-5 mr-2" /> Descargar Copia de Seguridad
                        </button>
                        <button onClick={triggerFileUpload} className="w-full flex items-center justify-center bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700">
                            <UploadIcon className="w-5 h-5 mr-2" /> Restaurar desde Copia
                        </button>
                        <input type="file" ref={fileInputRef} onChange={handleRestore} accept=".json" className="hidden" />
                    </div>
                </Card>
                <Card title="Datos de la Aplicación, del Creador" icon={<BookIcon className="w-8 h-8"/>}>
                    <div className="space-y-4">
                        <div className="flex items-center space-x-4">
                            <img src={creatorInfo.logo} alt="Logo del Creador" className="h-16 w-16 rounded-full object-cover bg-gray-200"/>
                            <div>
                                <h3 className="text-lg font-bold">{creatorInfo.name}</h3>
                                <a href={creatorInfo.website} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">
                                    Contacto
                                </a>
                            </div>
                        </div>
                        <p className="text-sm text-gray-500 pt-4 border-t dark:border-gray-700">
                            {creatorInfo.copyright}
                        </p>
                        <p className="text-xs text-gray-400">
                            Esta información se gestiona desde el panel de Creador.
                        </p>
                    </div>
                </Card>
            </div>
        </div>
    );
};
