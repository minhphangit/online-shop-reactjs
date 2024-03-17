import React from "react";
import axiosClient from "../configs/axiosClient";
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
import { QuestionCircleOutlined } from "@ant-design/icons";
import { MdAddToPhotos } from "react-icons/md";
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
  const [openAdd, setOpenAdd] = React.useState(false);
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
      setOpenAdd(!openAdd);
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
  const onDeleteCategory = async (_id: number) => {
    const success = await deleteData(_id);
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
      title: "Tên danh mục",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "",
      dataIndex: "action",
      key: "action",
      align: "right",

      render: (text: any, record: any, index: number) => {
        return (
          <Space>
            <Button
              type="primary"
              onClick={() => {
                setOpen(true);
                setSelected(record._id);
                formUpdateCate.setFieldsValue(record);
              }}
            >
              Sửa
            </Button>
            <Popconfirm
              title="Xoá danh mục"
              description="Bạn có chắc chắn xóa danh mục này?"
              okText="Xoá"
              okButtonProps={{
                style: { backgroundColor: "red" },
              }}
              cancelText="Đóng"
              icon={<QuestionCircleOutlined style={{ color: "red" }} />}
              onConfirm={() => onDeleteCategory(record._id)}
            >
              <Button type="primary" danger>
                Xoá
              </Button>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];
  return (
    <div>
      <h3 className="text-center">QUẢN LÝ DANH MỤC</h3>
      {/* Modal add new item */}
      <Modal
        title="Thêm mới danh mục"
        okText="Thêm"
        cancelText="Đóng"
        okButtonProps={{
          style: { backgroundColor: "#85c547" },
        }}
        open={openAdd}
        onOk={() => {
          form.submit();
        }}
        onCancel={() => {
          setOpenAdd(false);
        }}
      >
        <Divider />
        <Form
          form={form}
          onFinish={onCreateCategory}
          name="insertForm"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 12 }}
          layout="horizontal"
        >
          <Form.Item
            label="Tên danh mục"
            name="name"
            rules={[
              {
                required: true,
                message: "Tên danh mục không được để trống",
              },
            ]}
            hasFeedback
          >
            <Input placeholder="Nhập tên danh mục" />
          </Form.Item>
          <Form.Item label="Mô tả" name="description">
            <Input.TextArea rows={3} placeholder="Nhập mô tả " />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal update item */}
      <Modal
        title="Cập nhập danh mục"
        okText="Cập nhập"
        cancelText="Đóng"
        open={open}
        onOk={() => {
          formUpdateCate.submit();
        }}
        onCancel={() => {
          setOpen(false);
        }}
      >
        <Divider />
        <Form
          form={formUpdateCate}
          onFinish={onUpdateCategory}
          name="insertForm"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 12 }}
          layout="horizontal"
        >
          <Form.Item
            label="Tên danh mục"
            name="name"
            rules={[
              {
                required: true,
                message: "Tên danh mục không được để trống",
              },
            ]}
            hasFeedback
          >
            <Input placeholder="Nhập tên danh mục" />
          </Form.Item>
          <Form.Item label="Mô tả" name="description">
            <Input.TextArea rows={3} placeholder="Nhập mô tả " />
          </Form.Item>
        </Form>
      </Modal>

      <div className="d-flex justify-content-end">
        <Button
          type="primary"
          style={{
            backgroundColor: "#85C547",
            borderColor: "#85C547",
          }}
          onClick={() => {
            setOpenAdd(true);
          }}
        >
          Thêm mới
        </Button>
      </div>

      {/* Table products */}
      <Table dataSource={categories} columns={columns} />
    </div>
  );
}
