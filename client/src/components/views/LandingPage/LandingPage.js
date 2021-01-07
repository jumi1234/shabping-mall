import React, { useState, useEffect } from 'react'
import { Icon, Row, Col, Card } from 'antd';
import styled from 'styled-components';
import Axios from 'axios';
import ImageSlider from '../../utils/ImageSlider';
import CheckBox from './Sections/CheckBox';
import RadioBox from './Sections/RadioBox';
import { continents, price } from './Sections/Datas';

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
  const [Filters, setFilters] = useState({
    continents: [],
    price: []
  })

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
          if(variables.loadMore) {
            // 더보기 눌렀을 때만 기존 데이터 + 필터링한 데이터 추가
            setProducts([...Products, ...response.data.products])
          } else {
            // 더보기 안 눌렀을 때는 조건 해당하는 상품 리스트 전체 가져오기
            setProducts(response.data.products)
          }
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
      limit: Limit,
      loadMore: true,
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

  // filter에 따라 상품 리스트 다시 가져와야 하기 때문에 trigger 생성
  const showFilteredResults = (filters) => {

    const variables = {
      skip: 0,
      limit: Limit,
      filters: filters
    }

    getProducts(variables)
    setSkip(0)
  }

  const handlePrice = (value) => {
    const data = price;
    let array = [];

    for(let key in data) {
      if(data[key]._id === parseInt(value, 10)) {
        array = data[key].array;
      }
    }
    return array;
  }

  const handleFilters = (filters, category) => {
    console.log(filters);
    const newFilters = {...Filters}
    newFilters[category] = filters

    if(category === "price") {
      let priceValues = handlePrice(filters)
      newFilters[category] = priceValues
    }

    showFilteredResults(newFilters)
    setFilters(newFilters)
  }


  return (
      <LandingTemplate>
        <TitleDiv>
          <h1>어디로 떠나고 싶으신가요?<Icon type="rocket"/></h1>
        </TitleDiv>

        {/* Filter */}

        <Row gutter={[16, 16]}>
          <Col lg={12} xs={24}>
            <CheckBox list={continents} handleFilters={filters => handleFilters(filters, "continents")} />
          </Col>
          <Col lg={12} xs={24}>
            <RadioBox list={price} handleFilters={filters => handleFilters(filters, "price")} />
          </Col>
        </Row>

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
