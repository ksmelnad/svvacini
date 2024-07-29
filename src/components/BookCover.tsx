"use client"
import React from 'react';

interface BookCoverProps {
  title: string;
  subtitle?: string;
}

const BookCover: React.FC<BookCoverProps> = ({ title, subtitle }) => {
  return (
    <div className="relative w-40 h-60">
      <div className="bg-[#c4ca2c] text-center shadow-md rounded-b-2xl z-10">
        <h1 className="title text-lg font-medium text-[#666666]">
          {title}
        </h1>
        <h2 className="subtitle text-sm text-[#666666]">
          {subtitle}
        </h2>
      </div>
      <div className="bg-[#eeeeee] border-l border-t border-[#c4ca2c] shadow-md h-2 left-2 absolute top-[-10px] w-190 skew-y-[-45deg]"></div>
      <div className="bg-[#eeeeee] border-b border-r border-[#c4ca2c] shadow-md h-[296px] right-[-10px] absolute top-[-4px] w-2 skew-x-[-45deg]"></div>
    </div>
  );
};

export default BookCover;