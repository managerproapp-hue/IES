import React, { createContext, useState, useEffect, useContext, ReactNode, useCallback } from 'react';
import { User, Cycle, Module, Group, Assignment, Supplier, Product, Event, Order, OrderItem, EventType, EventStatus, OrderStatus, CatalogFamily, CatalogCategory, Recipe, ServiceGroup, Service, Sale, Classroom, PracticeStudent, BackupRecord, Message, Incident, CompanyInfo, MiniEconomatoItem, Notification } from '../types';
import storage from '../services/storageService';
import { DEMO_USERS } from '../constants';
import { initialAcademicData } from '../services/academicData';
import { DEMO_SUPPLIERS } from '../services/supplierData';
import { DEMO_PRODUCTS } from '../services/productData';
import { DEFAULT_FAMILIES, DEFAULT_CATEGORIES, DEFAULT_PRODUCT_STATES } from '../services/catalogData';
import { DEMO_RECIPES, DEMO_SERVICE_GROUPS, DEMO_SERVICES } from '../services/serviceData';
import { DEMO_SALES } from '../services/saleData';

const DEFAULT_COMPANY_INFO: CompanyInfo = {
  name: 'IES La Flota',
  cif: 'A12345678',
  phone: '968 23 45 67',
  email: 'info@ieslaflota.es',
  address: 'Calle de la Marina Española, 1, 30007 Murcia',
  website: 'https://www.ieslaflota.es/',
  logoUI: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiB2aWV3Qm94PSIwIDAgMjAwIDIwMCI+CiAgPHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiM0ZjQ2ZTUiLz4KICA8dGV4dCB4PSI1MCUiIHk9IjU1JSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjgwIiBmaWxsPSJ3aGl0ZSIgZm9udC13ZWlnaHQ9ImJvbGQiPklMRjwvdGV4dD4KPC9zdmc+',
  logoPDF: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iNTAiIHZpZXdCb3g9IjAgMCAyMDAgNTAiPgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlyeT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9ImJsYWNrIiBmb250LXdlaWdodD0iYm9sZCI+SUVTIEEgRmxhdGE8L3RleHQ+Cjwvc3ZnPg==',
  primaryColor: '#4f46e5', // Indigo-600
  warehouseManagerId: 'user-3',
  defaultBudget: 500,
  eventWeeks: 8,
};

// Fix: Export the DataContextType interface so it can be imported in other modules.
export interface DataContextType {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  addUser: (user: Omit<User, 'id'>) => User;
  updateUser: (user: User) => void;
  deleteUser: (userId: string) => void;
  getUserById: (userId: string) => User | undefined;
  
  suppliers: Supplier[];
  addSupplier: (supplier: Omit<Supplier, 'id'>) => void;
  updateSupplier: (supplier: Supplier) => void;
  deleteSupplier: (supplierId: string) => void;
  
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;

  families: CatalogFamily[];
  addFamily: (name: string) => CatalogFamily;
  deleteFamily: (familyId: string) => void;
  categories: CatalogCategory[];
  addCategory: (category: Omit<CatalogCategory, 'id'>) => CatalogCategory;
  deleteCategory: (categoryId: string) => void;
  productStates: string[];
  addProductState: (state: string) => void;
  
  events: Event[];
  addEvent: (event: Omit<Event, 'id'>) => Event;
  updateEvent: (event: Event) => void;
  deleteEvent: (eventId: string) => void;

  orders: Order[];
  orderItems: OrderItem[];
  getOrdersByTeacher: (teacherId: string) => Order[];
  getOrderWithItems: (orderId: string) => { order: Order | undefined, items: OrderItem[] };
  saveOrder: (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'type'> & {id?: string, type?: 'replenishment'}, items: Omit<OrderItem, 'id' | 'orderId'>[]) => Order;
  deleteOrder: (orderId: string) => void;
  processEventOrders: (eventId: string, modifiedItems: { orderItemId: string, newQuantity: number, teacherId: string }[], senderId: string) => void;
  reopenProcessedOrders: (eventId: string) => void;
  finalizeReception: (eventId: string, verifiedItems: any[]) => void;

  incidents: Incident[];

  sales: Sale[];
  addSale: (sale: Omit<Sale, 'id'>) => void;
  updateSale: (sale: Sale) => void;
  deleteSale: (saleId: string) => void;

  recipes: Recipe[];
  addRecipe: (recipe: Omit<Recipe, 'id'>) => void;
  updateRecipe: (recipe: Recipe) => void;
  deleteRecipe: (recipeId: string) => void;

  serviceGroups: ServiceGroup[];
  addServiceGroup: (group: Omit<ServiceGroup, 'id'>) => void;
  updateServiceGroup: (group: ServiceGroup) => void;
  deleteServiceGroup: (groupId: string) => void;
  
  services: Service[];
  addService: (service: Omit<Service, 'id'>) => void;
  updateService: (service: Service) => void;
  deleteService: (serviceId: string) => void;

  classrooms: Classroom[];
  // Fix: Changed 'orderItems' to 'orderItem' to match the Classroom type definition.
  addClassroom: (classroom: Omit<Classroom, 'id' | 'students' | 'products' | 'suppliers' | 'events' | 'orders' | 'orderItem' | 'recipes' | 'families' | 'categories' | 'productStates'>) => void;
  updateClassroom: (classroom: Classroom) => void;
  deleteClassroom: (classroomId: string) => void;
  updateClassroomContent: <K extends keyof Classroom>(classroomId: string, key: K, data: Classroom[K]) => void;
  resetClassroom: (classroomId: string) => void;

