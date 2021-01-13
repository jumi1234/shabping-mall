import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getCartItems } from '../../../_actions/user_actions';
import UserCardBlock from './Sections/UserCardBlock';
import styled from 'styled-components';

const CartTemplate = styled.div`
  width: 85%;
  margin: 3rem auto;
`;

function CartPage(props) {

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
      }
    }

  }, [props.user.userData])

  return(
    <CartTemplate>
      <h1>내 장바구니</h1>
      <div>
        <UserCardBlock products={props.user.cartDetail && props.user.cartDetail} />
      </div>
    </CartTemplate>
  )
}

export default CartPage;
