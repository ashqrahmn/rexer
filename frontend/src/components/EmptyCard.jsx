import React from 'react';

const EmptyCard = ({ imgSrc, message }) => {
  return (
    <div className="flex flex-col items-center justify-center mt-20">
      <img
        src={imgSrc}
        alt="No items found"
        className="w-48 sm:w-48 md:w-60 lg:w-60"
      />
      <p className="w-11/12 sm:w-10/12 md:w-1/2 text-sm font-medium text-slate-700 text-center leading-7 mt-5">
        {message}
      </p>
    </div>
  );
};

export default EmptyCard;