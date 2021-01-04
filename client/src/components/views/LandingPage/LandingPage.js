import React, { useState, useEffect } from 'react'
import { Icon, Row, Col, Card } from 'antd';
import styled from 'styled-components';
import Axios from 'axios';
import ImageSlider from '../../utils/ImageSlider';

const LandingTemplate = styled.div`
  width: 75%;
  margin: 3rem auto;
`;

const TitleDiv = styled.div`
  text-align: center;
`;

const NothingDiv = styled.div`
  display: flex;
  justify-content: center;
`;

const LoadMoreDiv = styled.div`
  display: flex;
  justify-content: center;
`;

const { Meta } = Card;

function LandingPage() {

  const [Products, setProducts] = useState([])

  useEffect(() => {
    Axios.get('/api/product/getProducts')
      .then(response => {
        if(response.data.success) {
          setProducts(response.data.products)
          console.log(response.data.products);
        } else {
          alert('제품 리스트를 가져오는데 실패했습니다')
        }
      })
  }, [])

  const renderCards = Products.map((product, index) => {
    return <Col lg={6} md={8} xs={24}>
      <Card hoverable={true}
            cover={<ImageSlider images={product.images} />}
      >
        <Meta title={product.title}
              description={`$${product.price}`} />
      </Card>
    </Col>
  })

  return (
      <LandingTemplate>
        <TitleDiv>
          <h2>어디로 여행 가시나요?<Icon type="rocket"/></h2>
        </TitleDiv>

        {Products.length === 0 ?
          <NothingDiv>
            <h2>제품이 없습니다</h2>
          </NothingDiv> :
          <div>
            <Row gutter={[16, 16]}>
              {renderCards}
            </Row>
          </div>
        }

        <br />
        <br />

        <LoadMoreDiv>
          <button>더 보기</button>
        </LoadMoreDiv>
      </LandingTemplate>
  )
}

export default LandingPage
