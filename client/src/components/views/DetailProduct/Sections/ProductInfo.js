import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Button, Descriptions } from 'antd';

const InfoTemplate = styled.div`

`;

const CardButton = styled.div`

`;

function ProductInfo(props) {

  const clickHandle = () => {
    
  }

  return(
    <InfoTemplate>
      <Descriptions title="Product Info" layout="vertical" bordered>
       <Descriptions.Item label="Price">{props.detail.price}</Descriptions.Item>
       <Descriptions.Item label="Sold">{props.detail.sold}</Descriptions.Item>
       <Descriptions.Item label="View">{props.detail.views}</Descriptions.Item>
       <Descriptions.Item label="Description">{props.detail.description}</Descriptions.Item>
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
