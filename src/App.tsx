import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// FIX: Add file extensions to imports to resolve module resolution errors.
import { AuthProvider } from './contexts/AuthContext.tsx';
// FIX: Add file extensions to imports to resolve module resolution errors.
import { DataProvider } from './contexts/DataContext.tsx';
// FIX: Add file extensions to imports to resolve module resolution errors.
import { CompanyProvider } from './contexts/CompanyContext.tsx';
// FIX: Add file extensions to imports to resolve module resolution errors.
import { CreatorProvider } from './contexts/CreatorContext.tsx';
// FIX: Add file extensions to imports to resolve module resolution errors.
import { ThemeProvider } from './contexts/ThemeContext.tsx';
// FIX: Add file extensions to imports to resolve module resolution errors.
import { ProtectedRoute } from './components/ProtectedRoute.tsx';

// FIX: Add file extensions to imports to resolve module resolution errors.
import { Login } from './pages/shared/Login.tsx';
// FIX: Add file extensions to imports to resolve module resolution errors.
import { ProfileSelector } from './pages/shared/ProfileSelector.tsx';
// FIX: Add file extensions to imports to resolve module resolution errors.
import { BlockedAccess } from './pages/shared/BlockedAccess.tsx';
// FIX: Add file extensions to imports to resolve module resolution errors.
import { MyProfile } from './pages/shared/MyProfile.tsx';
// FIX: Add file extensions to imports to resolve module resolution errors.
import { Messaging } from './pages/shared/Messaging.tsx';

// FIX: Add file extensions to imports to resolve module resolution errors.
import { CreatorLayout } from './pages/layouts/CreatorLayout.tsx';
// FIX: Add file extensions to imports to resolve module resolution errors.
import { CreatorDashboard } from './pages/creator/CreatorDashboard.tsx';
// FIX: Add file extensions to imports to resolve module resolution errors.
import { UserManager } from './pages/creator/UserManager.tsx';

// FIX: Add file extensions to imports to resolve module resolution errors.
import { AdminLayout } from './pages/layouts/AdminLayout.tsx';
// FIX: Add file extensions to imports to resolve module resolution errors.
import { AdminDashboard } from './pages/admin/AdminDashboard.tsx';
// FIX: Add file extensions to imports to resolve module resolution errors.
import { TeacherManager } from './pages/admin/TeacherManager.tsx';
// FIX: Add file extensions to imports to resolve module resolution errors.
import { ProductManager } from './pages/admin/ProductManager.tsx';
// FIX: Add file extensions to imports to resolve module resolution errors.
import { SupplierManager } from './pages/admin/SupplierManager.tsx';
// FIX: Add file extensions to imports to resolve module resolution errors.
import { EventManager } from './pages/admin/EventManager.tsx';
// FIX: Add file extensions to imports to resolve module resolution errors.
import { AssignmentManager } from './pages/admin/AssignmentManager.tsx';
// FIX: Add file extensions to imports to resolve module resolution errors.
import { ExpenseManager } from './pages/admin/ExpenseManager.tsx';
// FIX: Add file extensions to imports to resolve module resolution errors.
import { ExpenseDetailByTeacher } from './pages/admin/ExpenseDetailByTeacher.tsx';
// FIX: Add file extensions to imports to resolve module resolution errors.
import { CompanyData } from './pages/admin/CompanyData.tsx';
// FIX: Add file extensions to imports to resolve module resolution errors.
import { Support } from './pages/admin/Support.tsx';
// FIX: Add file extensions to imports to resolve module resolution errors.
import { ClassroomManager } from './pages/admin/ClassroomManager.tsx';

