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
  const [openAdd, setOpenAdd] = React.useState(false);
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
      setOpenAdd(!openAdd);
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
  const onDeleteSupplier = async (_id: number) => {
    const success = await deleteData(_id);
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
      title: "Tên nhà cung cấp",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "",
      dataIndex: "action",
      key: "action",
      render: (text: any, record: any, index: number) => {
        return (
          <Space>
            <Button
              type="primary"
              onClick={() => {
                setOpen(true);
                setSelectedId(record._id);
                formUpdateSupplier.setFieldsValue(record);
              }}
            >
              Sửa
            </Button>
            <Popconfirm
              title="Xoá nhà cung cấp "
              description="Bạn có chắc chắn xóa không?"
              okButtonProps={{
                style: { backgroundColor: "red" },
              }}
              okText="Xoá"
              cancelText="Đóng"
              icon={<QuestionCircleOutlined style={{ color: "red" }} />}
              onConfirm={() => onDeleteSupplier(record._id)}
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
      <h3 className="text-center">QUẢN LÝ NHÀ CUNG CẤP</h3>
      {/* Modal add new item */}
      <Modal
        title="Thêm mới nhà cung cấp"
        okText="Thêm"
        cancelText="Đóng"
        okButtonProps={{
          style: { backgroundColor: "#85c547" },
        }}
        open={openAdd}
        onOk={() => {
          formInsertSupplier.submit();
        }}
        onCancel={() => {
          setOpenAdd(false);
        }}
      >
        <Divider />
        <Form
          form={formInsertSupplier}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 12 }}
          onFinish={onCreateSupplier}
          name="insertForm"
          layout="horizontal"
        >
          <Form.Item
            label="Tên nhà cung cấp"
            name="name"
            rules={[
              {
                required: true,
                message: "Tên nhà cung cấp không được để trống",
              },
            ]}
            hasFeedback
          >
            <Input placeholder="Enter a name" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: "email không được để trống",
              },
              {
                type: "email",
                message: "Vui lòng nhập đúng định dạnh email",
              },
            ]}
            hasFeedback
          >
            <Input placeholder="example@gmail.com" />
          </Form.Item>

          <Form.Item
            label="Địa chỉ"
            name="address"
            rules={[
              {
                required: true,
                message: "Địa chỉ không được để trống !",
              },
            ]}
            hasFeedback
          >
            <Input placeholder="460 Trần Cao Vân, Đà Nẵng" />
          </Form.Item>

          <Form.Item
            name="Số điện thoại"
            label="Phone Number"
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại !" },
            ]}
          >
            <Input placeholder="0395511399" />
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
      <Table dataSource={suppliers} columns={columns} />
      <Modal
        title="Cập nhập nhà cung cấp"
        okText="Cập nhập"
        cancelText="Đóng"
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
          wrapperCol={{ span: 12 }}
          onFinish={onUpdateSupplier}
          name="insertForm"
          layout="horizontal"
        >
          <Form.Item
            label="Tên nhà cung cấp"
            name="name"
            rules={[
              {
                required: true,
                message: "Tên nhà cung cấp không được để trống",
              },
            ]}
            hasFeedback
          >
            <Input placeholder="Enter a name" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: "email không được để trống",
              },
              {
                type: "email",
                message: "Vui lòng nhập đúng định dạnh email",
              },
            ]}
            hasFeedback
          >
            <Input placeholder="example@gmail.com" />
          </Form.Item>

          <Form.Item
            label="Địa chỉ"
            name="address"
            rules={[
              {
                required: true,
                message: "Địa chỉ không được để trống !",
              },
            ]}
            hasFeedback
          >
            <Input placeholder="460 Trần Cao Vân, Đà Nẵng" />
          </Form.Item>

          <Form.Item
            name="phoneNumber"
            label="Số điện thoại"
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại !" },
            ]}
          >
            <Input placeholder="0395511399" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
