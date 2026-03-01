import { Link, Navigate, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import GroupsPage from './pages/GroupsPage.jsx';
import { useAuth } from './context/AuthContext.jsx';

const PrivateRoute = ({ children }) => {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" />;
};

export default function App() {
  const { token, logout } = useAuth();
  return (
    <div className="app">
      <nav>
        <h1>Smart Study Platform</h1>
        <div>
          <Link to="/">Dashboard</Link>
          <Link to="/groups">Groups</Link>
          {!token ? <Link to="/login">Login</Link> : <button onClick={logout}>Logout</button>}
        </div>
      </nav>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/groups"
          element={
            <PrivateRoute>
              <GroupsPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </div>
  );
}
