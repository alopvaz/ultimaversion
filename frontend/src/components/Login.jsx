import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import './Login.css';

// eslint-disable-next-line no-unused-vars
function Login({ authenticate, isAuthenticated }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [rol, setRol] = useState('');

  const iniciarSesion = async (e) => {
    e.preventDefault();
    try { 
      const res = await axios.post('http://localhost:3000/login', { username, password }, { withCredentials: true });
      if (res.data === 'OK') {
        const resRol = await axios.get('http://localhost:3000/rol', { withCredentials: true });
        const resNombre = await axios.get('http://localhost:3000/nombre', { withCredentials: true });
        setRol(resRol.data.trim().toLowerCase());
        authenticate(resRol.data.trim().toLowerCase(), resNombre.data);
        navigate('/chat'); // Navega después de autenticar
      } else {
        console.error('Credenciales incorrectas');
      }
    } catch (error) {
      console.error('Hubo un error al iniciar sesión:', error.response);
    }
  }

  return (
    <div>
      <form onSubmit={iniciarSesion}>
        <div className="group">
          <input type="text" value={username} onChange={e => setUsername(e.target.value)} required />
          <span className="highlight"></span>
          <span className="bar"></span>
          <label>Username</label>
        </div>
        <div className="group">
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          <span className="highlight"></span>
          <span className="bar"></span>
          <label>Password</label>
        </div>
        <button type="submit" className="button buttonBlue">Iniciar sesión
          <div className="ripples buttonRipples"><span className="ripplesCircle"></span></div>
        </button>
      </form>
    </div>
  );
}

Login.propTypes = {
  authenticate: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
};

export default Login;