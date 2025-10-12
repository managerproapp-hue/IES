import React, { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { EventStatus, EventType, Role, OrderStatus } from '../../types';
import { DownloadIcon, ClipboardIcon, ArchiveIcon, ChartBarIcon as SalesIcon } from '../../components/icons';

declare global {
  interface Window {
    jspdf: any;
  }
}

const formatCurrency = (amount: number) => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(amount);

const TeacherDashboard: React.FC = () => {
    const { currentUser, activeRole } = useAuth();
    const { events, orders, orderItems } = useData();
    const navigate = useNavigate();

    const isStudent = activeRole === Role.STUDENT;
    const pathPrefix = isStudent ? '/student' : '/teacher';

    const activeOrderEvents = useMemo(() => {
        if (!currentUser) return [];
        return events.filter(event => {
            const now = new Date();
            const startDate = new Date(event.startDate);
            const endDate = new Date(event.endDate);
            const isActiveDate = now >= startDate && now <= endDate;

            if (!isActiveDate || event.status !== EventStatus.ACTIVE) return false;
            
            if (isStudent) return true; // Students see all active events in their sandbox
            
            // For teachers
            if (event.type === EventType.REGULAR) return true;
            if (event.type === EventType.EXTRAORDINARY && event.authorizedTeacherIds.includes(currentUser.id)) return true;
            
            return false;
        });
    }, [events, currentUser, isStudent]);
    
    const lastThreeOrders = useMemo(() => {
        if (!currentUser) return [];
        const myOrders = orders.filter(o => o.teacherId === currentUser.id)
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 3);
            
        return myOrders.map(order => {
            const itemsForOrder = orderItems.filter(item => item.orderId === order.id);
            const totalCost = itemsForOrder.reduce((sum, item) => sum + (item.unitPrice || 0) * item.quantity, 0);
            const eventName = events.find(e => e.id === order.eventId)?.name || 'Evento desconocido';
            return { ...order, totalCost, eventName };
        });
    }, [orders, orderItems, events, currentUser]);

    const handleDownloadPdf = () => {
        const { jsPDF } = window as any;
        const doc = new jsPDF();

        doc.setFontSize(18);
        doc.text(`Panel de Control - ${currentUser?.name}`, 14, 22);
        doc.setFontSize(11);
        doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 14, 28);
        
        doc.setFontSize(14);
        doc.text('Eventos de Pedido Activos', 14, 40);
        if (activeOrderEvents.length > 0) {
            doc.autoTable({
                startY: 45,
                head: [['Nombre del Evento', 'Fecha Límite']],
                body: activeOrderEvents.map(event => [event.name, new Date(event.endDate).toLocaleDateString()]),
            });
        } else {
             doc.text('No hay períodos de pedido abiertos.', 14, 50);
        }
        
        doc.addPage();
        doc.setFontSize(14);
        doc.text('Mis Últimos 3 Pedidos', 14, 22);
         if (lastThreeOrders.length > 0) {
            doc.autoTable({
                startY: 28,
                head: [['Evento Asociado', 'Coste Total', 'Estado']],
                body: lastThreeOrders.map(order => [order.eventName, formatCurrency(order.totalCost), order.status]),
            });
        } else {
             doc.text('No hay pedidos recientes.', 14, 34);
        }

        doc.save(`resumen_panel_${currentUser?.name.replace(' ', '_')}.pdf`);
    };

    if (!currentUser) return null;

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Bienvenido, {currentUser.name}</h1>
                    <p className="mt-1 text-gray-600 dark:text-gray-400">Este es tu centro de operaciones diarias.</p>
                </div>
                <button
                    onClick={handleDownloadPdf}
                    className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 whitespace-nowrap"
                >
                    <DownloadIcon className="w-4 h-4"/>
                    Descargar Resumen en PDF
                </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                <div className="lg:col-span-3 space-y-8">
                    {/* Active Events */}
                    <div className="card">
                        <div className="h-1.5 bg-indigo-500"></div>
                        <div className="p-6">
                            <h2 className="card-title">📅 Eventos de Pedido Activos</h2>
                            {activeOrderEvents.length > 0 ? (
                                <div className="mt-4 space-y-4">
                                    {activeOrderEvents.map(event => (
                                        <div key={event.id} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                                            <div>
                                                <h3 className="font-bold text-gray-800 dark:text-gray-200">{event.name}</h3>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">Fecha límite para enviar: {new Date(event.endDate).toLocaleDateString()}</p>
                                            </div>
                                            <button
                                                onClick={() => navigate(`${pathPrefix}/create-order/${event.id}`)}
                                                className="px-4 py-2 text-sm font-semibold text-white bg-indigo-500 rounded-md hover:bg-indigo-600"
                                            >
                                                Realizar Pedido
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="mt-4 text-gray-500 dark:text-gray-400">No hay períodos de pedido abiertos en este momento.</p>
                            )}
                        </div>
                    </div>
                    {/* Last Orders */}
                    <div className="card">
                        <div className="h-1.5 bg-indigo-500"></div>
                        <div className="p-6">
                            <h2 className="card-title">📦 Mis Últimos Pedidos</h2>
                            {lastThreeOrders.length > 0 ? (
                                <div className="mt-4 space-y-3">
                                    {lastThreeOrders.map(order => (
                                        <div key={order.id} className="py-2 flex justify-between items-center border-b dark:border-gray-700 last:border-b-0">
                                            <div>
                                                <p className="font-medium text-gray-700 dark:text-gray-300">{order.eventName}</p>
                                                <p className="text-sm font-bold">{formatCurrency(order.totalCost)}</p>
                                            </div>
                                            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${order.status === OrderStatus.DRAFT ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}`}>{order.status}</span>
                                        </div>
                                    ))}
                                    <Link to={`${pathPrefix}/order-portal`} className="block text-right text-sm font-medium text-indigo-600 hover:underline pt-3">
                                        Ver todos mis pedidos &rarr;
                                    </Link>
                                </div>
                            ) : (
                                <p className="mt-4 text-gray-500 dark:text-gray-400">No tienes pedidos recientes.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="lg:col-span-2">
                     <div className="card">
                        <div className="h-1.5 bg-indigo-500"></div>
                        <div className="p-6">
                            <h2 className="card-title">⚡ Acciones Rápidas</h2>
                            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                                <Link to={`${pathPrefix}/order-portal`} className="quick-link">
                                    <ClipboardIcon className="w-8 h-8"/>
                                    <span>Portal de Pedidos</span>
                                </Link>
                                <Link to={`${pathPrefix}/my-recipes`} className="quick-link">
                                    <ArchiveIcon className="w-8 h-8"/>
                                    <span>Mis Recetas</span>
                                </Link>
                                {!isStudent && (
                                    <Link to={`${pathPrefix}/sales`} className="quick-link">
                                        <SalesIcon className="w-8 h-8"/>
                                        <span>Ventas</span>
                                    </Link>
                                )}
                            </div>
                        </div>
                     </div>
                </div>
            </div>
            
             <style>{`
                .card { background-color: white; border-radius: 0.75rem; box-shadow: 0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px -1px rgba(0,0,0,0.1); overflow: hidden; }
                .dark .card { background-color: #1F2937; }
                .card-title { font-size: 1.125rem; font-weight: 600; color: #111827; }
                .dark .card-title { color: #F9FAFB; }
                .quick-link { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 1.5rem; border-radius: 0.75rem; font-weight: 600; text-align: center; transition: all 0.2s; background-color: #F3F4F6; color: #374151; }
                .dark .quick-link { background-color: #374151; color: #F9FAFB; }
                .quick-link:hover { background-color: #E5E7EB; transform: translateY(-2px); }
                .dark .quick-link:hover { background-color: #4B5563; }
            `}</style>
        </div>
    );
};

export default TeacherDashboard;