import { AppData, Profile, User, Supplier, Product, Event, Order, Incident, Classroom, Assignment, Recipe, Sale, Message, StockItem } from '../types';
import { users as initialUsers } from './authService';
import { trainingCycles, modules, groups } from './dataService';

// This file now contains a much richer dataset for demonstration purposes.

// --- USERS ---
const demoUsers: User[] = [
    // Keep initial users but ensure they have demo-relevant data
    { ...initialUsers.find(u => u.email === 'admin@managerpro.edu')!, id: 'user-1', name: 'Laura García (Admin)', contractType: 'Fijo', roleType: 'Titular', phone: '600112233', address: 'Calle Falsa 123' },
    { ...initialUsers.find(u => u.email === 'manager@managerpro.edu')!, id: 'user-2', name: 'David López (Almacén)', phone: '600223344', address: 'Plaza del Almacén 45' },
    { ...initialUsers.find(u => u.email === 'teacher@managerpro.edu')!, id: 'teacher-1', name: 'Ana Martínez (Tutora)', classroomId: 'classroom-1', contractType: 'Fijo', roleType: 'Titular', phone: '611223344', address: 'Avenida del Saber 45' },
    { ...initialUsers.find(u => u.email === 'managerproapp@gmail.com')!, id: 'user-4', name: 'Super Usuario' },
    { ...initialUsers.find(u => u.email === 'student@managerpro.edu')!, id: 'student-1', name: 'Pablo Picasso', classroomId: 'classroom-1', studentSimulatedProfile: Profile.TEACHER },
    
    // Add more users for a rich demo
    { id: 'teacher-2', name: 'Carlos Gomez (Tutor)', email: 'carlos.gomez@managerpro.edu', password: 'password', avatar: 'https://i.pravatar.cc/150?u=teacher-2', profiles: [Profile.TEACHER], activityStatus: 'Activo', locationStatus: 'En el centro', contractType: 'Fijo', roleType: 'Titular', phone: '622334455', address: 'Plaza Mayor 1', classroomId: 'classroom-2' },
    { id: 'teacher-3', name: 'Lucia Fernandez', email: 'lucia.fernandez@managerpro.edu', password: 'password', avatar: 'https://i.pravatar.cc/150?u=teacher-3', profiles: [Profile.TEACHER], activityStatus: 'Activo', locationStatus: 'Fuera del centro', contractType: 'Interino', roleType: 'Sustituto', phone: '633445566', address: 'Camino Nuevo 8' },
    { id: 'teacher-4', name: 'Javier Rodriguez', email: 'javier.r@managerpro.edu', password: 'password', avatar: 'https://i.pravatar.cc/150?u=teacher-4', profiles: [Profile.TEACHER], activityStatus: 'Activo', locationStatus: 'En el centro', contractType: 'Fijo', roleType: 'Titular', phone: '644556677', address: 'Calle Ancha 10' },
    { id: 'user-admin-2', name: 'Elena Torres (Admin)', email: 'elena.torres@managerpro.edu', password: 'password', avatar: 'https://i.pravatar.cc/150?u=admin-2', profiles: [Profile.ADMIN], activityStatus: 'Activo', locationStatus: 'En el centro', phone: '655667788', address: 'Avenida Principal 20' },
    { id: 'user-almacen-2', name: 'Miguel Ángel', email: 'miguel.angel@managerpro.edu', password: 'password', avatar: 'https://i.pravatar.cc/150?u=almacen-2', profiles: [Profile.ALMACEN], activityStatus: 'De Baja', locationStatus: 'Fuera del centro', phone: '666778899', address: 'Calle Secundaria 5' },

    // Students for Classroom 1
    { id: 'student-2', name: 'Elena Rodriguez', email: 'elena.r@managerpro.edu', password: 'password', avatar: 'https://i.pravatar.cc/150?u=student-2', profiles: [Profile.STUDENT], activityStatus: 'Activo', locationStatus: 'En el centro', classroomId: 'classroom-1', studentSimulatedProfile: Profile.TEACHER },
    { id: 'student-3', name: 'Javier Morales', email: 'javier.m@managerpro.edu', password: 'password', avatar: 'https://i.pravatar.cc/150?u=student-3', profiles: [Profile.STUDENT], activityStatus: 'Activo', locationStatus: 'En el centro', classroomId: 'classroom-1', studentSimulatedProfile: Profile.ALMACEN },
    { id: 'student-4', name: 'Sofía Castillo', email: 'sofia.c@managerpro.edu', password: 'password', avatar: 'https://i.pravatar.cc/150?u=student-4', profiles: [Profile.STUDENT], activityStatus: 'Activo', locationStatus: 'En el centro', classroomId: 'classroom-1', studentSimulatedProfile: Profile.ALMACEN },
    
    // Students for Classroom 2
    { id: 'student-5', name: 'Daniel Cruz', email: 'daniel.c@managerpro.edu', password: 'password', avatar: 'https://i.pravatar.cc/150?u=student-5', profiles: [Profile.STUDENT], activityStatus: 'Activo', locationStatus: 'En el centro', classroomId: 'classroom-2', studentSimulatedProfile: Profile.TEACHER },
    { id: 'student-6', name: 'Valentina Reyes', email: 'valentina.r@managerpro.edu', password: 'password', avatar: 'https://i.pravatar.cc/150?u=student-6', profiles: [Profile.STUDENT], activityStatus: 'Activo', locationStatus: 'En el centro', classroomId: 'classroom-2' },
    { id: 'student-7', name: 'Mateo Flores', email: 'mateo.f@managerpro.edu', password: 'password', avatar: 'https://i.pravatar.cc/150?u=student-7', profiles: [Profile.STUDENT], activityStatus: 'Activo', locationStatus: 'En el centro', classroomId: 'classroom-2', studentSimulatedProfile: Profile.ALMACEN },
];

