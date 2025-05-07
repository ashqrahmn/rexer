import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import NoteCard from './NoteCard';
import { MdAdd } from 'react-icons/md';
import AddEditNotes from './AddEditNotes';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import Toast from './Toast';
import EmptyCard from './EmptyCard';
import AddNotesImg from "../assets/add-note.svg";
import NoDataImg from "../assets/no-data.svg";

const Home = () => {
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: 'add',
    data: null,
  });

  const [showToastMsg, setShowToastMsg] = useState({
    isShown: false, 
    message: "", 
    type: "add",
  });

  const [allNotes, setAllNotes] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [isSearch, setIsSearch] = useState(false);

  const navigate = useNavigate();

  const handleEdit = (noteDetails) => {
    setOpenAddEditModal({
      isShown: true,
      type: 'edit',
      data: noteDetails,
    });
  };

  const showToastMessage = (message, type) => {
    setShowToastMsg({
      isShown: true,
      message,
      type,
    });
  };

  const handleCloseToast = () => {
    setShowToastMsg({
      isShown: false,
      message: "",
    });
  };

  useEffect(() => {
    (async () => {
      try {
        const u = await axiosInstance.get('/get-user');
        if (u.data.user) setUserInfo(u.data.user);
      } catch (e) {
        if (e.response?.status === 401) {
          localStorage.clear();
          navigate('/login');
        }
      }

      try {
        const n = await axiosInstance.get('/get-all-notes');
        if (n.data.notes) setAllNotes(n.data.notes);
      } catch (error) {}
    })();
  }, [navigate]);

  const getAllNotes = async () => {
    const res = await axiosInstance.get('/get-all-notes');
    if (res.data.notes) setAllNotes(res.data.notes);
  };

  const deleteNote = async (data) => {
    const noteId = data._id;
    try {
      const response = await axiosInstance.delete(`/delete-note/${noteId}`);

      if (response.data && !response.data.error) {
        showToastMessage(response.data.message, 'delete');
        getAllNotes();
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        showToastMessage(error.response.data.message, 'error');
      }
    }
  };

  const onSearchNote = async (query) => {
    try {
      const response = await axiosInstance.get("/search-notes", {
        params: { query },
      });

      if (response.data && response.data.notes) {
        setIsSearch(true);
        setAllNotes(response.data.notes);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateIsPinned = async (noteData) => {
    const noteId = noteData._id;
    try {
      const response = await axiosInstance.put(`/update-note-pinned/${noteId}`, {
        isPinned: !noteData.isPinned,
      });

      if (response.data && response.data.note) {
        showToastMessage(response.data.message, 'success');
        getAllNotes();
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        showToastMessage(error.response.data.message, 'error');
      }
    }
  };

  const handleClearSearch = () => {
    setIsSearch(false);
    getAllNotes();
  };

  return (
    <>
      <Navbar 
        userInfo={userInfo} 
        onSearchNote={onSearchNote} 
        handleClearSearch={handleClearSearch}
      />

      <div className="container mx-auto my-10 px-4">
        {allNotes.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {allNotes.map((note) => (
              <NoteCard
                key={note._id}
                title={note.title}
                date={note.createdOn}
                content={note.content}
                tags={note.tags}
                isPinned={note.isPinned}
                bgColor={note.bgColor}
                onEdit={() => handleEdit(note)}
                onDelete={() => deleteNote(note)}
                onPinNote={() => updateIsPinned(note)}
              />
            ))}
          </div>
        ) : (
          <EmptyCard
            imgSrc={isSearch ? NoDataImg : AddNotesImg}
            message={isSearch ? `Oops! No notes found matching your search.` : `Start creating your first note! Click the 'Add' button to jot down thoughts, ideas, and reminders. Let's get started!`}
          />
        )}
      </div>

      <button
        className="w-14 h-14 flex items-center justify-center rounded-full fixed right-10 bottom-10 bg-primary hover:bg-blue-600"
        onClick={() => setOpenAddEditModal({ isShown: true, type: 'add', data: null })}
      >
        <MdAdd className="text-[32px] text-white" />
      </button>

      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={() => setOpenAddEditModal({ isShown: false, type: 'add', data: null })}
        ariaHideApp={false}
        style={{ overlay: { backgroundColor: 'rgba(0,0,0,0.2)' } }}
        className="w-[90%] sm:w-[80%] md:w-[60%] lg:w-[40%] bg-white rounded-md mx-auto mt-10 p-5 overflow-y-auto"
      >
        <AddEditNotes
          type={openAddEditModal.type}
          noteData={openAddEditModal.data || {}}
          getAllNotes={getAllNotes}
          showToastMessage={showToastMessage}
          onClose={() => setOpenAddEditModal({ isShown: false, type: 'add', data: null })}
        />
      </Modal>

      <Toast
        isShown={showToastMsg.isShown}
        message={showToastMsg.message}
        type={showToastMsg.type}
        onClose={handleCloseToast} 
      />
    </>
  );
};

export default Home;