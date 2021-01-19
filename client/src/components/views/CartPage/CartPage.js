import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getCartItems, removeCartItem, onSuccessBuy } from '../../../_actions/user_actions';
import UserCardBlock from './Sections/UserCardBlock';
import styled from 'styled-components';
import { Empty, Result } from 'antd';
import Paypal from '../../utils/Paypal';

const CartTemplate = styled.div`
  width: 85%;
  margin: 3rem auto;
`;

function CartPage(props) {

  const [Total, setTotal] = useState(0)
  const [ShowTotal, setShowTotal] = useState(false)
  const [ShowSuccess, setShowSuccess] = useState(false)

  const dispatch = useDispatch();

  useEffect(() => {

    let cartItems = []

    // Redux userData 안에 상품이 들어있는지 확인
    if(props.user.userData && props.user.userData.cart) {
      if(props.user.userData.cart.length > 0) {
        props.user.userData.cart.forEach(item => {
          cartItems.push(item.id)
        });
        // product table + user table cart 정보에 있는 수량
        dispatch(getCartItems(cartItems, props.user.userData.cart))
          .then(response => {
            calculateTotal(response.payload.product)
          })
      }
    }
  }, [props.user.userData])

  let calculateTotal = (cartDetail) => {
    let total = 0;

    cartDetail.map(item => {
      total += parseInt(item.price, 10) * item.quantity
    })

    setTotal(total)
    setShowTotal(true)
  }

  const removeFromCart = (productId) => {
    dispatch(removeCartItem(productId))
      .then(response => {
        if(response.payload.productInfo.length <= 0) {
          setShowTotal(false)
        }
      })
  }

  const transactionSuccess = (data) => {
    dispatch(onSuccessBuy({
      paymentData: data,
      cartDetail: props.user.cartDetail
    }))
    .then(response => {
      if(response.payload.success) {
        setShowTotal(false)
        setShowSuccess(true)
      }
    })
  }

  return(
    <CartTemplate>
      <h1>내 장바구니</h1>
      <div>
        <UserCardBlock products={props.user.cartDetail && props.user.cartDetail} removeItem={removeFromCart}/>
      </div>

      { ShowTotal ?
        <div style={{ marginTop: '3rem' }}>
          <h2>총 금액: ₩{Total}</h2>
        </div>
        : ShowSuccess ?
          <Result
           status="success"
           title="구매 완료!"
           subTitle="구매가 정상적으로 이루어졌습니다"
           />
         :
        <>
          <br />
          <Empty description={false} />
        </>
      }
      {ShowTotal &&
        <Paypal total={Total} onSuccess={transactionSuccess} />
      }
    </CartTemplate>
  )
}

export default CartPage;
