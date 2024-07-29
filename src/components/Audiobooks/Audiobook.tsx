"use client";
import Link from "next/link";
import React from "react";
import books from "@/data/books.json";
import BookCover from "../BookCover";
// import BookCoverImg from "book-cover.svg"
import Image from "next/image";

interface Book {
  book: string;
  book_id: string;
}

const Audiobook = () => {
  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
      <div className="flex flex-wrap justify-center gap-4">
        {books.map((book: Book) => (
          <Link
            key={book.book_id}
            href={`/audiobooks/${book.book_id}`}
            className=" p-2 shadow-md rounded-lg hover:shadow-lg flex flex-col gap-2 items-center"
          >
            <Image
              src="/book-cover.svg"
              alt="book-cover"
              height={500}
              width={200}
            />

            <p className="uppercase tracking-wide font-bold text-gray-600">
              {book.book}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Audiobook;
