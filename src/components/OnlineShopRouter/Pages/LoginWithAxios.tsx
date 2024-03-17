import React from "react";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Input } from "antd";
import axiosClient from "../configs/axiosClient";

export default function LoginWithAxios() {
  const onFinish = async (values: any) => {
    try {
      const response: any = await axiosClient.post("/auth/login", values);

      if (response.data) {
        alert("Login successful");
        localStorage.setItem("token", response.data.token);
      } else {
        alert("Username or password incorrect");
      }
    } catch (error: any) {
      console.log(error);
      if (error.response.status === 401) {
        alert("Login failed 401");
      }
    }
  };
  return (
    <Form
      name="normal_login"
      className="login-form"
      initialValues={{ remember: true }}
      onFinish={onFinish}
      layout="horizontal"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 6 }}
    >
      <Form.Item
        name="email"
        rules={[{ required: true, message: "Vui lòng nhập email!" }]}
      >
        <Input
          prefix={<UserOutlined className="site-form-item-icon" />}
          placeholder="example@gmail.com"
        />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
      >
        <Input
          prefix={<LockOutlined className="site-form-item-icon" />}
          type="password"
          placeholder="Mật khẩu"
        />
      </Form.Item>
      <Form.Item>
        <Form.Item name="remember" valuePropName="checked" noStyle>
          <Checkbox>Nhớ mật khẩu</Checkbox>
        </Form.Item>

        <a className="login-form-forgot" href="">
          Quên mật khẩu
        </a>
      </Form.Item>

      <Form.Item wrapperCol={{ span: 16 }}>
        <Button type="primary" htmlType="submit" className="login-form-button">
          Đăng nhập
        </Button>
        Or <a href="">Tạo tài khoản!</a>
      </Form.Item>
    </Form>
  );
}
