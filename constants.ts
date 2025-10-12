import { Role, NavLink, CreatorInfo, User, SimulatedRole } from './types';
import { DashboardIcon, UsersIcon, SettingsIcon, ProfileIcon, BookOpenIcon, TruckIcon, CalendarIcon, ClipboardIcon, PackageIcon, AppleIcon, BriefcaseIcon, ArchiveIcon, ChartBarIcon, AcademicCapIcon, LifeBuoyIcon, MailIcon, ClipboardCheckIcon, BuildingIcon, PowerIcon, ReplenishIcon, StoreIcon, HistoryIcon, RecipeBookIcon } from './components/icons';

export const APP_NAME = "Manager Pro EDU-IES";

export const ROLE_STYLES: Record<Role, { gradient: string; name: string }> = {
  [Role.ADMIN]: { gradient: 'from-indigo-500 to-cyan-500', name: 'Administrador' },
  [Role.CREATOR]: { gradient: 'from-orange-500 to-yellow-500', name: 'Creador' },
  [Role.MANAGER]: { gradient: 'from-emerald-500 to-teal-500', name: 'Almacén' },
  [Role.TEACHER]: { gradient: 'from-sky-500 to-cyan-400', name: 'Profesor' },
  [Role.STUDENT]: { gradient: 'from-green-500 to-emerald-500', name: 'Alumno' },
};

export const NAVIGATION_LINKS: NavLink[] = [
  // Admin
  { path: '/admin/dashboard', label: 'Panel de control', icon: DashboardIcon, roles: [Role.ADMIN] },
  { path: '/admin/events', label: 'Eventos', icon: CalendarIcon, roles: [Role.ADMIN] },
  { path: '/admin/service-planning', label: 'Planificación', icon: BriefcaseIcon, roles: [Role.ADMIN] },
  { path: '/admin/personnel', label: 'Personal', icon: UsersIcon, roles: [Role.ADMIN] },
  { path: '/admin/suppliers', label: 'Proveedores', icon: TruckIcon, roles: [Role.ADMIN] },
  { path: '/admin/products', label: 'Catálogo', icon: AppleIcon, roles: [Role.ADMIN] },
  { path: '/admin/academic-management', label: 'Asignaciones', icon: BookOpenIcon, roles: [Role.ADMIN] },
  { path: '/admin/classrooms', label: 'Aulas de Práctica', icon: AcademicCapIcon, roles: [Role.ADMIN] },
  { path: '/admin/expense-management', label: 'Estadísticas', icon: ChartBarIcon, roles: [Role.ADMIN] },
  { path: '/admin/company', label: 'Datos Empresa', icon: BuildingIcon, roles: [Role.ADMIN] },
  { path: '/admin/support', label: 'Soporte y Mantenimiento', icon: PowerIcon, roles: [Role.ADMIN] },
  
  // Creator
  { path: '/creator/dashboard', label: 'Panel de Creador', icon: SettingsIcon, roles: [Role.CREATOR] },
  { path: '/creator/users', label: 'Gestión de Usuarios', icon: UsersIcon, roles: [Role.CREATOR] },
  
  // Manager (Almacén)
  { path: '/manager/dashboard', label: 'Panel Principal', icon: DashboardIcon, roles: [Role.MANAGER] },
  { path: '/manager/process-orders', label: 'Procesar Pedidos', icon: PackageIcon, roles: [Role.MANAGER] },
  { path: '/manager/mini-economato', label: 'Mini-Economato', icon: StoreIcon, roles: [Role.MANAGER] },
  { path: '/manager/replenish-stock', label: 'Reposición Stock', icon: ReplenishIcon, roles: [Role.MANAGER] },
  { path: '/manager/reception', label: 'Recepción', icon: ClipboardCheckIcon, roles: [Role.MANAGER] },
  { path: '/manager/order-history', label: 'Historial de Pedidos', icon: HistoryIcon, roles: [Role.MANAGER] },
  
  // Teacher
  { path: '/teacher/dashboard', label: 'Panel Principal', icon: DashboardIcon, roles: [Role.TEACHER] },
  { path: '/teacher/order-portal', label: 'Portal de Pedidos', icon: ClipboardIcon, roles: [Role.TEACHER] },
  { path: '/teacher/my-recipes', label: 'Mis Recetas', icon: RecipeBookIcon, roles: [Role.TEACHER] },
  { path: '/teacher/order-history', label: 'Mi Historial de Pedidos', icon: HistoryIcon, roles: [Role.TEACHER] },
  { path: '/teacher/service-planning', label: 'Planificación', icon: BriefcaseIcon, roles: [Role.TEACHER] },
  { path: '/teacher/classrooms', label: 'Aula de Práctica', icon: AcademicCapIcon, roles: [Role.TEACHER] },

  // Student
  { path: '/student/dashboard', label: 'Panel Principal', icon: DashboardIcon, roles: [Role.STUDENT] },
  { path: '/student/order-portal', label: 'Portal de Pedidos', icon: ClipboardIcon, roles: [Role.STUDENT], simulatedRoles: [SimulatedRole.KITCHEN_PROFESSIONAL] },
  { path: '/student/my-recipes', label: 'Mis Recetas', icon: RecipeBookIcon, roles: [Role.STUDENT], simulatedRoles: [SimulatedRole.KITCHEN_PROFESSIONAL] },
  { path: '/student/order-history', label: 'Historial de Pedidos', icon: HistoryIcon, roles: [Role.STUDENT] },
  { path: '/student/process-orders', label: 'Procesar Pedidos', icon: PackageIcon, roles: [Role.STUDENT], simulatedRoles: [SimulatedRole.WAREHOUSE] },
  { path: '/student/reception', label: 'Recepción', icon: ClipboardCheckIcon, roles: [Role.STUDENT], simulatedRoles: [SimulatedRole.WAREHOUSE] },
  { path: '/student/mini-economato', label: 'Mini-Economato', icon: StoreIcon, roles: [Role.STUDENT], simulatedRoles: [SimulatedRole.WAREHOUSE] },
  { path: '/student/catalog', label: 'Catálogo Aula', icon: AppleIcon, roles: [Role.STUDENT], simulatedRoles: [SimulatedRole.WAREHOUSE] },
  { path: '/student/suppliers', label: 'Proveedores Aula', icon: TruckIcon, roles: [Role.STUDENT], simulatedRoles: [SimulatedRole.WAREHOUSE] },
  
  // Common
  { path: '/messaging', label: 'Mensajería', icon: MailIcon, roles: [Role.ADMIN, Role.CREATOR, Role.MANAGER, Role.TEACHER, Role.STUDENT] },
  { path: '/profile', label: 'Mi Perfil', icon: ProfileIcon, roles: [Role.ADMIN, Role.CREATOR, Role.MANAGER, Role.TEACHER, Role.STUDENT] },
];

