import React, { useState, useEffect, useRef } from "react";
import { Table, Button, Input, Modal, Checkbox, Space } from "antd";
import { useNavigate } from "react-router-dom";
import { EyeOutlined, InfoCircleOutlined, FilterOutlined, SearchOutlined, ReloadOutlined } from "@ant-design/icons";
import { useParams } from "react-router-dom";
import axios from "axios";

const FilterTable = () => {
  const { type, os } = useParams(); // URL'den parametreleri al
  const [servers, setServers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingKey, setEditingKey] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchServers();
  }, [os]);

  const fetchServers = async () => {
    try {
      let response = "";
      if (os === undefined) {
        response = await axios.get(`http://127.0.0.1:8000/api/get-servers-by-filter/virtual/all/`);
      }
      else {
        response = await axios.get(`http://127.0.0.1:8000/api/get-servers-by-filter/virtual/${os}/`);
      }
      if (response.data.status.code === 0) {
        const formattedData = response.data.data.map((item) => ({
          key: item.id,
          ...item.data,
        }));
        setServers(formattedData);
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
    try {
      // Güncellenecek veriyi hazırlıyoruz
      const updatedData = {
        //HOSTNAME: record.HOSTNAME,  // Örneğin, isim alanı varsa
        AIM_OF_USE: record.AIM_OF_USE, // Örneğin, durum bilgisi
        //CONSOLE_IP: record.CONSOLE_IP,
        //CORE: record.CORE,
        //CLUSTER_NAME: record.CLUSTER_NAME,
        COMPANY: record.COMPANY,
        UPDATE_CYCLE: record.UPDATE_CYCLE,
        DOMINO_NO: record.DOMINO_NO,
        //HOSTED_ON: record.HOSTED_ON,
        //IP_ADDRESS: record.IP_ADDRESS,
        //MEMORY: record.MEMORY,
        //TOTAL_DISK: record.TOTAL_DISK,
        //OS: record.OS,
        //POWER_STATE: record.POWER_STATE,
        //RESOURCE_TYPE: record.RESOURCE_TYPE,
        RESPONSIBLE_GROUP: record.RESPONSIBLE_GROUP,
        //VCENTER_ID: record.VCENTER_ID // Örneğin, IP adresi varsa
        // Diğer güncellenmesi gereken alanlar
      };

      const response = await axios.put(`http://127.0.0.1:8000/api/update-server/${record.key}/`, updatedData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log("Başarıyla güncellendi:", response.data);
    } catch (error) {
      console.error("Güncelleme hatası:", error.response ? error.response.data : error.message);
    }
    setEditingKey(null);
  };

  const handleReload = async (key) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/reload-server/${key}/`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log("Başarılı:", response.data);
    } catch (error) {
      console.error("Başarısız:", error.response ? error.response.data : error.message);
    }
  };

  const handleDelete = async (key) => {
    setServers(servers.filter(item => item.key !== key));
    try {
      const response = await axios.delete(`http://127.0.0.1:8000/api/delete-server/${key}/`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log("Başarıyla silindi:", response.data);
    } catch (error) {
      console.error("Silme hatası:", error.response ? error.response.data : error.message);
    }
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

  const excludedKeys = ["VM_MO_ID", "VCENTER_URL", "VCENTER_ID", "RESOURCE_TYPE", "key", "CONSOLE_IP"]; // tabloya eklenmeyecek alanlar

  let columns = Object.keys(servers[0] || {})
    .filter((key) => !excludedKeys.includes(key))  // Bu satır eklendi
    .map((key) => ({
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
        if (key.toLowerCase().includes("date") && typeof text === "number") {
          return new Date(text).toLocaleString();
        }
        return editingKey === record.key ? (
          <Input value={text} onChange={(e) => handleChange(record.key, key, e.target.value)} />
        ) : (
          text
        );
      },
      ...getColumnSearchProps(key),
    }));


  columns = columns.sort((a, b) => (a.key === "AIM_OF_USE" ? -1 : b.key === "AIM_OF_USE" ? 1 : 0));

  columns = columns.map((col) =>
    col.key === "AIM_OF_USE" ? { ...col, fixed: "left" } : col
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
        <Button type="default" onClick={() => window.open(record.VCENTER_URL, "_blank")}>
          vCenter
        </Button>
        <Button type="default" onClick={() => handleReload(record.key)}>
          <ReloadOutlined />
        </Button>
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
          dataSource={servers}
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

export default FilterTable;