// --- SUPPLIERS ---
const demoSuppliers: Supplier[] = [
    { id: 'sup-1', name: 'Distribuciones Gourmet SL', cif: 'B98765432', address: 'Pol. Ind. El Sabor, Parcela 5', phone: '912345678', email: 'pedidos@gourmetsl.es', contactPerson: 'Marta Casado', status: 'Activo' },
    { id: 'sup-2', name: 'Frutas y Verduras del Campo', cif: 'A12312312', address: 'Mercado Central, Puesto 12', phone: '934567890', email: 'info@delcampo.es', contactPerson: 'Juan Torres', status: 'Activo' },
    { id: 'sup-3', name: 'Carnes de la Sierra', cif: 'B87654321', address: 'Calle Mayor 45, Pueblo Seco', phone: '965432109', email: 'carnes@sierra.com', contactPerson: 'Pedro Jimenez', status: 'Inactivo' },
    { id: 'sup-4', name: 'Pescados del Norte', cif: 'C55544332', address: 'Puerto Pesquero, Muelle 3', phone: '981234567', email: 'ventas@pescadosnorte.com', contactPerson: 'María Soler', status: 'Activo' },
    { id: 'sup-5', name: 'Lácteos El Pastor', cif: 'F88877665', address: 'Finca La Pradera, s/n', phone: '928765432', email: 'pedidos@elpastor.es', contactPerson: 'Antonio Vega', status: 'Activo' },
];

