import React, { useEffect, useState } from "react";
import NoteCard from "../../components/Cards/NoteCard";
import { MdAdd } from "react-icons/md";
import Modal from "react-modal";
import AddEditNotes from "./AddEditNotes";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import api from "../../utils/axios";           // USE central axios
import { toast } from "react-toastify";
import EmptyCard from "../../components/EmptyCard/EmptyCard";
import { TbNotes } from "react-icons/tb";

const Home = () => {
  const { currentUser } = useSelector((s) => s.user);
  const navigate = useNavigate();

  const [allNotes,     setAllNotes]     = useState([]);
  const [displayNotes, setDisplayNotes] = useState([]);
  const [isSearch,     setIsSearch]     = useState(false);

  const [modal, setModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  /* ------------------ fetch notes ------------------ */
  const getAllNotes = async () => {
    try {
      const res = await api.get("/note/all");
      if (res.data.success === false) return;
      setAllNotes(res.data.notes || []);
      setDisplayNotes(res.data.notes || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load notes");
    }
  };

  /* ------------------ search ------------------ */
  const onSearchNote = async (query) => {
    try {
      const res = await api.get("/note/search", { params: { query } });
      if (res.data.success === false) {
        toast.error(res.data.message);
        return;
      }
      setIsSearch(true);
      setDisplayNotes(res.data.notes || []);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleClearSearch = () => {
    setIsSearch(false);
    getAllNotes();
  };

  /* ------------------ note actions ------------------ */
  const handleEdit = (note) =>
    setModal({ isShown: true, type: "edit", data: note });

  const deleteNote = async (note) => {
    try {
      const res = await api.delete(`/note/delete/${note._id}`);
      if (res.data.success === false) return toast.error(res.data.message);
      toast.success(res.data.message);
      getAllNotes();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const togglePin = async (note) => {
    try {
      const res = await api.put(`/note/update-note-pinned/${note._id}`, {
        isPinned: !note.isPinned,
      });
      if (res.data.success === false) return toast.error(res.data.message);
      getAllNotes();
    } catch (err) {
      toast.error(err.message);
    }
  };

  /* ------------------ auth guard & first load ------------------ */
  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    } else {
      getAllNotes();
    }
  }, [currentUser]);

  /* ------------------ split notes ------------------ */
  const pinned    = displayNotes.filter((n) => n.isPinned);
  const unpinned  = displayNotes.filter((n) => !n.isPinned);

  return (
    <>
      <div className="min-h-screen bg-amber-100">
        <Navbar
          onSearchNote={onSearchNote}
          handleClearSearch={handleClearSearch}
        />

        <main className="container mx-auto px-4 mt-6">
          {displayNotes.length > 0 && (
            <div className="flex items-center gap-2 mb-6">
              <TbNotes className="text-3xl text-orange-600" />
              <h2 className="text-2xl font-semibold text-gray-800">
                Your Notes
              </h2>
            </div>
          )}

          {displayNotes.length > 0 ? (
            <>
              {pinned.length > 0 && (
                <section className="mb-8">
                  <h3 className="text-lg font-semibold text-blue-700 mb-2">
                    📌 Pinned
                  </h3>
                  <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {pinned.map((n) => (
                      <NoteCard
                        key={n._id}
                        {...n}
                        onEdit={() => handleEdit(n)}
                        onDelete={() => deleteNote(n)}
                        onPinNote={() => togglePin(n)}
                      />
                    ))}
                  </div>
                </section>
              )}

              {unpinned.length > 0 && (
                <section>
                  {pinned.length > 0 && (
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">
                      Other Notes
                    </h3>
                  )}
                  <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {unpinned.map((n) => (
                      <NoteCard
                        key={n._id}
                        {...n}
                        onEdit={() => handleEdit(n)}
                        onDelete={() => deleteNote(n)}
                        onPinNote={() => togglePin(n)}
                      />
                    ))}
                  </div>
                </section>
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
          className="fixed bottom-6 right-6 w-14 h-14 flex items-center justify-center
                     rounded-full bg-gradient-to-tr from-orange-400 to-pink-500
                     hover:scale-105 transition-all duration-300 text-white shadow-lg"
          onClick={() => setModal({ isShown: true, type: "add", data: null })}
          title="Add New Note"
        >
          <MdAdd className="text-3xl" />
        </button>
      </div>

      {/* ------------------ modal ------------------ */}
      <Modal
        isOpen={modal.isShown}
        onRequestClose={() => setModal({ isShown: false, type: "add", data: null })}
        overlayClassName="fixed inset-0 bg-black bg-opacity-40 flex items-start justify-center z-50"
        className="w-[40%] max-md:w-[60%] max-sm:w-[85%] max-h-[85vh] overflow-y-auto
                   bg-gradient-to-br from-white via-sky-50 to-blue-50 rounded-2xl
                   p-6 border border-blue-100 shadow-xl mt-14"
        ariaHideApp={false}
      >
        <AddEditNotes
          onClose={() => setModal({ isShown: false, type: "add", data: null })}
          noteData={modal.data}
          type={modal.type}
          getAllNotes={getAllNotes}
        />
      </Modal>
    </>
  );
};

export default Home;
