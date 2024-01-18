import React from 'react';
import { Row, Col, Button, Input, Table, Space } from 'antd';
import { SearchOutlined, UpOutlined, DownOutlined } from '@ant-design/icons';

const Tabla = () => {
  const columns = [
    {
      title: 'Nombre',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      sortDirections: ['descend', 'ascend'],
      render: (text, record) => <span>{text}</span>,
    },
    // Otras columnas según tus necesidades

    // Nueva columna "Actions"
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <Space size="middle">
          <a href={`editar/${record.key}`}>Edit</a>
          <a href={`eliminar/${record.key}`}>Delete</a>
        </Space>
      ),
    },
  ];

  const data = [
    // Puedes proporcionar datos iniciales para tu tabla aquí
    { key: '1', name: 'John Doe', age: 30, address: 'New York' },
  ];

  return (
    <div className="main">
      {/* Contenedor Interno */}
      <div className="container">
        {/* Título */}
        <div className="titulo">
          <h2>Tabla de Sesiones</h2>
        </div>

        {/* Acciones */}
        <div className="actions">
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={24} md={14} lg={14} xl={14} xxl={14}>
              <div className="left-actions">
                <Button type="primary">Add a row</Button>
              </div>
            </Col>
            <Col xs={24} sm={24} md={14} lg={14} xl={14} xxl={14}>
              <div className="right-actions">
                <Input
                  prefix={<SearchOutlined />}
                  placeholder="Buscar..."
                />
              </div>
            </Col>
          </Row>
        </div>

        {/* Tabla */}
        <div className="table">
          <Table columns={columns} dataSource={data} />
        </div>
      </div>
    </div>
  );
};

export default Tabla;