// --- PRODUCTS ---
const demoProducts: Product[] = [
    // Carnes
    { id: 'prod-1', name: 'Solomillo de Ternera', description: 'Pieza de 1kg aprox.', reference: 'CAR-SOL-01', unit: 'kg', suppliers: [{ supplierId: 'sup-1', price: 25.50 }, { supplierId: 'sup-3', price: 24.90 }], tax: 10, category: 'VACUNO', family: 'Carnes', allergens: [], status: 'Activo', productState: 'Fresco', warehouseStatus: 'Disponible' },
    { id: 'prod-5', name: 'Pechuga de Pollo', description: 'Bandeja de 1kg', reference: 'CAR-POL-01', unit: 'kg', suppliers: [{ supplierId: 'sup-3', price: 6.80 }], tax: 10, category: 'AVES Y CAZA', family: 'Carnes', allergens: [], status: 'Activo', productState: 'Fresco', warehouseStatus: 'Disponible' },
    { id: 'prod-6', name: 'Costillar de Cerdo', description: 'Pieza entera', reference: 'CAR-CER-02', unit: 'kg', suppliers: [{ supplierId: 'sup-3', price: 8.50 }], tax: 10, category: 'CERDO', family: 'Carnes', allergens: [], status: 'Activo', productState: 'Fresco', warehouseStatus: 'Bajo Pedido' },
    
    // Pescados
    { id: 'prod-7', name: 'Merluza del Cantábrico', description: 'Pieza de 1.5kg aprox.', reference: 'PES-MER-01', unit: 'kg', suppliers: [{ supplierId: 'sup-4', price: 18.00 }], tax: 10, category: 'PESCADO', family: 'Pescados', allergens: ['Pescado'], status: 'Activo', productState: 'Fresco', warehouseStatus: 'Disponible' },
    { id: 'prod-8', name: 'Salmón Noruego', description: 'Lomo sin espinas', reference: 'PES-SAL-03', unit: 'kg', suppliers: [{ supplierId: 'sup-1', price: 22.50 }, { supplierId: 'sup-4', price: 21.90 }], tax: 10, category: 'PESCADO', family: 'Pescados', allergens: ['Pescado'], status: 'Activo', productState: 'Fresco', warehouseStatus: 'Disponible' },

    // Vegetales
    { id: 'prod-4', name: 'Lechuga Romana', description: 'Caja 12 unidades', reference: 'VER-LEC-01', unit: 'Uds', suppliers: [{ supplierId: 'sup-2', price: 0.60 }], tax: 4, category: 'VERDURAS', family: 'Vegetales', allergens: [], status: 'Activo', productState: 'Fresco', warehouseStatus: 'Disponible' },
    { id: 'prod-9', name: 'Tomate de Ensalada', description: 'Caja de 5kg', reference: 'VER-TOM-01', unit: 'kg', suppliers: [{ supplierId: 'sup-2', price: 1.80 }], tax: 4, category: 'VERDURAS', family: 'Vegetales', allergens: [], status: 'Activo', productState: 'Fresco', warehouseStatus: 'Disponible' },
    { id: 'prod-10', name: 'Patata Monalisa', description: 'Saco de 10kg', reference: 'VER-PAT-02', unit: 'kg', suppliers: [{ supplierId: 'sup-2', price: 0.95 }], tax: 4, category: 'VERDURAS', family: 'Vegetales', allergens: [], status: 'Activo', productState: 'Otros', warehouseStatus: 'Disponible' },
    { id: 'prod-11', name: 'Cebolla', description: 'Malla de 5kg', reference: 'VER-CEB-01', unit: 'kg', suppliers: [{ supplierId: 'sup-2', price: 0.85 }], tax: 4, category: 'VERDURAS', family: 'Vegetales', allergens: [], status: 'Activo', productState: 'Otros', warehouseStatus: 'Disponible' },
    
    // Lácteos y Huevos
    { id: 'prod-12', name: 'Huevos Camperos (Docena)', description: 'Clase L', reference: 'LAC-HUE-01', unit: 'Uds', suppliers: [{ supplierId: 'sup-5', price: 2.80 }], tax: 4, category: 'HUEVOS', family: 'LÁCTEOS Y HUEVOS', allergens: ['Huevos'], status: 'Activo', productState: 'Fresco', warehouseStatus: 'Disponible' },
    { id: 'prod-13', name: 'Leche Entera', description: 'Brick de 1L', reference: 'LAC-LEC-01', unit: 'L', suppliers: [{ supplierId: 'sup-1', price: 0.90 }, { supplierId: 'sup-5', price: 0.88 }], tax: 4, category: 'LÁCTEOS', family: 'LÁCTEOS Y HUEVOS', allergens: ['Lácteos'], status: 'Activo', productState: 'UHT', warehouseStatus: 'Disponible' },
    { id: 'prod-14', name: 'Queso Curado de Oveja', description: 'Cuña de 250g', reference: 'QUE-OVE-03', unit: 'Uds', suppliers: [{ supplierId: 'sup-5', price: 4.50 }], tax: 4, category: 'QUESOS', family: 'QUESOS', allergens: ['Lácteos'], status: 'Activo', productState: 'Otros', warehouseStatus: 'Disponible' },

    // Secos
    { id: 'prod-2', name: 'Harina de Trigo', description: 'Saco de 25kg', reference: 'ALI-HAR-05', unit: 'kg', suppliers: [{ supplierId: 'sup-1', price: 0.80 }], tax: 4, category: 'HARINAS', family: 'HARINAS, SEMILLAS Y GRANOS', allergens: ['Gluten'], status: 'Activo', productState: 'Otros', warehouseStatus: 'Disponible' },
    { id: 'prod-3', name: 'Aceite de Oliva Virgen Extra', description: 'Garrafa 5L', reference: 'ALI-ACE-02', unit: 'L', suppliers: [{ supplierId: 'sup-1', price: 6.50 }, { supplierId: 'sup-2', price: 6.75 }], tax: 10, category: 'ACEITES', family: 'ACEITES Y GRASAS', allergens: [], status: 'Activo', productState: 'Otros', warehouseStatus: 'Bajo Pedido' },
    { id: 'prod-15', name: 'Arroz Bomba', description: 'Paquete de 1kg', reference: 'ARR-BOM-01', unit: 'kg', suppliers: [{ supplierId: 'sup-1', price: 2.10 }], tax: 4, category: 'ARROCES', family: 'ARROCES, PASTAS Y LEGUMBRES', allergens: [], status: 'Activo', productState: 'Otros', warehouseStatus: 'Disponible' },
    { id: 'prod-16', name: 'Lenteja Pardina', description: 'Paquete de 1kg', reference: 'LEG-LEN-01', unit: 'kg', suppliers: [{ supplierId: 'sup-1', price: 1.90 }], tax: 4, category: 'LEGUMBRES', family: 'ARROCES, PASTAS Y LEGUMBRES', allergens: [], status: 'Inactivo', productState: 'Otros', warehouseStatus: 'Descontinuado' },
];

