import React from "react";

const bookTitles = [
  "The Art of Code",
  "Journey to the Center of JavaScript",
  "CSS for the Modern Web",
  "The Next.js Handbook",
  "TypeScript in Depth",
  "Mastering React",
  "JavaScript: The Good Parts",
  "Advanced TailwindCSS Techniques",
  "Learning Algorithms",
  "The Pragmatic Programmer",
  "Web Development with Next.js",
  "Understanding the DOM",
  "Building Scalable Apps",
  "Pro TypeScript",
  "TailwindCSS for Beginners",
];
import books from "@/data/books.json";

const randomFontSize = () => {
  const sizes = [
    "text-sm",
    "text-base",
    "text-lg",
    "text-xl",
    "text-2xl",
    "text-3xl",
  ];
  return sizes[Math.floor(Math.random() * sizes.length)];
};

const BookTitlesMarquee: React.FC = () => {
  const rows: string[][] = [[], [], []];

  // Distribute the book titles into three rows
  books.forEach((item, index) => {
    rows[index % 3].push(item.book);
  });

  return (
    <div className="relative overflow-hidden w-full h-48 bg-white py-4 [mask-image:linear-gradient(to_right,transparent,black,transparent)]">
      {rows.map((row, rowIndex) => (
        <div
          key={rowIndex}
          className={`absolute w-full flex gap-6 animate-marquee pr-6 ${
            rowIndex === 0 ? "top-4" : rowIndex === 1 ? "top-1/3" : "top-2/3"
          }`}
        >
          {/* Duplicate the row to ensure continuity */}
          {[...row, ...row].map((title, titleIndex) => (
            <span
              key={titleIndex}
              className={`inline-block ${randomFontSize()} px-5 font-semibold whitespace-nowrap`}
            >
              {title}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
};

export default BookTitlesMarquee;
