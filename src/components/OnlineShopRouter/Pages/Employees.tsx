import React from "react";
import {
  Table,
  Form,
  DatePicker,
  message,
  Button,
  Space,
  Popconfirm,
  Input,
  InputNumber,
  Select,
  Modal,
  Divider,
} from "antd";
import axiosClient from "../configs/axiosClient";

import { QuestionCircleOutlined } from "@ant-design/icons";
import useGetAllData from "../hooks/useGetAllData";
import useUpdateData from "../hooks/useUpdateData";
import useInsertData from "../hooks/useInsertData";
import useDeleteData from "../hooks/useDeleteData";
import moment from "moment";
import dayjs, { Dayjs } from "dayjs";
type Props = {};

export default function Employees({}: Props) {
  const [formInsertEmployee] = Form.useForm();
  const [formUpdateEmployee] = Form.useForm();
  //declare states
  const [open, setOpen] = React.useState(false);
  const [refresh, setRefresh] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState(-1);
  //states get data from Api
  const [Employees] = useGetAllData([], "employees", refresh);
  const { errorInsert, insertData } = useInsertData("employees");
  const { errorUpdate, updateData } = useUpdateData("employees");
  const { errorDelete, deleteData } = useDeleteData("employees");

  const onCreateEmployee = async (values: any) => {
    const success = await insertData(values);
    if (success) {
      setRefresh(!refresh);
      message.success("Successfully added Employees", 2);
      formInsertEmployee.resetFields();
    } else {
      console.log(errorInsert);
      errorInsert && message.error(errorInsert, 2);
    }
  };
  const onUpdateEmployee = async (values: any) => {
    const success = await updateData(values, selectedId);
    if (success) {
      setOpen(false);
      setRefresh(!refresh);
      message.success("Update Employee successfully", 3);
      formUpdateEmployee.resetFields();
    } else {
      console.log(errorUpdate);
      errorUpdate && message.error(errorUpdate, 2);
    }
  };
  const onDeleteEmployee = async (id: number) => {
    const success = await deleteData(id);
    if (success) {
      setRefresh(!refresh);
      message.success("Delete Employee successfully", 3);
    } else {
      console.log(errorDelete);
      errorDelete && message.error(errorDelete, 2);
    }
  };

  const columns: any = [
    {
      title: "id",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "firstName",
      dataIndex: "firstName",
      key: "firstName",
    },
    {
      title: "lastName",
      dataIndex: "lastName",
      key: "lastName",
    },
    {
      title: "email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "phoneNumber",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "birthday",
      dataIndex: "birthday",
      key: "birthday",
      render: (text: any, record: any, index: number) => {
        const date = dayjs(text);
        return <span>{date.format("DD/MM/YYYY")}</span>;
      },
    },
    {
      title: "action",
      dataIndex: "action",
      key: "action",
      render: (text: any, record: any, index: number) => {
        return (
          <Space>
            <Button
              type="primary"
              onClick={() => {
                setOpen(true);
                setSelectedId(record.id);
                formUpdateEmployee.setFieldsValue(record);
              }}
            >
              Edit
            </Button>
            <Popconfirm
              title="Delete a Employee"
              description="Are you sure to delete this Employee?"
              icon={<QuestionCircleOutlined style={{ color: "red" }} />}
              onConfirm={() => onDeleteEmployee(record.id)}
            >
              <Button type="primary" danger>
                Delete
              </Button>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];
  return (
    <div>
      <h3 className="text-center">MANAGEMENT EMPLOYEES</h3>
      <Form
        form={formInsertEmployee}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 8 }}
        onFinish={onCreateEmployee}
        name="insertForm"
        layout="horizontal"
        style={{ marginTop: 40 }}
      >
        <h4 className="text-center">CREATE NEW EMPLOYEE</h4>
        <Form.Item
          className="mt-5"
          label="firstName"
          name="firstName"
          rules={[
            {
              required: true,
              message: "firstName cannot be empty",
            },
          ]}
          hasFeedback
        >
          <Input placeholder="Enter a firstName" />
        </Form.Item>

        <Form.Item
          className="mt-5"
          label="lastName"
          name="lastName"
          rules={[
            {
              required: true,
              message: "lastName cannot be empty",
            },
          ]}
          hasFeedback
        >
          <Input placeholder="Enter a lastName" />
        </Form.Item>

        <Form.Item
          className="mt-5"
          label="email"
          name="email"
          rules={[
            {
              required: true,
              message: "email cannot be empty",
            },
            {
              type: "email",
              message: "Please enter a valid email",
            },
          ]}
          hasFeedback
        >
          <Input placeholder="Enter a email" />
        </Form.Item>

        <Form.Item
          className="mt-5"
          label="address"
          name="address"
          rules={[
            {
              required: true,
              message: "address cannot be empty",
            },
          ]}
          hasFeedback
        >
          <Input placeholder="Enter a address" />
        </Form.Item>

        <Form.Item
          name="phoneNumber"
          label="Phone Number"
          rules={[
            { required: true, message: "Please input your phone number!" },
          ]}
        >
          <Input placeholder="Enter a phone number" />
        </Form.Item>

        <Form.Item className="mt-5" label="birthday" name="birthday">
          <DatePicker format="DD/MM/YYYY" />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 8 }}>
          <Button type="primary" htmlType="submit">
            Create new Employee
          </Button>
        </Form.Item>
      </Form>

      <Table dataSource={Employees} columns={columns} />

      <Modal
        title="Update Employee information"
        okText="Update"
        cancelText="Cancle"
        open={open}
        onOk={() => {
          formUpdateEmployee.submit();
        }}
        onCancel={() => {
          setOpen(false);
        }}
      >
        <Divider />
        <Form
          form={formUpdateEmployee}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 8 }}
          onFinish={onUpdateEmployee}
          name="insertForm"
          layout="horizontal"
          style={{ marginTop: 40 }}
        >
          <Form.Item
            className="mt-5"
            label="firstName"
            name="firstName"
            rules={[
              {
                required: true,
                message: "firstName cannot be empty",
              },
            ]}
            hasFeedback
          >
            <Input placeholder="Enter a firstName" />
          </Form.Item>

          <Form.Item
            className="mt-5"
            label="lastName"
            name="lastName"
            rules={[
              {
                required: true,
                message: "lastName cannot be empty",
              },
            ]}
            hasFeedback
          >
            <Input placeholder="Enter a lastName" />
          </Form.Item>

          <Form.Item
            className="mt-5"
            label="email"
            name="email"
            rules={[
              {
                required: true,
                message: "email cannot be empty",
              },
              {
                type: "email",
                message: "Please enter a valid email",
              },
            ]}
            hasFeedback
          >
            <Input placeholder="Enter a email" />
          </Form.Item>

          <Form.Item
            className="mt-5"
            label="address"
            name="address"
            rules={[
              {
                required: true,
                message: "address cannot be empty",
              },
            ]}
            hasFeedback
          >
            <Input placeholder="Enter a address" />
          </Form.Item>

          <Form.Item
            name="phoneNumber"
            label="Phone Number"
            rules={[
              { required: true, message: "Please input your phone number!" },
            ]}
          >
            <Input placeholder="Enter a phone number" />
          </Form.Item>
          <Form.Item
            name="birthday"
            label="Date of Birth"
            rules={[
              {
                required: true,
                message: "Date of Birth field required!",
              },
            ]}
            getValueProps={(e: string) => ({
              value: e ? dayjs(e) : "",
            })}
          >
            <DatePicker format="DD/MM/YYYY" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
