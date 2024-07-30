// pages/api/solr.ts
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const solrUrl = process.env.SOLR_URL;

  try {
    const { queryString, texts } = await request.json();

    // Encode the Devanagari query string for URL safety
    const encodedQueryString = encodeURIComponent(queryString);

    const response = await fetch(
      `${solrUrl}select?q.op=OR&df=line&q=${encodedQueryString}&fq=book_title:${texts}`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    // console.log(data);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ errorMessage: error });
  }
}
