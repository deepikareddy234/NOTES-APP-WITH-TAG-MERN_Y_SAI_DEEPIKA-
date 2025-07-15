// Home.jsx
import React, { useEffect, useState } from "react";
import NoteCard from "../../components/Cards/NoteCard";
import { MdAdd } from "react-icons/md";
import Modal from "react-modal";
import AddEditNotes from "./AddEditNotes";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import axios from "axios";
import { toast } from "react-toastify";
import EmptyCard from "../../components/EmptyCard/EmptyCard";
import { TbNotes } from "react-icons/tb";
// ... [imports remain unchanged]

const Home = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [userInfo, setUserInfo] = useState(null);
  const [allNotes, setAllNotes] = useState([]);
  const [displayNotes, setDisplayNotes] = useState([]);
  const [isSearch, setIsSearch] = useState(false);
  const navigate = useNavigate();

  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    } else {
      setUserInfo(currentUser?.rest);
      getAllNotes();
    }
  }, []);

  const getAllNotes = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/note/all", {
        withCredentials: true,
      });
      if (res.data.success === false) return;
      setAllNotes(res.data.notes);
      setDisplayNotes(res.data.notes);
    } catch (error) {
      console.log(error);
    }
  };

  const onSearchNote = async (query) => {
    try {
      const res = await axios.get("http://localhost:3000/api/note/search", {
        params: { query },
        withCredentials: true,
      });
      if (res.data.success === false) {
        toast.error(res.data.message);
        return;
      }
      setIsSearch(true);
      setDisplayNotes(res.data.notes);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleClearSearch = () => {
  setIsSearch(false);
  getAllNotes(); // ✅ Force full re-fetch to fix wakeup tag glitch
};


  const handleEdit = (noteDetails) => {
    setOpenAddEditModal({ isShown: true, data: noteDetails, type: "edit" });
  };

  const deleteNote = async (data) => {
    const noteId = data._id;
    try {
      const res = await axios.delete(
        `http://localhost:3000/api/note/delete/${noteId}`,
        { withCredentials: true }
      );
      if (res.data.success === false) {
        toast.error(res.data.message);
        return;
      }
      toast.success(res.data.message);
      getAllNotes();
    } catch (error) {
      toast(error.message);
    }
  };

  const updateIsPinned = async (noteData) => {
    const noteId = noteData._id;
    try {
      const res = await axios.put(
        `http://localhost:3000/api/note/update-note-pinned/${noteId}`,
        { isPinned: !noteData.isPinned },
        { withCredentials: true }
      );
      if (res.data.success === false) {
        toast.error(res.data.message);
        return;
      }
      toast.success(res.data.message);
      getAllNotes();
    } catch (error) {
      console.log(error.message);
    }
  };

  // ✅ Split notes
  const pinnedNotes = displayNotes.filter((n) => n.isPinned);
  const otherNotes = displayNotes.filter((n) => !n.isPinned);

  return (
    <>
      <div className="min-h-screen bg-amber-100">
        <Navbar
          userInfo={userInfo}
          onSearchNote={onSearchNote}
          handleClearSearch={handleClearSearch}
        />

        <main className="container mx-auto px-4 mt-6">
          {displayNotes.length > 0 && (
            <div className="flex items-center gap-2 mb-6">
              <TbNotes className="text-3xl text-orange-600" />
              <h2 className="text-2xl font-semibold text-gray-800">Your Notes</h2>
            </div>
          )}

          {displayNotes.length > 0 ? (
            <>
              {pinnedNotes.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-blue-700 mb-2">📌 Pinned</h3>
                  <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {pinnedNotes.map((note) => (
                      <NoteCard
                        key={note._id}
                        title={note.title}
                        date={note.createdAt}
                        content={note.content}
                        tags={note.tags}
                        isPinned={note.isPinned}
                        onEdit={() => handleEdit(note)}
                        onDelete={() => deleteNote(note)}
                        onPinNote={() => updateIsPinned(note)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {otherNotes.length > 0 && (
                <div>
                  {pinnedNotes.length > 0 && (
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">Other Notes</h3>
                  )}
                  <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {otherNotes.map((note) => (
                      <NoteCard
                        key={note._id}
                        title={note.title}
                        date={note.createdAt}
                        content={note.content}
                        tags={note.tags}
                        isPinned={note.isPinned}
                        onEdit={() => handleEdit(note)}
                        onDelete={() => deleteNote(note)}
                        onPinNote={() => updateIsPinned(note)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="mt-10">
              <EmptyCard
                imgSrc={
                  isSearch
                    ? "https://studio.uxpincdn.com/studio/wp-content/uploads/2023/03/404-page-best-practice-1024x512.png.webp"
                    : "https://thumb.ac-illust.com/ca/ca4b753442717cc2d30e0ecdbb2171e0_t.jpeg"
                }
                message={
                  isSearch
                    ? "Oops! No Notes found matching your search."
                    : "No notes yet! Start capturing your ideas with the '+' button below."
                }
              />
            </div>
          )}
        </main>

        <button
          className="fixed bottom-6 right-6 w-14 h-14 flex items-center justify-center rounded-full bg-gradient-to-tr from-orange-400 to-pink-500 hover:scale-105 transition-all duration-300 text-white shadow-lg"
          onClick={() =>
            setOpenAddEditModal({ isShown: true, type: "add", data: null })
          }
          title="Add New Note"
        >
          <MdAdd className="text-3xl" />
        </button>
      </div>

      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={() => {}}
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.4)",
          },
        }}
        contentLabel=""
        className="w-[40%] max-md:w-[60%] max-sm:w-[85%] max-h-[85vh]
             overflow-y-auto overflow-x-hidden
             bg-gradient-to-br from-white via-sky-50 to-blue-50
             rounded-2xl mx-auto mt-14 p-6 border border-blue-100 
             shadow-xl"
      >
        <AddEditNotes
          onClose={() =>
            setOpenAddEditModal({ isShown: false, type: "add", data: null })
          }
          noteData={openAddEditModal.data}
          type={openAddEditModal.type}
          getAllNotes={getAllNotes}
        />
      </Modal>
    </>
  );
};

export default Home;

