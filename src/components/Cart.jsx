import React, { useEffect } from "react";
import "./Cart.css";

function Cart() {
  useEffect(() => {
    document.title = "Cart - EZTechMovie";
  }, []);

  return (
    <div className="page page-cart">
      <h2 className="page-title">Cart</h2>
      <p className="page-subtitle">This page will be developed in Week 4.</p>
    </div>
  );
}

export default Cart;
