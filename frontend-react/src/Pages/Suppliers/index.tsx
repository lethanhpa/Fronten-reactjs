import {
  Button,
  Form,
  Input,
  message,
  Modal,
  Pagination,
  Space,
  Table,
} from "antd";
import axios from "../../libraries/axiosClient";
import React from "react";

import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

import type { ColumnsType } from "antd/es/table";

const apiName = "/suppliers";

export default function Suppliers() {
  const [items, setItems] = React.useState<any[]>([]);

  const [refresh, setRefresh] = React.useState<number>(0);
  const [open, setOpen] = React.useState<boolean>(false);
  const [updateId, setUpdateId] = React.useState<number>(0);

  const [createForm] = Form.useForm();
  const [updateForm] = Form.useForm();
  const [openTable, setOpenTable] = React.useState<boolean>(true);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setPageSize(pageSize || 10);
  };

  const columns: ColumnsType<any> = [
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
      width: "1%",
      align: "right",
      render: (text, record, index) => {
        return <span>{index + 1}</span>;
      },
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      align: "center",
      render: (text, record, index) => {
        return <strong>{text}</strong>;
      },
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      align: "center",
      render: (text, record, index) => {
        return <span>{text}</span>;
      },
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      align: "center",
      render: (text, record, index) => {
        return <span>{text}</span>;
      },
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      align: "center",
      render: (text, record, index) => {
        return <span>{text}</span>;
      },
    },
    {
      title: "",
      dataIndex: "actions",
      key: "actions",
      width: "1%",
      render: (text, record, index) => {
        return (
          <Space>
            <Button
              icon={<EditOutlined />}
              onClick={() => {
                setOpen(true);
                setUpdateId(record._id);
                updateForm.setFieldsValue(record);
              }}
            />
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={() => {
                console.log(record._id);
                axios.delete(apiName + "/" + record._id).then((response) => {
                  setRefresh((f) => f + 1);
                  message.success("Xóa danh mục thành công!", 1.5);
                });
              }}
            />
          </Space>
        );
      },
    },
  ];

  // Get employees
  React.useEffect(() => {
    axios
      .get(apiName)
      .then((response) => {
        const { data } = response;
        setItems(data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [refresh]);

  const onFinish = (values: any) => {
    console.log(values);

    axios
      .post(apiName, values)
      .then((response) => {
        setRefresh((f) => f + 1);
        createForm.resetFields();
        setOpenTable(true);
        message.success("Thêm mới danh mục thành công!", 1.5);
      })
      .catch((err) => {});
  };

  const onUpdateFinish = (values: any) => {
    axios
      .patch(apiName + "/" + updateId, values)
      .then((response) => {
        setRefresh((f) => f + 1);
        updateForm.resetFields();
        message.success("Cập nhật thành công!", 1.5);
        setOpen(false);
      })
      .catch((err) => {});
  };

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{textAlign:'center'}}>Thêm danh mục</h1>
      <div style={{}}>
        {/* CREAT FORM */}
        <Form
        style={{ paddingTop: "24px", width:'80%' }}
          form={createForm}
          name="create-form"
          onFinish={onFinish}
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
        >
          <Form.Item
            label="Name"
            name="name"
            hasFeedback
            required={true}
            rules={[
              {
                required: true,
                message: "Tên bắt buộc phải nhập",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Phone Number" name="phoneNumber" hasFeedback>
            <Input />
          </Form.Item>

          <Form.Item label="Address" name="address" hasFeedback>
            <Input />
          </Form.Item>

          <Form.Item label="Email" name="email" hasFeedback>
            <Input />
          </Form.Item>

          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            <Button type="primary" htmlType="submit">
              Lưu thông tin
            </Button>
          </Form.Item>
        </Form>
      </div>
      {/* TABLE */}
      <Modal
        width={1000}
        open={openTable}
        onCancel={() => {
          setOpenTable(false);
        }}
        onOk={() => {
          setOpenTable(false);
        }}
      >
        <Table
          rowKey="_id"
          dataSource={items.slice((currentPage - 1) * 10, currentPage * 10)}
          columns={columns}
          pagination={false}
        />
        <Pagination
          style={{ paddingTop: "24px" }}
          total={items.length}
          current={currentPage}
          pageSize={10}
          onChange={handlePageChange}
        />
      </Modal>

      {/* EDIT FORM */}

      <Modal
        open={open}
        title="Cập nhật danh mục"
        onCancel={() => {
          setOpen(false);
        }}
        cancelText="Đóng"
        okText="Lưu thông tin"
        onOk={() => {
          updateForm.submit();
        }}
      >
        <Form
          form={updateForm}
          name="update-form"
          onFinish={onUpdateFinish}
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
        >
          <Form.Item
            label="Name"
            name="name"
            hasFeedback
            required={true}
            rules={[
              {
                required: true,
                message: "Tên bắt buộc phải nhập",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Phone Number" name="phoneNumber" hasFeedback>
            <Input />
          </Form.Item>

          <Form.Item label="Address" name="address" hasFeedback>
            <Input />
          </Form.Item>

          <Form.Item label="Email" name="email" hasFeedback>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
