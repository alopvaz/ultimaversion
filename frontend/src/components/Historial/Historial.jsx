import { Table, Card, Space, Button, Input } from 'antd';
import { SearchOutlined, EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useState, useRef, useEffect } from 'react';
import './Historial.css';
import axios from 'axios';
import { CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons';



const Historial = () => {



  const [selectedTarea, setSelectedTarea] = useState(null);


  const [votaciones, setVotaciones] = useState([]);
 









  const [votacionesData, setVotacionesData] = useState([]);
const [votacionesVisible, setVotacionesVisible] = useState(false);


const votacionesColumns = [
  {
    title: 'Nombre del usuario',
    dataIndex: 'nombre', // Cambia 'id_participante' a 'nombre'
    key: 'nombre', // Cambia 'id_participante' a 'nombre'
  },
  {
    title: 'Votación',
    dataIndex: 'votacion',
    key: 'votacion',
  },
];
  
const [selectedTareaKeys, setSelectedTareaKeys] = useState([]);  const [searchTareaVisible, setSearchTareaVisible] = useState(false);
  const [filteredTareas, setFilteredTareas] = useState([]);




  const [tareas, setTareas] = useState([]);

  
  const tareasData = tareas.map((tarea, index) => ({
    key: index, // Utiliza el índice como clave. Asegúrate de que cada tarea tiene una clave única.
    ...tarea,
  }));

  
  const [searchVisible, setSearchVisible] = useState(false);
  const searchRef = useRef(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const [searchValue, setSearchValue] = useState('');

  const [historialData, setHistorialData] = useState([]);

  const [sortOrder, setSortOrder] = useState('ascend'); // 'ascend' para ascendente, 'descend' para descendente
  const [sortedColumn, setSortedColumn] = useState(null); // La columna que se está ordenando

  
  // En lugar de definir la propiedad 'sorter' en las columnas, puedes definir tu propia función de ordenación
const sortData = (data, columnKey, order) => {
  return [...data].sort((a, b) => {
    if (order === 'ascend') {
      return a[columnKey] > b[columnKey] ? 1 : -1;
    } else {
      return a[columnKey] < b[columnKey] ? 1 : -1;
    }
  });
};

const sortedData = sortData(historialData, sortedColumn, sortOrder);
const tareaRowSelection = {
  selectedTareaKeys,
  getCheckboxProps: (record) => ({
    disabled: record.key === 'nuevo', // Desactiva el checkbox para la fila "+ Nuevo"
  }),
  onChange: (selectedTareaKeys, selectedRows) => {
    setSelectedTareaKeys(selectedTareaKeys);
    if (selectedRows.length > 0) {
      setSelectedTarea(selectedRows[selectedRows.length - 1].id); // Establece selectedTarea al id de la última tarea seleccionada
    } else {
      setSelectedTarea(null);
    }
  },
};



const handleSort = (columnKey) => {
  const order = sortedColumn === columnKey && sortOrder === 'ascend' ? 'descend' : 'ascend';
  setSortOrder(order);
  setSortedColumn(columnKey);
  const sortedData = sortData(historialData, columnKey, order);
  setHistorialData(sortedData);
};

  const filteredData = historialData.filter(record => 
    Object.values(record).some(value => 
      value.toString().toLowerCase().includes(searchValue.toLowerCase())
    )
  );

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

// Remove the existing declaration of 'data'
// const [data, setData] = useState([]);

// Declare 'data' only once

  const showModal = () => {tareaRowSelection 
    setIsModalVisible(true);
  };

  const hideModal = () => {
    setIsModalVisible(false);
    // No deseleccionamos las filas cuando se oculta el modal
    setSelectedRow(null); // Esto quitará el resaltado de la fila
  };

  const rowSelection = {
    selectedRowKeys,
    getCheckboxProps: (record) => ({
      disabled: record.key === 'nuevo', // Desactiva el checkbox para la fila "+ Nuevo"
    }),
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRowKeys(selectedRowKeys);
      if (selectedRowKeys.length > 0) {
        setSelectedRow(selectedRowKeys[selectedRowKeys.length - 1]);
        if (!isModalVisible) {
          showModal();
        }
      } else {
        setSelectedRow(null);
        hideModal();
      }
    },
  };

  const handleAddRow = () => {
    // Aquí puedes implementar la lógica para añadir una nueva fila
  };

 // Primero, elimina las propiedades 'sorter' y 'sortDirections' de las columnas
 const columns = [
  {
    title: (
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <span>Nombre</span>
        <div style={{ display: 'flex', flexDirection: 'column', marginLeft: 'auto' }} onClick={() => handleSort('nombre')}>
          <CaretUpOutlined />
          <CaretDownOutlined />
        </div>
      </div>
    ),
    dataIndex: 'nombre',
    key: 'nombre',
    width: 200, // Establece un ancho fijo para esta columna
    render: text => <div style={{ width: '100%', overflow: 'auto', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{text}</div>,
  },
  {
    title: (
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <span>Fecha de la sesión</span>
        <div style={{ display: 'flex', flexDirection: 'column', marginLeft: 'auto' }} onClick={() => handleSort('fecha')}>
          <CaretUpOutlined />
          <CaretDownOutlined />
        </div>
      </div>
    ),
    dataIndex: 'fecha',
    key: 'fecha',
    width: 200, // Establece un ancho fijo para esta columna
    render: text => <div style={{ width: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{text}</div>,
  },
  // Agrega más columnas aquí
];
  
  useEffect(() => {
    axios.get('http://localhost:3000/sesiones')
    .then(res => {
      if (Array.isArray(res.data)) {
        const mappedData = res.data.map((item, index) => ({ key: item.id, ...item })); // Usa el id de la sesión como key
        setHistorialData(mappedData);
      } else {
        console.error('Error: /sesiones did not return an array');
      }
    })
    .catch(err => {
      console.error(err);
    });
    if (searchVisible) {
      searchRef.current.focus();
    }
    document.body.style.overflow = 'auto';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [searchVisible]);

  const handleViewClick = () => {
    axios.get(`http://localhost:3000/tareas/${selectedRow}`)
      .then(res => {
        setTareas(res.data); // Guarda las tareas en el estado
      })
      .catch(err => {
        console.error(err);
      });
  };
  const handleEditClick = () => {
    // Aquí puedes implementar la lógica para manejar el clic en el icono de lápiz
  };


  
  const handleDeleteClick = () => {
    // Itera sobre las claves de las filas seleccionadas
    selectedRowKeys.forEach(id => {
      // Hace una petición DELETE para cada id
      axios.delete(`http://localhost:3000/sesiones/${id}`)
        .then(res => {
          console.log(res.data); // La respuesta del servidor
        })
        .catch(err => {
          console.error(err);
        });
    });
  
    const newHistorialData = historialData.filter(record => !selectedRowKeys.includes(record.key));
    setHistorialData(newHistorialData);
    setSelectedRowKeys([]);

};

 //Sección de tareas

 const tareasColumns = [
  {
    title: 'Nombre',
    dataIndex: 'nombre',
    key: 'nombre',
  },
  {
    title: 'Estimación',
    dataIndex: 'estimacion',
    key: 'estimacion',
  },
  {
    title: 'Sesión',
    dataIndex: 'sesion',
    key: 'sesion',
  },
];


const handleTareaViewClick = () => {
  setVotacionesVisible(true);
  axios.get(`http://localhost:3000/votaciones/${selectedTarea}`)
  .then(res => {
    setVotaciones(res.data); // Guarda las votaciones en el estado
    const votacionesData = res.data.map((votacion, index) => ({
      key: index, // Utiliza el índice como clave. Asegúrate de que cada votación tiene una clave única.
      ...votacion,
    }));
    setVotacionesData(votacionesData); // Guarda los datos mapeados en el estado
    console.log(selectedTarea);

  })
  .catch(err => {
    console.error(err);
  });
};


const handleTareaEditClick = () => {
  // Implementa la funcionalidad de edición aquí
}

const handleTareaDeleteClick = () => {
  // Implementa la funcionalidad de eliminación aquí
}

const handleTareaSearchChange = () => {
  // Implementa la funcionalidad de búsqueda aquí
}
return (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ margin: '0 auto', maxWidth: '80vw' }}>
        <Card title={<span className="card-title">Tabla de sesiones</span>} />
        <div style={{ marginTop: '-40px' }}>
          <Card extra={
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '80vw', position: 'sticky', top: 0, zIndex: 1 }}>
              <div style={{ flex: 1 }}>
                {selectedRowKeys.length === 1 && (
                  <>
                    <Button className="icon-button" onClick={handleViewClick}><EyeOutlined /></Button>
                    <Button className="icon-button" onClick={handleEditClick}><EditOutlined /></Button>
                  </>
                )}
                {selectedRowKeys.length >= 1 && (
                  <Button className="icon-button" onClick={handleDeleteClick}><DeleteOutlined /></Button>
                )}
              </div>
              <div>
                <Space style={{ marginBottom: '0px' }}>
                  <SearchOutlined style={{ paddingBottom: '0px' }} onClick={() => setSearchVisible(!searchVisible)} />
                  {searchVisible && <Input className="input-buscar" ref={searchRef} placeholder="Buscar..." onChange={handleSearchChange} />}
                </Space>
              </div>
            </div>
          } />
          <Table
            style={{ marginTop: '-48px' }}
            rowSelection={rowSelection}
            columns={columns}
            dataSource={filteredData}
            rowClassName={(record) => record.key === 'nuevo' ? 'new-row' : (selectedRowKeys.includes(record.key) ? 'selected-row' : '')}
            pagination={{
              pageSize: 8,
              position: ['bottomCenter'],
              showSizeChanger: false,
              showQuickJumper: false,
              showTotal: false,
              simple: true,
            }}
            size="small"
          />
        </div>
        <div style={{ marginTop: '150px' }}>
          <Card title={<span className="card-title">Tabla de tareas</span>} />
          <div style={{ marginTop: '-40px' }}>
            <Card extra={
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '80vw', position: 'sticky', top: 0, zIndex: 1 }}>
                <div style={{ flex: 1 }}>
                  {selectedTareaKeys.length === 1 && (
                    <>
                      <Button className="icon-button" onClick={handleTareaViewClick}><EyeOutlined /></Button>
                      <Button className="icon-button" onClick={handleTareaEditClick}><EditOutlined /></Button>
                    </>
                  )}
                  {selectedTareaKeys.length >= 1 && (
                    <Button className="icon-button" onClick={handleTareaDeleteClick}><DeleteOutlined /></Button>
                  )}
                </div>
                <div>
                  <Space style={{ marginBottom: '0px' }}>
                    <SearchOutlined style={{ paddingBottom: '0px' }} onClick={() => setSearchTareaVisible(!searchTareaVisible)} />
                    {searchTareaVisible && <Input className="input-buscar" placeholder="Buscar..." onChange={handleTareaSearchChange} />} 
                  </Space>
                </div>
              </div>
            }/>
            <Table 
              style={{ marginTop: '-48px' }}
              rowSelection={tareaRowSelection} 
              columns={tareasColumns} 
              dataSource={tareasData}
              rowClassName={(record) => record.key === 'nuevo' ? 'new-row' : (selectedTareaKeys.includes(record.key) ? 'selected-row' : '')}
              pagination={{
                pageSize: 8,
                position: ['bottomCenter'],
                showSizeChanger: false,
                showQuickJumper: false,
                showTotal: false,
                simple: true,
              }}
              size="small"
            />
          </div>

          {votacionesVisible && (
  <Table 
    columns={votacionesColumns} 
    dataSource={votacionesData} 
  />
)}
        </div>
      </div>
    </div>
  </div>
);
};

export default Historial;