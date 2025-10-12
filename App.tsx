import React, { useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { DataProvider, useData } from './contexts/DataContext';
import { CreatorProvider } from './contexts/CreatorContext';
import { AuthProvider } from './contexts/AuthContext';
import { generateThemeOverrides } from './utils/colorUtils';

import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import ProfileSelector from './pages/ProfileSelector';
import NotFound from './pages/NotFound';
import MyProfile from './pages/MyProfile';

import AdminDashboard from './pages/admin/AdminDashboard';
import PersonnelManagement from './pages/admin/PersonnelManagement';
import UserManagement from './pages/admin/UserManagement';
import CreatorDashboard from './pages/creator/CreatorDashboard';
import CreatorUserManagement from './pages/creator/CreatorUserManagement';
import GenericDashboard from './pages/shared/GenericDashboard';
import { Role } from './types';
import SupplierManagement from './pages/admin/SupplierManagement';
import AcademicManagement from './pages/admin/AcademicManagement';
import EventManagement from './pages/admin/EventManagement';
import OrderPortal from './pages/teacher/OrderPortal';
import CreateOrder from './pages/teacher/CreateOrder';
import ProcessOrders from './pages/manager/ProcessOrders';
import ProductManagement from './pages/admin/ProductManagement';
import ServicePlanningAdmin from './pages/admin/ServicePlanning';
import MyRecipes from './pages/teacher/MyRecipes';
import ServicePlanningTeacher from './pages/teacher/ServicePlanning';
import ServiceDetail from './pages/teacher/ServiceDetail';
import ExpenseManagement from './pages/admin/ExpenseManagement';
import ExpenseDetailByTeacher from './pages/admin/ExpenseDetailByTeacher';
import StudentLayout from './layouts/StudentLayout';
import ClassroomManager from './pages/admin/ClassroomManager';
import ClassroomList from './pages/teacher/ClassroomList';
import ClassroomDashboard from './pages/teacher/ClassroomDashboard';
import SupportMaintenance from './pages/admin/SupportMaintenance';
import MessagingPage from './pages/messaging/MessagingPage';
import ReplenishStock from './pages/manager/ReplenishStock';
import ReceptionManagement from './pages/manager/ReceptionManagement';
import CompanyDataPage from './pages/admin/CompanyDataPage';
import MiniEconomatoPage from './pages/manager/MiniEconomatoPage';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import SalesManagement from './pages/teacher/SalesManagement';
import OrderHistory from './pages/manager/OrderHistory';
import MyOrderHistory from './pages/teacher/MyOrderHistory';
import RecipeForm from './pages/teacher/RecipeForm';
import SoportePage from './pages/SoportePage';
import ForceChangePassword from './pages/ForceChangePassword';

const ThemedApp = () => {
  const { companyInfo } = useData();

  useEffect(() => {
    const styleId = 'dynamic-theme-overrides';
    let styleTag = document.getElementById(styleId);
    if (!styleTag) {
        styleTag = document.createElement('style');
        styleTag.id = styleId;
        document.head.appendChild(styleTag);
    }
    styleTag.innerHTML = generateThemeOverrides(companyInfo.primaryColor);
  }, [companyInfo.primaryColor]);

  return (
     <HashRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/select-profile" element={<ProfileSelector />} />
          <Route path="/force-change-password" element={<ForceChangePassword />} />
          
          <Route path="/" element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="profile" element={<MyProfile />} />
              <Route path="messaging" element={<MessagingPage />} />
              <Route path="soporte" element={<SoportePage />} />
              
              {/* Admin Routes */}
              <Route element={<ProtectedRoute allowedRoles={[Role.ADMIN]} />}>
                <Route path="admin/dashboard" element={<AdminDashboard />} />
                <Route path="admin/events" element={<EventManagement />} />
                <Route path="admin/service-planning" element={<ServicePlanningAdmin />} />
                <Route path="admin/personnel" element={<PersonnelManagement />} />
                <Route path="admin/students" element={<UserManagement />} />
                <Route path="admin/suppliers" element={<SupplierManagement />} />
                <Route path="admin/products" element={<ProductManagement />} />
                <Route path="admin/academic-management" element={<AcademicManagement />} />
                <Route path="admin/expense-management" element={<ExpenseManagement />} />
                <Route path="admin/expense-detail/:teacherId" element={<ExpenseDetailByTeacher />} />
                <Route path="admin/classrooms" element={<ClassroomManager />} />
                <Route path="admin/support" element={<SupportMaintenance />} />
                <Route path="admin/company" element={<CompanyDataPage />} />
              </Route>

              {/* Creator Routes */}
              <Route element={<ProtectedRoute allowedRoles={[Role.CREATOR]} />}>
                <Route path="creator/dashboard" element={<CreatorDashboard />} />
                <Route path="creator/users" element={<CreatorUserManagement />} />
              </Route>
              
              {/* Teacher Routes */}
              <Route element={<ProtectedRoute allowedRoles={[Role.TEACHER]} />}>
                <Route path="teacher/dashboard" element={<TeacherDashboard />} />
                <Route path="teacher/order-portal" element={<OrderPortal />} />
                <Route path="teacher/create-order/:eventId" element={<CreateOrder />} />
                <Route path="teacher/my-recipes" element={<MyRecipes />} />
                <Route path="teacher/recipe/new" element={<RecipeForm />} />
                <Route path="teacher/recipe/edit/:recipeId" element={<RecipeForm />} />
                <Route path="teacher/order-history" element={<MyOrderHistory />} />
                <Route path="teacher/service-planning" element={<ServicePlanningTeacher />} />
                <Route path="teacher/service-planning/:serviceId" element={<ServiceDetail />} />
                <Route path="teacher/classrooms" element={<ClassroomList />} />
                <Route path="teacher/classroom/:classroomId" element={<ClassroomDashboard />} />
                <Route path="teacher/sales" element={<SalesManagement />} />
              </Route>

              {/* Manager Routes */}
              <Route element={<ProtectedRoute allowedRoles={[Role.MANAGER]} />}>
                <Route path="manager/dashboard" element={<GenericDashboard />} />
                <Route path="manager/process-orders" element={<ProcessOrders />} />
                <Route path="manager/mini-economato" element={<MiniEconomatoPage />} />
                <Route path="manager/replenish-stock" element={<ReplenishStock />} />
                <Route path="manager/reception" element={<ReceptionManagement />} />
                <Route path="manager/order-history" element={<OrderHistory />} />
              </Route>
              
              {/* Student Routes */}
              <Route element={<ProtectedRoute allowedRoles={[Role.STUDENT]} />}>
                  <Route path="student/*" element={<StudentLayout />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Route>
          </Route>
          
        </Routes>
      </HashRouter>
  );
}

function App(): React.ReactElement {
  return (
    <ThemeProvider>
      <CreatorProvider>
        <DataProvider>
          <AuthProvider>
            <ThemedApp />
          </AuthProvider>
        </DataProvider>
      </CreatorProvider>
    </ThemeProvider>
  );
}

export default App;