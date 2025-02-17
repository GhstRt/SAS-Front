import React, { useState, useEffect } from "react";
import { Table, Button, Input, Checkbox, Modal } from "antd";
import { EyeOutlined, InfoCircleOutlined, FilterOutlined } from "@ant-design/icons";
import axios from 'axios';
import { Typography, Card, Space } from "antd";
import { useNavigate } from "react-router-dom"; 

const TableComponent = () => {
  const [servers, setServers] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingKey, setEditingKey] = useState(null);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    title: "",
    price: [],
    category: [],
    description: "",
  });
  const navigate = useNavigate();

  const fetchServers = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.get('http://localhost:8000/api/get-servers/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    

      setServers(productsWithKarat);
      setLoading(false);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        navigate('/login');
      } else {
        setError('Ürünler yüklenirken bir hata oluştu.');
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServers();
     }, []);

  const handleEdit = (key) => {
    setEditingKey(key);
  };

  const handleSave = (key) => {
    setEditingKey(null);
  };

  const handleFilterChange = (key, value) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const applyFilters = () => {
    let filteredData = products.filter((item) => (
      (selectedFilters.title === "" || item.title.toLowerCase().startsWith(selectedFilters.title.toLowerCase())) &&
      (selectedFilters.price.length === 0 || selectedFilters.price.includes(item.price)) &&
      (selectedFilters.category.length === 0 || selectedFilters.category.includes(item.category)) &&
      (selectedFilters.description === "" || item.description.toLowerCase().startsWith(selectedFilters.description.toLowerCase()))
    ));
    setFilteredProducts(filteredData);
    setFilterModalVisible(false);
  };

  const resetFilters = () => {
    setSelectedFilters({ title: "", price: [], category: [], description: "" });
    setFilteredProducts(products);
    setFilterModalVisible(false);
  };


  const handleChange = (key, dataIndex, value) => {
    const newData = filteredProducts.map((item) => {
      if (item.key === key) {
        return { ...item, [dataIndex]: value };
      }
      return item;
    });
    setFilteredProducts(newData);
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      fixed: "left",
      width: 80,
    },
    {
      title: "Ad",
      dataIndex: "title",
      key: "title",
      fixed: "left",
      width: 200,
      sorter: (a, b) => a.title.localeCompare(b.title),
      render: (text, record) => (
        editingKey === record.key ? (
          <Input value={text} onChange={(e) => handleChange(record.key, "title", e.target.value)} />
        ) : (
          text
        )
      )
    },
    {
      title: "Açıklama",
      dataIndex: "description",
      key: "description",
      width: 250,
      sorter: (a, b) => a.description.localeCompare(b.description),
      render: (text, record) => (
        editingKey === record.key ? (
          <Input value={text} onChange={(e) => handleChange(record.key, "description", e.target.value)} />
        ) : (
          text
        )
      )
    },
    {
      title: "Fiyat",
      dataIndex: "price",
      key: "price",
      width: 100,
      sorter: (a, b) => a.price - b.price,
      render: (text, record) => (
        editingKey === record.key ? (
          <Input value={text} onChange={(e) => handleChange(record.key, "price", e.target.value)} />
        ) : (
          text
        )
      )
    },
    {
      title: "Kategori",
      dataIndex: "category",
      key: "category",
      width: 150,
      sorter: (a, b) => a.category.localeCompare(b.category),
      render: (text, record) => (
        editingKey === record.key ? (
          <Input value={text} onChange={(e) => handleChange(record.key, "category", e.target.value)} />
        ) : (
          text
        )
      )
    },
    {
      title: "İşlemler",
      key: "action",
      render: (_, record) => (
        <div style={{ display: "flex", gap: "8px" }}>
          {editingKey === record.key ? (
            <Button type="primary" onClick={() => handleSave(record.key)}>
              Kaydet
            </Button>
          ) : (
            <Button type="default" onClick={() => handleEdit(record.key)}>
              Düzenle
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh", width: "100%" }}>
      <div style={{ maxWidth: "95%", width: "100vw", background: "#fff", padding: "20px", borderRadius: "8px", boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)" }}>
      <Button type="primary" icon={<FilterOutlined />} onClick={() => setFilterModalVisible(true)} style={{ marginBottom: 16 }}>
          Filtre
        </Button>

        {/* Ürün Filtreleme Modalı */}
        <Modal
          title="Detaylı Filtreleme"
          open={filterModalVisible}
          onOk={applyFilters}
          onCancel={() => setFilterModalVisible(false)}
          footer={[
            <Button key="reset" onClick={resetFilters}>
              Sıfırla
            </Button>,
            <Button key="apply" type="primary" onClick={applyFilters}>
              Filtrele
            </Button>,
          ]}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label>Ürün Adı:</label>
              <Input placeholder="Ürün adına göre ara..." value={selectedFilters.title} onChange={(e) => handleFilterChange("title", e.target.value)} />
            </div>
            <div>
              <label>Fiyat:</label>
              <Checkbox.Group
                options={[...new Set(products.map((item) => item.price))].map((price) => ({ label: `${price} $`, value: price }))}
                value={selectedFilters.price}
                onChange={(values) => handleFilterChange("price", values)}
              />
            </div>
            <div>
              <label>Kategori:</label>
              <Checkbox.Group
                options={[...new Set(products.map((item) => item.category))].map((category) => ({ label: category, value: category }))}
                value={selectedFilters.category}
                onChange={(values) => handleFilterChange("category", values)}
              />
            </div>
            <div>
              <label>Açıklama:</label>
              <Input placeholder="Ürün açıklamasına göre ara..." value={selectedFilters.description} onChange={(e) => handleFilterChange("description", e.target.value)} />
            </div>
          </div>
        </Modal>
        <Table 
          columns={columns} 
          dataSource={filteredProducts} 
          scroll={{ x: "max-content" }}
          loading={loading} 
          pagination={{
            showSizeChanger: true, 
            pageSizeOptions: ["5", "10", "20", "50"], 
            defaultPageSize: 10, 
            showQuickJumper: true, 
            showTotal: (total, range) => `${range[0]}-${range[1]} / ${total} kayıt`, 
          }} 
        />
      </div>
    </div>
  );
};

export default TableComponent;
