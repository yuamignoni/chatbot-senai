import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import Home from './pages/Home';
import Manager from './pages/Manager';
import Menu from './components/Menu';
import './App.css';

const AuthGuard = ({ allowedRoles }: { allowedRoles: string[] }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated');
  const role = localStorage.getItem('role');

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return role && allowedRoles.includes(role) ? <Outlet /> : <Navigate to="/unauthorized" />;
};

const AuthenticatedLayout = () => {
  return (
    <>
      <Menu />
      <Outlet />
    </>
  );
};

const HomeWrapper = () => {
  const username = localStorage.getItem('username') || 'Usuário';
  return <Home username={username} />;
};

const UnauthorizedPage = () => (
  <div style={{ paddingTop: '100px', textAlign: 'center' }}>
    <h1>Não Autorizado</h1>
    <p>Você não tem permissão para acessar esta página.</p>
  </div>
);

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/esqueci-senha" element={<ForgotPassword />} />
      
      <Route element={<AuthenticatedLayout />}>
        <Route element={<AuthGuard allowedRoles={['admin']} />}>
          <Route path="/manager" element={<Manager />} />
        </Route>

        <Route element={<AuthGuard allowedRoles={['admin', 'user']} />}>
          <Route path="/home" element={<HomeWrapper />} />
        </Route>
        
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
      </Route>
    </Routes>
  );
}

export default App;
