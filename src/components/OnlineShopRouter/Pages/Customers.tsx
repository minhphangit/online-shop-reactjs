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

export default function Customers({}: Props) {
  const [formInsertCustomer] = Form.useForm();
  const [formUpdateCustomer] = Form.useForm();
  //declare states
  const [open, setOpen] = React.useState(false);
  const [refresh, setRefresh] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState(-1);
  //states get data from Api
  const [customers] = useGetAllData([], "customers", refresh);
  const { errorInsert, insertData } = useInsertData("customers");
  const { errorUpdate, updateData } = useUpdateData("customers");
  const { errorDelete, deleteData } = useDeleteData("customers");

  const onCreateCustomer = async (values: any) => {
    const success = await insertData(values);
    if (success) {
      setRefresh(!refresh);
      message.success("Successfully added customers", 2);
      formInsertCustomer.resetFields();
    } else {
      console.log(errorInsert);
      errorInsert && message.error(errorInsert, 2);
    }
  };
  const onUpdateCustomer = async (values: any) => {
    const success = await updateData(values, selectedId);
    if (success) {
      setOpen(false);
      setRefresh(!refresh);
      message.success("Update Customer successfully", 3);
      formUpdateCustomer.resetFields();
    } else {
      console.log(errorUpdate);
      errorUpdate && message.error(errorUpdate, 2);
    }
  };
  const onDeleteCustomer = async (id: number) => {
    const success = await deleteData(id);
    if (success) {
      setRefresh(!refresh);
      message.success("Delete Customer successfully", 3);
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
                formUpdateCustomer.setFieldsValue(record);
              }}
            >
              Edit
            </Button>
            <Popconfirm
              title="Delete a customer"
              description="Are you sure to delete this customer?"
              icon={<QuestionCircleOutlined style={{ color: "red" }} />}
              onConfirm={() => onDeleteCustomer(record.id)}
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
      <h3 className="text-center">MANAGEMENT CUSTOMERS</h3>
      <Form
        form={formInsertCustomer}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 8 }}
        onFinish={onCreateCustomer}
        name="insertForm"
        layout="horizontal"
        style={{ marginTop: 40 }}
      >
        <h4 className="text-center">CREATE NEW CUSTOMER</h4>
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
            Create new customer
          </Button>
        </Form.Item>
      </Form>

      <Table dataSource={customers} columns={columns} />

      <Modal
        title="Update customer information"
        okText="Update"
        cancelText="Cancle"
        open={open}
        onOk={() => {
          formUpdateCustomer.submit();
        }}
        onCancel={() => {
          setOpen(false);
        }}
      >
        <Divider />
        <Form
          form={formUpdateCustomer}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 8 }}
          onFinish={onUpdateCustomer}
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
