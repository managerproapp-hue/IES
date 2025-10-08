import React, { useEffect, createContext, useMemo, useCallback } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../../components/Sidebar';
import { Header } from '../../components/Header';
import { ImpersonationBanner } from '../../components/ImpersonationBanner';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { PrintHeader } from '../../components/PrintHeader';
import { useCompany } from '../../contexts/CompanyContext';
import { useData, DataContext, DataContextType } from '../../contexts/DataContext';
// FIX: Add missing 'Profile' import to resolve type error.
import { AppData, Profile } from '../../types';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { ShieldCheckIcon } from '../../components/icons';
import { PrintFooter } from '../../components/PrintFooter';

const SandboxedDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const globalData = useData();
    const { currentUser } = useAuth();
    const classroomId = currentUser?.classroomId;
    
    // FIX: Correctly type the sandboxed data state and setter.
    const [sandboxedData, setSandboxedData] = useLocalStorage<Pick<AppData, 'products' | 'suppliers' | 'orders' | 'events' | 'incidents' | 'miniEconomatoStock'>>(`classroom-data-${classroomId}`, {
        products: [],
        suppliers: [],
        orders: [],
        events: [],
        incidents: [],
        miniEconomatoStock: [],
    });

    // FIX: Provide a fully-typed DataContext value, overriding global data with sandboxed data and setters.
    const value: DataContextType = useMemo(() => ({
      ...globalData,
      // Override with sandboxed data
      products: sandboxedData.products,
      suppliers: sandboxedData.suppliers,
      orders: sandboxedData.orders,
      events: sandboxedData.events,
      incidents: sandboxedData.incidents,
      miniEconomatoStock: sandboxedData.miniEconomatoStock,

      // Override setters to update sandboxed data
      // FIX: Ensure setters correctly handle functional updates.
      setProducts: (action) => setSandboxedData(prev => ({ ...prev, products: typeof action === 'function' ? action(prev.products) : action })),
      setSuppliers: (action) => setSandboxedData(prev => ({ ...prev, suppliers: typeof action === 'function' ? action(prev.suppliers) : action })),
      setOrders: (action) => setSandboxedData(prev => ({ ...prev, orders: typeof action === 'function' ? action(prev.orders) : action })),
      setEvents: (action) => setSandboxedData(prev => ({ ...prev, events: typeof action === 'function' ? action(prev.events) : action })),
      setIncidents: (action) => setSandboxedData(prev => ({...prev, incidents: typeof action === 'function' ? action(prev.incidents) : action })),
      setMiniEconomatoStock: (action) => setSandboxedData(prev => ({...prev, miniEconomatoStock: typeof action === 'function' ? action(prev.miniEconomatoStock) : action})),
    } as DataContextType), [globalData, sandboxedData, setSandboxedData]);

    return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};


export const StudentLayout: React.FC = () => {
  const { isImpersonating, currentUser } = useAuth();
  const { setPrimaryColor } = useTheme();
  const { companyInfo } = useCompany();
  const { users } = useData(); // Use global data for users
  const managerUser = users.find(u => u.id === companyInfo.managerUserId);

  useEffect(() => {
    setPrimaryColor('#16a34a'); // Green for classroom
    return () => setPrimaryColor('#3b82f6'); // Reset to default
  }, [setPrimaryColor]);
  
  const content = (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <ImpersonationBanner />
        <main className={`flex-1 overflow-x-hidden overflow-y-auto ${isImpersonating ? 'pt-10' : ''}`}>
          <PrintHeader companyInfo={companyInfo} managerUser={managerUser} />
          <Header />
          <div className="container mx-auto px-6 py-8">
            <div className="flex items-center space-x-4 mb-6">
                <span className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-sm font-semibold px-3 py-1.5 rounded-lg shadow-sm flex items-center">
                    <ShieldCheckIcon className="w-4 h-4 mr-2" />
                    Entorno de Práctica
                </span>
            </div>
            <Outlet />
          </div>
          <PrintFooter />
        </main>
      </div>
    </div>
  );

  return <SandboxedDataProvider>{content}</SandboxedDataProvider>;
};