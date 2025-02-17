import React, { useState } from "react";
import { Layout, Menu, Avatar, Dropdown, Button } from "antd";
import {
  UserOutlined,
  HomeOutlined,
  SettingOutlined,
  LogoutOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";

const { Header, Sider, Content, Footer } = Layout;

const AppLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { key: "1", icon: <HomeOutlined />, label: "Anasayfa" },
    { key: "2", icon: <SettingOutlined />, label: "Ayarlar" },
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
        <Menu theme="dark" mode="inline" items={menuItems} style={{ marginTop: "16px" }} />
        <Menu theme="dark" mode="inline" style={{ position: "absolute", bottom: 0, width: "100%" }}>
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
        <Content style={{ background: "#fff", minHeight: "calc(100vh - 128px)", width: collapsed ? "100vw" : "calc(100vw - 200px)" }}>
          {children}
        </Content>
        <Footer style={{ textAlign: "center", background: "#f0f2f5", padding: "10px", width: collapsed ? "100vw" : "calc(100vw - 200px)" }}>
          © {new Date().getFullYear()} Tüm Hakları Saklıdır
        </Footer>
      </Layout>
    </Layout>
  );
};

export default AppLayout;