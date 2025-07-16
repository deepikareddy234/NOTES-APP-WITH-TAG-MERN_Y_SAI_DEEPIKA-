import React, { useState } from "react";
import { MdClose } from "react-icons/md";
import TagInput from "../../components/Input/TagInput";
import api from "../../utils/axios";
import { toast } from "react-toastify";

const AddEditNotes = ({ onClose, noteData = {}, type, getAllNotes }) => {
  const [title,   setTitle]   = useState(noteData?.title   || "");
  const [content, setContent] = useState(noteData?.content || "");
  const [tags,    setTags]    = useState(noteData?.tags    || []);
  const [error,   setError]   = useState(null);

  /* ---------- helpers ---------- */
  const submitNote = async () => {
    try {
      const url  = type === "edit" ? `/note/edit/${noteData._id}` : "/note/add";
      const verb = type === "edit" ? "put" : "post";
      const res  = await api[verb](url, { title, content, tags });

      if (res.data.success === false) {
        setError(res.data.message);
        toast.error(res.data.message);
        return;
      }

      toast.success(type === "edit" ? "Note updated" : "Note added");
      onClose();              // close modal first
      await getAllNotes();    // refresh list
    } catch (err) {
      setError(err.message);
      toast.error(type === "edit" ? "Update failed" : "Add failed");
    }
  };

  const handleSubmit = () => {
    if (!title.trim())   return setError("Enter a title");
    if (!content.trim()) return setError("Enter content");
    setError(null);
    submitNote();
  };

  return (
    <div className="relative">
      <button
        className="w-9 h-9 rounded-full flex items-center justify-center
                   absolute -top-3 -right-3 bg-slate-50 hover:bg-slate-100"
        onClick={onClose}
      >
        <MdClose className="text-xl text-slate-500" />
      </button>

      {/* Title */}
      <label className="block text-sm font-semibold text-red-400 uppercase mb-1">
        Title
      </label>
      <input
        type="text"
        className="w-full text-2xl bg-blue-50 p-2 rounded shadow-sm outline-none"
        placeholder="Enter your title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      {/* Content */}
      <label className="block text-sm font-semibold text-red-400 uppercase mt-4 mb-1">
        Content
      </label>
      <textarea
        className="w-full text-sm bg-blue-100 p-3 rounded shadow-sm resize-y outline-none"
        placeholder="Content..."
        rows={10}
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      {/* Tags */}
      <label className="block text-sm font-semibold text-red-400 uppercase mt-4 mb-1">
        Tags
      </label>
      <TagInput tags={tags} setTags={setTags} />

      {error && <p className="text-red-500 text-xs pt-4">{error}</p>}

      <button
        className="btn-primary w-full font-medium mt-6 py-3"
        onClick={handleSubmit}
      >
        {type === "edit" ? "UPDATE" : "ADD"}
      </button>
    </div>
  );
};

export default AddEditNotes;