// FIX: Add file extensions to imports to resolve module resolution errors.
import { ManagerLayout } from './pages/layouts/ManagerLayout.tsx';
// FIX: Add file extensions to imports to resolve module resolution errors.
import { ManagerDashboard } from './pages/manager/ManagerDashboard.tsx';
// FIX: Add file extensions to imports to resolve module resolution errors.
import { ProcessOrders } from './pages/manager/ProcessOrders.tsx';
// FIX: Add file extensions to imports to resolve module resolution errors.
import { EconomatoManager } from './pages/manager/EconomatoManager.tsx';
// FIX: Add file extensions to imports to resolve module resolution errors.
import { MiniEconomato } from './pages/manager/MiniEconomato.tsx';
// FIX: Add file extensions to imports to resolve module resolution errors.
import { OrderHistory } from './pages/manager/OrderHistory.tsx';

// FIX: Add file extensions to imports to resolve module resolution errors.
import { TeacherLayout } from './pages/layouts/TeacherLayout.tsx';
// FIX: Add file extensions to imports to resolve module resolution errors.
import { TeacherDashboard } from './pages/teacher/TeacherDashboard.tsx';
// FIX: Add file extensions to imports to resolve module resolution errors.
import { OrderPortal } from './pages/teacher/OrderPortal.tsx';
// FIX: Add file extensions to imports to resolve module resolution errors.
import { OrderForm } from './pages/teacher/OrderForm.tsx';
// FIX: Add file extensions to imports to resolve module resolution errors.
import { TeacherOrderHistory } from './pages/teacher/TeacherOrderHistory.tsx';
// FIX: Add file extensions to imports to resolve module resolution errors.
import { SalesManager } from './pages/teacher/SalesManager.tsx';
// FIX: Add file extensions to imports to resolve module resolution errors.
import { RecipeManager } from './pages/teacher/RecipeManager.tsx';
// FIX: Add file extensions to imports to resolve module resolution errors.
import { RecipeForm } from './pages/teacher/RecipeForm.tsx';

// FIX: Add file extensions to imports to resolve module resolution errors.
import { ClassroomList } from './pages/teacher/classroom/ClassroomList.tsx';

// FIX: Add file extensions to imports to resolve module resolution errors.
import { StudentLayout } from './pages/layouts/StudentLayout.tsx';
// FIX: Add file extensions to imports to resolve module resolution errors.
import { StudentDashboard } from './pages/student/StudentDashboard.tsx';

// FIX: Add file extensions to imports to resolve module resolution errors.
import { Profile } from './types/index.ts';


