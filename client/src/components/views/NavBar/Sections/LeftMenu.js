import React from "react";
import { Menu } from "antd";
import "./LeftMenu.css";
// const SubMenu = Menu.SubMenu;
// const MenuItemGroup = Menu.ItemGroup;

function LeftMenu(props) {
  return (
    <Menu mode={props.mode} className="custom-menu">
      <Menu.Item key="mail">
        <a className="test" style={{ color: "white" }} href="/">
          Home
        </a>
      </Menu.Item>
    </Menu>
  );
}

export default LeftMenu;
