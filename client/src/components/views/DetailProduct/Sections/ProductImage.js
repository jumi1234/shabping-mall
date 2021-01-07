import React, { useState, useEffect } from 'react';
import ImageGallery from 'react-image-gallery';

function ProductImage(props) {

  const [Images, setImages] = useState([])

  useEffect(() => {
    if(props.detail.images && props.detail.images.length > 0) {
      let images = []
      props.detail.images.map(item => {
        images.push({
          original: `http://localhost:5000/${item}`,
          thumbnail: `http://localhost:5000/${item}`
        })
      })
      setImages(images)
    }
  // [] 빈 배열 주면 이미지 로드 안 됨 => props.detail(상품 데이터) 가져오기 전에 실행되기 때문
  // props.detail이 바뀔 때마다 실행
  }, [props.detail])

  return(
    <div>
      <ImageGallery items={Images} />
    </div>
  )
}

export default ProductImage;
