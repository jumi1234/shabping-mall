import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Axios from 'axios';
import ProductImage from './Sections/ProductImage';
import ProductInfo from './Sections/ProductInfo';
import { Row, Col } from 'antd';

const DetailTemplate = styled.div`
  width: 100%;
  padding: 3rem 4rem;

  div {
    display: flex;
    justify-content: center;
  }
`;

function DetailProduct(props) {

  // Landing 페이지에서 상품 클릭 시 url로 넘어오는 _id 값 가져오기
  const productId = props.match.params.productId;

  const [Product, setProduct] = useState({})

  useEffect(() => {
    Axios.get(`/api/product/product_by_id?id=${productId}&type=single`)
      .then(response => {
        if(response.data.success) {
          console.log(response.data);
          // 상품 데이터 push
          setProduct(response.data.product[0])
        } else {
          alert('상세 정보 가져오기를 실패했습니다')
        }
      })
  }, [])

  return(
    <DetailTemplate>
      <div>
        <h1>{Product.title}</h1>
      </div>

      <br />

      <Row gutter={[16, 16]}>
        <Col lg={12} sm={24}>
          {/* Product Image */}
          <ProductImage detail={Product} />
        </Col>
        <Col lg={12} sm={24}>
          {/* Product Info */}
          <ProductInfo />
        </Col>
      </Row>

    </DetailTemplate>
  )
}

export default DetailProduct;
