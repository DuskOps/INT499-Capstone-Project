// src/Components/Cart.jsx
import React from "react";
import "./Cart.css";

function Cart({ cartItems, setCartItems }) {
  const handleRemove = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleIncrement = (id) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;

        // subscriptions stay at quantity 1
        if (item.isSubscription) {
          return item;
        }

        return { ...item, quantity: item.quantity + 1 };
      })
    );
  };

  const handleDecrement = (id) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id !== id) return item;
          const newQty = item.quantity - 1;
          return { ...item, quantity: newQty };
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (cartItems.length === 0) {
    return (
      <div className="page page-cart">
        <h2 className="page-title">Cart</h2>
        <p className="cart-empty">
          Your cart is empty. Visit the Subscriptions page to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="page page-cart">
      <h2 className="page-title">Cart</h2>

      <div className="cart-summary">
        <p>
          You have <strong>{cartItems.length}</strong> different item
          {cartItems.length > 1 ? "s" : ""} in your cart.
        </p>
      </div>

      <div className="cart-table">
        <div className="cart-header-row">
          <div className="cart-col cart-col-item">Item</div>
          <div className="cart-col cart-col-type">Type</div>
          <div className="cart-col cart-col-price">Price</div>
          <div className="cart-col cart-col-qty">Quantity</div>
          <div className="cart-col cart-col-subtotal">Subtotal</div>
          <div className="cart-col cart-col-actions">Actions</div>
        </div>

        {cartItems.map((item) => (
          <div key={item.id} className="cart-item-row">
            <div className="cart-col cart-col-item">
              <div className="cart-item-main">
                <img
                  src={item.img}
                  alt={item.service}
                  className="cart-item-img"
                />
                <div>
                  <div className="cart-item-title">{item.service}</div>
                  <div className="cart-item-info">{item.serviceInfo}</div>
                </div>
              </div>
            </div>

            <div className="cart-col cart-col-type">
              {item.isSubscription ? "Subscription" : "Accessory"}
            </div>

            <div className="cart-col cart-col-price">
              ${item.price.toFixed(2)}
            </div>

            <div className="cart-col cart-col-qty">
              <div className="cart-qty-controls">
                <button
                  className="qty-btn"
                  onClick={() => handleDecrement(item.id)}
                >
                  –
                </button>
                <span className="qty-value">{item.quantity}</span>
                <button
                  className="qty-btn"
                  onClick={() => handleIncrement(item.id)}
                  disabled={item.isSubscription}
                  title={
                    item.isSubscription
                      ? "Subscriptions are limited to one per cart."
                      : "Increase quantity"
                  }
                >
                  +
                </button>
              </div>
            </div>

            <div className="cart-col cart-col-subtotal">
              ${(item.price * item.quantity).toFixed(2)}
            </div>

            <div className="cart-col cart-col-actions">
              <button
                className="cart-remove-btn"
                onClick={() => handleRemove(item.id)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="cart-total-row">
        <span className="cart-total-label">Total:</span>
        <span className="cart-total-value">${totalPrice.toFixed(2)}</span>
      </div>
    </div>
  );
}

export default Cart;
