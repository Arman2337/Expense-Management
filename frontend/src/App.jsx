import { Routes, Route } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import NewExpensePage from './pages/NewExpensePage';
import UserManagementPage from './pages/UserManagementPage';

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      {/* Private Routes (wrapped in DashboardLayout) */}
      <Route element={<DashboardLayout />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/expenses/new" element={<NewExpensePage />} />
        <Route path="/users" element={<UserManagementPage />} />
        {/* Add other authenticated routes here */}
        <Route path="/expenses/my" element={<div>My Expenses Page</div>} />
        <Route path="/rules" element={<div>Approval Rules Page</div>} />
      </Route>
      
      {/* Not Found Route */}
      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  )
}

export default App;