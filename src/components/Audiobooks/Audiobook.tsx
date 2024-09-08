"use client";
import Link from "next/link";
import React from "react";
import data from "@/data/books.json";
import BookCover from "../BookCover";
import { ArrowLeft, Menu, UserPen, ArrowRight, Music } from "lucide-react";
// import BookCoverImg from "book-cover.svg"
import Image from "next/image";

interface Book {
  book: string;
  book_id: string;
}

const Audiobook = () => {
  return (
    <div className="max-w-7xl mx-auto py-6 lg:py-10 px-4">
      <div className="py-6 md:py-10 mb-6 lg:mb-10 bg-[#edeae1] rounded-md">
        <h1 className="text-2xl lg:text-4xl text-center">संस्कृतवाङ्मयम्</h1>
      </div>
      <div className="flex flex-col space-y-6">
        {data.map((item: any, index: number) => (
          <div key={index}>
            <h3 className="text-xl text-red-700">{item.name}</h3>
            <div className="flex flex-wrap gap-4 my-4">
              {item.books.map((book: any) => (
                <Link
                  key={book.book_id}
                  href={`/audiobooks/${book.book_id}`}
                  className="px-4 py-6 rounded border hover:border-gray-300 hover:bg-[#f0eee2]/80 flex flex-col gap-4 items-center 
            transition ease-in-out duration-300
            "
                >
                  <p className="tracking-wide text-gray-800 text-xl">
                    {book.book}
                  </p>
                  {book.author !== "" && (
                    <div className="flex items-center gap-2">
                      <UserPen size={15} />
                      <p className="tracking-wide text-gray-800 text-sm">
                        {book.author}
                      </p>
                    </div>
                  )}
                  {book.audio && book.audio !== "" && (
                    <div className="flex items-center gap-2">
                      <Music size={15} />
                      <p className="tracking-wide text-gray-800 text-sm">
                        {book.audio}
                      </p>
                    </div>
                  )}
                </Link>
              ))}
            </div>
            <hr />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Audiobook;
