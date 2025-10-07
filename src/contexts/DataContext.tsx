import React, { createContext, useContext, useMemo, useCallback } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { initialData } from '../../services/dataService';
import { demoData, demoClassroom1Data, demoClassroom2Data } from '../../services/demoDataService';
import { 
    User, Product, Supplier, Event, Order, Incident, 
    TrainingCycle, Module, Group, Assignment, Recipe, StockItem, Sale, Message,
    Classroom, ClassroomProduct, ClassroomSupplier, ClassroomEvent, ClassroomOrder,
    AppData
} from '../../types';

export interface DataContextType {
    users: User[];
    products: Product[];
    suppliers: Supplier[];
    events: Event[];
    orders: Order[];
    incidents: Incident[];
    trainingCycles: TrainingCycle[];
    modules: Module[];
    groups: Group[];
    assignments: Assignment[];
    recipes: Recipe[];
    sales: Sale[];
    miniEconomatoStock: StockItem[];
    messages: Message[];
    classrooms: Classroom[];
    classroomProducts: ClassroomProduct[];
    classroomSuppliers: ClassroomSupplier[];
    classroomEvents: ClassroomEvent[];
    classroomOrders: ClassroomOrder[];
    setUsers: React.Dispatch<React.SetStateAction<User[]>>;
    setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
    setSuppliers: React.Dispatch<React.SetStateAction<Supplier[]>>;
    setEvents: React.Dispatch<React.SetStateAction<Event[]>>;
    setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
    setIncidents: React.Dispatch<React.SetStateAction<Incident[]>>;
    setTrainingCycles: React.Dispatch<React.SetStateAction<TrainingCycle[]>>;
    setModules: React.Dispatch<React.SetStateAction<Module[]>>;
    setGroups: React.Dispatch<React.SetStateAction<Group[]>>;
    setAssignments: React.Dispatch<React.SetStateAction<Assignment[]>>;
    setRecipes: React.Dispatch<React.SetStateAction<Recipe[]>>;
    setSales: React.Dispatch<React.SetStateAction<Sale[]>>;
    setMiniEconomatoStock: React.Dispatch<React.SetStateAction<StockItem[]>>;
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
    setClassrooms: React.Dispatch<React.SetStateAction<Classroom[]>>;
    setClassroomProducts: React.Dispatch<React.SetStateAction<ClassroomProduct[]>>;
    setClassroomSuppliers: React.Dispatch<React.SetStateAction<ClassroomSupplier[]>>;
    setClassroomEvents: React.Dispatch<React.SetStateAction<ClassroomEvent[]>>;
    setClassroomOrders: React.Dispatch<React.SetStateAction<ClassroomOrder[]>>;
    loadDemoData: () => void;
}

