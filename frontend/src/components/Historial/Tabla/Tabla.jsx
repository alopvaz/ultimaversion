import React, { useState } from 'react';
import { Row, Col, Button, Input, Table, Space, Typography, Popconfirm, Form } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import './Tabla.css';

const Tabla = () => {




  const [inputVisible, setInputVisible] = useState(false);
  const [form] = Form.useForm();
  const [data, setData] = useState([
    { key: '1', name: 'John Doe', age: 30, address: 'New York' },
    { key: '2', name: 'John Doe', age: 30, address: 'New York' },
    { key: '3', name: 'John Doe', age: 30, address: 'New York' },
    { key: '4', name: 'John Doe', age: 30, address: 'New York' },
  ]);
  const [editingKey, setEditingKey] = useState('');

  const handleClick = () => {
    setInputVisible(!inputVisible);
  };

  const isEditing = (record) => record.key === editingKey;

  const edit = (record) => {
    form.setFieldsValue(record);
    setEditingKey(record.key);
  };
  const cancel = () => {
    setEditingKey('');
  };

  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setData(newData);
        setEditingKey('');
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey('');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const handleKeyPress = (e, key) => {
    if (e.key === 'Enter') {
      save(key);
    }
  };

  const handleAdd = () => {
    const newKey = (data.length + 1).toString();
    const newData = {
      key: newKey,
      name: `New User ${newKey}`,
      age: '',
      address: '',
    };
    setData([...data, newData]);
    edit(newData);
  };

  const handleDelete = (key) => {
    const newData = data.filter((item) => item.key !== key);
    setData(newData);
  };

  const columns = [
    {
      title: 'Nombre',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      sortDirections: ['descend', 'ascend'],
      render: (text, record) => {
        const editable = isEditing(record);
        return editable ? (
          <Form.Item
            name="name"
            style={{
              margin: 0,
            }}
            rules={[
              {
                required: true,
                message: 'Please input a name!',
              },
            ]}
          >
            <Input
              onBlur={() => save(record.key)}
              onPressEnter={(e) => handleKeyPress(e, record.key)}
            />
          </Form.Item>
        ) : (
          <span>{text}</span>
        );
      },
    },
    {
      title: 'acciones',
      key: 'expand',
      render: (text, record) => {
        const editable = isEditing(record);
        return (
          <span>
            <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}       style={{ marginRight: '10px' }}
>
              Editar 
            </Typography.Link>
            {" "} {" "}

            <Typography.Link onClick={() => handleDelete(record.key)}>
              Eliminar
            </Typography.Link>
          </span>
        );
      },
    },
  ];

  const [searchValue, setSearchValue] = useState('');
  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };



  const filteredData = data.filter((item) =>
    item.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <div className="main">
      <div className="container">
        <div className="title">
          <h2 className="t">TABLA DE SESIONES</h2>
        </div>

        <div className="actions">
          <Row gutter={[16, 16]}>
            <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
              <div className="left-actions">
                <Button type="primary" onClick={handleAdd}>
                  Agregar Fila
                </Button>
              </div>
            </Col>
            <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
  <div className="right-actions">
    <Button onClick={handleClick}>
      <SearchOutlined />
    </Button>
    {inputVisible && (
      <Input
        className="input-visible"
        placeholder="Buscar..."
        value={searchValue}
        onChange={handleSearchChange}
      />
    )}
  </div>
</Col>
          </Row>
        </div> 

        <div className="table">
          <Form form={form} component={false}>
            <Table
              columns={columns}
              dataSource={filteredData}
              expandable={{ expandedRowRender: () => null }}
            />
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Tabla;
