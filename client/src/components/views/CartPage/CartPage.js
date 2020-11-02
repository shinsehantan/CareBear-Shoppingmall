import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getCartItems, removeCartItem, onSuccessBuy } from "../../../_actions/user_actions";
import UserCardBlock from "./Sections/UserCardBlock";
import { Empty, Result } from "antd";
import Paypal from "../../utils/Paypal";

function CartPage(props) {
  const dispatch = useDispatch();
  const [Total, setTotal] = useState(0);
  const [ShowTotal, setShowTotal] = useState(false);
  const [ShowSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    let cartItems = [];

    //리덕스 user state안에 cart안에 상품이 들어있는지 확인

    if (props.user.userData && props.user.userData.cart) {
      if (props.user.userData.cart.length > 0) {
        props.user.userData.cart.forEach((item) => {
          cartItems.push(item.id);
        });

        dispatch(getCartItems(cartItems, props.user.userData.cart)).then((response) => {
          calculateTotal(response.payload);
        });
      }
    }
  }, [props.user.userData]);

  let calculateTotal = (cartDetail) => {
    let total = 0;

    cartDetail.map((item) => {
      total = total + parseInt(item.price, 10) * item.quantity;
      //   total += parseInt(item.price, 10) * item.quantity;
    });

    setTotal(total);
    setShowTotal(true);
  };

  let removeFromCart = (productId) => {
    dispatch(removeCartItem(productId)).then((response) => {
      console.log(response);
      if (response.payload.productInfo.length <= 0) {
        setShowTotal(false);
      }
    });
  };

  const transactionSuccess = (data) => {
    console.log("cartpage", data);

    dispatch(
      onSuccessBuy({
        paymentData: data,
        //프랍을 통해 가져온 payment(data)정보
        cartDetail: props.user.cartDetail,
        //리덕스 스토어에 있는 카트디테일 정보
      })
    ).then((response) => {
      console.log("cartpage2", response);
      if (response.payload.success) {
        setShowTotal(false);
        setShowSuccess(true);
      }
    });
  };

  return (
    <div style={{ width: "85%", margin: "3rem auto" }}>
      <h1>My Cart</h1>
      <div>
        <UserCardBlock products={props.user.cartDetail} removeItem={removeFromCart} />
        {/* <UserCardBlock products={props.user.cartDetail} /> */}
        {/* {props.user.cartDetail && <UserCardBlock2 products={props.user.cartDetail.product} />} */}
      </div>

      {/* 쇼토탈이 있을 경우 아래를 보여주는데 */}
      {ShowTotal ? (
        <div style={{ marginTop: "3rem" }}>
          <h2>Total Amount: ${Total}</h2>
        </div>
      ) : /* 그중에서도 쇼 석세스가 있을 경우 이부분을 보여주고 */
      ShowSuccess ? (
        <Result status="success" title="Successfully Purchased Items!" />
      ) : (
        /* 아니라면 이 부분을 보여준다. */
        <>
          <br />
          <br />
          <Empty description={false} />
          <br />
          <br />
          <h3>your cart is empty :(</h3>
        </>
      )}
      {ShowTotal && <Paypal total={Total} onSuccess={transactionSuccess} />}
    </div>
  );
}

export default CartPage;
