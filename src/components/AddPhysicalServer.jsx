import React from "react";
import { Form, Input, Button, DatePicker, Row, Col, message  } from "antd";
import axios from "axios";
import dayjs from "dayjs"; // Tarihi formatlamak için

const { TextArea } = Input;

const AddPhysicalServer = () => {
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      const payload = {
        type: values.type,       // type id (FK)
        
        brand: values.brand,
        serverName: values.serverName,
        serialNo: values.serialNo,
        location: values.location,
        company: values.company,
        model: values.model,
        cpuModel: values.cpuModel,
        totalCpu: values.totalCpu,
        totalCore: values.totalCore,
        ram: values.ram,
        capacity: values.capacity,
        supportExpire: dayjs(values.supportExpire).format("YYYY-MM-DD"),
        usage: values.usage,
        support: values.support,
        management: values.management,
        note: values.note,
        serverIp: values.serverIp,
        iloIp: values.iloIp,
        kabinNo: values.kabinNo,
        rackNo: values.rackNo,
        description: values.description,
      };

      const response = await axios.post("http://localhost:8000/api/create-server/", payload);

      if (response.status === 201) {
        message.success("Sunucu başarıyla eklendi!");
        form.resetFields();
      }
    } catch (error) {
      console.error(error);
      message.error("Bir hata oluştu, lütfen tekrar deneyin.");
    }
    }

  // Her satırda 2 alan olacak şekilde düzenliyoruz
  const formItemLayout = {
    labelCol: { span: 24 },
    wrapperCol: { span: 24 },
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      style={{ maxWidth: 1000, margin: "0 auto", padding: 24, background: "#fff", borderRadius: 8 }}
    >
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name="type" label="Type" {...formItemLayout} rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item name="brand" label="Brand" {...formItemLayout} rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item name="serverName" label="Server Name" {...formItemLayout} rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item name="serialNo" label="Serial No" {...formItemLayout} rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item name="location" label="Location" {...formItemLayout} rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item name="company" label="Company" {...formItemLayout} rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item name="model" label="Model" {...formItemLayout} rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item name="cpuModel" label="CPU Model" {...formItemLayout} rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item name="totalCpu" label="Total CPU" {...formItemLayout} rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item name="totalCore" label="Total Core" {...formItemLayout} rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item name="ram" label="RAM (GB)" {...formItemLayout} rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item name="capacity" label="Capacity (TiB)" {...formItemLayout} rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item name="supportExpire" label="Support Expire" {...formItemLayout} rules={[{ required: true }]}>
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item name="usage" label="Usage" {...formItemLayout} rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item name="support" label="Support" {...formItemLayout} rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item name="management" label="Management" {...formItemLayout} rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item name="note" label="Note" {...formItemLayout} rules={[{ required: true }]}>
            <TextArea rows={2} />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item name="serverIp" label="Server IP" {...formItemLayout} rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item name="iloIp" label="ILO IP" {...formItemLayout} rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item name="kabinNo" label="Kabin No" {...formItemLayout} rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item name="rackNo" label="Rack No" {...formItemLayout} rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item name="description" label="Description" {...formItemLayout} rules={[{ required: true }]}>
            <TextArea rows={3} />
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Kaydet
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default AddPhysicalServer;
