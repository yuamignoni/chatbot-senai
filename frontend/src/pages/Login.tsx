import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/login.css';
import showIcon from '../assets/show.svg';
import hideIcon from '../assets/hide.svg';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Por favor, insira um e-mail ou senha válidos.');
      return;
    }

    if (email === 'admin@example.com' && password === 'password') {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('role', 'admin');
      navigate('/home');
    } else if (email === 'user@example.com' && password === 'password') {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('role', 'user');
      navigate('/home');
    } else {
      setError('Credenciais inválidas');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div id="login-page" className="flex-center full-window">
      <div
        id="content-login-page"
        className="flex-center flex-column flex__gap-50"
      >
        <div className="flex-center flex-column flex__gap-50">
          <header>
            <h1 className="text-center title-main mg__bottom-15">
              Seja bem-vindo ao <span>Chatbot Senai</span>
            </h1>
            <p className="text-center paragraph-default text-white">
              Faça o seu login para acessar a plataforma
            </p>
          </header>

          <form
            action="#"
            className="form login"
            id="login-form"
            onSubmit={handleLogin}
          >
            {error && <span className="span-required">{error}</span>}
            <div className="form__field">
              <label htmlFor="email">
                <svg className="icon">
                  <use href="#icon-user"></use>
                </svg>
                <span className="hidden">Usuário</span>
              </label>
              <input
                type="email"
                id="email"
                name="username"
                className="form__input inputs-forms"
                placeholder="E-mail"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError(null);
                }}
              />
            </div>

            <div className="form__field">
              <label htmlFor="password">
                <svg className="icon">
                  <use href="#icon-lock"></use>
                </svg>
                <span className="hidden">Senha</span>
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                id="input-password"
                className="form__input inputs-forms"
                placeholder="Senha"
                required
                maxLength={20}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(null);
                }}
              />
              <div
                className="toggle-mask flex-center cursor-pointer"
                onClick={togglePasswordVisibility}
              >
                <img
                  id="showHide"
                  src={showPassword ? hideIcon : showIcon}
                  alt={showPassword ? 'Esconder' : 'Mostrar'}
                />
              </div>
            </div>

            <div className="form__field">
              <button
                className="login-btn cursor-pointer inputs-forms"
                type="submit"
              >
                Logar
              </button>
            </div>
          </form>

          <svg xmlns="http://www.w3.org/2000/svg" className="icons">
            <symbol id="icon-arrow-right" viewBox="0 0 1792 1792">
              <path d="M1600 960q0 54-37 91l-651 651q-39 37-91 37-51 0-90-37l-75-75q-38-38-38-91t38-91l293-293H245q-52 0-84.5-37.5T128 1024V896q0-53 32.5-90.5T245 768h704L656 474q-38-36-38-90t38-90l75-75q38-38 90-38 53 0 91 38l651 651q37 35 37 90z" />
            </symbol>
            <symbol id="icon-lock" viewBox="0 0 1792 1792">
              <path d="M640 768h512V576q0-106-75-181t-181-75-181 75-75 181v192zm832 96v576q0 40-28 68t-68 28H416q-40 0-68-28t-28-68V864q0-40 28-68t68-28h32V576q0-184 132-316t316-132 316 132 132 316v192h32q40 0 68 28t28 68z" />
            </symbol>
            <symbol id="icon-user" viewBox="0 0 1792 1792">
              <path d="M1600 1405q0 120-73 189.5t-194 69.5H459q-121 0-194-69.5T192 1405q0-53 3.5-103.5t14-109T236 1084t43-97.5 62-81 85.5-53.5T538 832q9 0 42 21.5t74.5 48 108 48T896 971t133.5-21.5 108-48 74.5-48 42-21.5q61 0 111.5 20t85.5 53.5 62 81 43 97.5 26.5 108.5 14 109 3.5 103.5zm-320-893q0 159-112.5 271.5T896 896 624.5 783.5 512 512t112.5-271.5T896 128t271.5 112.5T1280 512z" />
            </symbol>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Login;
