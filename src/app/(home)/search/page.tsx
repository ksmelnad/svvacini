"use client";

import React, { useEffect, useRef, useState } from "react";
import Sanscript from "@/utils/sanscript";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import dynamic from "next/dynamic";

import {
  Select,
  SelectGroup,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectLabel,
} from "@/components/ui/select";
import Link from "next/link";

interface Docs {
  id: string;
  book_title: string;
  book_id: string;
  line: string;
  // word_id: string;
  _version_: number;
}

const IndicTransliterate = dynamic(
  () =>
    import("@ai4bharat/indic-transliterate").then(
      (mod) => mod.IndicTransliterate
    ),
  { ssr: false }
);

function Search() {
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [docs, setDocs] = useState<Docs[]>([]);
  const [docSet, setDocSet] = useState(new Set<string>());
  const [selectedText, setSelectedText] = useState("सर्वम्");
  const [filteredDocs, setFilteredDocs] = useState<Docs[]>([]);
  const [sortedDocs, setSortedDocs] = useState<Docs[]>([]);
  const [sort, setSort] = useState("order");
  const [isSarvam, setIsSarvam] = useState(true);
  const [numFound, setNumFound] = useState(0);
  const [queryString, setQueryString] = useState("");
  const [selection, setSelection] = useState("All");
  const [checkboxesEnabled, setCheckboxesEnabled] = useState(false);

  const [texts, setTexts] = useState<string[] | null>([]);
  const [isAiBharat, setIsAiBharat] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [script, setScript] = useState("itrans");
  const [outputScript, setOutputScript] = useState("devanagari");

  const [checkboxes, setCheckboxes] = useState({
    ब्रह्मसूत्राणि: false,
    शारीरकभाष्यम्: false,
    दीपिका: false,
    तर्कसङ्ग्रहः: false,
    शतश्लोकी: false,
    विवेकचूडामणिः: false,
    वेदान्तसारः: false,
    रघुवंशम्: false,
    आर्यभटीयम्: false,
    लीलावतीगणितम्: false,
    सूर्यसिद्धान्तः: false,
    खण्डखाद्यकम्: false,
    योगसूत्रम्: false,
    मेघदूतम्: false,
    ईशावास्योपनिषद्: false,
  });

  // const transliterateRef = useRef({} );

  // useEffect(() => {
  //   if (transliterateRef.current) {
  //     transliterateRef.current = queryString;
  //   }
  // }, [queryString]);

  // if (isAiBharat) {
  //   document.querySelector(
  //     ".page_searchinput___6px7"
  //   ).parentNode.style.minWidth = "80vw";
  // }

  // const { data, error, isLoading } = useSWR(
  //   { url: "/api/solr", queryString, texts },
  //   fetcher
  // );

  const scripts: {
    [key: string]: string;
  } = {
    itrans: "ITRANS",
    devanagari: "Devanagari",
    iast: "IAST",
    hk: "Harvard-Kyoto",
    slp1: "SLP1",
    velthuis: "Velthuis",
    wx: "WX",
    kannada: "Kannada",
    malayalam: "Malayalam",
    tamil: "Tamil",
    telugu: "Telugu",
    bengali: "Bengali",
    gurmukhi: "Gurmukhi",
    gujarati: "Gujarati",
    oriya: "Oriya",
  };

  function handleSelectionChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;

    setSelection(value);
    if (value === "Select") {
      setCheckboxesEnabled(true);
    } else {
      setCheckboxesEnabled(false);
    }
  }

  function handleCheckboxChange(event: React.ChangeEvent<HTMLInputElement>) {
    const name = event.target.name;
    const isChecked = event.target.checked;
    setCheckboxes({ ...checkboxes, [name]: isChecked });
  }

  useEffect(() => {
    let texts: string[] = [];
    Object.entries(checkboxes).map(([key, value]) => {
      if (value) {
        texts.push(key);
      }
    });
    setTexts(texts);

    if (selection === "All") {
      let allTexts: string[] = [];
      Object.entries(checkboxes).map(([key, value]) => {
        allTexts.push(key);
      });
      setTexts(allTexts);
    }
  }, [checkboxes, selection]);

  const onSubmitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsFirstLoad(false);
    setSelectedText("सर्वम्");

    if (queryString.trim() === "") {
      alert("Query cannot be empty");

      return;
    }

    if (selection === "Select") {
      if (texts?.length === 0) {
        alert("Please select at least one text");
        return;
      }
    }

    // setIsLoading(true);
    setIsError(false);
    setIsLoading(true);
    docSet.clear();

    try {
      const res = await fetch("/api/solr-direct", {
        method: "POST",
        body: JSON.stringify({
          queryString,
          texts,
        }),
      });

      // console.log("Res", res);

      if (!res.ok) {
        console.log("Error fetching data from Solr");
        setIsLoading(false);
        throw new Error("Error fetching data from Solr");
      }

      const data = await res.json();
      // console.log("Res data", data);

      try {
        const { response } = data;
        const { docs } = response;
        // console.log("Response docs: ", response);

        setNumFound(response.numFound);

        docs.map((doc: any) => {
          if (!docSet.has(doc.book_title[0])) {
            docSet.add("सर्वम्");
            docSet.add(doc.book_title[0]);
            setDocSet(docSet);
          }
        });

        //Temp fix ???

        // docs.map((doc: any) => {
        //   if (!docSet.has(doc.book_title[0])) {
        //     docSet.add("सर्वम्");
        //     docSet.add(doc.book_title[0]);
        //     setDocSet(docSet);
        //   }
        // });

        // const transformedDocs = docs.map((doc: any) => ({
        //   name_id: doc.book_id,
        //   name: doc.book_title,
        //   word: doc.line,
        //   word_id: doc.line_id,
        //   id: doc.id,
        //   _version_: doc._version_,
        // }));

        // setDocs(transformedDocs);

        setDocs(docs);
        setIsSarvam(true);
        // setFilteredDocs(transformedDocs);
        setFilteredDocs(docs);
        setIsLoading(false);
      } catch (error) {
        console.log("Error logging docs", error);
      }
    } catch (error) {
      console.log("Error message:", error);
      setIsError(true);
    }
  };

  useEffect(() => {
    const handleSortedDocs = () => {
      if (isSarvam) {
        setSort("relevance");
        setSortedDocs(filteredDocs);
        // console.log("Sorted Docs", filteredDocs);
        return;
      }
      // if (sort === "order") {
      //   const sortingDocs = [...filteredDocs].sort((a, b) => {
      //     const refA = Number(refNumber(a.word_id[0])[1]);
      //     const refB = Number(refNumber(b.word_id[0])[1]);
      //     return refA - refB;
      //   });
      //   setSortedDocs(filteredDocs); // ??? Temp
      //   return;
      // }
      if (sort === "relevance") {
        setSortedDocs(filteredDocs);
        return;
      }
    };
    handleSortedDocs();
  }, [sort, isSarvam, filteredDocs]);

  useEffect(() => {
    const handleFilterDocs = () => {
      setSort("order");
      if (selectedText === "सर्वम्") {
        setIsSarvam(true);
        setFilteredDocs(docs);
        return;
      }
      setIsSarvam(false);

      setFilteredDocs(
        docs.filter((docItem) => docItem.book_title[0] === selectedText)
      );
    };
    handleFilterDocs();
  }, [selectedText, docs]);

  const refNumber = (word_id: string) => {
    // console.log(word_id);
    if (word_id.includes("SC1")) {
      const regex = /SC1:(\d+)/;
      const match = word_id.match(regex);
      const number = match?.[1];
      const regexCID = /\_CID:(\d+)/;
      const matchCID = word_id.match(regexCID);
      const numberCID = matchCID?.[1];

      return [number, numberCID];
    } else {
      return [0, 0];
    }
  };

  function highlightText(text: string) {
    const transliteratedQueryString = Sanscript.t(
      queryString,
      "devanagari",
      outputScript
    );
    const words = transliteratedQueryString.split(/\s+/);

    if (transliteratedQueryString.trim() === "") {
      return text;
    }

    const transliteratedText = Sanscript.t(text, "devanagari", outputScript);

    const regex = new RegExp(words.join("|"), "gi");
    const highlighted = transliteratedText.replace(
      regex,
      (match) => `<span style="background-color: yellow">${match}</span>`
    );
    return <div dangerouslySetInnerHTML={{ __html: highlighted }} />;
  }

  const handleSanskriptChange = (value: string): void => {
    const output = Sanscript.t(value, script, "devanagari");
    setQueryString(output);
  };

  const printDocs = () => {
    return (
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        {Array.from(docSet).map((doc, index) => {
          return (
            <button
              key={index}
              className={`cursor-pointer rounded border-0 px-3 py-1 text-sm
              ${
                (isSarvam && doc === "सर्वम्") ||
                (!isSarvam && doc === selectedText)
                  ? "bg-gray-900 text-white"
                  : "bg-gray-300 text-gray-900"
              }
              `}
              onClick={() => setSelectedText(doc)}
            >
              {doc}
            </button>
          );
        })}
      </div>
    );
  };

  const printResults = () => {
    if (isError) {
      return (
        <div>
          <p className="max-w-5xl mx-auto p-4">
            Error occured while searching. Please check the query.
          </p>
        </div>
      );
    }
    if (isLoading) {
      return (
        <div>
          <p className="max-w-5xl mx-auto animate-pulse p-4">Loading...</p>
        </div>
      );
    }
    if (docs.length === 0 && isFirstLoad === false) {
      return (
        <p className="max-w-5xl mx-auto p-4 text-red-700">फलितांशः नास्ति ! </p>
      );
    } else {
      return (
        <>
          <div className="max-w-5xl mx-auto flex flex-col gap-4 py-4">
            {docs.length !== 0 && printDocs()}
            {docs.length !== 0 && (
              <div className="flex justify-between items-center px-4">
                <p className="text-green-500 py-2">
                  फलितांशः (Result) : {filteredDocs.length}
                </p>
                <div className="flex gap-4">
                  {!isSarvam && (
                    <div className="flex justify-end gap-4 items-center">
                      <Label htmlFor="select-order">Sort by</Label>
                      <Select onValueChange={(e) => setSort(e)} value={sort}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent id="select-order">
                          <SelectGroup>
                            <SelectLabel>Sort</SelectLabel>
                            <SelectItem value="order">Order</SelectItem>
                            <SelectItem value="relevance">Relevance</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <Select
                    onValueChange={(e) => setOutputScript(e)}
                    value={outputScript}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Choose Script" />
                    </SelectTrigger>
                    <SelectContent id="select-order">
                      <SelectGroup>
                        <SelectLabel>Output Script</SelectLabel>
                        {Object.keys(scripts).map((key) => (
                          <SelectItem key={key} value={key}>
                            {scripts[key]}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            <div>
              {sortedDocs.map((doc, index) => (
                <div
                  key={doc.id}
                  className="mb-4 flex flex-col gap-4 border px-4 py-2"
                >
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <span style={{ color: "#a70e0e" }}>
                      {" "}
                      {doc.book_title[0]}{" "}
                      {/* {refNumber(doc.word_id[0])[0] +
                        "." +
                        refNumber(doc.word_id[0])[1]} */}
                    </span>

                    <Link
                      // target="_blank"
                      href={`/audiobooks/${doc.book_id}?lineId=${doc.id}#${doc.id}`}
                      style={{ color: "blue" }}
                    >
                      अग्रे पठन्तु ...
                    </Link>
                  </div>
                  <div>{highlightText(doc.line)}</div>
                </div>
              ))}
            </div>
          </div>
        </>
      );
    }
  };

  return (
    <div className="p-4">
      <div className="max-w-5xl mx-auto ">
        <div className="max-w-5xl mx-auto flex items-center justify-between py-2">
          {/* <div>
          <h1 style={{ color: "#a70e0e" }}>संस्कृतवाङ्मयान्वेषणम्</h1>
        </div> */}
        </div>
        <div className="border bg-[#efe7d6] p-4 rounded">
          <div className="flex gap-4 items-center">
            {/* <p>{isAiBharat ? "Indic Transliteration" : "Transliteration"}</p> */}
            <p>Indic Transliteration</p>
            <Switch checked={isAiBharat} onCheckedChange={setIsAiBharat} />

            {/* <button
            style={{
              backgroundColor: isAiBharat ? "#48bb78" : "#f56565",
              borderColor: isAiBharat ? "#48bb78" : "#f56565",
            }}
            onClick={() => setIsAiBharat(!isAiBharat)}
          >
            {isAiBharat ? `On` : `Off`}
          </button> */}
          </div>
          <form onSubmit={onSubmitHandler} className="flex flex-col gap-2">
            {isAiBharat ? (
              <div className="py-4">
                <IndicTransliterate
                  // className={styles.searchinput}
                  renderComponent={(props) => <Input {...props} />}
                  // className="my-4"
                  value={queryString}
                  placeholder="पृच्छा (Query)"
                  onChangeText={(text) => {
                    setQueryString(text);
                  }}
                  lang="sa"
                />
              </div>
            ) : (
              <div className="py-4 grid grid-cols-1 gap-2 md:grid-cols-4">
                <div className="md:col-span-3 ">
                  {/* <Label htmlFor="input-query">Query</Label> */}
                  <Input
                    type="text"
                    // className="my-4"
                    id="input-query"
                    placeholder="पृच्छा (Query)"
                    onChange={(e) => handleSanskriptChange(e.target.value)}
                  />

                  {queryString && (
                    <div className="my-2 rounded bg-gray-50 px-3 py-2 text-lg">
                      {queryString}
                    </div>
                  )}
                </div>
                <div className="md:col-span-1">
                  <div className="">
                    {/* <Label htmlFor="select-script">Transiteration</Label> */}

                    <Select onValueChange={(e) => setScript(e)} value={script}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Choose script" />
                      </SelectTrigger>
                      <SelectContent id="select-script">
                        <SelectGroup>
                          <SelectLabel>Script</SelectLabel>
                          {Object.keys(scripts).map((key) => (
                            <SelectItem key={key} value={key}>
                              {scripts[key]}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            <div className="py-2">
              <div className="flex gap-4">
                <label>
                  <input
                    type="radio"
                    className="form-radio 
                  rounded-full
                  border-transparent
                bg-gray-200
                text-gray-700 focus:border-transparent
                focus:bg-gray-200
                focus:ring-1 focus:ring-gray-500 focus:ring-offset-2"
                    name="selection"
                    value="All"
                    checked={selection === "All"}
                    onChange={handleSelectionChange}
                  />
                  <span className="px-2">सर्वत्र</span>
                </label>
                <label>
                  <input
                    type="radio"
                    className="form-radio
                rounded-full
                          border-transparent
                          bg-gray-200
                          text-gray-700 focus:border-transparent
                          focus:bg-gray-200
                          focus:ring-1 focus:ring-gray-500 focus:ring-offset-2
                "
                    name="selection"
                    value="Select"
                    checked={selection === "Select"}
                    onChange={handleSelectionChange}
                  />
                  <span className="px-2">ग्रन्थचयनम्</span>
                </label>
              </div>
              {checkboxesEnabled && (
                <div className="flex flex-wrap gap-4 pt-2">
                  {Object.entries(checkboxes).map(([key, value]) => (
                    <label key={key}>
                      <input
                        type="checkbox"
                        className="form-checkbox
                          rounded-sm
                          border-transparent
                          bg-gray-200
                          text-gray-700 focus:border-transparent
                          focus:bg-gray-200
                          focus:ring-1 focus:ring-gray-500 focus:ring-offset-2
                        "
                        name={key}
                        checked={value}
                        onChange={handleCheckboxChange}
                      />
                      <span className="px-2">{key}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <Button type="submit" disabled={!queryString} className="max-w-fit">
              Search
            </Button>
          </form>
        </div>
      </div>

      {docs && printResults()}
    </div>
  );
}

export default Search;
