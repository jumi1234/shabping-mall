import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getCartItems } from '../../../_actions/user_actions';
import UserCardBlock from './Sections/UserCardBlock';
import styled from 'styled-components';

const CartTemplate = styled.div`
  width: 85%;
  margin: 3rem auto;
`;

function CartPage(props) {

  const [Total, setTotal] = useState(0)

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
  }

  return(
    <CartTemplate>
      <h1>내 장바구니</h1>
      <div>
        <UserCardBlock products={props.user.cartDetail && props.user.cartDetail} />
      </div>
      <div style={{ marginTop: '3rem' }}>
        <h2>총 금액: ₩{Total}</h2>
      </div>
    </CartTemplate>
  )
}

export default CartPage;
