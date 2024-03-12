import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import axios from 'axios';
import './home.css';
import {message, Button, Input} from 'antd'
import { useNavigate } from 'react-router-dom';

import logo from "../../assets/nike.png";
import plus from "../../assets/plus.png";
import minus from "../../assets/minus.png";
import trash from "../../assets/trash.png";
import check from "../../assets/check.png";

import { getAllProductApi, searchProductApi } from '../../../api';

const Home = () => {
  const [shopItems, setShopItems] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [keyWord, setKeyWord] = useState("");
  const name = localStorage.getItem('name');
  const cartItemsRef = useRef(null);
  const buttonRefs = useRef({});
  const navigate = useNavigate();

  const handleSearch = (word) => {
    setKeyWord(word);
  }

  useEffect(() => {
    const fetchData = async () => {
      if (keyWord!==""){
        try {
          const res = await axios.get(searchProductApi(keyWord))
          setShopItems(res.data.products)
          message.success("Products Found")
        } catch (error) {
          console.error(error);
          message.error("Products not found")
        }
      } else{
        try {
          const res = await axios.get(getAllProductApi);
          setShopItems(res.data.products);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
    }
    fetchData();
  }, [keyWord]);

  const logout = () => {
    try {
      localStorage.removeItem("name");
      localStorage.removeItem("email");
      localStorage.removeItem("role");
      localStorage.removeItem("token");
      message.success("Logout success")
      navigate("/login")
    } catch (error) {
      console.log(error);
      message.error("Logout failed")
    }
  }

  const addToCart = (item) => {
    if (!item.inCart) {
      item.inCart = true;
      const newItem = { ...item, count: 1 };
      setCartItems(prevCartItems => [...prevCartItems, newItem]);

      const animationTarget = buttonRefs.current[item.id];
      gsap.to(animationTarget, {
        width: 46,
        duration: 0.8,
        ease: "power4"
      });
    }
    scrollToBottom();
  };

  const decrement = (item) => {
    item.count--;
    const targetShopItem = shopItems.find(
      (shopItem) => shopItem.id === item.id
    );
  
    if (item.count === 0) {
      const animationTarget = buttonRefs.current[item.id];
      gsap.to(animationTarget, {
        width: 136,
        duration: 0.8,
        ease: "power4"
      });
      targetShopItem.inCart = false;
      const updatedCartItems = cartItems.filter(
        (cartItem) => cartItem.id !== item.id
      );
      setCartItems(updatedCartItems);
    } else {
      setCartItems([...cartItems]);
    }
  };

  const increment = (item) => {
    item.count++;
    setCartItems([...cartItems]);
  };

  const removeFromCart = (item) => {
    const updatedCartItems = cartItems.filter(cartItem => cartItem.id !== item.id);
    const updatedShopItems = shopItems.map(shopItem => {
      if (shopItem.id === item.id) {
        return { ...shopItem, inCart: false };
      }
      return shopItem;
    });
    const animationTarget = buttonRefs.current[item.id];
    gsap.to(animationTarget, {
      width: 136,
      duration: 0.8,
      ease: "power4"
    });
    setCartItems(updatedCartItems);
    setShopItems(updatedShopItems);
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.count), 0).toFixed(2);
  };

  const scrollToBottom = () => {
    if (cartItemsRef.current) {
      cartItemsRef.current.scrollTop = cartItemsRef.current.scrollHeight;
    }
  };

  return (
    <div className="wrapper">
      <div className="screen -left">
        <div className="app-bar">
          <div className='logosearch'>
            <img className="logo" src={logo} alt="logo" />
            <Input.Search
              className='search'
              placeholder='Enter name'
              style={{width:"150px"}}
              onPressEnter={(value) => handleSearch(value)}
              onSearch={(value) => handleSearch(value)}
            />
          </div>
        </div>
        <div className="title">Our Products</div>
        <div className="shop-items">
          {shopItems.map(item => (
            <div className="item" key={item.id}>
              <div className="item-block">
                <div className="image-area" style={{ backgroundColor: item.color }}>
                  <img className="image" src={item.image} alt={item.name} />
                </div>
                <div className="name">{item.name}</div>
                <div className="description">{item.description}</div>
                <div className="bottom-area">
                  <div className="price">${item.price}</div>
                  <div className={`button ${item.inCart ? '-active' : ''}`} onClick={() => addToCart(item)} ref={buttonRefs[item.id]}>
                    {item.inCart ? (
                      <div className="cover">
                        <img className="check" src={check} alt="check" />
                      </div>
                    ) : (
                      "ADD TO CART"
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className={`screen -right ${cartItems.length === 0 ? 'no-content' : 'cart-content'}`} ref={cartItemsRef}>
        <div className="app-bar">
          <div className='logologout'>
            <img className="logo" src={logo} alt="logo" />
            <Button className="logout" type="primary" onClick={logout}>Log out</Button>
          </div>
        </div>
        <div className="covertitletotal">
          <div className="title">{name}'s cart</div>
          <div className="total">${calculateTotal()}</div>
        </div>
        {cartItems.length === 0 ? (
          <div className="no-content noContent">
            <p className="text">Your cart is empty.</p>
          </div>
        ) : (
          <TransitionGroup className="cart-items cartList">
            {cartItems.map(item => (
              <CSSTransition key={item.id} classNames="cartList">
                <div className="cart-item">
                  <div className="left">
                    <div className="cart-image" style={{ backgroundColor: item.color }}>
                      <div className="image-wrapper">
                        <img className="image" src={item.image} alt={item.name} />
                      </div>
                    </div>
                  </div>
                  <div className="right">
                    <div className="name">{item.name}</div>
                    <div className="price">${item.price}</div>
                    <div className="count">
                      <div className="button" onClick={() => decrement(item)}><img className="minus" src={minus} alt="minus"/></div>
                      <div className="number">{item.count}</div>
                      <div className="button" onClick={() => increment(item)}><img className="plus" src={plus} alt="plus"/></div>
                      <div className="remove" onClick={() => removeFromCart(item)}>
                        <img  className="trash" src={trash} alt="Remove" />
                      </div>
                    </div>
                  </div>
                </div>
              </CSSTransition>
            ))}
          </TransitionGroup>
        )}
      </div>
    </div>
  );
}

export default Home;
