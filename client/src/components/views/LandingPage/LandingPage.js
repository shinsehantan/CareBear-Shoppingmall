import React, { useEffect, useState } from "react";
// import { FaCode } from "react-icons/fa";
import axios from "axios";
import { Col, Card, Row } from "antd";
import Meta from "antd/lib/card/Meta";
import ImageSlider from "../../utils/ImageSlider";
import CheckBox from "../LandingPage/Sections/CheckBox";
import { categories, price } from "../LandingPage/Sections/Datas";
import SearchFeature from "./Sections/SearchFeature";
import RadioBox from "../LandingPage/Sections/RadioBox";

function LandingPage() {
  const [Products, setProducts] = useState([]);
  const [Skip, setSkip] = useState(0);
  const [Limit, setLimit] = useState(8);
  const [PostSize, setPostSize] = useState(0);
  const [Filters, setFilters] = useState({
    categories: [],
    price: [],
  });
  const [SearchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    let body = {
      skip: Skip,
      limit: Limit,
    };

    getProducts(body);
  }, []);

  const getProducts = (body) => {
    axios.post("/api/product/products", body).then((response) => {
      if (response.data.success) {
        if (body.loadMore) {
          setProducts([...Products, ...response.data.productsInfo]);
        } else {
          setProducts(response.data.productsInfo);
        }
        setPostSize(response.data.postSize);
      } else {
        alert("상품을 가져오는 데 실패했습니다.");
      }
    });
  };

  const loadMoreHandler = () => {
    console.log("more1", Skip, Limit);

    let skip = Skip + Limit;
    let body = {
      skip: Skip,
      limit: Limit,
      loadMore: true,
    };

    getProducts(body);
    setSkip(skip);

    console.log("more2", skip, Limit);
  };

  const renderCards = Products.map((product, index) => {
    return (
      <Col lg={6} md={8} xs={24} key={index}>
        <Card
          cover={
            <a href={`/product/${product._id}`}>
              <ImageSlider images={product.images} />
            </a>
          }
        >
          <Meta title={product.title} description={`$${product.price}`} />
        </Card>
      </Col>
    );
  });

  const showFilteredResults = (filters) => {
    let body = {
      skip: 0,
      limit: Limit,
      filters: filters,
    };
    // console.log("ff");
    getProducts(body);
    setSkip(0);
  };

  const handlePrice = (value) => {
    const data = price;
    let array = [];

    for (let key in data) {
      if (data[key]._id === parseInt(value, 10)) {
        array = data[key].array;
      }
    }

    return array;
  };

  const handleFilters = (filters, option) => {
    //checkbox컴포넌트에서 클릭된 것들의 id만 담긴 어레이가 filters안에 들어있음

    const newFilters = { ...Filters };
    //newFilter에는 categories의 array와 price의 array가 들어감

    newFilters[option] = filters;
    //newFilters[option]이 가리키는 것은 categories의 array 아니면 price의 array인데
    //이것을 filters로 바꿔주는것

    console.log("filters", filters);

    if (option === "price") {
      let priceValues = handlePrice(filters);
      newFilters[option] = priceValues;
    }

    showFilteredResults(newFilters);
    setFilters(newFilters);
  };

  // const updateSearchTerm = (newSearchTerm) => {

  //   let body = {
  //     skip: 0,
  //     limit: Limit,
  //     filters: Filters,
  //     searchTerm: newSearchTerm,
  //   };

  //   setSkip(0);
  //   setSearchTerm(newSearchTerm);
  //   getProducts(body);
  // };

  const updateSearchTerm = (newSearchTerm) => {
    let body = {
      skip: 0,
      limit: Limit,
      filters: Filters,
      searchTerm: newSearchTerm,
    };

    setSkip(0);
    setSearchTerm(newSearchTerm);
    getProducts(body);
  };

  return (
    <div style={{ width: "75%", margin: "3rem auto" }}>
      <div style={{ textAlign: "center" }}>
        <h2> Collect Care Bear Items ! </h2>
        <br />
      </div>

      {/* Filter */}

      <Row gutter={[16, 16]}>
        <Col lg={12} xs={24}>
          {/* Check box */}
          <CheckBox list={categories} handleFilters={(filters) => handleFilters(filters, "categories")} />
        </Col>
        <Col lg={12} xs={24}>
          {/* Radio box */}
          {/* {console.log("Landing", price)} */}
          <RadioBox list={price} handleFilters={(filters) => handleFilters(filters, "price")} />
        </Col>
      </Row>

      {/* search */}
      <div style={{ display: "flex", justifyContent: "flex-end", margin: "1rem auto" }}>
        <SearchFeature refreshFunction={updateSearchTerm} />
      </div>
      {/* Cards */}

      <Row gutter={[16, 16]}>{renderCards}</Row>
      <br />

      {PostSize >= Limit && (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <button onClick={loadMoreHandler}>more items</button>
        </div>
      )}
    </div>
  );
}

export default LandingPage;
