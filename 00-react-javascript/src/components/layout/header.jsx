import React, { useState } from "react";
import {
  MailOutlined,
  ProductFilled,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const items = [
    {
      label: <Link to={"/"}>Home</Link>,
      key: "Home",
      icon: <MailOutlined />,
    },
    {
      label: <Link to={"/users"}>Users</Link>,
      key: "users",
      icon: <UserOutlined />,
    },
    {
      label: <Link to={"/products"}>Products</Link>,
      key: "products",
      icon: <ProductFilled />,
    },
    {
      label: "Welcome TT",
      key: "SubMenu",
      icon: <SettingOutlined />,
      children: [
        {
          label: <Link to={"/login"}>Đăng nhập</Link>,
          key: "login",
        },
        {
          label: (
            <span
              onClick={() => {
                localStorage.clear("access_token");
                setCurrent("home");
                navigate("/");
              }}
            >
              Đăng xuất
            </span>
          ),
          key: "register",
        },
      ],
    },
  ];
  const [current, setCurrent] = useState("mail");
  const onClick = (e) => {
    console.log("click ", e);
    setCurrent(e.key);
  };
  return (
    <Menu
      onClick={onClick}
      selectedKeys={[current]}
      mode="horizontal"
      items={items}
    />
  );
};
export default Header;
