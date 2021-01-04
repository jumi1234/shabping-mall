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
  const [Skip, setSkip] = useState(0)
  const [Limit, setLimit] = useState(8)
  const [PostSize, setPostSize] = useState(0)

  useEffect(() => {

    const variables = {
      skip: Skip,
      limit: Limit
    }

    getProducts(variables);
  }, [])

  const getProducts = (variables) => {
    Axios.post('/api/product/getProducts', variables)
      .then(response => {
        if(response.data.success) {
          setProducts([...Products, ...response.data.products])
          setPostSize(response.data.postSize);
        } else {
          alert('제품 리스트를 가져오는데 실패했습니다')
        }
      })
  }

  const onLoadMore = () => {
    let skip = Skip + Limit;

    const variables = {
      skip: skip,
      limit: Limit
    }

    getProducts(variables);
    setSkip(skip);
  }

  const renderCards = Products.map((product, index) => {
    return <Col lg={6} md={8} xs={24} key={index}>
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
          <h1>어디로 떠나고 싶으신가요?<Icon type="rocket"/></h1>
        </TitleDiv>

        {Products.length === 0 ?
          <NothingDiv>
            <h2>상품이 없습니다</h2>
          </NothingDiv> :
          <div>
            <Row gutter={[16, 16]}>
              {renderCards}
            </Row>
          </div>
        }

        <br />
        <br />

        {/* 더보기 해서 가져올 수 있는 제품이 8개 이상일 때만 더보기 버튼 노출 */}
        { PostSize >= Limit &&
          <LoadMoreDiv>
            <button onClick={onLoadMore}>더 보기</button>
          </LoadMoreDiv>
        }
      </LandingTemplate>
  )
}

export default LandingPage
