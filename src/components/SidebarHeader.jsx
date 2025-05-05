import React, { useEffect, useState } from "react";
import { Layout, Menu, Avatar, Dropdown, Button } from "antd";
import {
  UserOutlined,
  HomeOutlined,
  SettingOutlined,
  LogoutOutlined,
  LeftOutlined,
  RightOutlined,
  CloudServerOutlined,
  HistoryOutlined,
  LinuxOutlined,
  WindowsOutlined,
  AppleOutlined,
  KeyOutlined,
  GlobalOutlined,
  AppstoreAddOutlined,
  DeleteOutlined,
  DatabaseOutlined
} from "@ant-design/icons";
import { Table, Typography, Tag } from "antd";
import logo from '../assets/logo.png';
import axios from "axios";
import { useNavigate } from "react-router-dom"; // React Router'dan useNavigate import edildi

const { Header, Sider, Content, Footer } = Layout;

const AppLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();


const menuItems = [
  {
    icon: <HomeOutlined />,
    label: "Servers",
    children: [
      {key: "1", label: "All", icon: <GlobalOutlined />},
      {
        key: "1-1",
        label: "Virtual",
        children: [
          { key: "1-1", label: "All", icon: <GlobalOutlined /> },
          { key: "1-1-1", label: "Windows", icon: <WindowsOutlined /> },
          { key: "1-1-2", label: "Unix", icon: <LinuxOutlined /> },
          { key: "1-1-3", label: "Mac", icon: <AppleOutlined /> },
        ],
      },
      {
        key: "1-2",
        label: "Physical",
        children: [
          { key: "1-2-4", label: "New Server", icon: <AppstoreAddOutlined /> },
          { key: "1-2", label: "All", icon: <GlobalOutlined /> },
          { key: "1-2-1", label: "Windows", icon: <WindowsOutlined /> },
          { key: "1-2-2", label: "Unix", icon: <LinuxOutlined /> },
          { key: "1-2-3", label: "Mac", icon: <AppleOutlined /> },
          
        ],
      },
      {
        key: "1-3",
        label: "Esxi Hosts",
        children: [
          {key: "1-3-1", label: "Esxi List", icon: <DatabaseOutlined />}
        ]
      },
    ],
  },
  {
    icon: <SettingOutlined />,
    label: "Settings",
    children: [
      { key: "2-1", icon: <KeyOutlined />, label: "Credentials" },
      { key: "2-2", icon: <CloudServerOutlined />, label: "vCenters" },
    ]
  },
  {
    icon: <CloudServerOutlined />,
    label: "vCenter Operations",
    children: [
       { key: "3-1", icon: <HistoryOutlined />, label: "Snapshots"},
       { key: "3-2", icon: <DeleteOutlined />, label: "Deleted Servers"}
    ] 
  }
];


  const handleLogout = () => {
    console.log("Çıkış yapıldı");
    localStorage.clear();
    window.location.href = '/login';
  };

  const profileMenu = (
    <Menu>
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
    switch (key) {
      case "1":
        navigate("/servers");
        break;
      case "1-1":
        navigate("/servers/virtual/all");
        break;
      case "1-1-1":
        navigate("/servers/virtual/windows");
        break;
      case "1-1-2":
        navigate("/servers/virtual/unix");
        break;
      case "1-1-3":
        navigate("/servers/virtual/mac");
        break;
      case "1-2":
        navigate("/servers/physical/all");
        break;
      case "1-2-1":
        navigate("/servers/physical/windows");
        break;
      case "1-2-2":
        navigate("/servers/physical/unix");
        break;
      case "1-2-3":
        navigate("/servers/physical/mac");
        break;
      case "1-2-4":
        navigate("/servers/physical/add");
        break;
      case "1-3":
        navigate("/servers/esxi");
        break;
      case "1-3-1":
        navigate("/servers/esxi");
        break;
      case "2-1":
        navigate("/credentials");
        break;
      case "2-2":
        navigate("/vcenters");
        break;
      case "3-1":
        navigate("/vcenter/snapshots");
        break;
      case "3-2":
        navigate("/vcenter/deleted");
        break;
      default:
        break;
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
      width={250}
        collapsed={collapsed}
        onCollapse={setCollapsed}
        breakpoint="md"
        style={{ transition: "width 0.3s ease-in-out", display: collapsed ? "none" : "flex", flexDirection: "column" }}
      >
        
        <div style={{ padding: "16px", textAlign: "center" }}>
          <img src={logo } alt="Logo" style={{ maxWidth: "100%", height: "auto" }} />
        </div>
        <Menu theme="dark" mode="inline" items={menuItems} onClick={(e) => handleMenuClick(e.key)} />        <Menu theme="dark" mode="inline" style={{ position: "absolute", bottom: 0, width: "100%" }}>
          <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
            Çıkış Yap
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout style={{ flex: 1 }}>
        <Header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#fff", width: collapsed ? "100vw" : "calc(100vw - 270px)" }}>
          <Button type="text" icon={collapsed ? <RightOutlined /> : <LeftOutlined />} onClick={() => setCollapsed(!collapsed)} />
          <Dropdown overlay={profileMenu} trigger={["click"]}>
            <Avatar style={{ cursor: "pointer" }} icon={<UserOutlined />} />
          </Dropdown>
        </Header>
        <Content style={{ background: "#fff", minHeight: "calc(100vh - 400px)", width: collapsed ? "100vw" : "calc(100vw - 270px)" }}>
          {children}
        </Content>
      <div style={{ background: "#fff", width: collapsed ? "100vw" : "calc(100vw - 270px)"}}>
        <Table columns={columns}  dataSource={jobs} rowKey="id" pagination={false}  />
        </div>
        <Footer style={{ textAlign: "center", background: "#f0f2f5", padding: "10px", width: collapsed ? "100vw" : "calc(100vw - 270px)" }}>
          © {new Date().getFullYear()} Tüm Hakları Saklıdır
        </Footer>
      </Layout>
    </Layout>
  );
};

export default AppLayout;