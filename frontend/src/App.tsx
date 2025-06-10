import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import Manager from './pages/Manager';
import './App.css';

const AuthGuard = ({ allowedRoles }: { allowedRoles: string[] }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated');
  const role = localStorage.getItem('role');

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return role && allowedRoles.includes(role) ? <Outlet /> : <Navigate to="/unauthorized" />;
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      
      <Route element={<AuthGuard allowedRoles={['admin']} />}>
        <Route path="/manager" element={<Manager />} />
      </Route>

      <Route element={<AuthGuard allowedRoles={['admin', 'user']} />}>
        <Route path="/home" element={<Home />} />
      </Route>

      <Route path="/unauthorized" element={<div><h1>Não Autorizado</h1><p>Você não tem permissão para acessar esta página.</p></div>} />
    </Routes>
  );
}

export default App;
