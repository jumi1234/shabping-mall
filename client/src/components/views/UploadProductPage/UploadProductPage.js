import React, { useState } from 'react'
import styled from 'styled-components'
import { Typography, Button, Form, message, Input, Icon } from 'antd'
import FileUpload from '../../utils/FileUpload'
import Axios from 'axios';

const { Title } = Typography;
const { TextArea } = Input;

const UploadTemplate = styled.div`
  max-width: 700px;
  margin: 2rem auto;

  > * {
    &:first-child {
      text-align: center;
      margin-bottom: 2rem;
    }
  }
`;

const Continents = [
  {key: 1, value: "Africa"},
  {key: 2, value: "Asia"},
  {key: 3, value: "Europe"},
  {key: 4, value: "North America"},
  {key: 5, value: "South America"},
  {key: 6, value: "Australia"},
  {key: 7, value: "Antarctica"}
]

function UploadProductPage(props) {

  const [TitleValue, setTitleValue] = useState("")
  const [DescriptionValue, setDescriptionValue] = useState("")
  const [PriceValue, setPriceValue] = useState(0)
  const [ContinentValue, setContinentValue] = useState(1)
  const [Images, setImages] = useState([])

  const onTitleChange = (e) => {
    setTitleValue(e.currentTarget.value)
  }

  const onDescriptionChange = (e) => {
    setDescriptionValue(e.currentTarget.value)
  }

  const onPriceChange = (e) => {
    setPriceValue(e.currentTarget.value)
  }

  const onContinentChange = (e) => {
    setContinentValue(e.currentTarget.value)
  }

  const uploadImages = (newImages) => {
    setImages(newImages)
  }

  const onSubmit = (e) => {
    e.preventDefault();

    const variables = {
      writer: props.user.userData._id,
      title: TitleValue,
      description: DescriptionValue,
      price: PriceValue,
      images: Images,
      continents: ContinentValue,
    }

    Axios.post('/api/product/uploadProduct', variables)
      .then(response => {
        if(response.data.success) {
          alert('제품 업로드에 성공했습니다');
          props.history.push('/')
        } else {
          alert('업로드에 실패했습니다')
        }
      })
  }

  return (
    <UploadTemplate>
      <div>
        <Title level={2}>Upload Product</Title>
      </div>

      <Form onSubmit={onSubmit}>

        <FileUpload refreshFunction={uploadImages} />

        <br />
        <br />

        <label>Title</label>
        <Input onChange={onTitleChange} value={TitleValue} />

        <br />
        <br />

        <label>Description</label>
        <TextArea onChange={onDescriptionChange} value={DescriptionValue} />

        <br />
        <br />

        <label>Price(₩)</label>PriceValue
        <Input onChange={onPriceChange} value={PriceValue} type="number" />

        <select onChange={onContinentChange}>
          {Continents.map(item => (
            <option key={item.key} value={item.key}>
              {item.value}
            </option>
          ))}

        </select>

        <br />
        <br />

        <Button onClick={onSubmit}>
          Submit
        </Button>

      </Form>
    </UploadTemplate>
  )

}

export default UploadProductPage
