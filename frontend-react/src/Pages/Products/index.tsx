  import {
    Button,
    Drawer,
    Form,
    Input,
    InputNumber,
    message,
    Modal,
    Pagination,
    Select,
    Space,
    Table,
  } from "antd";
  import axios from "../../libraries/axiosClient";
  import React from "react";

  import {
    ClearOutlined,
    DeleteOutlined,
    EditOutlined,
    FilterOutlined,
    SearchOutlined,
  } from "@ant-design/icons";
  import type { ColumnsType } from "antd/es/table";
  import numeral from "numeral";

  const apiName = "/products";

  export default function Products() {
    const [items, setItems] = React.useState<any[]>([]);
    const [categories, setCategories] = React.useState<any[]>([]);
    const [suppliers, setSuppliers] = React.useState<any[]>([]);

    const [priceStartSearch, setPriceStartSearch] = React.useState<any>("");
    const [priceEndSearch, setPriceEndSearch] = React.useState<any>("");
    const [discountEndSearch, setDiscountEndSearch] = React.useState<any>("");
    const [discountStartSearch, setDiscountStartSearch] = React.useState<any>("");
    const [stockEndSearch, setStockEndSearch] = React.useState<any>("");
    const [stockStartSearch, setStockStartSearch] = React.useState<any>("");
    const [categorySearch, setCategorySearch] = React.useState<string>("");
    const [supplierSearch, setSupplierSearch] = React.useState<string>("");
    const [dataSearch, setDataSearch] = React.useState<{}>({});
    const [nameSearch, setNameSearch] = React.useState<string>("");
    const [refresh, setRefresh] = React.useState<number>(0);
    const [open, setOpen] = React.useState<boolean>(false);

    const [updateId, setUpdateId] = React.useState<number>(0);
    const [openFilter, setOpenFilter] = React.useState<boolean>(false);
    const [showTable, setShowTable] = React.useState<boolean>(false);
    const [total, setTotal] = React.useState<number>(0);
    const [skip, setSkip] = React.useState<number>(0);

    const [createForm] = Form.useForm();
    const [updateForm] = Form.useForm();
    const [handleSearch] = Form.useForm();
    const showDrawer = () => {
      setOpenFilter(true);
    };

    const onClose = () => {
      setOpenFilter(false);
    };

    const onClearSearch = () => {
      setNameSearch("");
      setSupplierSearch("");
      setCategorySearch("");
      setPriceStartSearch("");
      setPriceEndSearch("");
      setDiscountEndSearch("");
      setDiscountStartSearch("");
      setStockEndSearch("");
      setStockStartSearch("");
      setDataSearch({});
    };
    const onSearch = () => {
      if (
        nameSearch === "" &&
        categorySearch === "" &&
        supplierSearch === "" &&
        stockStartSearch === "" &&
        stockEndSearch === "" &&
        priceStartSearch === "" &&
        priceEndSearch === "" &&
        discountStartSearch === "" &&
        discountEndSearch === ""
      ) {
        return;
      }
      setDataSearch({
        ...(nameSearch !== "" && { productName: nameSearch }),
        ...(categorySearch !== "" && { category: categorySearch }),
        ...(supplierSearch !== "" && { supplier: supplierSearch }),
        ...(supplierSearch !== "" && { supplier: supplierSearch }),
        ...(stockStartSearch !== "" && { stockStart: stockStartSearch }),
        ...(stockEndSearch !== "" && { stockEnd: stockEndSearch }),
        ...(priceStartSearch !== "" && { priceStart: priceStartSearch }),
        ...(priceEndSearch !== "" && { priceEnd: priceEndSearch }),
        ...(discountStartSearch !== "" && { discountStart: discountStartSearch }),
        ...(discountEndSearch !== "" && { discountEnd: discountEndSearch }),
      });
      console.log(dataSearch);
      setTotal(items.length);
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
        title: "Tên danh mục",
        dataIndex: "category.name",
        key: "category.name",
        render: (text, record, index) => {
          return <span>{record.category.name}</span>;
        },
      },
      {
        title: "Nhà cung cấp",
        dataIndex: "supplier.name",
        key: "supplier.name",
        render: (text, record, index) => {
          return <span>{record.supplier.name}</span>;
        },
      },
      {
        title: "Tên sản phẩm",
        dataIndex: "name",
        key: "name",
        render: (text, record, index) => {
          return <strong>{text}</strong>;
        },
      },
      {
        title: "Giá bán",
        dataIndex: "price",
        key: "price",
        align: "right",
        render: (text, record, index) => {
          return <span>{numeral(text).format("0,0")}</span>;
        },
      },
      {
        title: "Giảm",
        dataIndex: "discount",
        key: "discount",
        align: "right",
        render: (text, record, index) => {
          return <span>{numeral(text).format("0,0")}%</span>;
        },
      },
      {
        title: () => {
          return <div style={{ whiteSpace: "nowrap" }}>Tồn kho</div>;
        },
        dataIndex: "stock",
        key: "stock",
        width: "1%",
        align: "right",
        render: (text, record, index) => {
          return <span>{numeral(text).format("0,0")}</span>;
        },
      },
      {
        title: "Mô tả / Ghi chú",
        dataIndex: "description",
        key: "description",
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

    // Get products
    React.useEffect(() => {
      axios
        .get(apiName, {
          params: {
            skip: skip,
            limit: 10,
            ...dataSearch,
          },
        })
        .then((response) => {
          const result = response.data;

          setItems(result.data);
          setTotal(result.total);
        })
        .catch((err) => {
          console.error(err);
        });
    }, [refresh, showTable, skip, dataSearch]);

    // Get categories
    React.useEffect(() => {
      axios
        .get("/categories")
        .then((response) => {
          const { data } = response;
          setCategories(data);
        })
        .catch((err) => {
          console.error(err);
        });
    }, []);

    // Get suppliers
    React.useEffect(() => {
      axios
        .get("/suppliers")
        .then((response) => {
          const { data } = response;
          setSuppliers(data);
        })
        .catch((err) => {
          console.error(err);
        });
    }, []);

    const onFinish = (values: any) => {
      console.log(values);

      axios
        .post(apiName, values)
        .then((response) => {
          setRefresh((f) => f + 1);
          createForm.resetFields();
          message.success("Thêm mới danh mục thành công!", 1.5);
          setShowTable(true);
        })
        .catch((err) => {
          console.error(err);
        });
    };
    const handlePageChange = (page: number) => {
      setSkip((page - 1) * 10);
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
      <div style={{ padding: "24px 24px 24px" }}>
        {showTable === false ? (
          <>
            <h1 style={{ textAlign: "center" }}>Thêm danh mục</h1>
            {/* CREAT FORM */}
            <Form
              style={{ paddingTop: "24px", width: "80%" }}
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
                label="Danh mục sản phẩm"
                name="categoryId"
                hasFeedback
                required={true}
                rules={[
                  {
                    required: true,
                    message: "Danh mục sản phẩm bắt buộc phải chọn",
                  },
                ]}
              >
                <Select
                  style={{ width: "100%" }}
                  options={categories.map((c) => {
                    return { value: c._id, label: c.name };
                  })}
                />
              </Form.Item>

              <Form.Item
                label="Nhà cung cấp"
                name="supplierId"
                hasFeedback
                required={true}
                rules={[
                  {
                    required: true,
                    message: "Nhà cung cấp bắt buộc phải chọn",
                  },
                ]}
              >
                <Select
                  style={{ width: "100%" }}
                  options={suppliers.map((c) => {
                    return { value: c._id, label: c.name };
                  })}
                />
              </Form.Item>
              <Form.Item
                label="Tên sản phẩm"
                name="name"
                hasFeedback
                required={true}
                rules={[
                  {
                    required: true,
                    message: "Tên sản phẩm bắt buộc phải nhập",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Giá bán"
                name="price"
                hasFeedback
                required={true}
                rules={[
                  {
                    required: true,
                    message: "Giá bán bắt buộc phải nhập",
                  },
                ]}
              >
                <InputNumber style={{ width: 200 }} />
              </Form.Item>

              <Form.Item label="Giảm giá" name="discount" hasFeedback>
                <InputNumber style={{ width: 200 }} />
              </Form.Item>

              <Form.Item label="Tồn kho" name="stock" hasFeedback>
                <InputNumber style={{ width: 200 }} />
              </Form.Item>

              <Form.Item label="Mô tả / Ghi chú" name="description" hasFeedback>
                <Input style={{ width: 200 }} />
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
          </>
        ) : (
          <>
            <Button
              type="dashed"
              onClick={showDrawer}
              style={{ marginBottom: "5px" }}
              icon={<FilterOutlined />}
            >
              Filter
            </Button>
            <Drawer
              title="Filter Product"
              placement="right"
              width={500}
              onClose={onClose}
              open={openFilter}
            >
              {/* search name product */}
              <Form
                form={handleSearch}
                name="search-form"
                onFinish={onFinish}
                labelCol={{
                  span: 8,
                }}
                wrapperCol={{
                  span: 16,
                }}
              >
                <Form.Item
                  label="Tên sản phẩm"
                  name="name"
                  hasFeedback={nameSearch === "" ? false : true}
                  valuePropName={nameSearch}
                >
                  <Input
                    value={nameSearch}
                    onChange={(e) => {
                      setNameSearch(e.target.value);
                    }}
                  />
                </Form.Item>
                <Form.Item
                  label="Danh mục sản phẩm"
                  name="category"
                  hasFeedback={categorySearch === "" ? false : true}
                  valuePropName={categorySearch}
                >
                  <Select
                    onChange={(value) => {
                      setCategorySearch(value);
                    }}
                    value={categorySearch}
                    style={{ width: "100%" }}
                    options={categories.map((c) => {
                      return { value: c._id, label: c.name };
                    })}
                  />
                </Form.Item>
                <Form.Item
                  label="Nhà cung cấp"
                  name="supplier"
                  hasFeedback={supplierSearch === "" ? false : true}
                  valuePropName={supplierSearch}
                >
                  <Select
                    style={{ width: "100%" }}
                    onChange={(value) => {
                      setSupplierSearch(value);
                    }}
                    value={supplierSearch}
                    options={suppliers.map((c) => {
                      return { value: c._id, label: c.name };
                    })}
                  />
                </Form.Item>
                <Form.Item label="Tồn kho">
                  <Space>
                    <InputNumber
                      onChange={(value) => {
                        setStockStartSearch(value);
                      }}
                      value={stockStartSearch}
                    />
                    <InputNumber
                      onChange={(value) => {
                        setStockEndSearch(value);
                      }}
                      value={stockEndSearch}
                    />
                  </Space>
                </Form.Item>

                <Form.Item label="Giá bán">
                  <Space>
                    <InputNumber
                      onChange={(value) => {
                        setPriceStartSearch(value);
                      }}
                      value={priceStartSearch}
                    />
                    <InputNumber
                      onChange={(value) => {
                        setPriceEndSearch(value);
                      }}
                      value={priceEndSearch}
                    />
                  </Space>
                </Form.Item>

                <Form.Item label="Giảm giá">
                  <Space>
                    <InputNumber
                      onChange={(value) => {
                        setDiscountStartSearch(value);
                      }}
                      value={discountStartSearch}
                    />
                    <InputNumber
                      onChange={(value) => {
                        setDiscountEndSearch(value);
                      }}
                      value={discountEndSearch}
                    />
                  </Space>
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                  <Button onClick={onClearSearch} style={{ marginRight: "5px" }}>
                    Clear
                    <ClearOutlined />
                  </Button>
                  <Button onClick={onSearch}>
                    Search
                    <SearchOutlined />
                  </Button>
                </Form.Item>
              </Form>
            </Drawer>
            <Table
              rowKey="id"
              dataSource={items}
              columns={columns}
              pagination={false}
            />
            <Pagination
            style={{padding: '12px'}}
              total={total}
              onChange={handlePageChange} // Gọi hàm xử lý khi người dùng thay đổi trang
            />

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
                  label="Danh mục sản phẩm"
                  name="categoryId"
                  hasFeedback
                  required={true}
                  rules={[
                    {
                      required: true,
                      message: "Danh mục sản phẩm bắt buộc phải chọn",
                    },
                  ]}
                >
                  <Select
                    style={{ width: "100%" }}
                    options={categories.map((c) => {
                      return { value: c._id, label: c.name };
                    })}
                  />
                </Form.Item>

                <Form.Item
                  label="Nhà cung cấp"
                  name="supplierId"
                  hasFeedback
                  required={true}
                  rules={[
                    {
                      required: true,
                      message: "Nhà cung cấp bắt buộc phải chọn",
                    },
                  ]}
                >
                  <Select
                    style={{ width: "100%" }}
                    options={suppliers.map((c) => {
                      return { value: c._id, label: c.name };
                    })}
                  />
                </Form.Item>
                <Form.Item
                  label="Tên sản phẩm"
                  name="name"
                  hasFeedback
                  required={true}
                  rules={[
                    {
                      required: true,
                      message: "Tên sản phẩm bắt buộc phải nhập",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  label="Giá bán"
                  name="price"
                  hasFeedback
                  required={true}
                  rules={[
                    {
                      required: true,
                      message: "Giá bán bắt buộc phải nhập",
                    },
                  ]}
                >
                  <InputNumber style={{ width: 200 }} />
                </Form.Item>

                <Form.Item label="Giảm giá" name="discount" hasFeedback>
                  <InputNumber style={{ width: 200 }} />
                </Form.Item>

                <Form.Item label="Tồn kho" name="stock" hasFeedback>
                  <InputNumber style={{ width: 200 }} />
                </Form.Item>

                <Form.Item label="Mô tả / Ghi chú" name="description" hasFeedback>
                  <Input style={{ width: 200 }} />
                </Form.Item>
              </Form>
            </Modal>
          </>
        )}
      </div>
    );
  }
