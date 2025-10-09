import React, { useRef, useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { Card } from '../../components/Card';
import { DownloadIcon, UploadIcon, BookIcon } from '../../components/icons';
import { useCreator } from '../../contexts/CreatorContext';
import { AppData } from '../../types';

const ProgressBar: React.FC<{ progress: number }> = ({ progress }) => (
    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
        <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
    </div>
);

const RestoringOverlay: React.FC = () => {
    const [progress, setProgress] = useState(0);

    React.useEffect(() => {
        const timer = setTimeout(() => setProgress(100), 100);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-[100] flex flex-col justify-center items-center">
            <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-lg text-center">
                <h2 className="text-2xl font-bold mb-4">Restaurando...</h2>
                <p className="mb-6 text-gray-600 dark:text-gray-400">Por favor, espera mientras se cargan los datos. La aplicación se recargará automáticamente.</p>
                <ProgressBar progress={progress} />
            </div>
        </div>
    );
};


export const Support: React.FC = () => {
    const data = useData();
    const { creatorInfo } = useCreator();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isRestoring, setIsRestoring] = useState(false);

    const handleBackup = () => {
        // Explicitly build the backup object to ensure all data is included and no functions are.
        const backupData: Omit<AppData, 'loadDemoData'> = {
            users: data.users,
            products: data.products,
            suppliers: data.suppliers,
            events: data.events,
            orders: data.orders,
            incidents: data.incidents,
            trainingCycles: data.trainingCycles,
            modules: data.modules,
            groups: data.groups,
            assignments: data.assignments,
            recipes: data.recipes,
            sales: data.sales,
            miniEconomatoStock: data.miniEconomatoStock,
            messages: data.messages,
            classrooms: data.classrooms,
            classroomProducts: data.classroomProducts,
            classroomSuppliers: data.classroomSuppliers,
            classroomEvents: data.classroomEvents,
            classroomOrders: data.classroomOrders,
            serviceGroups: data.serviceGroups,
            services: data.services,
        };
        const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(backupData, null, 2))}`;
        const link = document.createElement("a");
        link.href = jsonString;
        link.download = `manager-pro-backup-${new Date().toISOString()}.json`;
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
                const restoredData = JSON.parse(text) as Partial<AppData>;
                
                if (window.confirm("¿Estás seguro de que quieres restaurar? Esta acción sobrescribirá todos los datos actuales y recargará la aplicación.")) {
                   setIsRestoring(true);
                   
                   setTimeout(() => {
                        // Call all setters to update the state from the backup file
                        data.setUsers(restoredData.users || []);
                        data.setProducts(restoredData.products || []);
                        data.setSuppliers(restoredData.suppliers || []);
                        data.setEvents(restoredData.events || []);
                        data.setOrders(restoredData.orders || []);
                        data.setIncidents(restoredData.incidents || []);
                        data.setTrainingCycles(restoredData.trainingCycles || []);
                        data.setModules(restoredData.modules || []);
                        data.setGroups(restoredData.groups || []);
                        data.setAssignments(restoredData.assignments || []);
                        data.setRecipes(restoredData.recipes || []);
                        data.setSales(restoredData.sales || []);
                        data.setMiniEconomatoStock(restoredData.miniEconomatoStock || []);
                        data.setMessages(restoredData.messages || []);
                        data.setClassrooms(restoredData.classrooms || []);
                        data.setClassroomProducts(restoredData.classroomProducts || []);
                        data.setClassroomSuppliers(restoredData.classroomSuppliers || []);
                        data.setClassroomEvents(restoredData.classroomEvents || []);
                        data.setClassroomOrders(restoredData.classroomOrders || []);
                        data.setServiceGroups(restoredData.serviceGroups || []);
                        data.setServices(restoredData.services || []);
                        
                        setTimeout(() => {
                             alert("¡Datos restaurados con éxito! La aplicación se recargará.");
                             window.location.reload();
                        }, 2500); // Wait for progress bar animation
                   }, 100);
                }
            } catch (error) {
                console.error("Error al analizar o restaurar el archivo de copia de seguridad", error);
                alert("Error: Archivo de copia de seguridad no válido.");
            } finally {
                if (event.target) {
                    event.target.value = '';
                }
            }
        };
        reader.readAsText(file);
    };

    const triggerFileUpload = () => {
        fileInputRef.current?.click();
    };

    return (
        <div>
            {isRestoring && <RestoringOverlay />}
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