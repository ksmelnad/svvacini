"use client";
import React, { useEffect, useState } from "react";
import { shobhika } from "@/utils/shobhika";

interface TreeNode {
  title: string;
  path: string;
  cName?: string; // make cName optional
  id?: string; // make id optional
  nodes?:
    | (TreeNode & { nodes?: never })[]
    | (TreeNode & { nodes: TreeNode[] })[]; // make nodes optional
}

function Sidebar({
  sidebarActive,
  setSidebarActive,
  bookData,
  setCurrentChapterIndex,
  currentChapterIndex,
}: {
  sidebarActive: boolean;
  setSidebarActive: React.Dispatch<React.SetStateAction<boolean>>;
  bookData: any;
  currentChapterIndex: number;
  setCurrentChapterIndex: React.Dispatch<React.SetStateAction<number>>;
}) {
  const [smallWidth, setSmallWidth] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setSmallWidth(window.innerWidth < 768);

      const handleResize = () => {
        setSmallWidth(window.innerWidth < 768);
      };

      window.addEventListener("resize", handleResize);

      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  return (
    <div
      className={`${
        sidebarActive ? "block" : "hidden"
      } fixed top-16 left-0  bg-[#efe7d673] border-r border-r-[bg-primary] shadow-sm w-64  h-full  
      
      ${shobhika.className} `}
    >
      <h3 className="px-4 text-xl py-4">{bookData.title}</h3>
      <hr />
      <ul className="pl-6 pr-4 pt-4 space-y-4">
        {bookData.chapters.map((chapter: any, chIndex: number) => (
          <li key={chapter.id}>
            <button
              className={`block text-left text-sm hover:text-red-700 transition-colors
              ${
                currentChapterIndex === chIndex
                  ? "text-red-700 font-semibold"
                  : ""
              }`}
              onClick={() => {
                setCurrentChapterIndex(chIndex);
                if (smallWidth) {
                  setSidebarActive(false);
                }
              }}
            >
              {chapter.title}
            </button>
            {chapter.sections.map((section: any, index: number) => (
              <ul
                key={section.id}
                className="block text-left pt-2 px-3 space-y-3 border-l border-l-gray-200"
              >
                <li key={section.id} className="">
                  <button
                    className="text-sm hover:text-red-700 transition-colors"
                    onClick={() => {
                      setCurrentChapterIndex(chIndex);
                      if (smallWidth) {
                        setSidebarActive(false);
                      }
                    }}
                  >
                    {section.title}
                  </button>
                </li>
              </ul>
            ))}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;