export const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [users, setUsers] = useLocalStorage<User[]>('data:users', initialData.users);
    const [products, setProducts] = useLocalStorage<Product[]>('data:products', initialData.products);
    const [suppliers, setSuppliers] = useLocalStorage<Supplier[]>('data:suppliers', initialData.suppliers);
    const [events, setEvents] = useLocalStorage<Event[]>('data:events', initialData.events);
    const [orders, setOrders] = useLocalStorage<Order[]>('data:orders', initialData.orders);
    const [incidents, setIncidents] = useLocalStorage<Incident[]>('data:incidents', initialData.incidents);
    const [trainingCycles, setTrainingCycles] = useLocalStorage<TrainingCycle[]>('data:trainingCycles', initialData.trainingCycles);
    const [modules, setModules] = useLocalStorage<Module[]>('data:modules', initialData.modules);
    const [groups, setGroups] = useLocalStorage<Group[]>('data:groups', initialData.groups);
    const [assignments, setAssignments] = useLocalStorage<Assignment[]>('data:assignments', initialData.assignments);
    const [recipes, setRecipes] = useLocalStorage<Recipe[]>('data:recipes', initialData.recipes);
    const [sales, setSales] = useLocalStorage<Sale[]>('data:sales', initialData.sales);
    const [miniEconomatoStock, setMiniEconomatoStock] = useLocalStorage<StockItem[]>('data:miniEconomatoStock', initialData.miniEconomatoStock);
    const [messages, setMessages] = useLocalStorage<Message[]>('data:messages', initialData.messages);
    
    // Classroom Data
    const [classrooms, setClassrooms] = useLocalStorage<Classroom[]>('data:classrooms', initialData.classrooms);
    const [classroomProducts, setClassroomProducts] = useLocalStorage<ClassroomProduct[]>('data:classroomProducts', initialData.classroomProducts);
    const [classroomSuppliers, setClassroomSuppliers] = useLocalStorage<ClassroomSupplier[]>('data:classroomSuppliers', initialData.classroomSuppliers);
    const [classroomEvents, setClassroomEvents] = useLocalStorage<ClassroomEvent[]>('data:classroomEvents', initialData.classroomEvents);
    const [classroomOrders, setClassroomOrders] = useLocalStorage<ClassroomOrder[]>('data:classroomOrders', initialData.classroomOrders);

    const loadDemoData = useCallback(() => {
        // Load main data
        setUsers(demoData.users);
        setProducts(demoData.products);
        setSuppliers(demoData.suppliers);
        setEvents(demoData.events);
        setOrders(demoData.orders);
        setIncidents(demoData.incidents);
        setTrainingCycles(demoData.trainingCycles);
        setModules(demoData.modules);
        setGroups(demoData.groups);
        setAssignments(demoData.assignments);
        setRecipes(demoData.recipes);
        setSales(demoData.sales);
        setMiniEconomatoStock(demoData.miniEconomatoStock);
        setMessages(demoData.messages);
        setClassrooms(demoData.classrooms);
        
        // Manually set sandboxed data for demo classrooms in localStorage
        if (typeof window !== 'undefined') {
            const demoClassroom1 = demoData.classrooms.find(c => c.id === 'classroom-1');
            const demoClassroom2 = demoData.classrooms.find(c => c.id === 'classroom-2');
            if (demoClassroom1) {
                window.localStorage.setItem(`classroom-data-${demoClassroom1.id}`, JSON.stringify(demoClassroom1Data));
            }
            if (demoClassroom2) {
                window.localStorage.setItem(`classroom-data-${demoClassroom2.id}`, JSON.stringify(demoClassroom2Data));
            }
        }
        
        // Reload to ensure all components re-render with the new data from localStorage
        alert("Datos de demostración cargados. La aplicación se reiniciará.");
        window.location.reload();

    }, [
        setUsers, setProducts, setSuppliers, setEvents, setOrders, setIncidents,
        setTrainingCycles, setModules, setGroups, setAssignments, setRecipes, setSales,
        setMiniEconomatoStock, setMessages, setClassrooms
    ]);

    const value: DataContextType = useMemo(() => ({
        users, setUsers,
        products, setProducts,
        suppliers, setSuppliers,
        events, setEvents,
        orders, setOrders,
        incidents, setIncidents,
        trainingCycles, setTrainingCycles,
        modules, setModules,
        groups, setGroups,
        assignments, setAssignments,
        recipes, setRecipes,
        sales, setSales,
        miniEconomatoStock, setMiniEconomatoStock,
        messages, setMessages,
        classrooms, setClassrooms,
        classroomProducts, setClassroomProducts,
        classroomSuppliers, setClassroomSuppliers,
        classroomEvents, setClassroomEvents,
        classroomOrders, setClassroomOrders,
        loadDemoData
    }), [
        users, products, suppliers, events, orders, incidents, 
        trainingCycles, modules, groups, assignments, recipes, sales, miniEconomatoStock, messages,
        classrooms, classroomProducts, classroomSuppliers, classroomEvents, classroomOrders,
        setUsers, setProducts, setSuppliers, setEvents, setOrders, setIncidents,
        setTrainingCycles, setModules, setGroups, setAssignments, setRecipes, setSales,
        setMiniEconomatoStock, setMessages, setClassrooms, setClassroomProducts,
        setClassroomSuppliers, setClassroomEvents, setClassroomOrders,
        loadDemoData
    ]);

    return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};