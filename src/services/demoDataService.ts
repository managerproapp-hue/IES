// services/demoDataService.ts

// FIX: Add file extensions to imports to resolve module resolution errors.
import { AppData, Profile, User, Supplier, Product, Event, Order, Incident, Classroom, Assignment, Recipe, Sale, Message, StockItem } from '../types/index.ts';
// FIX: Add file extensions to imports to resolve module resolution errors.
import { users as initialUsers } from './authService.ts';
// FIX: Add file extensions to imports to resolve module resolution errors.
import { trainingCycles, modules, groups } from './dataService.ts';

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
    { id: 'sup-6', name: 'Panadería Artesana "El Horno"', cif: 'G11223344', address: 'Calle del Trigo, 18', phone: '954123456', email: 'pedidos@elhorno.es', contactPerson: 'Lucía Reyes', status: 'Activo' },
    { id: 'sup-7', name: 'Bebidas del Mundo S.A.', cif: 'A99887766', address: 'Av. de la Sed, 22', phone: '933211234', email: 'comercial@bebidasmundo.com', contactPerson: 'Carlos Ruiz', status: 'Activo' },
    { id: 'sup-8', name: 'Congelados Polares', cif: 'B76543210', address: 'Pol. Ind. El Frío, Nave 12', phone: '911987654', email: 'info@polares.es', contactPerson: 'Sofía Navarro', status: 'Activo' },
    { id: 'sup-9', name: 'Especias y Exóticos S.L.', cif: 'B34567890', address: 'Calle de la Canela, 3', phone: '976543210', email: 'pedidos@exoticos.net', contactPerson: 'Javier Moreno', status: 'Activo' },
    { id: 'sup-10', name: 'Suministros Hosteleros Pro', cif: 'B21098765', address: 'Gran Vía del Chef, 80', phone: '944556677', email: 'contacto@suministrospro.com', contactPerson: 'Isabel Giménez', status: 'Activo' },
];

