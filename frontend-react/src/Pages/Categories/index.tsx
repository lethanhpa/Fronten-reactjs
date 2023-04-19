import { Button, Form, Input, message, Modal, Pagination, Space, Table } from 'antd';
import axios from '../../libraries/axiosClient';
import React from 'react';

import { DeleteOutlined, EditOutlined } from '@ant-design/icons';

import type { ColumnsType } from 'antd/es/table';

const apiName = '/categories';

export default function Categories() {
  const [items, setItems] = React.useState<any[]>([]);
  const [refresh, setRefresh] = React.useState<number>(0);
  const [open, setOpen] = React.useState<boolean>(false);
  const [updateId, setUpdateId] = React.useState<number>(0);
  const [openTable, setOpenTable] = React.useState<boolean>(true);
  const [createForm] = Form.useForm();
  const [updateForm] = Form.useForm();
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setPageSize(pageSize || 10);
  };

  const columns: ColumnsType<any> = [
    {
      title: 'Id',
      dataIndex: '_id',
      key: '_id',
      width: '1%',
      align: 'right',
      render: (text, record, index) => {
        return <span>{index + 1}</span>;
      },
    },
    {
      title: 'Tên danh mục',
      dataIndex: 'name',
      key: 'name',
      render: (text, record, index) => {
        return <strong style={{ color: '#6c5ce7' }}>{text}</strong>;
      },
    },
    {
      title: 'Mô tả / Ghi chú',
      dataIndex: 'description',
      key: 'description',
    },

    {
      title: '',
      dataIndex: 'actions',
      key: 'actions',
      width: '1%',
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
                })
              }}
            />
          </Space>
        );
      },
    },
  ];

  // Call api to get data
  React.useEffect(() => {
    axios
      .get(apiName)
      .then((response) => {
        const { data } = response;
        console.log(data.length);
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
      .catch((err) => {
        console.error(err);
      });
  };

  const onUpdateFinish = (values: any) => {
    console.log(values);
    console.log(updateId);

    axios
      .patch(apiName + "/" + updateId, values)
      .then((response) => {
        setRefresh((f) => f + 1);
        updateForm.resetFields();
        message.success("Cập nhật thành công!", 1.5);
        setOpen(false);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ textAlign: "center" }}>Thêm danh mục</h1>
      <div style={{}}>
        {/* CREAT FORM */}
        <Form
        style={{ paddingTop: "24px", width:'80%' }}
          form={createForm}
          name='create-form'
          onFinish={onFinish}
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
        >
          <Form.Item
            label='Tên danh mục'
            name='name'
            hasFeedback
            required={true}
            rules={[
              {
                required: true,
                message: 'Tên danh mục bắt buộc phải nhập',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item label='Mô tả / Ghi chú' name='description'>
            <Input />
          </Form.Item>

          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            <Button type='primary' htmlType='submit'>
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
        title='Cập nhật danh mục'
        onCancel={() => {
          setOpen(false);
        }}
        cancelText='Đóng'
        okText='Lưu thông tin'
        onOk={() => {
          updateForm.submit();
        }}
      >
        <Form
          form={updateForm}
          name='update-form'
          onFinish={onUpdateFinish}
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
        >
          <Form.Item
            label='Tên danh mục'
            name='name'
            hasFeedback
            required={true}
            rules={[
              {
                required: true,
                message: 'Tên danh mục bắt buộc phải nhập',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item label='Mô tả / Ghi chú' name='description'>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