const App: React.FC = () => {
  return (
    <ThemeProvider>
      <CompanyProvider>
        <CreatorProvider>
          <Router>
            <DataProvider>
              <AuthProvider>
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/select-profile" element={<ProfileSelector />} />
                  <Route path="/blocked-access" element={<BlockedAccess />} />
                  <Route path="/" element={<Navigate to="/login" />} />

                  {/* Creator Routes */}
                  <Route element={<ProtectedRoute allowedProfiles={[Profile.CREATOR]} />}>
                    <Route path="/creator" element={<CreatorLayout />}>
                      <Route path="dashboard" element={<CreatorDashboard />} />
                      <Route path="user-manager" element={<UserManager />} />
                      <Route index element={<Navigate to="dashboard" replace />} />
                    </Route>
                  </Route>

                  {/* Admin Routes */}
                  <Route element={<ProtectedRoute allowedProfiles={[Profile.ADMIN]} />}>
                    <Route path="/admin" element={<AdminLayout />}>
                      <Route path="dashboard" element={<AdminDashboard />} />
                      <Route path="teachers" element={<TeacherManager />} />
                      <Route path="products" element={<ProductManager />} />
                      <Route path="suppliers" element={<SupplierManager />} />
                      <Route path="events" element={<EventManager />} />
                      <Route path="assignments" element={<AssignmentManager />} />
                      <Route path="expenses" element={<ExpenseManager />} />
                      <Route path="expenses/:teacherId" element={<ExpenseDetailByTeacher />} />
                      <Route path="company" element={<CompanyData />} />
                      <Route path="support" element={<Support />} />
                      <Route path="classrooms" element={<ClassroomManager />} />
                      <Route path="messaging" element={<Messaging />} />
                      <Route path="profile" element={<MyProfile />} />
                      <Route index element={<Navigate to="dashboard" replace />} />
                    </Route>
                  </Route>

                  {/* Manager Routes */}
                  <Route element={<ProtectedRoute allowedProfiles={[Profile.ALMACEN]} />}>
                    <Route path="/almacen" element={<ManagerLayout />}>
                        <Route path="dashboard" element={<ManagerDashboard />} />
                        <Route path="process-orders/:eventId?" element={<ProcessOrders />} />
                        <Route path="process-orders" element={<ProcessOrders />} />
                        <Route path="economato" element={<EconomatoManager />} />
                        <Route path="mini-economato" element={<MiniEconomato />} />
                        <Route path="order-history" element={<OrderHistory />} />
                        <Route path="products" element={<ProductManager />} />
                        <Route path="suppliers" element={<SupplierManager />} />
                        <Route path="messaging" element={<Messaging />} />
                        <Route path="profile" element={<MyProfile />} />
                        <Route index element={<Navigate to="dashboard" replace />} />
                    </Route>
                  </Route>

                  {/* Teacher Routes */}
                  <Route element={<ProtectedRoute allowedProfiles={[Profile.TEACHER]} />}>
                    <Route path="/teacher" element={<TeacherLayout />}>
                        <Route path="dashboard" element={<TeacherDashboard />} />
                        <Route path="order-portal" element={<OrderPortal />} />
                        <Route path="order-portal/new/:eventId" element={<OrderForm />} />
                        <Route path="order-portal/edit/:orderId" element={<OrderForm />} />
                        <Route path="order-history" element={<TeacherOrderHistory />} />
                        <Route path="sales" element={<SalesManager />} />
                        <Route path="recipes" element={<RecipeManager />} />
                        <Route path="recipes/new" element={<RecipeForm />} />
                        <Route path="recipes/edit/:recipeId" element={<RecipeForm />} />
                        <Route path="aula" element={<ClassroomList />} />
                        <Route path="messaging" element={<Messaging />} />
                        <Route path="profile" element={<MyProfile />} />
                        <Route index element={<Navigate to="dashboard" replace />} />
                    </Route>
                  </Route>
                  
                  {/* Student Routes (Sandboxed) */}
                  <Route element={<ProtectedRoute allowedProfiles={[Profile.STUDENT]} />}>
                    <Route path="/student" element={<StudentLayout />}>
                        <Route path="dashboard" element={<StudentDashboard />} />
                        
                        {/* Simulated Teacher Routes */}
                        <Route path="teacher-dashboard" element={<TeacherDashboard />} />
                        <Route path="order-portal" element={<OrderPortal />} />
                        <Route path="order-portal/new/:eventId" element={<OrderForm />} />
                        <Route path="order-portal/edit/:orderId" element={<OrderForm />} />
                        <Route path="order-history" element={<TeacherOrderHistory />} />
                        <Route path="recipes" element={<RecipeManager />} />
                        <Route path="recipes/new" element={<RecipeForm />} />
                        <Route path="recipes/edit/:recipeId" element={<RecipeForm />} />
                        
                        {/* Simulated Manager Routes */}
                        <Route path="almacen-dashboard" element={<ManagerDashboard />} />
                        <Route path="process-orders/:eventId?" element={<ProcessOrders />} />
                        <Route path="economato" element={<EconomatoManager />} />
                        <Route path="mini-economato" element={<MiniEconomato />} />
                        <Route path="almacen-order-history" element={<OrderHistory />} />
                        <Route path="products" element={<ProductManager />} />
                        <Route path="suppliers" element={<SupplierManager />} />

                        {/* Common Routes */}
                        <Route path="messaging" element={<Messaging />} />
                        <Route path="profile" element={<MyProfile />} />
                        
                        <Route index element={<Navigate to="dashboard" replace />} />
                    </Route>
                  </Route>

                  {/* Fallback for unknown routes */}
                  <Route path="*" element={<Navigate to="/login" />} />
                </Routes>
              </AuthProvider>
            </DataProvider>
          </Router>
        </CreatorProvider>
      </CompanyProvider>
    </ThemeProvider>
  );
}

export default App;