// --- PRODUCTS ---
const demoProducts: Product[] = [
    // --- Carnes ---
    { id: 'prod-1', name: 'Solomillo de Ternera', description: 'Pieza de 1kg aprox.', reference: 'CAR-SOL-01', unit: 'kg', suppliers: [{ supplierId: 'sup-1', price: 25.50 }, { supplierId: 'sup-3', price: 24.90 }], tax: 10, category: 'VACUNO', family: 'Carnes', allergens: [], status: 'Activo', productState: 'Fresco', warehouseStatus: 'Disponible' },
    { id: 'prod-5', name: 'Pechuga de Pollo de Corral', description: 'Bandeja de 1kg', reference: 'CAR-POL-01', unit: 'kg', suppliers: [{ supplierId: 'sup-3', price: 8.80 }, { supplierId: 'sup-1', price: 9.20 }], tax: 10, category: 'AVES Y CAZA', family: 'Carnes', allergens: [], status: 'Activo', productState: 'Fresco', warehouseStatus: 'Disponible' },
    { id: 'prod-6', name: 'Costillar de Cerdo Ibérico', description: 'Pieza entera de 1.2kg aprox', reference: 'CAR-CER-02', unit: 'kg', suppliers: [{ supplierId: 'sup-3', price: 12.50 }, { supplierId: 'sup-1', price: 13.10 }], tax: 10, category: 'CERDO', family: 'Carnes', allergens: [], status: 'Activo', productState: 'Fresco', warehouseStatus: 'Bajo Pedido' },
    { id: 'prod-17', name: 'Entrecot de Vaca Madurada', description: '300g por pieza, 30 días maduración', reference: 'CAR-VAC-05', unit: 'kg', suppliers: [{ supplierId: 'sup-1', price: 35.00 }], tax: 10, category: 'VACUNO', family: 'Carnes', allergens: [], status: 'Activo', productState: 'Fresco', warehouseStatus: 'Bajo Pedido' },
    { id: 'prod-18', name: 'Carrilleras de Cerdo Ibérico', description: 'Limpias, envasadas al vacío', reference: 'CAR-CER-08', unit: 'kg', suppliers: [{ supplierId: 'sup-1', price: 14.75 }], tax: 10, category: 'CERDO', family: 'Carnes', allergens: [], status: 'Activo', productState: 'Fresco', warehouseStatus: 'Disponible' },
    { id: 'prod-19', name: 'Magret de Pato', description: 'Piezas de 350g aprox.', reference: 'CAR-PAT-01', unit: 'kg', suppliers: [{ supplierId: 'sup-1', price: 19.50 }], tax: 10, category: 'PATO', family: 'Carnes', allergens: [], status: 'Activo', productState: 'Congelado', warehouseStatus: 'Disponible' },
    { id: 'prod-20', name: 'Pierna de Cordero Lechal', description: 'Unidad de 600g aprox.', reference: 'CAR-COR-03', unit: 'kg', suppliers: [{ supplierId: 'sup-3', price: 18.90 }], tax: 10, category: 'CORDERO', family: 'Carnes', allergens: [], status: 'Activo', productState: 'Fresco', warehouseStatus: 'Bajo Pedido' },
    
    // --- Pescados y Mariscos ---
    { id: 'prod-7', name: 'Merluza del Cantábrico', description: 'Pieza de 1.5kg aprox.', reference: 'PES-MER-01', unit: 'kg', suppliers: [{ supplierId: 'sup-4', price: 18.00 }], tax: 10, category: 'PESCADO', family: 'Pescados', allergens: ['Pescado'], status: 'Activo', productState: 'Fresco', warehouseStatus: 'Disponible' },
    { id: 'prod-8', name: 'Salmón Noruego', description: 'Lomo sin espinas', reference: 'PES-SAL-03', unit: 'kg', suppliers: [{ supplierId: 'sup-1', price: 22.50 }, { supplierId: 'sup-4', price: 21.90 }], tax: 10, category: 'PESCADO', family: 'Pescados', allergens: ['Pescado'], status: 'Activo', productState: 'Fresco', warehouseStatus: 'Disponible' },
    { id: 'prod-21', name: 'Lomo de Atún Rojo', description: 'Pieza de 500g, calidad sushi', reference: 'PES-ATU-01', unit: 'kg', suppliers: [{ supplierId: 'sup-4', price: 45.00 }], tax: 10, category: 'PESCADO', family: 'Pescados', allergens: ['Pescado'], status: 'Activo', productState: 'Fresco', warehouseStatus: 'Bajo Pedido' },
    { id: 'prod-22', name: 'Gamba Roja de Huelva', description: 'Caja de 1kg, tamaño mediano', reference: 'MAR-GAM-01', unit: 'kg', suppliers: [{ supplierId: 'sup-4', price: 55.00 }], tax: 10, category: 'MARISCO', family: 'Marisco', allergens: ['Crustáceos'], status: 'Activo', productState: 'Congelado', warehouseStatus: 'Disponible' },
    { id: 'prod-23', name: 'Mejillones de Galicia', description: 'Malla de 1kg', reference: 'MAR-MEJ-01', unit: 'kg', suppliers: [{ supplierId: 'sup-4', price: 4.50 }], tax: 10, category: 'MARISCO', family: 'Marisco', allergens: ['Moluscos'], status: 'Activo', productState: 'Fresco', warehouseStatus: 'Disponible' },
    { id: 'prod-24', name: 'Pulpo Cocido', description: 'Pata de 250g envasada al vacío', reference: 'MAR-PUL-02', unit: 'Uds', suppliers: [{ supplierId: 'sup-4', price: 9.80 }, { supplierId: 'sup-8', price: 9.50 }], tax: 10, category: 'MARISCO', family: 'Marisco', allergens: ['Moluscos'], status: 'Activo', productState: 'Congelado', warehouseStatus: 'Disponible' },
    
    // --- Vegetales y Frutas ---
    { id: 'prod-4', name: 'Lechuga Romana', description: 'Caja 12 unidades', reference: 'VER-LEC-01', unit: 'Uds', suppliers: [{ supplierId: 'sup-2', price: 0.60 }], tax: 4, category: 'VERDURAS', family: 'Vegetales', allergens: [], status: 'Activo', productState: 'Fresco', warehouseStatus: 'Disponible' },
    { id: 'prod-9', name: 'Tomate de Ensalada', description: 'Caja de 5kg', reference: 'VER-TOM-01', unit: 'kg', suppliers: [{ supplierId: 'sup-2', price: 1.80 }], tax: 4, category: 'VERDURAS', family: 'Vegetales', allergens: [], status: 'Activo', productState: 'Fresco', warehouseStatus: 'Disponible' },
    { id: 'prod-10', name: 'Patata Monalisa', description: 'Saco de 10kg', reference: 'VER-PAT-02', unit: 'kg', suppliers: [{ supplierId: 'sup-2', price: 0.95 }], tax: 4, category: 'VERDURAS', family: 'Vegetales', allergens: [], status: 'Activo', productState: 'Otros', warehouseStatus: 'Disponible' },
    { id: 'prod-11', name: 'Cebolla', description: 'Malla de 5kg', reference: 'VER-CEB-01', unit: 'kg', suppliers: [{ supplierId: 'sup-2', price: 0.85 }], tax: 4, category: 'VERDURAS', family: 'Vegetales', allergens: [], status: 'Activo', productState: 'Otros', warehouseStatus: 'Disponible' },
    { id: 'prod-25', name: 'Pimiento de Padrón', description: 'Bolsa de 200g', reference: 'VER-PIM-03', unit: 'Uds', suppliers: [{ supplierId: 'sup-2', price: 1.50 }], tax: 4, category: 'VERDURAS', family: 'Vegetales', allergens: [], status: 'Activo', productState: 'Fresco', warehouseStatus: 'Disponible' },
    { id: 'prod-26', name: 'Setas de Temporada (Boletus)', description: 'Bandeja de 500g', reference: 'VER-SET-01', unit: 'kg', suppliers: [{ supplierId: 'sup-2', price: 28.00 }], tax: 4, category: 'SETAS', family: 'Vegetales', allergens: [], status: 'Activo', productState: 'Fresco', warehouseStatus: 'Bajo Pedido' },
    { id: 'prod-27', name: 'Aguacate', description: 'Malla de 2 unidades', reference: 'FRU-AGU-01', unit: 'Uds', suppliers: [{ supplierId: 'sup-2', price: 2.50 }], tax: 4, category: 'FRUTAS', family: 'Vegetales', allergens: [], status: 'Activo', productState: 'Fresco', warehouseStatus: 'Disponible' },
    { id: 'prod-28', name: 'Limones', description: 'Malla de 1kg', reference: 'FRU-LIM-01', unit: 'kg', suppliers: [{ supplierId: 'sup-2', price: 1.20 }], tax: 4, category: 'FRUTAS', family: 'Vegetales', allergens: [], status: 'Activo', productState: 'Fresco', warehouseStatus: 'Disponible' },

    // --- Lácteos y Huevos ---
    { id: 'prod-12', name: 'Huevos Camperos (Docena)', description: 'Clase L', reference: 'LAC-HUE-01', unit: 'Uds', suppliers: [{ supplierId: 'sup-5', price: 2.80 }], tax: 4, category: 'HUEVOS', family: 'LÁCTEOS Y HUEVOS', allergens: ['Huevos'], status: 'Activo', productState: 'Fresco', warehouseStatus: 'Disponible' },
    { id: 'prod-13', name: 'Leche Entera', description: 'Brick de 1L', reference: 'LAC-LEC-01', unit: 'L', suppliers: [{ supplierId: 'sup-1', price: 0.90 }, { supplierId: 'sup-5', price: 0.88 }], tax: 4, category: 'LÁCTEOS', family: 'LÁCTEOS Y HUEVOS', allergens: ['Lácteos'], status: 'Activo', productState: 'UHT', warehouseStatus: 'Disponible' },
    { id: 'prod-14', name: 'Queso Curado de Oveja', description: 'Cuña de 250g', reference: 'QUE-OVE-03', unit: 'Uds', suppliers: [{ supplierId: 'sup-5', price: 4.50 }, { supplierId: 'sup-1', price: 4.65 }], tax: 4, category: 'QUESOS', family: 'QUESOS', allergens: ['Lácteos'], status: 'Activo', productState: 'Otros', warehouseStatus: 'Disponible' },
    { id: 'prod-29', name: 'Nata para montar 35% MG', description: 'Brick de 1L', reference: 'LAC-NAT-02', unit: 'L', suppliers: [{ supplierId: 'sup-5', price: 3.50 }], tax: 4, category: 'LÁCTEOS', family: 'LÁCTEOS Y HUEVOS', allergens: ['Lácteos'], status: 'Activo', productState: 'UHT', warehouseStatus: 'Disponible' },
    { id: 'prod-30', name: 'Mantequilla sin sal', description: 'Pastilla de 250g', reference: 'LAC-MAN-01', unit: 'Uds', suppliers: [{ supplierId: 'sup-5', price: 2.20 }], tax: 10, category: 'GRASAS', family: 'ACEITES Y GRASAS', allergens: ['Lácteos'], status: 'Activo', productState: 'Fresco', warehouseStatus: 'Disponible' },
    { id: 'prod-31', name: 'Queso Parmesano Reggiano', description: 'Pieza de 200g', reference: 'QUE-PAR-01', unit: 'Uds', suppliers: [{ supplierId: 'sup-1', price: 5.50 }], tax: 4, category: 'QUESOS', family: 'QUESOS', allergens: ['Lácteos'], status: 'Activo', productState: 'Otros', warehouseStatus: 'Bajo Pedido' },
    
    // --- Secos, Conservas y Especias ---
    { id: 'prod-2', name: 'Harina de Trigo', description: 'Saco de 25kg', reference: 'ALI-HAR-05', unit: 'kg', suppliers: [{ supplierId: 'sup-1', price: 0.80 }, { supplierId: 'sup-6', price: 0.78 }], tax: 4, category: 'HARINAS', family: 'HARINAS, SEMILLAS Y GRANOS', allergens: ['Gluten'], status: 'Activo', productState: 'Otros', warehouseStatus: 'Disponible' },
    { id: 'prod-3', name: 'Aceite de Oliva Virgen Extra', description: 'Garrafa 5L', reference: 'ALI-ACE-02', unit: 'L', suppliers: [{ supplierId: 'sup-1', price: 32.50 }, { supplierId: 'sup-2', price: 33.75 }], tax: 10, category: 'ACEITES', family: 'ACEITES Y GRASAS', allergens: [], status: 'Activo', productState: 'Otros', warehouseStatus: 'Bajo Pedido' },
    { id: 'prod-15', name: 'Arroz Bomba', description: 'Paquete de 1kg', reference: 'ARR-BOM-01', unit: 'kg', suppliers: [{ supplierId: 'sup-1', price: 2.10 }], tax: 4, category: 'ARROCES', family: 'ARROCES, PASTAS Y LEGUMBRES', allergens: [], status: 'Activo', productState: 'Otros', warehouseStatus: 'Disponible' },
    { id: 'prod-16', name: 'Lenteja Pardina', description: 'Paquete de 1kg', reference: 'LEG-LEN-01', unit: 'kg', suppliers: [{ supplierId: 'sup-1', price: 1.90 }], tax: 4, category: 'LEGUMBRES', family: 'ARROCES, PASTAS Y LEGUMBRES', allergens: [], status: 'Inactivo', productState: 'Otros', warehouseStatus: 'Descontinuado' },
    { id: 'prod-32', name: 'Anchoas del Cantábrico', description: 'Lata de 100g', reference: 'CON-ANC-01', unit: 'Uds', suppliers: [{ supplierId: 'sup-4', price: 4.80 }], tax: 10, category: 'CONSERVAS', family: 'CONSERVAS', allergens: ['Pescado'], status: 'Activo', productState: 'Conservas', warehouseStatus: 'Disponible' },
    { id: 'prod-33', name: 'Vinagre de Jerez', description: 'Botella de 750ml', reference: 'CON-VIN-02', unit: 'Uds', suppliers: [{ supplierId: 'sup-1', price: 3.20 }], tax: 10, category: 'CONDIMENTOS', family: 'ESPECIAS Y CONDIMENTOS', allergens: ['Sulfitos'], status: 'Activo', productState: 'Otros', warehouseStatus: 'Disponible' },
    { id: 'prod-34', name: 'Pimentón de la Vera (Dulce)', description: 'Lata de 75g', reference: 'ESP-PIM-01', unit: 'Uds', suppliers: [{ supplierId: 'sup-9', price: 2.10 }], tax: 10, category: 'ESPECIAS', family: 'ESPECIAS Y CONDIMENTOS', allergens: [], status: 'Activo', productState: 'Otros', warehouseStatus: 'Disponible' },
    { id: 'prod-35', name: 'Azafrán en Hebra', description: 'Caja de 1g', reference: 'ESP-AZA-01', unit: 'Uds', suppliers: [{ supplierId: 'sup-9', price: 4.50 }], tax: 10, category: 'ESPECIAS', family: 'ESPECIAS Y CONDIMENTOS', allergens: [], status: 'Activo', productState: 'Otros', warehouseStatus: 'Bajo Pedido' },

    // --- Panadería y Repostería ---
    { id: 'prod-36', name: 'Levadura Fresca', description: 'Pastilla de 25g', reference: 'PAN-LEV-01', unit: 'Uds', suppliers: [{ supplierId: 'sup-6', price: 0.40 }], tax: 4, category: 'PASTELERÍA Y PANADERÍA', family: 'PASTELERÍA Y PANADERÍA', allergens: [], status: 'Activo', productState: 'Fresco', warehouseStatus: 'Disponible' },
    { id: 'prod-37', name: 'Chocolate Cobertura 70%', description: 'Bolsa de 1kg', reference: 'PAS-CHO-05', unit: 'kg', suppliers: [{ supplierId: 'sup-1', price: 12.00 }, { supplierId: 'sup-6', price: 11.50 }], tax: 10, category: 'CACAO/CHOCOLATES', family: 'PASTELERÍA Y PANADERÍA', allergens: ['Soja', 'Lácteos'], status: 'Activo', productState: 'Otros', warehouseStatus: 'Disponible' },
    { id: 'prod-38', name: 'Azúcar Moreno', description: 'Paquete de 1kg', reference: 'PAS-AZU-02', unit: 'kg', suppliers: [{ supplierId: 'sup-1', price: 1.50 }], tax: 10, category: 'AZÚCARES', family: 'PASTELERÍA Y PANADERÍA', allergens: [], status: 'Activo', productState: 'Otros', warehouseStatus: 'Disponible' },
    { id: 'prod-39', name: 'Hojaldre Congelado', description: 'Plancha de 1kg', reference: 'CON-HOJ-01', unit: 'kg', suppliers: [{ supplierId: 'sup-8', price: 5.50 }], tax: 10, category: 'CONGELADOS', family: 'PASTELERÍA Y PANADERÍA', allergens: ['Gluten', 'Lácteos'], status: 'Activo', productState: 'Congelado', warehouseStatus: 'Disponible' },
    { id: 'prod-40', name: 'Pan de Masa Madre', description: 'Hogaza de 1kg', reference: 'PAN-MAS-01', unit: 'Uds', suppliers: [{ supplierId: 'sup-6', price: 4.20 }], tax: 4, category: 'PANADERÍA', family: 'PASTELERÍA Y PANADERÍA', allergens: ['Gluten'], status: 'Activo', productState: 'Fresco', warehouseStatus: 'Bajo Pedido' },

    // --- Bebidas ---
    { id: 'prod-41', name: 'Vino Tinto Rioja Crianza', description: 'Botella de 750ml', reference: 'BEB-VIN-01', unit: 'Uds', suppliers: [{ supplierId: 'sup-7', price: 6.50 }], tax: 21, category: 'VINOS', family: 'VINOS', allergens: ['Sulfitos'], status: 'Activo', productState: 'Otros', warehouseStatus: 'Disponible' },
    { id: 'prod-42', name: 'Vino Blanco Verdejo', description: 'Botella de 750ml', reference: 'BEB-VIN-02', unit: 'Uds', suppliers: [{ supplierId: 'sup-7', price: 5.80 }], tax: 21, category: 'VINOS', family: 'VINOS', allergens: ['Sulfitos'], status: 'Activo', productState: 'Otros', warehouseStatus: 'Disponible' },
    { id: 'prod-43', name: 'Cerveza Artesanal IPA', description: 'Botellín de 33cl', reference: 'BEB-CER-05', unit: 'Uds', suppliers: [{ supplierId: 'sup-7', price: 2.10 }], tax: 21, category: 'CERVEZAS', family: 'AGUAS, REFRESCOS Y CERVEZAS', allergens: ['Gluten'], status: 'Activo', productState: 'Otros', warehouseStatus: 'Disponible' },
    { id: 'prod-44', name: 'Agua Mineral sin gas', description: 'Pack de 6 botellas de 1.5L', reference: 'BEB-AGU-01', unit: 'Pack', suppliers: [{ supplierId: 'sup-7', price: 2.50 }], tax: 10, category: 'AGUAS', family: 'AGUAS, REFRESCOS Y CERVEZAS', allergens: [], status: 'Activo', productState: 'Otros', warehouseStatus: 'Disponible' },

    // --- Utensilios y Otros ---
    { id: 'prod-45', name: 'Papel de Horno', description: 'Rollo de 50m', reference: 'UTE-PAP-01', unit: 'Uds', suppliers: [{ supplierId: 'sup-10', price: 8.00 }], tax: 21, category: 'VARIOS', family: 'VARIOS', allergens: [], status: 'Activo', productState: 'Otros', warehouseStatus: 'Disponible' },
    { id: 'prod-46', name: 'Film Transparente', description: 'Rollo de 300m', reference: 'UTE-FIL-01', unit: 'Uds', suppliers: [{ supplierId: 'sup-10', price: 12.50 }], tax: 21, category: 'VARIOS', family: 'VARIOS', allergens: [], status: 'Activo', productState: 'Otros', warehouseStatus: 'Disponible' },
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