// --- EVENTS ---
const demoEvents: Event[] = [
    { id: 'evt-1', name: 'Pedido Semanal Ordinario', type: 'Regular', startDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), budgetPerTeacher: 300, status: 'Activo' },
    { id: 'evt-2', name: 'Extra Navidad', type: 'Extraordinario', startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), endDate: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(), budgetPerTeacher: 500, authorizedTeachers: ['teacher-1', 'teacher-4'], status: 'Activo' },
    { id: 'evt-3', name: 'Pedido Semanal Anterior', type: 'Regular', startDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), endDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), budgetPerTeacher: 250, status: 'Activo' },
    { id: 'evt-4', name: 'Jornadas Gastronómicas', type: 'Extraordinario', startDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(), budgetPerTeacher: 400, status: 'Activo' },
];

// --- ORDERS ---
const demoOrders: Order[] = [
    // Evento de Navidad (Pasado, Completado)
    { id: 'ord-1', userId: 'teacher-1', date: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(), status: 'Completado', eventId: 'evt-2', items: [{ productId: 'prod-1', quantity: 5, price: 25.50, tax: 10 }], cost: 140.25, notes: 'Para el menú de Navidad' },
    { id: 'ord-4', userId: 'teacher-4', date: new Date(Date.now() - 27 * 24 * 60 * 60 * 1000).toISOString(), status: 'Completado', eventId: 'evt-2', items: [{ productId: 'prod-8', quantity: 3, price: 21.90, tax: 10 }], cost: 72.27, notes: 'Salmón para los entrantes' },

    // Evento Semanal Anterior (Procesado)
    { id: 'ord-5', userId: 'teacher-1', date: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(), status: 'Procesado', eventId: 'evt-3', items: [{ productId: 'prod-13', quantity: 12, price: 0.88, tax: 4 }], cost: 10.98 },
    { id: 'ord-6', userId: 'teacher-3', date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(), status: 'Procesado', eventId: 'evt-3', items: [{ productId: 'prod-9', quantity: 5, price: 1.80, tax: 4 }, { productId: 'prod-10', quantity: 10, price: 0.95, tax: 4 }], cost: 19.24, notes: 'Base para sofritos' },
    
    // Evento Semanal Actual (Enviados y Borrador)
    { id: 'ord-2', userId: 'teacher-2', date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), status: 'Enviado', eventId: 'evt-1', items: [{ productId: 'prod-2', quantity: 10, price: 0.80, tax: 4 }, { productId: 'prod-4', quantity: 12, price: 0.60, tax: 4 }], cost: 15.90, notes: 'Básicos de cocina', newProductRequests: [{ productName: 'Tinta de Calamar Fresca (500g)', quantity: 2, notes: 'Proveedor sugerido: Pescados del Mar Menor, precio aprox 8€/ud' }] },
    { id: 'ord-3', userId: 'teacher-1', date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), status: 'Enviado', eventId: 'evt-1', items: [{ productId: 'prod-3', quantity: 2, price: 6.50, tax: 10 }], cost: 14.30, notes: '' },
    { id: 'ord-7', userId: 'teacher-4', date: new Date().toISOString(), status: 'Borrador', eventId: 'evt-1', items: [{ productId: 'prod-5', quantity: 8, price: 6.80, tax: 10 }], cost: 59.84, notes: 'Pruebas nuevo plato' },
];

// --- INCIDENTS ---
const demoIncidents: Incident[] = [
    { id: 'inc-1', date: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(), description: 'El solomillo llegó con la cadena de frío rota.', reportedBy: 'user-2', status: 'Resuelta', supplierId: 'sup-1', productId: 'prod-1', eventId: 'evt-2' },
    { id: 'inc-2', date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(), description: 'Faltaban 2kg de patatas en el saco.', reportedBy: 'user-2', status: 'Abierta', supplierId: 'sup-2', productId: 'prod-10', eventId: 'evt-3' },
];

