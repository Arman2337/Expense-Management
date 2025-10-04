import { Routes, Route, Navigate } from 'react-router-dom'; // Add Navigate
import DashboardLayout from './layouts/DashboardLayout';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import NewExpensePage from './pages/NewExpensePage';
import MyExpensesPage from './pages/MyExpensesPage';
import UserManagementPage from './pages/UserManagementPage';
import ProtectedRoute from './components/ProtectedRoute';
import SettingsPage from './pages/SettingsPage';
import ApprovalRulesPage from './pages/ApprovalRulesPage';
import TeamApprovalsPage from './pages/TeamApprovalsPage'; // <-- Import the new page

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      {/* Private Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          {/* Redirect from the root path to the dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />

          <Route path="/expenses/new" element={<NewExpensePage />} />
          <Route path="/expenses/my" element={<MyExpensesPage />} />
          <Route path="/users" element={<UserManagementPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/rules" element={<ApprovalRulesPage />} />
          
          {/* ADD THIS NEW ROUTE FOR MANAGERS */}
          <Route path="/approvals/team" element={<TeamApprovalsPage />} />

        </Route>
      </Route>
      
      {/* Not Found Route */}
      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  )
}

export default App;