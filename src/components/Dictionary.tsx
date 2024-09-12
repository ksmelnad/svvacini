"use client";
import React, { useState, useEffect } from "react";
import {
  Select,
  SelectGroup,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectLabel,
} from "@/components/ui/select";
import styles from "@/styles/Dictionary.module.css";

interface WordEntry {
  id: number;
  headword: string;
  gender: string;
  meaning: string;
  lnum: string;
  hrefdata: string;
  source: string;
  category: string;
}

const Dictionary = ({
  word,
  setSelectedDictionary,
}: {
  word: string;
  setSelectedDictionary: (dictionary: string) => void;
}) => {
  // const [word, setWord] = useState("");
  const [filter, setFilter] = useState("deva");
  const [transLit, setTransLit] = useState("deva");
  const [accent, setAccent] = useState("no");
  // const [wordEntries, setWordEntries] = useState<WordEntry[]>([]);
  const [dictionary, setDictionary] = useState("mw");
  const [targetCologneBasicContent, setTargetCologneBasicContent] =
    useState("");
  const [loading, setLoading] = useState(false);

  // console.log(wordEntries);

  useEffect(() => {
    getWord();
  }, [word, dictionary]);
  const getWord = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${
          dictionaries[dictionary].url
        }/2020/web/webtc/getword.php?key=${encodeURIComponent(
          word
        )}&filter=${encodeURIComponent(filter)}&accent=${encodeURIComponent(
          accent
        )}&transLit=${encodeURIComponent(transLit)}`
      );
      const html = await response.text();

      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");

      const CologneBasic = doc.getElementById("CologneBasic");
      // const TargetCologneBasic = document.getElementById("TargetCologneBasic");
      setTargetCologneBasicContent(CologneBasic?.innerHTML || "");

      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Error: Could not retrieve data from the server.");
    }
  };

  const handleChangeDictionary = (value: string) => {
    setDictionary(value);
    setSelectedDictionary(value);
  };

  return (
    <div className="py-2">
      <div className="flex justify-between items-center my-2">
        <p className="text-lg text-red-700">{word}</p>
        <Select onValueChange={handleChangeDictionary} value={dictionary}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Choose Dictionary" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Dictionary</SelectLabel>
              {Object.keys(dictionaries).map((key) => (
                <SelectItem key={dictionaries[key].short} value={key}>
                  {dictionaries[key].short}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <h1 className="py-2 text-sm font-semibold">
        {dictionaries[dictionary].name}
      </h1>
      {loading ? (
        <p>Loading...</p>
      ) : targetCologneBasicContent ? (
        <>
          <div
            id="CologneBasic"
            dangerouslySetInnerHTML={{
              __html: targetCologneBasicContent,
            }}
            className={`max-h-[250px] overflow-y-auto overflow-x-hidden`}
          />
          <style jsx global>{`
            /* Applying custom style to the sdata_siddhanta class */
            .sdata_siddhanta {
              color: teal !important; /* Custom text color, for example */
              // font-size: 1rem !important; /* Custom font size */
              // font-weight: 500 !important; /* Custom font weight */
            }

            td {
              font-size: 0.9rem !important;
              padding-top: 0.25rem !important;
            }
            h1 span {
              font-size: 1.5rem !important;
              padding-top: 0.25rem !important;
            }
          `}</style>
        </>
      ) : (
        <p className="text-red-400 text-sm font-italic">
          Either there was no result or you may have to choose another word or
          another dictionary.{" "}
        </p>
      )}
    </div>
  );
};

const dictionaries: {
  [key: string]: {
    short: string;
    name: string;
    url: string;
  };
} = {
  mw: {
    short: "Monier-Williams",
    name: "Monier-Williams Sanskrit-English Dictionary",
    url: "https://www.sanskrit-lexicon.uni-koeln.de/scans/MWScan",
  },
  apte: {
    short: "Apte",
    name: "Apte Practical Sanskrit-English Dictionary",
    url: "https://www.sanskrit-lexicon.uni-koeln.de/scans/AP90Scan",
  },
  vaca: {
    short: "Vācaspatyam",
    name: "Vācaspatyam",
    url: "https://www.sanskrit-lexicon.uni-koeln.de/scans/VCPScan",
  },
  shabda: {
    short: "Śabdakalpadrumaḥ",
    name: "Śabdakalpadrumaḥ",
    url: "https://www.sanskrit-lexicon.uni-koeln.de/scans/SKDScan",
  },
};

export default Dictionary;
