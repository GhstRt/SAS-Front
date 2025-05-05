import React, { useState, useEffect, useRef } from "react";
import { Table, Button, Input, Modal, Checkbox, Space } from "antd";
import { EyeOutlined, InfoCircleOutlined, FilterOutlined, SearchOutlined } from "@ant-design/icons";
import axios from "axios";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const DeletedTable = () => {
    const [servers, setServers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingKey, setEditingKey] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const [filteredData, setFilteredData] = useState(servers); // Başlangıçta tüm veri

    useEffect(() => {
        fetchServers();
    }, []);

    const fetchServers = async () => {
        try {
            const response = await axios.get(`https://cloudsamapi.fw.dteknoloji.com.tr/api/get-deleted-servers/`);
            if (response.data.status.code === 0) {
                const formattedData = response.data.data.map((item) => ({
                    key: item.id,
                    ...item.data,
                }));
                setServers(formattedData);
                setFilteredData(formattedData);
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

    const exportToExcel = () => {
        const dataToExport = filteredData.length > 0 ? filteredData : servers;
        const cleanedData = dataToExport.map(({ key, ...item }) => item); // key'i çıkar

        const worksheet = XLSX.utils.json_to_sheet(cleanedData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sunucular");

        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(blob, "silinenler_listesi.xlsx");
    };

    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };

    const handleTableChange = (pagination, filters, sorter, extra) => {
        // extra.currentDataSource -> görünen veri (filtrelenmiş ve sıralanmış)
        setFilteredData(extra.currentDataSource);
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

    const excludedKeys = ["VM_MO_ID", "VCENTER_URL", "VCENTER_ID", "RESOURCE_TYPE", "key", "CONSOLE_IP"]; // tabloya eklenmeyecek alanlar

    let columns = Object.keys(servers[0] || {}).filter((key) => !excludedKeys.includes(key)).map((key) => ({
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
                    onChange={handleTableChange}
                    pagination={{
                        showSizeChanger: true,
                        pageSizeOptions: ["5", "10", "20", "50"],
                        defaultPageSize: 10,
                        showQuickJumper: true,
                    }}
                    scroll={{ x: "max-content" }}
                />
                {/* Tablo sonrası özet kutusu */}
                <div style={{ marginTop: 16, textAlign: "left", fontWeight: "bold", fontSize: "16px" }}>
                    {
                        (() => {
                            const totalCore = filteredData.reduce((sum, item) => sum + (Number(item.CORE) || 0), 0);
                            const totalMemory = filteredData.reduce((sum, item) => sum + (Number(item.MEMORY) || 0), 0);
                            const totalDisk = filteredData.reduce((sum, item) => sum + (Number(item.TOTAL_DISK) || 0), 0);
                            return (
                                <div>
                                    Total Core: {totalCore} | Total Memory: {totalMemory} GB | Total Disk: {totalDisk} GB
                                </div>
                            );
                        })()
                    }
                </div>

            </div>
        </div>
    );
};

export default DeletedTable;
