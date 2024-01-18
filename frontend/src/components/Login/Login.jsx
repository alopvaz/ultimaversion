import { useState } from 'react';
import axios from 'axios';
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

  const iniciarSesion = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3000/login', { username, password }, { withCredentials: true });
      if (res.data === 'OK') {
        const resRol = await axios.get('http://localhost:3000/rol', { withCredentials: true });
        const resNombre = await axios.get('http://localhost:3000/nombre', { withCredentials: true });
        const resId = await axios.get('http://localhost:3000/id', { withCredentials: true }); // Nueva línea


        setRol(resRol.data.trim().toLowerCase());
        authenticate(resRol.data.trim().toLowerCase(), resNombre.data, resId.data); // Modificado para incluir el ID
      } else {
        console.error('Credenciales incorrectas');
      }
    } catch (error) {
      console.error('Hubo un error al iniciar sesión:', error.response);
    }
  }

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