  backupHistory: BackupRecord[];
  downloadBackupData: () => void;
  restoreApplicationData: (backupFileContent: string) => Promise<void>;
  resetApplicationData: () => void;

  cycles: Cycle[];
  modules: Module[];
  groups: Group[];
  assignments: Assignment[];
  addCycle: (cycle: Omit<Cycle, 'id'>) => void;
  updateCycle: (cycle: Cycle) => void;
  deleteCycle: (cycleId: string) => void;
  addModule: (module: Omit<Module, 'id'>) => void;
  updateModule: (module: Module) => void;
  deleteModule: (moduleId: string) => void;
  addGroup: (group: Omit<Group, 'id'>) => void;
  updateGroup: (group: Group) => void;
  deleteGroup: (groupId: string) => void;
  assignTeacher: (groupId: string, professorId: string | null) => void;

  messages: Message[];
  sendMessage: (messageData: Omit<Message, 'id' | 'timestamp' | 'readBy'>) => void;
  markMessageAsRead: (messageId: string, userId: string) => void;

  notifications: Notification[];
  addNotification: (notificationData: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => void;
  markNotificationAsRead: (notificationId: string) => void;
  markAllNotificationsAsRead: (userId: string) => void;

  companyInfo: CompanyInfo;
  updateCompanyInfo: (info: CompanyInfo) => void;

  miniEconomato: MiniEconomatoItem[];
  updateMiniEconomato: (items: MiniEconomatoItem[]) => void;
  assignExpenseFromMiniEconomato: (productId: string, teacherId: string, quantity: number) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const getStartOfWeek = (date: Date): Date => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    return new Date(d.setDate(diff));
};


const generateUpcomingRegularEvents = (existingEvents: Event[], companyInfo: CompanyInfo): Event[] => {
    const newEvents: Event[] = [];
    const regularEvents = existingEvents.filter(e => e.type === EventType.REGULAR);

    // Determine the starting point for generation
    let lastEventDate = new Date(); // Defaults to today if no events exist
    if (regularEvents.length > 0) {
        const latestEndDate = Math.max(...regularEvents.map(e => new Date(e.endDate).getTime()));
        lastEventDate = new Date(latestEndDate);
    }
    
    // Find the Monday of the week of our starting point.
    const lastKnownMonday = getStartOfWeek(lastEventDate);
    
    // Start checking from the week AFTER the last known event.
    let currentDate = new Date(lastKnownMonday);
    currentDate.setDate(currentDate.getDate() + 7);

    // Determine the end point for generation
    const futureLimit = new Date();
    futureLimit.setDate(new Date().getDate() + companyInfo.eventWeeks * 7);

    // Get a set of existing start dates for quick lookup
    const existingMondays = new Set(
        regularEvents.map(e => getStartOfWeek(new Date(e.startDate)).getTime())
    );

    while (currentDate < futureLimit) {
        const startOfWeek = getStartOfWeek(currentDate);
        
        // If an event for this Monday doesn't already exist
        if (!existingMondays.has(startOfWeek.getTime())) {
            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 4); // Friday
            endOfWeek.setHours(23, 59, 59, 999);
            
            const newEvent: Event = {
                id: `event-auto-${startOfWeek.getTime()}`,
                name: `Pedido Semanal - Semana del ${startOfWeek.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}`,
                type: EventType.REGULAR,
                status: EventStatus.SCHEDULED,
                startDate: startOfWeek.toISOString(),
                endDate: endOfWeek.toISOString(),
                budget: companyInfo.defaultBudget,
                authorizedTeacherIds: [],
            };
            newEvents.push(newEvent);
        }

        // Move to the next week to continue checking
        currentDate.setDate(currentDate.getDate() + 7);
    }

