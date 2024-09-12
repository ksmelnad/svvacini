"use client";

import axios from "axios";
import React, { useState, useEffect } from "react";
import Dictionary from "./Dictionary";
import { MoveRight } from "lucide-react";

interface RootData {
  [key: string]: string;
}
const ShowRoots = ({ query }: { query: string }) => {
  const [roots, setRoots] = useState<[string, string][]>([]);
  const [selectedDictionary, setSelectedDictionary] = useState<string>("");

  const [selectedRoot, setSelectedRoot] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchRoots = async () => {
      setIsLoading(true);
      const url = process.env.NEXT_PUBLIC_GET_ROOTS_LAMBDA_URL!;
      if (!url) {
        console.error("GET_ROOTS_LAMBDA_URL environment variable is not set");
        return;
      }
      const response = await axios.post(url, {
        query: query,
      });
      const data = response.data;

      const { roots }: RootData = data.body;

      if (data.error) {
        setError(data.error);
      }
      if (roots) {
        setRoots(Object.entries(roots));
      }
      setIsLoading(false);
    };
    fetchRoots();
  }, [query]);

  if (error) {
    return (
      <div className="p-4">
        <p className="text-red-500">Error fetching roots</p>
      </div>
    );
  }
  if (isLoading) {
    return (
      <div className="p-4">
        <p className="animate-pulse">Loading...</p>
      </div>
    );
  }

  return (
    <div className="">
      <div className="flex flex-wrap gap-2 p-2 rounded bg-[#edeae1] mb-4">
        {roots.map(([root, text], index) => (
          <p key={index} className="flex items-center space-x-1 px-1">
            <span
              className={
                selectedDictionary === "apte" || selectedDictionary === "shabda"
                  ? "hover:cursor-pointer text-[#008080] hover:underline"
                  : ""
              }
              onClick={
                selectedDictionary === "apte" || selectedDictionary === "shabda"
                  ? () => setSelectedRoot(text)
                  : undefined
              }
            >
              {text}
            </span>
            <MoveRight size={15} />
            <span
              className={
                selectedDictionary !== "apte" && selectedDictionary !== "shabda"
                  ? "hover:cursor-pointer text-[#008080] hover:underline"
                  : ""
              }
              onClick={
                selectedDictionary !== "apte" && selectedDictionary !== "shabda"
                  ? () => setSelectedRoot(root)
                  : undefined
              }
            >
              {root}
            </span>
            <span>, </span>
          </p>
        ))}
      </div>
      <hr />

      {selectedRoot && (
        <Dictionary
          setSelectedDictionary={setSelectedDictionary}
          word={selectedRoot}
        />
      )}
    </div>
  );
};

export default ShowRoots;
