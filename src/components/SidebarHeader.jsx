import React, { useEffect, useState } from "react";
import { Layout, Menu, Avatar, Dropdown, Button } from "antd";
import {
  UserOutlined,
  HomeOutlined,
  SettingOutlined,
  LogoutOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { Table, Typography, Tag } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // React Router'dan useNavigate import edildi

const { Header, Sider, Content, Footer } = Layout;

const AppLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    { key: "1", icon: <HomeOutlined />, label: "Servers" },
    { key: "2", icon: <SettingOutlined />, label: "Credentials" },
    { key: "3", icon: <SettingOutlined />, label: "Vcenters" },
  ];

  const handleLogout = () => {
    console.log("Çıkış yapıldı");
  };

  const profileMenu = (
    <Menu>
      <Menu.Item key="1" icon={<UserOutlined />}>Profil</Menu.Item>
      <Menu.Item key="2" icon={<LogoutOutlined />} onClick={handleLogout}>
        Çıkış Yap
      </Menu.Item>
    </Menu>
  );

  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/get-jobs/");
        setJobs(Array.isArray(response.data.data) ? response.data.data : []);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    fetchJobs();
    const interval = setInterval(fetchJobs, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleMenuClick = (key) => {
    if (key === "1") {
      navigate("/"); // Anasayfa'ya yönlendir
    } else if (key === "2") {
      navigate("/credentials"); // Ayarlar sayfasına yönlendir
    }
    else if (key === "3") {
      navigate("/vcenters"); // Ayarlar sayfasına yönlendir
    }
  };

  const columns = [
    { title: "Job ID", dataIndex: "id", key: "id" },
    { title: "Job Name", dataIndex: "name", key: "name" },
    { title: "Status", dataIndex: "status", key: "status", render: (status) => (
        <Tag color={status ? "green" : "red"}>{status}</Tag>
      )
    },
    { title: "Created By", dataIndex: ["created_by", "username"], key: "created_by" },
    { title: "Created At", dataIndex: "created_at", key: "created_at" }
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsed={collapsed}
        onCollapse={setCollapsed}
        breakpoint="md"
        style={{ transition: "width 0.3s ease-in-out", display: collapsed ? "none" : "flex", flexDirection: "column" }}
      >
        
        <div style={{ padding: "16px", textAlign: "center" }}>
          <img src={collapsed ? "/logo-min.png" : "/logo.png" } alt="Logo" style={{ maxWidth: "100%", height: "auto" }} />
        </div>
        <Menu theme="dark" mode="inline" items={menuItems} onClick={(e) => handleMenuClick(e.key)} />        <Menu theme="dark" mode="inline" style={{ position: "absolute", bottom: 0, width: "100%" }}>
          <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
            Çıkış Yap
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout style={{ flex: 1 }}>
        <Header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#fff", width: collapsed ? "100vw" : "calc(100vw - 200px)" }}>
          <Button type="text" icon={collapsed ? <RightOutlined /> : <LeftOutlined />} onClick={() => setCollapsed(!collapsed)} />
          <Dropdown overlay={profileMenu} trigger={["click"]}>
            <Avatar style={{ cursor: "pointer" }} icon={<UserOutlined />} />
          </Dropdown>
        </Header>
        <Content style={{ background: "#fff", minHeight: "calc(100vh - 400px)", width: collapsed ? "100vw" : "calc(100vw - 200px)" }}>
          {children}
        </Content>
      <div style={{ background: "#fff", width: collapsed ? "100vw" : "calc(100vw - 200px)" }}>
        <Table columns={columns}  dataSource={jobs} rowKey="id" pagination={false} />
        </div>
        <Footer style={{ textAlign: "center", background: "#f0f2f5", padding: "10px", width: collapsed ? "100vw" : "calc(100vw - 200px)" }}>
          © {new Date().getFullYear()} Tüm Hakları Saklıdır
        </Footer>
      </Layout>
    </Layout>
  );
};

export default AppLayout;