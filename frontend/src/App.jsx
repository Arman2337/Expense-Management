import { Routes, Route } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import NewExpensePage from './pages/NewExpensePage';
import MyExpensesPage from './pages/MyExpensesPage'; // ADD THIS
import UserManagementPage from './pages/UserManagementPage';
import ProtectedRoute from './components/ProtectedRoute';
import SettingsPage from './pages/SettingsPage';

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      {/* Private Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/expenses/new" element={<NewExpensePage />} />
          <Route path="/expenses/my" element={<MyExpensesPage />} /> {/* ADD THIS */}
          <Route path="/users" element={<UserManagementPage />} />
          <Route path="/settings" element={<SettingsPage />} /> {/* Add this */}
        </Route>
      </Route>
      
      {/* Not Found Route */}
      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  )
}

export default App;