import React, { useState, useEffect } from 'react';
import Axios from 'axios';

function DetailProduct(props) {

  const productId = props.match.params.productId;

  useEffect(() => {
    Axios.get(`/api/product/product_by_id?id=${productId}&type=single`)
      .then(response => {
        if(response.data.success) {
          console.log(response.data);
        } else {
          alert('상세 정보 가져오기를 실패했습니다')
        }
      })
  }, [])

  return(
    <>
    ds
    </>
  )
}

export default DetailProduct;
