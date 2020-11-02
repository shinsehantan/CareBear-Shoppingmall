import React, { useState } from "react";
import { Button, Input, Form } from "antd";
import FileUpload from "../../utils/FileUpload";
import Axios from "axios";
const { TextArea } = Input;

const Categories = [
  { key: 1, value: "doll" },
  { key: 2, value: "clothes" },
  { key: 3, value: "phone case" },
  { key: 4, value: "stickers" },
  { key: 5, value: "mobile acc" },
  { key: 6, value: "note" },
  { key: 7, value: "pen" },
];

function UploadProductPage(props) {
  const [Title, setTitle] = useState("");
  const [Description, setDescription] = useState("");
  const [Price, setPrice] = useState(0);
  const [Category, setCategory] = useState(1);
  const [Images, setImages] = useState([]);

  const TitleHandler = (event) => {
    setTitle(event.currentTarget.value);
  };

  const DescriptionHandler = (event) => {
    setDescription(event.currentTarget.value);
  };

  const PriceHandler = (event) => {
    setPrice(event.currentTarget.value);
  };

  const CategoryHandler = (event) => {
    setCategory(event.currentTarget.value);
  };

  const updateImages = (newImages) => {
    setImages(newImages);
  };

  const submitHandler = (event) => {
    event.preventDefault();

    if (!Title || !Description || !Price || !Category || !Images) {
      return alert(" 모든 값을 넣어주셔야 합니다. ");
    }

    // 서버에 채운 값들을 request로 보낸다.

    const body = {
      //로그인된 사람의 정보, auth.js에서 props로 받아오기
      writer: props.user.userData._id,
      title: Title,
      description: Description,
      price: Price,
      category: Category,
      images: Images,
    };

    Axios.post("/api/product", body).then((response) => {
      if (response.data.success) {
        console.log(response.data);
        alert(" 상품 업로드에 성공했습니다. ");
        props.history.push("/");
      } else {
        alert(" 상품 업로드에 실패했습니다. ");
      }
    });
  };

  return (
    <div style={{ maxWidth: "700px", margin: "2rem auto" }}>
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <h2 style={{ color: "#5E5C5C", fontFamily: "Lucida Sans Unicode Lucida Grande sans-serif" }}>상품 업로드</h2>
      </div>

      <Form onSubmit={submitHandler}>
        <FileUpload refreshFunction={updateImages} />
        <br />
        <br />

        <label>Title</label>
        <Input onChange={TitleHandler} value={Title} />
        <br />
        <br />

        <label>Description</label>
        <TextArea onChange={DescriptionHandler} value={Description} />
        <br />
        <br />

        <label>Price($)</label>
        <Input onChange={PriceHandler} value={Price} />
        <br />
        <br />

        <select onChange={CategoryHandler} value={Category}>
          {Categories.map((item) => (
            <option key={item.key} value={item.key}>
              {item.value}
            </option>
          ))}
        </select>

        <br />
        <br />

        <Button type="submit" onClick={submitHandler}>
          submit
        </Button>
      </Form>
    </div>
  );
}

export default UploadProductPage;
