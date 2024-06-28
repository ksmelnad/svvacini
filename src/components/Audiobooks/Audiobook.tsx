"use client";
import Link from "next/link";
import React from "react";
import books from "@/data/books.json";

interface Book {
  book: string;
  book_id: string;
}

const Audiobook = () => {
  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
      <div className="flex flex-wrap -mx-4">
        {books.map((book: Book) => (
          <Link
            key={book.book_id}
            href={`/audiobooks/${book.book_id}`}
            className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/6 px-4 mb-8"
          >
            <div className="bg-white rounded-lg overflow-hidden shadow-lg">
              <div className="w-full h-48 object-cover object-center bg-orange-300" />
              <div className="p-4">
                <p className="uppercase tracking-wide text-sm font-bold text-gray-700">
                  {book.book}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Audiobook;