// --- CLASSROOMS ---
const demoClassrooms: Classroom[] = [
    { id: 'classroom-1', name: 'Prácticas de Almacén 1º Cocina', tutorId: 'teacher-1' },
    { id: 'classroom-2', name: 'Simulador de Cocina Avanzada', tutorId: 'teacher-2' },
];

// --- FULL DEMO DATA EXPORT ---
export const demoData: AppData = {
    users: demoUsers,
    products: demoProducts,
    suppliers: demoSuppliers,
    events: demoEvents,
    orders: demoOrders,
    incidents: demoIncidents,
    trainingCycles,
    modules,
    groups,
    assignments: [
        { id: 'asg-1', userId: 'teacher-1', groupId: 'grp-c1-1-1' },
        { id: 'asg-2', userId: 'teacher-2', groupId: 'grp-c1-2-1' },
        { id: 'asg-3', userId: 'teacher-3', groupId: 'grp-c1-1-2' },
        { id: 'asg-4', userId: 'teacher-4', groupId: 'grp-c3-1-1' },
    ],
    recipes: [
        { id: 'rec-1', name: 'Solomillo Wellington', description: 'Clásico solomillo envuelto en hojaldre', authorId: 'teacher-1', yield: '4 raciones', ingredients: [{ productId: 'prod-1', quantity: 1, unit: 'kg' }], preparationSteps: 'Sellar, envolver y hornear.', isPublic: true, cost: 25.50, price: 45.00 }
    ],
    sales: [
        { id: 'sale-1', teacherId: 'teacher-1', date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(), amount: 150.75, category: 'Menú del Día' },
        { id: 'sale-2', teacherId: 'teacher-4', date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), amount: 230.50, category: 'Evento Especial' }
    ],
    miniEconomatoStock: [
        { id: 'prod-2', stock: 50, minStock: 20 },
        { id: 'prod-3', stock: 10, minStock: 15 }
    ],
    messages: [
        { id: 'msg-1', senderId: 'user-1', recipientIds: ['user-2'], subject: 'Revisión de Pedidos', body: 'Por favor, revisa los pedidos pendientes para el evento semanal.', date: new Date().toISOString(), readBy: {} }
    ],
    classrooms: demoClassrooms,
    // The following are sandboxed and will be loaded separately, but we include them here for completeness if needed.
    classroomProducts: [],
    classroomSuppliers: [],
    classroomEvents: [],
    classroomOrders: [],
};


// --- SANDBOXED DATA FOR CLASSROOMS ---
// This data will be manually loaded into localStorage by the DataContext's loadDemoData function

export const demoClassroom1Data = {
    products: [
        { id: 'cprod-1-1', name: 'Harina de Simulación', reference: 'SIM-HAR-01', category: 'Secos', classroomId: 'classroom-1' },
        { id: 'cprod-1-2', name: 'Agua Coloreada (Aceite)', reference: 'SIM-ACE-01', category: 'Líquidos', classroomId: 'classroom-1' },
    ],
    suppliers: [
        { id: 'csupp-1-1', name: 'Proveedor Ficticio A', classroomId: 'classroom-1' },
        { id: 'csupp-1-2', name: 'Proveedor de Pruebas B', classroomId: 'classroom-1' },
    ],
    events: [
        { id: 'cevt-1-1', name: 'Práctica #1: Pedido y Recepción', startDate: new Date().toISOString(), endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), classroomId: 'classroom-1' }
    ],
    orders: [
        { id: 'cord-1-1', userId: 'student-2', eventId: 'cevt-1-1', classroomId: 'classroom-1', date: new Date().toISOString(), status: 'Pendiente', items: [{ productId: 'cprod-1-1', quantity: 5 }] },
        { id: 'cord-1-2', userId: 'student-3', eventId: 'cevt-1-1', classroomId: 'classroom-1', date: new Date().toISOString(), status: 'Pendiente', items: [{ productId: 'cprod-1-1', quantity: 2 }, { productId: 'cprod-1-2', quantity: 1 }] },
    ],
};

export const demoClassroom2Data = {
    products: [
        { id: 'cprod-2-1', name: 'Carne de Soja (Solomillo)', reference: 'SIM-CAR-01', category: 'Carnes', classroomId: 'classroom-2' },
    ],
    suppliers: [
        { id: 'csupp-2-1', name: 'Proveedor Simulado C', classroomId: 'classroom-2' },
    ],
    events: [],
    orders: [],
};