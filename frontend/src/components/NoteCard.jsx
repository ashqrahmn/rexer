import React from 'react';
import { MdOutlinePushPin, MdDelete } from 'react-icons/md';
import moment from 'moment';
import { motion } from 'framer-motion';

const NoteCard = ({
  title,
  date,
  content,
  tags,
  bgColor,
  isPinned,
  onEdit,
  onDelete,
  onPinNote
}) => {
  const formatContent = (text) => {
    if (!text) return '';
    const truncated = text.length > 30 ? `${text.slice(0, 30)}...` : text;
    return truncated.length > 15 
      ? `${truncated.slice(0, 15)}\n${truncated.slice(15)}` 
      : truncated;
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="border rounded p-4 hover:shadow-xl transition-all ease-in-out cursor-pointer flex flex-col h-full"
      style={{ backgroundColor: bgColor }}
      onClick={onEdit}
    >
      <div className="flex justify-between items-start gap-2">
        <div className="flex-1 min-w-0">
          <h6 className="text-sm font-medium truncate">
            {title?.length > 15 ? `${title.slice(0, 15)}...` : title}
          </h6>
          <span className="text-xs text-slate-500">
            {moment(date).format('Do MMM YYYY')}
          </span>
        </div>
        
        <MdOutlinePushPin
          className={`icon-btn ${isPinned ? 'text-primary' : 'text-slate-300'}`}
          onClick={(e) => {
            e.stopPropagation();
            onPinNote();
          }}
        />
      </div>

      <p className="text-xs text-slate-600 mt-2 whitespace-pre-line line-clamp-2 h-10 overflow-hidden">
        {formatContent(content)}
      </p>

      <div className="flex items-center justify-between mt-2">
        <div className="text-xs text-slate-500 truncate">
          {tags.slice(0, 1).map((item) => `#${item.slice(0, 15)}`)}
          {tags.length > 1 && '...'}
        </div>
        
        <MdDelete
          className="icon-btn hover:text-red-500"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        />
      </div>
    </motion.div>
  );
};

export default NoteCard;