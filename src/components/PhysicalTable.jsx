import React, { useState, useEffect, useRef } from "react";
import { Table, Button, Input, Modal, Checkbox, Space } from "antd";
import { useNavigate } from "react-router-dom";
import { EyeOutlined, InfoCircleOutlined, FilterOutlined, SearchOutlined } from "@ant-design/icons";
import { useParams } from "react-router-dom";
import axios from "axios";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const PhysicalTable = () => {
    const { type, os } = useParams(); // URL'den parametreleri al
    const [servers, setServers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingKey, setEditingKey] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const [filteredData, setFilteredData] = useState([]);

    useEffect(() => {
        fetchServers();
    }, [os]);

    const fetchServers = async () => {
        try {
            let response = "";
            if (os === undefined) {
                response = await axios.get(`http://127.0.0.1:8000/api/get-servers-by-filter/physical/all/`);
            }
            else {
                response = await axios.get(`http://127.0.0.1:8000/api/get-servers-by-filter/physical/${os}/`);
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

    const exportToExcel = () => {
        const dataToExport = filteredData.length > 0 ? filteredData : servers;
        const cleanedData = dataToExport.map(({ key, ...item }) => item); // key'i çıkar
      
        const worksheet = XLSX.utils.json_to_sheet(cleanedData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sunucular");
      
        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(blob, "fiziksel_sunucu_listesi.xlsx");
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
        console.log(record)
        try {
            // Güncellenecek veriyi hazırlıyoruz
            const updatedData = {
                TYPE: record.TYPE,  // Örneğin, isim alanı varsa
                BRAND: record.BRAND, // Örneğin, durum bilgisi
                SERVER_NAME: record.SERVER_NAME,
                SERIAL_NO: record.SERIAL_NO,
                LOCATION: record.LOCATION,
                COMPANY: record.COMPANY,
                MODEL: record.MODEL,
                CPU_MODEL: record.CPU_MODEL,
                TOTAL_CPU: record.TOTAL_CPU,
                TOTAL_CORE: record.TOTAL_CORE,
                RAM: record.RAM,
                CAPACITY: record.CAPACITY,
                SUPPORT_EXPIRE: record.SUPPORT_EXPIRE,
                USAGE: record.USAGE,
                SUPPORT: record.SUPPORT,
                MANAGEMENT: record.MANAGEMENT,
                NOTE: record.NOTE,
                SERVER_IP: record.SERVER_IP,
                ILO_IP: record.ILO_IP,
                CABINET_NO: record.CABINET_NO,
                RACK_NO: record.RACK_NO,
                DESCRIPTION: record.DESCRIPTION// Örneğin, IP adresi varsa
                // Diğer güncellenmesi gereken alanlar
            };

            const response = await axios.patch(`http://127.0.0.1:8000/api/update-server/${record.key}/`, updatedData, {
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

    const handleChange = (key, dataIndex, value) => {
        const newData = servers.map((item) => {
            if (item.key === key) {
                return { ...item, [dataIndex]: value };
            }
            return item;
        });
        setServers(newData);
    };


    let columns = Object.keys(servers[0] || {}).map((key) => ({
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

    columns = columns.sort((a, b) => (a.key === "USAGE" ? -1 : b.key === "USAGE" ? 1 : 0));

    columns = columns.map((col) =>
        col.key === "USAGE" ? { ...col, fixed: "left" } : col
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
            </div>
        ),
    });

    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "20vh", width: "100%" }}>
            <div style={{ maxWidth: "95%", width: "100vw", background: "#fff", padding: "20px", borderRadius: "8px", boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)" }}>
                <div style={{ marginBottom: 16, textAlign: "right" }}>
                    <Button type="primary" onClick={exportToExcel}>
                        Excel'e Aktar
                    </Button>
                </div>
                <Table
                    columns={columns}
                    dataSource={servers}
                    loading={loading}
                    size="small"
                    onChange={(pagination, filters, sorter, extra) => {
                        setFilteredData(extra.currentDataSource); // filtrelenmiş ve sıralanmış veri
                      }}
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

export default PhysicalTable;
