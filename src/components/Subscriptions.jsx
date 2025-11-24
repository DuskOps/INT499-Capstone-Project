// src/Components/Subscriptions.jsx
import React, { useState } from "react";
import "./Subscriptions.css";

function Subscriptions({ products, cartItems, setCartItems }) {
  const [warning, setWarning] = useState("");

  const hasSubscription = cartItems.some((item) => item.isSubscription);

  const handleAddToCart = (product) => {
    const isSubscription = product.service.includes("Subscription");

    if (isSubscription) {
      const existingSub = cartItems.find((item) => item.isSubscription);

      // already have some subscription in cart
      if (existingSub && existingSub.id !== product.id) {
        setWarning(
          "You can only have one subscription plan in your cart at a time."
        );
        return;
      }

      // same subscription already in cart
      if (existingSub && existingSub.id === product.id) {
        setWarning("This subscription is already in your cart.");
        return;
      }
    }

    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        // accessories can increase quantity
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [
        ...prev,
        {
          ...product,
          quantity: 1,
          isSubscription,
        },
      ];
    });

    setWarning("");
  };

  return (
    <div className="page page-subscriptions">
      <h2 className="page-title">Subscriptions & Accessories</h2>

      <p className="subs-intro">
        Choose a streaming subscription and customize your EZTechMovie
        experience with accessories. You can only select one active subscription
        at a time.
      </p>

      {warning && <div className="subs-warning">{warning}</div>}

      {hasSubscription && (
        <div className="subs-info-banner">
          You already have a subscription in your cart. You can still add more
          EZTech accessories.
        </div>
      )}

      <div className="subs-grid">
        {products.map((product) => {
          const isSubscription = product.service.includes("Subscription");

          return (
            <div key={product.id} className="subs-card">
              <div className="subs-card-img-wrapper">
                <img
                  src={product.img}
                  alt={product.service}
                  className="subs-card-img"
                />
              </div>

              <div className="subs-card-body">
                <div className="subs-card-header">
                  <h3 className="subs-card-title">{product.service}</h3>
                  {isSubscription && <span className="subs-badge">Plan</span>}
                  {!isSubscription && (
                    <span className="subs-badge accessory">Accessory</span>
                  )}
                </div>

                <p className="subs-card-info">{product.serviceInfo}</p>

                <div className="subs-card-footer">
                  <span className="subs-card-price">
                    ${product.price.toFixed(2)}
                  </span>
                  <button
                    className="subs-add-btn"
                    onClick={() => handleAddToCart(product)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Subscriptions;
