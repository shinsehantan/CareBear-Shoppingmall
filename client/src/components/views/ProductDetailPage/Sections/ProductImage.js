import React, { useState, useEffect } from "react";
import ImageGallery from "react-image-gallery";

function ProductImage(props) {
  const [Images, setImages] = useState([]);

  useEffect(() => {
    if (props.detail.images && props.detail.images.length > 0) {
      let images = [];

      props.detail.images.map((item) => {
        images.push({
          original: `http://localhost:8080/${item}`,
          thumbnail: `http://localhost:8080/${item}`,
        });
      });
      setImages(images);
    }
  }, [props.detail]);

  //[props.detail]을 해주는 이유는
  //props.detail값이 바뀔 때마다 useEffect를 실행시켜주라는 뜻

  return (
    <div>
      <ImageGallery items={Images} />
    </div>
  );
}

export default ProductImage;
