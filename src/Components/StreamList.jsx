import React, { useState, useEffect } from "react";
import {
  FaCheck,
  FaTimes,
  FaRegCheckCircle,
  FaRegCircle,
  FaPencilAlt,
} from "react-icons/fa";
import "./StreamList.css";

function StreamList() {
  // main text input value
  const [inputValue, setInputValue] = useState("");
  // list items
  const [items, setItems] = useState([]);
  // index used for drag-and-drop
  const [draggedIndex, setDraggedIndex] = useState(null);

  useEffect(() => {
    document.title = "StreamList - EZTechMovie";
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    setItems((prev) => [
      ...prev,
      {
        id: Date.now(),
        title: trimmed,
        completed: false,
        isEditing: false,
        draft: trimmed,
      },
    ]);

    // clear input after submit
    setInputValue("");
  };

  const handleDelete = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const toggleComplete = (id) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const startEdit = (id) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isEditing: true, draft: item.title } : item
      )
    );
  };

  const updateDraft = (id, value) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, draft: value } : item))
    );
  };

  const saveEdit = (id) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              title: item.draft.trim() || item.title,
              isEditing: false,
            }
          : item
      )
    );
  };

  // drag & drop
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
      <h2 className="page-title">Streamlist</h2>
      <p className="page-subtitle">
        Add shows or movies, click and drag to reorder, mark them complete, or
        edit them using the pencil icon on the right.
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
            Your list is empty. Start adding your favorite titles.
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
            {/* left side: index + title / edit field */}
            <div className="streamlist-left">
              <span className="streamlist-index">{index + 1}.</span>

              {item.isEditing ? (
                <input
                  className="edit-input"
                  value={item.draft}
                  onChange={(e) => updateDraft(item.id, e.target.value)}
                  autoFocus
                />
              ) : (
                <span className="streamlist-item-text">{item.title}</span>
              )}
            </div>

            {/* right side: actions */}
            <div className="streamlist-actions">
              {item.isEditing ? (
                <>
                  {/* Save changes */}
                  <button
                    type="button"
                    className="icon-btn save-btn"
                    onClick={() => saveEdit(item.id)}
                    title="Save changes"
                  >
                    <FaCheck />
                  </button>

                  {/* Delete item */}
                  <button
                    type="button"
                    className="delete-pill"
                    onClick={() => handleDelete(item.id)}
                    title="Delete item"
                  >
                    <FaTimes className="delete-x-icon" />
                  </button>
                </>
              ) : (
                <>
                  {/* Complete toggle */}
                  <button
                    type="button"
                    className="icon-btn complete-btn"
                    onClick={() => toggleComplete(item.id)}
                    title={
                      item.completed
                        ? "Mark as not watched yet"
                        : "Mark as complete"
                    }
                  >
                    {item.completed ? (
                      <FaRegCheckCircle className="complete-icon-green" />
                    ) : (
                      <FaRegCircle />
                    )}
                  </button>

                  {/* Edit (pencil) */}
                  <button
                    type="button"
                    className="icon-btn edit-pencil-btn"
                    onClick={() => startEdit(item.id)}
                    title="Edit title"
                  >
                    <FaPencilAlt />
                  </button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default StreamList;
