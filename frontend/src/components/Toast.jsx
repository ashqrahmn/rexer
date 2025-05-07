import React, { useEffect } from 'react';
import { LuCheck } from 'react-icons/lu';
import { MdDeleteOutline } from 'react-icons/md';
import { MdErrorOutline } from 'react-icons/md';

const Toast = ({ isShown, message, type, onClose }) => {
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onClose();
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [isShown, onClose]);

  return (
    <div
      className={`absolute bottom-6 left-6 transition-all duration-300 ease-in-out 
        transform ${isShown ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}
    >
      <div
        className={`min-w-52 bg-white border shadow-2xl rounded-md relative after:w-[5px] after:h-full 
          ${type === 'delete' ? 'after:bg-red-500' : type === 'error' ? 'after:bg-orange-500' : 'after:bg-green-500'}
          after:absolute after:left-0 after:top-0 after:rounded-l-lg`}
      >
        <div className='flex items-center gap-3 py-2 px-4'>
          <div
            className={`w-10 h-10 flex items-center justify-center rounded-full
              ${type === 'delete' ? 'bg-red-50' : type === 'error' ? 'bg-orange-50' : 'bg-green-50'}`}
          >
            {type === 'delete' ? (
              <MdDeleteOutline className='text-xl text-red-500' />
            ) : type === 'error' ? (
              <MdErrorOutline className='text-xl text-orange-500' />
            ) : (
              <LuCheck className='text-xl text-green-500' />
            )}
          </div>
          <p className='text-sm text-slate-800'>{message}</p>
        </div>
      </div>
    </div>
  );
};

export default Toast;