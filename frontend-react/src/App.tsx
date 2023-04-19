import React from "react";
import "./App.css";
import "antd/dist/reset.css";
import Categories from "./Pages/Categories/index";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Layout } from "antd";
import { Content, Footer, Header } from "antd/es/layout/layout";
import Products from "./Pages/Products";
import Employees from "./Pages/Employees";
import Customers from "./Pages/Customers";
import Suppliers from "./Pages/Suppliers";
import Order from "./Pages/Orders";
import Home from "./Pages/Home";
import NavigationBar from "./components/NavigationBar";

const headerStyle: React.CSSProperties = {
  backgroundColor: "#001529",
};

const contentStyle: React.CSSProperties = {
  minHeight: "100vh",
  backgroundColor: "#ffffff",
};

const footerStyle: React.CSSProperties = {
  textAlign: "center",
  color: "#fff",
  backgroundColor: "#7dbcea",
};

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Header style={headerStyle}>
          <NavigationBar />
        </Header>
        <Content style={contentStyle}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/products" element={<Products />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/suppliers" element={<Suppliers />} />
            <Route path="/orders" element={<Order />} />
          </Routes>
        </Content>
        <Footer style={footerStyle}>Footer</Footer>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
