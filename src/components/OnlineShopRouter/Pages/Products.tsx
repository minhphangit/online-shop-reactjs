import React from "react";
import {
  Table,
  Space,
  Button,
  Form,
  Input,
  InputNumber,
  message,
  Select,
  Modal,
  Divider,
  Popconfirm,
} from "antd";
import numeral from "numeral";
import axiosClient from "../configs/axiosClient";
import { QuestionCircleOutlined } from "@ant-design/icons";
import useGetAllData from "../hooks/useGetAllData";
import useUpdateData from "../hooks/useUpdateData";
import useInsertData from "../hooks/useInsertData";
import useDeleteData from "../hooks/useDeleteData";

type Props = {};

export default function Products({}: Props) {
  //using Form Antd library get values in form Create new product
  const [form] = Form.useForm();
  //formUpdateProduct Update product
  const [formUpdateProduct] = Form.useForm();
  const [refresh, setRefresh] = React.useState(false);
  //state open & close form
  const [open, setOpen] = React.useState(false);
  //state selectedId product
  const [selectedId, setSelectedId] = React.useState(-1);
  //useHooks
  const [categories] = useGetAllData([], "categories", refresh);
  const [products] = useGetAllData([], "products", refresh);
  const [suppliers] = useGetAllData([], "suppliers", refresh);

  const { errorInsert, insertData } = useInsertData("products");
  const { errorUpdate, updateData } = useUpdateData("products");
  const { errorDelete, deleteData } = useDeleteData("products");

  const onCreateProduct = async (values: any) => {
    const success = await insertData(values);
    if (success) {
      setRefresh(!refresh);
      message.success("Insert Product successfully", 3);
      form.resetFields(["name", "price", "discount", "stock", "description"]);
    } else {
      console.log(errorInsert);
      errorInsert && message.error(errorInsert, 2);
    }
  };
  const onUpdateProduct = async (values: any) => {
    const success = await updateData(values, selectedId);
    if (success) {
      setOpen(false);
      setRefresh(!refresh);
      message.success("Update Product successfully", 3);
      formUpdateProduct.resetFields();
    } else {
      console.log(errorUpdate);
      errorUpdate && message.error(errorUpdate, 2);
    }
  };
  const onDeleteProduct = async (id: number) => {
    const success = await deleteData(id);
    if (success) {
      setRefresh(!refresh);
      message.success("Delete Product successfully", 3);
    } else {
      console.log(errorDelete);
      errorDelete && message.error(errorDelete, 2);
    }
  };

  //Column table products
  const columns: any = [
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
      align: "right",
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Danh mục",
      dataIndex: "Category",
      key: "Category",
      render: (text: any, record: any, index: number) => {
        return <span>{record.category.name}</span>;
      },
    },
    {
      title: "Nhà cung cấp",
      dataIndex: "supplier",
      key: "supplier",
      render: (text: any, record: any, index: number) => {
        return <span>{record.supplier.name}</span>;
      },
    },
    {
      title: "Giá bán",
      dataIndex: "price",
      align: "right",
      key: "price",
      render: (text: any, record: any, index: number) => {
        return <strong>{numeral(text).format("0,0")}</strong>;
      },
    },
    {
      title: "Giảm giá",
      dataIndex: "discount",
      align: "right",
      key: "discount",
      render: (text: any, record: any, index: number) => {
        return <strong>{numeral(text).format("0,0")}%</strong>;
      },
    },
    {
      title: () => {
        return <span>Giá sau giảm giá</span>;
      },
      dataIndex: "stock",
      align: "right",
      key: "stock",
      render: (text: any, record: any, index: number) => {
        return <strong>{numeral(text).format("0,0")}</strong>;
      },
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Thao tác",
      dataIndex: "actions",
      key: "actions",
      render: (text: any, record: any, index: number) => {
        return (
          <Space>
            <Button
              type="primary"
              onClick={() => {
                setOpen(true);
                setSelectedId(record.id);
                formUpdateProduct.setFieldsValue(record);
              }}
            >
              Sửa
            </Button>
            <Popconfirm
              title="Xoá sản phẩm"
              description="Bạn có chắc chắn xoá sản phẩm này không?"
              icon={<QuestionCircleOutlined style={{ color: "red" }} />}
              onConfirm={() => onDeleteProduct(record.id)}
            >
              <Button type="primary" danger>
                Xóa
              </Button>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];
  return (
    <div>
      {/* Form Create new product */}
      <h3 className="text-center">MANAGEMENT PRODUCTS</h3>
      <Form
        form={form}
        style={{ marginTop: 40 }}
        wrapperCol={{ span: 14 }}
        layout="horizontal"
        onFinish={onCreateProduct}
        initialValues={{
          discount: 0,
          stock: 1,
        }}
        labelCol={{ span: 8 }}
      >
        <h3 className="text-center mb-5">Create new product</h3>
        <Form.Item
          label="Danh mục"
          name="categoryId"
          rules={[
            {
              required: true,
              message: "Danh mục bắt buộc phải chọn",
            },
          ]}
        >
          <Select
            options={categories.map((category: any) => {
              return {
                value: category.id,
                label: category.name,
              };
            })}
          />
        </Form.Item>
        <Form.Item
          label="Nhà cung cấp"
          name="supplierId"
          rules={[
            {
              required: true,
              message: "Danh mục bắt buộc phải chọn",
            },
          ]}
        >
          <Select
            options={suppliers.map((supplier: any) => {
              return {
                value: supplier.id,
                label: supplier.name,
              };
            })}
          />
        </Form.Item>

        <Form.Item
          label="Tên sản phẩm"
          name="name"
          rules={[
            {
              required: true,
              message: "Tên sản phẩm bắt buộc phải nhập",
            },
          ]}
          hasFeedback
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Giá bán"
          name="price"
          rules={[
            {
              required: true,
              message: "Giá bán bắt buộc phải nhập",
            },
          ]}
        >
          <InputNumber />
        </Form.Item>

        <Form.Item
          label="Giảm giá"
          name="discount"
          rules={[
            {
              required: true,
              message: "Giảm giá bắt buộc phải nhập",
            },
            {
              type: "number",
              min: 0,
              message: "Tồn kho phải lớn hơn bằng 0",
            },
          ]}
        >
          <InputNumber />
        </Form.Item>

        <Form.Item
          label="Tồn kho"
          name="stock"
          rules={[
            {
              required: true,
              message: "Tồn kho bắt buộc phải nhập",
            },
            {
              type: "number",
              min: 1,
              message: "Tồn kho phải lớn hơn 1",
            },
          ]}
        >
          <InputNumber />
        </Form.Item>

        <Form.Item label="Mô tả" name="description">
          <Input />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Create new product
          </Button>
        </Form.Item>
      </Form>
      {/* Modal Update product */}
      <Modal
        title="Cập nhập thông tin sản phẩm"
        okText="Cập nhật"
        cancelText="Đóng"
        open={open}
        onOk={() => {
          formUpdateProduct.submit();
        }}
        onCancel={() => {
          setOpen(false);
        }}
      >
        <Divider />
        <Form
          form={formUpdateProduct}
          style={{ marginTop: 40 }}
          wrapperCol={{ span: 14 }}
          layout="horizontal"
          onFinish={onUpdateProduct}
          initialValues={{
            discount: 0,
            stock: 1,
          }}
          labelCol={{ span: 8 }}
        >
          <Form.Item
            label="Danh mục"
            name="categoryId"
            rules={[
              {
                required: true,
                message: "Danh mục bắt buộc phải chọn",
              },
            ]}
          >
            <Select
              options={categories.map((category: any) => {
                return {
                  value: category.id,
                  label: category.name,
                };
              })}
            />
          </Form.Item>
          <Form.Item
            label="Nhà cung cấp"
            name="supplierId"
            rules={[
              {
                required: true,
                message: "Danh mục bắt buộc phải chọn",
              },
            ]}
          >
            <Select
              options={suppliers.map((supplier: any) => {
                return {
                  value: supplier.id,
                  label: supplier.name,
                };
              })}
            />
          </Form.Item>

          <Form.Item
            label="Tên sản phẩm"
            name="name"
            rules={[
              {
                required: true,
                message: "Tên sản phẩm bắt buộc phải nhập",
              },
            ]}
            hasFeedback
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Giá bán"
            name="price"
            rules={[
              {
                required: true,
                message: "Giá bán bắt buộc phải nhập",
              },
            ]}
          >
            <InputNumber />
          </Form.Item>

          <Form.Item
            label="Giảm giá"
            name="discount"
            rules={[
              {
                required: true,
                message: "Giảm giá bắt buộc phải nhập",
              },
              {
                type: "number",
                min: 0,
                message: "Tồn kho phải lớn hơn bằng 0",
              },
            ]}
          >
            <InputNumber />
          </Form.Item>

          <Form.Item
            label="Tồn kho"
            name="stock"
            rules={[
              {
                required: true,
                message: "Tồn kho bắt buộc phải nhập",
              },
              {
                type: "number",
                min: 1,
                message: "Tồn kho phải lớn hơn 1",
              },
            ]}
          >
            <InputNumber />
          </Form.Item>

          <Form.Item label="Mô tả" name="description">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
      {/* Table products */}
      <Table rowKey="id" dataSource={products} columns={columns} />
    </div>
  );
}
