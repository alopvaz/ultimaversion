import './Principal.css';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import {useState, useEffect} from 'react'; // Asegúrate de importar useEffect
import io from 'socket.io-client';

const socket = io('http://localhost:3000');

function Principal({ rol }) {

  const [sesionId, setSesionId] = useState(null);

  const [nombreSesion, setNombreSesion] = useState('');
  const [sesionDisponible, setSesionDisponible] = useState(false); // Define el estado para sesionDisponible

  const navigate = useNavigate();


  const handleNombreSesionChange = (event) => {
    setNombreSesion(event.target.value);
  };

  
  const handleUnirseASesionClick = () => {
    if (rol !== 'admin') {
      // Navega a Sesion cuando se haga clic en el botón
      navigate('/sesion', { state: { nombreSesion } });
    }
  };

  const handleCrearSesionClick = () => {
    if (rol === 'admin') {
      // Emitir un evento al servidor para indicar que se está creando una sesión
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
      console.log(data.message);
      setSesionId(data.sessionId); // Guarda el ID de la sesión
      console.log(data.sessionId)

      // Navega a Sesion cuando se haga clic en el botón
      navigate('/sesion', { state: { nombreSesion, sesionId: data.sessionId } });
    })
    .catch((error) => {
      console.error('Error:', error);
    });

      // Navega a Sesion cuando se haga clic en el botón
      navigate('/sesion', { state: { nombreSesion, sesionId } });    }
  };

  const handleIrAHistoriaClick = () => {
    navigate('/historial');
  };

  useEffect(() => {
    // Escuchar el evento 'sesion-disponible' para actualizar el estado cuando hay sesiones disponibles
    socket.on('sesion-disponible', () => {
      setSesionDisponible(true);
    });

    // Limpiar el evento cuando el componente se desmonta
    return () => {
      socket.off('sesion-disponible');
    };
  }, []);


    return (
      <div>
      <div className="fondo-negro">
        <h1>
          {Array.from('POKERUNITED').map((letra, index) => (
            <span key={index} className={`letra animacion-letra-${index}`}>
              {letra}
            </span>
          ))}
        </h1>
        {rol === 'admin' && (
          <div className="nueva-sesion tex-white">
            <h2>Nueva Sesión</h2>
            <div className="campo-texto">
              <input
                className='text-black'
                type="text"
                id="nombre"
                value={nombreSesion}
                onChange={handleNombreSesionChange}
                required
              />
              <label htmlFor="nombre">Nombre</label>
            </div>
            <button className="boton-azul" onClick={handleCrearSesionClick}>CREAR SESIÓN</button>
          </div>
        )}
        {rol !== 'admin' && (
         <div>
         {sesionDisponible ? (
           <div>
             <p>Hay sesiones disponibles</p>
             <button className="boton-azul" onClick={handleUnirseASesionClick}>ENTRAR A LA SESIÓN</button>
           </div>
         ) : (
           'No hay sesiones disponibles'
         )}
       </div>
        )}
      </div>
      <button onClick={handleIrAHistoriaClick}>Ir a la página de historia</button>
    </div>
  );
}


Principal.propTypes = {
    rol: PropTypes.string.isRequired,
};

export default Principal;

