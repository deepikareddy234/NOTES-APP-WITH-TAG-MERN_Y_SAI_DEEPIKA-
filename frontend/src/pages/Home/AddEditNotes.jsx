// frontend/src/pages/Home/AddEditNotes.jsx
import React, { useState } from "react";
import { MdClose } from "react-icons/md";
import TagInput from "../../components/Input/TagInput"; // ← relative path
import api from "../../utils/axios";                    // ← central axios
import { toast } from "react-toastify";

const AddEditNotes = ({ onClose, noteData = {}, type, getAllNotes }) => {
  const [title, setTitle]   = useState(noteData.title   || "");
  const [content, setContent] = useState(noteData.content || "");
  const [tags, setTags]     = useState(noteData.tags    || []);
  const [error, setError]   = useState(null);

  // ---------- API helpers ----------
  const editNote = async () => {
    try {
      const res = await api.put(`/note/edit/${noteData._id}`, {
        title,
        content,
        tags,
      });
      if (res.data.success === false) {
        setError(res.data.message);
        toast.error(res.data.message);
        return;
      }
      toast.success("Note updated");
      getAllNotes();
      onClose();
    } catch (err) {
      toast.error("Update failed");
      setError(err.message);
    }
  };

  const addNewNote = async () => {
    try {
      const res = await api.post("/note/add", { title, content, tags });
      if (res.data.success === false) {
        setError(res.data.message);
        toast.error(res.data.message);
        return;
      }
      toast.success("Note added");
      getAllNotes();
      onClose();
    } catch (err) {
      toast.error("Add failed");
      setError(err.message);
    }
  };

  const handleSubmit = () => {
    if (!title.trim())   return setError("Enter a title");
    if (!content.trim()) return setError("Enter content");
    setError(null);
    type === "edit" ? editNote() : addNewNote();
  };

  return (
    <div className="relative">
      <button
        className="w-10 h-10 rounded-full flex items-center justify-center absolute -top-3 -right-3 hover:bg-slate-50"
        onClick={onClose}
      >
        <MdClose className="text-xl text-slate-400" />
      </button>

      {/* Title */}
      <div className="flex flex-col gap-2">
        <label className="input-label text-red-400 uppercase">Title</label>
        <input
          type="text"
          className="text-2xl outline-none bg-blue-50 p-2 rounded shadow-sm"
          placeholder="Enter your title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      {/* Content */}
      <div className="flex flex-col gap-2 mt-4">
        <label className="input-label text-red-400 uppercase">Content</label>
        <textarea
          className="text-sm outline-none bg-blue-100 p-3 rounded shadow-sm resize-y"
          placeholder="Content..."
          rows={10}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>

      {/* Tags */}
      <div className="mt-3">
        <label className="input-label text-red-400 uppercase">Tags</label>
        <TagInput tags={tags} setTags={setTags} />
      </div>

      {error && <p className="text-red-500 text-xs pt-4">{error}</p>}

      <button
        className="btn-primary font-medium mt-5 p-3"
        onClick={handleSubmit}
      >
        {type === "edit" ? "UPDATE" : "ADD"}
      </button>
    </div>
  );
};

export default AddEditNotes;
