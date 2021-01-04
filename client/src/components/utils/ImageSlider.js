import React from 'react';
import { Carousel } from 'antd';
import styled from 'styled-components';

const ImgDiv = styled.div`
  img {
    width: 100%;
    height: 150px;
  }
`;

function ImageSlider(props) {
  return (
    <div>
      <Carousel autoplay>
        {props.images.map((image, index) => (
          <ImgDiv key={index}>
            <img src={`http://localhost:5000/${image}`} alt="productImg" />
          </ImgDiv>
        ))}
      </Carousel>
    </div>
  )
}

export default ImageSlider;
