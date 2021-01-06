import React, { useState } from 'react';
import { Collapse, Radio } from 'antd';

const { Panel } = Collapse;

const price = [
  {
    "_id": 0,
    "name": "선택 안 함",
    "array": []
  },
  {
    "_id": 1,
    "name": "₩0~₩99000",
    "array": [0, 99000]
  },
  {
    "_id": 2,
    "name": "₩100000~₩199000",
    "array": [100000, 199000]
  },
  {
    "_id": 3,
    "name": "₩200000~₩299000",
    "array": [200000, 299000]
  },
  {
    "_id": 4,
    "name": "₩300000 이상",
    "array": [300000, 10000000]
  }
]

function RadioBox(props) {

  const [Value, setValue] = useState(0)

  const renderRadioBox = () => (
    price.map((value) => (
      <Radio key={value._id} value={`${value._id}`}>{value.name}</Radio>
    ))
  )

  const handleChange = (e) => {
    setValue(e.target.value)
    props.handleFilters(e.target.value)
  }

  return(
    <div>
      <Collapse defaultActiveKey={['0']}>
        <Panel header="가격" key="1">
          <Radio.Group onChange={handleChange} value={Value}>
            {renderRadioBox()}
          </Radio.Group>
        </Panel>
      </Collapse>
    </div>

  )
}

export default RadioBox;
