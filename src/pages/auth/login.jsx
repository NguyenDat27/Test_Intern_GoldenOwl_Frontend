import React from 'react';
import { Button, Checkbox, Form, Input, message } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { loginApi } from '../../../api';
import './login.css'

const Login = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const handleSubmit = async (values) => {
        try {
            const res = await axios.post(loginApi, values);
            if (res && res.data.success) {
                localStorage.setItem("name", res.data.user.name);
                localStorage.setItem("email", res.data.user.email);
                localStorage.setItem("role", res.data.user.role);
                localStorage.setItem("token", res.data.token);
                if (res.data.user.role === 1) {
                    message.success("Hello admin");
                    navigate("/dashboard");
                } else {
                    message.success(`Hello user: ${res.data.user.name}`);
                    navigate("/");
                }
            } else {
                message.error(res.data.message)
            }
        } catch(error) {
            console.log(error);
            message.error("Login failed")
        }
    };

    return (
        <div className="login">
            <Form
                form={form}
                name="basic"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                style={{ maxWidth: 600 }}
                onFinish={handleSubmit}
                autoComplete="off"
            >
                <h2>Sign In</h2>
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

                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                    <Button type="primary" htmlType="submit">
                        Sign In
                    </Button>
                </Form.Item>
                <p style={{ textAlign: 'center' }}>
                    Do not have an account? <a href="/register">Sign Up</a>
                </p>
            </Form>
        </div>
    )
}

export default Login;
