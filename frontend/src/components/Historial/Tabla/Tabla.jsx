import React from 'react';
import { Table, Input, Button, Space, Dropdown, Menu } from 'antd';
import { useState, useEffect } from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';

const { Column } = Table;

const Tabla = ({
  title,
  data = [],
  columns,
  onEditClick,
  onDeleteClick,
  onViewClick,
  onInputChange,
}) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [editableData, setEditableData] = useState(data);
  const [filteredData, setFilteredData] = useState(editableData);
  const [editingCell, setEditingCell] = useState({ key: '', column: '' });

  const onRowClick = (record, rowIndex) => {
    setSelectedRowKeys([record.key]);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRowKeys(selectedRowKeys);
    },
  };

  const [searchVisible, setSearchVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    const filteredData = editableData.filter((row) =>
      columns.some((column) =>
        row[column.dataIndex]
          .toString()
          .toLowerCase()
          .includes(e.target.value.toLowerCase())
      )
    );
    setFilteredData(filteredData);
  };

  const handleInputChange = (e, key, column) => {
    const newData = [...editableData];
    const target = newData.find((item) => item.key === key);

    if (target) {
      target[column] = e.target.value;
      setEditableData(newData);
    }
  };

  const editableColumns = columns.map((column) => ({
    ...column,
    render: (text, record) => {
      const isEditing =
        record.key === editingCell.key &&
        column.dataIndex === editingCell.column;

      return isEditing ? (
        <Input
          className='borderless-input'
          value={text}
          onChange={(e) => handleInputChange(e, record.key, column.dataIndex)}
          style={{ width: '100%', height: '100%' }}
        />
      ) : (
        <div
          onClick={(e) => {
            e.stopPropagation();
            setEditingCell({
              key: record.key,
              column: column.dataIndex,
            });
          }}
          style={{ cursor: 'pointer' }}
        >
          {text}
        </div>
      );
    },
  }));

  useEffect(() => {
    setFilteredData(
      editableData.filter((row) =>
        columns.some((column) =>
          row[column.dataIndex]
            .toString()
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        )
      )
    );
  }, [editableData, searchTerm]);

  return (
    <div className='main'>
      <div className='container'>
        <div className='row'>
          <div className='col-12'>
            <h2 className='card-title'>{title}</h2>
          </div>
        </div>
        <div className='row actions'>
          <div className='col-6 left-actions'>
            {selectedRowKeys.length === 1 && (
              <>
                <Button className='icon-button' onClick={onViewClick}>
                  <i className='bi bi-eye'></i>
                </Button>
                <Button className='icon-button' onClick={onEditClick}>
                  <i className='bi bi-pencil'></i>
                </Button>
              </>
            )}
            {selectedRowKeys.length >= 1 && (
              <Button className='icon-button' onClick={onDeleteClick}>
                <i className='bi bi-trash'></i>
              </Button>
            )}
          </div>
          <div className='col-6 right-actions'>
            <Space className='space'>
              <i
                className='bi bi-search'
                onClick={() => setSearchVisible(!searchVisible)}
              ></i>
              {searchVisible && (
                <Input
                  className='input-buscar'
                  placeholder='Buscar...'
                  onChange={handleSearchChange}
                  value={searchTerm}
                />
              )}
            </Space>
          </div>
        </div>
        <div className='row table-container'>
          <div className='col-12'>
            <Table
              className='table table-dark table-sm'
              rowSelection={rowSelection}
              dataSource={filteredData}
              pagination={{
                pageSize: 8,
                position: ['bottomCenter'],
                showSizeChanger: false,
                showQuickJumper: false,
                showTotal: false,
                simple: true,
              }}
              size='small'
            >
              {editableColumns.map((column) => (
                <Column {...column} />
              ))}
              {/* Añadir columna de menú desplegable */}
              <Column
                title='Acciones'
                key='actions'
                render={(text, record) => (
                  <Dropdown
                    overlay={
                      <Menu>
                        <Menu.Item key='edit' onClick={() => onEditClick(record)}>
                          Editar
                        </Menu.Item>
                        <Menu.Item
                          key='delete'
                          onClick={() => onDeleteClick(record)}
                        >
                          Eliminar
                        </Menu.Item>
                      </Menu>
                    }
                    trigger={['hover']}
                  >
                    <a className='ant-dropdown-link' onClick={(e) => e.preventDefault()}>
                      <i className='bi bi-three-dots-vertical'></i>
                    </a>
                  </Dropdown>
                )}
              />
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};



Tabla.propTypes = {
  title: PropTypes.string,
  data: PropTypes.array,
  columns: PropTypes.array,
  onEditClick: PropTypes.func,
  onDeleteClick: PropTypes.func,
  onViewClick: PropTypes.func,
};

Tabla.defaultProps = {
  title: "Mi Tabla",
  data: [
    { key: 1, name: 'John Doe', age: 32, address: 'Street 1' },
    { key: 2, name: 'Jane Doe', age: 28, address: 'Street 2' },
    { key: 3, name: 'Jim Doe', age: 42, address: 'Street 3' },
    { key: 4, name: 'John Doe', age: 32, address: 'Street 1' },
    { key: 5, name: 'Jane Doe', age: 28, address: 'Street 2' },
    { key: 6, name: 'Jim Doe', age: 42, address: 'Street 3' },
    { key: 7, name: 'John Doe', age: 32, address: 'Street 1' },
    { key: 8, name: 'Jane Doe', age: 28, address: 'Street 2' },
    { key: 9, name: 'Jim Doe', age: 42, address: 'Street 3' },
    { key: 10, name: 'John Doe', age: 32, address: 'Street 1' },
    { key: 11, name: 'Jane Doe', age: 28, address: 'Street 2' },
    { key: 12, name: 'Jim Doe', age: 42, address: 'Street 3' },
  ],
    columns: [
      {
        title: 'Nombre',
        dataIndex: 'name',
        key: 'name',
      },   
      { title: 'Age', dataIndex: 'age', key: 'age' },
      { title: 'Address', dataIndex: 'address', key: 'address' },
    ],
  onEditClick: () => console.log('Edit clicked'),
  onDeleteClick: () => console.log('Delete clicked'),
  onViewClick: () => console.log('View clicked'),
};

export default Tabla;