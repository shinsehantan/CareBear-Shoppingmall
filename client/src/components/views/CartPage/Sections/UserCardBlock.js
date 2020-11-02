import React from "react";
import "./UserCardBlock.css";
import { Button } from "antd";

function UserCardBlock(props) {
  // props.products && console.log(props.products.product);

  const renderCartImage = (images) => {
    if (images.length > 0) {
      let image = images[0];
      return `http://localhost:8080/${image}`;
    }
  };

  const renderItems = () =>
    props.products &&
    props.products.map((product, index) => (
      <tr key={index}>
        <td>
          <img style={{ width: "70px" }} alt="product" src={renderCartImage(product.images)} />
        </td>
        <td>{product.quantity} EA</td>
        <td>{product.price} $</td>
        <td>
          <Button onClick={() => props.removeItem(product._id)}>Remove</Button>
        </td>
      </tr>
    ));

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Product Image</th>
            <th>Product Quantity</th>
            <th>Product Price</th>
            <th>Remove from Cart</th>
          </tr>
        </thead>
        <tbody>{renderItems()}</tbody>
      </table>
    </div>
  );
}

export default UserCardBlock;
