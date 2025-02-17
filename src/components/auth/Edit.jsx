import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Form, Input, Button, Card } from "antd";
import "./Edit.css"; // CSS dosyasını dahil ettik

const Edit = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const product = location.state?.product;

  const [formData, setFormData] = useState({
    title: product?.title || "",
    description: product?.description || "",
    price: product?.price || "",
    category: product?.category || "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    console.log("Güncellenmiş Ürün Bilgileri:", formData);
    alert("Ürün bilgileri güncellendi!");
    navigate(-1);
  };

  return (
    <div className="edit-container">
      <Card title="Ürün Düzenleme" className="edit-card">
        <Form layout="vertical" className="edit-form">
          <Form.Item label="Ürün Adı">
            <Input name="title" value={formData.title} onChange={handleChange} />
          </Form.Item>

          <Form.Item label="Açıklama">
            <Input.TextArea name="description" value={formData.description} onChange={handleChange} />
          </Form.Item>

          <Form.Item label="Fiyat">
            <Input name="price" type="number" value={formData.price} onChange={handleChange} />
          </Form.Item>

          <Form.Item label="Kategori">
            <Input name="category" value={formData.category} onChange={handleChange} />
          </Form.Item>

          <div className="edit-buttons">
            <Button type="primary" onClick={handleSave}>Kaydet</Button>
            <Button onClick={() => navigate(-1)}>İptal</Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Edit;
