import React, { useState } from 'react'
import styled from 'styled-components'
import Dropzone from 'react-dropzone'
import { Icon } from 'antd'
import Axios from 'axios'

const DropzoneTemplate = styled.div`
  display: flex;
  justify-content: space-between;
`;

function FileUpload(props) {

  const [Images, setImages] = useState([])

  const onDrop = (files) => {
    let formData = new FormData();
    const config = {
      header: {'content-type': 'multipart/form-data'}
    }
    formData.append("file", files[0])

    Axios.post('/api/product/uploadImage', formData, config)
      .then(response => {
        if(response.data.success) {
          setImages([ ...Images, response.data.image ])
          props.refreshFunction([ ...Images, response.data.image ])
        } else {
          alert("")
        }
      })
  }

  const onDelete = (image) => {
    const currentIndex = Images.indexOf(image);   // image의 index 추출

    let newImages = [...Images]
    newImages.splice(currentIndex, 1)

    setImages(newImages)
    props.refreshFunction(newImages)
  }

  return (
    <DropzoneTemplate>
      <Dropzone onDrop={onDrop} multiple={false} maxSize={800000000}>
        {({ getRootProps, getInputProps }) => (
          <div style={{ width: '300px', height: '240px', border: '1px solid lightgray', display: 'flex', alignItems: 'center', justifyContent: 'center'}}
            {...getRootProps()}
          >
            <input {...getInputProps()} />
            <Icon type="plus" style={{fontSize: '3rem'}} />
          </div>
        )}
      </Dropzone>

      <div style={{ display: 'flex', width: '350px', height: '240px', overflowX: 'scroll' }}>

        {Images.map((image, index) => (
          <div onClick={() => onDelete(image)}>
            <img style={{ minWidth: '300px', width: '300px', height: '240px' }} src={`http://localhost:5000/${image}`} alt={`productImg-${index}`} />
          </div>
        ))}
        <div onClick>
          <img />
        </div>
      </div>
    </DropzoneTemplate>
  )

}

 export default FileUpload
