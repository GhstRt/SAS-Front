import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Card, Typography, Table, Button } from "antd";

const VcenterDetail = () => {
  const { uuid } = useParams();
  const [vcenterData, setVcenterData] = useState(null);
  const [datacenters, setDatacenters] = useState([]);
  const [clusters, setClusters] = useState([]);
  const [datastores, setDatastores] = useState([]);
  const [esxi, setEsxi] = useState([]);

  useEffect(() => {
    const fetchVCenterData = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/get-vcenter/${uuid}/`);
        setVcenterData(response.data.data);
        setClusters(response.data.data.data.clusters || []);  // Eğer null/undefined gelirse boş array ata
        setDatacenters(response.data.data.data.datacenters || []);
        setEsxi(response.data.data.data.esxi || []);
        setDatastores(response.data.data.data.datastores || []);
      } catch (error) {
        console.error("Error fetching vCenter data:", error);
      }
    };
    fetchVCenterData();
  }, [uuid]);

  const handleExplore = async (record, type) => {
    try {
      const response = await axios.post(`http://localhost:8000/api/explore-${type}/`, { record });
      console.log("Explore response:", response.data);
    } catch (error) {
      console.error("Error exploring:", error);
    }
  };

  const handleExploreDcForCluster = async (record) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/explore-clusters-from-dc/${vcenterData.id}/${record.dc_id}/`, { record });
      console.log("Explore response:", response.data);
    } catch (error) {
      console.error("Error exploring:", error);
    }
  };

  const handleExploreClusterForEsxi = async (record) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/explore-esxi-from-cluster/${vcenterData.id}/${record.cl_id}/`, { record });
      console.log("Explore response:", response.data);
    } catch (error) {
      console.error("Error exploring:", error);
    }
  };

  const handleExploreClusterForVM = async (record) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/explore-vms-from-cluster/${vcenterData.id}/${record.cl_id}/`, { record });
      console.log("Explore response:", response.data);
    } catch (error) {
      console.error("Error exploring:", error);
    }
  };

  const handleExploreClusterForDatastore = async (record) => {
    try {
      const response = await axios.post(`http://localhost:8000/api/explore-cls-for-ds/${vcenterData.id}/${record.cl_id}/`, { record });
      console.log("Explore response:", response.data);
    } catch (error) {
      console.error("Error exploring:", error);
    }
  };

  if (!vcenterData) return <p>Loading...</p>;

  const columnsWithActions = (columns, type) => [
    ...columns,
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      render: (_, record) => (
        <>
          <Button type="link" onClick={() => console.log("Edit", record)}>Düzenle</Button>
          <Button type="link" onClick={() => handleExplore(record, type)}>Keşfet</Button>
        </>
      ),
    },
  ];

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "20vh", width: "100%" }}>
      <div style={{ maxWidth: "95%", width: "100vw", background: "#fff", padding: "20px", borderRadius: "8px", boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)" }}>
        <div className="p-4 space-y-6">
          <Card title="VCenter Bilgileri">
            <Typography><strong>Ad:</strong> {vcenterData.name}</Typography>
            <Typography><strong>URL:</strong> {vcenterData.url}</Typography>
            <Typography><strong>IP:</strong> {vcenterData.ip}</Typography>
            <Typography><strong>Port:</strong> {vcenterData.port}</Typography>
          </Card>

          <Table
            title={() => "Datacenters"}
            columns={[
              { title: "Datacenter ID", dataIndex: "dc_id", key: "dc_id" },
              { title: "Datacenter Name", dataIndex: "dc_name", key: "dc_name" },
              {
                title: "Actions",
                dataIndex: "actions",
                key: "actions",
                render: (_, record) => (
                  <>
                    <Button type="link" onClick={() => console.log("Edit", record)}>Düzenle</Button>
                    <Button type="link" onClick={() => handleExploreDcForCluster(record)}>Keşfet</Button>
                  </>
                ),
              },
            ]}
            dataSource={datacenters}
            rowKey="dc_id"
          />

          <Table
            title={() => "Clusters"}
            columns={[
              { title: "Cluster ID", dataIndex: "cl_id", key: "cl_id" },
              { title: "Cluster Name", dataIndex: "cl_name", key: "cl_name" },
              { title: "Host Count", dataIndex: "cl_host_count", key: "cl_host_count" },
              { title: "Total CPU", dataIndex: "cl_total_cpu", key: "cl_total_cpu" },
              { title: "Total RAM", dataIndex: "cl_total_mem", key: "cl_total_mem" },
              {
                title: "Actions",
                dataIndex: "actions",
                key: "actions",
                render: (_, record) => (
                  <>
                    <Button type="link" onClick={() => handleExploreClusterForEsxi(record)}>ESXI Keşfet</Button>
                    <Button type="link" onClick={() => handleExploreClusterForVM(record)}>VM Keşfet</Button>
                    <Button type="link" onClick={() => handleExploreClusterForDatastore(record)}>Datastore Keşfet</Button>
                  </>
                ),
              },
            ]}
            dataSource={clusters.flat()}
            rowKey="cl_id"
          />

          <Table
            title={() => "ESXi Hosts"}
            columns={columnsWithActions([
              { title: "ESXi Name", dataIndex: "esxi_name", key: "esxi_name" },
              { title: "Model", dataIndex: "esxi_model", key: "esxi_model" },
              { title: "CPU Model", dataIndex: ["esxi_cpu", "model"], key: "cpu_model" },
              { title: "Cores", dataIndex: ["esxi_cpu", "cores"], key: "cores" },
              { title: "Threads", dataIndex: ["esxi_cpu", "threads"], key: "threads" },
              { title: "Memory (GB)", dataIndex: ["esxi_memory", "total"], key: "memory" },
            ], "esxi")}
            dataSource={esxi.flat()}
            rowKey="esxi_name"
          />

          <Table
            title={() => "Datastores"}
            columns={columnsWithActions([
              { title: "Datastore Name", dataIndex: "ds_name", key: "ds_name" },
              { title: "Capacity (GB)", dataIndex: "ds_capacity_gb", key: "ds_capacity_gb" },
              { title: "Free Space (GB)", dataIndex: "ds_free_space_gb", key: "ds_free_space_gb" },
            ], "datastore")}
            dataSource={datastores.flat()}
            rowKey="ds_name"
          />
        </div>
      </div>
    </div>
  );
};

export default VcenterDetail;
