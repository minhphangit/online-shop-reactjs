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
  Upload,
} from "antd";
import numeral from "numeral";
import { QuestionCircleOutlined, UploadOutlined } from "@ant-design/icons";
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
  const [openAdd, setOpenAdd] = React.useState(false);
  //state selectedId product
  const [selectedId, setSelectedId] = React.useState(-1);
  const [fileList, setFileList] = React.useState<any[]>([]);
  //useHooks
  const [categories] = useGetAllData([], "categories", refresh);
  const [products] = useGetAllData([], "products", refresh);
  const [suppliers] = useGetAllData([], "suppliers", refresh);

  const { errorInsert, insertData } = useInsertData("products");
  const { errorUpdate, updateData } = useUpdateData("products");
  const { errorDelete, deleteData } = useDeleteData("products");

  const beforeUpload = (file: any) => {
    // Logic to handle file upload
    setFileList([...fileList, file]);
    return false; // Prevent default upload behavior
  };

  const onRemove = (file: any) => {
    // Logic to handle file removal
    setFileList(fileList.filter((item: any) => item.uid !== file.uid));
  };
  const handleFileChange = (info: any) => {
    let fileList = [...info.fileList];
    fileList = fileList.slice(-5); // Chỉ cho phép tải lên tối đa 5 tệp
    setFileList(fileList);
  };
  const onCreateProduct = async (values: any) => {
    // Example logic to submit both form data and images to the server
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("description", values.description);
    formData.append("price", values.price);
    formData.append("discount", values.discount);
    formData.append("stock", values.stock);
    formData.append("categoryId", values.categoryId);
    formData.append("supplierId", values.supplierId);
    fileList.forEach((file: any, index: any) => {
      formData.append("files", file.originFileObj);
    });

    const success = await insertData(formData);
    if (success) {
      setRefresh(!refresh);
      message.success("Insert Product successfully", 3);
      form.resetFields(["name", "price", "discount", "stock", "description"]);
      setOpenAdd(!openAdd);
      setFileList([]);
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
  const onDeleteProduct = async (_id: number) => {
    const success = await deleteData(_id);
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
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Hình ảnh",
      dataIndex: "images",
      key: "images",
      render: (text: any, record: any, index: number) => {
        if (record.images && record.images.length > 0) {
          return (
            <div>
              {record.images.map((image: any, index: number) => (
                <img
                  key={index}
                  src={`${image.url}`}
                  alt={`product-${index}`}
                  width="50px"
                  style={{ marginRight: "10px", marginBottom: "10px" }}
                />
              ))}
            </div>
          );
        } else {
          return <p>Không có hình ảnh</p>;
        }
      },
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
        return <span>Số lượng</span>;
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
      title: "",
      dataIndex: "actions",
      key: "actions",
      render: (text: any, record: any, index: number) => {
        return (
          <Space>
            <Button
              type="primary"
              onClick={() => {
                setOpen(true);
                setSelectedId(record._id);
                formUpdateProduct.setFieldsValue(record);
              }}
            >
              Sửa
            </Button>
            <Popconfirm
              title="Xoá sản phẩm"
              description="Bạn có chắc chắn xoá sản phẩm này không?"
              icon={<QuestionCircleOutlined style={{ color: "red" }} />}
              okButtonProps={{
                style: { backgroundColor: "red" },
              }}
              okText="Xoá"
              cancelText="Đóng"
              onConfirm={() => onDeleteProduct(record._id)}
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
      {/* Form Create new product */}
      <h3 className="text-center">QUẢN LÝ SẢN PHẨM </h3>
      <Modal
        title="Thêm mới sản phẩm"
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
          wrapperCol={{ span: 14 }}
          layout="horizontal"
          onFinish={onCreateProduct}
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
                  value: category._id,
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
                  value: supplier._id,
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
            <Input.TextArea rows={3} placeholder="Nhập mô tả " />
          </Form.Item>
          <Form.Item label="Hình ảnh">
            <Upload
              fileList={fileList}
              beforeUpload={beforeUpload}
              onRemove={onRemove}
              onChange={handleFileChange}
            >
              <Button icon={<UploadOutlined />}>Chọn hình ảnh</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>

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
                  value: category._id,
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
                  value: supplier._id,
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
      <Table rowKey="_id" dataSource={products} columns={columns} />
    </div>
  );
}
