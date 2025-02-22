import React, { useState } from 'react';
import { Checkbox, Collapse } from 'antd';

const { Panel } = Collapse;

function CheckBox(props) {

  const [Checked, setChecked] = useState([])

  const handleToggle = (value) => {
    const currentIndex = Checked.indexOf(value)   // value의 index 반환
    const newChecked = [...Checked];

    if(currentIndex === -1) {
      newChecked.push(value)    // index 값이 없으면 배열에 추가
    } else {
      newChecked.splice(currentIndex, 1)  // index 값이 있으면 배열에서 제거
    }

    setChecked(newChecked);
    props.handleFilters(newChecked);
  }

  // arrow function에서 {} 중괄호 사용 시 return 필수, () 괄호 사용 시 괄호 안 내용이 return
  const renderCheckboxLists = () => props.list && props.list.map((value, index) => (
    <React.Fragment key={index}>
      <Checkbox
        onChange={() => handleToggle(value._id)}
        type="checkbox"
        checked={Checked.indexOf(value._id) === -1 ? false : true}
      />
      <span>{value.name}</span>
    </React.Fragment>
  ))

  return (
    <div>
      <Collapse defaultActiveKey={['0']}>
        <Panel header="지역" key="1">
          {renderCheckboxLists()}
        </Panel>
      </Collapse>
    </div>
  )
}

export default CheckBox;
