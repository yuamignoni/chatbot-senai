import { Link, useNavigate } from 'react-router-dom';
import '../styles/menu.css'

function Menu() {
  const navigate = useNavigate();
  const role = localStorage.getItem('role');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className='menu-desktop'>
      <div className='img img-200'>
        <h3>SENAI Chatbot</h3>
      </div>
      <nav className='flex-center flex__gap-30'>
        <Link to="/home">Home</Link>
        {role === 'admin' && <Link to="/manager">Gerenciar Usuários</Link>}
        <button onClick={handleLogout} className="logout-btn">Sair</button>
      </nav>
    </div>
  )
}

export default Menu