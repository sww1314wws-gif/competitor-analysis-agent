import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/stores';
import Layout from '@/components/Layout';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Tasks from '@/pages/Tasks';
import TaskDetail from '@/pages/TaskDetail';
import Analysis from '@/pages/Analysis';
import Reports from '@/pages/Reports';
import ReportDetail from '@/pages/ReportDetail';
import Knowledge from '@/pages/Knowledge';
import Settings from '@/pages/Settings';
import Team from '@/pages/Team';
import ApiManagement from '@/pages/ApiManagement';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/tasks" replace />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="tasks/:id" element={<TaskDetail />} />
          <Route path="analysis/:id" element={<Analysis />} />
          <Route path="reports" element={<Reports />} />
          <Route path="reports/:id" element={<ReportDetail />} />
          <Route path="knowledge" element={<Knowledge />} />
          <Route path="settings" element={<Settings />} />
          <Route path="team" element={<Team />} />
          <Route path="api-management" element={<ApiManagement />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
