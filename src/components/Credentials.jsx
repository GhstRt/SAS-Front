import React, { useEffect, useState } from "react";
import axios from "axios";
import { Typography } from "@mui/material";
import { Table, Space, Modal, Input, Button } from "antd";

const CredentialsPage = () => {
  const [credentials, setCredentials] = useState([]);
  const [newCredential, setNewCredential] = useState({ name: "", username: "", password: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCredential, setEditingCredential] = useState(null);

  useEffect(() => {
    fetchCredentials();
  }, []);

  const fetchCredentials = async () => {
    try {
      const response = await axios.get("https://cloudsamapi.fw.dteknoloji.com.tr/api/get-credentials/");
      setCredentials(Array.isArray(response.data.data) ? response.data.data : []);
    } catch (error) {
      console.error("Error fetching credentials:", error);
      setCredentials([]);
    }
  };

  const addCredential = async () => {
    try {
      await axios.post("https://cloudsamapi.fw.dteknoloji.com.tr/api/add-credential/", newCredential);
      fetchCredentials();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error adding credential:", error);
    }
  };

  const deleteCredential = async (id) => {
    try {
      await axios.delete(`https://cloudsamapi.fw.dteknoloji.com.tr/api/delete-credentials/${id}`);
      fetchCredentials();
    } catch (error) {
      console.error("Error deleting credential:", error);
    }
  };

  const editCredential = async () => {
    try {
      await axios.put(`https://cloudsamapi.fw.dteknoloji.com.tr/api/edit-credentials/${editingCredential.id}`, editingCredential);
      fetchCredentials();
      setEditingCredential(null);
    } catch (error) {
      console.error("Error editing credential:", error);
    }
  };

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Username", dataIndex: "username", key: "username" },
    { title: "Actions", key: "actions", render: (text, record) => (
        <Space>
          <Button type="default" onClick={() => setEditingCredential(record)}>Düzenle</Button>
          <Button type="primary" danger onClick={() => deleteCredential(record.id)}>Sil</Button>
        </Space>
      )
    }
  ];

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "20vh", width: "100%" }}>
      <div style={{ maxWidth: "95%", width: "100vw", background: "#fff", padding: "20px", borderRadius: "8px", boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)" }}>
      <div className="flex justify-between items-center mb-4">
        <Typography variant="h5" fontWeight="bold">Credentials</Typography>
        <Button type="primary" style={{ marginLeft: "auto" }} onClick={() => setIsModalOpen(true)}>Yeni Credential Ekle</Button>
      </div>
      
      <Table columns={columns} dataSource={credentials} rowKey="id" />
      
      <Modal title="Yeni Credential Ekle" visible={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={null} centered>
        <Input placeholder="Name" value={newCredential.name} onChange={(e) => setNewCredential({ ...newCredential, name: e.target.value })} style={{ marginBottom: 10 }} />
        <Input placeholder="Username" value={newCredential.username} onChange={(e) => setNewCredential({ ...newCredential, username: e.target.value })} style={{ marginBottom: 10 }} />
        <Input.Password placeholder="Password" value={newCredential.password} onChange={(e) => setNewCredential({ ...newCredential, password: e.target.value })} style={{ marginBottom: 10 }} />
        <Button type="primary" block onClick={addCredential}>Kaydet</Button>
      </Modal>
      
      <Modal title="Credential Düzenle" visible={!!editingCredential} onCancel={() => setEditingCredential(null)} footer={null} centered>
        <Input placeholder="Name" value={editingCredential?.name || ""} onChange={(e) => setEditingCredential({ ...editingCredential, name: e.target.value })} style={{ marginBottom: 10 }} />
        <Input placeholder="Username" value={editingCredential?.username || ""} onChange={(e) => setEditingCredential({ ...editingCredential, username: e.target.value })} style={{ marginBottom: 10 }} />
        <Input.Password placeholder="Password" value={editingCredential?.password || ""} onChange={(e) => setEditingCredential({ ...editingCredential, password: e.target.value })} style={{ marginBottom: 10 }} />
        <Button type="primary" block onClick={editCredential}>Güncelle</Button>
      </Modal>
      </div>
    </div>
  );
};

export default CredentialsPage;
