import React, { useState } from 'react';
import { MdAdd, MdClose } from 'react-icons/md';
import { PiPaintBucketFill } from 'react-icons/pi';
import axiosInstance from '../utils/axiosInstance';

const AddEditNotes = ({ noteData, type, getAllNotes, onClose, showToastMessage }) => {
  const [title, setTitle] = useState(noteData?.title || '');
  const [content, setContent] = useState(noteData?.content || '');
  const [tags, setTags] = useState(noteData?.tags || []);
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState(null);
  const [selectedColor, setSelectedColor] = useState(noteData?.bgColor || '#FFFFFF');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const addNewNote = async () => {
    try {
      const response = await axiosInstance.post('/add-note', {
        title,
        content,
        tags,
        bgColor: selectedColor,
      });

      if (response.data?.note) {
        showToastMessage(response.data.message);
        getAllNotes();
        onClose();
      }
    } catch (error) {
      if (error.response?.data?.message) {
        showToastMessage(error.response.data.message, 'error');
      }
    }
  };

  const editNote = async () => {
    const noteId = noteData._id;
    try {
      const response = await axiosInstance.put(`/edit-note/${noteId}`, {
        title,
        content,
        tags,
        bgColor: selectedColor,
      });

      if (response.data?.note) {
        showToastMessage(response.data.message, 'success');
        getAllNotes();
      }
    } catch (error) {
      if (error.response?.data?.message) {
        showToastMessage(error.response.data.message, 'error');
      }
    }
  };

  const handleAddNote = () => {
    if (!title.trim()) {
      return setError('Please enter the title');
    }
    if (!content.trim()) {
      return setError('Please enter the content');
    }

    setError('');
    type === 'edit' ? editNote() : addNewNote();
  };

  const handleClose = () => {
    if (type === 'edit' && hasChanges) {
      if (!title.trim()) {
        return setError('Please enter the title');
      }
      if (!content.trim()) {
        return setError('Please enter the content');
      }
      editNote();
    }
    onClose();
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    if (error) setError('');
    setHasChanges(true);
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
    if (error) setError('');
    setHasChanges(true);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    if (error) setError('');
  };

  const addNewTag = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    if (tags.includes(trimmed)) return setError('This tag already exists');

    setTags([...tags, trimmed]);
    setInputValue('');
    setError('');
    setHasChanges(true);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') addNewTag();
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
    setHasChanges(true);
  };

  return (
    <div className="relative">
      <button
        className="w-10 h-10 rounded-full flex items-center justify-center absolute -top-3 -right-3"
        onClick={handleClose}
      >
        <MdClose className="text-xl text-slate-400 hover:text-blue-500" />
      </button>

      <div className="flex flex-col gap-2">
        <label className="text-xs text-slate-400">TITLE</label>
        <input
          type="text"
          className="text-2xl text-slate-700 outline-none"
          placeholder="Title"
          value={title}
          onChange={handleTitleChange}
        />
      </div>

      <div className="flex flex-col gap-2 mt-4">
        <label className="text-xs text-slate-400">CONTENT</label>
        <textarea
          className="text-sm text-slate-700 outline-none p-2 rounded resize-none"
          placeholder="Write your note..."
          rows={10}
          value={content}
          onChange={handleContentChange}
        />
      </div>

      <div className="flex flex-col gap-2 mt-4">
        <label className="text-xs text-slate-400">TAGS</label>

        {tags.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap mt-2 overflow-y-auto max-h-[7.5rem] pr-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="flex items-center gap-2 text-sm text-slate-700 bg-slate-100 px-3 py-1 rounded"
              >
                # {tag}
                <button onClick={() => handleRemoveTag(tag)}>
                  <MdClose />
                </button>
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center gap-4 mt-3">
          <input
            type="text"
            value={inputValue}
            className="text-sm bg-transparent border px-2 py-2 rounded outline-none w-[50%] sm:w-[40%] lg:w-[40%]"
            placeholder="Add tags"
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            maxLength={30}
          />

          <button
            className="w-8 h-8 flex items-center justify-center rounded hover:bg-transparent"
            onClick={addNewTag}
          >
            <MdAdd className="text-2xl text-gray-400 hover:text-blue-500 transition-colors duration-200" />
          </button>

          <div className="relative inline-block">
            {showColorPicker && (
              <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 flex gap-2 bg-white p-2 rounded shadow z-10">
                {['#FFFFFF', '#F3E5F5', '#FFFDE7', '#E1F5FE', '#FFEBEE'].map((color) => (
                  <button
                    key={color}
                    className="w-6 h-6 rounded-full border-2 border-white shadow"
                    style={{ backgroundColor: color }}
                    onClick={() => {
                      setSelectedColor(color);
                      setShowColorPicker(false);
                      setHasChanges(true);
                    }}
                  />
                ))}
              </div>
            )}

            <button
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:bg-slate-100"
              style={{ backgroundColor: selectedColor }}
            >
              <PiPaintBucketFill size={18} className="hover:text-blue-500 transition-colors duration-200" />
            </button>
          </div>
        </div>
      </div>

      <div className="min-h-[1.25rem] pt-1">
        {error && <p className="text-red-500 text-xs">{error}</p>}
      </div>

      {type !== 'edit' && (
        <button
          className="w-full text-sm bg-primary text-white p-3 rounded mt-5 hover:bg-blue-600 font-medium"
          onClick={handleAddNote}
        >
          ADD
        </button>
      )}
    </div>
  );
};

export default AddEditNotes;