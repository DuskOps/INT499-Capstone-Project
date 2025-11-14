import React, { useState, useEffect } from "react";
import {
  FaTrash,
  FaEdit,
  FaCheck,
  FaTimes,
  FaRegCheckCircle,
  FaRegCircle,
} from "react-icons/fa";
import "./StreamList.css";

function StreamList() {
  const [inputValue, setInputValue] = useState("");
  const [items, setItems] = useState([]);
  const [draggedIndex, setDraggedIndex] = useState(null);

  useEffect(() => {
    document.title = "StreamList - EZTechMovie";
  }, []);

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
        completed: false,
        isEditing: false,
      },
    ]);

    setInputValue(""); // clear after submit
  };

  const handleDelete = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const toggleComplete = (id) => {
    setItems((prev) =>
      prev.map((it) =>
        it.id === id ? { ...it, completed: !it.completed } : it
      )
    );
  };

  const startEdit = (id) => {
    setItems((prev) =>
      prev.map((it) =>
        it.id === id ? { ...it, isEditing: true, draft: it.title } : it
      )
    );
  };

  const updateDraft = (id, value) => {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, draft: value } : it))
    );
  };

  const saveEdit = (id) => {
    setItems((prev) =>
      prev.map((it) =>
        it.id === id
          ? {
              ...it,
              title: (it.draft || "").trim() || it.title,
              isEditing: false,
              draft: undefined,
            }
          : it
      )
    );
  };

  const cancelEdit = (id) => {
    setItems((prev) =>
      prev.map((it) =>
        it.id === id ? { ...it, isEditing: false, draft: undefined } : it
      )
    );
  };

  // Drag & Drop
  const handleDragStart = (index) => setDraggedIndex(index);
  const handleDragOver = (e) => e.preventDefault();
  const handleDrop = (index) => {
    if (draggedIndex === null || draggedIndex === index) return;
    setItems((prev) => {
      const updated = [...prev];
      const [moved] = updated.splice(draggedIndex, 1);
      updated.splice(index, 0, moved);
      return updated;
    });
    setDraggedIndex(null);
  };

  return (
    <div className="page page-streamlist">
      <h2 className="page-title">StreamList</h2>
      <p className="page-subtitle">
        Add shows or movies, mark complete, edit titles, drag to reorder, or
        remove them.
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
            Your list is empty. Start adding titles.
          </li>
        )}

        {items.map((item, index) => (
          <li
            key={item.id}
            className={`streamlist-item ${item.completed ? "is-complete" : ""}`}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(index)}
          >
            {/* Complete toggle */}
            <button
              type="button"
              className="icon-btn complete-btn"
              onClick={() => toggleComplete(item.id)}
              aria-label={
                item.completed ? "Mark as incomplete" : "Mark as complete"
              }
              title={item.completed ? "Mark as incomplete" : "Mark as complete"}
            >
              {item.completed ? <FaRegCheckCircle /> : <FaRegCircle />}
            </button>

            {/* Title / Edit field */}
            <div className="streamlist-item-main">
              {item.isEditing ? (
                <input
                  className="edit-input"
                  value={item.draft ?? ""}
                  onChange={(e) => updateDraft(item.id, e.target.value)}
                  autoFocus
                />
              ) : (
                <span className="streamlist-item-text">
                  {index + 1}. {item.title}
                </span>
              )}
            </div>

            {/* Actions: Edit/Save/Cancel + Delete */}
            <div className="actions">
              {item.isEditing ? (
                <>
                  <button
                    type="button"
                    className="icon-btn save-btn"
                    onClick={() => saveEdit(item.id)}
                    title="Save"
                  >
                    <FaCheck />
                  </button>
                  <button
                    type="button"
                    className="icon-btn cancel-btn"
                    onClick={() => cancelEdit(item.id)}
                    title="Cancel"
                  >
                    <FaTimes />
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  className="icon-btn edit-btn"
                  onClick={() => startEdit(item.id)}
                  title="Edit"
                >
                  <FaEdit />
                </button>
              )}
              <button
                type="button"
                className="icon-btn delete-btn"
                onClick={() => handleDelete(item.id)}
                title="Delete"
              >
                <FaTrash />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default StreamList;
