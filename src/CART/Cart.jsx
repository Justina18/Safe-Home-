import React, { useEffect, useState } from 'react'
import './cart.css'
import axios from "axios";
import Categoriesroute from '../Components/ROUT/Categoriesroute'
import Products from '../Components/PRODUCT/Products';
import { useSelector } from 'react-redux';
import payKorapay from '../Components/payments';
import { useDispatch } from 'react-redux'
import { removeItem, clearAll, Check, addToCart } from '../REDUX/features'
export default function Cart() {
  const dispach = useDispatch()
  const cart = useSelector((state) => state.Commerce.cart)
  const recent = useSelector((state) => state.Commerce.RECENT)
  const [item, setItem] = useState([])
  async function getItem() {
    try {
      const res = await axios.get(`https://fakestoreapi.com/products?limit=5`)
      setItem(res.data)
      // console.log(res.data)

    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    getItem()
  }, [])

  const Total = () => {
    let Total = 0;
    cart.map((i) => Total += i.total)
    return Total
  }

  return (
    <div>
      <Categoriesroute />
      <div className='cart'>
        <div className='cart_wrap'>
          <div className='cart_card_wrap'>
            <div className='cart_head'>
              <h4>Shoping Cart</h4>
              <p>Price</p>
            </div>
            {cart.map((i) => (
              <div key={i.id} className='cart_card'>
                <div className='cart_card_top'>
                  <img className='cart_image' src={i.image} />
                  <div className='cart_card_top_text'>
                    <h3>4K  & HD Camera System-Sony Pro</h3>
                    <h4>${i.price}</h4>
                  </div>
                </div>
                <div className='cart_card_middle'>
                  <button className='cart_delete' onClick={() => { dispach(removeItem(i)) }} >Delete</button>
                  <div className='cart_card_middel_navs'>
                    <button className='cart_change' onClick={() => { dispach(addToCart(i)) }}>+</button>
                    <h4>{i.QTY}</h4>
                    <button className='cart_change' onClick={() => { dispach(Check(i)) }}>-</button>
                  </div>
                </div>
              </div>
            ))}
            <div className='cart_card_buttom'>
              <button className='cart_checkout' onClick={() => { payKorapay(Total()) }}>Checkout</button>
              <h4>Total:{Total()}</h4>
            </div>
          </div>
        </div>
      </div>
      <Products item={recent} title='Recently Viewed' />
      <Products item={item} title='Related items' />
    </div>
  )
}