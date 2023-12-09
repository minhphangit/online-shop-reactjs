import React from "react";
import axiosClient from "../configs/axiosClient";
import {
  Button,
  Form,
  Input,
  Modal,
  Popconfirm,
  Space,
  Table,
  message,
} from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import useGetAllData from "../hooks/useGetAllData";
import useUpdateData from "../hooks/useUpdateData";
import useInsertData from "../hooks/useInsertData";
import useDeleteData from "../hooks/useDeleteData";
type Props = {};

export default function Categories({}: Props) {
  const [form] = Form.useForm();
  const [formUpdateCate] = Form.useForm();
  //declare states
  const [refresh, setRefresh] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState(-1);
  //using hooks
  const [categories] = useGetAllData([], "categories", refresh);
  const { errorInsert, insertData } = useInsertData("categories");
  const { errorUpdate, updateData } = useUpdateData("categories");
  const { errorDelete, deleteData } = useDeleteData("categories");

  const onCreateCategory = async (values: any) => {
    const success = await insertData(values);
    if (success) {
      setRefresh(!refresh);
      message.success("Insert category successfully", 3);
      form.resetFields();
    } else {
      console.log(errorInsert);
      errorInsert && message.error(errorInsert, 2);
    }
  };
  const onUpdateCategory = async (values: any) => {
    const success = await updateData(values, selected);
    if (success) {
      setOpen(false);
      setRefresh(!refresh);
      message.success("Update category successfully", 3);
      formUpdateCate.resetFields();
    } else {
      console.log(errorUpdate);
      errorUpdate && message.error(errorUpdate, 2);
    }
  };
  const onDeleteCategory = async (id: number) => {
    const success = await deleteData(id);
    if (success) {
      setRefresh(!refresh);
      message.success("Delete category successfully", 3);
    } else {
      console.log(errorDelete);
      errorDelete && message.error(errorDelete, 2);
    }
  };

  const columns: any = [
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
      align: "right",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (text: any, record: any, index: number) => {
        return (
          <Space>
            <Button
              type="primary"
              onClick={() => {
                setOpen(true);
                setSelected(record.id);
                formUpdateCate.setFieldsValue(record);
              }}
            >
              Edit
            </Button>
            <Popconfirm
              title="Delete a category"
              description="Are you sure to delete this category?"
              icon={<QuestionCircleOutlined style={{ color: "red" }} />}
              onConfirm={() => onDeleteCategory(record.id)}
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
      <h3 className="text-center">MANAGEMENT CATEGORIES</h3>
      <Form
        form={form}
        onFinish={onCreateCategory}
        name="insertForm"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 8 }}
        layout="horizontal"
        style={{ marginTop: 40 }}
      >
        <h4 className="text-center">CREATE NEW CATEGORY</h4>
        <Form.Item
          className="mt-5"
          label="Category name"
          name="name"
          rules={[
            {
              required: true,
              message: "Category name cannot be empty",
            },
          ]}
          hasFeedback
        >
          <Input placeholder="Enter a category name" />
        </Form.Item>
        <Form.Item label="Description" name="description">
          <Input placeholder="Enter a Description" />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 8 }}>
          <Button type="primary" htmlType="submit">
            Create new category
          </Button>
        </Form.Item>
      </Form>
      <Modal
        title="Update Category"
        okText="Update"
        cancelText="Cancel"
        open={open}
        onOk={() => {
          formUpdateCate.submit();
        }}
        onCancel={() => {
          setOpen(false);
        }}
      >
        <Form
          form={formUpdateCate}
          onFinish={onUpdateCategory}
          name="insertForm"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 8 }}
          layout="horizontal"
          style={{ marginTop: 40 }}
        >
          <Form.Item
            className="mt-5"
            label="Category name"
            name="name"
            rules={[
              {
                required: true,
                message: "Category name cannot be empty",
              },
            ]}
            hasFeedback
          >
            <Input placeholder="Enter a category name" />
          </Form.Item>
          <Form.Item label="Description" name="description">
            <Input placeholder="Enter a Description" />
          </Form.Item>
        </Form>
      </Modal>
      <Table dataSource={categories} columns={columns} />
    </div>
  );
}
