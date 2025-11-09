import React, { useState } from "react";
import "./StreamList.css";

function StreamList() {
  const [inputValue, setInputValue] = useState("");
  const [items, setItems] = useState([]);
  const [draggedIndex, setDraggedIndex] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmed = inputValue.trim();
    if (!trimmed) return;

    console.log("User Input:", trimmed);

    setItems((prev) => [
      ...prev,
      {
        id: Date.now() + Math.random(),
        title: trimmed,
      },
    ]);

    setInputValue("");
  };

  const handleDelete = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleDragStart = (index) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (index) => {
    if (draggedIndex === null || draggedIndex === index) return;

    setItems((prevItems) => {
      const updated = [...prevItems];
      const [movedItem] = updated.splice(draggedIndex, 1);
      updated.splice(index, 0, movedItem);
      return updated;
    });

    setDraggedIndex(null);
  };

  return (
    <div className="streamlist-page">
      <h2>StreamList</h2>
      <p className="streamlist-subtitle">
        Add shows or movies, reorder them by dragging, or remove them.
      </p>

      <form onSubmit={handleSubmit} className="streamlist-form">
        <input
          type="text"
          value={inputValue}
          placeholder="Enter your show or movie"
          onChange={(e) => setInputValue(e.target.value)}
          className="streamlist-input"
        />
        <button type="submit" className="streamlist-button">
          Add
        </button>
      </form>

      <ul className="streamlist-display">
        {items.length === 0 && (
          <li className="streamlist-empty">
            Your list is empty. Start adding titles from your queue.
          </li>
        )}

        {items.map((item, index) => (
          <li
            key={item.id}
            className="streamlist-item"
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(index)}
          >
            <span className="streamlist-item-text">
              {index + 1}. {item.title}
            </span>
            <button
              type="button"
              className="streamlist-delete-button"
              onClick={() => handleDelete(item.id)}
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default StreamList;
