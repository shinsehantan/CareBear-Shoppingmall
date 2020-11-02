import React, { useState } from "react";
import { Collapse, Checkbox } from "antd";

const { Panel } = Collapse;

function CheckBox(props) {
  const [Checked, setChecked] = useState([]);

  const handleToggle = (value) => {
    //누른 것의 index를 구하고
    //indexOf는 없는 값으로 찾으면 -1이 나오고
    //있는 값으로 찾으면 해당 값의 인덱스를 찾아주는 메소드
    //그래서 체크된 값이 없다면 -1이 나오게 됨
    const currentIndex = Checked.indexOf(value);

    //전체 checked된 state에서
    const newChecked = [...Checked];

    //없다면 state에 넣어주고
    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      //현재 누른 check 박스가 있다면 빼주고
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
    props.handleFilters(newChecked);
  };

  const renderCheckboxLists = () =>
    props.list &&
    props.list.map((value, index) => (
      <React.Fragment key={index}>
        <Checkbox
          onChange={() => handleToggle(value._id)}
          checked={Checked.indexOf(value._id) === -1 ? false : true}
          //Checked에서 인덱스를 찾았을때 없는 값이면 false로 체크하지 않고, 있는 값이면 true로 체크하기
        />
        <span>{value.name}</span>
      </React.Fragment>
    ));

  return (
    <div>
      <Collapse defaultActiveKey={["0"]}>
        <Panel header="Categories" key="1">
          {renderCheckboxLists()}
        </Panel>
      </Collapse>
    </div>
  );
}

export default CheckBox;
