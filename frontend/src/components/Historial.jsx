import { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Pagination from 'react-bootstrap/Pagination';
import { FaEye, FaTrash } from 'react-icons/fa';
import axios from 'axios';


function Historial() {

    
    const [sesiones, setSesiones] = useState([]);
    const [tareas, setTareas] = useState([]);
    const [paginaActual, setPaginaActual] = useState(1);
    const sesionesPorPagina = 6;

    const [paginaActualTareas, setPaginaActualTareas] = useState(1);
    const tareasPorPagina = 6;

    const [busqueda, setBusqueda] = useState('');
    

    useEffect(() => {
        axios.get('http://localhost:3000/sesiones')        
        .then(res => {
            console.log(res.data); // Imprime la respuesta del servidor
            if (Array.isArray(res.data)) {
                setSesiones(res.data);
            } else {
                console.error('Error: /sesiones did not return an array');
            }
        })
            .catch(err => {
                console.error(err);
            });
    }, []);

    const handleEyeClick = (id) => {
        console.log(`Ojo clickeado en la sesión con id ${id}`);
        // Aquí puedes manejar lo que sucede cuando se hace click en el ojo
        axios.get(`http://localhost:3000/tareas/${id}`)
            .then(res => {
                console.log(res.data); // Imprime la respuesta del servidor
                if (Array.isArray(res.data)) {
                    setTareas(res.data);
                } else {
                    console.error('Error: /tareas did not return an array');
                }
            })
            .catch(err => {
                console.error(err);
            });
    };

    const handleTrashClick = (id) => {
        axios.delete(`http://localhost:3000/sesiones/${id}`)
            .then(res => {
                console.log(res.data); // Imprime la respuesta del servidor
                // Actualiza el estado para eliminar la sesión de la lista
                setSesiones(sesiones.filter(sesion => sesion.id !== id));
            })
            .catch(err => {
                console.error(err);
            });
    };

    const handleTrashClickTarea = (id) => {
        axios.delete(`http://localhost:3000/tareas/${id}`)
            .then(res => {
                console.log(res.data); // Imprime la respuesta del servidor
                // Actualiza el estado para eliminar la tarea de la lista
                setTareas(tareas.filter(tarea => tarea.id !== id));
            })
            .catch(err => {
                console.error(err);
            });
    };

    const sesionesFiltradas = sesiones.filter(sesion => sesion.nombre.toLowerCase().includes(busqueda.toLowerCase()));
    const tareasFiltradas = tareas.filter(tarea => tarea.nombre.toLowerCase().includes(busqueda.toLowerCase()));

    const sesionesPaginadas = sesionesFiltradas.slice((paginaActual - 1) * sesionesPorPagina, paginaActual * sesionesPorPagina);
    const tareasPaginadas = tareasFiltradas.slice((paginaActualTareas - 1) * tareasPorPagina, paginaActualTareas * tareasPorPagina);

    return(
        <div>
            <h1>Historial de sesiones</h1>
            <div className="input-group rounded">
                <input type="search" className="form-control rounded" placeholder="Search" aria-label="Search" aria-describedby="search-addon" value={busqueda} onChange={e => setBusqueda(e.target.value)} />
                <span className="input-group-text border-0" id="search-addon">
                    <i className="fas fa-search"></i>
                </span>
            </div>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Nombre</th>
                        <th>Fecha</th>
                        <th>Ver</th>
                        <th>Eliminar</th>
                    </tr>
                </thead>
                <tbody>
                    {sesionesPaginadas.map(sesion => (
                        <tr key={sesion.id}>
                            <td>{sesion.id}</td>
                            <td>{sesion.nombre}</td>
                            <td>{new Date(sesion.fecha).toLocaleString()}</td>
                            <td>
                                <Button variant="link" onClick={() => handleEyeClick(sesion.id)}>
                                    <FaEye />
                                </Button>
                            </td>
                            <td>
                                <Button variant="link" onClick={() => handleTrashClick(sesion.id)}>
                                    <FaTrash />
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <Pagination>
                <Pagination.Prev onClick={() => setPaginaActual(paginaActual - 1)} disabled={paginaActual === 1} />
                <Pagination.Item>{paginaActual}</Pagination.Item>
                <Pagination.Next onClick={() => setPaginaActual(paginaActual + 1)} disabled={sesionesFiltradas.length / sesionesPorPagina <= paginaActual} />
            </Pagination>
            {tareasPaginadas.length > 0 && (
                <div>
                    <h2>Tareas de la sesión seleccionada</h2>
                    <input type="search" className="form-control rounded" placeholder="Search" aria-label="Search" aria-describedby="search-addon" value={busqueda} onChange={e => setBusqueda(e.target.value)} />
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Nombre</th>
                                <th>Estimación</th>
                                <th>Eliminar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tareasPaginadas.map(tarea => (
                                <tr key={tarea.id}>
                                    <td>{tarea.id}</td>
                                    <td>{tarea.nombre}</td>
                                    <td>{tarea.estimacion}</td>
                                    <td>
                                        <Button variant="link" onClick={() => handleTrashClickTarea(tarea.id)}>
                                            <FaTrash />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    <Pagination>
                        <Pagination.Prev onClick={() => setPaginaActualTareas(paginaActualTareas - 1)} disabled={paginaActualTareas === 1} />
                        <Pagination.Item>{paginaActualTareas}</Pagination.Item>
                        <Pagination.Next onClick={() => setPaginaActualTareas(paginaActualTareas + 1)} disabled={tareasFiltradas.length / tareasPorPagina <= paginaActualTareas} />
                    </Pagination>
                </div>
            )}
        </div>
    );
}

export default Historial;