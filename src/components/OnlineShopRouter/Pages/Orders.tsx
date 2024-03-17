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
import numeral from "numeral";

import axiosClient from "../configs/axiosClient";
import dayjs from "dayjs";

import {
  MinusCircleOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import useGetAllData from "../hooks/useGetAllData";
import useUpdateData from "../hooks/useUpdateData";
import useInsertData from "../hooks/useInsertData";
import useDeleteData from "../hooks/useDeleteData";

import TextArea from "antd/es/input/TextArea";
import useGetDataById from "../hooks/useGetDataById";
import FormItem from "antd/es/form/FormItem";
import { min } from "moment";

export default function Orders() {
  const [formInsertOrder] = Form.useForm();
  const [formUpdateOrder] = Form.useForm();

  //declare states
  const [open, setOpen] = React.useState(false);
  const [openAdd, setOpenAdd] = React.useState(false);
  const [refresh, setRefresh] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState(null);
  const [dataProduct, setDataProduct] = React.useState<any[]>([]);
  const [dataProductDetail, setDataProductDetail] = React.useState<any[]>([]);
  const [dataDetails, setDataDetails] = React.useState<any[]>([]);
  //states get data from Api
  const [employees] = useGetAllData([], "employees", refresh);
  const [customers] = useGetAllData([], "customers", refresh);
  const [products] = useGetAllData([], "products", refresh);
  const [Orders] = useGetAllData([], "orders", refresh);
  const [productList] = useGetDataById([], "orders", refresh, selectedId);
  const { errorInsert, insertData } = useInsertData("orders");
  const { errorUpdate, updateData } = useUpdateData("orders");
  const { errorDelete, deleteData } = useDeleteData("orders");

  const columns: any = [
    {
      title: "Ngày tạo",
      dataIndex: "createdDate",
      key: "createdDate",
      render: (text: any, record: any, index: number) => {
        const date = dayjs(text);
        return <span>{date.format("DD/MM/YYYY")}</span>;
      },
    },
    {
      title: "Ngày giao",
      dataIndex: "shippedDate",
      key: "shippedDate",
      render: (text: any, record: any, index: number) => {
        const date = dayjs(text);
        return <span>{date.format("DD/MM/YYYY")}</span>;
      },
    },
    {
      title: "Phương thức thanh toán",
      dataIndex: "paymentType",
      key: "paymentType",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
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
                handleDetailClick(record);
              }}
            >
              Chi tiết
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
              onConfirm={() => onDeleteOrder(record._id)}
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

  const columnsProduct: any = [
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
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
      title: "Số lượng",
      dataIndex: "quantity",
      align: "right",
      key: "quantity",
      render: (text: any, record: any, index: number) => {
        // return <strong>{numeral(text).format("0,0")}</strong>;
        return (
          <InputNumber
            value={text}
            onChange={(value) => {
              // Cập nhật giá trị record
              record.quantity = value;
            }}
          />
        );
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
      title: "",
      dataIndex: "action",
      key: "action",
      render: (text: any, record: any, index: number) => {
        return (
          <Popconfirm
            title="Xoá sản phẩm"
            description="Bạn có muốn xoá sản phẩm này không?"
            icon={<QuestionCircleOutlined style={{ color: "red" }} />}
            onConfirm={() => onDeleteProduct(record._id)}
          >
            <Button type="primary" danger>
              Xoá
            </Button>
          </Popconfirm>
        );
      },
    },
  ];
  const columnsProductDetail: any = [
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
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
      title: "Số lượng",
      dataIndex: "quantity",
      align: "right",
      key: "quantity",
      render: (text: any, record: any, index: number) => {
        return (
          <InputNumber
            value={text}
            onChange={(value) => {
              // Cập nhật giá trị record
              record.quantity = value;
            }}
          />
        );
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
      title: "",
      dataIndex: "action",
      key: "action",
      render: (text: any, record: any, index: number) => {
        return (
          <Popconfirm
            title="Xoá sản phẩm"
            description="Bạn có muốn xoá sản phẩm này không?"
            icon={<QuestionCircleOutlined style={{ color: "red" }} />}
            onConfirm={() => onDeleteProductInDetail(record._id)}
          >
            <Button type="primary" danger>
              Xoá
            </Button>
          </Popconfirm>
        );
      },
    },
  ];

  const columnsDetail: any = [
    {
      title: "Phương thức thanh toán",
      dataIndex: "paymentType",
      key: "paymentType",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
    },
  ];

  const onClose = () => {
    setOpen(false);
    setSelectedId(null);
    setDataDetails([]);
    setDataProduct([]);
  };

  const onCreateOrder = async (values: any) => {
    values.productList =
      dataProduct.map((item) => ({
        productId: item._id,
        quantity: item.quantity,
      })) || [];
    const success = await insertData(values);
    if (success) {
      setRefresh(!refresh);
      message.success("Successfully added Orders", 2);
      formInsertOrder.resetFields();
      setDataProduct([]);
      setOpenAdd(!openAdd);
    } else {
      console.log(errorInsert);
      errorInsert && message.error(errorInsert, 2);
    }
  };
  const onUpdateOrder = async (values: any) => {
    values.productList =
      dataProductDetail.map((item) => ({
        productId: item._id,
        quantity: item.quantity,
        discount: item.discount,
        price: item.price,
      })) || [];
    const success = await updateData(values, selectedId);
    if (success) {
      setOpen(false);
      setRefresh(!refresh);
      message.success("Update Order successfully", 3);
      formUpdateOrder.resetFields();
    } else {
      console.log(errorUpdate);
      errorUpdate && message.error(errorUpdate, 2);
    }
  };
  const onDeleteOrder = async (_id: number) => {
    const success = await deleteData(_id);
    if (success) {
      setRefresh(!refresh);
      message.success("Delete Order successfully", 3);
    } else {
      console.log(errorDelete);
      errorDelete && message.error(errorDelete, 2);
    }
  };

  const onDeleteProductInDetail = async (productId: number) => {
    setDataProductDetail(
      dataProductDetail.filter((item) => item._id !== productId)
    );
  };
  const onDeleteProduct = async (productId: number) => {
    setDataProduct(dataProduct.filter((item) => item._id !== productId));
  };
  const handleAddProduct = async () => {
    try {
      const values = await formInsertOrder.validateFields([
        "product",
        "quantity",
      ]);
      const selectedProduct = values.product;
      const quantity = values.quantity;

      // Find the existing product in the dataProduct table
      const existingProductIndex = dataProduct.findIndex(
        (p) => p._id === selectedProduct
      );
      const product = products.find((p: any) => p._id === selectedProduct);

      if (existingProductIndex !== -1) {
        // Product already exists, update quantity
        const updatedDataProduct = [...dataProduct];
        updatedDataProduct[existingProductIndex].quantity += quantity;
        setDataProduct(updatedDataProduct);
      } else {
        // Product not found, create new entry
        const newProductData = {
          _id: selectedProduct, // Assuming _id is the product identifier
          name: product.name, // Assuming product object is available for name
          price: product.price, // Assuming product object is available for price
          discount: product.discount, // Assuming product object is available for price
          quantity,
        };
        setDataProduct([...dataProduct, newProductData]);
      }

      formInsertOrder.resetFields(["quantity"]);
    } catch (errorInfo) {
      console.log("Failed:", errorInfo);
    }
  };
  const handleAddProductDetail = async () => {
    try {
      const values = await formUpdateOrder.validateFields([
        "product",
        "quantity",
      ]);
      const selectedProduct = values.product;
      const quantity = values.quantity;

      // Find the existing product in the dataProduct table
      const existingProductIndex = dataProductDetail.findIndex(
        (p) => p._id === selectedProduct
      );
      const product = products.find((p: any) => p._id === selectedProduct);

      if (existingProductIndex !== -1) {
        // Product already exists, update quantity
        const updatedDataProduct = [...dataProductDetail];
        updatedDataProduct[existingProductIndex].quantity += quantity;
        setDataProductDetail(updatedDataProduct);
      } else {
        // Product not found, create new entry
        const newProductData = {
          _id: selectedProduct, // Assuming _id is the product identifier
          name: product.name, // Assuming product object is available for name
          discount: product.discount, // Assuming product object is available for price
          price: product.price, // Assuming product object is available for price
          quantity,
        };
        setDataProductDetail([...dataProductDetail, newProductData]);
      }

      formUpdateOrder.resetFields(["quantity"]);
    } catch (errorInfo) {
      console.log("Failed:", errorInfo);
    }
  };

  const handleDetailClick = (record: any) => {
    setOpen(true);
    setSelectedId(record._id);

    // Tìm đơn hàng tương ứng với id được chọn
    const selectedOrder = Orders.find((order: any) => order._id === record._id);

    // Lấy thông tin chi tiết đơn hàng và hiển thị trong dataDetails
    setDataDetails([selectedOrder]);

    // Lấy danh sách sản phẩm trong đơn hàng và hiển thị trong dataProduct
    // Bạn cần thay thế 'productList' bằng trường tương ứng trong đơn hàng của bạn
    setDataProductDetail(selectedOrder.productList);
  };

  return (
    <div>
      <h3 className="text-center">QUẢN LÝ ĐƠN HÀNG</h3>
      <Modal
        title="Thêm mới danh mục"
        okText="Thêm"
        cancelText="Đóng"
        width={800}
        okButtonProps={{
          style: { backgroundColor: "#85c547" },
        }}
        open={openAdd}
        onOk={() => {
          formInsertOrder.submit();
        }}
        onCancel={() => {
          setOpenAdd(false);
        }}
      >
        <Divider />
        <Form
          form={formInsertOrder}
          onFinish={onCreateOrder}
          name="insertForm"
          layout="horizontal"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
        >
          <Form.Item
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 8 }}
            name="createDate"
            label="Ngày tạo"
            rules={[
              {
                required: true,
                message: "Ngày tạo không được bỏ trống!",
              },
            ]}
            getValueProps={(e: string) => ({
              value: e ? dayjs(e) : "",
            })}
          >
            <DatePicker format="DD/MM/YYYY" />
          </Form.Item>
          <Form.Item
            name="shippedDate"
            label="Ngày giao"
            rules={[
              {
                required: true,
                message: "Ngày giao không được bỏ trống!",
              },
            ]}
            getValueProps={(e: string) => ({
              value: e ? dayjs(e) : "",
            })}
          >
            <DatePicker format="DD/MM/YYYY" />
          </Form.Item>

          <Form.Item
            label="Phương thức thanh toán"
            name="paymentType"
            rules={[
              {
                required: true,
                message: "Phương thức thanh toán bắt buộc phải chọn",
              },
            ]}
          >
            <Select
              options={[
                {
                  value: "CASH",
                  label: "CASH",
                },
                {
                  value: "CREDIT_CARD",
                  label: "CREDIT_CARD",
                },
              ]}
            />
          </Form.Item>

          <Form.Item
            label="Trạng thái"
            name="status"
            rules={[
              {
                required: true,
                message: "Trạng thái bắt buộc phải chọn",
              },
            ]}
          >
            <Select
              options={[
                {
                  value: "WAITING",
                  label: "WAITING",
                },
                {
                  value: "COMPLETED",
                  label: "COMPLETED",
                },
                {
                  value: "CANCELLED",
                  label: "CANCELLED",
                },
                {
                  value: "REJECTED",
                  label: "REJECTED",
                },
                {
                  value: "DELIVERING",
                  label: "DELIVERING",
                },
              ]}
            />
          </Form.Item>

          <Form.Item
            label="Khách hàng"
            name="customerId"
            rules={[
              {
                required: true,
                message: "Khách hàng bắt buộc phải chọn",
              },
            ]}
          >
            <Select
              options={customers.map((customer: any) => {
                return {
                  value: customer._id,
                  label: customer.lastName,
                };
              })}
            />
          </Form.Item>

          <Form.Item
            label="Nhân viên"
            name="employeeId"
            rules={[
              {
                required: true,
                message: "Nhân viên bắt buộc phải chọn",
              },
            ]}
          >
            <Select
              options={employees.map((employee: any) => {
                return {
                  value: employee._id,
                  label: employee.lastName,
                };
              })}
            />
          </Form.Item>

          <Form.Item label="Sản phẩm" name="product">
            <Select
              options={products.map((product: any) => {
                return {
                  value: product._id,
                  label: product.name,
                };
              })}
            />
          </Form.Item>
          <Form.Item label="Số lượng" name="quantity">
            <InputNumber min={1} />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 8 }}>
            <Button type="primary" onClick={handleAddProduct}>
              Thêm sản phẩm
            </Button>
          </Form.Item>
          <Table
            className="w-50 my-0 mx-auto"
            dataSource={dataProduct}
            columns={columnsProduct}
          />
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

      <Table dataSource={Orders} columns={columns} />

      <Drawer
        title="Chi tiết đơn hàng"
        placement="right"
        onClose={onClose}
        open={open}
        width={800}
        style={{ marginRight: 50 }}
      >
        <Form
          form={formUpdateOrder}
          onFinish={onUpdateOrder}
          name="updateForm"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 8 }}
          layout="horizontal"
          style={{ marginTop: 40 }}
        >
          <Table dataSource={dataDetails} columns={columnsDetail} />

          <Form.Item label="Sản phẩm" name="product">
            <Select
              options={products.map((product: any) => {
                return {
                  value: product._id,
                  label: product.name,
                };
              })}
            />
          </Form.Item>

          <Form.Item label="Số lượng" name="quantity">
            <InputNumber min={1} />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 8 }}>
            <Button type="primary" onClick={handleAddProductDetail}>
              Thêm sản phẩm
            </Button>
          </Form.Item>
          <Table
            style={{
              width: "80%",
              margin: "0 auto",
            }}
            dataSource={dataProductDetail}
            columns={columnsProductDetail}
          />

          <Form.Item wrapperCol={{ offset: 8, span: 8 }}>
            <Button type="primary" htmlType="submit">
              Cập nhập
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
}
