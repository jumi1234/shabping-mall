import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Button, Descriptions } from 'antd';
import Axios from 'axios';
import { addToCart } from '../../../../_actions/user_actions';
import { useDispatch } from 'react-redux';

const InfoTemplate = styled.div`

`;

const CardButton = styled.div`

`;

function ProductInfo(props) {

  const dispatch = useDispatch();

  const clickHandle = () => {
    // 필요한 정보를 user model의 cart field에 넣어준다
    dispatch(addToCart(props.detail._id))
  }

  return(
    <InfoTemplate>
      <Descriptions title="상품 정보" layout="vertical" bordered>
       <Descriptions.Item label="기격">{props.detail.price}원</Descriptions.Item>
       <Descriptions.Item label="판매량">{props.detail.sold}</Descriptions.Item>
       <Descriptions.Item label="조회수">{props.detail.views}</Descriptions.Item>
       <Descriptions.Item label="상품 설명">{props.detail.description}</Descriptions.Item>
      </Descriptions>

      <br />
      <br />
      <br />
      <CardButton>
        <Button size="large" shape="round" type="danger" onClick={clickHandle}>
          장바구니
        </Button>
      </CardButton>

    </InfoTemplate>
  )
}

export default ProductInfo;
