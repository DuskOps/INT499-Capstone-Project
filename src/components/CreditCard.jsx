// src/components/CreditCard.jsx
import React, { useState, useEffect } from "react";
import "./CreditCard.css";

const CARD_STORAGE_KEY = "eztech_credit_card";

function CreditCard() {
  const [nameOnCard, setNameOnCard] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  // Load saved card data from localStorage on first render
  useEffect(() => {
    try {
      const saved = localStorage.getItem(CARD_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);

        if (parsed && typeof parsed === "object") {
          setNameOnCard(parsed.nameOnCard || "");
          setCardNumber(parsed.cardNumberFormatted || "");
          setExpiry(parsed.expiry || "");
          // CVV is intentionally not restored for security reasons
          setStatusMessage(
            "Loaded saved card information from previous session."
          );
        }
      }
    } catch (err) {
      console.warn("Failed to read saved card info from localStorage:", err);
    }
  }, []);

  const handleCardNumberChange = (e) => {
    let value = e.target.value;
    value = value.replace(/\D/g, ""); // only digits
    if (value.length > 16) value = value.slice(0, 16);

    const groups = value.match(/.{1,4}/g);
    const formatted = groups ? groups.join(" ") : "";
    setCardNumber(formatted); // "1234 5678 9012 3456"
  };

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 4) value = value.slice(0, 4);
    if (value.length >= 3) {
      value = `${value.slice(0, 2)}/${value.slice(2)}`;
    }
    setExpiry(value);
  };

  const handleCvvChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 4) value = value.slice(0, 4);
    setCvv(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const digitsOnly = cardNumber.replace(/\s/g, "");
    if (digitsOnly.length !== 16) {
      setStatusMessage("Please enter a full 16-digit card number.");
      return;
    }
    if (!nameOnCard.trim()) {
      setStatusMessage("Please enter the name on the card.");
      return;
    }
    if (!expiry || expiry.length < 4) {
      setStatusMessage("Please enter a valid expiry date (MM/YY).");
      return;
    }
    if (!cvv || cvv.length < 3) {
      setStatusMessage("Please enter a valid CVV.");
      return;
    }

    // DEMO ONLY – not secure for real credit cards
    const cardData = {
      nameOnCard: nameOnCard.trim(),
      cardNumberFormatted: cardNumber,
      last4: digitsOnly.slice(-4),
      expiry,
    };

    try {
      localStorage.setItem(CARD_STORAGE_KEY, JSON.stringify(cardData));
      setStatusMessage(
        "Card information saved locally (demo only, not for real payments)."
      );
    } catch (err) {
      console.warn("Failed to save card info:", err);
      setStatusMessage("Failed to save card information.");
    }
  };

  return (
    <div className="page page-credit-card">
      <h2 className="page-title">Checkout - Credit Card</h2>

      <p className="credit-card-note">
        This is a demo credit card form for the EZTechMovie capstone project. In
        a real production system, card data would be sent securely to a payment
        processor and never stored in localStorage.
      </p>

      <form className="credit-card-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <label htmlFor="nameOnCard">Name on Card</label>
          <input
            id="nameOnCard"
            type="text"
            value={nameOnCard}
            onChange={(e) => setNameOnCard(e.target.value)}
            placeholder="JANE DOE"
            autoComplete="cc-name"
          />
        </div>

        <div className="form-row">
          <label htmlFor="cardNumber">Card Number</label>
          <input
            id="cardNumber"
            type="text"
            value={cardNumber}
            onChange={handleCardNumberChange}
            placeholder="1234 5678 9012 3456"
            inputMode="numeric"
            maxLength={19}
            autoComplete="cc-number"
          />
        </div>

        <div className="form-row form-row-inline">
          <div className="form-field-half">
            <label htmlFor="expiry">Expiry (MM/YY)</label>
            <input
              id="expiry"
              type="text"
              value={expiry}
              onChange={handleExpiryChange}
              placeholder="08/28"
              inputMode="numeric"
              maxLength={5}
              autoComplete="cc-exp"
            />
          </div>
          <div className="form-field-half">
            <label htmlFor="cvv">CVV</label>
            <input
              id="cvv"
              type="password"
              value={cvv}
              onChange={handleCvvChange}
              placeholder="123"
              inputMode="numeric"
              maxLength={4}
              autoComplete="cc-csc"
            />
          </div>
        </div>

        <button type="submit" className="credit-card-submit">
          Save Card (Demo)
        </button>
      </form>

      {statusMessage && <p className="credit-card-status">{statusMessage}</p>}
    </div>
  );
}

export default CreditCard;
