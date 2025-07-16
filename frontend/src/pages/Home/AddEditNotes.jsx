import React, { useState } from "react";
import { MdClose } from "react-icons/md";
import TagInput from "@/components/Input/TagInput";
import api from "@/utils/axios";
import { toast } from "react-toastify";

const AddEditNotes = ({ onClose, noteData, type, getAllNotes }) => {
  const [title, setTitle]   = useState(noteData?.title   || "");
  const [content, setContent] = useState(noteData?.content || "");
  const [tags, setTags]     = useState(noteData?.tags    || []);
  const [error, setError]   = useState(null);

  // ---------- API helpers ----------
  const editNote = async () => {
    const noteId = noteData._id;
    try {
      const res = await api.put(`/api/note/edit/${noteId}`, {  // ← /api/note
        title,
        content,
        tags,
      });
      if (res.data.success === false) {
        toast.error(res.data.message);
        return setError(res.data.message);
      }
      toast.success("Note updated");
      getAllNotes();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Update failed");
      setError(err.message);
    }
  };

  const addNewNote = async () => {
    try {
      const res = await api.post("/api/note/add", {           // ← /api/note
        title,
        content,
        tags,
      });
      if (res.data.success === false) {
        toast.error(res.data.message);
        return setError(res.data.message);
      }
      toast.success("Note added");
      getAllNotes();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Add failed");
      setError(err.message);
    }
  };

  const handleSubmit = () => {
    if (!title.trim())   return setError("Please enter the title");
    if (!content.trim()) return setError("Please enter the content");
    setError(null);
    type === "edit" ? editNote() : addNewNote();
  };

  /* ------------- JSX stays the same (omitted for brevity) ------------- */
};

export default AddEditNotes;
