import React, { useEffect, useState } from "react";
import axios from "axios";
import { Typography } from "@mui/material";
import { Table, Space, Modal, Input, Button, Select } from "antd";

const VCenterPage = () => {
  const [vcenters, setVcenters] = useState([]);
  const [credentials, setCredentials] = useState([]);
  const [newVCenter, setNewVCenter] = useState({ name: "", url: "", ip: "", port: "", credential: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Yeni edit modal state
  const [editingVCenter, setEditingVCenter] = useState(null);

  useEffect(() => {
    fetchVCenters();
    fetchCredentials();
  }, []);

  const fetchVCenters = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/get-vcenters/");
      setVcenters(Array.isArray(response.data.data) ? response.data.data : []);
    } catch (error) {
      console.error("Error fetching vcenters:", error);
      setVcenters([]);
    }
  };

  const fetchCredentials = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/get-credentials/");
      setCredentials(Array.isArray(response.data.data) ? response.data.data : []);
    } catch (error) {
      console.error("Error fetching credentials:", error);
      setCredentials([]);
    }
  };

  const addVCenter = async () => {
    try {
      await axios.post("http://localhost:8000/api/add-vcenter/", newVCenter);
      fetchVCenters();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error adding vcenter:", error);
    }
  };

  const deleteVCenter = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/delete-vcenter/${id}`);
      fetchVCenters();
    } catch (error) {
      console.error("Error deleting vcenter:", error);
    }
  };

  const editVCenter = async () => {
    try {
      await axios.put(`http://localhost:8000/api/edit-vcenter/${editingVCenter.id}`, editingVCenter);
      fetchVCenters();
      setEditingVCenter(null);
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Error editing vcenter:", error);
    }
  };

  const discoveryVCenter = async (id) => {
    try {
      await axios.get(`http://localhost:8000/api/discovery-vcenter/${id}/`);
      fetchVCenters();
    } catch (error) {
      console.error("Error editing vcenter:", error);
    }
  };

  const discoverySnapshots = async (id) => {
    try {
      await axios.get(`http://localhost:8000/api/explore-snapshot-from-vcenter/${id}/`);
      fetchVCenters();
    } catch (error) {
      console.error("Error editing vcenter:", error);
    }
  };

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "URL", dataIndex: "url", key: "url" },
    { title: "IP", dataIndex: "ip", key: "ip" },
    { title: "Port", dataIndex: "port", key: "port" },
    { title: "Credential", dataIndex: "credential", key: "credential" },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <Space>
          <Button
            type="default"
            onClick={() => {
              setEditingVCenter(record);
              setIsEditModalOpen(true);
            }}
          >
            Düzenle
          </Button>
          <Button type="primary" danger onClick={() => deleteVCenter(record.id)}>
            Sil
          </Button>
          <Button type="primary" onClick={() => discoveryVCenter(record.id)}>
            Discovery
          </Button>
          <Button type="primary" onClick={() => discoverySnapshots(record.id)}>
            Discovery Snapshots
          </Button>
          <Button type="default" href={`/vcenter/${record.id}`}>
            Detay
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "20vh", width: "100%" }}>
      <div style={{ maxWidth: "95%", width: "100vw", background: "#fff", padding: "20px", borderRadius: "8px", boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)" }}>
        <Typography variant="h5" fontWeight="bold">vCenter Listesi</Typography>
        <Button type="primary" style={{ marginLeft: "auto" }} onClick={() => setIsModalOpen(true)}>
          Yeni vCenter Ekle
        </Button>

        <Table columns={columns} dataSource={vcenters} rowKey="id" />

        {/* Yeni vCenter ekleme modalı */}
        <Modal title="Yeni vCenter Ekle" open={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={null} centered>
          <Input placeholder="Name" value={newVCenter.name} onChange={(e) => setNewVCenter({ ...newVCenter, name: e.target.value })} style={{ marginBottom: 10 }} />
          <Input placeholder="URL" value={newVCenter.url} onChange={(e) => setNewVCenter({ ...newVCenter, url: e.target.value })} style={{ marginBottom: 10 }} />
          <Input placeholder="IP" value={newVCenter.ip} onChange={(e) => setNewVCenter({ ...newVCenter, ip: e.target.value })} style={{ marginBottom: 10 }} />
          <Input placeholder="Port" value={newVCenter.port} onChange={(e) => setNewVCenter({ ...newVCenter, port: e.target.value })} style={{ marginBottom: 10 }} />
          <Select
            placeholder="Select Credential"
            style={{ width: "100%", marginBottom: 10 }}
            value={newVCenter.credential}
            onChange={(value) => setNewVCenter({ ...newVCenter, credential: value })}
          >
            {credentials.map((cred) => (
              <Select.Option key={cred.id} value={cred.id}>{cred.name}</Select.Option>
            ))}
          </Select>
          <Button type="primary" block onClick={addVCenter}>Kaydet</Button>
        </Modal>

        {/* Düzenleme Modalı */}
        <Modal
          title="vCenter Düzenle"
          open={isEditModalOpen}
          onCancel={() => setIsEditModalOpen(false)}
          footer={[
            <Button key="cancel" onClick={() => setIsEditModalOpen(false)}>İptal</Button>,
            <Button key="save" type="primary" onClick={editVCenter}>Kaydet</Button>
          ]}
          centered
        >
          {editingVCenter && (
            <>
              <Input placeholder="Name" value={editingVCenter.name} onChange={(e) => setEditingVCenter({ ...editingVCenter, name: e.target.value })} style={{ marginBottom: 10 }} />
              <Input placeholder="URL" value={editingVCenter.url} onChange={(e) => setEditingVCenter({ ...editingVCenter, url: e.target.value })} style={{ marginBottom: 10 }} />
              <Input placeholder="IP" value={editingVCenter.ip} onChange={(e) => setEditingVCenter({ ...editingVCenter, ip: e.target.value })} style={{ marginBottom: 10 }} />
              <Input placeholder="Port" value={editingVCenter.port} onChange={(e) => setEditingVCenter({ ...editingVCenter, port: e.target.value })} style={{ marginBottom: 10 }} />
            </>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default VCenterPage;