export const DEFAULT_CREATOR_INFO: CreatorInfo = {
  appName: 'Manager Pro Edu',
  creatorName: 'JCB',
  contactEmail: 'managerproapp@gmail.com',
  copyrightText: `© ${new Date().getFullYear()} Todos los derechos reservados`,
  logo: 'https://picsum.photos/seed/logo/100/100',
};

// Initial data for demo purposes
export const DEMO_USERS: User[] = [
    {
        id: 'user-superadmin',
        name: 'Superadministrador',
        email: 'jcbprofesor@gmail.com',
        password: 'superadmin',
        avatar: 'https://picsum.photos/seed/jcbprofesor/200/200',
        roles: [Role.ADMIN, Role.CREATOR],
        activityStatus: 'active',
    },
    {
        id: 'user-all',
        name: 'Multi-Role User',
        email: 'all@app.com',
        password: 'password',
        avatar: 'https://picsum.photos/seed/all-roles/200/200',
        roles: [Role.ADMIN, Role.CREATOR, Role.MANAGER, Role.TEACHER, Role.STUDENT],
        activityStatus: 'active',
    },
    {
        id: 'user-1',
        name: 'Admin User',
        email: 'admin@app.com',
        password: 'password',
        avatar: 'https://picsum.photos/seed/admin/200/200',
        roles: [Role.ADMIN],
        activityStatus: 'active',
    },
    {
        id: 'user-2',
        name: 'Ana García (Profe/Admin)',
        email: 'ana.g@app.com',
        password: 'password',
        avatar: 'https://picsum.photos/seed/anag/200/200',
        roles: [Role.ADMIN, Role.TEACHER],
        activityStatus: 'active',
        contractType: 'Titular',
    },
    {
        id: 'user-3',
        name: 'Luis Manager',
        email: 'luis.m@app.com',
        password: 'password',
        avatar: 'https://picsum.photos/seed/luism/200/200',
        roles: [Role.MANAGER],
        activityStatus: 'active',
    },
    {
        id: 'user-4',
        name: 'Carlos Pérez (Profesor)',
        email: 'carlos.p@app.com',
        password: 'password',
        avatar: 'https://picsum.photos/seed/carlosp/200/200',
        roles: [Role.TEACHER],
        activityStatus: 'inactive',
        contractType: 'Sustituto',
    },
    {
        id: 'user-5',
        name: 'Maria López (Estudiante)',
        email: 'maria.l@app.com',
        password: 'password',
        avatar: 'https://picsum.photos/seed/marial/200/200',
        roles: [Role.STUDENT],
        activityStatus: 'active',
    },
];

export const ROLE_DASHBOARD_PATHS: Record<Role, string> = {
    [Role.ADMIN]: '/admin/dashboard',
    [Role.CREATOR]: '/creator/dashboard',
    [Role.MANAGER]: '/manager/dashboard',
    [Role.TEACHER]: '/teacher/dashboard',
    [Role.STUDENT]: '/student/dashboard',
};

export const WAREHOUSE_INTERNAL_USER_ID = '0';