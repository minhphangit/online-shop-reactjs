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
import dayjs from "dayjs";
type Props = {};

export default function Customers({}: Props) {
  const [formInsertCustomer] = Form.useForm();
  const [formUpdateCustomer] = Form.useForm();
  //declare states
  const [open, setOpen] = React.useState(false);
  const [openAdd, setOpenAdd] = React.useState(false);
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
      setOpenAdd(!openAdd);
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
  const onDeleteCustomer = async (_id: number) => {
    const success = await deleteData(_id);
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
      title: "Họ ",
      dataIndex: "firstName",
      key: "firstName",
    },
    {
      title: "Tên",
      dataIndex: "lastName",
      key: "lastName",
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
      title: "Ngày sinh",
      dataIndex: "birthday",
      key: "birthday",
      render: (text: any, record: any, index: number) => {
        const date = dayjs(text);
        return <span>{date.format("DD/MM/YYYY")}</span>;
      },
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
                formUpdateCustomer.setFieldsValue(record);
              }}
            >
              Sửa
            </Button>
            <Popconfirm
              title="Xoá danh mục"
              description="Bạn có chắc chắn xoá không?"
              okText="Xoá"
              okButtonProps={{
                style: { backgroundColor: "red" },
              }}
              cancelText="Đóng"
              icon={<QuestionCircleOutlined style={{ color: "red" }} />}
              onConfirm={() => onDeleteCustomer(record._id)}
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
      <h3 className="text-center">QUẢN LÝ KHÁCH HÀNG</h3>
      <Modal
        title="Thêm mới danh mục"
        okText="Thêm"
        cancelText="Đóng"
        okButtonProps={{
          style: { backgroundColor: "#85c547" },
        }}
        open={openAdd}
        onOk={() => {
          formInsertCustomer.submit();
        }}
        onCancel={() => {
          setOpenAdd(false);
        }}
      >
        <Divider />
        <Form
          form={formInsertCustomer}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 12 }}
          onFinish={onCreateCustomer}
          name="insertForm"
          layout="horizontal"
          initialValues={{ birthday: dayjs() }}
        >
          <Form.Item
            label="Họ"
            name="firstName"
            rules={[
              {
                required: true,
                message: "Họ không được bỏ trống ",
              },
            ]}
            hasFeedback
          >
            <Input placeholder="Nhập họ " />
          </Form.Item>

          <Form.Item
            label="Tên "
            name="lastName"
            rules={[
              {
                required: true,
                message: "Tên không được bỏ trống ",
              },
            ]}
            hasFeedback
          >
            <Input placeholder="Nhập tên " />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: "Email không được bỏ trống",
              },
              {
                type: "email",
                message: "Vui lòng nhập đúng định dạng email",
              },
            ]}
            hasFeedback
          >
            <Input placeholder="example@gmail.com" />
          </Form.Item>
          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[
              {
                required: true,
                message: "Mật khẩu không được để trống!",
              },
            ]}
            hasFeedback
          >
            <Input.Password placeholder="Nhập mật khẩu" />
          </Form.Item>
          <Form.Item
            label="Địa chỉ "
            name="address"
            rules={[
              {
                required: true,
                message: "Địa chỉ không được để trống",
              },
            ]}
            hasFeedback
          >
            <Input placeholder="Nhập địa chỉ " />
          </Form.Item>

          <Form.Item
            name="phoneNumber"
            label="Phone Number"
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại !" },
            ]}
          >
            <Input placeholder="0391155349" />
          </Form.Item>

          <Form.Item label="Ngày sinh" name="birthday">
            <DatePicker format="DD/MM/YYYY" />
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
      <Table dataSource={customers} columns={columns} />

      <Modal
        title="Cập nhập khách hàng"
        okText="Cập nhập"
        cancelText="Đóng"
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
          wrapperCol={{ span: 12 }}
          onFinish={onUpdateCustomer}
          name="insertForm"
          layout="horizontal"
          initialValues={{ birthday: dayjs() }}
        >
          <Form.Item
            label="Họ"
            name="firstName"
            rules={[
              {
                required: true,
                message: "Họ không được bỏ trống ",
              },
            ]}
            hasFeedback
          >
            <Input placeholder="Nhập họ " />
          </Form.Item>

          <Form.Item
            label="Tên "
            name="lastName"
            rules={[
              {
                required: true,
                message: "Tên không được bỏ trống ",
              },
            ]}
            hasFeedback
          >
            <Input placeholder="Nhập tên " />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: "Email không được bỏ trống",
              },
              {
                type: "email",
                message: "Vui lòng nhập đúng định dạng email",
              },
            ]}
            hasFeedback
          >
            <Input placeholder="example@gmail.com" />
          </Form.Item>
          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[
              {
                required: true,
                message: "Mật khẩu không được để trống!",
              },
            ]}
            hasFeedback
          >
            <Input.Password placeholder="Nhập mật khẩu" />
          </Form.Item>
          <Form.Item
            label="Địa chỉ "
            name="address"
            rules={[
              {
                required: true,
                message: "Địa chỉ không được để trống",
              },
            ]}
            hasFeedback
          >
            <Input placeholder="Nhập địa chỉ " />
          </Form.Item>

          <Form.Item
            label="Số điện thoại"
            name="phoneNumber"
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại !" },
            ]}
          >
            <Input placeholder="0391155349" />
          </Form.Item>

          <Form.Item
            name="birthday"
            label="Ngày sinh"
            rules={[
              {
                required: true,
                message: "Ngày sinh không được để trống !",
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
