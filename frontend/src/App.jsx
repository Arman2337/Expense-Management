import { Routes, Route } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import NewExpensePage from './pages/NewExpensePage';
import UserManagementPage from './pages/UserManagementPage';
import ProtectedRoute from './components/ProtectedRoute'; // <-- Import ProtectedRoute

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      {/* Private Routes are now wrapped in ProtectedRoute */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/expenses/new" element={<NewExpensePage />} />
          <Route path="/users" element={<UserManagementPage />} />
          {/* Add other authenticated routes here */}
        </Route>
      </Route>
      
      {/* Not Found Route */}
      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  )
}

export default App;