import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import io from 'socket.io-client';
import styles from './Principal.module.css';
import { FrownOutlined, SmileOutlined} from '@ant-design/icons';

const socket = io('http://localhost:3000');

function Principal({ rol }) {
  const navigate = useNavigate();
  const [nombreSesion, setNombreSesion] = useState('');
  // eslint-disable-next-line no-unused-vars
  const[nombreSesionUnirse, setNombreSesionUnirse] = useState('');
  const [sesionDisponible, setSesionDisponible] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [sesionId, setSesionId] = useState(null);

  useEffect(() => {
    socket.on('sesion-disponible', () => {
      setSesionDisponible(true);
    });

    return () => {
      socket.off('sesion-disponible');
    };
  }, []);

  const entrar = () => {
    if (rol === 'admin') {
      socket.emit('crear-sesion', nombreSesion);
      fetch('http://localhost:3000/crear-sesion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nombreSesion }),
      })
      .then(response => response.json())
      .then(data => {
        setSesionId(data.sessionId);
        navigate(`/sesion`, { state: { nombreSesion, sesionId: data.sessionId } });
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    } else if (sesionDisponible) {
      navigate(`/sesion`, { state: { nombreSesion: nombreSesionUnirse } });
    }
  }

  const irAHistorial = () => {
    navigate('/tabla');
  }

  return (
    <div className={styles.body}>
      <div className={styles.box}>
        <span className={styles.borderline}></span>
        <form onSubmit={(e) => e.preventDefault()}>
          {rol === 'admin' ? (
            <>
              <h1 className={styles.h1}>POKER<span className={styles.span}>UNITED</span></h1>  
              <button onClick={irAHistorial} style={{color: 'white'}}>Ir a Historial</button> {/* Botón para ir a Historial */}
     
              <h2>Nueva Sesión</h2>
              <div className={styles.inputBox}>
                <input 
                  type="text" 
                  value={nombreSesion} 
                  onChange={(e) => setNombreSesion(e.target.value)} 
                  required 
                />
                <span>Nombre</span>
                <i></i>
              </div>
              <input type="submit" value="Entrar" onClick={entrar} />
              <button onClick={irAHistorial}>Ir a Historial</button> {/* Botón para ir a Historial */}
            </>
          ) : (
            sesionDisponible ? (
              <>
                <h1 className={styles.h1}>POKER<span className={styles.span}>UNITED</span></h1>       
                <h2>Hay una sesión disponible</h2>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                  <SmileOutlined style={{ color: 'white', fontSize: '100px', marginBottom: '10px', marginTop: '20px' }}/>               
                </div>
                <input 
                  type="submit" 
                  value="Entrar" 
                  onClick={entrar} 
                  className={styles.centeredButton}
                />
                <button onClick={irAHistorial}>Ir a Historial</button> {/* Botón para ir a Historial */}
              </>
            ) : (
              <>
                <h1 className={styles.h1}>POKER<span className={styles.span}>UNITED</span></h1>       
                <h2>No hay sesiones disponibles</h2>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                 <FrownOutlined style={{ color: 'white', fontSize: '100px' }}/>
                </div>
              </>
            )
          )}
        </form>
      </div>
    </div>
  );
}

Principal.propTypes = {
  rol: PropTypes.string.isRequired,
};

export default Principal;