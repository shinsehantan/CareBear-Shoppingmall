/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import { Menu, Icon, Badge } from "antd";
import axios from "axios";
import { USER_SERVER } from "../../../Config";
import { withRouter } from "react-router-dom";
import { useSelector } from "react-redux";
import "./LeftMenu.css";
// import { set } from "mongoose";

function RightMenu(props) {
  const user = useSelector((state) => state.user);
  const [CartNumber, setCartNumber] = useState(0);

  useEffect(() => {
    if (user.userData) {
      let Cart = user.userData.cart;
      let Total = 0;

      Cart &&
        Cart.map((item) => {
          Total = Total + item.quantity;
        });

      setCartNumber(Total);
    }
  }, [user.userData]);

  const logoutHandler = () => {
    axios.get(`${USER_SERVER}/logout`).then((response) => {
      if (response.status === 200) {
        props.history.push("/login");
      } else {
        alert("Log Out Failed");
      }
    });
  };

  if (user.userData && !user.userData.isAuth) {
    return (
      <Menu mode={props.mode} className="custom-menu">
        <Menu.Item key="mail">
          <a href="/login" style={{ color: "white" }}>
            Signin
          </a>
        </Menu.Item>
        <Menu.Item key="app">
          <a href="/register" style={{ color: "white" }}>
            Signup
          </a>
        </Menu.Item>
      </Menu>
    );
  } else {
    return (
      <Menu mode={props.mode} className="custom-menu">
        <Menu.Item key="history">
          <a style={{ color: "white" }} href="/history">
            history
          </a>
        </Menu.Item>

        <Menu.Item key="upload">
          <a style={{ color: "white" }} href="/upload/product">
            upload
          </a>
        </Menu.Item>

        <Menu.Item key="cart">
          <a href="/user/cart" className="head-example">
            <Badge count={CartNumber}>
              {/* {user.userData && console.log(user.userData.cart.length)} */}
              <Icon type="shopping-cart" style={{ fontSize: "20", marginBottom: "3" }} />
            </Badge>
          </a>
        </Menu.Item>

        <Menu.Item key="logout">
          <a style={{ color: "white" }} onClick={logoutHandler}>
            Logout
          </a>
        </Menu.Item>
      </Menu>
    );
  }
}

export default withRouter(RightMenu);