    return newEvents;
};

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [families, setFamilies] = useState<CatalogFamily[]>([]);
  const [categories, setCategories] = useState<CatalogCategory[]>([]);
  const [productStates, setProductStates] = useState<string[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [serviceGroups, setServiceGroups] = useState<ServiceGroup[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [backupHistory, setBackupHistory] = useState<BackupRecord[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>(() => storage.local.get('companyInfo', DEFAULT_COMPANY_INFO));
  const [miniEconomato, setMiniEconomato] = useState<MiniEconomatoItem[]>([]);


  useEffect(() => {
    const initData = <T,>(key: string, demoData: T[]): T[] => {
        const stored = storage.local.get<T[]>(key, []);
        if (stored.length === 0) {
            storage.local.set(key, demoData);
            return demoData;
        }
        return stored;
    };

    const initialUsers = DEMO_USERS.map(({ password, ...user }) => user);
    const storedUsers = storage.local.get<User[]>('users', []);
    if (storedUsers.length === 0) {
        setUsers(initialUsers);
        storage.local.set('users', initialUsers);
        storage.local.set('users_auth', DEMO_USERS);
    } else {
        setUsers(storedUsers);
    }
    
    setCompanyInfo(storage.local.get('companyInfo', DEFAULT_COMPANY_INFO));
    setSuppliers(initData('suppliers', DEMO_SUPPLIERS));
    setProducts(initData('products', DEMO_PRODUCTS));
    setFamilies(initData('families', DEFAULT_FAMILIES));
    setCategories(initData('categories', DEFAULT_CATEGORIES));
    setProductStates(initData('productStates', DEFAULT_PRODUCT_STATES));
    setRecipes(initData('recipes', DEMO_RECIPES));
    setServiceGroups(initData('serviceGroups', DEMO_SERVICE_GROUPS));
    setServices(initData('services', DEMO_SERVICES));
    setSales(initData('sales', DEMO_SALES));
    setClassrooms(initData('classrooms', []));
    setBackupHistory(storage.local.get<BackupRecord[]>('backupHistory', []));
    setMessages(initData('messages', []));
    setNotifications(initData('notifications', []));
    setIncidents(initData('incidents', []));
    setMiniEconomato(initData('miniEconomato', []));

    const storedEvents = storage.local.get<Event[]>('events', []);
    const loadedCompanyInfo = storage.local.get('companyInfo', DEFAULT_COMPANY_INFO);
    const newRegularEvents = generateUpcomingRegularEvents(storedEvents, loadedCompanyInfo);
    const allEvents = newRegularEvents.length > 0 ? [...storedEvents, ...newRegularEvents] : storedEvents;
    if (newRegularEvents.length > 0) {
        storage.local.set('events', allEvents);
    }
    setEvents(allEvents);

    setOrders(initData('orders', []));
    setOrderItems(initData('orderItems', []));
    setCycles(initData('cycles', initialAcademicData.cycles));
    setModules(initData('modules', initialAcademicData.modules));
    setGroups(initData('groups', initialAcademicData.groups));
    
    const storedAssignments = storage.local.get<Assignment[]>('assignments', []);
    if(storedAssignments.length === 0) {
        const initialAssignments: Assignment[] = [
          { id: 'assign-1', professorId: 'user-2', groupId: 'group-c1-1-a' },
          { id: 'assign-2', professorId: 'user-4', groupId: 'group-c1-2-a' },
        ];
        setAssignments(initialAssignments);
        storage.local.set('assignments', initialAssignments);
    } else {
        setAssignments(storedAssignments);
    }

  }, []);
  
  const updateCompanyInfo = useCallback((info: CompanyInfo) => {
    setCompanyInfo(info);
    storage.local.set('companyInfo', info);
  }, []);

  const addUser = useCallback((userData: Omit<User, 'id'>): User => {
      const newUser: User = { ...userData, id: `user-${Date.now()}`, mustChangePassword: true };
      const { password, ...userForState } = newUser;

      setUsers(prev => {
          const updated = [...prev, userForState];
          storage.local.set('users', updated);
          
          const authUsers = storage.local.get<User[]>('users_auth', []);
          const newAuthUser = { ...newUser, password: newUser.password || 'password' };
          storage.local.set('users_auth', [...authUsers, newAuthUser]);
          
          return updated;
      });
      return userForState;
  }, []);

  const updateUser = useCallback((updatedUser: User) => {
      setUsers(prev => {
          const updated = prev.map(user =>
              user.id === updatedUser.id ? { ...user, ...updatedUser } : user
          );
          storage.local.set('users', updated);

          const authUsers = storage.local.get<User[]>('users_auth', []);
          const updatedAuthUsers = authUsers.map(authUser => 
              authUser.id === updatedUser.id ? { ...authUser, ...updatedUser } : authUser
          );
          storage.local.set('users_auth', updatedAuthUsers);

          return updated;
      });
  }, []);

  const deleteUser = useCallback((userId: string) => {
      setUsers(prev => {
          const updated = prev.filter(user => user.id !== userId);
          storage.local.set('users', updated);

          const authUsers = storage.local.get<User[]>('users_auth', []);
          storage.local.set('users_auth', authUsers.filter(user => user.id !== userId));

          return updated;
      });
  }, []);
  
  const getUserById = useCallback((userId: string): User | undefined => {
    return users.find(u => u.id === userId);
  }, [users]);
  
  const addSupplier = useCallback((supplierData: Omit<Supplier, 'id'>) => {
    const newSupplier = { ...supplierData, id: `supplier-${Date.now()}` };
    setSuppliers(prev => {
        const updated = [...prev, newSupplier];
        storage.local.set('suppliers', updated);
        return updated;
    });
  }, []);

  const updateSupplier = useCallback((updatedSupplier: Supplier) => {
    setSuppliers(prev => {
        const updated = prev.map(s => s.id === updatedSupplier.id ? updatedSupplier : s);
        storage.local.set('suppliers', updated);
        return updated;
    });
  }, []);

  const deleteSupplier = useCallback((supplierId: string) => {
    setProducts(prev => {
        const updated = prev.map(p => ({
            ...p,
            suppliers: p.suppliers.filter(s => s.supplierId !== supplierId)
        }));
        storage.local.set('products', updated);
        return updated;
    });

    setSuppliers(prev => {
        const updated = prev.filter(s => s.id !== supplierId);
        storage.local.set('suppliers', updated);
        return updated;
    });
  }, []);

  const addProduct = useCallback((productData: Omit<Product, 'id'>) => {
    if (products.some(p => p.reference === productData.reference)) {
        alert('Error: Ya existe un producto con esa referencia.');
        throw new Error('Reference code already exists');
    }
    const newProduct = { ...productData, id: `prod-${Date.now()}` };
    setProducts(prev => {
        const updated = [...prev, newProduct];
        storage.local.set('products', updated);
        return updated;
    });
  }, [products]);

  const updateProduct = useCallback((updatedProduct: Product) => {
     if (products.some(p => p.id !== updatedProduct.id && p.reference === updatedProduct.reference)) {
        alert('Error: Ya existe otro producto con esa referencia.');
        throw new Error('Reference code already exists');
    }
    setProducts(prev => {
        const updated = prev.map(p => p.id === updatedProduct.id ? updatedProduct : p);
        storage.local.set('products', updated);
        return updated;
    });
  }, [products]);

  const deleteProduct = useCallback((productId: string) => {
    setProducts(prev => {
        const updated = prev.filter(p => p.id !== productId);
        storage.local.set('products', updated);
        return updated;
    });
  }, []);

  const addFamily = useCallback((name: string): CatalogFamily => {
    const trimmedName = name.trim();
    if (!trimmedName || families.some(f => f.name.toLowerCase() === trimmedName.toLowerCase())) {
        alert('Error: El nombre de la familia ya existe o está vacío.');
        throw new Error('Family name already exists or is empty.');
    }
    const newFamily: CatalogFamily = { id: `fam-${Date.now()}`, name: trimmedName };
    setFamilies(prev => {
        const updated = [...prev, newFamily];
        storage.local.set('families', updated);
        return updated;
    });
    return newFamily;
  }, [families]);
  
  const deleteFamily = useCallback((familyId: string) => {
    if (DEFAULT_FAMILIES.some(f => f.id === familyId)) {
        alert("No se pueden eliminar las familias predefinidas del sistema.");
        return;
    }
    setFamilies(prev => {
        const updated = prev.filter(f => f.id !== familyId);
        storage.local.set('families', updated);
        return updated;
    });
    setCategories(prev => {
        const updated = prev.filter(c => c.familyId !== familyId);
        storage.local.set('categories', updated);
        return updated;
    });
    setProducts(prev => {
        const updated = prev.map(p => (p.family === familyId) ? {...p, family: '', category: ''} : p);
        storage.local.set('products', updated);
        return updated;
    });
  }, []);

  const addCategory = useCallback((categoryData: Omit<CatalogCategory, 'id'>) => {
     if (!categoryData.name.trim() || categories.some(c => c.name.toLowerCase() === categoryData.name.trim().toLowerCase() && c.familyId === categoryData.familyId)) {
        alert('Error: El nombre de la categoría ya existe en esta familia o está vacío.');
        throw new Error('Category name already exists in this family or is empty.');
    }
    const newCategory = { ...categoryData, id: `cat-${Date.now()}` };
    setCategories(prev => {
        const updated = [...prev, newCategory];
        storage.local.set('categories', updated);
        return updated;
    });
    return newCategory;
  }, [categories]);

  const deleteCategory = useCallback((categoryId: string) => {
    if (DEFAULT_CATEGORIES.some(c => c.id === categoryId)) {
        alert("No se pueden eliminar las categorías predefinidas del sistema.");
        return;
    }
    setCategories(prev => {
        const updated = prev.filter(c => c.id !== categoryId);
        storage.local.set('categories', updated);
        return updated;
    });
    setProducts(prev => {
        const updated = prev.map(p => (p.category === categoryId) ? {...p, category: ''} : p);
        storage.local.set('products', updated);
        return updated;
    });
  }, []);

  const addProductState = useCallback((newState: string) => {
    const trimmedState = newState.trim();
    if (trimmedState && !productStates.some(s => s.toLowerCase() === trimmedState.toLowerCase())) {
        setProductStates(prev => {
            const updated = [...prev, trimmedState];
            storage.local.set('productStates', updated);
            return updated;
        });
    } else {
        alert('El estado del producto ya existe o está vacío.');
    }
  }, [productStates]);

  const addEvent = useCallback((eventData: Omit<Event, 'id'>): Event => {
    const newEvent = { ...eventData, id: `event-${Date.now()}` };
    setEvents(prev => {
        const updated = [...prev, newEvent];
        storage.local.set('events', updated);
        return updated;
    });
    return newEvent;
  }, []);

  const updateEvent = useCallback((updatedEvent: Event) => {
    setEvents(prev => {
        const updated = prev.map(e => e.id === updatedEvent.id ? updatedEvent : e);
        storage.local.set('events', updated);
        return updated;
    });
  }, []);

  const deleteEvent = useCallback((eventId: string) => {
    setEvents(prev => {
        const updated = prev.filter(e => e.id !== eventId);
        storage.local.set('events', updated);
        return updated;
    });
  }, []);

  const getOrdersByTeacher = useCallback((teacherId: string) => orders.filter(o => o.teacherId === teacherId), [orders]);
  
  const getOrderWithItems = useCallback((orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    const items = orderItems.filter(i => i.orderId === orderId);
    return { order, items };
  }, [orders, orderItems]);

  const saveOrder = useCallback((orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'type'> & {id?: string, type?: 'replenishment'}, itemsData: Omit<OrderItem, 'id' | 'orderId'>[]): Order => {
      let finalOrder: Order;
      const now = new Date().toISOString();

      setOrders(prevOrders => {
          let updatedOrders;
          if (orderData.id) { // Update
              updatedOrders = prevOrders.map(o => {
                  if (o.id === orderData.id) {
                      finalOrder = { ...o, ...orderData, updatedAt: now };
                      return finalOrder;
                  }
                  return o;
              });
          } else { // Create
              finalOrder = { ...orderData, id: `order-${Date.now()}`, createdAt: now, updatedAt: now };
              updatedOrders = [...prevOrders, finalOrder];
          }
          storage.local.set('orders', updatedOrders);
          
          setOrderItems(prevItems => {
              const otherItems = prevItems.filter(i => i.orderId !== finalOrder.id);
              const newItems = itemsData.map(item => ({ ...item, id: `item-${Date.now()}-${Math.random()}`, orderId: finalOrder.id }));
              const updatedItems = [...otherItems, ...newItems];
              storage.local.set('orderItems', updatedItems);
              return updatedItems;
          });

          return updatedOrders;
      });

      // @ts-ignore - finalOrder is assigned within the setState callback
      return finalOrder;
  }, []);
  
  const deleteOrder = useCallback((orderId: string) => {
    setOrders(prev => {
        const updated = prev.filter(o => o.id !== orderId);
        storage.local.set('orders', updated);
        return updated;
    });
    setOrderItems(prev => {
        const updated = prev.filter(i => i.orderId !== orderId);
        storage.local.set('orderItems', updated);
        return updated;
    });
  }, []);

  const addSale = useCallback((saleData: Omit<Sale, 'id'>) => {
    const newSale = { ...saleData, id: `sale-${Date.now()}` };
    setSales(prev => {
        const updated = [...prev, newSale];
        storage.local.set('sales', updated);
        return updated;
    });
  }, []);

  const updateSale = useCallback((updatedSale: Sale) => {
    setSales(prev => {
        const updated = prev.map(s => s.id === updatedSale.id ? updatedSale : s);
        storage.local.set('sales', updated);
        return updated;
    });
  }, []);

  const deleteSale = useCallback((saleId: string) => {
    setSales(prev => {
        const updated = prev.filter(s => s.id !== saleId);
        storage.local.set('sales', updated);
        return updated;
    });
  }, []);

  const addRecipe = useCallback((recipeData: Omit<Recipe, 'id'>) => {
    const newRecipe = { ...recipeData, id: `recipe-${Date.now()}` };
    setRecipes(prev => {
        const updated = [...prev, newRecipe];
        storage.local.set('recipes', updated);
        return updated;
    });
  }, []);

  const updateRecipe = useCallback((updatedRecipe: Recipe) => {
    setRecipes(prev => {
        const updated = prev.map(r => r.id === updatedRecipe.id ? updatedRecipe : r);
        storage.local.set('recipes', updated);
        return updated;
    });
  }, []);

  const deleteRecipe = useCallback((recipeId: string) => {
    setRecipes(prev => {
        const updated = prev.filter(r => r.id !== recipeId);
        storage.local.set('recipes', updated);
        return updated;
    });
  }, []);

  const addServiceGroup = useCallback((groupData: Omit<ServiceGroup, 'id'>) => {
    const newGroup = { ...groupData, id: `sgroup-${Date.now()}` };
    setServiceGroups(prev => {
        const updated = [...prev, newGroup];
        storage.local.set('serviceGroups', updated);
        return updated;
    });
  }, []);

  const updateServiceGroup = useCallback((updatedGroup: ServiceGroup) => {
    setServiceGroups(prev => {
        const updated = prev.map(g => g.id === updatedGroup.id ? updatedGroup : g);
        storage.local.set('serviceGroups', updated);
        return updated;
    });
  }, []);

  const deleteServiceGroup = useCallback((groupId: string) => {
    setServiceGroups(prev => {
        const updated = prev.filter(g => g.id !== groupId);
        storage.local.set('serviceGroups', updated);
        return updated;
    });
  }, []);
  
  const addService = useCallback((serviceData: Omit<Service, 'id'>) => {
    const newService = { ...serviceData, id: `service-${Date.now()}` };
    setServices(prev => {
        const updated = [...prev, newService];
        storage.local.set('services', updated);
        return updated;
    });
  }, []);

  const updateService = useCallback((updatedService: Service) => {
    setServices(prev => {
        const updated = prev.map(s => s.id === updatedService.id ? updatedService : s);
        storage.local.set('services', updated);
        return updated;
    });
  }, []);

  const deleteService = useCallback((serviceId: string) => {
    setServices(prev => {
        const updated = prev.filter(s => s.id !== serviceId);
        storage.local.set('services', updated);
        return updated;
    });
  }, []);

  const addCycle = useCallback((cycleData: Omit<Cycle, 'id'>) => {
    const newCycle: Cycle = { ...cycleData, id: `cycle-${Date.now()}`};
    setCycles(prev => {
        const updated = [...prev, newCycle];
        storage.local.set('cycles', updated);
        return updated;
    });
  }, []);
  
  const updateCycle = useCallback((updatedCycle: Cycle) => {
    setCycles(prev => {
        const updated = prev.map(c => c.id === updatedCycle.id ? updatedCycle : c);
        storage.local.set('cycles', updated);
        return updated;
    });
  }, []);

  const deleteCycle = useCallback((cycleId: string) => {
    const modulesToDelete = modules.filter(m => m.cycleId === cycleId);
    modulesToDelete.forEach(m => deleteModule(m.id));
    setCycles(prev => {
        const updated = prev.filter(c => c.id !== cycleId);
        storage.local.set('cycles', updated);
        return updated;
    });
  }, [modules]); // deleteModule is not a dependency as it is defined in the same scope

  const addModule = useCallback((moduleData: Omit<Module, 'id'>) => {
    const newModule: Module = {...moduleData, id: `mod-${Date.now()}`};
    setModules(prev => {
        const updated = [...prev, newModule];
        storage.local.set('modules', updated);
        return updated;
    });
  }, []);

  const updateModule = useCallback((updatedModule: Module) => {
    setModules(prev => {
        const updated = prev.map(m => m.id === updatedModule.id ? updatedModule : m);
        storage.local.set('modules', updated);
        return updated;
    });
  }, []);

  const deleteModule = useCallback((moduleId: string) => {
    const groupsToDelete = groups.filter(g => g.moduleId === moduleId);
    groupsToDelete.forEach(g => deleteGroup(g.id));
    setModules(prev => {
        const updated = prev.filter(m => m.id !== moduleId);
        storage.local.set('modules', updated);
        return updated;
    });
  }, [groups]); // deleteGroup is not a dependency

  const addGroup = useCallback((groupData: Omit<Group, 'id'>) => {
    const newGroup: Group = {...groupData, id: `group-${Date.now()}`};
    setGroups(prev => {
        const updated = [...prev, newGroup];
        storage.local.set('groups', updated);
        return updated;
    });
  }, []);

  const updateGroup = useCallback((updatedGroup: Group) => {
    setGroups(prev => {
        const updated = prev.map(g => g.id === updatedGroup.id ? updatedGroup : g);
        storage.local.set('groups', updated);
        return updated;
    });
  }, []);

  const deleteGroup = useCallback((groupId: string) => {
    setAssignments(prev => {
        const updated = prev.filter(a => a.groupId !== groupId);
        storage.local.set('assignments', updated);
        return updated;
    });
    setGroups(prev => {
        const updated = prev.filter(g => g.id !== groupId);
        storage.local.set('groups', updated);
        return updated;
    });
  }, []);

  const assignTeacher = useCallback((groupId: string, professorId: string | null) => {
    setAssignments(prev => {
        const updated = [...prev];
        const index = updated.findIndex(a => a.groupId === groupId);
        if (professorId) {
            if (index > -1) {
                updated[index] = { ...updated[index], professorId };
            } else {
                updated.push({ id: `assign-${Date.now()}`, groupId, professorId });
            }
        } else if (index > -1) {
            updated.splice(index, 1);
        }
        storage.local.set('assignments', updated);
        return updated;
    });
  }, []);

  const addClassroom = useCallback((classroomData: Omit<Classroom, 'id' | 'students' | 'products' | 'suppliers' | 'events' | 'orders' | 'orderItem' | 'recipes' | 'families' | 'categories' | 'productStates'>) => {
    const newClassroom: Classroom = {
        ...classroomData,
        id: `cls-${Date.now()}`,
        students: [], products: [], suppliers: [], events: [], orders: [], orderItem: [], recipes: [],
        families: DEFAULT_FAMILIES, categories: DEFAULT_CATEGORIES, productStates: DEFAULT_PRODUCT_STATES,
    };
    setClassrooms(prev => {
        const updated = [...prev, newClassroom];
        storage.local.set('classrooms', updated);
        return updated;
    });
  }, []);

  const updateClassroom = useCallback((updatedClassroom: Classroom) => {
    setClassrooms(prev => {
        const updated = prev.map(c => c.id === updatedClassroom.id ? updatedClassroom : c);
        storage.local.set('classrooms', updated);
        return updated;
    });
  }, []);

  const deleteClassroom = useCallback((classroomId: string) => {
    setClassrooms(prev => {
        const updated = prev.filter(c => c.id !== classroomId);
        storage.local.set('classrooms', updated);
        return updated;
    });
  }, []);
    
  const updateClassroomContent = useCallback(<K extends keyof Classroom>(classroomId: string, key: K, data: Classroom[K]) => {
    setClassrooms(prev => {
        const updated = prev.map(c => (c.id === classroomId) ? { ...c, [key]: data } : c);
        storage.local.set('classrooms', updated);
        return updated;
    });
  }, []);
    
  const resetClassroom = useCallback((classroomId: string) => {
    setClassrooms(prev => {
        const updated = prev.map(c => {
            if (c.id === classroomId) {
                return { ...c, students: [], products: [], suppliers: [], events: [], orders: [], orderItem: [], recipes: [] };
            }
            return c;
        });
        storage.local.set('classrooms', updated);
        return updated;
    });
  }, []);

  const downloadBackupData = () => {
    const allDataKeys = ['users', 'creatorInfo', 'companyInfo', 'theme', 'cycles', 'modules', 'groups', 'assignments', 'suppliers', 'products', 'events', 'orders', 'orderItems', 'sales', 'families', 'categories', 'productStates', 'recipes', 'serviceGroups', 'services', 'classrooms', 'messages', 'notifications', 'incidents', 'miniEconomato'];
    const allData = allDataKeys.reduce((acc, key) => {
        acc[key] = storage.local.get(key, []);
        return acc;
    }, {} as Record<string, any>);
    
    const dataStr = JSON.stringify(allData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const now = new Date();
    const timestamp = `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}-${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}${now.getSeconds().toString().padStart(2, '0')}`;
    const exportFileDefaultName = `backup-${timestamp}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();

    const newRecord: BackupRecord = { date: now.toISOString(), filename: exportFileDefaultName, size: dataStr.length };
    
    setBackupHistory(prev => {
        const updated = [newRecord, ...prev].slice(0, 10);
        storage.local.set('backupHistory', updated);
        return updated;
    });

    storage.local.remove('lastBackupDate');
  };

  const restoreApplicationData = (backupFileContent: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        try {
            const data = JSON.parse(backupFileContent);
            if (data.users && (data.creatorInfo || data.companyInfo) && data.theme) {
                Object.keys(data).forEach(key => {
                    storage.local.set(key, data[key]);
                });
                const authUsers = data.users.map((u: User) => ({ ...u, password: 'password' }));
                storage.local.set('users_auth', authUsers);
                resolve();
            } else {
                reject(new Error("Archivo de copia de seguridad inválido o corrupto."));
            }
        } catch (e) {
            reject(new Error("Error al leer el archivo. Asegúrate de que es un JSON válido."));
        }
    });
  };
  
  const resetApplicationData = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.hash = '/login';
    window.location.reload();
  };

  const sendMessage = useCallback((messageData: Omit<Message, 'id' | 'timestamp' | 'readBy'>) => {
    const newMessage: Message = { ...messageData, id: `msg-${Date.now()}`, timestamp: new Date().toISOString(), readBy: [messageData.senderId] };
    setMessages(prev => {
        const updated = [...prev, newMessage];
        storage.local.set('messages', updated);
        return updated;
    });
  }, []);

  const markMessageAsRead = useCallback((messageId: string, userId: string) => {
    setMessages(prev => {
        const updated = prev.map(msg => (msg.id === messageId && !msg.readBy.includes(userId)) ? { ...msg, readBy: [...msg.readBy, userId] } : msg);
        storage.local.set('messages', updated);
        return updated;
    });
  }, []);

   const addNotification = useCallback((notificationData: Omit<Notification, 'id'|'timestamp'|'isRead'>) => {
    const newNotification: Notification = { ...notificationData, id: `notif-${Date.now()}`, timestamp: new Date().toISOString(), isRead: false };
    setNotifications(prev => {
        const updated = [newNotification, ...prev].slice(0, 50); // Keep last 50
        storage.local.set('notifications', updated);
        return updated;
    });
  }, []);

  const markNotificationAsRead = useCallback((notificationId: string) => {
    setNotifications(prev => {
        const updated = prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n);
        storage.local.set('notifications', updated);
        return updated;
    });
  }, []);
  
  const markAllNotificationsAsRead = useCallback((userId: string) => {
    setNotifications(prev => {
        const updated = prev.map(n => n.userId === userId ? { ...n, isRead: true } : n);
        storage.local.set('notifications', updated);
        return updated;
    });
  }, []);

    const processEventOrders = useCallback((eventId: string, modifiedItemsData: { orderItemId: string; newQuantity: number, teacherId: string }[], senderId: string) => {
        setOrderItems(prevItems => {
            const updatedItemsMap = new Map(modifiedItemsData.map(d => [d.orderItemId, d.newQuantity]));
            const updated = prevItems.map(item => updatedItemsMap.has(item.id) ? { ...item, quantity: updatedItemsMap.get(item.id)! } : item);
            storage.local.set('orderItems', updated);

            setOrders(prevOrders => {
                const updatedOrders = prevOrders.map(order => (order.eventId === eventId && order.status === OrderStatus.SUBMITTED) ? { ...order, status: OrderStatus.PROCESSED, updatedAt: new Date().toISOString() } : order);
                storage.local.set('orders', updatedOrders);
                return updatedOrders;
            });
            
            const teachersToNotify = new Map<string, { modified: any[] }>();
            modifiedItemsData.forEach(mod => {
                if (!teachersToNotify.has(mod.teacherId)) teachersToNotify.set(mod.teacherId, { modified: [] });
                const originalItem = prevItems.find(i => i.id === mod.orderItemId);
                if(originalItem && originalItem.quantity !== mod.newQuantity) {
                    teachersToNotify.get(mod.teacherId)!.modified.push({ name: originalItem.productName, from: originalItem.quantity, to: mod.newQuantity });
                }
            });

            teachersToNotify.forEach((data, teacherId) => {
                if (data.modified.length > 0) {
                    const eventName = events.find(e => e.id === eventId)?.name || 'un evento';
                    const subject = `Modificaciones en tu pedido para ${eventName}`;
                    let body = "El gestor de almacén ha realizado los siguientes ajustes en tu pedido:\n\n";
                    data.modified.forEach(mod => { body += `- ${mod.name}: Cantidad ajustada de ${mod.from} a ${mod.to}.\n`; });
                    body += "\nPor favor, revisa tu portal de pedidos para más detalles.";
                    sendMessage({ senderId, recipientIds: [teacherId], subject, body });
                    addNotification({ userId: teacherId, title: `Ajustes en tu pedido para ${eventName}`, message: `El almacén ha modificado tu pedido. Haz clic para revisar.`, link: '/teacher/order-portal' });
                }
            });
            return updated;
        });
    }, [events, sendMessage, addNotification]);

    const reopenProcessedOrders = useCallback((eventId: string) => {
        setOrders(prev => {
            const updated = prev.map(order => (order.eventId === eventId && order.status === OrderStatus.PROCESSED) ? { ...order, status: OrderStatus.SUBMITTED, updatedAt: new Date().toISOString() } : order);
            storage.local.set('orders', updated);
            return updated;
        });
    }, []);

    const finalizeReception = useCallback((eventId: string, verifiedItems: any[]) => {
        setIncidents(prevIncidents => {
            const newIncidents: Incident[] = [];
            verifiedItems.forEach(vItem => {
                vItem.incidents.forEach((inc: any) => {
                    newIncidents.push({ id: `inc-${Date.now()}-${Math.random()}`, eventId, productId: vItem.productId, productName: vItem.productName, supplierId: inc.supplierId, date: new Date().toISOString(), description: inc.description, orderItemIds: vItem.breakdown.map((bd: any) => bd.orderItemId) });
                });
            });
            const updatedIncidents = [...prevIncidents, ...newIncidents];
            storage.local.set('incidents', updatedIncidents);
            
            setOrders(prevOrders => {
                const itemsWithIssues = new Set<string | null>(verifiedItems.filter(v => v.verificationState !== 'ok').map(v => v.productId));
                const eventOrderIds = new Set(prevOrders.filter(o => o.eventId === eventId && o.status === OrderStatus.PROCESSED).map(o => o.id));
                const eventItems = orderItems.filter(i => eventOrderIds.has(i.orderId));
                const affectedOrderIds = new Set<string>(eventItems.filter(i => itemsWithIssues.has(i.productId)).map(i => i.orderId));
                
                const updatedOrders = prevOrders.map(order => {
                    if (eventOrderIds.has(order.id)) {
                        const newStatus = affectedOrderIds.has(order.id) ? OrderStatus.RECEIVED_PARTIAL : OrderStatus.RECEIVED_OK;
                        return { ...order, status: newStatus, updatedAt: new Date().toISOString() };
                    }
                    return order;
                });
                storage.local.set('orders', updatedOrders);
                return updatedOrders;
            });
            return updatedIncidents;
        });
    }, [orderItems]);

  const updateMiniEconomato = useCallback((items: MiniEconomatoItem[]) => {
      setMiniEconomato(items);
      storage.local.set('miniEconomato', items);
  }, []);
  
  const assignExpenseFromMiniEconomato = useCallback((productId: string, teacherId: string, quantity: number) => {
      setMiniEconomato(prev => {
          const itemIndex = prev.findIndex(i => i.productId === productId);
          if (itemIndex === -1) throw new Error("Producto no encontrado en el Mini-Economato.");
          
          const item = prev[itemIndex];
          if (quantity > item.currentStock) throw new Error("Stock insuficiente.");
      
          const product = products.find(p => p.id === productId);
          if (!product) throw new Error("Definición del producto no encontrada.");
      
          const activeEvent = events.find(e => e.type === EventType.REGULAR && e.status === EventStatus.ACTIVE);
          if (!activeEvent) throw new Error("No hay un evento de pedido regular activo para imputar el gasto.");
      
          const bestPriceSupplier = product.suppliers.filter(s => s.status === 'Activo').sort((a,b) => a.price - b.price)[0];
          if (!bestPriceSupplier) throw new Error("El producto no tiene proveedores activos.");
          
          saveOrder({
              eventId: activeEvent.id,
              teacherId,
              status: OrderStatus.PROCESSED,
              notes: `Consumo desde Mini-Economato. Registrado por Almacén.`,
          }, [{
              productId: product.id, productName: product.name, quantity, unit: product.unit, isOutOfCatalog: false,
              supplierId: bestPriceSupplier.supplierId, unitPrice: bestPriceSupplier.price,
          }]);
      
          const updated = [...prev];
          updated[itemIndex] = { ...item, currentStock: item.currentStock - quantity };
          storage.local.set('miniEconomato', updated);
          return updated;
      });
  }, [miniEconomato, products, events, saveOrder]);


  return (
    <DataContext.Provider value={{ 
        users, setUsers, addUser, updateUser, deleteUser, getUserById, 
        suppliers, addSupplier, updateSupplier, deleteSupplier,
        products, addProduct, updateProduct, deleteProduct,
        families, addFamily, deleteFamily, categories, productStates, addCategory, deleteCategory, addProductState,
        events, addEvent, updateEvent, deleteEvent,
        orders, orderItems, getOrdersByTeacher, getOrderWithItems, saveOrder, deleteOrder, processEventOrders, reopenProcessedOrders, finalizeReception,
        incidents, sales, addSale, updateSale, deleteSale,
        recipes, addRecipe, updateRecipe, deleteRecipe,
        serviceGroups, addServiceGroup, updateServiceGroup, deleteServiceGroup,
        services, addService, updateService, deleteService,
        classrooms, addClassroom, updateClassroom, deleteClassroom, updateClassroomContent, resetClassroom,
        backupHistory, downloadBackupData, restoreApplicationData, resetApplicationData,
        cycles, modules, groups, assignments, addCycle, updateCycle, deleteCycle, addModule, updateModule, deleteModule, addGroup, updateGroup, deleteGroup, assignTeacher,
        messages, sendMessage, markMessageAsRead,
        notifications, addNotification, markNotificationAsRead, markAllNotificationsAsRead,
        companyInfo, updateCompanyInfo,
        miniEconomato, updateMiniEconomato, assignExpenseFromMiniEconomato,
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};