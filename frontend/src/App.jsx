import { useState, useEffect} from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Layout } from 'antd';
import Login from './components/Login/Login';
import Sesion from './components/Sesion/Sesion';
import Historial from './components/Historial/Historial';
import Principal from './components/Principal/Principal';
import Tabla from './components/Historial/Tabla/Tabla';
import Historial2 from './components/Historial/Historial2';

import 'bootstrap/dist/css/bootstrap.min.css';

const { Content } = Layout;

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [rol, setRol] = useState('');
  const [nombre, setNombre] = useState('');
  const [userId, setUserId] = useState('');

  const authenticate = (rol, nombre, id) => {
    setIsAuthenticated(true);
    setRol(rol);
    setNombre(nombre);
    setUserId(id); // Añade esta línea
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login authenticate={authenticate} isAuthenticated={isAuthenticated} />} />
        <Route path="/*" element={
          isAuthenticated ? (
            <Layout>
              <Content style={{ overflow: 'auto', height: '100vh' }}>
                <Routes>
                  <Route path="/historial" element={<Historial />} />
                  <Route path="/principal" element={<Principal rol={rol} />} />
                  <Route path="/sesion" element={<Sesion rol={rol} nombre={nombre} userId={userId} />} />    
                  <Route path="/tabla" element={<Tabla />} />
                  <Route path="/historial2" element={<Historial2 />} />

                </Routes>
              </Content>
            </Layout>
          ) : null
        }/>
      </Routes>
    </Router>
  );
}

export default App;