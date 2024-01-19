
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import './Login.css';

function Login({ authenticate, isAuthenticated }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState('');

  if (isAuthenticated) {
    navigate('/principal');
  }

  console.log(rol);

  // Login.js
const iniciarSesion = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/verificarUsuario', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          usuario: username,
          contrasena: password,
        }),
      });
  
      if (!response.ok) {
        throw new Error('Error al verificar al usuario');
      }
  
      const participante = await response.json();
      setRol(participante.rol.trim().toLowerCase());
      authenticate(participante.rol.trim().toLowerCase(), participante.nombre, participante.id);
    } catch (error) {
      console.error('Hubo un error al iniciar sesión:', error);
    }
  };

  return (
    <div className="body">
      <div className="box">
        <span className="borderline"></span>
        <form onSubmit={iniciarSesion}>
          <h2>Sign in</h2>
          <div className="inputBox">
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} required="required" />
            <span>Username</span>
            <i></i>
          </div>
          <div className="inputBox">
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required="required" />
            <span>Password</span>
            <i></i>
          </div>
          <div className="links">
            <a href="#">Forgot Password</a>
            <a href="#">Sign up</a>
          </div>
          <input type="submit" value="Login" />
        </form>
      </div>
    </div>
  );
}

Login.propTypes = {
  authenticate: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
};

export default Login;


