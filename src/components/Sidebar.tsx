"use client";
import React, { useEffect, useState } from "react";
import { shobhika } from "@/utils/shobhika";
import { useSelectedTextTimeStore } from "@/utils/useStore";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { X } from "lucide-react";
import { Button } from "./ui/button";

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
  const { selectedTextTime, setSelectedTextTime } = useSelectedTextTimeStore();

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

  const ModalOverlay = () => (
    <div
      className={`flex md:hidden fixed top-0 right-0 bottom-0 left-0 bg-black/50 z-30`}
      onClick={() => {
        setSidebarActive(false);
      }}
    />
  );

  return (
    <aside
      className={`${
        sidebarActive ? "ml-0" : "-ml-64 lg:ml-0"
      } bg-[#edeae1] fixed top-18 left-2 bottom-2 h-[calc(100vh-5rem)] rounded-md shadow-md w-60 
  transition-[margin-left] ease-in-out duration-500  z-40
  
  ${shobhika.className} `}
    >
      <div className="flex justify-between items-center">
        <h3 className="px-4 text-xl py-4 mt-4">अनुक्रमणिका</h3>
        <Button
          variant="ghost"
          onClick={() => setSidebarActive(false)}
          className="lg:hidden mr-2"
          size="icon"
        >
          <X size={20} />
        </Button>
      </div>

      <ul className="pl-6 pr-4 pt-4 space-y-4">
        {bookData?.chapters &&
          bookData?.chapters.map((chapter: any, chIndex: number) => (
            <li key={chapter.id}>
              <button
                className={`block text-left text-sm hover:text-red-700 transition-colors
              ${
                currentChapterIndex === chIndex
                  ? "text-red-700 font-semibold"
                  : ""
              }`}
                onClick={() => {
                  setSelectedTextTime(0);
                  setCurrentChapterIndex(chIndex);

                  setSidebarActive(false);
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
                        setSelectedTextTime(0);
                        setCurrentChapterIndex(chIndex);

                        setSidebarActive(false);
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

      {sidebarActive && <ModalOverlay />}
    </aside>
  );
}

export default Sidebar;
