import React, { useState, useEffect } from "react";
import { FaCheck, FaPencilAlt } from "react-icons/fa";
import "./StreamList.css";

const LOCAL_KEY = "eztechmovie_streamlist";

function StreamList() {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [input, setInput] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [draggingId, setDraggingId] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_KEY, JSON.stringify(items));
    } catch (err) {
      console.warn("Failed to save stream list to localStorage:", err);
    }
  }, [items]);

  const handleAdd = (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;

    const newItem = {
      id: Date.now(),
      text,
      complete: false,
    };

    setItems((prev) => [...prev, newItem]);
    setInput("");
  };

  const toggleComplete = (id) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, complete: !item.complete } : item
      )
    );
  };

  const deleteItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const startEdit = (id, text) => {
    setEditingId(id);
    setEditText(text);
  };

  const saveEdit = (id) => {
    const trimmed = editText.trim();
    if (!trimmed) return; // do nothing if they try to save empty

    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, text: trimmed } : item))
    );
    setEditingId(null);
    setEditText("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText("");
  };

  // Keyboard handler for edit input: Enter = save, Esc = cancel
  const handleEditKeyDown = (e, id) => {
    if (e.key === "Enter") {
      e.preventDefault();
      saveEdit(id);
    } else if (e.key === "Escape") {
      e.preventDefault();
      cancelEdit();
    }
  };

  // Drag + Drop handlers
  const handleDragStart = (e, id) => {
    setDraggingId(id);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", String(id));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetId) => {
    e.preventDefault();
    const sourceId = draggingId;
    if (!sourceId || sourceId === targetId) return;

    setItems((prev) => {
      const newList = [...prev];
      const fromIndex = newList.findIndex((i) => i.id === sourceId);
      const toIndex = newList.findIndex((i) => i.id === targetId);
      if (fromIndex === -1 || toIndex === -1) return prev;

      const [moved] = newList.splice(fromIndex, 1);
      newList.splice(toIndex, 0, moved);

      return newList;
    });

    setDraggingId(null);
  };

  const handleDragEnd = () => {
    setDraggingId(null);
  };

  return (
    <div className="page page-streamlist">
      <h2 className="streamlist-title">My Stream List</h2>

      <form className="streamlist-form" onSubmit={handleAdd}>
        <input
          type="text"
          className="streamlist-input"
          placeholder="Add shows or movies"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <button className="streamlist-button" type="submit">
          Add
        </button>
      </form>

      {items.length === 0 && (
        <p className="streamlist-empty">No items yet in stream list</p>
      )}

      <ul className="streamlist-display">
        {items.map((item, index) => {
          const isEditing = editingId === item.id;

          return (
            <li
              key={item.id}
              className={`streamlist-item ${
                item.complete ? "is-complete" : ""
              }`}
              draggable
              onDragStart={(e) => handleDragStart(e, item.id)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, item.id)}
              onDragEnd={handleDragEnd}
            >
              <div className="streamlist-left">
                <span className="streamlist-index">{index + 1}.</span>

                {isEditing ? (
                  <input
                    className="edit-input"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onKeyDown={(e) => handleEditKeyDown(e, item.id)}
                    autoFocus
                  />
                ) : (
                  <span className="streamlist-item-text">{item.text}</span>
                )}
              </div>

              <div className="streamlist-actions">
                {isEditing ? (
                  <>
                    {/* Save (button) */}
                    <button
                      className="icon-btn save-btn"
                      onClick={() => saveEdit(item.id)}
                      title="Save"
                      type="button"
                    >
                      <FaCheck />
                    </button>

                    {/* Delete only while editing */}
                    <button
                      className="delete-pill"
                      onClick={() => deleteItem(item.id)}
                      title="Delete"
                      type="button"
                    >
                      <span className="delete-x-icon">X</span>
                    </button>
                  </>
                ) : (
                  <>
                    {/* Complete only when not editing */}
                    <button
                      className={`icon-btn complete-btn ${
                        item.complete ? "complete-icon-green" : ""
                      }`}
                      onClick={() => toggleComplete(item.id)}
                      title="Complete"
                      type="button"
                    >
                      <FaCheck />
                    </button>

                    {/* Edit */}
                    <button
                      className="icon-btn edit-pencil-btn"
                      onClick={() => startEdit(item.id, item.text)}
                      title="Edit"
                      type="button"
                    >
                      <FaPencilAlt />
                    </button>
                  </>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default StreamList;
