import React, { useState, useEffect } from 'react';
import { Space, Table, Button, Modal, Form, Input, message, InputNumber } from 'antd';
import axios from 'axios';
import { deleteProductApi, getAllProductApi, createProductApi, updateProductApi } from '../../../api';
import './dashboard.css'
import { useNavigate } from 'react-router-dom';


const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [visibleInsert, setVisibleInsert] = useState(false);
  const [visibleUpdate, setVisibleUpdate] = useState(false);
  const [idUpdate, setIdUpdate] = useState("");
  const [actionType, setActionType] = useState('insert');
  const [formInsert] = Form.useForm();
  const [formUpdate] = Form.useForm();
  const name = localStorage.getItem('name');
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(getAllProductApi);
      if (res.data.success) {
        setProducts(res.data.products);
      } else {
        console.error('Failed to fetch products:', res.data.message);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem("name");
      localStorage.removeItem("email");
      localStorage.removeItem("role");
      localStorage.removeItem("token");
      message.success("Logout success")
      navigate("/login")
    } catch (error) {
      console.log(error);
      message.error("Logout failed")
    }
  }

  const handleView = (record) => {
    Modal.info({
      title: record.name,
      content: (
        <div>
          <p><b>ID:</b> {record.id}</p>
          <img src={record.image} alt={record.name} style={{ maxWidth: '100%', marginBottom: '10px' }} />
          <p><b>Description:</b> {record.description}</p>
          <p><b>Price:</b> {record.price}</p>
          <p><b>Color:</b> {record.color}</p>
        </div>
      ),
      onOk() {},
    });
  };

  const handleInsert = () => {
    setActionType('insert');
    setVisibleInsert(true);
  };

  const handleUpdate = (record) => {
    setIdUpdate(record.id);
    setActionType('update');
    formUpdate.setFieldsValue(record);
    setVisibleUpdate(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(deleteProductApi(id));
      message.success('Product deleted successfully');
      fetchData();
    } catch (error) {
      console.error('Error deleting product:', error);
      message.error('Failed to delete product');
    }
  };

  const handleSubmitInsert = async (values) => {
    try {
      const res = await axios.post(createProductApi, values);
      if (res && res.data.success) {
        fetchData();
        message.success('Product created successfully');
        setVisibleInsert(false);
      } else {
        message.error(res.data.message || 'Failed to perform action');
      }
    } catch (error) {
      console.error('Error:', error);
      message.error('Failed to perform action');
    }
  };

  const handleSubmitUpdate = async (values) => {
    try {
      const res = await axios.put(updateProductApi(idUpdate), values);
      if (res && res.data.success) {
        fetchData();
        message.success('Product updated successfully');
        setVisibleUpdate(false);
      } else {
        message.error(res.data.message || 'Failed to perform action');
      }
    } catch (error) {
      console.error('Error:', error);
      message.error('Failed to perform action');
    }
  };

  const handleCancelInsert = () => {
    setVisibleInsert(false);
  };

  const handleCancelUpdate = () => {
    setVisibleUpdate(false);
  };

  const formLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" onClick={() => handleView(record)}>View</Button>
          <Button type="link" onClick={() => handleUpdate(record)}>Update</Button>git add README.md
          <Button type="link" danger onClick={() => handleDelete(record.id)}>Delete</Button>
        </Space>
      ),
    },
  ];

  return (
    <div className='dashboard'>
      <h2>{name}'s Dashboard</h2>
      <Button className="logout" type="primary" onClick={logout}>Log out</Button>
      <Button className='insertbtn' type="primary" onClick={handleInsert}>Insert Product</Button>
      <Table columns={columns} dataSource={products} />
      <Modal
        title="Insert Product Form"
        visible={visibleInsert}
        onOk={() => formInsert.submit()}
        onCancel={handleCancelInsert}
      >
        <Form {...formLayout} form={formInsert} onFinish={handleSubmitInsert}>
          <Form.Item name="id" label="ID" rules={[{ required: true, message: 'Please input id product!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="image" label="Image" rules={[{ required: true, message: 'Please input image URL product!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Please input name product!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description" rules={[{ required: true, message: 'Please input description product!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="price" label="Price" rules={[{ required: true, message: 'Please input price product!' }]}>
            <InputNumber style={{ width: '100%' }} step={0.01} />
          </Form.Item>
          <Form.Item name="color" label="Color" rules={[{ required: true, message: 'Please input color product!' }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Update Product Form"
        visible={visibleUpdate}
        onOk={() => formUpdate.submit()}
        onCancel={handleCancelUpdate}
      >
        <Form {...formLayout} form={formUpdate} onFinish={handleSubmitUpdate}>
          <Form.Item name="id" label="ID">
            <Input disabled />
          </Form.Item>
          <Form.Item name="image" label="Image">
            <Input />
          </Form.Item>
          <Form.Item name="name" label="Name">
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input />
          </Form.Item>
          <Form.Item name="price" label="Price">
            <InputNumber style={{ width: '100%' }} step={0.01} />
          </Form.Item>
          <Form.Item name="color" label="Color">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Dashboard;
