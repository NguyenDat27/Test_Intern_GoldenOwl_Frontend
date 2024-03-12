import React from 'react';
import { Button, Form, Input, message } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { registerApi } from '../../../api';
import './register.css'

const Register = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const validateConfirmPassword = async (_, value) => {
        const password = form.getFieldValue('password');
        if (value && value !== password) {
            throw new Error('Password and Confirm Password do not match!');
        }
    };

    const handleSubmit = async (values) => {
        try {
            const res = await axios.post(registerApi, values);
            if (res && res.data.success) {
                localStorage.setItem("name", res.data.user.name);
                localStorage.setItem("email", res.data.user.email);
                localStorage.setItem("role", res.data.user.role);
                localStorage.setItem("token", res.data.token);
                message.success(`Congratulations ${res.data.user.name} on successfully creating an account`);
                navigate("/");
            } else {
                message.error(res.data.message)
            }
        } catch(error) {
            console.log(error);
            message.error("Error")
        }
    };

    return (
        <div className="register">
            <Form
                form={form}
                name="basic"
                labelCol={{ span: 10 }}
                wrapperCol={{ span: 16 }}
                style={{ maxWidth: 600 }}
                onFinish={handleSubmit}
                autoComplete="off"
            >
                <h2>Sign Up</h2>
                <Form.Item
                    label="Name"
                    name="name"
                    rules={[{ required: true, message: 'Please input your name!' }]}
                >
                    <Input/>
                </Form.Item>
                
                <Form.Item
                    label="Email"
                    name="email"
                    rules={[{ required: true, message: 'Please input your email!' }]}
                >
                    <Input/>
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                    rules={[{ required: true, message: 'Please input your password!' }]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    label="Confirm Password"
                    name="confirmpassword"
                    rules={[
                        { required: true, message: 'Please input your confirm password!' },
                        { validator: validateConfirmPassword }
                    ]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                    <Button type="primary" htmlType="submit">
                        Sign Up
                    </Button>
                </Form.Item>
                <p style={{ textAlign: 'center' }}>
                    Do you already have an account? <a href="/login">Sign In</a>
                </p>
            </Form>
        </div>
    )
}

export default Register;
