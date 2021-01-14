import React from 'react';

function UserCardBlock(props) {

  const renderCartImage = (images) => {
    if(images.length > 0) {
      let image = images[0]
      return `http://localhost:5000/${image}`
    }
  }

  const renderItems = () => (
    props.products && props.products.map((product, index) => (
      <tr key={index}>
        <td>
          <img style={{width: '70px'}} alt="product" src={renderCartImage(product.images)} />
        </td>
        <td>
          {product.quantity}
        </td>
        <td>
          {product.price}
        </td>
        <td>
          <button>삭제</button>
        </td>
      </tr>
    ))
  )

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>상품 이미지</th>
            <th>수량</th>
            <th>가격</th>
            <th>삭제</th>
          </tr>
        </thead>

        <tbody>
          {renderItems()}
        </tbody>
      </table>
    </div>
  )
}

export default UserCardBlock;
