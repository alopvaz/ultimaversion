import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Tabla from './Tabla/Tabla';
import { MdChevronLeft } from 'react-icons/md';
import { DownOutlined } from '@ant-design/icons';

const Historial2 = () => {
  const [data, setData] = useState([]);
  const [showSecondTable, setShowSecondTable] = useState(false);
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [secondTableData, setSecondTableData] = useState([]);


  useEffect(() => {
    axios.get('http://localhost:3000/sesiones')
    .then(res => {
      if (Array.isArray(res.data)) {
        const mappedData = res.data.map((item, index) => ({ key: item.id, ...item })); // Usa el id de la sesión como key
        setData(mappedData);
      } else {
        console.error('Error: /sesiones did not return an array');
      }
    })
    .catch(err => {
      console.error(err);
    });
  }, []);

  const sessionColumns = [
    {
      title: '',
      key: 'action',
      render: (text, record) => (
        <div>
          <DownOutlined onClick={() => handleExpand(record.key)} />
          {expandedRowKeys.includes(record.key) && 
            <div className="bodyt">
              <Tabla dataSource={[]} columns={taskColumns} /> {/* Pasamos las columnas de la tabla de tareas */}
            </div>
          }
        </div>
      ),
    },
    {
      title: 'Nombre',
      dataIndex: 'nombre',
      key: 'nombre',
    },
    {
      title: 'Fecha',
      dataIndex: 'fecha',
      key: 'fecha',
    },
    // Agrega más columnas aquí si es necesario
  ];

  const taskColumns = [
    {
      title: 'Nombre',
      dataIndex: 'nombre',
      key: 'nombre',
    },
    {
      title: 'Votación',
      dataIndex: 'votacion',
      key: 'votacion',
    },
    // Agrega más columnas aquí si es necesario
  ];
  



  const handleExpand = (key) => {
    setExpandedRowKeys(prevKeys => prevKeys.includes(key) ? prevKeys.filter(k => k !== key) : [...prevKeys, key]);
  };

  const onViewClick = (record) => {
    setShowSecondTable(true); // Muestra la segunda tabla
  };

  const slideLeft = () => {
    setShowSecondTable(false); // Vuelve a la tabla original
  };

  return (
    <div className='relative flex items-center'>
    <MdChevronLeft className='opacity-50 cursor-pointer hover:opacity-100' onClick={slideLeft} size={40} />
    <div
      id='slider'
      className='w-full h-full overflow-x-scroll scroll whitespace-nowrap scroll-smooth scrollbar-hide'
    >
      {showSecondTable ? (
        <Tabla
          title="Tabla de tareas"
          data={secondTableData}
          columns={taskColumns} // Usamos las columnas de la tabla de tareas
          onViewClick={onViewClick}
        />
      ) : (
        <Tabla
          title="Sesiones"
          data={data}
          columns={sessionColumns} // Usamos las columnas de la tabla de sesiones
          onViewClick={onViewClick}
        />
      )}
    </div>
  </div>
  );
};

export default Historial2;