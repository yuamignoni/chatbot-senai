import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Standard } from "@typebot.io/react";
import '../styles/home.css';

interface HomeProps {
  username: string;
}

const Home: React.FC<HomeProps> = ({ username }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div id='home-page' className='flex-center flex-column flex__gap-30 padding-50'>
      <h1>Olá, {username}!</h1>
      <Standard
      typebot="condi-o-utilizando-moment-of-the-day-8y1enkk"
      apiHost="https://typebot.io"
      style={{ width: "60%", height: "700px", borderRadius: "10px", boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.1)" }}
      />
      <button onClick={handleLogout} className='btn-logout'>Sair</button>
    </div>
  );
};

export default Home;
