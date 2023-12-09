import React from "react";
import axiosClient from "../configs/axiosClient";
import { QuestionCircleOutlined } from "@ant-design/icons";
import useGetAllData from "../hooks/useGetAllData";
import useUpdateData from "../hooks/useUpdateData";
import useInsertData from "../hooks/useInsertData";
import useDeleteData from "../hooks/useDeleteData";
import {
  Button,
  Divider,
  Form,
  Input,
  Modal,
  Popconfirm,
  Space,
  Table,
  message,
} from "antd";
type Props = {};

export default function Suppliers({}: Props) {
  const [formInsertSupplier] = Form.useForm();
  const [formUpdateSupplier] = Form.useForm();
  const [open, setOpen] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState(-1);
  const [refresh, setRefresh] = React.useState(false);
  const [suppliers] = useGetAllData([], "suppliers", refresh);
  const { errorInsert, insertData } = useInsertData("suppliers");
  const { errorUpdate, updateData } = useUpdateData("suppliers");
  const { errorDelete, deleteData } = useDeleteData("suppliers");
  const onCreateSupplier = async (values: any) => {
    const success = await insertData(values);
    if (success) {
      setRefresh(!refresh);
      message.success("Successfully added Suppliers", 2);
      formInsertSupplier.resetFields();
    } else {
      console.log(errorInsert);
      errorInsert && message.error(errorInsert, 2);
    }
  };
  const onUpdateSupplier = async (values: any) => {
    const success = await updateData(values, selectedId);
    if (success) {
      setOpen(false);
      setRefresh(!refresh);
      message.success("Update Supplier successfully", 3);
      formUpdateSupplier.resetFields();
    } else {
      console.log(errorUpdate);
      errorUpdate && message.error(errorUpdate, 2);
    }
  };
  const onDeleteSupplier = async (id: number) => {
    const success = await deleteData(id);
    if (success) {
      setRefresh(!refresh);
      message.success("Delete Supplier successfully", 3);
    } else {
      console.log(errorDelete);
      errorDelete && message.error(errorDelete, 2);
    }
  };
  const columns = [
    {
      title: "id",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "name",
      dataIndex: "name",
      key: "name",
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
                formUpdateSupplier.setFieldsValue(record);
              }}
            >
              Edit
            </Button>
            <Popconfirm
              title="Delete a Supplier"
              description="Are you sure to delete this Supplier?"
              icon={<QuestionCircleOutlined style={{ color: "red" }} />}
              onConfirm={() => onDeleteSupplier(record.id)}
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
      <h3 className="text-center">MANAGEMENT SUPPLIERS</h3>
      <Form
        form={formInsertSupplier}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 8 }}
        onFinish={onCreateSupplier}
        name="insertForm"
        layout="horizontal"
        style={{ marginTop: 40 }}
      >
        <h4 className="text-center">CREATE NEW SUPPLIERS</h4>
        <Form.Item
          className="mt-5"
          label="name"
          name="name"
          rules={[
            {
              required: true,
              message: "name cannot be empty",
            },
          ]}
          hasFeedback
        >
          <Input placeholder="Enter a name" />
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

        <Form.Item wrapperCol={{ offset: 8, span: 8 }}>
          <Button type="primary" htmlType="submit">
            Create new Supplier
          </Button>
        </Form.Item>
      </Form>
      <Table dataSource={suppliers} columns={columns} />
      <Modal
        title="Update Supplier information"
        okText="Update"
        cancelText="Cancle"
        open={open}
        onOk={() => {
          formUpdateSupplier.submit();
        }}
        onCancel={() => {
          setOpen(false);
        }}
      >
        <Divider />
        <Form
          form={formUpdateSupplier}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 8 }}
          onFinish={onUpdateSupplier}
          name="insertForm"
          layout="horizontal"
          style={{ marginTop: 40 }}
        >
          <Form.Item
            className="mt-5"
            label="name"
            name="name"
            rules={[
              {
                required: true,
                message: "name cannot be empty",
              },
            ]}
            hasFeedback
          >
            <Input placeholder="Enter a name" />
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
        </Form>
      </Modal>
    </div>
  );
}
