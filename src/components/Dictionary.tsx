"use client";
import React, { useState, useEffect } from "react";

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

const getWordEntriesFromHTML = (html: string): WordEntry[] => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  const wordEntries: WordEntry[] = [];

  const tableRows = doc.querySelectorAll("table.display tr");

  tableRows.forEach((row) => {
    const headword = row.querySelector(".sdata_italic_iast")?.textContent || "";
    const gender =
      row.querySelector(
        '[title="masculine gender"], [title="feminine"], [title="neuter gender"]'
      )?.textContent || "";
    const meaning = row.querySelector(".display")?.textContent || "";

    const lnum = row.querySelector(".lnum")?.textContent || "";
    const hrefdata = row.querySelector(".hrefdata")?.textContent || "";
    const source =
      row.querySelector(
        '[title="Ṛg-veda (Title)"], [title="Mahābhārata (Title)"], [title="Kāṭhaka-gṛhya-sūtra (Title)"], [title="Taittirīya-saṃhitā (Title)"], [title="Viṣṇu-smṛti, Viṣṇu-sūtra, Vaiṣṇava-dharma-śāstra (Title)"], [title="Taittirīya-āraṇyaka (Title)"], [title="Atharva-veda (Title)"], [title="Carakasaṃhitā  (Title)"], [title="Lexicographers, esp. such as Amarasiṃha, Halāyudha, Hemacandra, etc. (Author)"], [title="Kāvya literature (Literary category)"], [title="Bhāgavata-purāṇa (Title)"], [title="Varāha-mihira’s Bṛhat-saṃhitā (Title)"], [title="Viṣṇu-purāṇa (Title)"], [title="Catalogue(s) [Cologne Addition] (Title)"], [title="Hemādri’s Caturvarga-cintāmaṇi (Title)"], [title="Saṃgīta-sārasaṃgraha (Title)"], [title="Harivaṃśa (Title)"], [title="Kaṭha-upaniṣad (Title)"], [title="in the same place [Cologne Addition] (Title)"]'
      )?.textContent || "";
    const category = row.querySelector("h1, h1a, h1b")?.textContent || "";

    // if (
    //   headword &&
    //   gender &&
    //   meaning &&
    //   lnum &&
    //   hrefdata &&
    //   source &&
    //   category
    // ) {
    console.log("wordEntries: ", wordEntries);
    wordEntries.push({
      id: parseInt(lnum.split("=")[1]),
      headword,
      gender,
      meaning,
      lnum,
      hrefdata,
      source,
      category,
    });
  });
  return wordEntries;
};

const WordEntryTable: React.FC<{ wordEntries: WordEntry[] }> = ({
  wordEntries,
}) => {
  return (
    <div className="container mx-auto px-4 mt-8">
      {/* <table className="table-auto w-full text-left border-collapse">
        <thead>
          <tr>
            <th className="px-4 py-2 border-b font-bold">Headword</th>
            <th className="px-4 py-2 border-b font-bold">Gender</th>
            <th className="px-4 py-2 border-b font-bold">Meaning</th>
            <th className="px-4 py-2 border-b font-bold">Source</th>
            <th className="px-4 py-2 border-b font-bold">Category</th>
          </tr>
        </thead>
        <tbody>
          {wordEntries.map((entry) => (
            <tr key={entry.id} className="hover:bg-gray-100">
              <td className="px-4 py-2 border-b">{entry.headword}</td>
              <td className="px-4 py-2 border-b">{entry.gender}</td>
              <td className="px-4 py-2 border-b">{entry.meaning}</td>
              <td className="px-4 py-2 border-b">{entry.source}</td>
              <td className="px-4 py-2 border-b">{entry.category}</td>
            </tr>
          ))}
        </tbody>
      </table> */}
      <div>
        {wordEntries.map((entry) => (
          <p key={entry.id} className="hover:bg-gray-100">
            <span className="px-4 py-2 border-b">{entry.headword}</span>
            <span className="px-4 py-2 border-b">{entry.gender}</span>
            <span className="px-4 py-2 border-b">{entry.meaning}</span>
            <span className="px-4 py-2 border-b">{entry.source}</span>
            <span className="px-4 py-2 border-b">{entry.category}</span>
          </p>
        ))}
      </div>
    </div>
  );
};

const Dictionary: React.FC = () => {
  const [word, setWord] = useState("");
  const [filter, setFilter] = useState("roman");
  const [transLit, setTransLit] = useState("slp1");
  const [accent, setAccent] = useState("no");
  const [wordEntries, setWordEntries] = useState<WordEntry[]>([]);

  console.log(wordEntries);

  const getWord = async () => {
    if (word.length < 1) {
      alert("Please specify a citation.");
      return;
    }

    const url = `https://www.sanskrit-lexicon.uni-koeln.de/scans/MWScan/2020/web/webtc/getword.php?key=${encodeURIComponent(
      word
    )}&filter=${encodeURIComponent(filter)}&accent=${encodeURIComponent(
      accent
    )}&transLit=${encodeURIComponent(transLit)}`;

    try {
      const response = await fetch(url);
      const html = await response.text();

      const newWordEntries = getWordEntriesFromHTML(html);
      setWordEntries(newWordEntries);
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Error: Could not retrieve data from the server.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h1 className="text-2xl font-bold mb-4">Sanskrit Lexicon Search</h1>
        <div className="mb-4">
          <label
            htmlFor="key"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Citation:
          </label>
          <input
            type="text"
            id="key"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={word}
            onChange={(e) => setWord(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                getWord();
              }
            }}
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="filter"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Filter:
          </label>
          <select
            id="filter"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="roman">Roman</option>
            <option value="iast">IAST</option>
          </select>
        </div>
        <div className="mb-4">
          <label
            htmlFor="transLit"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Transliteration:
          </label>
          <select
            id="transLit"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={transLit}
            onChange={(e) => setTransLit(e.target.value)}
          >
            <option value="slp1">SLP1</option>
            <option value="hk">HK</option>
            <option value="wx">WX</option>
            <option value="itrans">ITrans</option>
          </select>
        </div>
        <div className="mb-4">
          <label
            htmlFor="accent"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Accent:
          </label>
          <select
            id="accent"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={accent}
            onChange={(e) => setAccent(e.target.value)}
          >
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>
        </div>
        <button
          onClick={getWord}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Search
        </button>
      </div>
      {wordEntries.length > 0 && <WordEntryTable wordEntries={wordEntries} />}
    </div>
  );
};

export default Dictionary;
