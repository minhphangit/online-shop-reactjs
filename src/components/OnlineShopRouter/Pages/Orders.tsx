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
  AutoComplete,
  Drawer,
} from "antd";

import axiosClient from "../configs/axiosClient";

import {
  MinusCircleOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import useGetAllData from "../hooks/useGetAllData";
import useUpdateData from "../hooks/useUpdateData";
import useInsertData from "../hooks/useInsertData";
import useDeleteData from "../hooks/useDeleteData";

import dayjs, { Dayjs } from "dayjs";
import TextArea from "antd/es/input/TextArea";
import useGetDataById from "../hooks/useGetDataById";

export default function Orders() {
  const [formInsertOrder] = Form.useForm();
  const [formUpdateOrder] = Form.useForm();

  //declare states
  const [open, setOpen] = React.useState(false);
  const [refresh, setRefresh] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState(-1);
  //states get data from Api
  const [employees] = useGetAllData([], "employees", refresh);
  const [customers] = useGetAllData([], "customers", refresh);
  const [products] = useGetAllData([], "products", refresh);
  const [Orders] = useGetAllData([], "orders", refresh);
  const [orderDetails] = useGetDataById([], "orders", refresh, selectedId);
  const { errorInsert, insertData } = useInsertData("orders");

  const { errorDelete, deleteData } = useDeleteData("orders");
  console.log("««««« OrdersDetail »»»»»", orderDetails);

  const onClose = () => {
    setOpen(false);
  };

  const onCreateOrder = async (values: any) => {
    console.log(values);
    values.orderDetails = values.orderDetails || [];
    const success = await insertData(values);
    if (success) {
      setRefresh(!refresh);
      message.success("Successfully added Orders", 2);
      formInsertOrder.resetFields();
    } else {
      console.log(errorInsert);
      errorInsert && message.error(errorInsert, 2);
    }
  };

  const onDeleteOrder = async (id: number) => {
    const success = await deleteData(id);
    if (success) {
      setRefresh(!refresh);
      message.success("Delete Order successfully", 3);
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
      title: "createdDate",
      dataIndex: "createdDate",
      key: "createdDate",
    },
    {
      title: "customer",
      dataIndex: "customer",
      key: "customer",
      render: (text: any, record: any, index: any) => {
        return <span>{record.customer.lastName}</span>;
      },
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (text: any, record: any, index: number) => {
        return <span>{record.description}</span>;
      },
    },
    {
      title: "priceProduct",
      dataIndex: "orderDetails",
      key: "orderDetails",
      render: (text: any, record: any, index: number) => {
        const orderDetail = record.orderDetails[index];
        const price =
          orderDetail && orderDetail.product ? orderDetail.product.price : "";
        return <span>{price}</span>;
      },
    },
    {
      title: "nameProduct",
      dataIndex: "orderDetails",
      key: "orderDetails",
      render: (text: any, record: any, index: number) => {
        const orderDetail = record.orderDetails[index];
        const name =
          orderDetail && orderDetail.product ? orderDetail.product.name : "";
        return <span>{name}</span>;
      },
    },

    {
      title: "priceOrderDetail",
      dataIndex: "orderDetails",
      key: "orderDetails",
      render: (text: any, record: any, index: number) => {
        const orderDetail = record.orderDetails[index];
        const priceOrderDetail = orderDetail && orderDetail.price;
        return <span>{priceOrderDetail}</span>;
      },
    },

    {
      title: "quantityOrderDetail",
      dataIndex: "orderDetails",
      key: "orderDetails",
      render: (text: any, record: any, index: number) => {
        const orderDetail = record.orderDetails[index];
        const quantityOrderDetail = orderDetail && orderDetail.quantity;
        return <span>{quantityOrderDetail}</span>;
      },
    },
    {
      title: "paymentType",
      dataIndex: "paymentType",
      key: "paymentType",
    },
    {
      title: "status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "employee",
      dataIndex: "employee",
      key: "employee",
      render: (text: any, record: any, index: number) => {
        return <span>{record.employee.lastName}</span>;
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
              }}
            >
              Detail
            </Button>
            <Popconfirm
              title="Delete a Order"
              description="Are you sure to delete this Order?"
              icon={<QuestionCircleOutlined style={{ color: "red" }} />}
              onConfirm={() => onDeleteOrder(record.id)}
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
  const orderDetailsColumns = [
    {
      title: "Product",
      dataIndex: "orderDetails",
      key: "name",
      render: (text: any, record: any, index: any) => {
        const orderDetail = record.orderDetails[index];
        const name =
          orderDetail && orderDetail.product ? orderDetail.product.name : "";
        return <span>{name}</span>;
      },
    },
    {
      title: "Price",
      dataIndex: "orderDetails",
      key: "price",
      render: (text: any, record: any, index: any) => {
        const orderDetail = record.orderDetails[index];
        const price =
          orderDetail && orderDetail.product ? orderDetail.product.price : "";
        return <span>{price}</span>;
      },
    },
    {
      title: "Discount",
      dataIndex: "orderDetails",
      key: "discount",
      render: (text: any, record: any, index: any) => {
        const orderDetail = record.orderDetails[index];
        const discount =
          orderDetail && orderDetail.product
            ? orderDetail.product.discount
            : "";
        return <span>{discount}</span>;
      },
    },
    {
      title: "Quantity",
      dataIndex: "orderDetails",
      key: "quantity",
      render: (text: any, record: any, index: any) => {
        const orderDetail = record.orderDetails[index];
        const quantity = orderDetail && orderDetail.quantity;
        return <span>{quantity}</span>;
      },
    },
    {
      title: "Sum",
      dataIndex: "sum",
      key: "sum",
      render: (text: any, record: any) => {
        const sum = record.orderDetails.reduce((acc: any, orderDetail: any) => {
          const priceOrderDetail = orderDetail.product.price || 0;
          const quantityOrderDetail = orderDetail.quantity || 0;
          return acc + quantityOrderDetail * priceOrderDetail;
        }, 0);
        return <span>{sum.toFixed(2)}</span>;
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (text: any, record: any) => (
        <Space>
          <Popconfirm
            title="Delete an Order"
            description="Are you sure to delete this product?"
            icon={<QuestionCircleOutlined style={{ color: "red" }} />}
            onConfirm={() => onDeleteOrder(record.id)}
          >
            <Button type="primary" danger>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h3 className="text-center"> MANAGEMENT ORDERS</h3>
      <Form
        form={formInsertOrder}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 8 }}
        onFinish={onCreateOrder}
        name="insertForm"
        layout="horizontal"
        style={{ marginTop: 40 }}
      >
        <Form.Item
          label="Customer"
          name="customerId"
          rules={[
            {
              required: true,
              message: "customer bắt buộc phải chọn",
            },
          ]}
        >
          <Select
            options={customers.map((customer: any) => {
              return {
                value: customer.id,
                label: customer.lastName,
              };
            })}
          />
        </Form.Item>
        <Form.Item
          label="Employee"
          name="employeeId"
          rules={[
            {
              required: true,
              message: "employee bắt buộc phải chọn",
            },
          ]}
        >
          <Select
            options={employees.map((employee: any) => {
              return {
                value: employee.id,
                label: employee.lastName,
              };
            })}
          />
        </Form.Item>
        <Form.Item label="description" name="description" hasFeedback>
          <TextArea rows={4} placeholder="enter description" />
        </Form.Item>
        <Form.Item
          style={{ display: "none" }}
          label="Order Details"
          name="orderDetails"
        >
          <Form.List name="orderDetails">
            {(fields, { add, remove }) => (
              <div>
                {fields.map(({ key, name, ...restField }) => (
                  <Space
                    key={key}
                    style={{ display: "flex", marginBottom: 8 }}
                    align="baseline"
                  >
                    {/* Thêm các trường khác của orderDetails theo cách tương tự */}
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </Space>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    icon={<PlusOutlined />}
                  >
                    Add Order Detail
                  </Button>
                </Form.Item>
              </div>
            )}
          </Form.List>
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 8 }}>
          <Button type="primary" htmlType="submit">
            Create new Order
          </Button>
        </Form.Item>
      </Form>

      <Table dataSource={Orders} columns={columns} />

      <Drawer
        title="Order detail"
        placement="right"
        onClose={onClose}
        open={open}
        width={800}
        style={{ marginRight: 50 }}
      >
        <Table dataSource={Orders} columns={orderDetailsColumns} />

        <Form.Item
          label="Product"
          name="product"
          rules={[
            {
              required: true,
              message: "product bắt buộc phải chọn",
            },
          ]}
        >
          <Select
            options={products.map((employee: any) => {
              return {
                value: employee.id,
                label: employee.name,
              };
            })}
          />
        </Form.Item>
        <Form.Item
          label="Quantity"
          name="quatity"
          rules={[
            {
              required: true,
              message: "quatity bắt buộc phải nhập",
            },
          ]}
        >
          <InputNumber />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 8 }}>
          <Button type="primary" htmlType="submit">
            Add new product
          </Button>
        </Form.Item>
      </Drawer>
    </div>
  );
}
