"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import ShowRoots from "./ShowRoots";
const DialogDictionary = ({ key, word }: { key: string; word: string }) => {
  return (
    <Dialog key={key}>
      <DialogTrigger asChild>
        <span className="hover:underline hover:text-green-500 hover:cursor-pointer">
          {" "}
          {word}
        </span>
      </DialogTrigger>
      <DialogContent className="sm:w-[800px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Analysis and Dictionary Look Up</DialogTitle>
          <DialogDescription>
            Root forms are obtained from the{" "}
            <a
              className="text-blue-400 hover:underline"
              href="https://sanskrit.inria.fr/DICO/reader.fr.html"
              target="_blank"
            >
              Sanskrit Reader Companion
            </a>{" "}
            and Dictionaries from{" "}
            <a
              className="text-blue-400 hover:underline"
              href="https://www.sanskrit-lexicon.uni-koeln.de/"
              target="_blank"
            >
              Cologne Digital Sanskrit Dictionaries.
            </a>
          </DialogDescription>
          <div>
            <p className="my-2 text-lg text-red-700">{word}</p>
            <ShowRoots query={word} />
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default DialogDictionary;
