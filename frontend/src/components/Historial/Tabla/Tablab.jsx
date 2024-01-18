import { useState } from 'react';
import { Table, Space, Button, Input } from 'antd';
import { SearchOutlined, EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import './Tabla.css';
import { useNavigate } from 'react-router-dom';
import { DownOutlined } from '@ant-design/icons';


const Tabla = ({
  title,
  data = [],
  columns,
  onEditClick,
  onDeleteClick,
  onViewClick,
}) => {
  // Funcionalidad checkbox para la columna de checkbox de la tabla
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  
  // eslint-disable-next-line no-unused-vars
  const onRowClick = (record, rowIndex) => {
    setSelectedRowKeys([record.key]);
  };

  const rowSelection = {
    selectedRowKeys,
    // eslint-disable-next-line no-unused-vars
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRowKeys(selectedRowKeys);
    },
  };

  // Funcionalidad para search
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const filteredData = data.filter((row) => 
  columns.some((column) => 
    row[column.dataIndex] && row[column.dataIndex].toString().toLowerCase().includes(searchTerm.toLowerCase())
  )
);

  const navigate = useNavigate();

  //Codigo de prueba

  


  return (
    <div className="bodyt">
      <div className="content">
        <div className="title">
          <h2 className="card-title">{title}</h2>
        </div>
        <div className="actions">
          <div className="left-actions">
            {rowSelection.selectedRowKeys.length === 1 && (
              <>
                <Button className="icon-button" onClick={onViewClick}><EyeOutlined /></Button>
                <Button className="icon-button" onClick={onEditClick}><EditOutlined /></Button>
              </>
            )}
            {rowSelection.selectedRowKeys.length >= 1 && (
              <Button className="icon-button" onClick={onDeleteClick}><DeleteOutlined /></Button>
            )}
          </div>
          <div className="right-actions">
            <Space className="space">
              <SearchOutlined className="search-icon" onClick={() => setSearchVisible(!searchVisible)} />
              {searchVisible && <Input className="input-buscar" placeholder="Buscar..." onChange={handleSearchChange} value={searchTerm} />}
            </Space>
          </div>
        </div>
        <div className="table-container">
          <Table
            className="table-style"
            rowSelection={rowSelection}
            columns={columns}
            dataSource={filteredData}
            onRow={(record, rowIndex) => ({
              onClick: () => onRowClick(record, rowIndex),
            })}
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
      </div>
    
    </div>
    
  );
};

Tabla.propTypes = {
  title: PropTypes.string,
  data: PropTypes.array,
  columns: PropTypes.array,
  rowSelection: PropTypes.object,
  onRowClick: PropTypes.func,
  onEditClick: PropTypes.func,
  onDeleteClick: PropTypes.func,
  onViewClick: PropTypes.func,
  searchVisible: PropTypes.bool,
  onSearchChange: PropTypes.func,
  searchRef: PropTypes.object,
};

export default Tabla;