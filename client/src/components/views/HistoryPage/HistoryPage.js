import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import styled from 'styled-components';

const HistoryDiv = styled.div`
  width: 80%;
  margin: 3rem auto;
  div {
    text-align: center;
  }
`;

function HistoryPage(props) {

  return (
    <HistoryDiv>
      <div>
        <h1>구매 내역</h1>
      </div>
      <br />

      <table>
        <thead>
          <tr>
            <th>결제 id</th>
            <th>가격</th>
            <th>수량</th>
            <th>구매날짜</th>
          </tr>
        </thead>

        <tbody>

        {props.user.userData && props.user.userData.history.map((item) => (
          <tr key={item._id}>
            <td>{item.id}</td>
            <td>{item.price}</td>
            <td>{item.quantity}</td>
            <td>{item.dateOfPurchase}</td>
          </tr>
        ))}

        </tbody>
      </table>
    </HistoryDiv>
  )
}

export default HistoryPage;
