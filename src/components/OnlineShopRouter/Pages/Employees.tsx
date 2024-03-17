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
  const [openAdd, setOpenAdd] = React.useState(false);
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
      setOpenAdd(!openAdd);
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
  const onDeleteEmployee = async (_id: number) => {
    const success = await deleteData(_id);
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
      title: "Họ",
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
                formUpdateEmployee.setFieldsValue(record);
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
              onConfirm={() => onDeleteEmployee(record._id)}
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
      <h3 className="text-center">QUẢN LÝ NHÂN VIÊN</h3>
      <Modal
        title="Thêm mới danh mục"
        okText="Thêm"
        cancelText="Đóng"
        okButtonProps={{
          style: { backgroundColor: "#85c547" },
        }}
        open={openAdd}
        onOk={() => {
          formInsertEmployee.submit();
        }}
        onCancel={() => {
          setOpenAdd(false);
        }}
      >
        <Divider />
        <Form
          form={formInsertEmployee}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 12 }}
          onFinish={onCreateEmployee}
          name="insertForm"
          layout="horizontal"
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
      <Table dataSource={Employees} columns={columns} />

      <Modal
        title="Cập nhập nhân viên"
        okText="Cập nhập"
        cancelText="Đóng"
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
          wrapperCol={{ span: 12 }}
          onFinish={onUpdateEmployee}
          name="insertForm"
          layout="horizontal"
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
