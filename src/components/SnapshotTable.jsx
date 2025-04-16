import React, { useState, useEffect, useRef } from "react";
import { Table, Button, Input, Modal, Checkbox, Space } from "antd";
import { EyeOutlined, InfoCircleOutlined, FilterOutlined, SearchOutlined } from "@ant-design/icons";
import axios from "axios";

const SnapshotTable = () => {
  const [snapshots, setSnapshots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingKey, setEditingKey] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);

  useEffect(() => {
    fetchSnapshots();
  }, []);

  const fetchSnapshots = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/get-snapshots/`);
      if (response.data.status.code === 0) {
        const formattedData = response.data.data.map((item) => ({
          key: item.VM_ID,
          ...item,
        }));
        setSnapshots(formattedData);
      }
      setLoading(false);
    } catch (error) {
      console.error("Veri çekme hatası:", error);
      setLoading(false);
    }
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={searchInput}
          placeholder={`Ara: ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button type="primary" onClick={() => handleSearch(selectedKeys, confirm, dataIndex)} size="small">
            Ara
          </Button>
          <Button onClick={() => handleReset(clearFilters)} size="small">
            Sıfırla
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />,
    onFilter: (value, record) => record[dataIndex] ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()) : false,
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
  });

  const handleEdit = (key) => {
    setEditingKey(key);
  };

  const handleSave = async (record) => {
    setEditingKey(null);
  };

  const handleDelete = (key) => {
    setServers(servers.filter(item => item.key !== key));
  };

  const handleChange = (key, dataIndex, value) => {
    const newData = servers.map((item) => {
      if (item.key === key) {
        return { ...item, [dataIndex]: value };
      }
      return item;
    });
    setServers(newData);
  };

  let columns = Object.keys(snapshots[0] || {}).filter(key => key.toUpperCase() !== "VM_ID").map((key) => ({
    title: key.replace(/_/g, ' '),
    dataIndex: key,
    key: key,
    sorter: (a, b) => {
      if (typeof a[key] === 'number' && typeof b[key] === 'number') {
        return a[key] - b[key];
      }
      return String(a[key] || '').localeCompare(String(b[key] || ''));
    },
    render: (text, record) => {
      if (key.toUpperCase() === "VM_ID") {}
      // Eğer tarihse, okunabilir formata çevir
      if (key.toLowerCase().includes("date") && typeof text === "number") {
        return new Date(text).toLocaleString(); // Kullanıcının yerel tarih formatına çevir
      }
      return editingKey === record.key ? (
        <Input value={text} onChange={(e) => handleChange(record.key, key, e.target.value)} />
      ) : (
        text
      );
    },
    ...getColumnSearchProps(key), // **Arama filtresi eklendi**
    }
  ));

  columns = columns.sort((a, b) => (a.key === "VM_NAME" ? -1 : b.key === "VM_NAME" ? 1 : 0));

  columns = columns.map((col) =>
    col.key === "VM_NAME" ? { ...col, fixed: "left" } : col
  );

  columns.push({
    title: "İşlemler",
    key: "action",
    fixed: "right",
    render: (_, record) => (
      <div style={{ display: "flex", gap: "8px" }}>
        {editingKey === record.key ? (
          <Button type="primary" onClick={() => handleSave(record)}>
            Kaydet
          </Button>
        ) : (
          <Button type="default" onClick={() => handleEdit(record.key)}>
            Düzenle
          </Button>
        )}
        {editingKey === record.key && (
          <Button type="danger" onClick={() => handleDelete(record.key)}>
            Sil
          </Button>
        )}
      </div>
    ),
  });

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "20vh", width: "100%" }}>
      <div style={{ maxWidth: "95%", width: "100vw", background: "#fff", padding: "20px", borderRadius: "8px", boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)" }}>
        <Table
          columns={columns}
          dataSource={snapshots}
          loading={loading}
          size="small"
          pagination={{
            showSizeChanger: true,
            pageSizeOptions: ["5", "10", "20", "50"],
            defaultPageSize: 10,
            showQuickJumper: true,
          }}
          scroll={{ x: "max-content" }}
        />
      </div>
    </div>
  );
};

export default SnapshotTable;
