import React, { useState } from "react";
import { Input } from "antd";

const { Search } = Input;

function SearchFeature(props) {
  const [SearchTerm, setSearchTerm] = useState("");

  const searchHandler = (event) => {
    setSearchTerm(event.currentTarget.value);
    props.refreshFunction(event.currentTarget.value);
    //부모 컴포넌트로 업데이트 하는 방법
  };

  return (
    <div>
      <Search placeholder="input search text" onChange={searchHandler} style={{ width: 200 }} value={SearchTerm} />
    </div>
  );
}

export default SearchFeature;
